#!/usr/bin/env python3
"""
check-internal-links.py — fail on internal links pointing at non-existent routes.

The risk this catches: someone renames /resources to /recipes, the playbook keeps
shipping with "(see the PROMPT_TRUTH_EXTRACT recipe in [Resources](/resources))"
inside Ch 02, and nothing breaks the build — readers just get 404s.

Scope:
  - Discover routes from src/pages/**:
      *.astro file → /<basename>   (index.astro → /)
      directory + index.astro      → /<dir>
      directory + [slug].astro     → /<dir>/<slug>  (load slugs from MDX frontmatter)
      *.json.ts / *.xml.ts         → /<basename>.<ext>
  - Walk source files (Astro, MDX, TSX, TS) and pull every:
      [text](/path)                markdown link
      href="/path"                 plain attribute
      href/url/link: "/path"       route data literal
  - Strip #anchor and ?query.
  - Compare against discovered route set; flag any miss or slashless page URL
    that would redirect on GitHub Pages.

Skipped:
  - External URLs (http://, https://, mailto:, tel:)
  - Anchor-only (#section)
  - Interpolated paths (href={someVar}); the rendered HTML check catches many
    of these after build.
  - Lines containing <!-- NOLINKCHECK -->
"""

from __future__ import annotations
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / 'src' / 'pages'
CHAPTERS = ROOT / 'src' / 'content' / 'chapters'
PUBLIC = ROOT / 'public'

PROSE_GLOBS = ['src/**/*.astro', 'src/**/*.mdx', 'src/**/*.tsx', 'src/**/*.ts']
ESCAPE = '<!-- NOLINKCHECK -->'

# Markdown: [text](/path)  — path must start with / and not be //
MD_LINK_RE = re.compile(r'\[[^\]]*\]\((/(?!/)[^)\s]*)\)')
# Astro/HTML: href="/path" or href='/path'  — path must start with /
HREF_RE = re.compile(r'href=(?P<q>["\'])(/(?!/)[^"\'\s>]*)(?P=q)')
# Route data: href/url/link: '/path' in TS/TSX/Astro frontmatter.
PROP_ROUTE_RE = re.compile(r'\b(?:href|url|link):\s*(?P<q>["\'])(/(?!/)[^"\'\s]*)\1')


def chapter_slugs() -> set[str]:
    slugs: set[str] = set()
    if not CHAPTERS.is_dir():
        return slugs
    rx = re.compile(r'^\s*slug:\s*["\']([^"\']+)["\']', re.MULTILINE)
    for f in CHAPTERS.glob('*.mdx'):
        text = f.read_text(encoding='utf-8', errors='ignore')
        m = rx.search(text)
        if m:
            slugs.add(m.group(1))
    return slugs


def discover_routes() -> set[str]:
    routes: set[str] = set()
    if not PAGES.is_dir():
        return routes
    for f in PAGES.rglob('*'):
        if not f.is_file():
            continue
        rel = f.relative_to(PAGES)
        parts = list(rel.parts)
        name = parts[-1]

        # Skip dynamic-slug files; handled separately
        if '[' in name:
            # Look up the parent directory; if a [slug].astro exists, we'll
            # register /<parent-dir>/<slug> for each chapter slug below.
            continue

        # Strip the file extension chain (.astro, .json.ts, .xml.ts, .ts, .mdx)
        if name.endswith('.astro'):
            base = name[: -len('.astro')]
        elif name.endswith('.json.ts'):
            base = name[: -len('.ts')]  # keep .json
        elif name.endswith('.xml.ts'):
            base = name[: -len('.ts')]  # keep .xml
        elif name.endswith('.ts'):
            base = name[: -len('.ts')]
        elif name.endswith('.mdx'):
            base = name[: -len('.mdx')]
        else:
            continue

        # Build route path
        dir_parts = parts[:-1]
        if base == 'index':
            route = '/' + '/'.join(dir_parts) if dir_parts else '/'
        else:
            route = '/' + '/'.join(dir_parts + [base])
        routes.add(route.rstrip('/') or '/')

    # Dynamic chapter routes
    if (PAGES / 'chapters' / '[slug].astro').is_file():
        for slug in chapter_slugs():
            routes.add(f'/chapters/{slug}')

    # Static assets served from public/ at root
    if PUBLIC.is_dir():
        for f in PUBLIC.rglob('*'):
            if f.is_file():
                rel = f.relative_to(PUBLIC).as_posix()
                routes.add('/' + rel)

    return routes


def normalize(link: str) -> str:
    # Strip anchor and query
    for sep in ('#', '?'):
        if sep in link:
            link = link.split(sep, 1)[0]
    # Collapse trailing slash for matching (except root)
    if len(link) > 1 and link.endswith('/'):
        link = link.rstrip('/')
    return link or '/'


def extract_links(text: str) -> list[tuple[int, str]]:
    """Return list of (line_no, link)."""
    out: list[tuple[int, str]] = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        if ESCAPE in line:
            continue
        for m in MD_LINK_RE.finditer(line):
            out.append((line_no, m.group(1)))
        for m in HREF_RE.finditer(line):
            out.append((line_no, m.group(2)))
        for m in PROP_ROUTE_RE.finditer(line):
            out.append((line_no, m.group(2)))
    return out


def main() -> int:
    routes = discover_routes()
    if not routes:
        print('No routes discovered under src/pages/.', file=sys.stderr)
        return 1

    fails: list[tuple[str, int, str]] = []
    canonical_fails: list[tuple[str, int, str, str]] = []
    for pattern in PROSE_GLOBS:
        for f in sorted(ROOT.glob(pattern)):
            text = f.read_text(encoding='utf-8', errors='ignore')
            for line_no, raw in extract_links(text):
                normalized = normalize(raw)
                if normalized in routes:
                    raw_path = raw.split('#', 1)[0].split('?', 1)[0]
                    last_segment = normalized.rsplit('/', 1)[-1]
                    is_page_route = normalized != '/' and '.' not in last_segment
                    if is_page_route and not raw_path.endswith('/'):
                        canonical_fails.append((str(f.relative_to(ROOT)), line_no, raw, normalized + '/'))
                    continue
                fails.append((str(f.relative_to(ROOT)), line_no, raw))

    if not fails and not canonical_fails:
        print(f'✓ internal-links OK — {len(routes)} routes discovered, all references resolve')
        return 0

    # Group by file for readability
    if fails:
        print(f'Dead internal links — {len(fails)} reference(s) point at routes that do not exist:')
        last_file = None
        for path, line_no, link in fails:
            if path != last_file:
                print(f'\n  {path}:')
                last_file = path
            print(f'    {line_no}:  {link}')

    if canonical_fails:
        print(f'Non-canonical internal links — {len(canonical_fails)} page reference(s) should use trailing slash URLs:')
        last_file = None
        for path, line_no, link, expected in canonical_fails:
            if path != last_file:
                print(f'\n  {path}:')
                last_file = path
            print(f'    {line_no}:  {link}  →  {expected}')

    print()
    print('Fix options:')
    print('  (a) update the link to a real route, OR')
    print('  (b) create the page at src/pages/<route>.astro, OR')
    print('  (c) add <!-- NOLINKCHECK --> to the line if intentional (e.g. external proxy)')
    return 1


if __name__ == '__main__':
    sys.exit(main())
