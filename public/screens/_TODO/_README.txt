SCREENSHOTS — what's still needed (updated 2026-05-15, post-SMB-connectors section)

This folder holds empty placeholder files for screenshots that haven't been captured yet. Drop your real PNG over the matching file, move it UP one level to public/screens/, push to main. Build picks it up automatically.

Current state: 43 visual artifacts done · 22 captures still needed · 61 chapter references total.

────────────────────────────────────────────
DONE — 43 visual artifacts
────────────────────────────────────────────

SVG diagrams (25):
  01-killed-my-tabs-1            Follow-up accountability brief (sanitized)
  01-killed-my-tabs-2            Scheduled tasks panel (sanitized)
  06-the-swarm-1                 6-agent swarm in flight (terminal output)
  07-cron-1                      Scheduled task detail view
  08-three-doors-1               Chat / Cowork / Code comparison
  13-quickstart-1                First useful task in Claude Code
  15-yolo-decision-1             4-gate decision tree for --dangerously-skip-permissions ← NEW
  16-hooks-subagents-1           Subagent fan-out flow
  21-three-modes-1               Plan / Interactive / Auto / /goal
  22-sessions-1                  claude --resume picker
  24-tier-list-1                 Proper tier-image SVG (6 tiers, 28 tools, May 2026 loadout) ← NEW
  24-lmarena-snapshot            LMArena top-10 snapshot (replaces broken HF iframe on /tier-list) ← NEW
  25-evals-or-hope-1             Three-receipt eval thesis
  31-stages-1                    Six stages flow (also rendered by StagesFlow widget)
  37-context-files-1             Four-layer context-file authority hierarchy
  38-run-until-done-1            Autonomy ladder (Plan → Auto → /goal)
  38-run-until-done-2            /goal overlay panel (marquee shot for Ch 38)
  39-skills-you-should-steal-1   9-library star bar chart
  claude-md-rules-1              12-rule infographic (for /claude-md-rules page)
  04-the-vault-2                 Sanitized CLAUDE.md system map — copyable template ← NEW
  05-skills-1                    67-skill library by category — sanitized ← NEW
  02-five-tools-2                Anthropic invoice — $2,216 / ~2.2B tokens ← NEW
  12-connectors-mcp-2            .mcp.json + /mcp split (config → live state) ← NEW
  13-quickstart-2                The 10-minute end-state terminal ← NEW
  14-cheat-sheet-1               settings.json annotated (sanitized) ← NEW
  26-team-adoption-1             The 9:47 AM Slack — 4-3-2-2-1 distribution ← NEW

Real PNG captures (17):
  02-five-tools-1                Vlad's connected Cowork connector stack + Gmail tool permissions ← NEW
  04-the-vault-1                 Vlad's real Obsidian vault graph
  04-the-vault-rick              Rick AI-agent vault (pattern generalizes)
  04-the-vault-rick-2            Rick agent's daily note
  12-connectors-mcp-1            Connector Directory / registry browse view ← NEW
  12-connectors-mcp-3            SMB cash reconciliation (QuickBooks + PayPal) ← NEW, from claude.com/solutions/small-business
  12-connectors-mcp-4            SMB month-end close P&L (QuickBooks + PayPal + Drive) ← NEW
  12-connectors-mcp-5            SMB Monday Slack brief (QuickBooks + Calendar + Slack) ← NEW
  12-connectors-mcp-6            SMB staged campaign (QuickBooks + Canva + HubSpot) ← NEW
  29-cost-economics-1            Anthropic console March 2026 — the "before" spike (2.25B in) ← NEW
  29-cost-economics-2            Claude Max (20x) plan usage limits — weekly caps ← NEW
  29-cost-economics-3            Anthropic console April 2026 — spikes flattening ← NEW
  29-cost-economics-4            Anthropic console May 2026 — flat, optimized ← NEW
  29-cost-economics-5            Caching tab — 98.1% read ratio, 11.7× amortization ← NEW
  29-cost-economics-6            Input token composition + write amortization curves ← NEW
  29-cost-economics-7            April direct-API token cost — $2,216 the whole month ← NEW
  29-cost-economics-8            May direct-API token cost — $556 MTD (~half April) ← NEW

────────────────────────────────────────────
STILL NEEDED — 22 real captures (all TIER B — optional icing)
────────────────────────────────────────────

★ TIER S — CLEARED ✓ (all book-defining shots captured)

★ TIER A — CLEARED ✓ (all 5 rendered as sanitized SVGs)


★ TIER B — supporting / nice-to-have (no urgency, 22 shots)

   03-temp-agency-1               Scheduled instance running in Cowork
   06-the-swarm-2                 Repo's .claude/agents/ folder + .mcp.json in a file tree ← NEW
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
   35-codex-and-cc-2              AI Studio Build mode mid-iteration (3-pane + annotation) ← NEW

────────────────────────────────────────────
HOW TO DROP A SHOT
────────────────────────────────────────────
1. Take screenshot (⌘⇧4 for area, ⌘⇧5 for window with selection)
2. Rename to the exact ID + extension. Example: 04-the-vault-2.png
3. Drag from Desktop directly into public/screens/ (NOT inside _TODO/)
4. Run `npm run build` OR push to main. Done.

OR just paste in chat with the ID and I save it.

────────────────────────────────────────────
SANITIZATION CHECKLIST (before saving)
────────────────────────────────────────────
- Mask every contact name (use generic firsts: John A. / Finance / etc.)
- Mask deal names, customer names, channel IDs, workspace identifiers
- Mask OAuth tokens, API keys, session URLs, signed S3 URLs
- Mask dollar amounts that identify specific Belkins/Folderly accounts
- For Slack shots: take in a fresh demo workspace if any DM context is sensitive
- For HubSpot: use sandbox account OR mask company names + deal amounts > demo levels
- For Anthropic billing: keep aggregate totals; mask org name + email
- For terminal shots: set PS1 to `[demo] $`, use anonymized paths
- When in doubt, use a fresh demo workspace with fake data

────────────────────────────────────────────
THE LINE
────────────────────────────────────────────
Tier S + Tier A are CLEARED — the artifact is visually complete.
The 22 remaining are all Tier B icing — most chapters
read fine with the cards + pull-quotes carrying the visual weight.

Tier A is where the operator-flavor lives: real CLAUDE.md, real settings.json,
real billing dashboard, real Cowork connectors. These can't be illustrated;
they have to be photographed.
