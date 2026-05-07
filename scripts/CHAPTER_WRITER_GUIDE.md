# Chapter MDX Writer Guide

You are converting raw text chapters from `/tmp/ai-course-extract.txt` into MDX files
in `src/content/chapters/`. Your output will be the canonical chapter content for an
Astro static site.

## Source

Read the chapter text from `/tmp/ai-course-extract.txt`. Each chapter starts with
"CHAPTER" on its own line, followed by the chapter number, title, and subtitle.
Every chapter ends just before the next "CHAPTER" line (or before "APPENDIX").

## Output filename pattern

`src/content/chapters/<slug>.mdx` where `<slug>` is from the table below — never
invent a new slug.

## Frontmatter (every file MUST have this exact shape)

```mdx
---
number: 1
slug: "01-killed-my-tabs"
title: "The Day I Killed My Tabs"
subtitle: "A Tuesday morning that changed how I work."
tldr: "One operator's morning brief lands in Slack at 6:30 AM, written by an AI while he sleeps. The unlock isn't AI doing his work — it's AI deleting his context-switching across forty open tabs."
keyConcepts: ["MCP", "Cowork", "scheduled tasks"]
readingMinutes: 7
video:
  title: "When AIs Act Emotional"
  youtubeId: "D4XTefP3Lsc"
---
```

Frontmatter rules:
- `number` and `slug` MUST match the table below exactly.
- `title` and `subtitle` come from the source — preserve voice.
- `tldr`: write 2–3 sentences in Vlad's voice that tell the reader what they're about
  to learn AND why it matters. Not a summary of the chapter; a hook + payoff.
- `keyConcepts`: 3–5 short pills. These become tags. Keep them concrete.
- `readingMinutes`: estimate at ~220 wpm (roughly word_count / 220, rounded up).
- `video`: only include if the source has a "▶ Watch alongside this chapter" block
  with a YouTube link. Extract the `v=ID` or `youtu.be/ID` part.

## Body conventions

- Use markdown headings (##, ###) for sub-sections. Source uses prose subheaders
  like "The reframe most operators miss" — convert those to `## The reframe most operators miss`.
- Preserve Vlad's voice — punchy, lowercase tendencies, em-dashes, comma splices
  where intentional. Don't sanitize.
- Code blocks: detect language and tag the fence: ` ```bash`, ` ```json`, ` ```ts`,
  ` ```py`, ` ```yaml`, ` ```mdx`. Source uses inline " ```code``` " style sometimes —
  break it into proper fenced blocks.
- Bullet lists with " • " in source → use `- ` markdown bullets.
- The "📷 SCREENSHOT GOES HERE" + caption + note + "Replace this box with your image." block:
  replace with:
  ```mdx
  <ScreenshotPlaceholder
    caption="<the short title from source>"
    note="<the longer caption from source>"
  />
  ```
  Drop the "Replace this box with your image." line.
- The "▶ Watch alongside this chapter" + URL block at the end of a chapter:
  REMOVE from the body — it's already wired into frontmatter.video and rendered
  by the template.
- Pull-out quotes that read like marquees (e.g., '"S-tier isn't I like it…"' in Ch 24,
  'Stop using AI like a chatbot. Start using it like an OS.' in Ch 1):
  use `<PullQuote>...content...</PullQuote>`.
- Glossary terms — wrap on FIRST USE per chapter:
  `<GlossaryTerm term="MCP">MCP</GlossaryTerm>`. Eligible terms list: see
  `src/lib/glossary.ts` (CLAUDE.md, Claude Code, Cowork, MCP, Subagent, Swarm,
  Skill, Vault, Hook, Sandbox, Worktree, Plugin, Connector, Token, Context window,
  Instance, RAG, Eval, Prompt injection, Hallucination, Agent, Inference, Tool use,
  Headless mode, Cron, Quantization, Multimodal, Webhook, System prompt, Function calling,
  Knowledge cutoff).
- Cross-references like "Chapter 11" or "Ch 14" → `[Chapter 11](/chapters/11-build-a-skill)`
  using the slug from the table. Use `import.meta.env.BASE_URL`-aware paths? No —
  use plain `/chapters/<slug>`; Astro handles base prefixing.
- "Figure." captions in source → drop them. The image they reference becomes the
  ScreenshotPlaceholder.
- Tables (e.g., the routing rules in Ch 2) → preserve as markdown tables.

## Imports at top of each MDX file

ALWAYS include this block at the top after frontmatter, even if not used:

```mdx
import ScreenshotPlaceholder from '@/components/ScreenshotPlaceholder.astro';
import PullQuote from '@/components/PullQuote.astro';
import Callout from '@/components/Callout.astro';
import GlossaryTerm from '@/components/GlossaryTooltip.astro';
```

Add widget imports only when you embed a widget. The widget tags (use these
exactly where they belong — see "Widget placements" below):

```mdx
import SwarmVisualizer from '@/widgets/SwarmVisualizer.tsx';
import CronBuilder from '@/widgets/CronBuilder.tsx';
import ModePicker from '@/widgets/ModePicker.tsx';
import StackSelector from '@/widgets/StackSelector.tsx';
import SkillComposer from '@/widgets/SkillComposer.tsx';
import ConnectorMap from '@/widgets/ConnectorMap.tsx';
import PermissionSimulator from '@/widgets/PermissionSimulator.tsx';
import TierListBuilder from '@/widgets/TierListBuilder.tsx';
```

## Widget placements (only if your range includes the chapter)

Insert after a natural section break — choose a relevant prose anchor.

| Chapter | Widget | Where |
|---|---|---|
| 02 | `<StackSelector client:visible />` | After "The Routing Rules" section |
| 06 | `<SwarmVisualizer client:visible />` | After "The four swarm patterns" |
| 07 | `<CronBuilder client:visible />` | After "Cron syntax — the 30-second primer" |
| 08 | `<StackSelector client:visible />` | After "Decision tree, read this in 30 seconds" |
| 11 | `<SkillComposer client:visible />` | After "SKILL.md — the file that does 80% of the work" |
| 12 | `<ConnectorMap client:visible />` | After "The connector taxonomy" |
| 15 | `<PermissionSimulator client:visible />` | After "Permission granularity — what you can scope" |
| 21 | `<ModePicker client:visible />` | After "The mode picker (mental model)" |
| 24 | `<TierListBuilder client:visible />` | After the closing line "The tools are leverage. The discipline is the lever." |

## Slug + numbers reference

(MUST match — copy/paste these slugs exactly into frontmatter):

```
1  → 01-killed-my-tabs
2  → 02-five-tools
3  → 03-temp-agency
4  → 04-the-vault
5  → 05-skills
6  → 06-the-swarm
7  → 07-cron
8  → 08-three-doors
9  → 09-dont-get-owned
10 → 10-wild-stuff
11 → 11-build-a-skill
12 → 12-connectors-mcp
13 → 13-quickstart
14 → 14-cheat-sheet
15 → 15-permissions
16 → 16-hooks-subagents
17 → 17-tips-tricks
18 → 18-headless-ci
19 → 19-build-products
20 → 20-terminal-windows
21 → 21-three-modes
22 → 22-sessions
23 → 23-vibe-coding
24 → 24-tier-list
```

## Video map (extract from source "▶ Watch alongside" sections)

```
01 → D4XTefP3Lsc · "When AIs Act Emotional"
02 → RnOWJoHU_NY · "Why AI Models Are Biased"
04 → bluAmTHoEow · "Your Tools Are Now Interactive in Claude"
06 → fl1DSmwQKKY · "Claude Code — Boris Cherny"
08 → fl1DSmwQKKY · "Claude Code — Boris Cherny"
09 → 0SgCiUfoYo8 · "Prompts for Hardening & Security"
10 → QD50Pkf0Ov0 · "Learn to Code in 3 Hours Using AI"
12 → bluAmTHoEow · "Your Tools Are Now Interactive in Claude"
15 → 0SgCiUfoYo8 · "Prompts for Hardening & Security"
```

Chapters NOT in the list above have no video — omit `video` from frontmatter entirely.

## Quality bar

- The MDX must compile. Test by mentally running through it.
- No raw HTML except the components imported above.
- No backslashes or weird escapes.
- Frontmatter values that contain quotes — use single quotes in frontmatter or escape.
- Apostrophes in MDX body are fine.
- DO NOT include the chapter heading "CHAPTER 01" or chapter title as `# H1` in the
  body — the layout renders that from frontmatter. Start the body with the first
  prose section.

When done, briefly report: "Wrote N files: <slug1>, <slug2>, …" and any judgment calls.
