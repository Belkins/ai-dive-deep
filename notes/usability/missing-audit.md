# Missing content audit — Wave A

Audit pass: 2026-05-14. Read against `38-run-until-done.mdx`, `39-skills-you-should-steal.mdx`, and the Mythos / Berkeley RDI / CVE-2026-30623 research notes. Every gap below ships with the actual draft content, not a description of it.

---

## Ch 38 — what could be added

### Decision tree: which primitive when?

The current chapter introduces the three-way (`/goal` / `/loop` / Stop hook) as a comparison table, but it never gives the reader the literal "I am sitting at the terminal — what do I type" pathway. The six operator scenes show `/goal` exclusively; a reader who only has a `/loop`-shaped problem walks away mis-fitting `/goal` to it. The table proves the primitives are different. The decision tree tells the reader which is theirs.

The proposal is a 60-second triage block — five yes/no questions in sequence, each one collapsing the surface — that lives right after the comparison table on line 60. It keeps the chapter's "evaluator is the goal" thesis intact and gives the reader a literal flow they can run in their head before typing.

The actual decision tree, voice-locked:

```text
start here ↓

1. is the finish line a thing claude's own transcript can prove?
   ├── yes → continue to 2
   └── no  → Stop hook with a real script. determinism beats vibes.

2. can you write a grep that returns 0/1 on "done"?
   ├── yes → continue to 3
   └── no  → rewrite the condition until you can, or pick Stop hook.

3. is the work driven by elapsed time, not by a stop condition?
   ├── yes → /loop [interval] [prompt]. polling, not running until done.
   └── no  → continue to 4

4. is the stop condition reusable across every future session?
   ├── yes → Stop hook in settings.json. session-scoped is the wrong scope.
   └── no  → continue to 5

5. is the condition cheap to check in transcript output?
   ├── yes → /goal <condition>, with an "or stop after N turns" tail.
   └── no  → split it. compound conditions get ambiguous; eval picks wrong.

default if you're not sure: /goal with a turn cap of 20.
```

### FAQ / objections

Six push-backs a serious reader will surface — each gets a one-sentence rebuttal that lands without retreating from the chapter's thesis.

**Q: how is `/goal` different from agentic SDK loops?**
the SDK loop is a programmatic harness you write — `/goal` is a session-scoped wrapper around a hook the harness already knows about; same shape, different rung.

**Q: why not just use a Stop hook every time?**
because a Stop hook is settings-scoped and runs every session — `/goal` is a per-task condition you set in seconds and `/clear` away when done.

**Q: doesn't this just burn tokens?**
the haiku evaluator runs roughly two orders of magnitude cheaper than the opus worker turn — that ratio is the only reason `/goal` pencils at all.

**Q: what if the evaluator is wrong?**
include the `or stop after N turns` clause every time — the worst case becomes "wasted N turns," not "infinite loop until you wake up."

**Q: can i run multiple `/goal` sessions in parallel?**
yes, but each session has its own evaluator state — parallel `/goal`s don't coordinate, and if they touch the same files you'll get the agent-collision pattern from ch 36.

**Q: does `/goal` work in plan mode?**
no — plan mode pauses before execution, `/goal` only fires after a turn ends; you compose them by leaving plan mode for the execution phase, not by stacking them on the same turn.

**Q: what about non-determinism in the evaluator?**
the haiku judge is stochastic — re-running the same transcript can flip the verdict on borderline cases; if you see flapping, your condition is ambiguous, not the evaluator.

**Q: why not run the evaluator on opus for better judgment?**
because then the evaluator costs as much as the worker — the chapter walked through this on the "tried to force opus" anecdote; the cheap evaluator is the move, not a compromise.

### Spawn templates

The chapter shows `/goal` invocations but never shows the determinism alternative — a real Stop-hook `settings.json` block — which is what a reader running an enterprise lockdown actually needs. Drop this in after the "three primitives" comparison table.

```json
// .claude/settings.json — Stop hook with a real test runner
{
  "hooks": {
    "Stop": [
      {
        "command": ".claude/hooks/check-done.sh",
        "timeout": 30000,
        "blocking": true
      }
    ]
  }
}
```

```bash
#!/usr/bin/env bash
# .claude/hooks/check-done.sh
# exit 0 = done, agent returns control. exit non-zero = keep going,
# stderr is surfaced back into context for the next turn.

set -euo pipefail

if ! pnpm test --silent 2>&1; then
  echo "tests failing — keep going" >&2
  exit 1
fi

if ! pnpm lint --max-warnings 0 2>&1; then
  echo "lint not clean — keep going" >&2
  exit 1
fi

# all gates green
exit 0
```

The /goal equivalent for the same workflow, side-by-side:

```text
/goal pnpm test exits 0, pnpm lint --max-warnings 0 is clean,
or stop after 20 turns
```

Tradeoff: the /goal version is one line and session-scoped; the Stop-hook version is deterministic, settings-scoped, and runs on every session whether you want it or not. Pick by scope, not by preference.

### Failure cases beyond the closer

The anti-takeaway covers the clock-vs-quality trap. Three more failure modes worth surfacing — each one Vlad has hit at least once.

**1. Parallel `/goal` sessions clobbering the same files.**
two terminals, two `/goal` sessions, both editing the same model migration. neither evaluator knows about the other. the second one to write wins; the first one's diff is silently overwritten. the receipt looks clean — both goals "cleared" — but the branch contains only one agent's work. fix: lock `/goal` sessions to disjoint paths or worktrees, the same discipline as ch 36 parallel-agent ceiling.

**2. Stateful condition that flips back to false on the next turn.**
`/goal the dev server is running on port 3000`. agent starts the server (turn N, condition true). turn N+1 the server crashed — the agent doesn't know, the evaluator reads the transcript and finds the start command, says "done." you walk back to a dead server with a satisfied `/goal` overlay. lesson: stateful conditions need a probe in the condition itself ("...and curl -sf http://localhost:3000/health returns 200").

**3. Evaluator confirmation bias on agent-authored receipts.**
the agent writes "tests pass" in its own summary; the haiku eval reads the summary; the goal clears. but the agent never actually ran the tests — it just claimed it did. eval is reading transcript, transcript is whatever the agent typed. fix: require the runner's literal exit-code line in the condition ("...where the literal line 'Tests: X passed' appears in transcript").

**4. Hooks-locked enterprise tenant silently ignoring `/goal`.**
`disableAllHooks: true` in a managed-policy settings file. `/goal` returns a "hooks unavailable" message exactly once, and on subsequent prompts the user forgets and types `/goal ...` again — the session runs without a goal, no enforcement, the user thinks it's enforcing. fix: read the chapter's existing callout, but also: if your tenant locks hooks, alias `/goal` to a function that errors loudly every time.

**5. Token-budget runaway on a long evaluator chain.**
the chapter's $11 vibe-eval shows what happens when the agent loops on the same hypotheses. less obvious: a well-formed compound condition with 30 turns × 50k-token transcripts × per-turn haiku eval reads can crest $5 in eval overhead alone before the worker spends anything. cap turns at 20 by default; never set a `/goal` without the `or stop after N turns` tail.

### Screenshots worth adding

The chapter has one placeholder (the `/goal` active overlay). Four more shots that would each pull weight.

1. **the evaluator's "why not yet" line, mid-session** — the literal reason string, surfaced after a turn that didn't clear. shows readers what the evaluator's reasoning actually looks like, demystifies the haiku judge.
2. **a `/goal` overlay at clear time** — green check, final turn count, total cost line, with the evaluator's last verdict visible. closes the loop on what "done" looks like in the UI.
3. **a Stop-hook receipt in the transcript** — the literal exit code 0 line + agent's "Stop hook returned done" handoff. proves the determinism alternative is real, not aspirational.
4. **the bad version — the $11 vibe-eval session** — overlay at turn 41, same "not yet" line three times in a row, total token meter showing the bleed. the warning label as a screenshot, not just a paragraph.

### "what next" pointers

The chapter ends on the clock-vs-quality lesson and then stops. A serious reader wants the next click. Add a four-line "what next" block before the closer:

- **for the autonomy ladder above `/goal`** → [Chapter 36 — Frameworks and What's Beyond](/chapters/36-frameworks-beyond), where the parallel-agent ceiling explains why two `/goal` sessions on the same repo collide.
- **for the deterministic alternative** → [Chapter 16 — Hooks and Subagents](/chapters/16-hooks-subagents), full Stop-hook patterns including LLM-as-judge inside the hook script.
- **for the eval discipline behind a good `/goal` condition** → [Chapter 25 — Evals or Hope](/chapters/25-evals-or-hope), and the Berkeley RDI research note for why "tests pass" is a stronger signal than "looks good."
- **for the SDK-level loop pattern** → [Chapter 30 — SDK-Direct](/chapters/30-sdk-direct), how `/goal`'s evaluator shape ports to programmatic harnesses outside Claude Code.

---

## Ch 39 — what could be added

### Decision tree: which library / skill when?

The tier list is a comparison; the reader still needs a triage flow. Right now, a reader walks away knowing the nine libraries but not knowing which one to clone first on a Saturday morning. The decision tree closes that gap.

```text
start here ↓

1. is this your first claude-code skills install ever?
   ├── yes → clone garrytan/gstack, prune to the 8-12 that match your work.
   └── no  → continue to 2

2. are you looking for a skill for a known workflow (PR review, retro)?
   ├── yes → check anthropics/skills /spec first, then gstack, then awesome-claude-code.
   └── no  → continue to 3

3. is the workflow domain-specific (security, sales-ops, content)?
   ├── yes → trailofbits/skills if security; otherwise the gap is yours to fill.
   └── no  → continue to 4

4. are you discovering what's possible, not solving a known need?
   ├── yes → hesreallyhim/awesome-claude-code as the index, not a meal.
   └── no  → continue to 5

5. is this a persona-shaped need (C-level brief, founder workflow)?
   ├── yes → alirezarezvani/claude-skills, then prune ruthlessly.
   └── no  → the skill probably doesn't exist yet. publish it.

default: gstack + anthropics/skills as references, everything else as menus.
```

### FAQ / objections

**Q: if 73% are broken, isn't installing any of them irresponsible?**
the 73% measures the long tail — the top nine libraries cluster in the working 27%, and the audit habit (read SKILL.md before activation) catches the rest.

**Q: why not just write everything from scratch?**
because the gap-filling skills (gap 1-3 in the chapter) are the only ones worth your time — the other 200 are commodity work someone has already done acceptably.

**Q: how do i actually pin a skill to a SHA, like CVE-2026-30623 says?**
clone the repo, check out the SHA, copy the SKILL.md into your `~/.claude/skills/` — don't symlink to a moving branch, and don't use a tag (tags can be re-pointed, SHAs cannot).

**Q: what if the maintainer abandons gstack?**
fork it. the value is the corpus, not the maintenance — MIT-licensed, the corpus is yours once cloned, the upstream is a bonus not a dependency.

**Q: do plugin skills override custom skills when names collide?**
yes, the plugin loader resolves alphabetically by source — pin custom skills with a portfolio-specific prefix (`belkins-`, `lingualive-`) to avoid collision with generic plugin skills.

**Q: isn't `allowed-tools: ["*"]` sometimes legitimate?**
no. there's no operator workflow that needs unconstrained tool access — even ch 39's broad skills enumerate their tools. a wildcard is either lazy authoring or a credential exfil vector; treat them the same.

**Q: how do i tell if a skill is AI-generated slop vs. real?**
three signals: description over 20 words and naming a specific trigger phrase, code blocks in the body (not wall-of-text), and a version field that has been bumped at least once. miss two of three, skip the install.

**Q: do i need to re-audit skills i installed six months ago?**
yes, before any major Claude Code version bump — `allowed-tools` semantics drift, hook contracts change, and a skill that worked in v2.0 may now have permissions it didn't have at install time.

### Spawn templates

The chapter shows install commands but no "first 10 minutes" script. A reader who finishes ch 39 should be able to run this and have a working skill library by minute 11.

```bash
#!/usr/bin/env bash
# first-10-minutes.sh — bootstrap a clean claude-code skill library
# read every line before running. this clones four repos and copies
# selected skills into ~/.claude/skills/.

set -euo pipefail

SKILLS_DIR="$HOME/.claude/skills"
STAGING="$(mktemp -d)"
mkdir -p "$SKILLS_DIR"

# 1. clone the four S/A-tier libraries at a known SHA each
git clone --depth 1 https://github.com/anthropics/skills "$STAGING/anthropics"
git clone --depth 1 https://github.com/garrytan/gstack    "$STAGING/gstack"
git clone --depth 1 https://github.com/trailofbits/skills "$STAGING/trailofbits"
git clone --depth 1 https://github.com/alirezarezvani/claude-skills "$STAGING/rezvani"

# 2. record the SHAs so you can pin / diff later
(cd "$STAGING/anthropics"  && git rev-parse HEAD) > "$STAGING/sha.anthropics"
(cd "$STAGING/gstack"      && git rev-parse HEAD) > "$STAGING/sha.gstack"
(cd "$STAGING/trailofbits" && git rev-parse HEAD) > "$STAGING/sha.trailofbits"
(cd "$STAGING/rezvani"     && git rev-parse HEAD) > "$STAGING/sha.rezvani"

# 3. scan for the wildcard pattern before any copy happens
echo "=== skills with allowed-tools: \"*\" — DO NOT INSTALL ==="
grep -rln 'allowed-tools: *\["\*"\]' "$STAGING" || echo "none found, proceed."

# 4. operator decides which to copy. nothing is auto-installed.
echo "=== staged at $STAGING ==="
echo "review SKILL.md by hand, then: cp -r $STAGING/<lib>/<skill> $SKILLS_DIR/"
echo "SHAs recorded in $STAGING/sha.* — paste into your skill-pin manifest."
```

The chapter currently implies "read every line before activation" but never shows the literal grep that catches the worst case. The wildcard scan in step 3 is the one-line defense against the chapter's own Saturday-morning vault-deletion story.

### Failure cases beyond the closer

The closer covers `allowed-tools: ["*"]`. Three more failure modes that earn a paragraph each.

**1. importing skills with conflicting `allowed-tools` against your settings.local.json.**
gstack's `/review` allows `Bash(git diff:*)`. your project policy denies all Bash. the skill installs, never fires correctly, and the error is silent — the matcher picks the skill, the tool denies the bash, the agent gets stuck mid-turn. fix: diff `allowed-tools` against your active settings before activation, not after.

**2. maintenance burden of cloned skill libs.**
gstack has 23 skills + 14 power tools. clone the whole thing and you own the upgrade path on 37 artifacts. six months later, three of them drift against current Claude Code semantics (a hook contract changed, a tool name renamed). the chapter says "prune to 8-12 that match your work" — that pruning is also the maintenance discipline, not a one-time cleanup.

**3. skill description matching the wrong session.**
the dev.to audit flagged vague descriptions in 41% of skills. the inverse failure: an over-eager trigger phrase. "use when the user mentions a meeting" fires every time the word "meeting" appears in any context, including mid-newsletter draft. fix: every imported skill's description gets a manual narrow before activation — "use when the user mentions a meeting **and asks for prep**" cuts the false-positive rate by an order of magnitude.

**4. mass-installed skills that block the matcher with noise.**
the sickn33 library is 1,459 skills. installing the whole thing means the matcher has 1,459 candidates to score every prompt — even a fast matcher slows perceptibly past 200 skills. the chapter's "menu not meal" warning is also a performance argument, not just a curation one.

**5. version-field staleness in a skill you depend on.**
the chapter notes 62% omit `version`. of the 38% who do include it, half haven't bumped it in eight months. a skill at v1.0.0 from a year ago likely predates the current SKILL.md spec — install only after diffing against `/spec` in anthropics/skills.

### Screenshots worth adding

The chapter has one placeholder (SKILL.md frontmatter compare). Four more shots that pull weight.

1. **the gstack repo structure tree** — `tree -L 2 gstack/` showing the 23 skills + 14 power tools layout. proves the menu-not-meal framing visually.
2. **a SKILL.md voided by allowed-tools** — frontmatter with `allowed-tools: ["*"]` highlighted in red, body intact. the wildcard pattern in its native habitat.
3. **the dev.to audit scorecard** — a representative skill's pulser CLI score (28/100 or similar), failure modes itemized. gives the 73% number a face.
4. **the matcher firing on the wrong prompt** — Claude Code transcript showing a skill activate on an unintended phrase, with the matched description excerpted. the false-positive failure mode as a receipt.

### "what next" pointers

Currently ends on "audit habit won't change." Add a four-line "what next" block:

- **for the security side of skill imports** → [Chapter 9 — Don't Get Owned](/chapters/09-dont-get-owned), the CVE-2026-30623 research note, and the supply-chain risk model that extends from skills to MCP servers.
- **for the build-side of the workflow** → [Chapter 11 — Build a Skill](/chapters/11-build-a-skill), the morning-briefing skill end-to-end.
- **for tier-list cadence on tools (not libraries)** → [Chapter 24 — Tier List](/chapters/24-tier-list).
- **for the publishing model the gaps imply** → the Trail of Bits vertical pattern in the same chapter, plus [Chapter 26 — Team Adoption](/chapters/26-team-adoption) for the "we already do this professionally" inbound shape.

---

## Research notes — what could be added

### Mythos
- **missing detail:** the note frames Mythos as "stay close to the SDK" — but doesn't give the reader a literal SDK-pinning recipe. a 3-line code block showing `anthropic.messages.create(model="claude-opus-4-7-...")` with the exact deprecation-date comment would close the loop the note implies.
- **operator move missing:** "audit your stack for framework-vs-SDK dependency depth" is the implication but there's no actual audit checklist. ship a 5-line `rg "model=|model:"` recipe that finds every model reference in a repo and flags non-SDK paths.
- **cross-link gap:** doesn't reference ch 38. mythos and `/goal` are the same shape of move — the lab disclosing a ceiling vs. claude code disclosing a primitive — and the chapter's "stay close to anthropic-direct paths" thesis carries the same weight in both.

### Berkeley RDI
- **missing detail:** "three independent confirmations" is named but not visually surfaced. a small table showing DELEGATE-52 / 81k / Berkeley RDI side-by-side with method + finding + date would convert a sentence into a load-bearing receipt.
- **operator move missing:** "pair every external benchmark with a private eval" — but no template for a private eval. ship a literal SKILL.md skeleton for a held-out per-domain eval that the reader could fork.
- **cross-link gap:** doesn't reference ch 38's $11 vibe-eval — the reward-hacking pattern is the same shape as the haiku evaluator confirmation bias (failure mode #3 above). worth a one-line link.

### CVE-2026-30623
- **missing detail:** "pin SKILL.md to commit SHAs" — but no concrete pinning pattern. ship a 5-line `.skill-pins.yaml` manifest template showing how to declare pinned SHAs and validate on startup.
- **operator move missing:** the note mentions "extend HOOK_SECRETS_SCAN or write a sibling" but doesn't show the hook. drop a 15-line PreToolUse hook that blocks Edit on SKILL.md changes when new allowed-tools entries appear.
- **cross-link gap:** the ch 39 Saturday-morning story is the literal lived version of this CVE. the note should cross-link to ch 39's closer, and ch 39's closer should cross-link back. right now they're parallel anecdotes that never meet.

---

## Top 5 highest-leverage additions

1. **Ch 38 decision tree (which primitive when?)** — the chapter teaches three primitives but never gives the reader the literal "I'm at the terminal, what do I type" flow. highest leverage because every reader hits this question on the first paragraph after the table. cost: 30 lines, no new chapter.

2. **Ch 39 `first-10-minutes.sh` template** — readers finish the chapter convinced but with no starting move. a single literal script that clones, SHA-pins, scans for wildcards, and stops short of auto-install converts "I should do this" into "I did this." this is the chapter's missing CTA.

3. **Ch 38 FAQ block (8 objections)** — covers the "/goal vs SDK," "why not Stop hook every time," "what if evaluator is wrong" push-backs a serious reader will surface. the chapter currently answers some of these implicitly; making them explicit defends the thesis against the operator who reads carefully.

4. **Ch 38 + Ch 39 "what next" pointers** — both chapters end on a clean closer and then go nowhere. four-link blocks at the bottom of each turn a one-shot read into a chapter-cluster navigation pattern. cheapest addition, highest book-coherence return.

5. **Cross-link CVE-2026-30623 ↔ Ch 39 closer** — the note and the chapter tell the same story from two sides (operator discipline vs. registry threat model) and never reference each other. linking them in both directions makes the research-note system feel like a connected fabric rather than parallel artifacts. ten seconds of work, structural payoff.
