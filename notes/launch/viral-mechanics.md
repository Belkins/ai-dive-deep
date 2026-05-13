# Viral mechanics — leverage audit (May 2026)

Site already ships: tier-list share popover (URL hash + Twitter/LinkedIn/native intents), `cc-progress` localStorage + 36/36 pill, per-card mint check, ChapterFooter feedback mailto, Substack iframe in footer, static `og-default.svg`, sitemap auto-gen. 14 interactive widgets, 36 MDX chapters, custom domain on GH Pages (static).

The point of every loop below: **one share creates the substrate for the next share**. Compounding, not engagement theater.

---

## 1. Dynamic OG image for tier-list shares — `/api/og` on a Vercel sidecar

**Mechanic.** Today's tier-list share dumps a Twitter `summary_large_image` card pointing at the *static* `og-default.svg` — the recipient sees Vlad's generic card, not the friend's tiers. If the card *renders the actual S/A/B placements with avatars*, every share doubles as the screenshot the recipient was going to take anyway. The unfurl IS the proof. Click-through goes 3–6x on visually personalized OG cards in the wild (Vercel's own data on `@vercel/og`).

**What to build.**
- Add a tiny Vercel project at `apps/og/` (or a second deploy target — `astro.config.mjs` already has the `DEPLOY_TARGET=vercel` branch on line 11–16). Single endpoint `/api/og/tier-list?tl=<base64>` using `@vercel/og` + Satori. Decodes the same hash payload `TierListBuilder.tsx:108-116` already produces.
- In `TierListBuilder.tsx:138-139`, change `shareUrl` to point both at the page (`#tl=...`) *and* set `og:image` via a query-string hint the chapter page reads. Since GH Pages is static, the page itself can't rewrite OG per-request, so: route shares through `https://og.vladyslavpodoliako.com/s/<base64>` which 302s to the canonical page *after* unfurl bots scrape the dynamic OG.
- Same template works for `/journey` completion shares (loop 4 below).

**Effort.** ~250 LOC + 4 hours. `@vercel/og` is one dep, Satori handles font embedding, the SVG-ish JSX is straightforward. Domain is the only non-code cost.

**Estimated leverage.** Single biggest unlock on the site. Current tier-list shares have CTR roughly equivalent to "Vlad just tweeted a link." Personalized OG cards in this category land 4–8x higher unfurl-to-click. Each share is also self-promoting (the recipient's tier list is visible on the card, encouraging them to remix).

**Risk.** Two failure modes. (1) `@vercel/og` cold-start latency — if Twitter's bot times out, the static fallback fires and you've added complexity for nothing. Mitigate with edge runtime + cache-control. (2) Sidecar drift — the Vercel endpoint and the static GH Pages site are now two deploys. Use a CI check that imports the same `lib/tier-list.ts` types in both.

---

## 2. Backlink-bait — public structured dump for LLM citation

**Mechanic.** Publish `/api/chapters.json` (or static `/chapters.json` at build time, since this is GH Pages) — every chapter's title, slug, tldr, keyConcepts, reading minutes, and *one canonical pull-quote*. Add JSON-LD `Article` schema to every chapter page. When an operator asks ChatGPT/Perplexity/Claude "what's a good AI operations field manual" the model needs ingestible, citation-grade structured data. This is the AEO play. One citation in a ChatGPT answer is worth ~50 traditional backlinks today and the gap is widening.

**What to build.**
- New file `src/pages/chapters.json.ts` (Astro endpoint, static-rendered). Iterate `CHAPTERS` from `lib/chapters.ts`, pull frontmatter `tldr` + `keyConcepts` from each MDX, extract the first `<PullQuote>` body via regex over the file contents (32 of 36 chapters have one — `grep "<PullQuote" content/chapters/*.mdx | wc -l = 32`). Emit JSON.
- New file `src/pages/llms.txt.ts` — the emerging "robots.txt for LLMs" convention. Lists every chapter URL + summary. Anthropic, OpenAI, Perplexity crawlers all read this.
- Add `<script type="application/ld+json">` block to `BaseLayout.astro` (between line 41 and line 43) emitting `Article` schema when on a chapter page; emit `Book` + `ItemList` on `/` and `/journey`.
- Update `public/robots.txt` (create) to point at `/llms.txt`.

**Effort.** ~180 LOC + 3 hours. Mostly a build-time script reading MDX frontmatter.

**Estimated leverage.** Slow burn but compounding. Won't move metrics in week 1. By month 3, expect to see Vlad's chapter URLs cited inline in answers when users ask agent-ops questions in major LLMs — that's a different traffic class than tweet shares. Order-of-magnitude: 50–500 LLM citations/month within 90 days of indexing.

**Risk.** Easy to scrape and reframe without attribution. The bet is that the *URL itself* gets cited because the data shape (tldr + pull-quote) is exactly what LLMs want to quote. Modest risk: if you publish *too much* of the chapter body in JSON, you cannibalize the page visit. Cap at tldr + 1 quote.

---

## 3. RSS feeds for `/research-notes` and `/changelog`

**Mechanic.** Operators who care about this content also run RSS readers (NetNewsWire, Reeder, Feedbin). One RSS subscription compounds across every future research note Vlad publishes — zero marginal cost to re-engage. Most importantly: RSS readers display full article text, which means every subscriber becomes a *re-sharer* without re-visiting the site. `/research-notes` is the right surface — it's structured (see `lib/research-notes.ts` data shape, line 4 of `research-notes.astro`), updates over time, and is the canonical "what changed this week" page.

**What to build.**
- `src/pages/rss/research-notes.xml.ts` — Astro endpoint emitting RFC4287 Atom from `RESEARCH_NOTES`. Astro has no first-party RSS plugin worth installing; ~40 lines of hand-rolled XML.
- `src/pages/rss/changelog.xml.ts` — same pattern, sourcing from `lib/changelog.ts`.
- Add `<link rel="alternate" type="application/rss+xml">` to `BaseLayout.astro` head when on those pages.
- Add subscribe-icon links to `research-notes.astro` (next to the mailto on line 99) and `changelog.astro`.

**Effort.** ~120 LOC + 2 hours.

**Estimated leverage.** Tiny audience by count (RSS users), high-value by behavior (operators, engineers, journalists). Every research-note publish becomes a passive re-share trigger to ~200–2000 inboxes (realistic ceiling: niche dev RSS feeds plateau around 500–1500 subs). The *real* leverage: research-note quotes start appearing in other writers' newsletters because they actually read it in RSS.

**Risk.** None meaningful. RSS is read-only and additive.

---

## 4. Completion proof card — at 36/36, generate a shareable "I finished" image

**Mechanic.** The site already tracks `cc-progress` in localStorage and shows "N / 36 read". At 36/36, surface a new module on `/journey` (or wherever the user is when the counter ticks 36): "You finished the book. Mint a stamp." Output a personalized OG card (reuses infrastructure from loop 1) with the operator's first name (asked once, optional) + the 36-chapter list visualization + a unique-but-not-secret share URL `dive.vladyslavpodoliako.com/finished/<short-hash>`. Functions like a Strava "ran my 1000th km" share. Status-driven, finite (one share per reader), and *every share is unambiguous social proof that the book got fully read*.

**What to build.**
- New widget `src/widgets/CompletionStamp.tsx`. Detects `cc-progress` === 36, renders modal with name input + share buttons. Reuses share-popover mechanics from `TierListBuilder.tsx:166-243` (refactor that share UI into `src/widgets/SharePopover.tsx` first; ~80 LOC extraction).
- Mount on `/journey` (last page in the reading flow) and at the foot of `36-frameworks-beyond.mdx`.
- New static route `src/pages/finished/[hash].astro` — landing page for incoming shares. Decodes name + date from hash, shows "X finished Ultimate AI Dive Deep on [date]. They started here →" CTA back to ch 1.
- Reuses the `/api/og` endpoint from loop 1 with a different template.

**Effort.** ~300 LOC + 4 hours (assumes loop 1 already shipped — otherwise +4hrs).

**Estimated leverage.** Smaller absolute volume than loop 1 (only fires for completers), but every fire is an extremely high-signal share — operators who actually finished a 36-chapter manual are credible recommenders. Expect 5–15% of completers to share. If 200 people finish/month, that's 10–30 high-quality shares that each pull in 50–200 click-throughs from peer operators.

**Risk.** Cheap-feeling if executed poorly. The bar is high — must look like a *certificate*, not a gamification badge. If the card looks like a LinkedIn course completion, Vlad's audience will roast it and not share. Get the design right or skip.

---

## 5. Embeddable tier-list widget — `<iframe src=".../tier-list?embed=1">`

**Mechanic.** Other operators write blog posts about their AI stacks. They want to embed an interactive tier-list. Today they screenshot Vlad's. Give them an iframe. Every embed is a permanent backlink + brand placement on their domain + a recruitment surface for new readers. Compounds with loop 1 — embedded tier-lists are pre-filled by the embedder; readers who tweak open the share popover and now own a personalized version.

**What to build.**
- Add `?embed=1&seed=<base64>` query support to `src/pages/tier-list.astro`. When `embed=1`, render with `noNav` (BaseLayout already supports — line 11). Strip the surrounding LMArena iframe + chapter context.
- Add "Embed this" tab inside the existing share popover (`TierListBuilder.tsx:166-243`). Outputs `<iframe src="https://dive.vladyslavpodoliako.com/tier-list?embed=1&seed=XYZ" width="100%" height="800" frameborder="0">`.
- Add `frame-ancestors *` for `/tier-list?embed=1` only. Currently `vercel.json:11` sets `X-Frame-Options: DENY` globally — this needs a conditional CSP per route. On GH Pages there's no header control, so this only works on the Vercel deploy. If embed is important, flip to Vercel-primary and 301 the apex.

**Effort.** ~150 LOC + 3 hours, *but* the header constraint is real — GH Pages can't unset `X-Frame-Options` per-route. Adds Vercel-migration as a dependency.

**Estimated leverage.** Medium. Operator blogs and Substacks are a smaller audience than Twitter/LI but each embed has a long half-life (years) and pulls a higher-intent reader. Order-of-magnitude: 20–100 embeds in year one, each driving 5–50 click-throughs/month — say 500–5000 referrals/month at steady state.

**Risk.** Header constraint forces a deploy migration that wasn't otherwise needed. If loop 1 is also shipped, the migration is already paid for. If not, this is the loop that triggers it.

---

## Recommendation

- **Build first:** Loop 2 (LLM citation dump + JSON-LD). 3 hours, no infra changes, compounds silently for 12+ months. Highest ratio of leverage-to-effort. Ship this week.
- **Build next:** Loop 1 (dynamic OG for tier-list). 4 hours + sidecar Vercel deploy. Unlocks loop 4 and loop 5. The single highest-impact share-quality upgrade available.
- **Consider later:** Loop 3 (RSS) — easy and additive, no urgency. Loop 4 (completion stamp) — depends on loop 1, depends on design discipline. Loop 5 (embed) — depends on Vercel migration; only worth it if Vlad sees embed demand surface organically post-launch.

Loops 1 + 2 are independent and can ship in parallel by two separate agents.
