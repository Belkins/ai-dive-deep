# Edition 2 — Improvement Brief

## What exists today

`https://belkins.github.io/ai-dive-deep/` — Astro static site, 24 chapters in MDX,
8 interactive widgets (StackSelector, SwarmVisualizer, CronBuilder, ModePicker,
SkillComposer, ConnectorMap, PermissionSimulator, TierListBuilder), Cmd-K palette,
glossary, resources page, printable cheat sheet, 30-day plan generator. Source:
`Belkins/ai-dive-deep`. Edition 1, May 2026.

Source MDX lives in `src/content/chapters/01-killed-my-tabs.mdx` … `24-tier-list.mdx`.
Glossary at `src/lib/glossary.ts`. Snippets at `src/lib/snippets.ts`.

## What we're doing

Audit the artifact for what's weak, missing, drifted, or under-leveraged. Produce
**executable improvements**, not analyses. Output is markdown patches, new MDX
chapters, new widget specs, and prioritized lists — not philosophy.

## Voice rules (locked, non-negotiable)

- Lowercase tendencies; em-dashes welcome; comma splices intentional
- One operator-grade number per claim (real receipts: "3 to 10B tokens", "$81", "11 minutes")
- No corporate hedging, no "in my opinion", no "really", no "very", no "literally"
- Open scenes with concrete time-stamped moments when possible
- Three-act argument shape: incident → mechanism → operator move
- Anti-takeaway closer (no "five lessons learned" wraps)
- Cut adverbs
- Vlad runs Belkins, Folderly, LinguaLive, NoCancer AI, 404 Model Agency, the Newsletter
- Mentions are concrete (specific tools, specific numbers, specific moments) not abstract

If you're tempted to write "this guide will help you", stop. Vlad doesn't write
that. He writes "I burned 8 hours on this. You don't have to."

## Hard constraints

1. **Do NOT** propose changes that require a backend, server, or login. Site is static, stays static.
2. **Do NOT** add a paid tier, premium gate, or analytics gate. Free + open.
3. **Do NOT** propose changes that take Edition 2 over 35 chapters. Discipline matters more than coverage.
4. **Do NOT** invent numbers. Cite the source chapter or flag as "needs Vlad's number".
5. **Do NOT** propose features that already exist (re-read the chapter list before suggesting).
6. **Do NOT** sanitize Vlad's voice. Punchy beats polite.
7. **Do NOT** turn this into a SaaS product roadmap. It's a book + interactive surface.

## Reference

- Live site: https://belkins.github.io/ai-dive-deep/
- Repo: https://github.com/Belkins/ai-dive-deep
- Source MDX: `~/Desktop/ai-dive-deep/src/content/chapters/`
- Glossary: `~/Desktop/ai-dive-deep/src/lib/glossary.ts`
- Migrated source text: `/tmp/ai-course-extract.txt`

## What "good" looks like

The output of this audit should let Vlad open one synthesis doc and immediately
see: (1) the 5 highest-leverage improvements ranked, (2) markdown ready to commit
into the repo, (3) widget specs ready for the next build wave, (4) Edition 2
chapter outlines in his voice. No abstract prose. Receipts, files, diffs.
