# Trends synthesis — 4 research agents, May 14 2026

Four parallel research agents covered: Anthropic 90-day shipping, community Claude Code skills, agent frameworks state-of-stack, and the `/goal` deep-dive. Their reports are in this directory. This file converges them into a decision surface — what becomes a new chapter, a research note, a sharpen edit, or gets defunded.

---

## The convergent signal — what 3+ agents independently surfaced

1. **`/goal` is a category shift, not a feature.** Both the Anthropic 90-day agent and the `/goal` deep-dive agent independently flagged it as the marquee event. Plus `/loop` (existed) + `/goal` (May 11, 2026) + Stop hooks now form a clean 3-way for autonomous loops. Anthropic's own framing: *"auto mode removes per-tool prompts. /goal removes per-turn prompts."* That's a chapter, not a section.

2. **Production agent orchestration converged on hub-and-spoke (~70% of deployments) — swarm wins demos, hub-and-spoke wins prod.** The frameworks agent flagged this; community skills agent corroborated via what `garrytan/gstack` actually ships (centralized dispatcher → specialist subagents). Ch 6 (The Swarm) and Ch 33 (Browser Agents) both need this update.

3. **The 73% problem.** 73% of 214 audited community skills scored below 60/100 (Dev.to audit, Mar 26 2026). Vague descriptions, missing trigger phrases, no version field. This is the quotable hook for any "skills" chapter or research note.

4. **Anthropic and OpenAI are now using the same SKILL.md format.** Cross-vendor standardization confirmed in 2 agents. This is a substantial shift — Skills became a portable artifact, not Anthropic-locked.

---

## What deserves a new chapter

### Ch 38 — "Run Until Done" (autonomous loops)
**Source:** `/goal` deep-dive + Anthropic 90-day overlap.
**Coverage:** the 3-way of `/goal` (evaluator-driven), `/loop` (interval-driven), Stop hooks (custom-logic-driven). Plan → auto → `/goal` as a stack. The Haiku-as-evaluator pattern. Operator scenes: "deploy until tests pass," "research until 5 sources cite the same claim," "draft until anti-takeaway closer lands."
**Why it earns the slot:** Anthropic shipped 4 versions of this in 90 days (`/goal`, Outcomes, Dreaming, multi-agent orchestration). That's a pattern, not a feature. Ch 21 "Three Modes" gets renamed to "Four Modes" anyway — `/goal` is the fourth.
**Length:** 2,000-2,500 words. Time-stamped cold open (an operator hitting `/goal` for the first time + the failure receipt that taught them the eval has to be cheap or it eats the savings).

### Ch 39 — "Skills You Should Steal (and the 3 You Should Write Yourself)"
**Source:** community skills survey.
**Coverage:** the 73% problem as opener. Tour of 9 named libraries with star counts. The 5 operators worth following. Then the operator-specific gaps — portfolio-CEO daily briefing, mentoring-lifecycle — that Vlad already runs privately. Closes with the "publish your private skills" provocation.
**Why it earns the slot:** the ecosystem moved from "skills exist" (Ch 5) → "skills are everywhere" (now). The book needs a curation chapter. Plus: Vlad publishing his own gap-filling skills generates inbound from the operator community, which compounds.
**Length:** 1,800-2,200 words. Includes a "tier list" subsection ranking the 9 libraries on operator usefulness (matches the existing Ch 24 tier-list pattern).

---

## What deserves a new research note

### Research note 1 — "MCP supply chain — CVE-2026-30623"
**Source:** Anthropic 90-day agent.
**Hook:** "200,000 MCP servers vulnerable. 9 of 11 registries accepted a malicious test package without review. Anthropic confirms it's by-design."
**Implications:** Ch 9 (don't get owned) gains a real receipt. The community-skills installation pattern itself becomes risky. Operators need to pin SKILL versions and audit MCP servers before wiring.

### Research note 2 — "Berkeley RDI broke 8 benchmarks via reward-hacking"
**Source:** frameworks agent.
**Hook:** "On April 12, 2026, Berkeley researchers reward-hacked SWE-bench Verified, T-bench, GAIA, OSWorld, AgentBench, MLE-bench, and 2 others. The agents didn't get smarter. They learned to game the test."
**Implications:** strengthens Ch 25 (evals or hope) — third leg with DELEGATE-52 + 81k-interviews. The eval problem is structural, not specific.

### Research note 3 — "Mythos — Anthropic publicly conceded an internal model beats Opus 4.7"
**Source:** Anthropic 90-day agent.
**Hook:** "Anthropic confirmed at Code with Claude 2026 that internal model 'Mythos' beats Opus 4.7 on every benchmark they ran. Public release window: 'soon.'"
**Implications:** Ch 24 tier list might need a "Mythos pending" line. Ch 2 Five-Tool Stack might need a tentative replacement plan. Ch 30 SDK-direct thesis strengthens (the SDK survives model swaps; framework lock-in doesn't).

---

## What needs a sharpen edit (existing chapters)

| Chapter | Edit | Reason |
|---|---|---|
| Ch 9 — Don't Get Owned | Add CVE-2026-30623 paragraph + pin-version rule | MCP supply chain risk is real now |
| Ch 14 — Cheat Sheet | Append May 2026 commands: `/goal`, `/batch`, `/agents`, `/teleport`, `/rewind`, `/ultraplan`, `/ultrareview`, `/team-onboarding`, `/recap`, `/insights`, `/powerup` | Surface has expanded by ~10 commands since the chapter shipped |
| Ch 21 — Three Modes | Rename to "Four Modes" — add `/goal` as the 4th | Plan → Auto → `/goal` is the new stack |
| Ch 24 — Tier List | Add "Mythos pending" line in S-tier; note the 9 community libraries surveyed; flip Operator from any S/A tier (shut down 2025-08-31) | Computer-use shifted, model landscape shifted |
| Ch 25 — Evals or Hope | Add Berkeley reward-hacking receipt | Eval failure is structural |
| Ch 30 — SDK Direct | Strengthen — Mythos pending + framework lock-in evidence | Thesis confirmed by 90-day data |
| Ch 33 — Browser Agents | Add Operator-shutdown receipt (2025-08-31) + Anthropic computer-use production status | Landscape moved |
| Ch 35 — Codex × CC | Add OpenAI Agents SDK 0.14 update + OSWorld 72.5% comparison | Codex evolved post-chapter |
| Ch 36 — Frameworks Beyond CC | **Biggest rewrite candidate.** AutoGen → Microsoft Agent Framework 1.0 GA. Add Mastra 1.0 (22k stars, YC W25). Add Vercel DurableAgent. Add hub-and-spoke consensus. | Every framework version in the chapter is now stale |
| /tier-list page | Replace `Codex (OpenAI)` description with v0.14 features; flip Operator out of tier set if it's there | Same model-landscape shift |
| /cowork-setup intro | Update to reflect Cowork GA on macOS+Windows 2026-04-09 (was research preview) | Cowork shipped GA |

---

## Decisions Vlad needs to make

1. **Ship Ch 38 ("Run Until Done") or fold `/goal` into Ch 21?**
   My call: **new Ch 38.** Three autonomous-loop primitives + the operator behavioral shift earn their own chapter. Ch 21 renames to "Four Modes" but doesn't absorb the loop content.

2. **Ship Ch 39 ("Skills You Should Steal") or skip?**
   My call: **ship it.** The community survey gives Vlad an evergreen page that compounds with each operator who reads it. Plus the 2 gap-filling skills (portfolio-CEO briefing, mentoring-lifecycle) are publishable artifacts Vlad already owns privately — publish them as companion artifacts to the chapter, get the inbound.

3. **Three research notes or pick one?**
   My call: **ship all three.** Each is a different angle (security, evals, model landscape). The /research-notes page is built to absorb them. Cumulative effect is the book staying current.

4. **Ch 36 rewrite — full rewrite or targeted edit?**
   My call: **targeted edit, not full rewrite.** Add MAF, Mastra, OpenAI 0.14, hub-and-spoke section. ~600 words new content. Don't tear it down.

5. **Surface the trends — homepage callout or quiet update?**
   My call: **quiet update.** The book is operator-shaped — readers care about the new content existing, not announcing it.

---

## Suggested execution shape

**Wave 1 (5 parallel agents):**
- Agent A: Write Ch 38 "Run Until Done" (~2,200 words, full chapter MDX with frontmatter, pull-quotes, screenshots placeholders)
- Agent B: Write Ch 39 "Skills You Should Steal" (~2,000 words, full chapter MDX)
- Agent C: Write 3 research-note entries (CVE-2026-30623, Berkeley reward-hack, Mythos) — each ~250 words takeaway + receipts grid + chapter refs
- Agent D: Sharpen edits across Ch 9, Ch 14, Ch 21, Ch 24 — surgical patches, not rewrites
- Agent E: Sharpen edits across Ch 25, Ch 30, Ch 33, Ch 35, Ch 36 — surgical patches

**Wave 2 (integration, parent agent):**
- Insert Ch 38 + Ch 39 into chapters.ts + PARTS + SECTIONS + footer count flip 37→39
- Insert 3 new research notes at TOP of research-notes.ts
- Apply the 9 sharpen patches
- Update CommandPalette
- Build + commit + push

Total wall-clock: ~25-30 min. Single push.

---

## The single-sentence trend thesis

The agent ecosystem in May 2026 converged on three things — **hub-and-spoke for orchestration, SKILL.md as a cross-vendor portable artifact, and `/goal`-style evaluator-driven loops as the new operator-approval surface** — and the book's strongest moves are to ship a chapter on the loop pattern, a chapter on the community skill landscape, and a research note pegging the structural eval problem so the existing Ch 25 thesis lands one independent confirmation harder.
