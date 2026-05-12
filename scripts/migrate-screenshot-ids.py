#!/usr/bin/env python3
"""One-time migration: add `id="<chapter-slug>-<n>"` to every existing
ScreenshotPlaceholder in src/content/chapters/*.mdx that doesn't already
have one. Idempotent — re-running is safe (won't double-assign).

After this runs, every screenshot slot has a stable target filename.
Vlad knows exactly what to name his PNGs:

  public/screens/01-killed-my-tabs-1.png
  public/screens/01-killed-my-tabs-2.png
  public/screens/02-five-tools-1.png
  ...
"""
import os, re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHAPTERS = os.path.join(REPO, 'src', 'content', 'chapters')

# Match the whole <ScreenshotPlaceholder ... /> JSX (lazy, allows `/` in attrs).
TAG_RE = re.compile(r'<ScreenshotPlaceholder\b([\s\S]*?)/>', re.DOTALL)

def has_id_attr(attrs: str) -> bool:
    return bool(re.search(r'\bid\s*=', attrs))

def main():
    total_added = 0
    total_seen = 0
    for fname in sorted(os.listdir(CHAPTERS)):
        if not fname.endswith('.mdx'):
            continue
        path = os.path.join(CHAPTERS, fname)
        slug = fname[:-4]  # strip .mdx
        with open(path, 'r') as f:
            text = f.read()

        # Iterate over tags in order, assigning ordinal n based on appearance.
        counter = [0]

        def replace(m):
            counter[0] += 1
            attrs = m.group(1)
            nonlocal_seen[0] += 1
            if has_id_attr(attrs):
                return m.group(0)  # already has id — preserve
            # Insert id at the start of the attribute block
            new_id = f'{slug}-{counter[0]}'
            nonlocal_added[0] += 1
            return f'<ScreenshotPlaceholder\n  id="{new_id}"' + attrs + '/>'

        nonlocal_added = [0]
        nonlocal_seen = [0]
        new_text = TAG_RE.sub(replace, text)

        if nonlocal_added[0]:
            with open(path, 'w') as f:
                f.write(new_text)
            print(f"  {slug}: +{nonlocal_added[0]} ids ({nonlocal_seen[0]} total slots)")
        total_added += nonlocal_added[0]
        total_seen += nonlocal_seen[0]
    print(f"\nDone. Added {total_added} ids across {total_seen} total slots.")

if __name__ == '__main__':
    main()
