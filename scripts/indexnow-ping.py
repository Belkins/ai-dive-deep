#!/usr/bin/env python3
"""Submit changed page URLs to IndexNow (Bing/Brave/Yandex/Naver ingestion).

Runs post-deploy in CI (.github/workflows/deploy.yml, `indexnow` job). IndexNow
asks senders not to resubmit unchanged URLs, so the job compares two manifests
written by scripts/indexnow-manifest.mjs (page path -> hash of its <main>): the
one this build made and the one that was live before the deploy. Only new and
changed paths are sent; removed pages are not. With no readable previous
manifest, or --full, every page in the build manifest is sent once; with no
build manifest at all, the live sitemap is sent as before.
Bing's index is what ChatGPT search retrieves from, Brave's is Claude's — this
ping is the cheapest path into both. Stdlib only; no install step in CI.

Usage:
  python3 scripts/indexnow-ping.py            # verify key file is live, then ping
  python3 scripts/indexnow-ping.py --dry-run  # list URL count, POST nothing
  python3 scripts/indexnow-ping.py --manifest NEW.json --previous OLD.json [--full]
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


def load_manifest(path: str | None) -> dict[str, str] | None:
    """The manifest's {path: hash} map, or None when absent or unreadable."""
    if not path:
        return None
    try:
        with open(path, encoding="utf-8") as fh:
            pages = json.load(fh)["pages"]
    except (OSError, ValueError, KeyError, TypeError):
        return None
    if not isinstance(pages, dict) or not all(
        isinstance(k, str) and isinstance(v, str) for k, v in pages.items()
    ):
        return None
    return pages


def changed_paths(new: dict[str, str], previous: dict[str, str] | None) -> list[str]:
    """New and changed paths; every path when there is no previous manifest."""
    if previous is None:
        return sorted(new)
    return sorted(p for p, h in new.items() if previous.get(p) != h)


def arg_value(flag: str) -> str | None:
    if flag in sys.argv:
        i = sys.argv.index(flag)
        if i + 1 < len(sys.argv):
            return sys.argv[i + 1]
    return None


KNOWN_FLAGS = ("--dry-run", "--full", "--manifest", "--previous")
VALUE_FLAGS = ("--manifest", "--previous")


def unknown_arguments(args: list[str]) -> list[str]:
    """Arguments this script does not know. A typo must never fall through to a real send."""
    unknown, skip = [], False
    for a in args:
        if skip:
            skip = False
        elif a in VALUE_FLAGS:
            skip = True
        elif a not in KNOWN_FLAGS:
            unknown.append(a)
    return unknown


def main() -> int:
    args = sys.argv[1:]
    if "-h" in args or "--help" in args:
        print(__doc__)
        return 0
    unknown = unknown_arguments(args)
    if unknown:
        print(f"FAIL: unknown argument {unknown[0]!r}; nothing was sent. See --help.")
        return 2
    dry_run = "--dry-run" in sys.argv
    full = "--full" in sys.argv

    new = load_manifest(arg_value("--manifest"))
    previous = None if full else load_manifest(arg_value("--previous"))
    if new is None:
        urls = sitemap_urls()
        if not urls:
            print("FAIL: sitemap yielded 0 URLs — refusing to ping")
            return 1
        print(f"sitemap: {len(urls)} URLs (no build manifest; full resend)")
    else:
        paths = changed_paths(new, previous)
        urls = [f"https://{HOST}{p}" for p in paths]
        why = "full resend requested" if full else (
            "no readable previous manifest; full resend" if previous is None
            else "new or changed since the previous deploy")
        print(f"manifest: {len(new)} pages, {len(urls)} to submit ({why})")
        for u in urls:
            print(f"  submit: {u}")
        if not urls:
            print("nothing changed; no POST sent")
            return 0

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
