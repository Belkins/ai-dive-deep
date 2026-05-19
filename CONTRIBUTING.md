# Contributing

## Quick fixes (typos, broken links)

Open a PR. Keep it tight — one typo per commit is fine. Reference the chapter
slug in the title (e.g. `fix(ch-06): typo "subagets" → "subagents"`).

## Tier-list updates

Tools move tiers all the time. If you have first-hand evidence a tool's
moved (a real workflow you ran, not a tweet you saw), open an issue first.
Include:

- Tool name + current tier in `src/widgets/TierListBuilder.tsx::DEFAULT_PLACEMENTS`
- Proposed new tier
- One paragraph of receipts

We don't move based on hype cycles. We move based on operator-grade evidence.

## New chapters / future editions

Vlad maintains the canonical content. Out-of-band proposals welcome via the
[newsletter](https://www.vladsnewsletter.com) or [Discussions](https://github.com/Belkins/ai-dive-deep/discussions) — talk before writing.

## Widget improvements

Each widget lives at `src/widgets/<name>.tsx` and is hydrated only on the
chapter that needs it (`client:visible` or `client:load`). When adding a
widget:

1. Keep it under 200 lines — these are demo surfaces, not full apps.
2. No external API calls (the site is fully static; everything must work
   offline once loaded).
3. Match the design system in `src/styles/global.css` — `rgb(var(--accent))`,
   `rgb(var(--paper))`, etc.
4. Mobile-first; test at 320–414px.

## Code style

- TypeScript strict, no `any`.
- Tailwind classes for styling. CSS vars for theme tokens.
- Server components by default in Astro; client islands only where needed.

## Local dev

```bash
npm install
npm run dev
```
