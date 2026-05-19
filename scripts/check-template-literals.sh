#!/usr/bin/env bash
# check-template-literals.sh — catch the build-break pattern where
# template-literal delimiters were escaped: `export const X = \`...\``
# instead of `export const X = \`...\``. Esbuild fails on these with
# a cryptic "Syntax error" pointing into the file. We catch it pre-build.
#
# Pattern to flag: an = sign immediately followed by a backslash-backtick
# (the broken opener), or a backslash-backtick at line start / followed by ;
# (the broken closer). False-positive-safe: limited to ts/tsx/js/jsx files
# in src/lib/ — the only place these large template-literal exports live.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGETS=(src/lib)
FAIL=0

# Bad: an assignment-like line ending in "= \`" (escaped backtick opener)
# Bad: a stand-alone "\`;" or "\`," closer
# Pattern matches the literal backslash-backtick sequence.
for dir in "${TARGETS[@]}"; do
  while IFS= read -r f; do
    # Bad OPENER: a top-level `[export ]const <name> = \`` line — the assignment
    # uses an escaped backtick as the template-literal delimiter. Anchored to
    # start-of-line + the const/let/var-assignment shape so we never match
    # legitimate escaped backticks that live INSIDE existing template literals
    # (prose like `Run \`dig …\``).
    OPEN=$(grep -nE '^[[:space:]]*(export[[:space:]]+)?(const|let|var)[[:space:]]+[A-Za-z_][A-Za-z0-9_]*[[:space:]]*(:[^=]*)?=[[:space:]]*\\`' "$f" 2>/dev/null || true)
    # Bad CLOSER: a line consisting of only `\`;` or `\`,` (optional ws) —
    # the standalone delimiter that ends a broken multi-line literal. Inline
    # `\`;` inside prose won't match because the line has other content.
    CLOSE=$(grep -nE '^[[:space:]]*\\`[,;][[:space:]]*$' "$f" 2>/dev/null || true)
    if [ -n "$OPEN" ] || [ -n "$CLOSE" ]; then
      FAIL=1
      echo "✗ $f — escaped-backtick template-literal delimiter detected (will break esbuild)"
      [ -n "$OPEN"  ] && echo "$OPEN"
      [ -n "$CLOSE" ] && echo "$CLOSE"
    fi
  done < <(find "$ROOT/$dir" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \))
done

if [ "$FAIL" -ne 0 ]; then
  echo
  echo 'Fix: replace the escaped delimiter (backslash + backtick) with a real backtick.'
  echo '  WRONG:  export const X = \`hello\`;     (esbuild fails)'
  echo '  RIGHT:  export const X = `hello`;'
  exit 1
fi

exit 0
