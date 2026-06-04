#!/usr/bin/env python3
"""
check-glossary-terms.py — catch <GlossaryTerm term="X"> usages whose term has
no matching key in src/lib/glossary.ts.

Why this exists: GlossaryPopover degrades gracefully — an unknown term renders
as a plain <span> with no tooltip and no link (it does NOT crash). So a typo'd
or undefined term is silent: the author meant to define+link a word, the reader
just sees plain text, and nothing flags it. This lint surfaces the gap.

Born 2026-06-04 (Ch 44 ship): `<GlossaryTerm term="Model">` shipped to a draft —
"Model" isn't a glossary key, so it rendered plain. Caught by eye, not by tooling.

Default mode: SOFT WARN — reports to stderr, exits 0, never blocks a build (same
philosophy as check-stale-numbers soft facts; unknown terms degrade gracefully,
so they're a quality nudge, not a hard failure).
  --strict   treat warnings as failures (CI flag, not default)

Escape hatch: <!-- NOGLOSSARYCHECK --> on a line skips that line.
"""

from __future__ import annotations
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GLOSSARY = ROOT / 'src' / 'lib' / 'glossary.ts'
PROSE_GLOBS = ['src/content/chapters/*.mdx', 'src/pages/*.astro']
ESCAPE = '<!-- NOGLOSSARYCHECK -->'

# Matches <GlossaryTerm ... term="X"> and <GlossaryTooltip ... term="X">.
# Only static double-quoted string literals are matched; dynamic term={expr}
# is intentionally ignored (can't be checked statically).
USAGE_RE = re.compile(r'<Glossary(?:Term|Tooltip)\b[^>]*?\bterm="([^"]+)"')


def glossary_keys() -> set[str]:
    if not GLOSSARY.is_file():
        print(f'no glossary at {GLOSSARY}; skipping', file=sys.stderr)
        return set()
    src = GLOSSARY.read_text(encoding='utf-8', errors='ignore')
    quoted = set(re.findall(r"(?m)^\s*'([^']+)':\s*\{", src))
    bare = set(re.findall(r"(?m)^\s*([A-Za-z][\w.\-]*):\s*\{", src))
    return quoted | bare


def iter_prose() -> list[Path]:
    out: list[Path] = []
    for g in PROSE_GLOBS:
        out.extend(sorted(ROOT.glob(g)))
    return out


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument('--strict', action='store_true',
                   help='treat undefined terms as failures (CI mode)')
    args = p.parse_args()

    keys = glossary_keys()
    if not keys:
        print('✓ glossary-terms skipped — no keys parsed')
        return 0

    misses: list[tuple[str, int, str]] = []  # (path, line_no, term)
    for f in iter_prose():
        for line_no, line in enumerate(f.read_text(encoding='utf-8', errors='ignore').splitlines(), 1):
            if ESCAPE in line:
                continue
            for term in USAGE_RE.findall(line):
                if term not in keys:
                    misses.append((str(f.relative_to(ROOT)), line_no, term))

    if not misses:
        print(f'✓ glossary-terms OK — {len(keys)} keys, every <GlossaryTerm> resolves')
        return 0

    uniq_terms = sorted({t for _, _, t in misses})
    print(f'! {len(misses)} <GlossaryTerm> usage(s) reference {len(uniq_terms)} '
          f'undefined term(s) — they render as plain text (no tooltip/link):',
          file=sys.stderr)
    for path, line_no, term in misses:
        print(f'  ~ {path}:{line_no}  term="{term}"', file=sys.stderr)
    print('  Fix: add the key to src/lib/glossary.ts, correct the term= spelling, '
          'or add <!-- NOGLOSSARYCHECK --> if intentional.', file=sys.stderr)

    if args.strict:
        print('--strict: treating undefined glossary terms as failures.', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
