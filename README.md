# Ultimate AI Dive Deep

A field manual for operators who want to stop juggling tabs and start running AI like an OS.
Twenty-four chapters. One operator. Belkins, Folderly, the Newsletter, and a portfolio of others.

By **Vlad Podoliako** · Edition 1 · May 2026

## What this is

The interactive web edition of *Ultimate AI Dive Deep*. The book teaches you to operate AI as
infrastructure — vault, skills, swarms, schedules, connectors, sandboxes. The artifact you're
reading is built the same way the book describes: parallel agents, MDX content, static deploy,
zero server.

Live: **https://vladpodolyako.github.io/ai-dive-deep/**

## What's inside

- **24 chapters** in MDX, with TL;DRs, glossary tooltips, code blocks, video embeds.
- **8 interactive widgets**:
  - `StackSelector` — pick the right surface (Chat / Cowork / Code) and model (Haiku / Sonnet / Opus).
  - `SwarmVisualizer` — animated fan-out / pipeline / map-reduce / adversarial.
  - `CronBuilder` — natural-language ↔ cron, with next-7-fire preview.
  - `ModePicker` — three questions → Interactive / Plan / Auto.
  - `SkillComposer` — form-based SKILL.md builder with cold-read feedback.
  - `ConnectorMap` — Vlad's MCP taxonomy, tier-tagged.
  - `PermissionSimulator` — pick env + flags, see blast radius light up red/yellow/green.
  - `TierListBuilder` — drag-and-drop, share via URL hash.
- **Reader-experience layer**: Cmd-K command palette, dark/light theme, reading progress bar,
  glossary cross-links, view-transitions.
- **Resources page** with copy-paste templates: `CLAUDE.md` skeleton, `.mcp.json`, hooks,
  SKILL templates, the 5 reusable prompts.
- **Cheat sheet** (printable).
- **30-day plan generator** with `.ics` and markdown export.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

Requires Node 20+.

## Deploy

Pushes to `main` ship to GitHub Pages via `.github/workflows/deploy.yml`.

To deploy:

1. `gh repo create vladpodolyako/ai-dive-deep --public --source=. --push`
2. **Settings → Pages → Build & deployment**: source = `GitHub Actions`.
3. The workflow runs on push and deploys the `dist/` build.

## Add a chapter

1. Drop a new MDX file into `src/content/chapters/` matching the schema in
   `src/content/config.ts`.
2. Add the chapter to the ordered list in `src/lib/chapters.ts`.
3. Done. The dynamic route at `src/pages/chapters/[slug].astro` picks it up.

## Stack

- [Astro](https://astro.build/) 5 (static HTML, content layer, view transitions)
- [Tailwind CSS](https://tailwindcss.com/) 3
- [React](https://react.dev/) 18 islands for interactive widgets
- [Shiki](https://shiki.style/) for syntax highlighting (server-rendered, zero client JS)

## Credits

Written by Vlad Podoliako across his portfolio. Built by 25+ agents in parallel.
[Newsletter](https://www.vladsnewsletter.com) · [Site](https://vladyslavpodoliako.com)

## License

Content: CC BY-NC-SA 4.0 — share, adapt, credit, no commercial.
Code: MIT.
