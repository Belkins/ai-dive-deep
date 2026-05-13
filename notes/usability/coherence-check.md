# Coherence check — Wave A new content

Pass scope: Ch 38 + Ch 39 (new), top 3 research notes (Mythos / Berkeley / CVE), Ch 9, 14, 21, 24, 25, 30, 33, 35, 36 (sharpen-edit NEW sections only). Voice locked: lowercase tolerant, em-dashes.

---

## Contradictions found

### HIGH — Berkeley benchmark list disagrees with itself in two places
- `src/lib/research-notes.ts:51` lists the 8 benchmarks as: **SWE-bench Verified, SWE-bench Pro, OSWorld, GAIA, WebArena, Terminal-Bench, FieldWorkArena, CAR-bench**.
- `src/content/chapters/25-evals-or-hope.mdx:88` names them as: **SWE-bench Verified, T-bench, GAIA, OSWorld, AgentBench, MLE-bench, "and two others"** — only 6 named, says 8, and 5 of the 6 are different benchmarks from the research note.
- Canonical answer: pick ONE list and propagate. The research-notes list is the more reputation-bearing one (SWE-bench Verified + Pro + WebArena + Terminal-Bench are the high-profile ones in the agent-bench world; T-bench and AgentBench are not standard names in May 2026 surface). Recommend keeping the research-notes set as canonical and rewriting Ch 25 line 88 to match it exactly.
- Severity: HIGH. Two of the three "three independent confirmations" sentences in the book name a different benchmark set. A reader who clicks from Ch 25 into /research-notes will catch the mismatch on first read.

### MEDIUM — Mythos benchmark numbers cited differently across chapters
- `src/lib/research-notes.ts:32-33` says Mythos: **SWE-bench Verified 93.9%, SWE-bench Pro 77.8%**. No OSWorld number given.
- `src/content/chapters/30-sdk-direct.mdx:206` says Mythos: **81% on OSWorld** (versus Sonnet 4.6's 72.5%).
- `src/content/chapters/33-browser-agents.mdx:152` says Mythos: **81% OSWorld** (matches Ch 30).
- `src/content/chapters/24-tier-list.mdx:33` says "beats Opus 4.7 across benchmarks" — vague, no contradiction but also no anchoring.
- Not strictly a contradiction (different benchmarks can both be true), but the research note never mentions the 81% OSWorld figure that Ch 30 and Ch 33 lean on. Canonical answer: add the OSWorld 81% figure to the Mythos research note receipts so the receipts in /research-notes are a superset of what chapters cite. Without it, a reader fact-checking Ch 30's 81% claim by clicking through to /research-notes finds SWE-bench numbers instead and assumes the chapter was sloppy.
- Severity: MEDIUM.

### LOW — Ch 14 lists `/agents` twice with different meanings
- `src/content/chapters/14-cheat-sheet.mdx:65` (section 2, daily set): "`/agents` — Manage subagent definitions. Create a new one, edit an existing one..."
- `src/content/chapters/14-cheat-sheet.mdx:87` (section 2b, May 2026 surface): "`/agents` — Agent View dashboard. Single CLI surface showing every background session... Shipped 2026-05-11, v2.1.139. Replaces the tmux-grid hack."
- These are arguably the same command that gained a dashboard view in the May update, but the chapter doesn't say so — reads as two independent commands. Fix: in section 2b, change phrasing to "`/agents` — gained Agent View dashboard. Same command, now also surfaces every background session..."
- Severity: LOW.

### LOW — Ch 25 framing of 81k study drifts from research note
- `src/content/chapters/25-evals-or-hope.mdx:88` describes the Anthropic 81k as "an analysis of roughly 81,000 user-reported issues across the platform" that "surfaced a long tail of agents that returned 'looks fine' outputs while quietly misbehaving."
- Research note (`src/lib/research-notes.ts:131-133`) describes 81k as **"80,508 conversational interviews across 159 countries"** measuring sentiment/concerns, with unreliability at 26.7% as the top concern. Not the same shape as "user-reported issues" — it's a qualitative interview study, not an issue tracker.
- Canonical answer: research note. Rewrite Ch 25's reference to "Anthropic's 80,508-interview study, where unreliability ranked as the #1 user concern at 26.7%."
- Severity: LOW-MEDIUM. The conclusion (silent failures at scale) is directionally right, but the citation shape is wrong and a fact-checker will notice.

---

## Repetitions (consolidate)

### Mythos non-release — 4 places, partial cross-linking
- Topic: "Anthropic disclosed Mythos, explicitly withheld it, shipped Glasswing instead"
- Appears in: `research-notes.ts:18-44` (canonical), `24-tier-list.mdx:33` (linked to /research-notes), `30-sdk-direct.mdx:204-218` (linked), `33-browser-agents.mdx:152` (NOT linked)
- Suggestion: keep all four — each chapter uses Mythos for a different rhetorical purpose (Ch 24 = tier-list framing, Ch 30 = SDK-direct floor, Ch 33 = computer-use ceiling). Just add the `[/research-notes](/research-notes)` link to Ch 33 line 152 so the cross-link is uniform.

### June 15 deprecation cliff — 3 places
- Topic: "claude-sonnet-4 / claude-opus-4 retire June 15, 2026 — sweep model strings to 4.6/4.7"
- Appears in: `research-notes.ts:36` (canonical receipt), `24-tier-list.mdx:33` (rephrased), `38-run-until-done.mdx:18` (cold open, "before the June 15 deprecation deadline")
- Suggestion: research-notes is canonical. Ch 38 cold open uses it as plot context and shouldn't change. Ch 24 should add an explicit `[/research-notes](/research-notes)` link for the cliff so a reader who wants the receipt can find it without grep.

### Operator shutdown 2025-08-31 — 2 places
- Topic: "OpenAI Operator shut down 2025-08-31; Anthropic computer-use is the replacement"
- Appears in: `24-tier-list.mdx:32`, `33-browser-agents.mdx:152`
- Suggestion: Ch 33 should own the canonical version (it's the browser-agents chapter). Ch 24's tier-list bullet should cross-link Ch 33 instead of restating the whole story.

### Haiku-as-evaluator pattern — 3 places, consistent
- Topic: "/goal uses Haiku 4.5 as the evaluator after every turn"
- Appears in: `38-run-until-done.mdx:32`, `38-run-until-done.mdx:146-154` (deep dive), `21-three-modes.mdx:154`, `14-cheat-sheet.mdx:85`, `24-tier-list.mdx:35`
- Suggestion: no consolidation needed. Ch 38 is the deep dive; others reference it correctly. But Ch 14 line 85 should link Ch 38 explicitly, not just Ch 21.

### CrewAI "12M daily executions, 150 enterprises" — 2 places
- Topic: CrewAI scale figures
- Appears in: `research-notes.ts:55` (Berkeley note implications), `36-frameworks-beyond.mdx:206` (table row)
- Suggestion: low-stakes repetition. The research note uses it as a "production case studies beat benchmark scores" point; the chapter uses it as table data. Different purposes, fine to keep both.

---

## Missed cross-link opportunities

### HIGH — Ch 38 and Ch 39 are neighbors but never reference each other
- Ch 38 (Run Until Done) and Ch 39 (Skills You Should Steal) are the two new chapters and currently treat each other as if they don't exist.
- Specifically: Ch 38's discussion of Stop hooks (line 52) and custom-logic loops should mention that skill libraries like gstack (Ch 39) ship Stop-hook-driven workflows. Conversely Ch 39's "three gap-filling skills" section (the portfolio-CEO briefing) is exactly the kind of long-running skill that benefits from `/goal` as the loop primitive.
- Suggested fix: in Ch 38's three-primitives section after the table, add a one-liner: "Skills that wrap these primitives are covered in [Ch 39](/chapters/39-skills-you-should-steal) — the community libraries and the three gaps worth filling." In Ch 39's Gap 1 (portfolio briefing), add: "the loop primitive is `/goal` — see [Ch 38](/chapters/38-run-until-done)."
- Severity: HIGH narrative break.

### MEDIUM — Ch 39 mentions the 73% audit but doesn't surface it in /research-notes
- `39-skills-you-should-steal.mdx:28` cites the dev.to 73% audit by @thestack_ai as the load-bearing receipt. This is the third-most-cited number in the whole chapter.
- There is NO research note entry for the 73% audit. Every other major Wave A receipt has one.
- Suggested fix: add a research-note entry for the dev.to audit (title: "The 73% problem — 214 skills scored against the SKILL.md spec"). Then Ch 39's `## The 73% problem` section ends with a `See the [73%-audit entry in /research-notes](/research-notes)` line.
- Severity: MEDIUM. Without the research note, Ch 39's signature claim has no /research-notes corroboration.

### MEDIUM — Ch 38 doesn't link to Ch 24's tier-list addendum even though Ch 24 mentions /goal
- Ch 24 addendum says "Haiku 4.5 ($1/$5) remains the workhorse for cheap-eval loops and is what powers `/goal`'s evaluator."
- Ch 38's Haiku-as-evaluator section discusses the economics of Haiku as the per-turn judge in detail. The two paragraphs are saying the same thing from different angles.
- Suggested fix: Ch 38's Haiku-as-evaluator section ends with: "Ch 24's tier list addendum has the per-token pricing math; this section is the economic argument for why those prices matter."
- Severity: MEDIUM.

### LOW — Ch 14 section 2b mentions `/loop` and `/goal` but doesn't link Ch 38
- Section 2b cites Ch 21 for the mode story, but Ch 38 is the actual deep dive on /goal + /loop + Stop hooks.
- Suggested fix: line 85 already links Ch 21; add "and [Ch 38](/chapters/38-run-until-done) for the autonomous-loop deep dive" to the same sentence.

### LOW — Ch 9's CVE section doesn't link Ch 39
- Ch 9 covers MCP supply-chain risk and skill audit discipline. Ch 39 has a concrete worked example (the Saturday morning install of a wildcard skill, vault files lost). Ch 39 already references Ch 9 — Ch 9 should reciprocate.
- Suggested fix: at the end of Ch 9's `## The MCP supply chain` section, add: "Ch 39 has the cold-open version of this — a wildcard-tools skill installed without reading the frontmatter, two vault files gone."

### LOW — Ch 30's Mythos section doesn't link Ch 36's updated framework table
- Ch 30 argues the SDK-direct path absorbs new model drops day-of; Ch 36's May 2026 update has the receipts on every framework's release-lag posture.
- Suggested fix: Ch 30 line 218 already mentions Ch 36 — strengthen it to "the [framework menu in Ch 36](/chapters/36-frameworks-beyond) has the May 2026 receipts on every framework's release-lag posture."

### LOW — Ch 21's Mode 4 section doesn't link Ch 14 cheat sheet
- Ch 21 introduces /goal as Mode 4; Ch 14 has the slash-command surface treatment. Currently Ch 21 only links Ch 38.
- Suggested fix: in Ch 21 line 158, add "Ch 14 section 2b has the slash-command surface; Ch 38 has the deep dive."

---

## Narrative breaks

### Ch 38 and Ch 39 do not cross-reference (already noted under cross-links — repeating for severity)
- These are the two new chapters in the book. They share a common audience (operators who run autonomous loops + curate skills). A reader who finishes Ch 38 should land on Ch 39 with a clear connection. Currently the only connection is sequence — they're neighbors in the TOC and nothing more.
- Fix: minimum two cross-references each direction. Ch 38 → Ch 39 on skill-driven Stop hooks; Ch 39 → Ch 38 on portfolio-briefing skill needing /goal.

### Ch 38 cold open's model migration could have referenced Ch 24's deprecation-cliff line
- Ch 38 opens with a `claude-sonnet-4 → claude-opus-4-7` migration ahead of "the June 15 deprecation deadline." Ch 24's tier-list addendum makes the exact same point about the same deadline.
- The cold open is doing narrative work, so don't bog it down with a link — but the next paragraph or a footnote could say "(the deadline is covered in [Ch 24](/chapters/24-tier-list#tier-list-addendum-may-2026) and the receipts live in [/research-notes](/research-notes))."

### Ch 35's May 2026 update introduces cross-vendor SKILL.md but doesn't link Ch 11
- Ch 35 line 121 says "Codex CLI now uses the same SKILL.md format as Claude Code." Readers will want to see how to actually build a SKILL.md — that's Ch 11.
- Ch 35 already links Ch 39; should also link Ch 11.

---

## Tone drift between new and old

### Ch 24's tier-list addendum is voice-consistent
- Reads like the same operator who wrote the original tier-list — same lowercase tolerance, same "I'd rewrite the entries inline if I weren't trying to preserve the receipt" beat. No drift.

### Ch 25's "Three receipts, one thesis" section sits awkwardly mid-chapter
- The chapter's own narrative arc is: anecdote (the $0 canvas) → what evals are → 4 types → cron → starter eval. The "three receipts" section interrupts the arc between the eval-failure-budget paragraph and the 30-minute starter eval. It also pulls in DELEGATE-52, the 81k study, and Berkeley RDI in one paragraph — three external citations stacked.
- Suggested fix: move the "Three receipts, one thesis" block to AFTER the starter-eval section as a coda titled "Why this matters at industry scale." It currently breaks the chapter's tactical flow with macro-context. As a coda it would reinforce the chapter's thesis without interrupting it.
- Severity: LOW tone, MEDIUM structural.

### Ch 30's "The Mythos test" section pivots well, but the "claude-sonnet-4-6" example string is suspect
- `30-sdk-direct.mdx:211` shows the code change as `model="claude-glasswing-1"  # was claude-sonnet-4-6`. The hyphen convention `claude-sonnet-4-6` is the current API naming, but earlier in the chapter (line 44, line 82) the same string is `claude-sonnet-4-5`. This is internally inconsistent within Ch 30.
- Fix: pick one — probably `claude-sonnet-4-5` since the 34-line file uses it twice — and propagate. Or update all three to the post-Sonnet-4.6 string.
- Severity: LOW (typo class) but reader-visible.

### Ch 33's "Operator is dead" section feels added-on
- The new section sits between "ToS lines you don't cross" and "The kill switch" — two of the more punch-line sections of the original chapter. The new section is informational/landscape-shaped where the surrounding sections are operator-shaped (lines you don't cross, scripts you write). The transition reads "here are the rules / here's some industry news / here's the kill switch."
- Suggested fix: move "Operator is dead, computer-use is production" to AFTER "The kill switch" as the landscape coda, before the closing paragraph. Lets the original chapter's pacing breathe and gives the May 2026 update the "what's changed since I wrote this" framing the other chapters use.
- Severity: LOW.

### Ch 36's "May 2026 update" section is well-marked and voice-consistent
- The `## Update — May 2026` heading is a clean separator; the new content reads in the same voice as the original chapter. No drift.

### Ch 14 section 2b feels list-heavy compared to surrounding sections
- The original chapter is mostly prose with code blocks. Section 2b is a 7-bullet list that reads more like changelog notes than the rest. Not a tone violation per se — cheat-sheet chapters tolerate this — but the section could open with one sentence of operator framing ("the command surface moved fast — here's what shipped between February and May 2026 you'll want to recognize when somebody mentions them"). Currently it opens with a meta line ("The command surface moved roughly ten entries in 90 days") which the chapter then repeats two paragraphs later ("The command surface moved 10 entries in 90 days") — minor self-repetition.
- Fix: collapse the two "command surface moved 10 entries" lines into one, at the top.

---

## Date / number drift

### Mythos status — 4 mentions, all consistent on "withheld"
- `research-notes.ts:18` title: "the model Anthropic disclosed and then explicitly withheld" — OK
- `research-notes.ts:34` receipt: "Explicitly withheld — Glasswing shipped instead" — OK
- `24-tier-list.mdx:33`: "Mythos was disclosed and then explicitly withheld... Project Glasswing shipped instead" — OK
- `30-sdk-direct.mdx:206`: "Anthropic explicitly stated Mythos Preview will NOT be made generally available. Project Glasswing shipped instead" — OK
- `33-browser-agents.mdx:152`: "explicitly stated it would NOT ship — Project Glasswing shipped instead" — OK
- VERDICT: all 5 mentions consistent on withheld + Glasswing-shipped-instead. PASS.

### Berkeley benchmark list — 4 mentions, 2 lists, 1 contradiction
- `research-notes.ts:51`: 8 benchmarks — SWE-bench Verified, SWE-bench Pro, OSWorld, GAIA, WebArena, Terminal-Bench, FieldWorkArena, CAR-bench. **Canonical.**
- `research-notes.ts:54`: 6 listed (subset of above). Consistent with canonical.
- `25-evals-or-hope.mdx:88`: SWE-bench Verified, T-bench, GAIA, OSWorld, AgentBench, MLE-bench, "and two others". **DOES NOT MATCH** — different benchmark names.
- VERDICT: FAIL. See HIGH contradiction above. Pick the canonical research-notes list and rewrite Ch 25.

### CVE date — 2 mentions, consistent
- `research-notes.ts:91` Disclosure date: "April 2026" — OK
- `research-notes.ts:75` date field: "2026-04-16" — OK
- `09-dont-get-owned.mdx:90`: "In April 2026, OX Security disclosed CVE-2026-30623" — OK
- VERDICT: all 3 mentions consistent. PASS.

### /goal version — 4 mentions, consistent
- `research-notes.ts`: not mentioned (no research note for /goal yet — could be a gap)
- `38-run-until-done.mdx:30`: "Claude Code v2.1.139 on May 11, 2026, with a v2.1.140 hotfix the next day"
- `21-three-modes.mdx:151`: "shipped May 11, 2026 in Claude Code v2.1.139"
- `14-cheat-sheet.mdx:85`: "Shipped 2026-05-11, Claude Code v2.1.139"
- `24-tier-list.mdx:35` (indirect): "powers /goal's evaluator" — no version
- VERDICT: PASS. Three direct references all say v2.1.139, May 11, 2026. Ch 38 is the only one mentioning the v2.1.140 hotfix — that's appropriate scoping.

### Sonnet 4.6 OSWorld 72.5% — 3 mentions, consistent
- `research-notes.ts:63`: "72.5%" — OK
- `33-browser-agents.mdx:152`: "72.5% for Sonnet 4.6" — OK
- `30-sdk-direct.mdx:206`: "Sonnet 4.6's 72.5%" — OK
- VERDICT: PASS.

### MCP vulnerable count + 9-of-11 — consistent
- `research-notes.ts:88-89`: "~200,000" / "9 of 11" — OK
- `09-dont-get-owned.mdx:90`: "roughly 200,000" / "Nine out of eleven" — OK
- VERDICT: PASS.

### CrewAI numbers — consistent
- `research-notes.ts:55`: "12M daily executions across 150 enterprises" — OK
- `36-frameworks-beyond.mdx:206`: "12M daily executions, 150+ enterprise customers" — OK
- VERDICT: PASS.

---

## Severity summary

- HIGH (must fix): **2**
  1. Berkeley benchmark list contradiction between research-notes and Ch 25
  2. Ch 38 / Ch 39 narrative break — zero cross-references between the two new chapters
- MEDIUM: **5**
  1. Mythos OSWorld 81% number missing from research-note receipts (cited in Ch 30 + Ch 33 with no /research-notes anchor)
  2. dev.to 73%-audit has no research-note entry despite being Ch 39's load-bearing claim
  3. Ch 38 doesn't cross-link Ch 24's tier-list addendum on Haiku economics
  4. Ch 25's framing of the 81k study drifts from research note (issue-tracker vs interview-study)
  5. Ch 25 "Three receipts, one thesis" section interrupts narrative flow — move to coda
- LOW: **9**
  1. Ch 14's two `/agents` entries read as different commands — clarify they're the same
  2. Ch 14's "command surface moved 10 entries in 90 days" repeats itself two paragraphs apart
  3. Ch 30's `claude-sonnet-4-6` vs `claude-sonnet-4-5` string inconsistency within one chapter
  4. Ch 33's "Operator is dead" pacing — move below kill switch
  5. Ch 33's Mythos paragraph doesn't link /research-notes
  6. Ch 9's CVE section doesn't reciprocate Ch 39's link
  7. Ch 30's Ch 36 link can be sharpened
  8. Ch 21's Mode 4 section can also link Ch 14
  9. Ch 35 cross-vendor SKILL.md should link Ch 11

---

## Top 5 fixes to prioritize

1. **Reconcile the Berkeley benchmark list.** Rewrite `25-evals-or-hope.mdx:88` to match the canonical 8-benchmark list in `research-notes.ts:51` (SWE-bench Verified, SWE-bench Pro, OSWorld, GAIA, WebArena, Terminal-Bench, FieldWorkArena, CAR-bench). This is the only HIGH contradiction with reader-visible fact-check risk.

2. **Add two cross-references between Ch 38 and Ch 39.** One direction each: Ch 38's three-primitives section → "skills wrapping these primitives in [Ch 39](/chapters/39-skills-you-should-steal)"; Ch 39's Gap 1 portfolio-briefing → "the loop primitive is `/goal`, see [Ch 38](/chapters/38-run-until-done)." Resolves the only HIGH narrative break.

3. **Add a research-note entry for the dev.to 73% audit by @thestack_ai.** Mirrors the receipt pattern every other Wave A claim has. Then Ch 39's "## The 73% problem" section ends with a `[/research-notes](/research-notes)` link. Closes the Ch 39 evidence loop and makes the chapter's signature claim grep-able from the receipts page.

4. **Add Mythos OSWorld 81% to the research-note receipts.** Currently the research note only carries SWE-bench numbers, but Ch 30 and Ch 33 lean on the OSWorld figure. One-line addition to the receipts array; makes /research-notes a superset of what chapters cite, which is the implicit contract.

5. **Move Ch 25's "Three receipts, one thesis" section to AFTER the starter-eval as a coda.** Restores the chapter's tactical-first pacing (anecdote → what evals are → types → cron → starter code → why it matters at scale). Touches the structural complaint without rewriting any content. Also bundles cleanly with fix #1 since the Berkeley benchmark list lives in that same block — rewrite the list once, in the new location.

---

Time spent: ~10 minutes. Output: report-only, no edits applied.
