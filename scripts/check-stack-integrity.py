#!/usr/bin/env python3
"""
check-stack-integrity.py — catch asserted-stack vs actual-stack drift.

Real incident (2026-05-20, caught externally by a portfolio CEO post-public-launch):
  Ch 02 listed "Fathom" in "What I Deliberately Don't Use" while
  snippets.ts had a PROMPT_TRUTH_EXTRACT that said "Read this Fathom transcript".

This lint, run pre-publish, would have caught it.

The rule:
  A contradiction = a TRACKED tool appears ON THE SAME LINE as a negative-framing
  keyword (tab-trash / deprecated / don't use / deliberately / etc.) in chapter
  prose, AND that tool is UNAMBIGUOUSLY positively cited in src/lib/{snippets,
  builds,setup}.ts or src/pages/resources.astro (i.e. appears on a line where
  no other tracked tool also appears — so we're sure it's a "we use X" claim,
  not a "Gong/Fathom/Fireflies" alternatives list).

Escape hatches:
  <!-- NOSTACKCHECK -->     on the same line  → suppress that one match
  <!-- NOSTACKCHECK -->     anywhere in file  → suppress whole file
"""

from __future__ import annotations
import glob
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Tools whose mention in both "use" and "avoid" narratives we monitor.
# Add new entries here when a new candidate tool is mentioned in the book.
TRACKED = [
    'Fathom', 'Gong', 'Otter', 'Notion AI', 'Fireflies', 'Read.ai',
    'Granola', 'tl;dv', 'Claude Code', 'Cowork', 'Codex', 'Cursor',
    'ElevenLabs', 'Suno', 'SeeDance', 'Gemini',
]

# Files where a single-tool mention = "we use this".
POSITIVE_SOURCES = [
    'src/lib/snippets.ts',
    'src/lib/builds.ts',
    'src/lib/setup.ts',
    'src/pages/resources.astro',
]

# Chapter prose surfaces to lint.
PROSE_SOURCES_GLOB = ['src/content/chapters/*.mdx', 'src/pages/*.astro']

# Negative-framing keywords. Match per-line — only flag tools on the SAME line
# as a negative keyword (so "I picked X" on a line by itself in a section under
# a "Don't Use" header is NOT flagged).
NEG_KEYWORDS = re.compile(
    r'(?i)(tab.?trash|dead\s+weight|deprecated|killed|shut\s+down|stop\s+paying|'
    r'don.?t\s+use|deliberately\s+don.?t|deliberately\s+avoid|the\s+dozen\s+lookalikes)'
)

ESCAPE = '<!-- NOSTACKCHECK -->'


def contains_tool(line: str, tool: str) -> bool:
    """Case-insensitive substring match. Tools with regex chars are quoted."""
    return tool.lower() in line.lower()


def count_tracked_on_line(line: str) -> int:
    return sum(1 for t in TRACKED if contains_tool(line, t))


def in_dismissal_list(line: str, tool: str) -> bool:
    """
    True if `tool` is comma-adjacent to ANOTHER tracked tool in the surrounding
    ±60 chars — i.e. appears in a comma-separated list of dismissed items,
    not in operator prose ("I picked X", "queryable from Cowork and CC").
    """
    pos = line.lower().find(tool.lower())
    if pos < 0:
        return False
    window = line[max(0, pos - 80) : pos + len(tool) + 80]
    for other in TRACKED:
        if other.lower() == tool.lower():
            continue
        # other-tool followed by comma, or comma followed by other-tool
        # (i.e. other and tool sit in a comma-separated list)
        if re.search(rf'(?i)\b{re.escape(other)}\s*[,·]', window):
            return True
        if re.search(rf'(?i)[,·]\s*\b{re.escape(other)}\b', window):
            return True
    return False


def is_unambiguously_positive(tool: str) -> tuple[bool, list[str]]:
    """
    A tool is unambiguously positively cited if it appears on at least one line
    in a positive source where NO OTHER tracked tool also appears. That rules
    out "Gong/Fathom/Fireflies" style alternatives lists.

    Returns (is_positive, list of source files where the positive mention lives).
    """
    sources_with_solo_mention: list[str] = []
    for src_rel in POSITIVE_SOURCES:
        src = ROOT / src_rel
        if not src.is_file():
            continue
        text = src.read_text(encoding='utf-8', errors='ignore')
        for line in text.splitlines():
            if not contains_tool(line, tool):
                continue
            if count_tracked_on_line(line) == 1:
                # tool alone on this line → unambiguous "we use this"
                sources_with_solo_mention.append(src_rel)
                break
    return (len(sources_with_solo_mention) > 0, sources_with_solo_mention)


def main() -> int:
    # Precompute positive set + source-attribution per tool.
    positive: dict[str, list[str]] = {}
    for tool in TRACKED:
        ok, srcs = is_unambiguously_positive(tool)
        if ok:
            positive[tool] = srcs

    if not positive:
        print('No tracked tools have unambiguous positive citations. Nothing to check.')
        return 0

    fails: list[tuple[str, int, str, str, list[str]]] = []

    for pattern in PROSE_SOURCES_GLOB:
        for f in sorted((ROOT).glob(pattern)):
            text = f.read_text(encoding='utf-8', errors='ignore')
            # Whole-file escape
            if ESCAPE in text and text.count(ESCAPE) > 0:
                # Only treat whole-file escape if it's on its own line near the top
                first_lines = '\n'.join(text.splitlines()[:30])
                if ESCAPE in first_lines and not any(
                    ESCAPE in ln and ln.strip() != ESCAPE for ln in first_lines.splitlines()
                ):
                    continue
            for line_no, line in enumerate(text.splitlines(), start=1):
                if ESCAPE in line:
                    continue
                if not NEG_KEYWORDS.search(line):
                    continue
                # Negative framing on this line. Check each positive tool.
                # Two requirements for a flag:
                #   1. tool appears on this line
                #   2. tool is comma-adjacent to ANOTHER tracked tool (i.e. it's
                #      in a dismissal list, not in operator prose)
                for tool, srcs in positive.items():
                    if not contains_tool(line, tool):
                        continue
                    if not in_dismissal_list(line, tool):
                        continue
                    fails.append((str(f.relative_to(ROOT)), line_no, tool, line.strip(), srcs))

    if not fails:
        print(f'✓ stack integrity OK — {len(positive)} tools cross-checked: {", ".join(positive.keys())}')
        return 0

    print('Asserted-stack vs actual-stack contradiction:')
    print()
    for path, line_no, tool, line, srcs in fails:
        print(f"  ✗ {path}:{line_no}")
        print(f"      tool: {tool}")
        print(f"      line: {line[:180]}{'…' if len(line) > 180 else ''}")
        print(f"      positively cited in: {', '.join(srcs)}")
        print()
    print('Fix options:')
    print('  (a) remove the tool from the negative-framed line, OR')
    print('  (b) drop the positive citation if you really stopped using it, OR')
    print('  (c) reframe the line so it\'s clear ("picked X, killed the rest"), OR')
    print('  (d) add <!-- NOSTACKCHECK --> to the line if the framing is intentional context')
    return 1


if __name__ == '__main__':
    sys.exit(main())
