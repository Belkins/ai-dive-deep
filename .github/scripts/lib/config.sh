#!/usr/bin/env bash
#
# The one place the kit's scripts read their configuration from.
#
# Everything repository-specific — the repository name, the board, the review
# routing table, the verification commands — lives in `.claude/workflow-kit.json`
# at the top of the working tree. Nothing in this kit hardcodes a path, an owner
# or a port, so a script that needs one of those asks here.
#
# Source it, do not run it:
#
#   . "$(dirname "${BASH_SOURCE[0]}")/lib/config.sh"
#   repo=$(wk_get '.repo')
#
# Every function dies with a message naming what to fix rather than returning an
# empty string, because an empty repository name reaches `gh` as a request
# against somebody else's repository.

set -euo pipefail

WK_CONFIG_REL=".claude/workflow-kit.json"

# Almost every reader below is called as `x=$(wk_get …)`, which runs in a
# subshell — so a bare `exit 1` in wk_die would end the subshell and leave the
# caller carrying on with an empty value. The symptom is a cascade: one real
# error followed by two invented ones about whatever the empty value broke next.
# Signal the top-level shell instead, and trap the signal so it exits quietly
# with 1 rather than printing "Terminated".
WK_TOP_PID=$$
trap 'exit 1' TERM

wk_die() {
  echo "${WK_SCRIPT_NAME:-workflow-kit}: $*" >&2
  kill -s TERM "$WK_TOP_PID" 2>/dev/null || true
  exit 1
}

wk_warn() {
  echo "${WK_SCRIPT_NAME:-workflow-kit}: $*" >&2
}

wk_require() {
  local tool
  for tool in "$@"; do
    command -v "$tool" >/dev/null 2>&1 || wk_die "$tool is not installed, and this script needs it"
  done
}

# The top of the working tree, which is where the configuration lives. A
# worktree and a clone both answer this correctly; a directory outside a
# repository does not, and says so.
wk_root() {
  git rev-parse --show-toplevel 2>/dev/null ||
    wk_die "not inside a git repository"
}

wk_config_path() {
  local root
  root=$(wk_root)
  echo "$root/$WK_CONFIG_REL"
}

wk_config_exists() {
  [ -f "$(wk_config_path)" ]
}

# Read one value with a jq filter. `wk_get '.repo'`, `wk_get '.board.number' 1`.
#
# A missing key with no default is an error rather than an empty line: the
# callers pass these straight to `gh`, and the failure mode of an empty owner is
# a confusing 404 several steps later.
#
# **Never `// empty`.** In jq that alternative fires on `false` as well as on
# null, so `"enabled": false` would read as absent and take the default `true` —
# a switch that reads as set to the opposite of what it says. Missing is `null`
# here, and nothing else is.
wk_get() {
  local filter="$1" fallback="${2-}" path value
  path=$(wk_config_path)
  [ -f "$path" ] ||
    wk_die "no $WK_CONFIG_REL in this repository — run /workflow-setup to write one"
  value=$(jq -r "$filter" "$path") ||
    wk_die "$WK_CONFIG_REL is not valid JSON, or $filter is not a valid filter for it"
  if [ -z "$value" ] || [ "$value" = "null" ]; then
    if [ "$#" -ge 2 ]; then
      printf '%s\n' "$fallback"
      return 0
    fi
    wk_die "$WK_CONFIG_REL has nothing at $filter"
  fi
  printf '%s\n' "$value"
}

# The same read, but an absent key is an empty result rather than an error. For
# the keys that are legitimately absent — an optional contracts package, an
# empty list of read-only paths — and for the ones that are legitimately
# `false`, which this returns as the string `false` for the caller to test.
wk_get_opt() {
  local path
  path=$(wk_config_path)
  [ -f "$path" ] || return 0
  jq -r "${1}" "$path" 2>/dev/null | grep -v '^null$' || true
}

# `OWNER/REPO`, checked for the shape the whole kit assumes.
wk_repo() {
  local repo
  repo=${WK_REPO:-$(wk_get '.repo')}
  # Empty here means the read above already died and reported why. This
  # function runs one subshell deeper than that death, so it gets to keep
  # running for a moment; a second message from it would describe the empty
  # value rather than the missing file, and read as a second, invented fault.
  [ -n "$repo" ] || exit 1
  case "$repo" in
    */*) ;;
    *) wk_die "repo in $WK_CONFIG_REL is '$repo'; it has to be OWNER/REPO" ;;
  esac
  [ "$repo" != "OWNER/REPO" ] ||
    wk_die "repo in $WK_CONFIG_REL is still the placeholder — run /workflow-setup"
  printf '%s\n' "$repo"
}

wk_main_branch() {
  wk_get '.mainBranch' main
}

# `origin/main` unless the configuration says otherwise. This is the base every
# diff in the kit is taken against.
wk_base() {
  local base
  base=$(wk_get_opt '.review.base')
  [ -n "$base" ] || base="origin/$(wk_main_branch)"
  printf '%s\n' "$base"
}
