#!/usr/bin/env bash
#
# The project board and issue dependencies, from the command line.
#
#   board.sh add <issue>                     add an issue to the board
#   board.sh show <issue>                    board fields + what blocks it
#   board.sh set <issue> <field> <value>     set a board field
#   board.sh block <issue> --by <issue>      record that <issue> is blocked
#   board.sh unblock <issue> --by <issue>    remove that dependency
#   board.sh ready [--all]                   tasks that can actually be started
#   board.sh queue [--all]                   the whole board, grouped by status
#
# One board can serve many repositories: every configuration that names the
# same board.owner/board.number shares it. `ready` and `queue` then show this
# repository's items and say how many others they left out; `--all` shows the
# whole board with every item prefixed `owner/repo#n`.
#
# Why this exists: an agent reading an issue with `gh issue view` sees the body
# and the labels and nothing else. Status, priority, iteration and the blocking
# graph live on the board and in GitHub's dependency API, in two different
# shapes, behind two different scopes. This wraps both so that "what should I
# work on" is one command rather than a research project.
#
# `ready` is the important one: it is not "Status = Ready", it is "Status =
# Ready **and** every issue blocking it is closed". Planning ahead only works if
# the queue hides work that cannot start yet.
#
# Everything repository-specific is read from `.claude/workflow-kit.json`; see
# the kit's docs/configuration.md. Requires the `project` OAuth scope, once per
# machine: gh auth refresh -s project
#
# Environment:
#   BOARD_DEBUG=1     report what every GraphQL read cost, on stderr
#   BOARD_NO_CACHE=1  re-read the field definitions instead of the disk cache
#
# The GraphQL budget is 5,000 points an hour **per account, not per token**, and
# every agent session spends from the same one, so this script is written to be
# cheap rather than convenient: it reads one issue when it was asked about one
# issue, and it does not re-read definitions that change once a month.

set -euo pipefail

WK_SCRIPT_NAME=board.sh
# shellcheck source=lib/config.sh
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/config.sh"

wk_require gh jq

die() { wk_die "$@"; }

[ "$(wk_get '.board.enabled' true)" = "true" ] ||
  die "the board is disabled in .claude/workflow-kit.json; nothing here applies"

REPO=$(wk_repo)
OWNER=$(wk_get '.board.owner')
NUMBER=$(wk_get '.board.number')

# A project owned by an organization and one owned by a person are different
# GraphQL roots with the same shape underneath. Everything below reads this one
# token rather than branching twice per query.
case "$(wk_get '.board.ownerType' org)" in
  org | organization) OWNER_KIND=organization ;;
  user | person) OWNER_KIND=user ;;
  *) die "board.ownerType has to be 'org' or 'user'" ;;
esac

# Organization *issue fields* are a newer thing than project fields: they live
# on the issue, every project mirrors them as a column, and `gh project
# item-edit` refuses to write them. Most repositories have none, so the kit
# treats them as opt-in — list their names in board.issueFields and they are
# written through the issue instead of through the board.
ISSUE_FIELDS=$(wk_get_opt '.board.issueFields | join(" ")')

has_issue_fields() { [ -n "$ISSUE_FIELDS" ]; }

is_issue_field() {
  local name field
  name="$1"
  for field in $ISSUE_FIELDS; do
    [ "$field" != "$name" ] || return 0
  done
  return 1
}

# --- talking to GraphQL -----------------------------------------------------

# `gh api graphql` plus an account of what it cost. Measured against a board of
# a few hundred items, a page of the whole-board read costs 2 points and
# everything else costs 1, so the budget is really 5,000 *requests* an hour and
# the only lever is asking fewer times. Without this the first symptom of an
# exhausted budget is `gh` failing an hour later in the middle of something
# unrelated.
gql() {
  local label="$1"
  shift
  local body cost remaining reset

  # A read that fails has to stop the run rather than yield nothing. Most of
  # these are consumed by a `jq` that turns an empty body into an empty array,
  # so a token without the `project` scope would otherwise print an empty queue
  # — indistinguishable from a board with no ready work, and wrong in the
  # direction that wastes a person's afternoon.
  body=$(gh api graphql "$@") ||
    wk_die "the GraphQL read for $label failed. If it mentions a scope, the fix is" \
      "'gh auth refresh -s project'; if it mentions the owner, check board.owner" \
      "and board.ownerType in .claude/workflow-kit.json"
  printf '%s\n' "$body"

  # --paginate concatenates one response object per page, so the cost is summed
  # and the remaining budget is whatever the last page saw.
  IFS=$'\t' read -r cost remaining reset < <(jq -rs '[
      ([ .[].data.rateLimit.cost // empty ] | add // 0),
      ([ .[].data.rateLimit.remaining // empty ] | min // -1),
      ([ .[].data.rateLimit.resetAt // empty ] | last // "?")
    ] | @tsv' <<<"$body")

  [ -z "${BOARD_DEBUG:-}" ] ||
    echo "board.sh: $label cost $cost points, $remaining left, resets $reset" >&2
  if [ "$remaining" -ge 0 ] && [ "$remaining" -lt 500 ]; then
    echo "board.sh: only $remaining GraphQL points left until $reset —" \
      "the hourly budget is shared by every session on this account" >&2
  fi
}

# Both readers below end up holding the same two node lists — a project item's
# `fieldValues` and an issue's `issueFieldValues` — and flatten them into one
# {name: value} map, so the jq that does it is written once.
JQ_FIELDS='
  def project_fields:
    [ (. // [])[]
      | select(.field != null)
      | { key: .field.name,
          value: (.name // .text // .title // .date // (.number | tostring? // null)) }
      | select(.value != null) ];
  def issue_fields:
    [ (. // [])[]
      | select(.issueField != null)
      | { key: .issueField.name, value: .issueValue }
      | select(.value != null) ];
'

# The GraphQL for reading issue fields off an issue, or nothing at all when the
# repository has none. Splicing an empty string keeps one copy of every query
# rather than two that drift.
ISSUE_FIELD_VALUES_SELECTION=''
if has_issue_fields; then
  ISSUE_FIELD_VALUES_SELECTION='
    issueFieldValues(first: 10) {
      nodes {
        ... on IssueFieldSingleSelectValue {
          issueValue: name
          issueField: field { ... on IssueFieldSingleSelect { name } }
        }
        ... on IssueFieldDateValue {
          issueValue: value
          issueField: field { ... on IssueFieldDate { name } }
        }
      }
    }'
fi

# --- caching ----------------------------------------------------------------

# Field definitions and the project id change about once a month, but every
# invocation re-reads them and `set` alone reads the field list three times.
# Each read is a request against the hourly budget, so they are memoised on
# disk. Pass BOARD_NO_CACHE=1 right after editing the board's fields.
CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/workflow-kit-board"
CACHE_TTL_MIN=5

cached() {
  local key="$1"
  shift
  local file="$CACHE_DIR/$OWNER-$NUMBER-$key"
  if [ -z "${BOARD_NO_CACHE:-}" ] && [ -f "$file" ] &&
    [ -z "$(find "$file" -mmin "+$CACHE_TTL_MIN" 2>/dev/null)" ]; then
    cat "$file"
    return
  fi
  mkdir -p "$CACHE_DIR"
  if ! "$@" >"$file.$$"; then
    rm -f "$file.$$"
    return 1
  fi
  mv "$file.$$" "$file"
  cat "$file"
}

# --- project metadata -------------------------------------------------------

project_id() {
  cached project-id \
    gh project view "$NUMBER" --owner "$OWNER" --format json --jq '.id'
}

fields_json() {
  cached fields \
    gh project field-list "$NUMBER" --owner "$OWNER" --limit 50 --format json
}

issue_fields_json() {
  cached issue-fields gql "issue field definitions" -f owner="$OWNER" -f query='
    query($owner: String!) {
      rateLimit { cost remaining resetAt }
      organization(login: $owner) {
        issueFields(first: 30) {
          nodes {
            ... on IssueFieldSingleSelect { id name kind: __typename options { id name } }
            ... on IssueFieldDate        { id name kind: __typename }
            ... on IssueFieldText        { id name kind: __typename }
            ... on IssueFieldNumber      { id name kind: __typename }
          }
        }
      }
    }' | jq '.data.organization.issueFields.nodes'
}

issue_node_id() {
  gh api "repos/$REPO/issues/$1" --jq '.node_id'
}

set_issue_field() {
  local issue="$1" field="$2" value="$3"
  local defs fid kind
  defs=$(issue_fields_json)
  fid=$(jq -r --arg f "$field" '.[] | select(.name == $f) | .id' <<<"$defs")
  [ -n "$fid" ] || return 1
  kind=$(jq -r --arg f "$field" '.[] | select(.name == $f) | .kind' <<<"$defs")

  # Which key carries the value depends on the field's kind, and GraphQL has no
  # variable for "which input field" — so that one token is interpolated and
  # the rest goes through variables.
  local key literal
  case "$kind" in
    IssueFieldSingleSelect)
      key=singleSelectOptionId
      literal=$(jq -r --arg f "$field" --arg v "$value" \
        '.[] | select(.name == $f) | .options[] | select(.name == $v) | .id' <<<"$defs")
      [ -n "$literal" ] ||
        die "issue field '$field' has no option '$value' (if it was just added," \
          "the definitions are cached — retry with BOARD_NO_CACHE=1)"
      literal="\"$literal\""
      ;;
    IssueFieldNumber) key=numberValue && literal="$value" ;;
    IssueFieldDate) key=dateValue && literal="\"$value\"" ;;
    *) key=textValue && literal="\"$value\"" ;;
  esac

  gh api graphql -f issueId="$(issue_node_id "$issue")" -f fieldId="$fid" -f query="
    mutation(\$issueId: ID!, \$fieldId: ID!) {
      setIssueFieldValue(input: {
        issueId: \$issueId
        issueFields: [{ fieldId: \$fieldId, $key: $literal }]
      }) { clientMutationId }
    }" >/dev/null
}

# Every item on the board, flattened to
# {number, title, state, url, itemId, fields: {<field name>: <value>}}
#
# This is the expensive read — a request per hundred items, so it gets dearer
# every week the board grows. It is for the commands that genuinely need the
# whole board (`ready`, `queue`); to ask about one number, use item_json.
items_json() {
  gql "board items" --paginate -f owner="$OWNER" -F number="$NUMBER" -f query="
    query(\$owner: String!, \$number: Int!, \$endCursor: String) {
      rateLimit { cost remaining resetAt }
      $OWNER_KIND(login: \$owner) {
        projectV2(number: \$number) {
          items(first: 100, after: \$endCursor) {
            pageInfo { hasNextPage endCursor }
            nodes {
              id
              content {
                ... on Issue {
                  number title state url
                  repository { nameWithOwner }
                  $ISSUE_FIELD_VALUES_SELECTION
                }
                ... on PullRequest { number title state url repository { nameWithOwner } }
              }
              fieldValues(first: 20) {
                nodes {
                  __typename
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name field { ... on ProjectV2FieldCommon { name } }
                  }
                  ... on ProjectV2ItemFieldTextValue {
                    text field { ... on ProjectV2FieldCommon { name } }
                  }
                  ... on ProjectV2ItemFieldNumberValue {
                    number field { ... on ProjectV2FieldCommon { name } }
                  }
                  ... on ProjectV2ItemFieldDateValue {
                    date field { ... on ProjectV2FieldCommon { name } }
                  }
                  ... on ProjectV2ItemFieldIterationValue {
                    title field { ... on ProjectV2FieldCommon { name } }
                  }
                }
              }
            }
          }
        }
      }
    }" |
    jq -s "$JQ_FIELDS"'
      [ .[].data.'"$OWNER_KIND"'.projectV2.items.nodes[] ]
      | map(select(.content != null))
      | map({
          itemId: .id,
          number: .content.number,
          title:  .content.title,
          state:  .content.state,
          url:    .content.url,
          repo:   .content.repository.nameWithOwner,
          fields: ( (.fieldValues.nodes | project_fields)
                    + (.content.issueFieldValues.nodes | issue_fields)
                    | from_entries )
        })'
}

# One board row, in the same shape items_json produces. Answering "what is
# #81's status" by reading the whole board takes a request per page and gets
# slower as the board grows; asking about the one number takes exactly one and
# does not. Pull requests are on the board too, so this asks for either.
item_json() {
  local number="$1"
  gql "#$number" -f owner="${REPO%/*}" -f repo="${REPO#*/}" -F number="$number" -f query="
    query(\$owner: String!, \$repo: String!, \$number: Int!) {
      rateLimit { cost remaining resetAt }
      repository(owner: \$owner, name: \$repo) {
        issueOrPullRequest(number: \$number) {
          ... on Issue {
            number title state url
            $ISSUE_FIELD_VALUES_SELECTION
            projectItems(first: 10) { ...boardItems }
          }
          ... on PullRequest {
            number title state url
            projectItems(first: 10) { ...boardItems }
          }
        }
      }
    }

    fragment boardItems on ProjectV2ItemConnection {
      nodes {
        id
        project { number }
        fieldValues(first: 20) {
          nodes {
            __typename
            ... on ProjectV2ItemFieldSingleSelectValue {
              name field { ... on ProjectV2FieldCommon { name } }
            }
            ... on ProjectV2ItemFieldTextValue {
              text field { ... on ProjectV2FieldCommon { name } }
            }
            ... on ProjectV2ItemFieldNumberValue {
              number field { ... on ProjectV2FieldCommon { name } }
            }
            ... on ProjectV2ItemFieldDateValue {
              date field { ... on ProjectV2FieldCommon { name } }
            }
            ... on ProjectV2ItemFieldIterationValue {
              title field { ... on ProjectV2FieldCommon { name } }
            }
          }
        }
      }
    }" |
    jq --argjson project "$NUMBER" "$JQ_FIELDS"'
      .data.repository.issueOrPullRequest as $content
      # An issue can sit on several projects; only this board says anything
      # about status, and an issue on none of them still has issue fields.
      | ( [ ($content.projectItems.nodes // [])[]
            | select(.project.number == $project) ] | first ) as $item
      | { itemId: ($item.id // null),
          number: $content.number,
          title:  $content.title,
          state:  $content.state,
          url:    $content.url,
          fields: ( ($item.fieldValues.nodes | project_fields)
                    + ($content.issueFieldValues.nodes | issue_fields)
                    | from_entries ) }'
}

item_id_for() {
  item_json "$1" | jq -r '.itemId // empty'
}

# --- dependencies -----------------------------------------------------------

# GitHub's dependency API addresses issues by their database id, not by number.
issue_db_id() {
  gh api "repos/$REPO/issues/$1" --jq '.id'
}

# A repository whose plan or version does not have issue dependencies answers
# 404 here, and the kit treats that as "nothing blocks it" rather than failing:
# the rest of the queue is still worth printing. `board.sh show` says so.
#
# Both take `<repo> <issue>`: on a shared board the item being asked about may
# live in another repository than the one this configuration names.
blockers_of() {
  gh api "repos/$1/issues/$2/dependencies/blocked_by" \
    --jq '.[] | "\(.number)\t\(.state)\t\(.title)"' 2>/dev/null || true
}

blocking_of() {
  gh api "repos/$1/issues/$2/dependencies/blocking" \
    --jq '.[] | "\(.number)\t\(.state)\t\(.title)"' 2>/dev/null || true
}

# --- commands ---------------------------------------------------------------

cmd_add() {
  local issue="${1:?issue number}"
  local url
  url=$(gh issue view "$issue" --repo "$REPO" --json url --jq '.url')
  gh project item-add "$NUMBER" --owner "$OWNER" --url "$url" --format json --jq '.id'
}

cmd_set() {
  local issue="${1:?issue number}" field="${2:?field name}" value="${3:?value}"
  local pid fid ftype item

  # An organization issue field wins the name: writing it to the issue is what
  # makes it visible everywhere, including on this board.
  if is_issue_field "$field" && set_issue_field "$issue" "$field" "$value"; then
    echo "#$issue  $field = $value  (issue field)"
    return
  fi

  pid=$(project_id)
  fid=$(fields_json | jq -r --arg f "$field" '.fields[] | select(.name == $f) | .id')
  ftype=$(fields_json | jq -r --arg f "$field" '.fields[] | select(.name == $f) | .type')
  [ -n "$fid" ] ||
    die "no field named '$field' on project $NUMBER (if it was just added," \
      "the definitions are cached — retry with BOARD_NO_CACHE=1)"

  item=$(item_id_for "$issue")
  if [ -z "$item" ]; then
    item=$(cmd_add "$issue")
  fi

  case "$ftype" in
    ProjectV2SingleSelectField)
      local oid
      oid=$(fields_json |
        jq -r --arg f "$field" --arg v "$value" \
          '.fields[] | select(.name == $f) | .options[] | select(.name == $v) | .id')
      [ -n "$oid" ] ||
        die "field '$field' has no option '$value' (if it was just added," \
          "the definitions are cached — retry with BOARD_NO_CACHE=1)"
      gh project item-edit --project-id "$pid" --id "$item" --field-id "$fid" \
        --single-select-option-id "$oid" >/dev/null
      ;;
    ProjectV2IterationField)
      local iid
      iid=$(fields_json |
        jq -r --arg f "$field" --arg v "$value" \
          '.fields[] | select(.name == $f) | .configuration.iterations[]
           | select(.title == $v) | .id')
      [ -n "$iid" ] || die "field '$field' has no iteration '$value'"
      gh project item-edit --project-id "$pid" --id "$item" --field-id "$fid" \
        --iteration-id "$iid" >/dev/null
      ;;
    *)
      gh project item-edit --project-id "$pid" --id "$item" --field-id "$fid" \
        --text "$value" >/dev/null
      ;;
  esac
  echo "#$issue  $field = $value"
}

cmd_show() {
  local issue="${1:?issue number}"
  item_json "$issue" | jq -r '
    "#\(.number)  \(.title)",
    (.fields | to_entries[] | select(.key != "Title") | "  \(.key): \(.value)")'
  echo "  blocked by:"
  blockers_of "$REPO" "$issue" | sed 's/^/    /' | grep . || echo "    (nothing)"
  echo "  blocking:"
  blocking_of "$REPO" "$issue" | sed 's/^/    /' | grep . || echo "    (nothing)"
}

cmd_block() {
  local issue="${1:?issue number}"
  [ "${2:-}" = "--by" ] || die "usage: board.sh block <issue> --by <issue>"
  local blocker="${3:?blocker issue number}"
  gh api --method POST "repos/$REPO/issues/$issue/dependencies/blocked_by" \
    -F issue_id="$(issue_db_id "$blocker")" >/dev/null
  echo "#$issue is now blocked by #$blocker"
}

cmd_unblock() {
  local issue="${1:?issue number}"
  [ "${2:-}" = "--by" ] || die "usage: board.sh unblock <issue> --by <issue>"
  local blocker="${3:?blocker issue number}"
  gh api --method DELETE \
    "repos/$REPO/issues/$issue/dependencies/blocked_by/$(issue_db_id "$blocker")" >/dev/null
  echo "#$issue is no longer blocked by #$blocker"
}

# `ready` and `queue` read the whole board once. On a board shared by several
# repositories the default is this repository's items, with one line saying
# how many the filter hid; `--all` shows everything, prefixed `owner/repo#n` so
# two repositories' #12s cannot be confused. `.repo` is null for a draft item
# (no repository), which the default view treats as belonging here.
scope_flag() {
  case "${1:-}" in
    "") echo this ;;
    --all) echo all ;;
    *) die "usage: board.sh ${2:-ready|queue} [--all]" ;;
  esac
}

cmd_ready() {
  local scope status_field status_ready priority_field priority_order any=0 hidden
  scope=$(scope_flag "${1:-}" ready)
  status_field=$(wk_get '.board.statusField' Status)
  status_ready=$(wk_get '.board.statuses.ready' Ready)
  priority_field=$(wk_get '.board.priority.field' Priority)
  priority_order=$(wk_get_opt '.board.priority.values')
  [ -n "$priority_order" ] || priority_order='["Urgent","High","Medium","Low"]'

  local rows
  rows=$(items_json | jq -r --arg sf "$status_field" --arg ready "$status_ready" \
      --arg pf "$priority_field" --argjson order "$priority_order" --arg repo "$REPO" --arg scope "$scope" '
      def rank: (. // "") as $p | ($order | index($p) // 99);
      map(select(.state == "OPEN" and .fields[$sf] == $ready)) as $all
      | ($all | map(select($scope == "all" or (.repo // $repo) == $repo))) as $mine
      | (($all | length) - ($mine | length)) as $hidden
      | ($mine | sort_by(.fields[$pf] | rank)
          | .[] | [ (.repo // $repo), (.number|tostring), .title, (.fields[$pf] // "-") ] | @tsv),
        "HIDDEN\t\($hidden)"')
  hidden=$(awk -F'\t' '$1 == "HIDDEN" { print $2 }' <<<"$rows")

  while IFS=$'\t' read -r repo number title priority; do
    [ -n "$number" ] && [ "$repo" != HIDDEN ] || continue
    local open_blockers
    open_blockers=$(blockers_of "$repo" "$number" | awk -F'\t' '$2 == "open"' | wc -l | tr -d ' ')
    if [ "$open_blockers" = "0" ]; then
      if [ "$scope" = all ]; then
        printf '%s#%-5s %-8s %s\n' "$repo" "$number" "$priority" "$title"
      else
        printf '#%-5s %-8s %s\n' "$number" "$priority" "$title"
      fi
      any=1
    fi
  done <<<"$rows"
  [ "$any" = "1" ] ||
    echo "Nothing is ready: every $status_ready item is still blocked, or the queue is empty."
  [ "${hidden:-0}" = 0 ] ||
    echo "($hidden $status_ready item(s) in other repositories on this board — board.sh ready --all)"
}

cmd_queue() {
  local scope status_field priority_field priority_order
  scope=$(scope_flag "${1:-}" queue)
  status_field=$(wk_get '.board.statusField' Status)
  priority_field=$(wk_get '.board.priority.field' Priority)
  priority_order=$(wk_get_opt '.board.priority.values')
  [ -n "$priority_order" ] || priority_order='["Urgent","High","Medium","Low"]'

  items_json | jq -r --arg sf "$status_field" --arg pf "$priority_field" --argjson order "$priority_order" \
      --arg repo "$REPO" --arg scope "$scope" '
    def rank: (. // "") as $p | ($order | index($p) // 99);
    def tag: if $scope == "all" then "\(.repo // "draft")#\(.number // "-")" else "#\(.number // "draft")" end;
    map(select(.state == "OPEN")) as $all
    | ($all | map(select($scope == "all" or (.repo // $repo) == $repo))) as $mine
    | (($all | length) - ($mine | length)) as $hidden
    | ($mine
       | group_by(.fields[$sf] // "(no status)")
       | .[]
       | "\n== \(.[0].fields[$sf] // "(no status)") ==",
         (sort_by(.fields[$pf] | rank)[]
          | "  \(tag)  [\(.fields[$pf] // "-")] \(.title)")),
      (if $hidden > 0 then "\n(\($hidden) open item(s) in other repositories on this board — board.sh queue --all)" else empty end)'
}

case "${1:-}" in
  add) shift && cmd_add "$@" ;;
  show) shift && cmd_show "$@" ;;
  set) shift && cmd_set "$@" ;;
  block) shift && cmd_block "$@" ;;
  unblock) shift && cmd_unblock "$@" ;;
  ready) shift && cmd_ready "$@" ;;
  queue) shift && cmd_queue "$@" ;;
  *) awk 'NR == 1 { next } /^#/ { sub(/^# ?/, ""); print; next } { exit }' "$0" && exit 1 ;;
esac
