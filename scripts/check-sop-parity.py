#!/usr/bin/env python3
"""Check that every built SOP page shows the same sections, items and Not run badges as its Markdown download.

Both come from src/lib/sops.ts, but through two templates, and the unit tests only read the source.
This reads what GitHub Pages serves: dist/sops/<slug>/index.html against dist/sops/<slug>.md.
"""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

SOP_COUNT = 6
LIST_LINE = re.compile(r'(?:\d+\. |- )(\[ \] Not run: )?(.*)')
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class SopPage(HTMLParser):
    """Collects each <section data-section-target>: its h2, its [data-sop-content] items and its badge texts."""

    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.sections = []
        self.in_section = False
        self.capture = None
        self.depth = 0
        self.text = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if self.capture:
            self.depth += tag not in VOID
            return
        attrs = dict(attrs)
        if tag == 'section' and 'data-section-target' in attrs:
            self.sections.append({'id': attrs.get('id'), 'heading': None, 'items': [], 'badges': []})
            self.in_section = True
        elif self.in_section and tag == 'h2' and self.sections[-1]['heading'] is None:
            self.capture = 'heading'
        elif self.in_section and 'data-sop-content' in attrs:
            self.capture = 'items'
        elif self.in_section and 'sop-state' in (attrs.get('class') or '').split():
            self.capture = 'badges'
        if self.capture:
            self.depth, self.text = 1, []

    def handle_startendtag(self, tag, attrs):
        pass  # no self-closed element opens a section, heading, item or badge

    def handle_endtag(self, tag):
        if not self.capture:
            if tag == 'section':
                self.in_section = False
            return
        self.depth -= 1
        if self.depth == 0:
            text = ''.join(self.text)
            if self.capture == 'heading':
                self.sections[-1]['heading'] = text
            else:
                self.sections[-1][self.capture].append(text)
            self.capture = None

    def handle_data(self, data):
        if self.capture:
            self.text.append(data)


def markdown_sections(markdown):
    """Each '## ' section except the planner links: (heading, items, Not run count)."""
    sections = []
    for part in markdown.split('\n## ')[1:]:
        heading, _, body = part.partition('\n\n')
        if heading == 'Related planning reference':
            continue
        lines = body.rstrip('\n').split('\n')
        matches = [LIST_LINE.fullmatch(line) for line in lines]
        if all(matches):
            sections.append((heading, [m.group(2) for m in matches], sum(bool(m.group(1)) for m in matches)))
        else:
            sections.append((heading, body.rstrip('\n').split('\n\n'), 0))
    return sections


def check(root):
    sops = root / 'sops'
    pages = {path.parent.name: path for path in sops.glob('*/index.html')}
    downloads = {path.stem: path for path in sops.glob('*.md')}
    failures = []
    if sorted(pages) != sorted(downloads):
        failures.append(f'pages {sorted(pages)} and downloads {sorted(downloads)} differ')
    if len(pages) != SOP_COUNT:
        failures.append(f'{len(pages)} SOP pages built, expected {SOP_COUNT}')
    items = badges = 0
    for slug in sorted(set(pages) & set(downloads)):
        markdown = downloads[slug].read_text(encoding='utf-8')
        if re.search(r'\[[xX]\]', markdown):
            failures.append(f'{slug}.md marks a check as done')
        expected = markdown_sections(markdown)
        page = SopPage(pages[slug].read_text(encoding='utf-8')).sections
        shown = [(section['heading'], section['items']) for section in page]
        if shown != [(heading, section_items) for heading, section_items, _ in expected]:
            failures.append(f'{slug}: page sections or items differ from {slug}.md')
        for section, (heading, _, not_run) in zip(page, expected):
            if section['badges'] != ['Not run'] * not_run:
                failures.append(f'{slug} {heading}: {len(section["badges"])} Not run badges on the page, {not_run} in {slug}.md')
        items += sum(len(section['items']) for section in page)
        badges += sum(len(section['badges']) for section in page)
    return len(pages), items, badges, failures


if __name__ == '__main__':
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / 'dist'
    if not root.is_dir():
        sys.exit('Build the site before checking SOP parity.')
    count, items, badges, failures = check(root)
    for failure in failures:
        print(failure)
    print(f'SOP parity: {count} pages, {items} items, {badges} Not run badges, {len(failures)} failures.')
    sys.exit(bool(failures))
