#!/usr/bin/env python3
"""Regenerate src/data/chapter-dates.json from git history.

datePublished = author date of the commit that added the chapter MDX
dateModified  = author date of the last commit touching it

Runs in the prebuild chain with full history in local, CI and deployment
checkouts. Incomplete or unavailable history fails the build rather than
silently publishing stale committed dates. Build time is never a date source.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS_DIR = ROOT / "src" / "content" / "chapters"
OUT = ROOT / "src" / "data" / "chapter-dates.json"


def git(*args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.strip()


def main() -> int:
    try:
        if git("rev-parse", "--is-shallow-repository") == "true":
            print(
                "chapter-dates: full git history required; shallow checkout detected. "
                "Use actions/checkout fetch-depth: 0 or git fetch --unshallow.",
                file=sys.stderr,
            )
            return 1
    except subprocess.CalledProcessError:
        print("chapter-dates: git history unavailable; build from a full checkout.", file=sys.stderr)
        return 1

    dates: dict[str, dict[str, str]] = {}
    for mdx in sorted(CHAPTERS_DIR.glob("*.mdx")):
        rel = str(mdx.relative_to(ROOT))
        log = git("log", "--follow", "--format=%aI", "--", rel).splitlines()
        if not log:
            print(f"chapter-dates: no history for {rel} — skipping")
            continue
        dates[mdx.stem] = {
            "published": log[-1][:10],
            "modified": log[0][:10],
        }

    OUT.write_text(json.dumps(dates, indent=2, sort_keys=True) + "\n")
    print(f"chapter-dates: wrote {len(dates)} entries to {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
