# Claude Code — slash commands + IDE features, May 2026

> Deep dive on `/goal` and the new command surface. Sources for every claim.
> Research date: 2026-05-14. Target version anchor: Claude Code 2.1.139 (shipped May 11, 2026).

---

## TL;DR for the impatient

- `/goal <condition>` is real, ships in Claude Code **v2.1.139 (May 11, 2026)**, and is documented at https://code.claude.com/docs/en/goal — it's a session-scoped autonomous-loop wrapper around a prompt-based Stop hook.
- It's part of a 3-feature wave that landed together on May 11: **Agent View** (the `claude agents` dashboard), **`/goal`**, and **`/scroll-speed`**. v2.1.140 the next day fixed `/goal silently hanging with certain hook configurations`.
- The autonomous-work command surface now reads as a clean 3-way: `/goal` (run until condition met) — `/loop` (run on time interval) — Stop hooks (run with custom logic).
- The book's three-mode chapter (Ch 21) needs an update: there are effectively four modes now once you count `/goal` as a distinct loop primitive.

---

## `/goal` — the marquee new command

### What it does — verbatim from Anthropic docs

> The `/goal` command sets a completion condition and Claude keeps working toward it without you prompting each step. After each turn, a small fast model checks whether the condition holds. If not, Claude starts another turn instead of returning control to you. The goal clears automatically once the condition is met.
> — https://code.claude.com/docs/en/goal

### Shipped

- **Version:** Claude Code 2.1.139
- **Date:** May 11, 2026
- **Companion release:** Agent View (also v2.1.139, same day)
- **Follow-up patch:** v2.1.140 (May 12) — "fixed /goal silently hanging with certain hook configurations"
- **Source:** code.claude.com changelog; claude-world.com release recap; explainx.ai writeup

### Input shape

```text
/goal <condition up to 4,000 chars>
```

Examples from the official docs:

```text
/goal all tests in test/auth pass and the lint step is clean
```

```bash
claude -p "/goal CHANGELOG.md has an entry for every PR merged this week"
```

### What it modifies

- **Session-scoped Stop hook** — Anthropic's docs are explicit: `"/goal is a wrapper around a session-scoped prompt-based Stop hook."` It does not write to settings.json; it does not persist across new sessions started with `/clear`.
- **Persists across resume.** A goal that was still active when a session ended is restored on `--resume` or `--continue` — but the turn count, elapsed timer, and token-spend baseline reset.
- **One goal per session.** Setting a new one replaces the old.
- **No tool access for the evaluator.** The small fast model (default: Haiku, per `/en/model-config`) judges only what Claude has already surfaced in the conversation. It cannot run commands or read files itself.

### What you see while it's running

A live overlay panel labeled `◎ /goal active` with three counters: elapsed time, turns evaluated, tokens spent. After every turn, the evaluator emits a short "why not yet" reason that surfaces in the transcript so the next turn can react to it.

### Best use — operator scene

The condition has to be something Claude's own output can demonstrate in the transcript. So the killer use cases are:

- **"Migrate `src/` from Solid to React until `npm test` exits 0 and no other test files change."** Classic test-passing refactor loop where the evaluator's signal is the test runner's exit code that Claude already had to print.
- **"All P0 issues in the GitHub queue labeled `auth` are closed."** Backlog drainer — evaluator reads the `gh issue list` Claude already ran.
- **"Lighthouse score for `/dashboard` is ≥ 90 on all four axes."** Performance grinder. Claude runs Lighthouse, the result lands in transcript, evaluator decides.
- **"All references to `claude-3-5-sonnet` in this repo are replaced with `claude-opus-4-7`, all tests pass, and the diff is on a branch."** Model upgrade — the kind of multi-step task that used to need three prompt-and-wait cycles.

### Subcommands / aliases

- `/goal` (no arg) — show current state: condition, elapsed, turns, tokens, last evaluator reason
- `/goal clear` — kill an active goal
- Aliases for clear: `stop`, `off`, `reset`, `none`, `cancel`
- `/clear` (new conversation) also removes an active goal

### Quirks / gotchas

1. **Hook-system dependency.** `/goal` is unavailable when `disableAllHooks` is set at any settings level or when `allowManagedHooksOnly` is set in managed settings — the command tells you why instead of silently no-op-ing. Enterprises that lock hooks lose this command.
2. **Trust dialog required.** Only runs in workspaces where you've accepted the trust dialog (because the evaluator is part of the hooks system).
3. **Evaluator is provider-bound.** It runs on whichever provider your session is configured for (Bedrock, Vertex, Anthropic direct). Same model family.
4. **Condition reading is conversational.** "All tests pass" only works if Claude actually surfaces test output. If the test runs in a subprocess whose stdout doesn't bubble back, the evaluator never sees pass/fail — you'll loop forever.
5. **Auto-stop clause is your job.** Without `or stop after 20 turns` baked into the condition, an underspecified goal can drain budget. Put a stop clause in.
6. **Token cost is small but real.** Each turn adds an evaluator call (Haiku-class, full conversation as input). Docs say "typically negligible compared to main-turn spend." On a 50-turn run that's still 50 evaluator passes.
7. **The May 12 hotfix.** v2.1.140 fixed a case where `/goal silently hung` with certain hook configurations — so the first 24 hours of public use surfaced at least one corner case. Worth knowing if anyone tries to backdate the feel.

### Comparison to `/loop`

| | `/goal` | `/loop` |
|---|---|---|
| Next turn starts when | Previous turn finishes | Time interval elapses |
| Stops when | Evaluator says condition met | You stop it, or Claude decides done |
| Use shape | "Drive to an outcome" | "Poll on a schedule" |
| Time clause | In the condition string | A flag (`/loop 5m`) |
| Evaluator | Small fast model judges output | None — Claude decides per iteration |

`/loop` example: `/loop 5m check if the deploy finished`. It's autopilot-style polling. `/goal` is goal-directed and self-evaluating.

### Comparison to a custom Stop hook

`/goal` is a session-scoped shortcut you type. A Stop hook lives in `settings.json`, applies to every session in its scope, and can run a deterministic script (not just a prompt). If you want determinism — "stop when this script returns 0" — write a Stop hook. If you want fast iteration on "stop when X holds," type `/goal`.

### Codex parallel

OpenAI's Codex CLI shipped its own `/goal` in v0.128.0 prior to this. The community framing is that Anthropic shipped `/goal` partly to close the loop with Codex. Devtoolpicks and findskill.ai both lead with this comparison. Codex's version is documented as similar in shape — set a finish line, walk away.

### Example invocation (full)

```text
/goal lint passes, npm test exits 0, the auth migration in src/auth/* compiles
under strict tsc, and no file outside src/auth/ has been modified, or stop after
30 turns
```

```text
◎ /goal active — 12m 04s — turn 7 of unbounded — 41k tokens
Last evaluator note: "tests passing but tsc strict failed on User.ts:42 — narrow
the return type before declaring done"
```

```text
/goal clear
✓ goal cleared (was active 22m 11s, 13 turns, 71k tokens)
```

---

## Other recent slash commands

This is the section to skim if you only have 5 minutes. Each entry: what it does, when it shipped, operator use case.

### `/agents` — Agent View

- **What:** Single CLI dashboard listing every background session (running, blocked on you, done). Dispatch new sessions, see at-a-glance state, reply inline without attaching to the full transcript.
- **Shipped:** v2.1.139, May 11, 2026 (Research Preview)
- **Use:** When you've fanned 4–8 worktree agents out via `/batch` and need to see which one is waiting for you to approve a deploy. Replaces the pre-2026 hack of tmux grids and 12 terminal tabs.
- **Source:** https://code.claude.com/docs/en/agent-view, https://claude.com/blog/agent-view-in-claude-code

### `/background` (alias `/bg`)

- **What:** Detach the current session and keep it running as a background agent. Pass a prompt to send one last instruction before detaching.
- **Shipped:** v2.1.139 (the broader background-agent system rolled out across April/May 2026)
- **Use:** Long-running migration. Type the kick-off prompt, `/bg`, free your terminal, monitor via `claude agents`.

### `/batch <instruction>` (bundled skill)

- **What:** Decomposes a large change into 5–30 independent units, presents a plan, then spawns one background subagent per unit in an isolated git worktree. Each subagent implements, tests, and opens a PR.
- **Shipped:** rolled out as bundled skill alongside worktree maturation in April 2026
- **Use:** `/batch migrate src/ from Solid to React`. The doc's literal example. This is the command that justifies having a Mac with enough RAM to run 20 background subagents.

### `/tasks` (alias `/bashes`)

- **What:** List and manage background tasks within the current session (different from `/agents` which manages whole sessions).
- **Use:** You started `npm test` and `npm run build` in parallel via Bash with `run_in_background: true`. `/tasks` shows them.

### `/loop [interval] [prompt]` (bundled skill, alias `/proactive`)

- **What:** Run a prompt repeatedly while the session stays open. Omit interval and Claude self-paces. Omit prompt and Claude runs an autonomous maintenance check or the prompt in `.claude/loop.md`.
- **Shipped:** March 2026 (per the apiyi.com "12 core new features" recap)
- **Use:** `/loop 5m check if the deploy finished`. Or `/loop` with no args for self-paced autonomous work — closest pre-`/goal` analog.

### `/schedule [description]` (alias `/routines`)

- **What:** Create persistent routines that run on Anthropic-managed cloud infrastructure. Conversational setup walks you through prompt, repo, connectors, cadence. Behavior changed April 14, 2026: pre-April 14, `/schedule` was a session-scoped scheduling primitive; post-April 14, it creates cloud routines that run with your laptop closed.
- **Shipped:** April 14, 2026 (Routines Research Preview)
- **Use:** Morning triage. Nightly tests. Weekly digest. Anything that should run without you babysitting.
- **Cron alternative:** For local-only watchdogs you still want launchd or in-file self-check — `/schedule` is cloud-only.

### `/think`

- Not a built-in command. The "think harder" lever is `/effort` (slider: low / medium / high / xhigh / max) or in-prompt magic words like "ultrathink." Worth flagging because users assume it exists.

### `/clear` (aliases `/reset`, `/new`)

- **What:** Start a new conversation with empty context. Previous conversation stays in `/resume`. Pass a name to label the previous in the picker.
- **Shipped:** Pre-2026, but the labeling-on-clear feature is newer
- **Use:** Hitting context limits and starting a new task. Pairs with `/compact` (which keeps the conversation but summarizes it).

### `/compact [instructions]`

- **What:** Free up context by summarizing the conversation so far. Pass focus instructions to bias what survives.
- **Use:** You're 80% through a big task and 90% through your context window. `/compact focus on the auth changes` keeps the relevant scaffolding.

### `/memory`

- **What:** Edit `CLAUDE.md` memory files, enable/disable auto-memory, view auto-memory entries.
- **Shipped:** Auto-memory rolled out earlier in 2026 (auto-memory entries get reviewed and surfaced in `/memory`)
- **Use:** Pin a project decision so it survives `/clear`.

### `/plan [description]`

- **What:** Enter plan mode directly from the prompt. Pass an optional description to enter plan mode and immediately start.
- **Use:** Before a multi-file change, `/plan fix the auth bug` opens plan mode pre-loaded with the task. See "Plan mode evolution" below.

### `/context [all]`

- **What:** Visualize current context usage as a colored grid, with optimization suggestions for context-heavy tools, memory bloat, and capacity warnings.
- **Use:** When `/compact` keeps not helping — `/context` shows which tool outputs are eating your budget.

### `/btw <question>`

- **What:** Ask a quick side question without adding to the conversation. (Doesn't bloat history.)
- **Use:** "btw what does `\\d{3,4}` match in this regex" — the answer never lands in your main thread.

### `/effort [level|auto]`

- **What:** Set model effort. `low` / `medium` / `high` / `xhigh` (Opus 4.7) / `max`. `max` is session-only.
- **Shipped:** v2.1.111 (April 16, 2026) added the `/effort` interactive slider when called without args, plus `xhigh` for Opus 4.7.
- **Use:** Lever 1 of the four token-efficiency levers. `low` for typo fixes, `max` for architecture decisions.

### `/rewind` (aliases `/checkpoint`, `/undo`)

- **What:** Rewind the conversation and/or code to a previous point, or summarize from a selected message.
- **Use:** Claude went down a wrong refactor path 4 turns ago — `/rewind` rolls both the chat and the files back.

### `/simplify [focus]` (bundled skill)

- **What:** Spawns three review agents in parallel, aggregates findings, applies fixes for code reuse, quality, efficiency.
- **Shipped:** April 2026 (skill bundled into the CLI)
- **Use:** Pre-commit pass on a feature branch.

### `/ultraplan <prompt>`

- **What:** Draft a plan in a cloud ultraplan session, review in the browser, execute remotely or send back to terminal.
- **Use:** Deep multi-step execution planning for the kind of work that takes hours.

### `/ultrareview [PR]`

- **What:** Deep multi-agent code review in a cloud sandbox. 3 free runs/month on Pro and Max.
- **Shipped:** v2.1.111 (April 16, 2026); CI-friendly `claude ultrareview [target]` subcommand added in v2.1.120 (April 28, 2026)
- **Use:** Pre-merge review on consequential PRs. Different and deeper than the local `/review`.

### `/recap`

- **What:** One-line summary of the current session on demand. Pairs with the automatic recap that surfaces when you've been away.
- **Shipped:** v2.1.108 (April 14, 2026)
- **Use:** Returning to a session after lunch. Auto-recap usually fires; manual `/recap` forces it.

### `/team-onboarding`

- **What:** Generates a teammate ramp-up guide from your last 30 days of Claude Code usage — sessions, commands, MCP servers. Returns a shareable markdown a teammate can paste as a first message.
- **Shipped:** v2.1.101 (April 10, 2026)
- **Use:** Onboarding a junior engineer to a project where you've already done 50 hours of Claude Code work. Pro/Max/Team/Enterprise also get a share link.

### `/teleport` (alias `/tp`)

- **What:** Pull a Claude Code on the web session into the local terminal.
- **Use:** Started a long task on claude.ai/code on phone during commute, want to finish locally.

### `/remote-control` (alias `/rc`)

- **What:** Make the local session available for remote control from claude.ai.
- **Use:** Inverse of `/teleport` — start locally, finish on a different device.

### `/insights`

- **What:** Report analyzing your Claude Code sessions: project areas, interaction patterns, friction points.
- **Use:** Self-coaching. The output is the kind of thing that maps to "what skills should I build next."

### `/fewer-permission-prompts` (bundled skill)

- **What:** Scans transcripts for common read-only Bash and MCP tool calls, then adds a prioritized allowlist to `.claude/settings.json`.
- **Shipped:** v2.1.111 (April 16, 2026)
- **Use:** After a week of saying "yes" to the same 12 commands, run this and never see those prompts again.

### `/learn [insight]` and `/retro`

- These are user skills (visible in Vlad's setup via `~/.claude/skills/`), not built-ins. Worth calling out because operators commonly assume they're shipped — they're not. They're community/personal skills installed by the user.

### Commands removed in May 2026

- `/pr-comments` removed in v2.1.91 — ask Claude directly to view PR comments instead
- `/vim` removed in v2.1.92 — use `/config` → Editor mode

---

## Command discovery + installation

There are four classes of slash commands and they're worth distinguishing:

1. **Built-in commands.** Hard-coded into the CLI. The 60+ commands in the table at https://code.claude.com/docs/en/commands. Things like `/clear`, `/model`, `/goal`, `/agents`.
2. **Bundled skills.** Ship with Claude Code but use the same `SKILL.md` mechanism as user skills. Marked `[Skill]` in the docs table. Examples: `/batch`, `/loop`, `/simplify`, `/debug`, `/claude-api`. The model can also invoke them automatically when relevant — they're not just shortcuts.
3. **User skills.** Live in `~/.claude/skills/<name>/SKILL.md`. Visible via `/skills`. Vlad's setup has dozens of these — `/learn`, `/retro`, `/audit`, `/ultrareview` (local variant), `/hub-edit`, etc.
4. **Plugin / MCP prompts.** Plugins ship skills, hooks, agents, monitors, themes. MCP servers expose prompts as `/mcp__<server>__<prompt>`.

**Discovery:** type `/` to see the full list, type `/x` to filter by `x`. The list is plan-conditional (`/desktop` only on macOS/Windows, `/upgrade` only on Pro/Max, `/extra-usage` only when configured).

**Naming convention emerging:**
- Verb commands for actions: `/clear`, `/compact`, `/rewind`, `/branch`
- Noun commands for state: `/tasks`, `/agents`, `/memory`, `/context`
- Power-prefix `ultra` for cloud-amplified versions: `/ultraplan`, `/ultrareview`
- `/setup-*` prefix for one-time wizards: `/setup-bedrock`, `/setup-vertex`

---

## Cowork IDE features (May 2026)

Cowork = claude.ai's agent mode with MCP integration. Distinct from Claude Code (terminal-first CLI). Cowork is where Vlad lives most of his current operator work — the local-agent-mode-sessions directory in the working path is the give-away.

Recent shipped Cowork UI features:

- **Scheduled remote agents / Routines.** Same primitive that `/schedule` creates in Claude Code. Cron-style cloud execution, GitHub-event triggers, API-triggered runs. Launched April 14, 2026.
- **Channel-mode (`--channels` flag in Claude Code, channels UI in Cowork).** Console (API key) auth support added in v2.1.129 (May 6, 2026), gated on managed settings allowing `channelsEnabled: true`.
- **Push notifications when Claude decides.** Cowork can ping mobile when an agent is waiting on your input. Surfaced via Remote Control on Claude Code side.
- **Skills marketplace via plugins.** `/plugin` for browse/install. `claude plugin details <name>` (v2.1.139) shows component inventory + projected token cost per session.
- **`/mnt/skills/` is a bindfs mirror.** Cowork-specific: writes there don't persist, they get re-synced from upstream. This is documented in your CLAUDE.md disambiguators and is the root of the "I edited the skill but it reverted" complaint that surfaces every few weeks.

---

## Plan mode evolution

Plan mode in 2026 is a structured workflow: Claude proposes a plan, you review it, you approve it, then execution happens. The new bits:

- **`/plan [description]`** lets you jump directly into plan mode with the task pre-loaded — saves a turn vs. typing the description after entering plan mode.
- **ExitPlanMode is a tool call**, not a user command. The plan-and-approve loop is: Claude builds the plan, calls `ExitPlanMode` with the plan as content, the UI surfaces the approval gate, you approve or reject. Approval transitions Claude out of plan mode into execution.
- **Plan mode blocks subagents.** Documented gotcha from Vlad's memory: you must `ExitPlanMode` before spawning write agents. Reading agents are fine; writes are blocked while you're in plan mode.
- **Plan filenames are now content-derived.** v2.1.111 changed plan files from random-word names to prompt-derived names like `fix-auth-race-snug-otter.md`.
- **PreCompact hook can block compaction during planning** (v2.1.105) — exit code 2 or `{"decision":"block"}` from a PreCompact hook prevents loss of the plan.

How it's different from auto mode now:
- **Plan mode** is "deliberate before doing." Per-step human approval.
- **Auto mode** is "approve tool calls automatically within a turn, but the turn still has to end." Removes per-tool prompts. Now available for Max subscribers on Opus 4.7 without `--enable-auto-mode` (v2.1.111).
- **`/goal`** is "approve a finish line, not the steps." Removes per-turn prompts. Stacks with auto mode — that's the docs' own framing: "auto mode removes per-tool prompts, and `/goal` removes per-turn prompts."

So the three levers compose: plan mode → approve the plan → auto mode → don't approve each tool → `/goal` → don't approve each turn. That's a stack, not a choice.

---

## Antigravity competitive context

Google shipped **Antigravity** in November 2025 alongside Gemini 3. It's a fork of VS Code rebuilt around autonomous agents. Manager View + agent workspaces is its core differentiator. Most relevant for the book:

**What Antigravity has that Claude Code didn't:**
- **Native browser integration.** Antigravity spawns a Chrome instance to click through the UI, test forms, check network requests, take screenshots. Claude Code is terminal-first; browser interaction goes through MCP servers or `mcp__claude_ai_*`.
- **Manager View as core IDE primitive.** Multi-agent orchestration is the default surface, not an add-on. Free during preview.
- **Single unified IDE.** No context-switching between terminal, browser, editor.

**What Claude Code shipped in response (or in parallel):**
- **Agent View (v2.1.139).** Direct analog to Antigravity's Manager View, but terminal-first. Same use case — see all agents at a glance, reply without attaching.
- **`/batch` + worktrees.** Same multi-agent parallelism, different ergonomics. Worktree isolation arguably cleaner than Antigravity's workspace model because git is the truth.
- **`/goal`.** Codex shipped `/goal` first; Anthropic shipped its version to close the loop. Not a direct Antigravity response, but part of the same "autonomous agent loop" race.
- **`/ultraplan` + `/ultrareview`.** Cloud-sandbox amplified versions of plan and review. Closer to Antigravity's Manager View ergonomics.

**Where Claude Code still wins per the comparison reviews:**
- Git depth — native commit gen, worktrees, GitHub Actions/GitLab CI tag-`@claude`-in-PR flow.
- Enterprise — SSO, SCIM, audit logs, HIPAA, Bedrock/Vertex/Foundry deployment. Antigravity's enterprise tier is announced but not shipped as of early 2026.
- Composability — no forced UI opinion. JetBrains plugin, VS Code extension, terminal, claude.ai/code web — pick your surface.

**Where Antigravity still wins:**
- Browser-loop testing.
- Free pricing during preview (paid plans only remove rate limits, no feature gating).
- Single-window flow.

**Strategic read:** Antigravity forced Anthropic to ship Agent View. The terminal-as-truth bet means Claude Code's agent surface is colder-looking but more composable. For a book audience that already lives in terminals, Claude Code's path is the right read; for a book audience coming from Cursor/VS Code, Antigravity is the more obvious gateway drug.

---

## Implications for the book

**Chapters that need updates:**

- **Ch 13 Quickstart** — add `/goal` to the "first commands to try" section. Single most important new primitive an operator should know.
- **Ch 14 Cheat Sheet** — entire command table needs a refresh. The May 2026 surface is materially different from anything before April: `/goal`, `/agents`, `/batch`, `/loop`, `/ultraplan`, `/ultrareview`, `/team-onboarding`, `/teleport`, `/rewind`. Pull the table from https://code.claude.com/docs/en/commands.
- **Ch 21 Three Modes** — title is now wrong. It's a four-mode story: chat / plan / auto / goal. The stacking ("plan→approve→auto→goal") is the new explanation that lands. Also surface ExitPlanMode as a tool call, not a command.

**New chapter candidates:**

- **Ch 38 "Run Until Done" — `/goal`, `/loop`, Stop hooks, and the three autonomous loops.** Worth its own chapter. The 3-way table from the docs is the centerpiece.
- **Ch 39 "Many Agents, One You" — Agent View, `/batch`, worktrees.** The multi-agent fan-out story. This is where the book's "Vlad style" lands — Vlad already runs 4-8 worktrees per developer per his portfolio memory.
- **Ch 40 "Cowork vs Code" — when to use which surface.** Cowork for portfolio-ops, Claude Code for code. The bindfs gotcha is worth a page on its own.

**Fold-in candidates (not new chapters):**

- `/recap`, `/btw`, `/context`, `/compact`, `/insights`, `/team-onboarding` fold into Ch 14 Cheat Sheet.
- `/ultraplan` and `/ultrareview` fold into the existing plan/review chapters with a "cloud-amplified version" callout.

**The single most important new command Vlad should mention in the book:** **`/goal`**. It changes the unit of human attention from "approve each step" to "approve the finish line." That's a behavioral shift, not just a feature add. Everything else on the May 2026 surface is incremental on top of that.

---

## Sources

- [Keep Claude working toward a goal — official `/goal` docs](https://code.claude.com/docs/en/goal)
- [Commands — full Claude Code command table](https://code.claude.com/docs/en/commands)
- [Changelog — Claude Code](https://code.claude.com/docs/en/changelog)
- [Agent View — official docs](https://code.claude.com/docs/en/agent-view)
- [Agent view in Claude Code — Anthropic blog](https://claude.com/blog/agent-view-in-claude-code)
- [Run prompts on a schedule — `/loop` + `/schedule`](https://code.claude.com/docs/en/scheduled-tasks)
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- [Slash Commands in the SDK](https://code.claude.com/docs/en/agent-sdk/slash-commands)
- [Claude Code 2.1.139 release writeup — claude-world.com](https://claude-world.com/articles/claude-code-21139-release/)
- [Claude Code /goal command long-running agents — explainx.ai](https://explainx.ai/blog/claude-code-goal-command-long-running-agents-2026)
- [Codex /goal vs Claude Code Agents — devtoolpicks](https://devtoolpicks.com/blog/codex-goal-command-vs-claude-code-agents-2026)
- [Claude Code /goal: Set a Finish Line, Walk Away — findskill.ai](https://findskill.ai/blog/claude-code-goal-command/)
- [Claude Code Cheat Sheet — claudedirectory.org](https://www.claudedirectory.org/blog/claude-code-cheat-sheet)
- [Stop Confusing /schedule, /loop, and Cron — wmedia.es](https://wmedia.es/en/tips/claude-code-schedule-vs-loop-vs-cron)
- [Anthropic Claude Code routines cloud automation — pasqualepillitteri.it](https://pasqualepillitteri.it/en/news/851/claude-code-routines-cloud-automation-guide)
- [Claude Code vs Antigravity — DataCamp](https://www.datacamp.com/blog/claude-code-vs-antigravity)
- [Google Antigravity vs Claude Code — Augment Code](https://www.augmentcode.com/tools/google-antigravity-vs-claude-code)
- [Claude Code Worktrees Guide — claudedirectory.org](https://www.claudedirectory.org/blog/claude-code-worktrees-guide)
- [Effort levels explained — MindStudio](https://www.mindstudio.ai/blog/claude-code-effort-levels-explained)
- [Anthropic release notes — support.claude.com](https://support.claude.com/en/articles/12138966-release-notes)

---

## Confirmation block

- **Does `/goal` exist?** Yes. Confirmed via official Anthropic docs at https://code.claude.com/docs/en/goal and the v2.1.139 changelog (May 11, 2026). Followed by a v2.1.140 hotfix on May 12 for silent-hang on certain hook configs.
- **Core value prop in one sentence:** `/goal <condition>` turns Claude Code into an autonomous loop that keeps taking turns — evaluated each round by a small fast model against your condition — until the condition is met or you `/goal clear`, shifting the unit of human approval from per-step to per-outcome.
- **Single most important new command Vlad should mention in the book:** `/goal`.
