#!/usr/bin/env python3
"""
check-nested-anchors.py — fail on anchors nested inside anchors.

The bug this catches shipped to production in Edition 10.9 and survived a full
`astro build`, check-seo, AND check-rendered-links without a single warning.

What happened: the Opus 5 homepage tile was an <a class="card"> whose blurb
contained a second <a> linking to the use-cases spoke. Nested <a> is invalid
HTML — the parser's adoption agency algorithm implicitly closes the outer
anchor at the inner one. The emitted markup became:

    <a class="card">…<h3>Opus 5 —…</h3></a>     <- card closed early
    <p><a class="card">…blurb…</a><a href="…">…</a>…</p>   <- escaped the card

Visually: the tile rendered as heading-only and its paragraph floated over the
grid wearing a duplicate card background. Nothing errored, because the output
is still *valid* HTML — just not the tree the author wrote.

Two detectors, because the failure has two fingerprints:

  A. NESTED — a real <a> inside an open <a> in the parsed tree. Catches the
     source-level mistake wherever the parser did not rewrite it (e.g. links
     injected via set:html).

  B. SPLIT — an <a> carrying a "card" class found INSIDE a <p>. A card anchor
     is a block-level tile and never legitimately lives inside a paragraph, so
     this is a high-signal fingerprint of an already-split tile.

Runs on the BUILT output (dist/), because that is where the parser rewrite is
observable — the .astro source looks perfectly reasonable.
"""

from __future__ import annotations
import pathlib
import sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'


class AnchorAudit(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.a_stack: list[str] = []
        self.p_depth = 0
        self.nested: list[tuple[str, str]] = []
        self.split: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == 'p':
            self.p_depth += 1
            return
        if tag != 'a':
            return
        d = dict(attrs)
        href = d.get('href') or '(no href)'
        cls = d.get('class') or ''
        if self.a_stack:
            self.nested.append((self.a_stack[-1], href))
        if self.p_depth > 0 and 'card' in cls.split():
            self.split.append(href)
        self.a_stack.append(href)

    def handle_endtag(self, tag: str) -> None:
        if tag == 'p' and self.p_depth > 0:
            self.p_depth -= 1
        elif tag == 'a' and self.a_stack:
            self.a_stack.pop()


def main() -> int:
    if not DIST.is_dir():
        print('no dist/ — run `npm run build` first', file=sys.stderr)
        return 0

    failures = 0
    for page in sorted(DIST.rglob('*.html')):
        audit = AnchorAudit()
        try:
            audit.feed(page.read_text(encoding='utf-8'))
        except Exception as exc:  # noqa: BLE001 - a parse failure is not this check's job
            print(f'  ! could not parse {page.relative_to(ROOT)}: {exc}', file=sys.stderr)
            continue

        rel = page.relative_to(DIST)
        for outer, inner in audit.nested:
            failures += 1
            print(f'✗ {rel} — nested anchor: <a href="{outer}"> contains <a href="{inner}">')
        for href in audit.split:
            failures += 1
            print(f'✗ {rel} — split tile: <a class="card" href="{href}"> is inside a <p>')

    if failures:
        print()
        print(f'{failures} nested/split anchor problem(s).')
        print('Fix: an <a class="card"> tile must contain NO other <a>. Make the inner')
        print('link a <span> (the tile already links to the destination), or restructure')
        print('the tile so the card is a <div> and only the heading is a link.')
        return 1

    print('✓ nested-anchors OK — no anchor nested in an anchor, no card split into a <p>')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
