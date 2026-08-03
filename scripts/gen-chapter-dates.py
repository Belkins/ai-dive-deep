#!/usr/bin/env python3
"""Regenerate src/data/chapter-dates.json from git history.

datePublished = author date of the commit that added the chapter MDX
dateModified  = author date of the last commit touching it

Runs in the prebuild chain. In CI the checkout is shallow (fetch-depth 1),
so git history would produce lies — the script detects that and keeps the
committed JSON untouched. Locally (full clone) it refreshes on every build,
so dateModified can never go stale.
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
            print("chapter-dates: shallow clone — keeping committed JSON")
            return 0
    except subprocess.CalledProcessError:
        print("chapter-dates: not a git repo — keeping committed JSON")
        return 0

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
