#!/usr/bin/env bash
#
# Which review agents a branch needs.
#
#   review.sh plan [--no-fetch]   the agents this branch wakes, one per line
#
# The routing half of the review fleet. `/review` and `/pick` run this and then
# spawn every agent it names in one message. Which agent wakes is arithmetic on
# a list of changed paths and one label, so it is a script a person can run and
# read rather than a judgement a model re-derives per branch. It is also what
# makes "why did the database reviewer not run" answerable in one command.
#
# The routing table is not in this file. It is `review.agents` in
# `.claude/workflow-kit.json`: one entry per agent, with the path globs that
# wake it. Editing the table is editing that file, and the agents themselves are
# read-only prompts that never change per repository.
#
# The agent names go to stdout, one per line with the reason it woke; the
# branch header and the agents that stayed asleep go to stderr. So a terminal
# shows all of it and `$(review.sh plan)` is just the plan.

set -euo pipefail

WK_SCRIPT_NAME=review.sh
# shellcheck source=lib/config.sh
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/config.sh"

wk_require git jq

die() { wk_die "$@"; }
warn() { wk_warn "$@"; }

REPO=$(wk_repo)
BASE=$(wk_base)
RISK_HIGH_LABEL=$(wk_get '.review.riskHighLabel' 'risk/high')

# The six the kit ships, in the order the plan prints them: cheapest and most
# mechanical last, because that is the order a reader wants to skim. An agent
# named in the configuration that is not one of these would be dispatched to
# nothing, and the only symptom would be silence.
KNOWN_AGENTS=(
  db-reviewer
  security-reviewer
  simplicity-reviewer
  test-quality-reviewer
  contract-reviewer
  scope-reviewer
)

usage() {
  awk 'NR == 1 { next } /^#/ { sub(/^# ?/, ""); print; next } { exit }' "$0"
}

is_known_agent() {
  local a
  for a in "${KNOWN_AGENTS[@]}"; do
    [ "$a" != "$1" ] || return 0
  done
  return 1
}

check_roster() {
  local configured
  configured=$(wk_get_opt '.review.agents | keys[]')
  local name
  for name in $configured; do
    is_known_agent "$name" ||
      warn "review.agents names '$name', which this kit does not ship; it would be dispatched to nothing"
  done
}

# The first changed path matching any of <agent>'s globs, or nothing.
#
# `[[ ... == pattern ]]` is the same matching `case` does, so a `*` crosses `/`
# and a glob written for a directory needs no `**`.
first_match() {
  local agent="$1" patterns file pattern
  patterns=$(wk_get_opt ".review.agents[\"$agent\"].paths[]?")
  [ -n "$patterns" ] || return 1
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    while IFS= read -r pattern; do
      [ -n "$pattern" ] || continue
      # shellcheck disable=SC2053 # the right-hand side is a glob on purpose
      if [[ "$file" == $pattern ]]; then
        printf '%s\n' "$file"
        return 0
      fi
    done <<<"$patterns"
  done <<<"$FILES"
  return 1
}

cmd_plan() {
  local fetch=1
  case "${1:-}" in
    "") ;;
    --no-fetch) fetch=0 ;;
    *) die "usage: review.sh plan [--no-fetch]" ;;
  esac

  # Against a stale base the merge base is stale too, and the diff grows every
  # unrelated file that landed on the main branch since. Say which of the two
  # happened rather than routing silently off the wrong base.
  if [ "$fetch" = 1 ]; then
    git fetch origin "$(wk_main_branch)" --quiet 2>/dev/null ||
      warn "could not fetch origin; $BASE may be stale"
  else
    warn "did not fetch; $BASE is whatever it was"
  fi
  git rev-parse --verify --quiet "$BASE" >/dev/null || die "no $BASE to compare against"

  check_roster

  local branch issue=""
  branch=$(git rev-parse --abbrev-ref HEAD)
  if [[ "$branch" =~ ^[a-z]+/([0-9]+)- ]]; then
    issue="${BASH_REMATCH[1]}"
  fi

  FILES=$(git diff --name-only --merge-base "$BASE")
  local count untracked
  count=$(grep -c . <<<"$FILES" || true)

  # An untracked file is in no diff, so the fleet cannot see it however new and
  # interesting it is. Commit before reviewing, which `/pick` asks for anyway.
  untracked=$(git ls-files --others --exclude-standard | grep -c . || true)
  [ "$untracked" = 0 ] ||
    warn "$untracked untracked file(s) are in no diff and no agent will see them; commit first"

  if [ "$count" = 0 ]; then
    warn "$branch has no changes against $BASE; there is nothing to review"
    return 0
  fi

  # The high-risk label wakes the security reviewer whatever the diff touches. A
  # branch with no issue number cannot be checked for it, which is one of the
  # two things that costs.
  local risk_high=0 labels=""
  if [ -n "$issue" ]; then
    if labels=$(gh issue view "$issue" --repo "$REPO" --json labels --jq '.labels[].name' 2>/dev/null); then
      if grep -qx "$RISK_HIGH_LABEL" <<<"$labels"; then
        risk_high=1
      fi
    else
      warn "could not read the labels of #$issue; routing as if it carried none"
    fi
  else
    warn "$branch carries no issue number: scope-reviewer needs one and $RISK_HIGH_LABEL cannot be checked"
  fi

  echo "==> $branch — ${issue:+issue #$issue, }$count file(s) changed against $BASE" >&2

  local woken=() asleep=() agent hit enabled always risk_wakes
  for agent in "${KNOWN_AGENTS[@]}"; do
    enabled=$(wk_get_opt ".review.agents[\"$agent\"].enabled")
    if [ "$enabled" = "false" ] || [ -z "$(wk_get_opt ".review.agents[\"$agent\"]")" ]; then
      asleep+=("$agent (off)")
      continue
    fi

    always=$(wk_get_opt ".review.agents[\"$agent\"].always")
    risk_wakes=$(wk_get_opt ".review.agents[\"$agent\"].wakesOnRiskHigh")

    if [ "$always" = "true" ]; then
      # An agent that wakes on every branch still needs the issue it compares
      # the diff against; without one it has no boundary and stays asleep.
      if [ "$agent" = "scope-reviewer" ] && [ -z "$issue" ]; then
        asleep+=("$agent")
        continue
      fi
      woken+=("$agent"$'\t'"always${issue:+, and this branch is on issue #$issue}")
      continue
    fi

    if [ "$risk_wakes" = "true" ] && [ "$risk_high" = 1 ]; then
      woken+=("$agent"$'\t'"issue #$issue carries $RISK_HIGH_LABEL, so it wakes whatever the diff touches")
      continue
    fi

    if hit=$(first_match "$agent"); then
      woken+=("$agent"$'\t'"$hit")
    else
      asleep+=("$agent")
    fi
  done

  if [ ${#woken[@]} -gt 0 ]; then
    printf '%s\n' "${woken[@]}" | awk -F'\t' '{ printf "%-22s %s\n", $1, $2 }'
  else
    warn "nothing wakes on this branch: no changed path routes anywhere and it is on no issue"
  fi

  if [ ${#asleep[@]} -gt 0 ]; then
    echo "    not woken: ${asleep[*]} — nothing on this branch matches what wakes them" >&2
  fi
}

case "${1:-}" in
  plan) shift && cmd_plan "$@" ;;
  *) usage && exit 1 ;;
esac
