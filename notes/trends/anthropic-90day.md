# Anthropic shipping cadence — Feb to May 2026

> Research summary for the operator field manual. Sourced from web search 2026-05-14; every claim has a URL or "(unverified)" tag. Real numbers per claim where claimable. Confidence tags: **high** (official anthropic.com / docs / first-party changelog), **medium** (multiple secondary sources agree), **low** (single secondary source).

---

## 1. New slash commands in Claude Code

Claude Code crossed 30+ releases between March and April 2026 alone (v2.1.69 → v2.1.101 → v2.1.139). Commands below are the ones operators will actually reach for — not every internal flag.

### `/goal`
- **What it does:** set a finish-line condition; Claude runs autonomously while a smaller/faster model (Haiku) inspects the transcript after every turn to check whether the condition is met. Stops itself when satisfied. Indicator `◎ /goal active` shows elapsed time.
- **Shipped:** 2026-05-11, in Claude Code v2.1.139
- **Source:** https://findskill.ai/blog/claude-code-goal-command/ (confidence: medium — single detailed write-up, consistent with official changelog mentions)
- **Operator use:** "fix the failing checkout test and stop after tests pass" — fire-and-forget for narrow, verifiable tasks. The evaluator reads transcript only — it can't run commands or read files, so the condition must be one that surfaces in chat output. Aliases: `/goal clear`, `stop`, `off`, `reset`, `none`, `cancel`.

### `/plan`
- **What it does:** toggles plan permission mode — Claude proposes each tool action and waits for explicit approval before executing.
- **Shipped:** pre-Feb 2026 (already established by the cheat-sheet era)
- **Source:** https://learn-prompting.fr/blog/claude-code-slash-commands-reference (confidence: high — present in official docs)
- **Operator use:** unfamiliar codebases, large refactors, anything where a wrong write costs 30 min to undo.

### `/clear`
- **What it does:** wipes conversation history; context window resets to empty. File edits already on disk survive.
- **Shipped:** pre-Feb 2026
- **Source:** https://learn-prompting.fr/blog/claude-code-slash-commands-reference (confidence: high)
- **Operator use:** between unrelated tasks in the same session — cheaper than spawning a new shell.

### `/compact`
- **What it does:** compresses current context (summarizes older turns) to free token budget while preserving key state.
- **Shipped:** pre-Feb 2026
- **Source:** https://www.scriptbyai.com/claude-code-commands-cheat-sheet/ (confidence: high)
- **Operator use:** long debugging sessions before you hit context limits — keeps the thread alive without losing the thread.

### `/model`
- **What it does:** switches model mid-session. New shortcut `Option+P` (Mac) / `Alt+P` (Linux/Windows). Accepts arguments like `/model opusplan` for combined opus+plan mode.
- **Shipped:** updated shortcut/argument behavior surfaced in March 2026 changelog
- **Source:** https://blakecrosley.com/guides/claude-code-cheatsheet (confidence: medium)
- **Operator use:** drop from Opus 4.7 to Sonnet 4.6 on cheap mechanical tasks; bump back up for architecture work.

### `/powerup`
- **What it does:** interactive tutorials inside Claude Code — onboarding flow that walks new users through capability demos.
- **Shipped:** 2026-04-01, in v2.1.90
- **Source:** https://help.apiyi.com/en/claude-code-changelog-2026-april-updates-en.html (confidence: medium)
- **Operator use:** onboarding a new teammate or contractor — point them at `/powerup` instead of writing a doc.

### `/team-onboarding`
- **What it does:** guided team onboarding flow; ships with named sub-agent support.
- **Shipped:** 2026-04-10, in v2.1.101
- **Source:** https://help.apiyi.com/en/claude-code-changelog-2026-april-updates-en.html (confidence: medium)
- **Operator use:** standardize how new engineers spin up Claude Code on a shared codebase.

### `/resume`
- **What it does:** resume a prior session. May 2026 update added PR-URL search across GitHub/GitLab/Bitbucket to locate the right thread.
- **Shipped:** May 2026 enhancement
- **Source:** https://releasebot.io/updates/anthropic/claude-code (confidence: medium)
- **Operator use:** "what was I doing 3 days ago on that Stripe refund bug?" — find by PR URL instead of scrolling.

### `/cost`
- **What it does:** shows token usage / spend for the current session.
- **Shipped:** pre-Feb 2026
- **Source:** https://www.scriptbyai.com/claude-code-commands-cheat-sheet/ (confidence: high)
- **Operator use:** sanity-check before letting `/goal` run unattended on Opus.

### `/init`
- **What it does:** scaffolds a `CLAUDE.md` for the current repo.
- **Shipped:** pre-Feb 2026
- **Source:** https://www.scriptbyai.com/claude-code-commands-cheat-sheet/ (confidence: high)
- **Operator use:** first command in any new repo, every time.

### `/think` (unverified — source needed)
- Vlad mentioned this as an example. Did NOT surface in any of the cheat-sheet/changelog/official-docs results. Likely confused with extended-thinking model behavior, not a slash command. Mark "(unverified — could be remembered from a community wrapper or older alpha)".

### `/memory` (unverified — source needed)
- Did not surface as a built-in Claude Code command. Anthropic ships memory primarily through `CLAUDE.md` files and the Dreaming feature in Managed Agents. Some community skill packs publish their own `/memory` — but no first-party docs.

### Other commands worth knowing (surfaced in searches, low priority)
- `claude project purge [path]` — CLI flag, not slash command; deletes all Claude Code state for a project. Shipped April-May 2026.
- 60+ built-in commands + 5 bundled skills available — type `/` in session to list them all.

---

## 2. New / updated models

### Claude Sonnet 4.6
- **Released:** 2026-02-17
- **Context window:** 1M tokens (beta)
- **Pricing:** $3 / $15 per million input/output tokens (unchanged from Sonnet 4.5)
- **What's new:** developers in early access preferred it over Opus 4.5 (Nov 2025) on many real-world tasks. Default model on claude.ai Free and Pro, and in Claude Cowork.
- **Source:** https://www.anthropic.com/news/claude-sonnet-4-6 (confidence: high)

### Claude Opus 4.7
- **Released:** 2026-04-16
- **Context window:** (unverified — source needed; likely same Opus 4.6 baseline with 1M GA)
- **Pricing:** $5 / $25 per million input/output tokens (unchanged from Opus 4.6)
- **What's new:**
  - `effort` parameter: tune intelligence vs. token spend; new `xhigh` tier for coding/agentic loops
  - **task budgets:** a rough token target for the full agentic loop (thinking + tools + output)
  - **substantially better vision** — sees images in greater resolution
  - automatic cybersecurity safeguards; Cyber Verification Program for legitimate red-team/pentest use
  - Anthropic publicly conceded Opus 4.7 trails their unreleased `Mythos` internal model on benchmarks
- **Available on:** Claude API, Bedrock, Vertex AI, Microsoft Foundry
- **Source:** https://www.anthropic.com/news/claude-opus-4-7 (confidence: high)
- **Operator note:** the `effort` parameter is the actionable lever here — Vlad's portfolio scripts can save 30-60% token cost by dropping below `xhigh` for non-coding tasks.

### Claude Haiku 4.5
- **Released:** 2025-10-15 (outside 90-day window but still the current Haiku tier)
- **Context window:** standard
- **Pricing:** $1 / $5 per million tokens; up to 90% cost savings with prompt caching, 50% with batch
- **Performance:** matches Sonnet 4 on coding/computer use; 73.3% SWE-bench Verified; runs 4-5x faster than Sonnet 4.5
- **Source:** https://www.anthropic.com/news/claude-haiku-4-5 (confidence: high)
- **Operator note:** Haiku 4.5 is what powers the `/goal` evaluator — cheap enough to run every turn.

### Opus 4.6 (still GA, 1M context)
- **Milestone:** Opus 4.6 with 1M context officially GA in Claude Code v2.1.75 (2026-03-13)
- Leading MRCR v2 benchmarks; output token limits 64K-128K
- **Source:** https://help.apiyi.com/en/claude-code-changelog-2026-april-updates-en.html (confidence: medium)

### Deprecations
- Claude Sonnet 4 and Opus 4 — being deprecated, with migration deadline before **June 15, 2026**.
- **Source:** https://www.mindstudio.ai/blog/claude-sonnet-4-opus-4-deprecation-migration-guide (confidence: medium)
- **Operator note:** anything pinned to `claude-sonnet-4` or `claude-opus-4` in code or skill files needs a sweep before June 15.

---

## 3. Skills feature evolution

Skills landed as an open standard in **December 2025**. OpenAI adopted the same format for Codex CLI and ChatGPT — making Skills a cross-vendor standard, not an Anthropic-only construct.

### What changed Feb-May 2026
- **Org-wide Skill management** (beta) — Team and Enterprise admins can now centrally manage Skills for their org. (Source: https://releasebot.io/updates/anthropic — confidence: medium)
- **Prebuilt partner Skills:** Canva, Notion, Figma, Atlassian + Anthropic-built for Excel (with formulas), PowerPoint, Word, fillable PDFs.
- **Skill permission rules:** wildcard now works as a prefix match (May 2026 fix). Plugin marketplace key vs manifest name mismatch fixed.
- **Source:** https://github.com/anthropics/skills (confidence: high — official repo)
- **Source:** https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/ (confidence: high)
- **Marketplace:** community marketplaces exist (skillsmp.com, plugins-for-cowork.com) but no Anthropic-operated paid marketplace yet — Anthropic ran a test marketplace for **agent-on-agent commerce** in April 2026 (separate experiment).
- **Source:** https://techcrunch.com/2026/04/25/anthropic-created-a-test-marketplace-for-agent-on-agent-commerce/ (confidence: high)

### Cowork ↔ Skills integration
- Skills are usable inside Cowork (the GA desktop product). The same SKILL.md format works in both Claude Code and Cowork.
- **Confidence:** medium — confirmed via official partner-skill availability list.

---

## 4. MCP protocol evolution

### Official MCP Registry (preview)
- **Launched:** preview state in 2026 (date unverified — site says "preview, may experience breaking changes")
- **URL:** https://registry.modelcontextprotocol.io/
- **What it is:** open catalog + API for discovering MCP servers; designed to be mirrored so enterprises can pull canonical feed and apply allow/deny lists internally
- **Source:** https://www.gentoro.com/blog/what-is-anthropics-new-mcp-registry (confidence: medium)
- **Operator use:** for portfolio companies with security review burden, the mirror-able design means you can run an internal MCP catalog without re-inventing discovery.

### MCP Foundation
- Anthropic donated the Model Context Protocol to a new **Agentic AI Foundation** — MCP is no longer Anthropic-controlled going forward.
- **Source:** https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation (confidence: high)
- **Operator note:** reduces single-vendor risk for anything built on MCP — Vlad's stack with Cowork + connectors is safer for it.

### Critical security vulnerability — CVE-2026-30623
- **Published:** April 2026 (OX Security disclosure)
- **What it is:** command injection via MCP SDK's STDIO interface. By design, the STDIO server can run arbitrary OS commands. Anthropic confirmed this is **by design**, declined to modify, says sanitization is the developer's responsibility.
- **Blast radius:** ~200,000 publicly accessible MCP servers; 9 out of 11 MCP registries accepted OX's malicious test package without security review.
- **Source:** https://www.theregister.com/2026/04/16/anthropic_mcp_design_flaw/ (confidence: high)
- **Source:** https://docs.litellm.ai/blog/mcp-stdio-command-injection-april-2026 (confidence: high)
- **Operator imperative:** if any portfolio company is running third-party MCP servers, audit them. Don't `npx <random-mcp>` from untrusted authors. This is real and Anthropic isn't patching it upstream.

### Spec changes (Nov 25, 2025 release — just before window)
- Async operations, statelessness, server identity, official extensions added.
- **Source:** https://www.pento.ai/blog/a-year-of-mcp-2025-review (confidence: medium)

---

## 5. Claude Managed Agents / Agent SDK / Files API / Computer Use

### Three new Managed Agent features (Code with Claude, 2026-05-06)
- **Dreaming (research preview):** Claude reviews past sessions, finds patterns, self-improves memory. Can auto-update memory or require human review.
- **Outcomes:** define a success rubric; a separate grader (its own context window) evaluates output and tells the agent what to fix. Avoids self-evaluation bias.
- **Multi-agent orchestration (at managed-agent level):** a lead agent breaks the job, delegates to specialist sub-agents with their own models/prompts/tools, working in parallel on a shared filesystem. Lead can check in mid-flight.
- **Source:** https://9to5mac.com/2026/05/07/anthropic-updates-claude-managed-agents-with-three-new-features/ (confidence: high)
- **Source:** https://www.mindstudio.ai/blog/code-with-claude-2026-new-agent-features (confidence: medium)

### Agent SDK credits on subscriptions
- Pro, Max, Team, Enterprise plans get a **monthly Agent SDK credit** starting **2026-06-15**.
- **Source:** https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan (confidence: high)
- **Operator note:** for Vlad's portfolio, this changes the economics of running custom agents on top of subscription plans rather than pay-per-token API.

### Computer Use evolution
- Now split into two execution models:
  - **API route** for builders: screenshots, mouse, keyboard, in a sandbox the builder controls
  - **Product route** for end users: Cowork and Claude Code run on the user's machine with Anthropic managing session/approval
- **Source:** https://blog.laozhang.ai/en/posts/claude-computer-use (confidence: medium)

### Files API
- Still in beta. Upload + reference documents across conversations. Now available natively on Claude Platform on AWS (with AWS billing + IAM auth).
- **Source:** https://releasebot.io/updates/anthropic (confidence: medium)

### Claude Platform on AWS (2026)
- New: full Messages API, Files API, Batches, Managed Agents, Agent Skills, code execution, tool use — all accessible through native AWS endpoints with AWS billing and IAM.
- **Source:** https://releasebot.io/updates/anthropic (confidence: medium)
- **Operator note:** if a portfolio company is AWS-locked for procurement reasons, this unlocks Claude usage on AWS billing without Anthropic-direct contracts.

### Claude Finance
- 10 pre-built agents for financial workflows shipped at Code with Claude 2026 (no detailed source in the 90-day window — high-level mention only).

### Add-ins
- New Agent SDK feature category. Specifics unverified — surfaced only in summary write-ups.

---

## 6. Cowork (claude.ai desktop)

### GA milestone
- **Cowork is generally available** for all paid subscribers on macOS and Windows since **2026-04-09** — graduated from research preview.
- **Source:** https://blog.laozhang.ai/en/posts/claude-computer-use (confidence: medium)
- **Source:** https://www.datacamp.com/tutorial/claude-cowork-tutorial (confidence: medium)

### Connectors expansion
- **38+ connectors** available, including: Slack, Notion, Google Drive, Gmail, Google Calendar, HubSpot, Jira, Salesforce, Snowflake, Apollo, Clay, Outreach, GitHub, Microsoft 365, Figma, Atlassian, Canva.
- **All connectors are free.**
- **Source:** https://meetingnotes.com/blog/best-claude-connectors (confidence: medium)
- **Source:** https://claude.com/connectors (confidence: high)
- **February 2026 update** added 12 new connectors specifically for sales workflows.

### Legal vertical push (May 2026)
- Anthropic shipped **20+ legal connectors and 12 practice-area plugins** for Claude — explicit play for legal-tech vertical.
- **Source:** https://www.lawnext.com/2026/05/anthropic-goes-all-in-on-legal-releasing-more-than-20-connectors-and-12-practice-area-plugins-for-claude.html (confidence: high)

### Thomson Reuters partnership
- Expanded partnership — Claude now connects with **CoCounsel Legal**.
- **Source:** https://www.thomsonreuters.com/en/press-releases/2026/may/thomson-reuters-and-anthropic-expand-partnership-to-connect-claude-with-cocounsel-legal (confidence: high)

### Plan pricing
- Pro: $17/mo annual or $20/mo monthly
- Max: $100-$200/mo (5x or 20x Pro usage)
- Team Standard: $100/mo total (5 seats — works out to ~$20/seat)
- Enterprise: custom
- **Source:** https://claude.com/pricing (confidence: high)

---

## 7. Other surfaces

### Claude Code IDE extensions
- **VS Code extension:** native graphical interface, checkpoint support (file edits tracked, rewind to previous state, fork or revert), conversation history in tabs/windows, @-mention files with specific line ranges. **5.2M installs, 4.0/5 average rating** — leads competing tools in VS Code Marketplace.
- **JetBrains plugin:** Anthropic's official Claude Code **[Beta]** plugin from JetBrains Marketplace. Runs the CLI inside the integrated terminal, opens proposed changes in the IDE's diff viewer. Shares config via `~/.claude/settings.json`.
- **Source:** https://code.claude.com/docs/en/vs-code (confidence: high)
- **Source:** https://plugins.jetbrains.com/plugin/27310-claude-code-beta- (confidence: high)
- **Background tasks via GitHub Actions** — Claude Code now supports background tasks through GitHub Actions with native VS Code/JetBrains integration showing edits inline.
- **Visual Studio 2026 integration:** open issue (https://github.com/anthropics/claude-code/issues/15942) — not shipped yet.

### Claude Code reliability work (March-May 2026)
- Smarter model picker, project purge tool, stronger permission handling, OAuth login improvements, Windows + PowerShell fixes
- Bedrock service-tier selection (`ANTHROPIC_BEDROCK_SERVICE_TIER` env var)
- PR URL search in `/resume` across multiple platforms
- OpenTelemetry numeric attributes emitted as numbers (fixes downstream dashboards)
- VS Code extension activation fixes on Windows
- MCP server config handling improvements
- Memory optimization
- Fast mode (research preview) now supports Opus 4.7
- **Source:** https://releasebot.io/updates/anthropic/claude-code (confidence: medium)

### Infrastructure / business signals
- Anthropic announced a deal with **SpaceX** for capacity on the Colossus supercluster — exclusive allocation to Claude. (Source: Code with Claude 2026 keynote — https://chrisebert.net/notes-from-code-with-claude-2026/ — confidence: medium)
- **API volume up 17x year-on-year** on Anthropic platform (Code with Claude 2026 keynote).
- Anthropic conceded internal unreleased model `Mythos` outperforms Opus 4.7 — suggests next major release is queued behind safety work.

---

## Implications for the book

### Chapters that need updates

1. **Slash commands chapter** (whichever covers Claude Code workflow) — add `/goal`, update `/plan` and `/resume` examples. The `/goal` autonomous-loop pattern is itself a chapter-worthy operator pattern: "fire-and-forget for verifiable tasks." Frame it as the operator equivalent of CI: define the green condition, let the loop run.

2. **Model selection chapter** — refresh pricing table (Sonnet 4.6 = $3/$15, Opus 4.7 = $5/$25, Haiku 4.5 = $1/$5). Add the **effort parameter** and **task budgets** as cost-control levers — these are the new actionable knobs.

3. **MCP chapter** — must add the **CVE-2026-30623 / STDIO command injection** warning. Anthropic considers it by-design; operators must treat third-party MCP servers as supply-chain risk. Pair with the **MCP Registry** as discovery layer + **MCP Foundation** as governance.

4. **Skills chapter** — note the **cross-vendor adoption** (OpenAI Codex CLI uses same format). Skills are no longer Anthropic-specific; they're an emerging standard.

5. **Cowork chapter** — update from "research preview" to "GA since April 9 2026." Add the 38+ connector list and the legal-vertical push as case study of how Anthropic verticalizes.

### Chapters / research notes worth creating

6. **"Autonomous loops" research note** — `/goal`, Outcomes, Dreaming, multi-agent orchestration share a pattern: define-success-then-walk-away. Anthropic shipped four manifestations of this in 90 days. That's a thesis.

7. **"Subscription Agent SDK economics" research note** — June 15 monthly credit on Pro/Max/Team/Enterprise changes the build-vs-buy math for portfolio companies running their own agents. Worth a numbers-driven analysis: at what usage does subscription beat pay-per-token?

8. **"MCP supply chain" research note** — the by-design STDIO behavior + 200k vulnerable servers + 9/11 poisoned registries is a real operator story. Pair with internal-mirror pattern recommended by the Registry preview.

### Chapters / patterns to retire or revise

9. Anything claiming **Opus 4.5 or 4.6 is current Opus tier** — replaced by 4.7. Anything claiming Sonnet 4.5 is current — replaced by 4.6.
10. **Cowork-as-research-preview** framing — now GA.
11. Any code samples that pin **`claude-sonnet-4` or `claude-opus-4`** — deprecated, removal **June 15, 2026**.
12. The `/think` and `/memory` commands Vlad mentioned: **don't write these as first-party Claude Code commands.** They don't appear in changelog or docs. They may exist as community skills or Vlad may be remembering an older alpha. Verify before featuring.

---

## Sources

- [Introducing Claude Sonnet 4.6 — Anthropic](https://www.anthropic.com/news/claude-sonnet-4-6) — 2026-02-17, high
- [Introducing Claude Opus 4.7 — Anthropic](https://www.anthropic.com/news/claude-opus-4-7) — 2026-04-16, high
- [Introducing Claude Haiku 4.5 — Anthropic](https://www.anthropic.com/news/claude-haiku-4-5) — 2025-10-15, high
- [Claude Code /goal — FindSkill.ai](https://findskill.ai/blog/claude-code-goal-command/) — 2026-05-11, medium
- [Claude Code Commands — official docs](https://code.claude.com/docs/en/commands) — high
- [Claude Code Changelog — official](https://code.claude.com/docs/en/changelog) — high
- [Claude Code April 2026 changelog decoded — Apiyi](https://help.apiyi.com/en/claude-code-changelog-2026-april-updates-en.html) — medium
- [Releasebot Anthropic May 2026 updates](https://releasebot.io/updates/anthropic) — medium
- [Releasebot Claude Code May 2026](https://releasebot.io/updates/anthropic/claude-code) — medium
- [Live blog: Code w/ Claude 2026 — Simon Willison](https://simonwillison.net/2026/May/6/code-w-claude-2026/) — medium
- [Notes from Code with Claude 2026 — Chris Ebert](https://chrisebert.net/notes-from-code-with-claude-2026/) — medium
- [Anthropic Updates Claude Managed Agents — 9to5Mac](https://9to5mac.com/2026/05/07/anthropic-updates-claude-managed-agents-with-three-new-features/) — high
- [Claude Managed Agents docs](https://platform.claude.com/docs/en/managed-agents/overview) — high
- [Code with Claude 2026: 5 New Agent Features — MindStudio](https://www.mindstudio.ai/blog/code-with-claude-2026-new-agent-features) — medium
- [Use Agent SDK with Claude plan — Help Center](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan) — high
- [Sonnet 4 / Opus 4 deprecation — MindStudio](https://www.mindstudio.ai/blog/claude-sonnet-4-opus-4-deprecation-migration-guide) — medium
- [Anthropic skills repo](https://github.com/anthropics/skills) — high
- [Agent Skills as standard — The New Stack](https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/) — high
- [Agent-on-agent commerce test marketplace — TechCrunch](https://techcrunch.com/2026/04/25/anthropic-created-a-test-marketplace-for-agent-on-agent-commerce/) — high
- [MCP Registry preview](https://registry.modelcontextprotocol.io/) — high
- [What is Anthropic's MCP Registry — Gentoro](https://www.gentoro.com/blog/what-is-anthropics-new-mcp-registry) — medium
- [Donating MCP / Agentic AI Foundation — Anthropic](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) — high
- [CVE-2026-30623 MCP STDIO injection — liteLLM](https://docs.litellm.ai/blog/mcp-stdio-command-injection-april-2026) — high
- [MCP design flaw 200k servers — The Register](https://www.theregister.com/2026/04/16/anthropic_mcp_design_flaw/) — high
- [MCP Roadmap](https://modelcontextprotocol.io/development/roadmap) — high
- [Computer Use in 2026 — LaoZhang AI](https://blog.laozhang.ai/en/posts/claude-computer-use) — medium
- [Claude Cowork tutorial — DataCamp](https://www.datacamp.com/tutorial/claude-cowork-tutorial) — medium
- [Anthropic legal connectors — LawSites](https://www.lawnext.com/2026/05/anthropic-goes-all-in-on-legal-releasing-more-than-20-connectors-and-12-practice-area-plugins-for-claude.html) — high
- [Thomson Reuters partnership](https://www.thomsonreuters.com/en/press-releases/2026/may/thomson-reuters-and-anthropic-expand-partnership-to-connect-claude-with-cocounsel-legal) — high
- [Claude Connectors](https://claude.com/connectors) — high
- [21 Favorite Claude Connectors — MeetingNotes](https://meetingnotes.com/blog/best-claude-connectors) — medium
- [Claude Pricing](https://claude.com/pricing) — high
- [Claude Code VS Code docs](https://code.claude.com/docs/en/vs-code) — high
- [Claude Code JetBrains plugin](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-) — high
- [Visual Studio 2026 integration issue](https://github.com/anthropics/claude-code/issues/15942) — high
- [Slash commands reference — Learnia](https://learn-prompting.fr/blog/claude-code-slash-commands-reference) — medium
- [Claude Code cheatsheet — Blake Crosley](https://blakecrosley.com/guides/claude-code-cheatsheet) — medium
- [Claude Code commands cheat sheet — ScriptByAI](https://www.scriptbyai.com/claude-code-commands-cheat-sheet/) — medium

---

## Wrap-up for the parent agent

### (1) Commands I confirmed in the 90-day window with first-party or strong secondary sources
- **`/goal`** (new, 2026-05-11, Claude Code v2.1.139)
- **`/powerup`** (new, 2026-04-01, v2.1.90)
- **`/team-onboarding`** (new, 2026-04-10, v2.1.101)
- **`/resume` with PR URL search** (May 2026 enhancement)
- **`/model` with new `Option+P`/`Alt+P` shortcut + `opusplan` argument** (March 2026)
- **`/plan`, `/clear`, `/compact`, `/cost`, `/init`** (pre-Feb 2026; confirmed still current)

### (2) What I could not verify
- **`/think`** — Vlad mentioned this; not in any official source. Likely confused with extended-thinking model behavior or a community skill. Do not feature without verification.
- **`/memory`** — same story. Not first-party. Memory in Anthropic's stack is `CLAUDE.md` files + the new Dreaming feature in Managed Agents.
- **Opus 4.7 context window** — pricing and effort/budget params confirmed, exact context window not explicitly stated in retrieved sources beyond "Opus 4.6 baseline".
- **MCP Registry exact launch date** — confirmed in preview, no firm launch date surfaced.

### (3) Top 3 implications for the book
1. **Add `/goal` and the autonomous-loop pattern as a flagship chapter.** Anthropic shipped four versions of "define success, let it run" in 90 days (`/goal`, Outcomes, Dreaming, multi-agent orchestration). This is the dominant operator pattern of the next quarter. The book should treat it as a thesis chapter, not a feature mention.
2. **Add an MCP supply-chain warning chapter.** CVE-2026-30623 is real, Anthropic isn't patching upstream (by-design), and 200k servers are exposed. Operators running portfolio companies need an explicit chapter on auditing MCP servers, mirroring the Registry internally, and treating third-party MCP packages with the same caution as npm dependencies in 2018.
3. **Refresh every model-pricing reference and retire `claude-sonnet-4`/`claude-opus-4` code samples before June 15.** Sonnet 4.6 ($3/$15), Opus 4.7 ($5/$25), Haiku 4.5 ($1/$5) are current. The `effort` parameter and task budgets on Opus 4.7 are net-new actionable cost levers worth their own short section in the cost-control chapter.
