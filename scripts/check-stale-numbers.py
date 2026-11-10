#!/usr/bin/env python3
"""
check-stale-numbers.py — catch deprecated model IDs (hard-fail) and aging
factual claims (soft-warn) in the published prose.

Same DNA as check-stack-integrity.py: the post-launch embarrassment we want to
prevent is "Vlad's Playbook references claude-3-opus when current is opus-4-7",
or "Ch 02 still claims 10K+ subs when it's actually 25K six months later."

Modes:
  default        run lint; hard-fail on deprecated model IDs, soft-warn on
                 aged facts (warning goes to stderr, build continues)
  --update-ledger  bump every soft_fact.last_verified to today's date
                 (use only after manual review confirms the numbers are still
                 accurate)
  --strict       treat soft warnings as hard failures (CI flag, not default)

Ledger lives at scripts/numbers-ledger.json. Add new patterns there as new
factual claims accrete across chapters.

count_claims (hard-fail): counts the repo computes itself, such as the number
of chapters (files in src/content/chapters/*.mdx), checked on the front-door
files each entry lists (README.md, the share-image SVGs). Page prose is not
held to the live count: dated pages legitimately quote older counts.

rendered_images (hard-fail): an image rendered by hand from a source file, such
as the share-image PNG from its SVG. Pages share the PNG, and the build cannot
render it (the fonts are not on the build machine), so the ledger records the
hash of the source the PNG was last rendered from. A source that no longer
matches fails the build until the PNG is rendered again and the hash updated.

Escape hatch: <!-- NOSTALENUMBERS --> on a line or in first 30 lines of file.
"""

from __future__ import annotations
import argparse
import hashlib
import json
import re
import sys
from datetime import date, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEDGER = Path(__file__).resolve().parent / 'numbers-ledger.json'
PROSE_GLOBS = [
    'src/content/chapters/*.mdx',
    'src/pages/**/*.astro',  # ** also matches src/pages/*.astro
    'src/lib/*.ts',
    'src/widgets/*.tsx',
    'README.md',
    'public/*.svg',
]
ESCAPE = '<!-- NOSTALENUMBERS -->'


def load_ledger() -> dict:
    if not LEDGER.is_file():
        print(f'no ledger at {LEDGER}; nothing to check', file=sys.stderr)
        sys.exit(0)
    return json.loads(LEDGER.read_text(encoding='utf-8'))


def save_ledger(data: dict) -> None:
    LEDGER.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')


def iter_prose_files() -> list[Path]:
    out: list[Path] = []
    for g in PROSE_GLOBS:
        out.extend(p for p in sorted(ROOT.glob(g)) if p not in out)
    return out


def file_escaped(text: str) -> bool:
    head = '\n'.join(text.splitlines()[:30])
    return ESCAPE in head and any(
        ln.strip() == ESCAPE for ln in head.splitlines()
    )


def scan_hard(ledger: dict) -> list[tuple[str, int, str, str, str]]:
    """Return list of (path, line_no, snippet, pattern, reason)."""
    fails: list[tuple[str, int, str, str, str]] = []
    for f in iter_prose_files():
        text = f.read_text(encoding='utf-8', errors='ignore')
        if file_escaped(text):
            continue
        for line_no, line in enumerate(text.splitlines(), start=1):
            if ESCAPE in line:
                continue
            for entry in ledger.get('hard_deprecations', []):
                if re.search(entry['regex'], line):
                    fails.append(
                        (
                            str(f.relative_to(ROOT)),
                            line_no,
                            line.strip()[:200],
                            entry['regex'],
                            entry.get('reason', 'deprecated'),
                        )
                    )
    return fails


def scan_counts(ledger: dict) -> list[tuple[str, int, str, str, str]]:
    """Hard rule for counts the repo can compute (e.g. chapters = files in
    src/content/chapters/*.mdx). Each count_claims entry names the glob that
    produces the true number, a regex whose group 1 is the claimed number,
    and the front-door files it is enforced on. Same tuple shape as scan_hard."""
    fails: list[tuple[str, int, str, str, str]] = []
    for entry in ledger.get('count_claims', []):
        actual = len(list(ROOT.glob(entry['count_glob'])))
        rx = re.compile(entry['regex'])
        for rel in entry.get('files', []):
            f = ROOT / rel
            if not f.is_file():
                continue
            text = f.read_text(encoding='utf-8', errors='ignore')
            if file_escaped(text):
                continue
            for line_no, line in enumerate(text.splitlines(), start=1):
                if ESCAPE in line:
                    continue
                for m in rx.finditer(line):
                    if int(m.group(1)) != actual:
                        fails.append(
                            (
                                rel,
                                line_no,
                                line.strip()[:200],
                                entry['regex'],
                                f'{entry.get("label", "count")}: says {m.group(1)}, '
                                f'{entry["count_glob"]} holds {actual}',
                            )
                        )
    return fails


def scan_renders(ledger: dict) -> list[tuple[str, int, str, str, str]]:
    """Hard rule for an image rendered by hand from a source file. Each
    rendered_images entry names the source, the render, the command that
    renders it and the hash of the source at the last render. Same tuple
    shape as scan_hard."""
    fails: list[tuple[str, int, str, str, str]] = []
    for entry in ledger.get('rendered_images', []):
        source = ROOT / entry['source']
        if not source.is_file():
            continue
        now = hashlib.sha256(source.read_bytes()).hexdigest()
        if now != entry.get('source_sha256'):
            fails.append(
                (
                    entry['source'],
                    1,
                    f'{entry["render"]} was rendered from an older copy of this file',
                    'rendered_images',
                    f'{entry["render"]} is the image pages share, and it is rendered by hand. '
                    f'Render it again ({entry["command"]}), look at it, then set '
                    f'"source_sha256": "{now}" for it in scripts/numbers-ledger.json',
                )
            )
    return fails


def scan_soft(ledger: dict, today: date) -> list[tuple[str, int, str, str, int, str]]:
    """Return list of (path, line_no, snippet, label, age_days, last_verified)."""
    max_age = int(ledger.get('max_age_days', 90))
    warns: list[tuple[str, int, str, str, int, str]] = []
    soft = ledger.get('soft_facts', [])
    if not soft:
        return warns
    files = iter_prose_files()
    # For each soft fact, find every prose hit and report age.
    for entry in soft:
        try:
            last = datetime.fromisoformat(entry['last_verified']).date()
        except (KeyError, ValueError):
            continue
        age = (today - last).days
        if age <= max_age:
            continue
        rx = re.compile(entry['regex'])
        for f in files:
            text = f.read_text(encoding='utf-8', errors='ignore')
            if file_escaped(text):
                continue
            for line_no, line in enumerate(text.splitlines(), start=1):
                if ESCAPE in line:
                    continue
                if rx.search(line):
                    warns.append(
                        (
                            str(f.relative_to(ROOT)),
                            line_no,
                            line.strip()[:160],
                            entry.get('label', entry['regex']),
                            age,
                            entry['last_verified'],
                        )
                    )
    return warns


def cmd_update_ledger() -> int:
    ledger = load_ledger()
    today_iso = date.today().isoformat()
    bumped = 0
    for entry in ledger.get('soft_facts', []):
        if entry.get('last_verified') != today_iso:
            entry['last_verified'] = today_iso
            bumped += 1
    save_ledger(ledger)
    print(f'bumped {bumped} soft_fact entries to {today_iso}')
    return 0


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument('--update-ledger', action='store_true',
                   help='bump soft_fact.last_verified to today and exit')
    p.add_argument('--strict', action='store_true',
                   help='treat soft warnings as failures (CI mode)')
    args = p.parse_args()

    if args.update_ledger:
        return cmd_update_ledger()

    ledger = load_ledger()
    today = date.today()

    hard_fails = scan_hard(ledger) + scan_counts(ledger) + scan_renders(ledger)
    soft_warns = scan_soft(ledger, today)

    # Soft warnings → stderr, never block (unless --strict)
    if soft_warns:
        print(f'! {len(soft_warns)} soft warning(s) — facts past max_age_days '
              f'({ledger.get("max_age_days", 90)}d):',
              file=sys.stderr)
        for path, line_no, snippet, label, age, last_verified in soft_warns:
            print(f'  ~ {path}:{line_no}  [{label}]  {age}d old (last verified {last_verified})',
                  file=sys.stderr)
            print(f'      → {snippet}', file=sys.stderr)
        print('  (run `python3 scripts/check-stale-numbers.py --update-ledger` '
              'after confirming numbers are still accurate)', file=sys.stderr)

    if hard_fails:
        print('Deprecated model IDs / hard-banned strings / wrong counts in prose:')
        for path, line_no, snippet, pattern, reason in hard_fails:
            print(f'  ✗ {path}:{line_no}  /{pattern}/')
            print(f'      reason: {reason}')
            print(f'      line:   {snippet}')
        print()
        print('Fix: replace the deprecated ID with the current model name, set a '
              'wrong count to the number the folder holds, render a share image again as '
              'its line says, or '
              'add <!-- NOSTALENUMBERS --> if the historical reference is intentional.')
        return 1

    if args.strict and soft_warns:
        print('--strict: treating soft warnings as failures.', file=sys.stderr)
        return 1

    soft_status = f' ({len(soft_warns)} soft warning{"s" if len(soft_warns) != 1 else ""})' if soft_warns else ''
    print(f'✓ stale-numbers OK — '
          f'{len(ledger.get("hard_deprecations", []))} hard patterns, '
          f'{len(ledger.get("soft_facts", []))} soft facts, '
          f'{len(ledger.get("count_claims", []))} count claims'
          f'{soft_status}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
