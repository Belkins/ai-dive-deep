# Contributing

## How work is filed and reviewed

This repo runs the workflow the book's [/agent-workflow](https://dive.vladyslavpodoliako.com/agent-workflow)
page describes — most code here is written by AI and reviewed by humans, and
the process is built for that:

- **One issue is one pull request is one concern.** File from
  [.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/) — the bar is that an
  agent with no memory of the conversation can read the issue and open a
  mergeable PR. Rules live in [docs/workflow/](docs/workflow/); the config
  every command reads is [.claude/workflow-kit.json](.claude/workflow-kit.json).
- **Never commit to `main`.** Branch as `<type>/<issue>-<short-description>`
  (e.g. `feat/31-leads-import`). The PR title is the squash-commit subject —
  Conventional Commits, with `Closes #n`.
- **The review fleet runs before the PR opens** (`.github/scripts/review.sh plan`
  names the reviewers). No agent blocks a merge — CI is the only gate — but
  every finding is fixed or dismissed *in writing* in the PR's Reviewer notes.
- **State what you verified.** `npm run check` · `npm run build` (prebuild
  guards + postbuild checks) · `node --test tests/*.test.mjs` — paste the
  results; never claim a check passed without running it.

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
