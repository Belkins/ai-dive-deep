# Screenshot strategy — how to ship the rest

The site has ~80 placeholder slots across 39 chapters and 12 supporting pages. Zero are filled. The placeholder system auto-replaces by filename — so this is a fill-the-bucket problem with a clear definition of done.

## Three categories — pick the right production path per slot

### A. SVG diagrams (I design these, ship now)
Conceptual / architectural / flow diagrams. No real UI. SVG matches site design system (`--bg #0E0F11`, `--accent #FF6B2C`, `--paper #161B1F`, Inter/Source Serif fonts). Scales infinitely. Edit-friendly. Zero hallucination risk.

Shipped in this pass (8 SVGs):
- `38-run-until-done-1.svg` — autonomy ladder (Plan → Auto → /goal)
- `06-the-swarm-1.svg` — swarm shape (3-4 parallel + synthesis)
- `31-stages-1.svg` — six stages flow (Ideation → Foundation → Creation → Polishing → Security → Deploy)
- `37-context-files-1.svg` — four-layer architecture (CLAUDE.md / memory / skills / session)
- `39-skills-you-should-steal-1.svg` — 9-library star bar chart
- `21-three-modes-1.svg` — four-modes comparison
- `25-evals-or-hope-1.svg` — three-receipt thesis (DELEGATE-52 + 81k + Berkeley)
- `claude-md-rules-1.svg` — 12-rule infographic

### B. AI-generated illustrations (skipped — by design)
Stylized scenes feel cheesy in a field manual. AI-generated UI looks real-but-wrong, actively misleading. **Skip this category.** Field manual aesthetic = real receipts or honest diagrams. Nothing in between.

### C. Real captures (Vlad-only)
Actual surfaces. Cannot be faked. Capture on Vlad's own machine, sanitize, drop into `public/screens/<id>.png`.

Priority queue:
1. `01-killed-my-tabs-1` — #vlad-ops Slack channel with 6:30 AM brief (THE marquee shot for the whole book)
2. `38-run-until-done-2` — `/goal` overlay panel in Claude Code (active state with elapsed timer + turn counter + token meter)
3. `29-cost-economics-1` — Anthropic API billing dashboard (one full month)
4. `13-quickstart-1` — Claude Code terminal first-run state
5. `08-three-doors-1` — side-by-side Chat / Cowork / Code comparison
6. `24-tier-list-1` — Vlad's actual tier list as drag-rendered
7. `22-sessions-1` — `/resume` session list
8. `33-browser-agents-1` — Playwright + Claude in action
9. `39-skills-you-should-steal-2` — gstack repo file tree open in editor
10. `04-the-vault-1` — Obsidian vault left-rail with the actual folder structure

Everything else (~60 slots): nice-to-have. Most chapters work without screenshots; cards + pull-quotes carry the visual weight.

## How to capture (Vlad's protocol)

### Tooling
- macOS: ⌘⇧4 for area selection, ⌘⇧5 for window with selection. Save as PNG.
- For terminal shots: increase font to 18pt minimum. Use a fresh tmux pane so no scrollback bleed.
- For browser/Slack/HubSpot: zoom browser to 100%, take at native retina (auto on macOS).

### Sanitization rule
> Mask every contact name, deal name, channel ID, customer/org name, workspace identifier, OAuth token, API key, session URL, dollar amount that identifies a specific Belkins/Folderly account. When in doubt: take the screenshot in a fresh demo workspace populated with fake data.

Specific patterns to mask:
- **Slack**: workspace name top-left, real DM avatars, threaded names → blur or use fresh test workspace
- **HubSpot**: company names, deal amounts > demo levels, real owner names → use sandbox account or demo data
- **Anthropic billing**: keep aggregate totals; mask org name + email
- **Terminal**: `$ANTHROPIC_API_KEY`, paths with company names (`~/conductor/`, `~/Desktop/AI Products/...`) → set `$PS1` to `[demo] $` and use anonymized paths

### Specs per shot
- 16:9 aspect ratio (matches placeholder shape)
- 1600×900 minimum (retina sharpness on desktop)
- PNG for terminal/code-heavy (sharp text), WebP for photo-style
- Sub-500KB each ideally; PNG for sharp text, WebP for everything else
- File name = exact placeholder ID + extension. Example: `01-killed-my-tabs-1.png`

### Where to drop
1. **Preferred** — `public/screens/<id>.png` directly via Finder. The build picks it up automatically (`npm run screens` rescans). No edits to chapters needed.
2. **Chat paste** — drop the image into our conversation, I save to the right path. Use the placeholder ID in your message so I name it correctly.
3. **Drive/Slack link** — paste a link, I fetch + save.

## Coverage plan (this batch)

- **8 SVG diagrams shipped** — covers Ch 6, 21, 25, 31, 37, 38, 39 + /claude-md-rules
- **10 real-capture targets surfaced** — ranked above by impact
- **Remaining ~60 slots** — placeholder stays until needed. No urgency.

## What lives forever

This `notes/screenshots/STRATEGY.md` is the canonical doc. When the placeholder ID system changes or the design language shifts, this file is the source of truth. The SVGs themselves live in `public/screens/`. The Vlad-capture checklist is the 10 above — when those 10 are filled, the artifact is at ~70% "feels visually complete."
