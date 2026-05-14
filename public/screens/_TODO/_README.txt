Empty placeholder files for the remaining screenshots.

Workflow:
1. Take a screenshot (⌘⇧4 area, ⌘⇧5 window).
2. Replace the matching .png file in this folder with your real screenshot — drag your new image onto the file and pick "Replace", OR right-click → Get Info → drag image into thumbnail.
3. Move the filled file UP to the parent folder (../) — into `public/screens/`.
4. Run `npm run build` OR push to main. The placeholder on the chapter page auto-swaps to your real image.

Naming: keep the .png filename exactly as listed. The ID is what binds the file to the chapter placeholder.

Sanitization (before saving any screenshot):
- Mask contact names, deal names, channel IDs, workspace identifiers
- Mask OAuth tokens, API keys, session URLs
- Mask any $ amount that identifies a specific Belkins/Folderly account
- When in doubt, use a fresh demo workspace with fake data

Priority order (highest impact first):
TIER S — book-defining (start here):
  01-killed-my-tabs-1  → #vlad-ops Slack 6:30 AM brief (THE marquee shot)
  01-killed-my-tabs-2  → Cowork window with scheduled tasks running
  04-the-vault-1       → Obsidian graph view of your vault
  24-tier-list-1       → Your tier list as rendered on /tier-list
  38-run-until-done-2  → /goal overlay panel (timer + turn counter + token meter)

TIER A — receipts and surfaces:
  02-five-tools-1, 02-five-tools-2 (connectors + billing)
  04-the-vault-2 (your CLAUDE.md or recent vault note)
  05-skills-1 (~/.claude/skills/ folder)
  07-cron-1 (Cowork Scheduled Tasks panel)
  08-three-doors-1 (replaced by SVG — skip unless you want a real shot)
  09-dont-get-owned-1 (secret manager vault)
  12-connectors-mcp-1, 12-connectors-mcp-2 (.mcp.json + /mcp output)
  13-quickstart-1, 13-quickstart-2 (Claude Code first task + end state)
  14-cheat-sheet-1 (~/.claude/settings.json)
  22-sessions-1 (claude --resume picker)
  26-team-adoption-1 (9:47 AM Slack — twelve people, five reactions)
  29-cost-economics-1 (Anthropic console weekly cost)

TIER B — supporting:
  03-temp-agency-1, 10-wild-stuff-1, 11-build-a-skill-1
  15-permissions-1/2, 16-hooks-subagents-2
  17-tips-tricks-1, 18-headless-ci-1
  19-build-products-1/2 (Vercel + phone)
  20-terminal-windows-1/2 (tmux + Raycast)
  23-vibe-coding-1/2/3 (Saturday build artifacts)
  27-voice-agents-1, 33-browser-agents-1
  34-write-on-behalf-1, 35-codex-and-cc-1
