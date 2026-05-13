# Ch 38 — usability + 3 new use cases

## Part A — Chris-persona read

reading as Chris Laverdure: B2B outstaff operator, writes proposals, runs sales ops, manages a recruiter and a partner. has heard of Claude Code but has never typed a slash command. wants to know whether this thing helps him close more LOs or hire faster, not whether it migrates a model deprecation.

where the chapter loses him:

- **line 18-20** — cold open is a model-migration story. "claude-sonnet-4 references", "branch named model-bump", "tests green". Chris's eyes glaze at "repo". he doesn't have a repo. he has a Notion, a Google Drive, a HubSpot, and 29 placements. the very first concrete example assumes engineer reflexes.
- **line 32** — "session-scoped wrapper around a prompt-based Stop hook" loses him at "wrapper". the next sentence ("a small fast model… inspects the conversation transcript") is fine, but the lede before it isn't.
- **line 36-38** — three properties bullet list is fine in isolation, but "It does not write to `settings.json`" means nothing to Chris. he has never opened a settings.json.
- **lines 82-131** — the six operator scenes lose him cumulatively. scenes 1, 4, 5 are pure engineering (tests, file line counts, tsc strict). scene 2 (research loop) is the only one a non-engineer recognizes. scene 3 is meta (writing this chapter). scene 6 is the trap. so of six, **only one** (research) is recognizable to a non-engineer operator, and even that one assumes WebFetch + auto mode fluency.
- **line 52** — "Live in `settings.json`. Run a deterministic shell script…" hard stop for Chris.
- **pacing drop** — the middle (lines 66-76, the Plan → Auto → /goal ladder) is the strongest section for Chris and the section he'd most want to read first. it's currently buried after the table.
- **closer** — "what I got wrong" (lines 171-177) lands because it's a story with a real receipt. Chris reads stories. but the "fix the deploy" payoff is again engineer-shaped.

**where a Chris-shaped sidebar would help:** right after the "what /goal actually is" section, a 4-line callout like "if you don't write code: /goal works on docs, proposals, outreach lists, and any artifact where 'done' is measurable in chat output. you don't need a repo." would unblock 80% of the non-engineer audience in 30 seconds.

**the one sentence I'd cut (or quarantine to a sidebar):**
> "Live in `settings.json`. Run a deterministic shell script (or HTTP endpoint, or short LLM prompt) when the agent's turn finishes." (line 52)

it's the most engineer-only line in the chapter — three flavors of implementation detail in one sentence, none of which a non-engineer can act on. move it to a footnote or compress to "Stop hooks are the engineer-flavored version — covered in Ch 16."

---

## Part B — 3 new use cases

### Use case A: CFO defense for the AI bill

```text
/goal a 600-word memo defending this month's Anthropic spend
is drafted with 3 specific labor-replacement receipts
(role, hours saved, dollars), a quote from the CFO's own
last objection, and a closing ask of "keep the line item"
or stop after 8 turns
```

**tuesday, 9:14 AM.** Anthropic bill landed at $847 for the month. CFO emailed "what is this and why is it growing." I had a board call at 11. I typed the goal, fed Claude my Customer.io usage report, the last three CFO emails, and a list of three tasks Claude actually did this month (CSV cleanup that would've been a $40/hr VA, a proposal draft that would've been 4 hours of mine, a research pass that replaced a $200 Fiverr gig). Six turns. The Haiku evaluator kept rejecting drafts that had generic "AI is the future" lines — turn 4's reject reason was "no dollar receipt for claim 2." good. turn 6 cleared. memo was 612 words, three receipts named, CFO's "we need to justify every SaaS line" line quoted back at her.

**receipt:** memo sent at 9:41. CFO replied "fine, but cap at $1k." line item survived. saved: roughly 90 minutes of writing + the 11 AM board prep I would've cannibalized.

**the brittle line:** if you don't have receipts before you start, /goal makes them up. it'll happily invent a "VA replaced at $40/hr × 12 hours" if you don't paste the actual usage data first. the goal forces structure, not honesty. honesty is upstream.

---

### Use case B: proposal pipeline triage

```text
/goal triage these 12 inbound proposal threads — for each,
assign go / no-go / follow-up using the 5-question filter
(budget named? decision-maker on thread? timeline under 90d?
fit with our 3 ICPs? response within 48h?), output one row
per thread with the verdict and the failing question if no-go,
or stop after 1 turn per thread (max 12)
```

**wednesday, 7:02 AM.** twelve threads in the proposal inbox from the week. usually I triage these over coffee and it eats an hour. dropped the thread exports into a folder, ran the goal. Haiku evaluator was tight here — the condition was "12 rows present, each with verdict + failing question." three turns in, Claude tried to skip threads where decision-maker wasn't clear. evaluator rejected: "row 4 has no verdict." back to work. turn 9 cleared with all 12 rows.

**receipt:** 7 no-go (4 failed on budget, 2 on decision-maker, 1 on ICP fit), 3 follow-up (timeline soft), 2 go — which I personally replied to within 20 minutes. usually those two would've been buried until Friday. saved: ~50 minutes of triage, and the two go's got same-day replies, which our last sales data says doubles close rate.

**the brittle line:** the 5-question filter is mine — if your filter is fuzzy, /goal can't help you. "good fit" isn't a question. "budget over $5k stated in thread" is. /goal exposes whether your sales process is actually a process or whether it's been vibes the whole time.

---

### Use case C: mentee pre-session prep

```text
/goal pre-session doc for Chris on May 20 is drafted with
(1) his three commitments from last session, (2) this week's
WhatsApp messages summarized into wins + blockers, (3) the
one open question I owe him a referral on, (4) my top 3
talking points ranked by Tier 1 cash impact, or stop after
5 turns
```

**monday, 6:30 PM, day before the session.** I used to do this prep cold at 12:55 PM Tuesday and it showed — I'd forget what we'd agreed last time, scroll WhatsApp mid-call, miss the through-line. ran the goal with last session's transcript, this week's WhatsApp export, and the action tracker pasted in. four turns. Haiku rejected turn 2 because the "wins + blockers" section was generic ("Chris is busy"). turn 4 was specific: "Chris closed 2 NEXA placements but is blocked on attorney response re: licensing." cleared.

**receipt:** session next day ran 11 minutes shorter and we hit all three priority items. Chris flagged later in WhatsApp that "this was the tightest one." saved: 45 min of in-call drift, plus the implicit cost of looking like the mentor who forgot what we agreed last week.

**the brittle line:** /goal can only see what you paste. if WhatsApp export is incomplete or the action tracker is stale (it usually is by Friday), the doc is confident and wrong — which is worse than no doc. the 5-minute cost is keeping the action tracker current. if you don't pay that cost, this use case is a fancy way to lie to yourself.

---

## Part C — Existing scenes rewrite suggestions

**Scene 1 — CI loop (tests pass):** keeps as is — engineer audience is core. this is the canonical example and removing it would dilute the chapter. add a one-line preface: "if you write code, this is the one you'll use first."

**Scene 2 — research loop (five sources):** keeps as is — this is the most operator-friendly scene already. consider promoting it to scene 1 for non-engineer readers, since "five sources cite the same claim" is recognizable to anyone who's written a memo.

**Scene 3 — content loop (anti-takeaway closer):** keeps as is — meta but earns its place because the chapter itself is the receipt. one-line tweak: replace "the draft of chapter 38" with "the draft of \[your piece\]" to make the pattern transferable.

**Scene 4 — refactor loop (file size):** rewrite suggestion: "refactor loop — same pattern works for any 'count must fall below N' goal. operators use it for inbox triage ('unread under 20'), CRM cleanup ('stale leads under 50'), proposal queue ('open over 14 days under 5')."

**Scene 5 — multi-condition stop:** rewrite suggestion: keep the engineering example but add a one-line operator parallel after it: "non-engineer version: /goal proposal is drafted AND budget paragraph is specific AND timeline is under 90 days AND signoff line is present, or stop after 6 turns."

**Scene 6 — the trap (open-ended):** keeps as is — universal, no rewrite needed. this is the scene that protects every reader regardless of role.

---

## Recommended insertion points

- **Use case A (CFO defense)** — insert as new **Scene 7** at the end of the "Six operator scenes" section (after current scene 6, line 139), and rename the section "Seven operator scenes". CFO defense is the highest-signal entry point for non-engineer readers because almost every operator has had this exact conversation with finance. it also reinforces the chapter's economic argument from the Haiku-as-evaluator section.

- **Use case B (proposal pipeline triage)** — insert as new **Scene 2.5** between current scenes 2 (research) and 3 (content), so the non-engineer reader hits two recognizable scenes before encountering the file-line-count one. position is doing more work than the content here — it changes the reader's mental model from "this is for engineers with one operator example" to "this is for anyone with a checklist."

- **Use case C (mentee pre-session prep)** — insert as a sidebar / Callout box immediately after the "Stack — Plan → Auto → /goal" section (after line 76), framed as "what this looks like outside the IDE." it pairs naturally with the ladder framing because pre-session prep is the most ladder-shaped non-engineer workflow: plan the doc, auto-pull the sources, /goal until specific.

- **Chris-shaped sidebar** (separate from the three use cases) — insert immediately after line 41, before the Callout warning about disableAllHooks. one paragraph, ~60 words, frame: "/goal isn't only for code. anywhere 'done' is measurable in transcript — a memo with three receipts, a triage list with 12 verdicts, a prep doc with four sections — /goal works. you don't need a repo. you need a condition you could grep for."
