#!/usr/bin/env bash
#
# Sync the repository's issue labels to the set in .claude/workflow-kit.json.
#
#   sync-labels.sh            # create or update the labels the kit uses
#   sync-labels.sh --prune    # also delete GitHub's defaults
#
# The label set is deliberately small: two axes that describe the work, and
# nothing that duplicates a place GitHub already has.
#
#   area/*  maps the issue onto the codebase, which is what routes it. It is a
#           label rather than a field because one task legitimately touches two
#           areas, and every field GitHub offers here is single-valued.
#   risk/*  decides whether a person designs it before an agent writes it.
#
# Everything else already has a home. The kind of work is the **native issue
# type** (`Task`, `Bug`, `Feature`) — a `type/*` label would only duplicate it.
# Status and iteration are project fields. Blocking is a native issue
# dependency.

set -euo pipefail

WK_SCRIPT_NAME=sync-labels.sh
# shellcheck source=lib/config.sh
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/config.sh"

wk_require gh jq

REPO=$(wk_repo)

AREA_COLOUR=c5def5
RISK_COLOURS_low=c2e0c6
RISK_COLOURS_medium=fbca04
RISK_COLOURS_high=b60205

risk_colour() {
  case "$1" in
    *low) echo "$RISK_COLOURS_low" ;;
    *medium) echo "$RISK_COLOURS_medium" ;;
    *high) echo "$RISK_COLOURS_high" ;;
    *) echo d4c5f9 ;;
  esac
}

create() {
  local name="$1" colour="$2" description="$3"
  gh label create "$name" \
    --repo "$REPO" \
    --color "$colour" \
    --description "$description" \
    --force >/dev/null
  echo "  ok  $name"
}

while IFS=$'\t' read -r name description; do
  [ -n "$name" ] || continue
  create "$name" "$AREA_COLOUR" "$description"
done < <(wk_get_opt '.labels.areas[]? | [.name, (.description // "")] | @tsv')

while IFS=$'\t' read -r name description; do
  [ -n "$name" ] || continue
  create "$name" "$(risk_colour "$name")" "$description"
done < <(wk_get_opt '.labels.risk[]? | [.name, (.description // "")] | @tsv')

while IFS=$'\t' read -r name colour description; do
  [ -n "$name" ] || continue
  create "$name" "${colour:-8a63d2}" "$description"
done < <(wk_get_opt '.labels.other[]? | [.name, (.color // ""), (.description // "")] | @tsv')

if [ "${1:-}" = "--prune" ]; then
  echo
  echo "Pruning GitHub's defaults:"
  # Deleting a label silently strips it from every issue that carries it, so
  # this is opt-in and listed explicitly rather than computed as a set
  # difference — a typo in the configuration must not delete a real label.
  for stale in bug documentation duplicate enhancement "good first issue" \
    "help wanted" invalid question wontfix; do
    if gh label delete "$stale" --repo "$REPO" --yes 2>/dev/null; then
      echo "  rm  $stale"
    fi
  done
fi
