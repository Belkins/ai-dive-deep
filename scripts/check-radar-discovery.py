#!/usr/bin/env python3
"""Check Radar's rendered edition graph, robots policy, and sitemap membership."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import json
import os
import re
import sys
import xml.etree.ElementTree as ET

SITE = urlsplit(os.environ.get('SITE_URL') or 'https://dive.vladyslavpodoliako.com')
ORIGIN = f'{SITE.scheme}://{SITE.netloc}'
ARCHIVE_ROUTE = re.compile(r'^/radar/\d{4}-\d{2}-\d{2}/$')


class RadarPage(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.links = set()
        self.followable_links = set()
        self.neighbors = {'prev': set(), 'next': set()}
        self.noindex = False
        self.nofollow = False
        self.in_head = False
        self.template_depth = 0
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag == 'template':
            self.template_depth += 1
        if self.template_depth:
            return
        attributes = {}
        for key, value in attrs:
            attributes.setdefault(key, value)
        if tag == 'head':
            self.in_head = True
        if tag == 'meta' and self.in_head and (attributes.get('name') or '').lower() in ('robots', 'googlebot'):
            directives = re.split(r'[\s,]+', (attributes.get('content') or '').lower())
            self.noindex |= bool({'noindex', 'none'}.intersection(directives))
            self.nofollow |= bool({'nofollow', 'none'}.intersection(directives))
        if tag == 'a' and attributes.get('href'):
            href = attributes['href']
            self.links.add(href)
            relations = (attributes.get('rel') or '').lower().split()
            if 'nofollow' in relations:
                return
            self.followable_links.add(href)
            for relation in relations:
                if relation in self.neighbors:
                    self.neighbors[relation].add(href)

    def handle_endtag(self, tag):
        if tag == 'template' and self.template_depth:
            self.template_depth -= 1
        if tag == 'head':
            self.in_head = False


def local_route(href, source):
    target = urlsplit(urljoin(ORIGIN + source, href))
    if (target.scheme not in ('http', 'https') or target.scheme != SITE.scheme
            or target.hostname != SITE.hostname
            or (target.port or (443 if target.scheme == 'https' else 80))
            != (SITE.port or (443 if SITE.scheme == 'https' else 80))):
        return None
    return target.path.rstrip('/') + '/'


def check(root):
    pages = {
        '/' + file.relative_to(root).as_posix()[:-10]: RadarPage(file.read_text(encoding='utf-8'))
        for file in (root / 'radar').rglob('index.html')
    }
    failures = []
    if '/radar/' not in pages:
        return ['missing rendered /radar/ entry point'], 0, 0
    live_date = json.loads((root.parent / 'src/data/radar/today.json').read_text())['date']
    for route in pages:
        if ARCHIVE_ROUTE.fullmatch(route) and route.split('/')[2] >= live_date:
            failures.append(f'{route}: live-day duplicate or unfrozen edition was rendered')

    sitemap = set()
    for file in root.glob('sitemap-*.xml'):
        for loc in ET.parse(file).getroot().findall('.//{*}url/{*}loc'):
            route = local_route(loc.text or '', '/')
            if route == '/radar/' or route and ARCHIVE_ROUTE.fullmatch(route):
                sitemap.add(route)
    indexable = {route for route, page in pages.items() if not page.noindex}
    for route in sorted(indexable - sitemap):
        failures.append(f'{route}: indexable page missing from sitemap')
    for route in sorted(sitemap - indexable):
        failures.append(f'{route}: sitemap includes a missing or noindex page')

    graph = {}
    for route, page in pages.items():
        targets = {local_route(href, route) for href in page.links}
        followable = {local_route(href, route) for href in page.followable_links}
        graph[route] = set() if page.nofollow else followable.intersection(pages)
        for target in sorted(target for target in targets if target and target != route and ARCHIVE_ROUTE.fullmatch(target)):
            if target not in pages:
                failures.append(f'{route}: links to missing edition {target}')
            elif pages[target].noindex:
                failures.append(f'{route}: links to ineligible edition {target}')

    visited = set()
    pending = ['/radar/']
    while pending:
        route = pending.pop()
        if route in visited:
            continue
        visited.add(route)
        pending.extend(graph.get(route, set()) - visited)
    archives = sorted(route for route in indexable if ARCHIVE_ROUTE.fullmatch(route))
    for index, route in enumerate(archives):
        if route not in visited:
            failures.append(f'{route}: indexable edition unreachable from /radar/')
        expected = {
            'prev': {archives[index - 1]} if index else set(),
            'next': {archives[index + 1]} if index + 1 < len(archives) else set(),
        }
        for relation, destinations in expected.items():
            page = pages[route]
            actual = set() if page.nofollow else {
                local_route(href, route) or href for href in page.neighbors[relation]
            }
            if actual != destinations:
                failures.append(f'{route}: {relation} links {sorted(actual)} != {sorted(destinations)}')
    return failures, len(archives), len(set(archives).intersection(visited))


if __name__ == '__main__':
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / 'dist'
    failures, count, reachable = check(root)
    for failure in failures:
        print(failure)
    print(f'Radar discovery: {count} indexable archives, {reachable} reachable, {len(failures)} failures.')
    sys.exit(bool(failures))
