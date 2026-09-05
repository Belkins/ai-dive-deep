#!/usr/bin/env python3
"""Validate local page destinations and fragments in generated anchor links."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import sys

ORIGIN = 'https://dive.vladyslavpodoliako.com'


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.links = set()
        self.template_depth = 0
        self.has_base_href = False
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if self.template_depth:
            if tag == 'template':
                self.template_depth += 1
            return
        # HTML keeps the first occurrence of a duplicate attribute.
        first_attrs = {}
        for name, value in attrs:
            first_attrs.setdefault(name, value)
        attrs = first_attrs
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'template':
            self.template_depth = 1
        if tag == 'base' and 'href' in attrs:
            self.has_base_href = True
        if tag == 'a':
            if attrs.get('name'):
                self.ids.add(attrs['name'])
            if attrs.get('href'):
                self.links.add(attrs['href'])

    def handle_endtag(self, tag):
        if tag == 'template' and self.template_depth:
            self.template_depth -= 1

    def handle_startendtag(self, tag, attrs):
        # A self-closing slash does not close an HTML template element.
        self.handle_starttag(tag, attrs)


def check(root):
    files = {file.relative_to(root).as_posix(): file for file in root.rglob('*') if file.is_file()}
    pages = {name: Page(file.read_text(encoding='utf-8')) for name, file in files.items() if name.endswith('.html')}
    failures = []
    for name, page in pages.items():
        if page.has_base_href:
            failures.append((name, '<base href>', 'unsupported base URL'))
            continue
        route = '/' + (name[:-10] if name.endswith('index.html') else name)
        for href in sorted(page.links):
            target = urlsplit(urljoin(ORIGIN + route, href))
            if target.scheme not in ('http', 'https') or target.netloc != urlsplit(ORIGIN).netloc:
                continue
            path = unquote(target.path).lstrip('/')
            filename = path + 'index.html' if path.endswith('/') or not path else path
            if filename not in files:
                failures.append((name, href, 'missing destination'))
            elif target.fragment and filename in pages:
                anchor = unquote(target.fragment).split(':~:text=', 1)[0]
                if anchor and anchor not in pages[filename].ids:
                    failures.append((name, href, 'missing fragment'))
    return len(pages), failures


if __name__ == '__main__':
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / 'dist'
    if not root.is_dir():
        sys.exit('Build the site before checking rendered targets.')
    count, failures = check(root)
    for name, href, reason in failures:
        print(f'{name}: {href} ({reason})')
    print(f'Rendered targets: {count} HTML files, {len(failures)} failures.')
    sys.exit(bool(failures) or count == 0)
