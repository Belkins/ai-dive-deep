# public/screens/

Drop your screenshots here. They'll appear in the rendered chapters automatically.

## How it works

1. Every `<ScreenshotPlaceholder />` in the MDX has an `id` (auto-assigned during migration).
   Example: chapter 01 has slots `01-killed-my-tabs-1` and `01-killed-my-tabs-2`.
2. To replace a placeholder with a real screenshot, save your image as:
   ```
   public/screens/<id>.{png,jpg,webp,gif,avif}
   ```
3. Run `npm run build` (or `npm run dev`). The prebuild step rescans this folder.
4. Anywhere the matching `id` exists in a chapter, the placeholder is replaced
   by your real image (with the original caption and note preserved underneath).
5. Push. Done.

## Where to look up the id

Each placeholder shows its expected id underneath the caption when no real
image exists (small mono text: `id: 01-killed-my-tabs-1 · drop 01-killed-my-tabs-1.png into public/screens/`).

Or grep:

```bash
grep -rE 'ScreenshotPlaceholder[\s\S]*?id="([^"]+)"' src/content/chapters/ | grep -oE 'id="[^"]+"'
```

## Naming conventions

- `<chapter-slug>-<n>.png` where `n` is the ordinal of the placeholder in that chapter.
- Lowercase, hyphen-separated. No spaces. No leading slash.
- Any of: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.avif`.

## Recommended specs

- 16:9 aspect ratio (default) — the placeholder shape.
- 1600×900 minimum for retina sharpness on desktop.
- WebP for the smallest file size; PNG fine for screenshots with sharp text.
- Sub-500 KB each is ideal; keeps the dist size in check.

## Privacy

This is a private repo, but the live site is public. Before saving any
screenshot here:
- Mask any contact names, channel IDs, deal names, mentee names, customer info.
- Mask OAuth tokens, API keys, session URLs.
- Mask Slack workspace identifiers if they reveal portfolio company internals.

When in doubt, take the screenshot in a fresh demo workspace.

## What gets ignored

`README.md` (this file) — not picked up as a screenshot.
Any extension not in `{png,jpg,jpeg,webp,gif,avif}` — silently skipped.

## Force-rescan

```bash
npm run screens
```

Or just `npm run build` — it runs the scan automatically.
