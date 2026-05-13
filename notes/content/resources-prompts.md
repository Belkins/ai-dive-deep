# 8 NEW operator prompts for /resources

These extend the existing 15. No overlap with `PROMPT_RIGOR_ENFORCER`, `PROMPT_ADVERSARIAL`, `PROMPT_SKILL_CREATOR`, `PROMPT_PRE_MEETING`, `PROMPT_EOD`, `PROMPT_DEAL_POSTMORTEM`, `PROMPT_HIRE_SCREEN`, `PROMPT_MODEL_MIGRATION`, `PROMPT_BOARD_UPDATE`, `PROMPT_MENTEE_PREP`, `PROMPT_RFP_TRIAGE`, `PROMPT_KILL_DECISION`, `PROMPT_CUSTOMER_SYNTHESIS`, `PROMPT_WRITING_FILTER`, `PROMPT_TUESDAY_TRIAGE`.

---

### The CFO Defense Generator
Fire when finance pushes back on AI spend — "$4K/mo for Claude is too rich" — and you need a paste-ready memo that reframes it as a labor line, not a SaaS line.

> The prompt:

```
You're a CFO who has approved AI budgets at three growth-stage companies. Read the objection:
[paste the finance-team pushback — Slack message, email, or board comment].

Context: [headcount before AI, headcount after, role types eliminated/avoided, current AI bill, prior labor cost for the same output].

Output a 600-word memo, paste-ready, structured as:
1. The objection restated in CFO terms (1 paragraph).
2. The labor-line math. Concrete: "we ran 5 SDRs at $89K fully loaded; we now run 3 + Claude at $4K/mo = $267K saved annually, 11x ROI on the AI line."
3. The risk the CFO is actually worried about (lock-in, audit trail, vendor concentration) and the one-line mitigation per risk.
4. The line item that makes the spend boring — which existing budget category it slots into so it stops being "AI" and starts being "tooling" or "G&A automation."

No hype. No "AI revolution." Treat it as a vendor-consolidation memo. End with the single number that closes the conversation.
```

**Output shape:** 600-word memo with labor math, three risk mitigations, and a single closing number — pasteable into Slack or board doc.
**Best paired with:** Chapter on AI budgeting / `PROMPT_BOARD_UPDATE` for the upstream investor framing.

---

### The Doc-Corruption Smoke Eval
Fire after Claude has run ~10 edit operations on a long-form doc (book chapter, SKILL.md, ARCHITECTURE.md). Catches silent drift before you ship.

> The prompt:

```
Read two files: the known-good snapshot at [path-A] and the current state at [path-B]. Both are the same document, edited N times in between.

Run a content checksum eval:
1. Section-by-section delta — for each H2 heading, report % of sentences that changed, % that were added, % that were deleted.
2. Flag any section where total drift exceeds 5%. List the section heading and the diff summary in <2 lines.
3. Detect structural corruption: orphaned headings, broken internal links, code blocks that no longer parse, frontmatter that no longer validates.
4. Identify any factual claim that was correct in A and is now hedged, softened, or removed in B (sycophancy drift).

Output: a 3-column table — section / drift % / verdict (clean / inspect / revert). End with one line: "ship" or "revert to snapshot."
```

**Output shape:** 3-column table (section / drift % / verdict) + one-word ship/revert call.
**Best paired with:** The skill smoke eval writer (below) and the verify-file-durability pattern from the operations chapter.

---

### The Skill Smoke Eval Writer
Fire whenever you ship a new SKILL.md and want to know in 30 seconds whether it still fires next month after a model version bump.

> The prompt:

```
Read this SKILL.md: [paste full file].

Generate a 3-line smoke eval that lives at tests/<skill-name>.smoke.md. Structure:

1. Happy path: one trigger phrase a user would naturally type. Expected: skill fires, produces output matching the SKILL.md output contract. Pass criteria: 1 line.
2. Edge case: a phrasing that's adjacent but should still fire — different wording, same intent. Pass criteria: 1 line.
3. Negative case: a phrasing that looks similar but should NOT fire (skill stays dormant or routes elsewhere). Pass criteria: 1 line.

Format the output as a markdown file ready to drop into tests/. Each test gets: trigger / expected behavior / pass-fail check. Total file under 25 lines. No preamble, no rationale — just the eval.
```

**Output shape:** A `tests/<skill>.smoke.md` file, <25 lines, three tests with pass criteria.
**Best paired with:** Chapter on skills + the doc-corruption smoke eval (above) for full skill-pipeline health.

---

### The Tuesday-Morning Briefing
Fire on a cron at 06:30 Tue. Generates the operator's read-in before the 9am call. Not a triage filter — a generated brief.

> The prompt:

```
It's Tuesday 06:30. Generate my operator brief.

Read:
- HubSpot deal motion since Friday EOD (stage changes, new deals, deals that went cold).
- Gong/Fathom transcripts from yesterday's customer calls — surface signals only, not summaries.
- Today's calendar through lunch — flag any conflict, double-booking, or back-to-back >90min block.
- Slack DMs unread since Sunday night.
- Stripe revenue delta since last Tuesday.

Output ~150 words, Slack-mrkdwn, structured exactly:
*Pipeline overnight:* one line, with the deal name + dollar value of the biggest mover.
*Signal from yesterday's calls:* one quote, attributed.
*Calendar fire:* the single conflict before lunch, or "clean."
*Most-likely fire of the day:* one sentence — the thing that's about to go sideways if I don't touch it before noon.
*Revenue delta:* WoW $, % change.

No greeting. No "good morning." Slack-ready, paste straight into #operator.
```

**Output shape:** ~150-word Slack-mrkdwn brief, 5 labeled lines, ready to paste into a private channel.
**Best paired with:** `PROMPT_TUESDAY_TRIAGE` (the existing filter prompt) — generate the brief at 06:30, run the triage filter at 08:55.

---

### The Conventional-Commits Enforcer
Fire when you've staged a chunky diff and the commit message is "wip" or "update stuff." Rewrites to conventional-commits or splits the commit.

> The prompt:

```
Read the staged diff: [paste `git diff --cached` output] and the proposed commit message: [paste].

Step 1: classify the diff. Single-concern (one feature, one bug, one refactor) or mixed-concern (multiple unrelated changes)?

If single-concern, output a properly-shaped conventional-commits message:
- type: feat / fix / chore / docs / refactor / test / perf / build / ci
- optional scope in parens
- subject line under 72 chars, imperative mood, lowercase, no period
- body explaining "why," not "what" — assume the diff speaks for itself
- footer with BREAKING CHANGE or Co-Authored-By only if relevant

If mixed-concern, output a 2-commit split: which files go in commit A (with its conventional message), which files go in commit B (with its conventional message), and the `git restore --staged <file>` commands to actually do the split.

Output: the message OR the split. Nothing else. No explanation, no "here's why."
```

**Output shape:** Either a single conventional-commits message OR a 2-commit split with explicit `git restore --staged` commands.
**Best paired with:** Chapter on hooks + `HOOK_BLOCK_PUSH_TO_MAIN` (the existing hook that prevents force-push to main).

---

### The "Should We Even Build This" Filter
Fire before any feature spec gets written. Five questions that kill 70% of "wouldn't it be cool if" ideas before they touch the roadmap.

> The prompt:

```
Feature idea: [paste 1-3 sentences].

Run the five-question filter. Be ruthless. One line per answer.

1. What breaks if we don't ship this in the next 90 days? (Revenue? Churn? Hire-blocker? "Nothing" is a valid answer and usually the right one.)
2. Who specifically asked for it? Name them. If the answer is "customers in general" or "the team," that's not an answer — it's a vibe.
3. What's the cheapest way to disconfirm demand before we build? Landing page, fake door, manual concierge, paid pilot. Pick one and say what "disconfirmed" looks like.
4. Can we buy it for under $200/mo instead of building it? Name the tool. If nothing exists, why not?
5. Does shipping this teach us a moat we don't already have? Distribution, data, network effect, brand — which one, specifically?

Output one of three verdicts: SHIP (with the smallest viable scope in one line), KILL (with the one-line reason), or DISCONFIRM-FIRST (with the specific test to run in <2 weeks and the kill threshold).

No "it depends." No "maybe." Pick one.
```

**Output shape:** Five one-line answers + a single verdict — SHIP / KILL / DISCONFIRM-FIRST — with the next concrete action.
**Best paired with:** `PROMPT_KILL_DECISION` (existing) — this one filters new ideas, kill-decision audits live ones.

---

### The Week-In-Review Distiller
Fire on Friday at 17:00 or Sunday night before the new week. Reads the trail, distills the four bullets that go into the vault.

> The prompt:

```
Read the last 7 days:
- Slack messages across all channels I'm in (just the ones I sent + ones @mentioning me).
- Commit history across [repo list].
- Stripe revenue delta + AI bill delta (Anthropic, OpenAI, any model API).
- Calendar — what actually happened vs. what was booked.

Output exactly 4 bullets, Notion-ready, vault-pasteable:

- *Shipped:* the single thing that moved a metric. Cite the metric and the delta. Not "we worked on X" — "X went from A to B."
- *Stalled:* the single thing that should have shipped and didn't. One sentence on why. No excuses.
- *Bill spiked:* the cost line that grew >20% WoW. Name it, name the $, name the cause. If nothing spiked, write "flat" and move on.
- *Defend next week:* the single thing I need to protect calendar / energy / attention for. One line.

No preamble. No "this week was great." Four bullets, paste-ready.
```

**Output shape:** Four labeled bullets — shipped / stalled / bill spiked / defend next week — paste-ready to Notion or vault weekly note.
**Best paired with:** `PROMPT_EOD` (existing, daily) — EOD runs nightly, this one runs weekly. Stack them.

---

### The Customer-Call Truth-Extractor
Fire after a customer call where you sense the polite version isn't the real version. Strips the diplomacy.

> The prompt:

```
Read this Fathom transcript: [paste full transcript or Fathom recording link].

Strip the diplomacy. Output exactly three lines, no preamble, no caveats:

1. The actual objection. Not the version they said out loud — the one underneath. Cite the timestamp + quote that gave it away.
2. The actual ask. What do they need from us that they didn't have the language to ask for directly? One line.
3. The actual blocker. The reason this deal/relationship/expansion isn't moving — internal politics, budget freeze, competitor lock-in, champion leaving. One line, with the evidence quote.

No "they seemed interested." No "good rapport." No "follow up next quarter." If you can't extract the truth from the transcript, say "transcript is too polite to read — get them on a second call with [specific question]."

Three lines. Then quit.
```

**Output shape:** Three lines — actual objection / actual ask / actual blocker — each with a cited quote-timestamp.
**Best paired with:** `PROMPT_CUSTOMER_SYNTHESIS` (existing, multi-call) — synthesis is the weekly view, truth-extractor is the per-call view.

---

## Index

1. The CFO Defense Generator — paste finance objection, get 600-word memo with labor-line math.
2. The Doc-Corruption Smoke Eval — known-good snapshot vs. current, flag >5% drift, ship/revert.
3. The Skill Smoke Eval Writer — given SKILL.md, generate 3-line tests/*.smoke.md.
4. The Tuesday-Morning Briefing — 06:30 cron, ~150-word Slack brief, 5 labeled lines.
5. The Conventional-Commits Enforcer — staged diff + draft msg, rewrite or 2-commit split.
6. The "Should We Even Build This" Filter — 5 questions, SHIP / KILL / DISCONFIRM-FIRST.
7. The Week-In-Review Distiller — 7 days of Slack + commits, 4 bullets, vault-ready.
8. The Customer-Call Truth-Extractor — Fathom transcript, 3 lines, no diplomacy.

Skipped (overlap with existing): #2 anti-sycophancy challenger (→ `PROMPT_ADVERSARIAL`), #9 mentee one-pager builder (→ `PROMPT_MENTEE_PREP`).

Word count: ~1850.
