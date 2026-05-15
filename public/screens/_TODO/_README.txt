SCREENSHOTS — what's left (updated 2026-05-15, post Tier-S+A clearance)

This folder holds 0-byte placeholder files for screenshots not yet captured.
Drop a real PNG into public/screens/ (one level UP, not here) named the exact
ID — e.g. 23-vibe-coding-1.png — and the build picks it up. Or paste it in
chat with the ID and it gets filed for you. Your original is COPIED, never
moved, so nothing ever disappears from where you put it.

────────────────────────────────────────────
STATUS: VISUALLY COMPLETE
────────────────────────────────────────────
43 visual artifacts done · 22 captures still needed · 61 chapter references.

  ★ TIER S — CLEARED ✓   book-defining shots all captured
  ★ TIER A — CLEARED ✓   high-leverage receipts all done (5 as sanitized SVGs)
  ★ TIER B — 22 open     supporting / nice-to-have · no urgency

The book reads as visually finished. Everything below is optional icing —
most of these chapters carry their weight on cards + pull-quotes already.

────────────────────────────────────────────
DONE — 43 (26 SVG diagrams + 17 real PNG captures)
────────────────────────────────────────────
Full list is the source of truth in src/lib/screenshots.ts (auto-generated).
Highlights this cycle:
  SVG: 15-yolo-decision-1, 24-tier-list-1, 24-lmarena-snapshot,
       04-the-vault-2 (CLAUDE.md system), 05-skills-1 (67-skill library),
       02-five-tools-2 ($2,216 invoice), 12-connectors-mcp-2 (.mcp.json+/mcp),
       13-quickstart-2, 14-cheat-sheet-1, 26-team-adoption-1 (4-3-2-2-1)
  PNG: 02-five-tools-1, 12-connectors-mcp-1/3/4/5/6 (SMB workflows),
       29-cost-economics-1..8 (full Mar→May cost + caching receipts),
       04-the-vault-1 + Rick vault series

────────────────────────────────────────────
STILL NEEDED — 22 (all TIER B, no urgency)
────────────────────────────────────────────

   03-temp-agency-1               Scheduled instance running in Cowork
   06-the-swarm-2                 Repo's .claude/agents/ folder + .mcp.json in a file tree
   09-dont-get-owned-1            Secret manager vault (1Password or similar)
   10-wild-stuff-1                Generative video pipeline (Higgsfield/Suno workflow)
   11-build-a-skill-1             ~/.claude/skills/morning-briefing/ expanded in Finder
   15-permissions-1               The permission prompt in Claude Code
   15-permissions-2               ~/.claude/settings.json permissions block
   16-hooks-subagents-2           Hooks + subagents — release flow
   17-tips-tricks-1               Personal toolbox (~/.claude/) over time — directory snapshot
   18-headless-ci-1               Real GitHub Actions log with `claude --print`
   19-build-products-1            Vercel dashboard
   19-build-products-2            Phone showing the deployed URL
   20-terminal-windows-1          iTerm2 with tmux three-pane layout
   20-terminal-windows-2          Raycast / iTerm hotkey window in action
   23-vibe-coding-1               Cowork refining the PRD
   23-vibe-coding-2               MP3 playing on phone (the Saturday artifact)
   23-vibe-coding-3               GitHub commit graph for the Saturday build
   27-voice-agents-1              LinguaLive voice-agent latency waterfall
   33-browser-agents-1            Slack post from pricing-watch browser agent
   34-write-on-behalf-1           The 9:14 AM approval flow
   35-codex-and-cc-1              .mcp.json + CLAUDE.md side by side
   35-codex-and-cc-2              AI Studio Build mode mid-iteration (3-pane + annotation)

Several of these could also be rendered as sanitized SVGs the same way
04-the-vault-2 / 05-skills-1 / the 5 Tier-A shots were — just say which.

────────────────────────────────────────────
HOW TO DROP A SHOT
────────────────────────────────────────────
1. Take screenshot (⌘⇧4 for area, ⌘⇧5 for window).
2. Rename to the exact ID + extension, e.g. 19-build-products-1.png
3. Drop it in public/screens/  (one level UP from this folder)
4. `npm run build` or push to main. Done.
   OR paste in chat with the ID — it gets filed + your copy stays put.

────────────────────────────────────────────
SANITIZATION CHECKLIST (before saving any real capture)
────────────────────────────────────────────
- Mask contact/customer/deal/channel names → generic (John A. / Acme)
- Mask OAuth tokens, API keys, session URLs, signed S3 URLs
- Mask dollar amounts that identify a specific Belkins/Folderly account
- Slack: fresh demo workspace if any DM context is sensitive
- HubSpot: sandbox account, or mask company names + deal amounts
- Anthropic billing: keep aggregate totals; mask org name + email
- Terminal: PS1 = `[demo] $`, anonymized paths
- When in doubt, over-sanitize — this is a public artifact.
