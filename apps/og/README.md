# ai-dive-deep-og

Vercel sidecar that generates dynamic Open Graph images for tier-list shares from
[dive.vladyslavpodoliako.com/tier-list/](https://dive.vladyslavpodoliako.com/tier-list/).

The main site is GitHub Pages (static), so it can't generate dynamic OG images.
This sidecar runs as a separate Vercel project on `og.vladyslavpodoliako.com`.

## Why

Today: when someone shares `dive.vladyslavpodoliako.com/tier-list/#tl=...`, Twitter
and LinkedIn unfurl with Vlad's generic `og-default.svg`. Recipients don't see the
friend's actual tier list.

After: every share's unfurl IS the recipient's tier list. Lifts unfurl-to-click 4-8x
in this category (Vercel internal data on `@vercel/og`).

## Endpoints

| Path | What it does |
|------|--------------|
| `GET /api/og/tier-list?tl=<base64>` | Renders 1200×630 PNG of the tier list. `tl` is the same base64-encoded JSON the TierListBuilder uses (`{ "Claude Code": "S", ... }`). Missing/invalid → fallback "Build your own tier list" PNG. |
| `GET /s/<base64>` | Share landing page. Serves HTML with `og:image` pointing at the PNG, plus a 0-second `meta refresh` that bounces real users to `dive.vladyslavpodoliako.com/tier-list/#tl=<base64>` after the bot has scraped. |

## One-time setup

```bash
cd apps/og
npm install
npx vercel link            # create a NEW Vercel project — name it ai-dive-deep-og
npx vercel deploy --prod
```

Then in the Vercel dashboard:

1. **Project → Settings → Domains** → add `og.vladyslavpodoliako.com`.
2. **At GoDaddy** (or wherever the apex is registered), add a CNAME:
   - host: `og`
   - value: `cname.vercel-dns.com` (Vercel will show the exact value)
   - TTL: 1 hour
3. Wait for DNS propagation (1–10 min), then Vercel will auto-issue the cert.

## Verify deploy

```bash
# Direct PNG render — should return a PNG showing Claude Code in tier S
curl -I "https://og.vladyslavpodoliako.com/api/og/tier-list?tl=eyJDbGF1ZGUgQ29kZSI6IlMifQ=="

# Visit in browser
open "https://og.vladyslavpodoliako.com/api/og/tier-list?tl=eyJDbGF1ZGUgQ29kZSI6IlMifQ=="

# Share page — should respond 200 HTML with og:image meta tag
curl -s "https://og.vladyslavpodoliako.com/s/eyJDbGF1ZGUgQ29kZSI6IlMifQ==" | grep og:image
```

Expected:
- The PNG shows the dark `#0E0F11` background, "VLAD'S ULTIMATE AI DIVE DEEP" header,
  6 colored tier rows, "Claude Code" pill on row S, and the footer URL.
- The share page returns 200 with a working `og:image` meta tag.
- Visiting the share page in a real browser bounces to the main site (`#tl=...`)
  within < 1 second.

## Cutover (do this AFTER the deploy is verified)

The main site's share button needs ONE line changed in
`src/widgets/TierListBuilder.tsx`. Current code (around line 108-116):

```js
const data = btoa(JSON.stringify(placements));
const url = `${window.location.origin}${window.location.pathname}#tl=${encodeURIComponent(data)}`;
```

Change the second line to:

```js
const data = btoa(JSON.stringify(placements));
const url = `https://og.vladyslavpodoliako.com/s/${encodeURIComponent(data)}`;
```

That's it. Now every shared link unfurls with the recipient's actual tier list, then
redirects them to the live interactive builder when they click through.

## What does this cost?

- `@vercel/og` on Hobby tier: **free up to 1M images/month**.
- Sidecar deploy on Vercel Hobby: **free**.
- Domain: already owned (`vladyslavpodoliako.com` apex; we just add a subdomain).

If usage ever crosses the free tier (it won't for a long time), upgrade the
Vercel project to Pro.

## Local dev

```bash
cd apps/og
npm install
npx vercel dev          # serves at http://localhost:3000
# Test:
open "http://localhost:3000/api/og/tier-list?tl=eyJDbGF1ZGUgQ29kZSI6IlMifQ=="
```
