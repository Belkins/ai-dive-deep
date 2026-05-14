SCREENSHOTS — what's still needed (updated 2026-05-14)

This folder holds empty placeholder files for screenshots that haven't been captured yet. Drop your real PNG over the matching file, move it UP one level to public/screens/, push to main. Build picks it up automatically.

────────────────────────────────────────────
DONE — 16 SVG diagrams in public/screens/
────────────────────────────────────────────
01-killed-my-tabs-1      Follow-up accountability brief (sanitized)
01-killed-my-tabs-2      Scheduled tasks panel (sanitized)
06-the-swarm-1           6-agent swarm in flight (terminal output)
07-cron-1                Scheduled task detail view
08-three-doors-1         Chat / Cowork / Code comparison
13-quickstart-1          First useful task in Claude Code
16-hooks-subagents-1     Subagent fan-out flow
21-three-modes-1         Plan / Interactive / Auto / /goal
22-sessions-1            claude --resume picker
25-evals-or-hope-1       Three-receipt eval thesis
31-stages-1              Six stages flow (also rendered by StagesFlow widget)
37-context-files-1       Four-layer context-file authority hierarchy
38-run-until-done-1      Autonomy ladder (Plan → Auto → /goal)
38-run-until-done-2      /goal overlay panel (marquee shot for Ch 38)
39-skills-you-should-steal-1   9-library star bar chart
claude-md-rules-1        12-rule infographic (for /claude-md-rules page)
04-the-vault-1           Vlad's real Obsidian vault graph (Vlad capture)
04-the-vault-rick        Rick AI-agent vault — pattern generalizes (Vlad capture)
04-the-vault-rick-2      Rick agent's daily note (Vlad capture)

────────────────────────────────────────────
STILL NEEDED — 29 real captures
────────────────────────────────────────────

★ TIER S — book-defining shots (do these first, 20 min total)

   24-tier-list-1                 Your tier list as rendered on /tier-list
   29-cost-economics-1            Anthropic console — weekly cost view, full month

★ TIER A — high-leverage receipts and surfaces (1 hour)

   02-five-tools-1                Cowork connectors panel (sanitized)
   02-five-tools-2                Anthropic billing dashboard
   04-the-vault-2                 Your actual CLAUDE.md OR a recent vault note
   05-skills-1                    ~/.claude/skills/ folder listing
   12-connectors-mcp-1            Cowork Connectors panel (full view)
   12-connectors-mcp-2            Real .mcp.json open in editor + /mcp output in split pane
   13-quickstart-2                The 10-minute end-state (Claude Code with a CLAUDE.md, a skill, /agents)
   14-cheat-sheet-1               Your real ~/.claude/settings.json with preferences
   26-team-adoption-1             Slack — 12 people, 5 reactions on a Claude-produced canvas

★ TIER B — supporting / nice-to-have (no urgency)

   03-temp-agency-1               Scheduled instance running in Cowork
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

────────────────────────────────────────────
HOW TO DROP A SHOT
────────────────────────────────────────────
1. Take screenshot (⌘⇧4 for area, ⌘⇧5 for window with selection)
2. Rename to the exact ID + extension. Example: 04-the-vault-1.png
3. Drag from Desktop directly into public/screens/ (NOT inside _TODO/)
4. Run `npm run build` OR push to main. Done.

OR just paste in chat with the ID and I save it.

────────────────────────────────────────────
SANITIZATION CHECKLIST (before saving)
────────────────────────────────────────────
- Mask every contact name (use generic firsts: John A. / Sarah M. / etc.)
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
Ship Tier S + Tier A (11 shots, ~80 minutes) and the artifact crosses
the "feels visually complete" line. Tier B is icing — most chapters
read fine with the cards + pull-quotes carrying the visual weight.
