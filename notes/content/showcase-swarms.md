# 5 swarm pattern deep-dives for /showcase

These five patterns are the ones i keep reaching for when the work doesn't fit in one context window. each one has a real receipt — a moment it fired, what it produced, and what it would have cost to do the slow way. the spawn templates are mealy usable: paste, swap the bracketed names, send.

one rule under all of them: **3-4 agents per wave is the empirical sweet spot. 5+ invites filesystem contention.** more agents in one wave doesn't mean more output — it means two agents writing to the same file, one agent silently winning, and you discovering it three hours later in a diff. respect the ceiling.

---

### Pattern 1: the strategic-plan swarm

**When to use:** you have a greenfield venture — a name, a hunch, maybe a sentence — and you need 25 documents (vision, market, monetization, ops, brand, tech, legal, persona pool) before you'll know whether it's worth a weekend.

**Wave shape:**

- **Wave 1 — Foundation (4 agents, parallel):**
  - Agent 1 (vision-architect): writes VISION.md — what this is, what it isn't, the one-sentence positioning.
  - Agent 2 (business-modeler): writes BUSINESS-MODEL.md — value chain, unit economics frame, who pays whom.
  - Agent 3 (monetization-strategist): writes MONETIZATION.md — pricing tiers, take rate, expansion vectors.
  - Agent 4 (market-analyst): writes MARKET.md — TAM/SAM/SOM, 3 incumbents, the wedge.
- **Wave 2 — Operations (4 agents):** ops-playbook + sourcing-strategy + house-rules + legal-frame.
- **Wave 3 — Brand + Access (4 agents):** brand-identity + marketing-channels + access-model + atmosphere-design.
- **Wave 4 — Revenue surfaces (4 agents):** revenue-streams + sponsorship-deck + streaming-rights + merch-line.
- **Wave 5 — Build + community (4 agents):** tech-stack + persona-pool + community-loops + investor-deck.
- **Synthesis (1 agent, runs last):** reads all 20 docs, produces TOP-INSIGHTS.md (5 cross-cutting themes the individual specialists couldn't see) and a brainstorming-personas.md (8 voices to pressure-test the plan in subsequent sessions).

each wave waits for the prior to finish — wave 2's ops doc references wave 1's monetization assumptions, so foundation has to set before operations can build. **within a wave, 4 agents max. that's the contention ceiling.** if you try to do 6 ops specialists in wave 2, two of them will both try to edit ROADMAP.md and one will lose silently.

**Spawn template (paste into Claude Code):**

```
/swarm-strategic-plan [VENTURE-NAME]

Context: [one paragraph — what the venture is, who it serves, what makes it
different]. Stack assumption: [Next.js + Postgres / Notion-native / physical
space / etc.]. Scope: 25 documents, 5 waves of 4 specialists + synthesis.
Output folder: notes/strategic-plans/[venture-name]/.

Constraints: real numbers per claim, lowercase tolerant, em-dashes welcome,
no "amazing/powerful". Each doc 800-1500 words. Cross-link by relative path.
```

**Receipt:** ran this on 2026-04-22 for a hypothetical members-only ops salon — 20 docs in 11 minutes wall-clock, $6.20 total. synthesis caught that the brand doc's "exclusive" framing contradicted the monetization doc's volume assumption — would have been a month of confused positioning if i'd written them sequentially.

**Anti-pattern (when NOT to use):** the venture has fewer than three real questions in it. if you can write the plan in one tab in 90 minutes, 20 specialists will produce 19 docs of filler around the one doc you needed. swarm cost > thinking-clearly cost.

**Cross-link:** [Chapter 6 — The Swarm](/chapters/06-the-swarm) on fan-out shape, [/showcase](/showcase) for the swarm receipts gallery.

---

### Pattern 2: the 6-agent codebase audit

**When to use:** you have a diff (or a whole repo) and you need to know what's wrong with it across six dimensions before merging — and a single reviewer agent will read 9,000 lines and miss half.

**Wave shape:**

- **Wave 1 — Domain reviewers (6 agents, parallel, read-only):**
  - Agent 1 (security-reviewer): tools Read/Grep/Glob. Hunts secrets, injection sinks, missing auth checks, unvalidated input.
  - Agent 2 (types-reviewer): hunts `any`, untyped returns, missing zod, prisma type drift.
  - Agent 3 (performance-reviewer): hunts N+1 queries, sync work in hot paths, unbounded loops, missing indexes.
  - Agent 4 (deps-reviewer): hunts deprecated packages, vulnerable versions, unused imports, version-skew between workspace packages.
  - Agent 5 (test-gap-reviewer): hunts untested branches, missing edge cases, mocked-but-uncalled assertions.
  - Agent 6 (dead-code-reviewer): hunts unreachable code, unused exports, orphan files, stale feature flags.
- **Wave 2 — Synthesis (1 agent):** reads all 6 reports, dedupes overlapping findings (a security issue is often also a types issue), ranks by severity × confidence, writes AUDIT.md with file:line citations and a top-10 fix list.

i know i broke my own rule with 6 in one wave. exception is legal here because each reviewer reads the diff and writes to **its own** report file (`audit-security.md`, `audit-types.md`, etc.) — no write contention. the synthesis agent in wave 2 reads all six and merges. if you tried 6 agents all editing the same audit file, you'd hit the contention ceiling instantly.

**Spawn template (paste into Claude Code):**

```
/audit [DIFF or PATH]

Spawn 6 read-only review subagents in parallel against [PATH]:
  - security-reviewer → notes/audit/security.md
  - types-reviewer → notes/audit/types.md
  - performance-reviewer → notes/audit/performance.md
  - deps-reviewer → notes/audit/deps.md
  - test-gap-reviewer → notes/audit/tests.md
  - dead-code-reviewer → notes/audit/dead-code.md

Each returns findings as: file:line | severity (P0/P1/P2) | description |
suggested fix. No edits. Read-only tools only (Read, Grep, Glob).

After all 6 return, spawn one synthesis agent to dedupe + rank + write
notes/audit/AUDIT.md with top-10 fix list.
```

**Receipt:** ran on partner-connector pre-release branch 2026-04-09 — 6 reviewers returned 47 raw findings, synthesis dedupe collapsed to 12 unique issues, 4 were P0 (one missing auth check, two N+1s, one vulnerable dep). that single pass caught more than two human reviewers had in the prior week.

**Anti-pattern (when NOT to use):** the diff is under 200 lines or single-file. overhead of spawning 6 agents costs more than reading it yourself. swarm pays off when the diff is across 10+ files or you're auditing a repo you didn't write.

**Cross-link:** [Chapter 25 — Evals and Audits](/chapters/25-evals) on systematic review, [Chapter 16 — Hooks and Subagents](/chapters/16-hooks-subagents) on read-only tool allow-lists.

---

### Pattern 3: the 3-agent perspectival editorial swarm

**When to use:** titling, voice calibration, slug-picking, headline copy. one agent will hand you a single answer. you don't want a single answer — you want a **decision surface** so you can pick by ear.

**Wave shape:**

- **Wave 1 — Three philosophical stances (3 agents, parallel):**
  - Agent A (topical-declarative): writes 10 candidates in topical-declarative form — "The N-Agent Codebase Audit," "Parallel Subagents and Fan-Out." Topic-led, no verb.
  - Agent B (action-verb): writes 10 candidates in action-verb form — "Audit Your Repo with 6 Agents," "Spawn Six Reviewers, Merge One Report." Imperative, the reader is the subject.
  - Agent C (question-form): writes 10 candidates in question form — "What If Six Reviewers Read Your Diff in Parallel?" "Why Does One Reviewer Always Miss the N+1?" Curiosity gap, no answer until the click.
- **Wave 2 — Decision step (you, 90 seconds):** read the 30 candidates side-by-side. pick by ear. there is no synthesis agent here — the value is the comparison, not the merge.

**3 agents is the floor for this pattern, not the ceiling** — 2 perspectives is a coin flip, 4+ stances dilute distinctiveness. 3 is the empirical sweet spot for editorial choice. (the contention ceiling doesn't bind here because each agent writes its own candidate list to its own file.)

**Spawn template (paste into Claude Code):**

```
Spawn 3 editorial subagents in parallel for [PIECE]:

Agent A — topical-declarative voice. Write 10 candidate titles in noun-led,
declarative form. No verbs in title. Examples: "The Swarm." "Hooks and
Subagents." Save to notes/titles/A-topical.md.

Agent B — action-verb voice. Write 10 candidate titles starting with an
imperative verb addressed to the reader. Examples: "Spawn 6 Reviewers."
"Stop Talking to Claude." Save to notes/titles/B-action.md.

Agent C — question-form voice. Write 10 candidates phrased as a question
that creates a curiosity gap. Examples: "What if six agents read your diff?"
Save to notes/titles/C-question.md.

Subject: [topic]. Audience: [who reads this]. Word budget: 4-9 words per
candidate. Return file paths only.
```

**Receipt:** used this on 2026-05-09 retitling all 36 chapters of this book. 3 agents × 10 candidates × 36 chapters = 1,080 options, generated in ~7 minutes. final picks were a mix: 22 topical, 9 action, 5 question. **doing this with one agent would have produced 36 topical titles** (the default voice for LLMs) and i'd never have seen the action-form variants that worked better for the operator chapters.

**Anti-pattern (when NOT to use):** when the constraint is hard. if the SEO target keyword has to be in the title and in a specific position, you don't need 3 perspectives — you need one agent slotting the keyword into 5 templates. perspectival swarm is for **subjective** decisions where ear matters more than rules.

**Cross-link:** [Chapter 14 — Newsletters and Voice](/chapters/14-newsletters) on calibrated voice, [/weekend-builds](/weekend-builds) for the 3-agent variant pattern applied to layout.

---

### Pattern 4: the pre-flight external-dependencies swarm

**When to use:** before you scaffold any project that depends on external sources or APIs. you've listed 5-10 third-party deps in your plan doc. before you write a line of code, you need to know which of them silently changed policy in 2026.

**Wave shape:**

- **Wave 1 — One agent per dependency (3-4 agents, parallel):**
  - Agent 1: audits dep A — current rate limits, deprecation notices, breaking changes since your last known version, 2026 policy shifts. Returns: status (green/yellow/red) + 1-paragraph what-changed.
  - Agent 2: audits dep B — same shape.
  - Agent 3: audits dep C — same shape.
  - Agent 4: audits dep D — same shape.
- **Wave 2 — Continue if >4 deps:** spawn next batch of 3-4. **do not exceed 4 per wave** — each agent runs WebFetch + reads provider docs + maybe hits a sandbox endpoint. file-system writes are cheap here, but rate-limit collisions on the **provider** side aren't (two agents WebFetching the same OpenAI docs page within 100ms gets one of them a 429).
- **Wave 3 — Synthesis (1 agent):** reads all dep reports, produces GO-NO-GO.md — list of green deps to scaffold against, yellow deps requiring fallback path, red deps to remove from the plan before they cost you a sprint.

remember: **3-4 agents per wave is the empirical sweet spot; 5+ invites filesystem contention** AND rate-limit collisions on the upstream APIs you're researching. budget waves accordingly.

**Spawn template (paste into Claude Code):**

```
/preflight-external-deps [PROJECT-NAME]

Audit these external deps before scaffolding [PROJECT]:
  1. [dep-1] — current docs: [url]
  2. [dep-2] — current docs: [url]
  3. [dep-3] — current docs: [url]
  4. [dep-4] — current docs: [url]

Spawn 4 parallel research subagents (one per dep). Each agent:
  - WebFetch provider docs + changelog + status page
  - Verify: rate limits as of [today], deprecation notices, 2026 policy
    shifts, auth-flow changes since [last-known-version]
  - Return: status (green/yellow/red) + what changed + replacement
    candidate if red

Save each agent's report to notes/preflight/[dep-name].md. After all 4
return, spawn one synthesis agent to produce notes/preflight/GO-NO-GO.md
with traffic-light table.

If >4 deps: run in sequential waves of 4.
```

**Receipt:** ran on a content-aggregator side project 2026-03-28 — 8 deps audited in 2 waves. caught **6 show-stoppers in one session**: Twitter API v2 free tier killed for write, Reddit API now $0.24/1K calls (was free), LinkedIn dropping non-partner access in Q3, two RSS providers consolidated, one OG-image service deprecated their v1 endpoint. would have been 2-3 weeks of scaffolding against dead pipes before discovery.

**Anti-pattern (when NOT to use):** the project depends only on stable, first-party infrastructure (your own Postgres + your own Vercel + Anthropic API). preflight pays off when the dep is a third-party data feed, a partner API, or anything where the provider's business model could shift under you. don't audit your own database.

**Cross-link:** [Chapter 11 — Building Without Breaking](/chapters/11-building) on dep hygiene, [/research-notes](/research-notes) for the catalog of deps i've burned on.

---

### Pattern 5: the launch swarm

**When to use:** you're shipping a real launch — book, product, post, campaign — and you need a multi-channel sequence designed by specialists, not by you-at-2am the night before.

**Wave shape:**

- **Wave 1 — Three launch dimensions (3 agents, parallel):**
  - Agent 1 (distribution-sequencer, marketing-strategist subagent): designs the day-by-day plan across HN, X, LinkedIn, newsletter, subreddits, cold-side. Outputs notes/launch/distribution.md — 14-day plan with expected impressions per channel, swing variables, mitigation if HN flops.
  - Agent 2 (viral-mechanics-auditor, general-purpose): reads the **product itself**, surfaces shareable artifacts (a tier list, a CFO defense, a side-by-side comparison) that have post-able life independent of the launch announcement. Outputs notes/launch/shareable-surfaces.md.
  - Agent 3 (hook-and-messaging-auditor, general-purpose): pressure-tests the lead message across three audiences (operators, builders, executives). Identifies which framing converts which audience. Outputs notes/launch/hook-audit.md.
- **Wave 2 — Synthesis (1 agent):** reads all 3 reports, writes SYNTHESIS.md — single integrated launch doc with the day-by-day plan annotated by which shareable surface anchors each post and which hook lands per channel.

three is the floor here too. one launch strategist gives you a single plan with no audit on its assumptions; two gives you debate without arbitration; three (distribute / what-to-distribute / how-to-frame) covers the orthogonal dimensions and the synthesis step does the arbitration.

**Spawn template (paste into Claude Code):**

```
Spawn 3 launch-design subagents in parallel for [PROJECT]:

Agent 1 (marketing-strategist) — distribution sequence. Design day-by-day
launch plan across HN, X, LinkedIn, newsletter, subreddits, cold-side
amplifiers. Real impression estimates. Swing variables. Mitigation paths.
Save to notes/launch/distribution.md.

Agent 2 (general-purpose) — viral-mechanics audit. Read [PROJECT URL or
PATH]. Identify 3-5 shareable artifacts inside the product that have
independent post-able life. Each artifact: one-line description, target
channel, expected engagement floor. Save to notes/launch/shareable-surfaces.md.

Agent 3 (general-purpose) — hook + messaging audit. Pressure-test the lead
message against [3 audience segments]. For each segment: which framing
converts, which framing reads as funnel-bait, the one-line opener that lands.
Save to notes/launch/hook-audit.md.

After all 3 return, synthesis agent reads all three + writes
notes/launch/SYNTHESIS.md — integrated 14-day plan annotated by anchor
artifact + segment-specific hook per channel.
```

**Receipt:** this is exactly the swarm that produced the launch plan for the book you're reading. 3 agents fired 2026-05-10, returned in 4 minutes. synthesis caught that the X thread's launch-announcement framing would have suppressed reach — distribution agent had pencilled in "thread #1: I shipped a book" and the hook-audit agent flagged it as the lowest-engagement opener for the operator audience. final thread led with the LMArena disagreement instead. **that single catch was probably 50K impressions of difference.**

**Anti-pattern (when NOT to use):** the launch is a Tuesday-quiet post to your own list. you don't need 3 strategists for a 400-word email. swarm pays off when the launch has 5+ surfaces and the cost of a wrong hook is > 30 minutes of swarm time.

**Cross-link:** [Chapter 22 — Distribution](/chapters/22-distribution) on multi-surface launches, [notes/launch/distribution.md](/notes/launch/distribution.md) for the receipt artifact this swarm produced.

---

## the meta-rule under all 5

if there's one line to walk away with: **dispatch in one message, not five.** the swarm only works when the parent session sends all wave-1 agents in a **single tool batch** — that's what makes them parallel. if you send them one at a time, you've just built a sequential chain in agent costumes and you'll wait 4× as long for the same answer.

paste a spawn template, swap the brackets, send. if it stalls past 8 minutes, the wave is too big — split into two waves of 3-4 and run them sequentially. 3-4 is the empirical sweet spot. respect the ceiling.
