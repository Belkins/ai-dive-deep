#!/usr/bin/env python3
"""
check-external-links.py — catch rotted external URLs in the published prose.

The risk this catches: /learn (and chapters) link out to ~30 course/resource
URLs on vendor domains. check-internal-links.py deliberately skips http(s)://,
so an external link that 404s or moves ships silently. This is the missing guard.

NOT in prebuild on purpose: it makes live network calls (slow + flaky), and a
vendor rate-limiting for 30 seconds must never break a deploy. Run it manually
(`npm run lint:external`) or on a schedule, and re-stamp the "Links verified"
date on /learn after a clean run.

Modes:
  default     fetch every unique external URL; report dead ones; ALWAYS exit 0
              (soft — a flaky vendor is not a build failure)
  --strict    exit 1 if any non-allowlisted URL is dead (use in a cron/CI gate)

Allowlist: some live pages return 403/anti-bot or a login redirect to automated
clients (OpenAI Academy, Perplexity, Google AI Studio, the platform.claude.com
SPA). Those are reported as ANTI-BOT (live for browsers), never as dead.
"""

from __future__ import annotations
import argparse
import concurrent.futures
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GLOBS = ['src/pages/*.astro', 'src/content/chapters/*.mdx', 'src/lib/*.ts']

URL_RE = re.compile(r'https?://[^\s"\'<>)\]}`]+')

# Hosts we never check (analytics, fonts, schema, our own site, code-sample noise).
SKIP_SUBSTR = [
    'fonts.googleapis.com', 'fonts.gstatic.com', 'googletagmanager.com',
    'posthog.com', 'i.posthog.com', 'schema.org', 'www.w3.org',
    'dive.vladyslavpodoliako.com', 'belkins.github.io',
    'localhost', '127.0.0.1', 'example.com', 'your-', 'api.anthropic.com',
]

# Live-but-bot-hostile: 403 / login redirect to crawlers, fine in a browser.
ANTIBOT_SUBSTR = [
    'openai.com/academy', 'perplexity.ai', 'aistudio.google.com',
    'platform.claude.com',
]

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36')

TIMEOUT = 12


def clean(url: str) -> str:
    return url.rstrip('.,;:)]}>"\'')


def collect() -> dict[str, list[str]]:
    """url -> sorted list of files it appears in."""
    found: dict[str, set[str]] = {}
    for g in GLOBS:
        for f in sorted(ROOT.glob(g)):
            text = f.read_text(encoding='utf-8', errors='ignore')
            for m in URL_RE.finditer(text):
                url = clean(m.group(0))
                if any(s in url for s in SKIP_SUBSTR):
                    continue
                # Skip code samples / template interpolation ($TOKEN, ${city}, backticks).
                if any(c in url for c in '${}`'):
                    continue
                found.setdefault(url, set()).add(str(f.relative_to(ROOT)))
    return {u: sorted(fs) for u, fs in found.items()}


def fetch(url: str) -> tuple[str, int | None, str]:
    """Return (url, status_or_None, note). Tries HEAD then GET."""
    for method in ('HEAD', 'GET'):
        try:
            req = urllib.request.Request(url, method=method, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                return (url, r.status, '')
        except urllib.error.HTTPError as e:
            if e.code in (403, 405, 429) and method == 'HEAD':
                continue  # retry with GET
            return (url, e.code, '')
        except Exception as e:  # noqa: BLE001 — network/DNS/timeout all "dead-ish"
            if method == 'HEAD':
                continue
            return (url, None, type(e).__name__)
    return (url, None, 'unreachable')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--strict', action='store_true', help='exit 1 on dead links')
    args = ap.parse_args()

    urls = collect()
    if not urls:
        print('✓ external-links: no external URLs found')
        return 0

    results: dict[str, tuple[int | None, str]] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
        for url, status, note in ex.map(fetch, urls.keys()):
            results[url] = (status, note)

    ok, antibot, dead = [], [], []
    for url in sorted(urls):
        status, note = results[url]
        # 401/403/429 are access/rate blocks (live for browsers), not missing pages.
        is_antibot = any(s in url for s in ANTIBOT_SUBSTR) or status in (401, 403, 429)
        if status is not None and status < 400:
            ok.append(url)
        elif is_antibot:
            antibot.append((url, status, note))
        else:
            dead.append((url, status, note))

    print(f'external-links: {len(urls)} unique URLs — '
          f'{len(ok)} ok, {len(antibot)} anti-bot (live for browsers), {len(dead)} dead')

    if antibot:
        print('\nANTI-BOT (allowlisted — verify in a browser if worried):')
        for url, status, note in antibot:
            print(f'  ~ [{status or note}] {url}')

    if dead:
        print('\nDEAD / BROKEN:')
        for url, status, note in dead:
            print(f'  ✗ [{status or note or "?"}] {url}')
            for f in urls[url]:
                print(f'        in {f}')
        print('\nFix: update the URL to its current location, or add the host to '
              'ANTIBOT_SUBSTR if it is live-but-bot-hostile.')
        if args.strict:
            return 1
    else:
        print('\n✓ no dead external links')

    return 0


if __name__ == '__main__':
    sys.exit(main())
