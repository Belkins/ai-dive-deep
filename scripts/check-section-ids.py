#!/usr/bin/env python3
"""
check-section-ids.py — assert every id in a `*_SECTIONS` array in
src/widgets/CommandPalette.tsx exists as id="…" in the page it deep-links to.

Why this exists: the palette's section entries are `${base}/<slug>/#<id>`
template literals inside a client island — the source link-scanner skips
template literals, the dist-HTML checkers never read the JS bundle, and every
checker strips #fragments anyway. So a renamed or typo'd section id fails
nothing and silently scrolls the reader to the page top.
Born 2026-08-17 (PR #3 review, test-quality finding #2).

Hard fail (exit 1): both sides are static strings in this repo; a mismatch is
always a bug, never a judgment call.
"""

from __future__ import annotations
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PALETTE = ROOT / "src" / "widgets" / "CommandPalette.tsx"
PAGES = ROOT / "src" / "pages"

src = PALETTE.read_text(encoding="utf-8")

# 1. every sections const: name -> [ids]
sections: dict[str, list[str]] = {}
for m in re.finditer(r"const\s+(\w+_SECTIONS)[^=]*=\s*\[(.*?)\];", src, re.S):
    sections[m.group(1)] = re.findall(r"id:\s*'([^']+)'", m.group(2))

# 2. every spread: const name -> page slug (from its href template)
slug_of: dict[str, str] = {}
for m in re.finditer(r"\.\.\.(\w+_SECTIONS)\.map\((.*?)\)\)," , src, re.S):
    href = re.search(r"href:\s*`\$\{base\}/([\w/-]+?)/?#", m.group(2))
    if href:
        slug_of[m.group(1)] = href.group(1)

failures: list[str] = []
for name, ids in sections.items():
    slug = slug_of.get(name)
    if slug is None:
        failures.append(f"{name}: no ...{name}.map spread with an href template found")
        continue
    page = PAGES / f"{slug}.astro"
    if not page.is_file():
        failures.append(f"{name}: page src/pages/{slug}.astro not found")
        continue
    page_src = page.read_text(encoding="utf-8")
    page_ids = set(re.findall(r'id="([^"]+)"', page_src))
    for sid in ids:
        if sid not in page_ids:
            failures.append(f'{name}: id "{sid}" not found as id="…" in src/pages/{slug}.astro')

if failures:
    print("✗ check-section-ids FAILED:", file=sys.stderr)
    for f in failures:
        print(f"  {f}", file=sys.stderr)
    sys.exit(1)

total = sum(len(v) for v in sections.values())
print(f"✓ section-ids OK — {len(sections)} arrays, {total} ids, every deep link lands")
