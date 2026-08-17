#!/usr/bin/env python3
"""
check-changelog.py — enforce the invariants src/lib/changelog.ts states in its
own comments but nothing verifies:
  1. every `date:` is a valid ISO yyyy-mm-dd
  2. entries are newest-first (dates non-increasing top to bottom)
  3. bannerText / bannerHref appear on the FIRST entry only (AnnouncementBar
     reads CHANGELOG[0]; a banner on any other entry is dead or, worse, was
     meant to be the live one)

Why this exists: a typo'd date builds green, then AnnouncementBar renders
"Invalid Date" and the RSS pubDate becomes garbage; a banner left on an old
entry announces the wrong edition site-wide — all with every check green.
Born 2026-08-17 (PR #3 review, test-quality finding #4).

Hard fail (exit 1): these are data invariants, not style.
"""

from __future__ import annotations
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "lib" / "changelog.ts"

text = SRC.read_text(encoding="utf-8")
body = text[text.index("export const CHANGELOG"):]

# split into entry blocks by `edition:` markers, in file order
entries: list[dict] = []
for m in re.finditer(r"edition:\s*'([^']+)'", body):
    entries.append({"edition": m.group(1), "start": m.start()})
for i, e in enumerate(entries):
    end = entries[i + 1]["start"] if i + 1 < len(entries) else len(body)
    block = body[e["start"]:end]
    dm = re.search(r"date:\s*'([^']*)'", block)
    e["date"] = dm.group(1) if dm else None
    e["banner"] = bool(re.search(r"banner(?:Text|Href):", block))

failures: list[str] = []
parsed: list[tuple[str, date]] = []
for e in entries:
    if e["date"] is None:
        failures.append(f"{e['edition']}: no date field")
        continue
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", e["date"]):
        failures.append(f"{e['edition']}: date '{e['date']}' is not yyyy-mm-dd")
        continue
    try:
        parsed.append((e["edition"], date.fromisoformat(e["date"])))
    except ValueError:
        failures.append(f"{e['edition']}: date '{e['date']}' does not parse")

for (ed_a, d_a), (ed_b, d_b) in zip(parsed, parsed[1:]):
    if d_a < d_b:
        failures.append(f"order: {ed_a} ({d_a}) sits above the newer {ed_b} ({d_b}) — newest-first violated")

for i, e in enumerate(entries):
    if e["banner"] and i != 0:
        failures.append(f"{e['edition']}: bannerText/bannerHref set on a non-latest entry (AnnouncementBar reads CHANGELOG[0] only)")

if not entries:
    failures.append("no entries parsed from changelog.ts — parser or file structure changed")

if failures:
    print("✗ check-changelog FAILED:", file=sys.stderr)
    for f in failures:
        print(f"  {f}", file=sys.stderr)
    sys.exit(1)

print(f"✓ changelog OK — {len(entries)} entries, dates valid + newest-first, banner on latest only")
