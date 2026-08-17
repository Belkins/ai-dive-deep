<div align="center">

# Vlad's Playbook

### The Ultimate AI Dive Deep

**A 48-chapter operator field manual where every artifact is live, clickable, and forwardable — and the repo runs the discipline the book teaches.**

### → [**Read it: dive.vladyslavpodoliako.com**](https://dive.vladyslavpodoliako.com) ←

[![Edition](https://img.shields.io/badge/edition-13-FF6B2C?style=flat-square)](https://dive.vladyslavpodoliako.com/changelog) &nbsp;
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
itself, this kind of artifact — a repo deployed to a public link, updated by
commit, with real interactive case studies embedded and clickable inside it,
and a radar page that re-publishes itself every hour without a human in the
loop.

→ Read the thesis + click the embeds: [dive.vladyslavpodoliako.com/html-first](https://dive.vladyslavpodoliako.com/html-first)

---

## Read it (the site is the book)

The repo is how it's built. The site is what it IS.

| Surface | What's there | Live link |
|---|---|---|
| **All 48 chapters** | The whole book, MDX-rendered, with TL;DRs, glossary tooltips, and the receipts behind every claim | [`/sections`](https://dive.vladyslavpodoliako.com/sections) |
| **Radar** | A self-updating index of what's moving through the AI ecosystem, ranked by lead time — recomputed hourly by a cron pipeline, receipts on every row | [`/radar`](https://dive.vladyslavpodoliako.com/radar) |
| **Agent workflow** | The queue that feeds the swarm: boards, issue discipline, three slash commands, six path-routed review agents — the system this very repo runs on | [`/agent-workflow`](https://dive.vladyslavpodoliako.com/agent-workflow) |
| **Fleet paint** | Six agents, six identical black windows — statusline, OSC escape codes, and a watcher that colors every terminal by project | [`/terminal-setup`](https://dive.vladyslavpodoliako.com/terminal-setup) |
| **Tier list** | Five readings of the same models: the Arena crowd boards (hand-verified snapshot, cross-checked against a community mirror), Artificial Analysis with $/task economics + its Agentic Index, the labs' launch decks discounted on arrival, Arena's Agent board, and the operator ranking you can drag and share | [`/tier-list`](https://dive.vladyslavpodoliako.com/tier-list) |
| **Model files** | Opus 5 (the effort dial, the hierarchy question) and Fable 5 / Mythos 5 (a hub + 9 spokes, the system card read honestly) | [`/opus-5`](https://dive.vladyslavpodoliako.com/opus-5) · [`/fable-5`](https://dive.vladyslavpodoliako.com/fable-5) |
| **HTML-ization** | The flagship — thesis + embedded live artifacts (AFC pitch deck, AFC robot stable, sanitized client deliverability audit) | [`/html-first`](https://dive.vladyslavpodoliako.com/html-first) |
| **CAD-as-code** | Claude designs a 3D-printable museum frame as 267 lines of Python — STL + STEP as build artifacts, zero grams printed until the calipers agree | [`/cad-as-code`](https://dive.vladyslavpodoliako.com/cad-as-code) |
| **Music is math** | How AI actually writes a song, and where the same recipe conquered proteins, robots and the weather — with the five claims the first draft got wrong kept on the page | [`/music-is-math`](https://dive.vladyslavpodoliako.com/music-is-math) |
| **Learn** | New to any of this? The official free courses in the right order, then the book | [`/learn`](https://dive.vladyslavpodoliako.com/learn) |
| **Cheat sheet** | Slash commands, settings keys, hook JSON shape, permission syntax, model routing — printable | [`/cheat-sheet`](https://dive.vladyslavpodoliako.com/cheat-sheet) |
| **Glossary** | 90 terms, A–Z, linked inline throughout the chapters | [`/glossary`](https://dive.vladyslavpodoliako.com/glossary) |
| **Resources** | Copy-paste templates: CLAUDE.md skeletons, .mcp.json, hooks, SKILL.md, subagent .md, reusable prompts | [`/resources`](https://dive.vladyslavpodoliako.com/resources) |
| **Research notes** | 13 dated external signals that shift what an operator does Monday — sourced, signal-vs-receipt discipline | [`/research-notes`](https://dive.vladyslavpodoliako.com/research-notes) |

Press **⌘K** anywhere on the site — search every chapter, page, section
anchor, glossary term, and research note from one box. The changelog drives a
dismissible **"what's new" bar** on every page, and homepage tiles carry
**auto-expiring NEW badges** derived from each page's git ship date — nothing
on the site claims to be new by hand.

---

## The repo runs the book

This isn't a docs folder next to a manuscript — the repository practices the
operating discipline the chapters describe:

- **Issues → board → branch → review fleet → PR.** Work is filed from
  [issue templates](.github/ISSUE_TEMPLATE/) written so *an agent with no
  memory of the conversation can open a mergeable PR*, and every branch runs a
  path-routed review fleet before its PR opens
  ([docs/workflow/](docs/workflow/), config in
  [.claude/workflow-kit.json](.claude/workflow-kit.json)). The system itself is
  documented on [`/agent-workflow`](https://dive.vladyslavpodoliako.com/agent-workflow).
- **Prebuild guards fail the build on dishonesty**: stale numbers against a
  ledger, broken internal links, glossary drift, nested anchors, template-literal
  breakage — see `scripts/check-*.py` and the `prebuild` chain in `package.json`.
- **Data pages are dated captures, not vibes.** The tier-list's Arena boards
  are hand-verified snapshots cross-checked against an independent community
  mirror; Artificial Analysis figures trace to the page's own embedded JSON-LD;
  every capture is date-stamped on the surface that shows it.
- **The radar updates itself.** A sibling pipeline pushes hourly; the site
  rebuilds on every push (~90s via GitHub Pages), which is also what makes the
  homepage's NEW badges expire without anyone editing a label.

---

## What's in this repo (the receipts)

- **48 chapters** in `src/content/chapters/*.mdx`
- **31 React/Astro widgets** in `src/widgets/` (Arena leaderboard, AA economics panel, sortable tier list, command palette, token-burn calculator, swarm visualizer, tokenizer lab, …)
- **50+ standalone pages** in `src/pages/` — the surfaces above plus the journey, day zero, questions, showcase, vault starter, weekend builds, swarms, and more
- **90 glossary terms** in `src/lib/glossary.ts` · **13 dated research notes** in `src/lib/research-notes.ts`
- **4 embedded interactive artifacts** in `public/artifacts/` — single-file, self-contained, sandboxed-iframe-embedded
- **35 shipped editions** in `src/lib/changelog.ts`, each with receipts

---

## How it's built (5 bullets)

1. **Astro 5** static site generator. Server-rendered by default; React 18
   islands only where interaction needs them.
2. **MDX** for chapter content with custom Astro components
   (`<Callout>`, `<PullQuote>`, `<TLDR>`, `<GlossaryTooltip>`, …).
3. **Tailwind 3** with project design tokens
   (`rgb(var(--accent))`, `--paper`, `--line`, dark/light themes).
4. **GitHub Pages** auto-deploy via `.github/workflows/deploy.yml` — push to
   `main`, live in ~90 seconds at `dive.vladyslavpodoliako.com`.
5. **Built and maintained by Claude Code agents** — content, widgets, data
   refreshes, review fleets, deploys. The process is the technique the book
   describes; the artifact IS the technique.

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # prebuild guards → astro build → postbuild checks → dist/
npm run preview  # serve dist/ locally
```

Requires Node 20+.

---

## Add a chapter or page

1. Chapters: drop an MDX file into `src/content/chapters/` matching
   `src/content/config.ts`, add it to `src/lib/chapters.ts` — the dynamic
   route picks it up.
2. Standalone pages need **eight** wiring surfaces, or they ship invisible:
   page file · ⌘K index · chapter cross-link · glossary · homepage tile
   (`<TileEyebrow added="…">` — the NEW badge derives from the ship date) ·
   changelog · site nav · the hand-maintained `llms.txt` site map.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how work is filed and reviewed.

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
