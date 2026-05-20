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

Escape hatch: <!-- NOSTALENUMBERS --> on a line or in first 30 lines of file.
"""

from __future__ import annotations
import argparse
import json
import re
import sys
from datetime import date, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEDGER = Path(__file__).resolve().parent / 'numbers-ledger.json'
PROSE_GLOBS = ['src/content/chapters/*.mdx', 'src/pages/*.astro']
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
        out.extend(sorted(ROOT.glob(g)))
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

    hard_fails = scan_hard(ledger)
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
        print('Deprecated model IDs / hard-banned strings in prose:')
        for path, line_no, snippet, pattern, reason in hard_fails:
            print(f'  ✗ {path}:{line_no}  /{pattern}/')
            print(f'      reason: {reason}')
            print(f'      line:   {snippet}')
        print()
        print('Fix: replace the deprecated ID with the current model name, or '
              'add <!-- NOSTALENUMBERS --> if the historical reference is intentional.')
        return 1

    if args.strict and soft_warns:
        print('--strict: treating soft warnings as failures.', file=sys.stderr)
        return 1

    soft_status = f' ({len(soft_warns)} soft warning{"s" if len(soft_warns) != 1 else ""})' if soft_warns else ''
    print(f'✓ stale-numbers OK — '
          f'{len(ledger.get("hard_deprecations", []))} hard patterns, '
          f'{len(ledger.get("soft_facts", []))} soft facts'
          f'{soft_status}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
