# Wave 2 — content + widget deepening

Fire after wave 1 returns (need their findings as input).

## Agent 5 — Three case studies in Vlad's voice
File: `notes/edition-2/05-case-studies.md`
- The $4,200 leaked-key incident (Ch 9 mentions the 11-minute leak — write the full story Vlad's way)
- The Saturday $81 build (Ch 19, hour by hour — full receipts version, not the chapter version)
- The 25,000-word book written by 15 agents in 6 minutes (Ch 6 mentions it — full procurement note)
Each: 600-800 words, time-stamped scenes, real numbers, anti-takeaway closer.

## Agent 6 — Prompt library expansion
File: `notes/edition-2/06-prompt-library.md`
- 10 NEW copy-paste prompts beyond the 5 in Ch 10
- Categories: morning briefing, weekly review, deal-postmortem, hire-screening, code-review, board-update, mentee-prep, RFP-response, model-migration, kill-decision
- Each with: trigger phrase, body, expected output shape, anti-pattern note
- Voice-perfect — punchy, no marketing copy

## Agent 7 — 4 new widget specs
File: `notes/edition-2/07-new-widgets.md`
- Pick the 4 highest-leverage NEW widgets to build for edition 2
- Each spec: chapter placement, learning objective, UI sketch, props, edge cases, fallback
- Candidate ideas (pick best 4):
  - **TokenBurnCalculator** (Ch 2) — sliders for daily token volume → annual cost vs senior eng salary
  - **VaultGraphPreview** (Ch 4) — animated neuron graph from a stub Obsidian vault
  - **HookEventTimeline** (Ch 16) — animated lifecycle showing PreToolUse / PostToolUse / Stop firing
  - **TempAgencyLoop** (Ch 3) — instances spawning, doing work, dying — full animation
  - **TerminalLayoutDesigner** (Ch 20) — drag-resize tmux layout planner
  - **SkillFiringSimulator** — type a request, see which of 10 skills would trigger
  - **ConnectorTotalCostOfOwnership** — pick connectors, see annual cost
  - **BlastRadiusGame** — interactive scenario "what would the agent do?"

## Agent 8 — Mobile + a11y fixes ready to ship
File: `notes/edition-2/08-a11y-fixes.md`
- Apply Wave 1 UX agent's findings as concrete patches
- Tap targets, focus rings, contrast, mobile font sizes, code-block scrolling
- Output: actual diffs to specific files (`src/styles/global.css`, individual components)
- Must be commit-ready
