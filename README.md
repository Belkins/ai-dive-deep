<div align="center">

# Vlad's Playbook

### The Ultimate AI Dive Deep

**A 45-chapter operator field manual where every artifact is live, clickable, and forwardable.**

### → [**Read it: dive.vladyslavpodoliako.com**](https://dive.vladyslavpodoliako.com) ←

[![Edition](https://img.shields.io/badge/edition-10.0-FF6B2C?style=flat-square)](https://dive.vladyslavpodoliako.com/changelog) &nbsp;
[![Live](https://img.shields.io/badge/site-live-22D3A0?style=flat-square)](https://dive.vladyslavpodoliako.com) &nbsp;
[![License: code MIT, content CC BY-NC-SA 4.0](https://img.shields.io/badge/license-MIT%20%2B%20CC%20BY--NC--SA-71717A?style=flat-square)](./LICENSE)

</div>

---

## The thesis: **HTML-ization**

Stop sending dead files. Every report, pitch, audit, deck, and analysis ships
as a live interactive HTML artifact on a deployed link — not a PDF attachment
that started rotting the second it was exported. The link is current because
the repo is. People forward links; they archive PDFs unread.

**This repo is the proof.** The book about building this kind of artifact is,
itself, this kind of artifact — a private GitHub repo deployed to a public
link, updated by commit, with two real interactive case studies embedded and
clickable inside it.

→ Read the thesis + click the embeds: [dive.vladyslavpodoliako.com/html-first](https://dive.vladyslavpodoliako.com/html-first)

---

## Read it (the site is the book)

The repo is how it's built. The site is what it IS.

| Surface | What's there | Live link |
|---|---|---|
| **All 45 chapters** | The whole book, MDX-rendered, with TL;DRs, glossary tooltips, code blocks, and the receipts behind every claim | [`/chapters`](https://dive.vladyslavpodoliako.com/sections) |
| **Fable 5 — the model file** | A hub + 9 spokes on Claude Fable 5 / Mythos 5: pricing, the full benchmark table, the head-to-heads, use cases, the API, and the **system card read honestly** — ten documented pre-release behaviors, each mapped to the guardrail it demonstrates | [`/fable-5`](https://dive.vladyslavpodoliako.com/fable-5) |
| **HTML-ization** | The flagship — thesis + 3 embedded live artifacts (AFC pitch deck, AFC robot stable, sanitized client deliverability audit) | [`/html-first`](https://dive.vladyslavpodoliako.com/html-first) |
| **Tier list** | Every tool ranked without diplomatic phrasing, plus the live LMArena leaderboard widget | [`/tier-list`](https://dive.vladyslavpodoliako.com/tier-list) |
| **Cheat sheet** | 16 reference sections — slash commands, settings keys, hook JSON shape, permission syntax, model routing — printable | [`/cheat-sheet`](https://dive.vladyslavpodoliako.com/cheat-sheet) |
| **Glossary** | 67 terms, A–Z, linked inline throughout the chapters | [`/glossary`](https://dive.vladyslavpodoliako.com/glossary) |
| **Resources** | Copy-paste templates: CLAUDE.md skeletons, .mcp.json, hooks, SKILL.md, subagent .md, Docker sandbox + devcontainer, 18 reusable prompts | [`/resources`](https://dive.vladyslavpodoliako.com/resources) |
| **Research notes** | 11 external signals that shift what to do Monday — sourced, dated, signal-vs-receipt discipline | [`/research-notes`](https://dive.vladyslavpodoliako.com/research-notes) |
| **The 12-rule CLAUDE.md** | Karpathy's 4 + 8 operator additions, with a receipt per rule | [`/claude-md-rules`](https://dive.vladyslavpodoliako.com/claude-md-rules) |
| **For your CFO** | 600-word defense memo. Defend the spend. | [`/cfo-case`](https://dive.vladyslavpodoliako.com/cfo-case) |
| **30-day plan** | Custom roadmap with markdown + .ics export | [`/thirty-day-plan`](https://dive.vladyslavpodoliako.com/thirty-day-plan) |

Press **⌘K** anywhere on the site — search every chapter, page, section
anchor, glossary term, and research note from one box. A dismissible
**"what's new" bar** at the top of every page surfaces the latest ship with its
edition and date, driven by the changelog so it never drifts.

---

## The 3 case studies, embedded and clickable

The HTML-ization page doesn't *describe* the method — it shows it, with three
real artifacts the operator-Claude workflow produced:

- **AFC — the pitch deck.** Vlad's "Autonomous Fighting Championship" — a
  dinner-table idea ("robots in an octagon"); friends asked for a deck; one got
  spun up fast as interactive HTML before the next meeting did. ([open it](https://dive.vladyslavpodoliako.com/artifacts/afc-pitch.html))
- **AFC — the robot stable.** Companion doc: every humanoid platform shipping
  in 2026, filterable, with a profit-per-fighter calculator. ([open it](https://dive.vladyslavpodoliako.com/artifacts/afc-robots.html))
- **The 90-domain deliverability audit (sanitized sample).** A real Folderly
  external audit of a ~90-domain / ~5K-mailbox cold-email estate — swarmed in
  days, delivered as a clickable interactive doc instead of a 40-page PDF.
  Client, every domain, every infra fingerprint de-identified before
  publication. ([open it](https://dive.vladyslavpodoliako.com/artifacts/deliverability-audit-sample.html))

---

## What's in this repo (the receipts)

- **45 chapters** in `src/content/chapters/*.mdx`
- **29 React/Astro widgets** in `src/widgets/` (live LMArena leaderboard, sortable tier list, command palette, token-burn calculator, swarm visualizer, persona-agent walkthrough, …)
- **46 standalone pages** in `src/pages/` (the surfaces in the table above + the `/fable-5` model file & its 9 spokes, the journey, sections index, showcase, vault starter, weekend builds, and more)
- **67 glossary terms** in `src/lib/glossary.ts`
- **11 dated research notes** in `src/lib/research-notes.ts`
- **3 embedded interactive artifacts** in `public/artifacts/` — single-file, self-contained, sandboxed-iframe-embedded on `/html-first`
- **18 copy-paste prompt templates + 9 hook templates + 5 CLAUDE.md skeletons + 8 SKILL.md templates** in `src/lib/snippets.ts`

The auto-updated [LMArena leaderboard widget](https://dive.vladyslavpodoliako.com/tier-list)
pulls live from the HuggingFace datasets-server API — the rest of the site is
static HTML.

---

## How it's built (5 bullets)

1. **Astro 5** static site generator (`astro build`). Server components by
   default; React 18 islands only where interaction needs them.
2. **MDX** for chapter content with custom Astro components
   (`<Callout>`, `<PullQuote>`, `<TLDR>`, `<ScreenshotPlaceholder>`,
   `<GlossaryTooltip>`).
3. **Tailwind 3** with project design tokens
   (`--accent: #FF6B2C`, `--paper`, `--line`, etc.).
4. **GitHub Pages** auto-deploy via `.github/workflows/deploy.yml` — push to
   `main`, live in ~90 seconds at `dive.vladyslavpodoliako.com`.
5. **Built by a swarm of Claude Code agents in parallel** — content migration,
   widget builds, design system, security scrubbing, deploy pipeline. The
   process is the technique the book describes; the artifact IS the technique.

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output → dist/
npm run preview  # serve dist/ locally
```

Requires Node 20+.

---

## Add a chapter

1. Drop a new MDX file into `src/content/chapters/` matching the schema in
   `src/content/config.ts`.
2. Add the chapter to the ordered list in `src/lib/chapters.ts`.
3. The dynamic route at `src/pages/chapters/[slug].astro` picks it up.

To add a whole new page (resources, /tier-list-style surface, etc.), the
six wiring surfaces are codified in the
[`playbook-new-page`](https://github.com/Belkins/ai-dive-deep) skill: page
file · ⌘K index · chapter cross-link · glossary term · **homepage tile** ·
changelog.

---

## Credits

Written and built by **Vlad Podoliako** — Founder & CEO of [Belkins](https://belkins.com),
founder of [Folderly](https://folderly.com), and operator across a portfolio
of others.

- 📬 [Vlad's Newsletter](https://www.vladsnewsletter.com) (10K+ subscribers)
- 🌐 [vladyslavpodoliako.com](https://vladyslavpodoliako.com)
- 🎧 [Spotify (AI-native music side project)](https://open.spotify.com/artist/48kwMgLHicP6nqaI8Xc3rN)

The book teaches the technique. The artifact IS the technique. The repo is
how it's built — but **the site is what it IS.**

### → [dive.vladyslavpodoliako.com](https://dive.vladyslavpodoliako.com)

---

## License

- **Code** — MIT. Copy the Astro + Tailwind + widget structure into your own
  living-link artifacts; that's the entire point.
- **Content** — CC BY-NC-SA 4.0. Read it, share it, quote it, credit it; don't
  resell it.

See [`LICENSE`](./LICENSE).
