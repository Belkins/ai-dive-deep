#!/usr/bin/env bash
#
# Create the GitHub Project the kit expects, or shape an existing one, and
# write its number into .claude/workflow-kit.json.
#
#   board-bootstrap.sh                 create a project named after the repo
#   board-bootstrap.sh --title <name>  create it with this title
#   board-bootstrap.sh --number <n>    use an existing project instead
#   board-bootstrap.sh --dry-run       print what would be done; write nothing
#
# Why this exists: a fresh project ships a `Status` field with three options
# (Todo / In Progress / Done) and the kit's flow needs seven, plus a `Priority`
# single-select. `gh project field-create` cannot touch the built-in Status
# field, so the seven options go in through one GraphQL mutation — the step
# /workflow-setup used to hand to a person and a browser tab. Everything it
# writes is read back before it is reported, so a write that did not take is
# visible rather than assumed.
#
# It needs the `project` OAuth scope, once per machine: gh auth refresh -s project
# It refuses to run without it rather than printing an empty board.
#
# It does not create an Iteration field: `gh project field-create` has no
# iteration type. Add one in the UI if you schedule by iteration; nothing in
# the kit needs it until `board.sh set <n> Iteration <title>` is called.

set -euo pipefail

WK_SCRIPT_NAME=board-bootstrap.sh
# shellcheck source=lib/config.sh
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/config.sh"

wk_require gh jq

die() { wk_die "$@"; }
warn() { wk_warn "$@"; }

REPO=$(wk_repo)
OWNER=$(wk_get '.board.owner')
CONFIG=$(wk_config_path)

TITLE=""
NUMBER=""
DRY_RUN=0
while [ $# -gt 0 ]; do
  case "$1" in
    --title) TITLE="${2:?--title needs a value}"; shift 2 ;;
    --number) NUMBER="${2:?--number needs a value}"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h | --help) awk 'NR == 1 { next } /^#/ { sub(/^# ?/, ""); print; next } { exit }' "$0"; exit 0 ;;
    *) die "unknown argument '$1' — see --help" ;;
  esac
done
[ -n "$TITLE" ] || TITLE="${REPO#*/}"

# --- the scope gate ---------------------------------------------------------

# `gh auth status` prints the token's scopes; a token without `project` fails
# every project read with a message about scopes, so check up front and say
# exactly what to run. `read:project` alone can list but not create or edit.
scopes=$(gh auth status 2>&1 | sed -n "s/.*Token scopes: //p" | head -1)
case "$scopes" in
  *"'project'"*) ;;
  *) die "the token's scopes are [$scopes]; the board needs 'project'." \
    "Run:  gh auth refresh -s project   (interactive, opens a browser) and re-run this." ;;
esac

# --- the seven statuses and four priorities, from the configuration ---------

status_field=$(wk_get '.board.statusField' Status)
priority_field=$(wk_get '.board.priority.field' Priority)

# The order the kit's flow moves through, which is the order the options are
# created in and the order the board's column view shows them.
# (while-read rather than mapfile: macOS ships bash 3.2, which has no mapfile.)
STATUSES=()
while IFS= read -r s; do [ -n "$s" ] && [ "$s" != null ] && STATUSES+=("$s"); done \
  < <(jq -r '.board.statuses | [.inbox, .refining, .ready, .inProgress, .inReview, .blocked, .done][]' "$CONFIG")
[ ${#STATUSES[@]} = 7 ] || die "board.statuses in $WK_CONFIG_REL does not name all seven statuses"
PRIORITIES=()
while IFS= read -r s; do [ -n "$s" ] && PRIORITIES+=("$s"); done < <(jq -r '.board.priority.values[]' "$CONFIG")
[ ${#PRIORITIES[@]} -ge 2 ] || die "board.priority.values in $WK_CONFIG_REL needs at least two values"

# GraphQL wants a colour per option. Cosmetic, but required by the input type.
STATUS_COLOURS=(GRAY GRAY GREEN BLUE PURPLE RED GRAY)

echo "==> repo $REPO, owner $OWNER, board '$TITLE'${NUMBER:+ (existing #$NUMBER)}"
echo "    $status_field: ${STATUSES[*]}"
echo "    $priority_field: ${PRIORITIES[*]}"
if [ "$DRY_RUN" = 1 ]; then
  echo "    --dry-run: nothing written"
  exit 0
fi

# --- create or find the project --------------------------------------------

if [ -z "$NUMBER" ]; then
  NUMBER=$(gh project create --owner "$OWNER" --title "$TITLE" --format json --jq '.number') ||
    die "gh project create failed; check board.owner ('$OWNER') and that the token carries 'project'"
  echo "==> created project #$NUMBER"
else
  gh project view "$NUMBER" --owner "$OWNER" --format json --jq '.title' >/dev/null ||
    die "no project #$NUMBER under $OWNER"
  echo "==> using project #$NUMBER"
fi

fields() {
  gh project field-list "$NUMBER" --owner "$OWNER" --limit 50 --format json
}

# --- Status: replace the built-in options with the seven ---------------------

status_id=$(fields | jq -r --arg f "$status_field" '.fields[] | select(.name == $f) | .id')
[ -n "$status_id" ] || die "project #$NUMBER has no '$status_field' field; rename it on the board or in $WK_CONFIG_REL"

# updateProjectV2Field replaces the whole option set, which is what we want on
# a new board and is a *rename* on an existing one: an option that disappears
# takes its value off every item that had it. Say so before doing it to a
# board that already has items.
item_count=$(gh project view "$NUMBER" --owner "$OWNER" --format json --jq '.items.totalCount // 0')
if [ "${item_count:-0}" -gt 0 ]; then
  existing=$(fields | jq -r --arg f "$status_field" '.fields[] | select(.name == $f) | [.options[].name] | join(", ")')
  warn "project #$NUMBER has $item_count item(s) and $status_field options [$existing];" \
    "replacing them with the kit's seven clears the status of any item on an option that goes away."
  read -r -p "    continue? [y/N] " yn
  [ "$yn" = y ] || [ "$yn" = Y ] || die "stopped; nothing changed on the board"
fi

opts=""
for i in "${!STATUSES[@]}"; do
  opts+="{name: \"${STATUSES[$i]}\", color: ${STATUS_COLOURS[$i]:-GRAY}, description: \"\"}, "
done
gh api graphql -f fieldId="$status_id" -f query="
  mutation(\$fieldId: ID!) {
    updateProjectV2Field(input: { fieldId: \$fieldId, singleSelectOptions: [ ${opts%, } ] }) {
      projectV2Field { ... on ProjectV2SingleSelectField { name } }
    }
  }" >/dev/null || die "could not set the $status_field options"

# --- Priority: create if missing ------------------------------------------

if [ -z "$(fields | jq -r --arg f "$priority_field" '.fields[] | select(.name == $f) | .id')" ]; then
  gh project field-create "$NUMBER" --owner "$OWNER" --name "$priority_field" \
    --data-type SINGLE_SELECT --single-select-options "$(IFS=,; echo "${PRIORITIES[*]}")" >/dev/null ||
    die "could not create the $priority_field field"
  echo "==> created $priority_field"
else
  echo "==> $priority_field already exists; leaving its options as they are"
fi

# --- read it all back -------------------------------------------------------

echo "==> fields on project #$NUMBER, read back:"
fields | jq -r '.fields[] | select(.name == "'"$status_field"'" or .name == "'"$priority_field"'")
  | "    \(.name): \([.options[].name] | join(" · "))"'

want=$(printf '%s\n' "${STATUSES[@]}")
have=$(fields | jq -r --arg f "$status_field" '.fields[] | select(.name == $f) | .options[].name')
[ "$want" = "$have" ] || die "the $status_field options read back differently from what was written; look at the board before going on"

# --- write the number into the configuration -------------------------------

tmp=$(mktemp)
jq --argjson n "$NUMBER" '.board.enabled = true | .board.number = $n' "$CONFIG" >"$tmp" && mv "$tmp" "$CONFIG"
echo "==> $WK_CONFIG_REL: board.enabled = true, board.number = $NUMBER"

# The issue forms carry `projects: ['<owner>/<number>']`, which is what puts a
# filed issue on the board without a second call. Set or add that line.
root=$(wk_root)
for form in "$root"/.github/ISSUE_TEMPLATE/*.yml; do
  [ -f "$form" ] || continue
  if grep -q '^projects:' "$form"; then
    sed -i.bak "s|^projects:.*|projects: ['$OWNER/$NUMBER']|" "$form" && rm -f "$form.bak"
  else
    # after the `description:` line, which every form has as its second line
    awk -v line="projects: ['$OWNER/$NUMBER']" 'NR == 2 && !done { print; print line; done = 1; next } { print }' "$form" >"$form.tmp" && mv "$form.tmp" "$form"
  fi
  echo "    $(basename "$form"): projects: ['$OWNER/$NUMBER']"
done

echo
echo "==> done. Try:  .github/scripts/board.sh ready"
echo "    An Iteration field is not created here (gh cannot); add it in the UI if you schedule by iteration."
