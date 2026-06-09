#!/usr/bin/env python3
"""Submit the live sitemap's URLs to IndexNow (Bing/Brave/Yandex/Naver ingestion).

Runs post-deploy in CI (.github/workflows/deploy.yml, `indexnow` job) so every
deploy re-announces the corpus; engines dedupe unchanged URLs on their side.
Bing's index is what ChatGPT search retrieves from, Brave's is Claude's — this
ping is the cheapest path into both. Stdlib only; no install step in CI.

Usage:
  python3 scripts/indexnow-ping.py            # verify key file is live, then ping
  python3 scripts/indexnow-ping.py --dry-run  # list URL count, POST nothing
"""

import json
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET

HOST = "dive.vladyslavpodoliako.com"
KEY = "7e0349e8e22fcf430e17c33b2b8dce02"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "indexnow-ping/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def sitemap_urls() -> list[str]:
    """All <loc> page URLs from the live sitemap index (or a flat sitemap)."""
    root = ET.fromstring(fetch(f"https://{HOST}/sitemap-index.xml"))
    if root.tag == f"{SITEMAP_NS}sitemapindex":
        children = [loc.text for loc in root.iter(f"{SITEMAP_NS}loc")]
        urls = []
        for child in children:
            urls += [loc.text for loc in ET.fromstring(fetch(child)).iter(f"{SITEMAP_NS}loc")]
        return urls
    return [loc.text for loc in root.iter(f"{SITEMAP_NS}loc")]


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    urls = sitemap_urls()
    if not urls:
        print("FAIL: sitemap yielded 0 URLs — refusing to ping")
        return 1
    print(f"sitemap: {len(urls)} URLs")

    if dry_run:
        print("dry-run: no POST sent")
        return 0

    live_key = fetch(KEY_LOCATION).decode().strip()
    if live_key != KEY:
        print(f"FAIL: {KEY_LOCATION} serves {live_key!r}, expected the key — not live yet?")
        return 1

    payload = json.dumps(
        {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": urls}
    ).encode()
    req = urllib.request.Request(
        ENDPOINT, data=payload, headers={"Content-Type": "application/json; charset=utf-8"}
    )
    for attempt in (1, 2):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                print(f"IndexNow: HTTP {resp.status} for {len(urls)} URLs")
                return 0
        except urllib.error.HTTPError as e:
            print(f"IndexNow attempt {attempt}: HTTP {e.code} {e.read().decode()[:200]}")
        except urllib.error.URLError as e:
            print(f"IndexNow attempt {attempt}: {e.reason}")
        if attempt == 1:
            time.sleep(10)
    return 1


if __name__ == "__main__":
    sys.exit(main())
