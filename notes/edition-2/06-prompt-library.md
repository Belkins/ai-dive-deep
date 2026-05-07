# Edition 2 — Prompt Library Expansion

Ten new copy-paste prompts beyond the five in Ch 10. Voice-perfect. Each:
trigger phrase, body, expected output shape, anti-pattern note. Drop into
`/resources` page next to the existing five.

---

## 1. The deal post-mortem

**Use when:** a deal you thought you'd close went dark for >2 weeks or moved to
"Closed Lost." Not a recurring task — fire on the day you mark it.

**Trigger phrases:** "deal post-mortem", "we lost X", "deal autopsy"

```
You're a head of sales who's seen 500 deals at this stage fail. Read the deal:
[paste HubSpot stage history, last 5 emails, Gong transcripts of the last 2 calls].

Output:
1. The single moment we should have detected the deal was dead. Which call, which
   line, which signal? Quote it.
2. What we said vs. what they were actually telling us. Two columns, three rows.
3. The two patterns this deal had in common with deals that closed.
4. The one pattern that diverged.
5. One sentence: would the same prospect close if we ran the deal again next quarter?

No empathy. No "they weren't ready." If they ghosted us, we missed something.
```

**Output:** ~250 words, table + bullets.
**Anti-pattern:** Don't run this on deals <$10K — the prep cost outweighs the lesson.

---

## 2. The hire-screener

**Use when:** you need to evaluate a candidate's resume, code sample, or 30-min
exec summary against a role you've been hiring for 6+ months.

**Trigger phrases:** "screen this candidate", "hire screen", "vibe check"

```
Role: [paste 3-line role summary]. Bar: [name 2 people who are A-players in this
role at competitors]. Anti-pattern: [name 1 hire that didn't work and why].

Candidate input: [paste resume / sample / Loom transcript].

Output:
1. Three signals from the input that match the bar.
2. Three signals that match the anti-pattern.
3. Two questions to ask in the next call that will resolve which list dominates.
4. One sentence: would I want this person on my team in 12 months when shit hits
   the fan?

Don't tell me they "could be a good fit." Tell me whether you'd bet on them.
```

**Output:** structured. ~200 words.
**Anti-pattern:** Never run on a single 1-pager. Need real artifacts (sample, transcript).

---

## 3. The model migration audit

**Use when:** you're moving from Sonnet 4.5 → 4.6 (or any version bump) and want
to know what breaks before you ship.

**Trigger phrases:** "model migration", "version bump", "upgrade to opus"

```
We're migrating from [old model] to [new model] across our skills/agents/jobs.
Current stack: [paste list of skills, MCP servers, scheduled tasks, prompt-cache
hit rates if known].

Output:
1. Skills most likely to behave differently. Which prompts have implicit assumptions
   about output length, refusal style, or token budget that the new model will
   shift? Three candidates, ranked by risk.
2. The three evals to run before flipping the switch. Concrete inputs, expected
   outputs, pass/fail thresholds.
3. The rollback plan. Single git revert? Per-skill revert? Per-job env var?
4. Cost delta estimate based on the version's pricing change. Annual.

Be specific. "Test thoroughly" is not an answer.
```

**Output:** ~350 words.
**Anti-pattern:** Don't migrate during a customer-facing launch week. Migrate the week of.

---

## 4. The board update (4-line version)

**Use when:** monthly investor update or quarterly board email. The version that
fits in a Slack DM.

**Trigger phrases:** "board update", "investor update", "monthly to investors"

```
Read [paste: Stripe MRR, HubSpot pipeline value, headcount delta, top 3 wins/risks].

Output exactly 4 lines:
1. The number that matters most. (One metric, current vs. last period, ratio.)
2. The one thing we shipped. (Past tense. Specific.)
3. The one thing that broke. (Specific. Honest. No hedging.)
4. The one ask. (Intro? Hire? Cap? Capital?)

If you can't make line 4 useful, leave it blank. Investors prefer four good lines
to seven mediocre ones.
```

**Output:** 4 lines, exact.
**Anti-pattern:** No prose paragraphs. No "we are excited to share." Cut it.

---

## 5. The mentee prep

**Use when:** 30 min before a paid mentee session. Different from the morning
briefing — mentee-specific.

**Trigger phrases:** "prep for [name]", "mentee prep", "session prep"

```
Mentee: [name]. Session #: [n]. Cadence: [weekly/biweekly].

Read:
- Last session's notes
- Action items I assigned that were due before today
- Any messages they sent me since (WhatsApp / Slack / email)
- Their public LinkedIn, the 3 most recent posts only
- Their company's latest metric snapshot if available

Output:
1. The single most important thing to revisit from last session.
2. Three observations from their recent activity that they probably haven't
   surfaced themselves.
3. Two open questions I asked them last time that they didn't answer.
4. The one thing I should NOT bring up unless they bring it up first.
5. The one strategic move I want them leaving the call having internalized.

Peer tone, no homework interrogation.
```

**Output:** ~300 words.
**Anti-pattern:** Don't include "encourage them to…" lines. Vlad doesn't run cheerleading sessions.

---

## 6. The RFP / partnership response

**Use when:** an inbound RFP, partnership proposal, or speaking invitation hits
the inbox and you need to decide in 5 minutes whether to engage.

**Trigger phrases:** "RFP triage", "partnership response", "should I take this call"

```
Inbound: [paste their email + their company website's homepage + LinkedIn URL of
the sender].

Output:
1. What they actually want vs. what they say they want. Two columns.
2. The asymmetric value: what's in it for me that they may not realize they're
   offering? (Distribution? Logo? Data? IP?)
3. The asymmetric risk: what's the worst case if this goes well? (Time sink? Bad-fit
   logo? Locked-in roadmap?)
4. Three boilerplate questions to send in reply that surface answers in 24 hours.
5. One sentence verdict: take the meeting / send a polite no / forward to [team
   member].
```

**Output:** ~250 words.
**Anti-pattern:** Don't auto-reply yes. Don't auto-reply no. The verdict is the deliverable.

---

## 7. The kill-decision

**Use when:** a project, hire, or product line has been mediocre for 3+ months
and you keep telling yourself "next quarter."

**Trigger phrases:** "kill decision", "should we kill X", "is X working"

```
Project/hire/product: [name]. Started: [date]. Original goal: [one line]. Current
state: [the metrics that matter].

Read: [last 3 monthly snapshots, Slack channel, any internal reviews, any external
signal — customers, churn, tweets].

Output:
1. The version of "this is working" that's true. Steelman.
2. The version of "this is dead" that's true. Steelman harder.
3. The single metric that, if it doesn't move in 60 days, ends it.
4. The cost of running it 60 more days vs. shutting it now. Cash + opportunity cost.
5. The verdict in one sentence.

If your answer is "it depends" — you haven't read the data hard enough. Try again.
```

**Output:** ~300 words.
**Anti-pattern:** Don't run on things <30 days old. Founders kill too early on instinct, then regret.

---

## 8. The customer-call synthesis

**Use when:** you ran 5+ customer interviews this week and the patterns are blurring.

**Trigger phrases:** "customer call synthesis", "interview readout", "what did we learn"

```
Read transcripts from this week's customer calls: [paste Gong/Fathom transcripts or
links to them].

Output:
1. The three quotes that, if you read them with fresh eyes, would change my
   product roadmap. Cite speaker.
2. The two contradictions across customers — where one customer's must-have is
   another's pet peeve.
3. The one feature ten people implied they want without anyone naming it.
4. The single objection I should be fielding on every sales call but probably
   am not.
5. The next interview I should run — who, why, what hypothesis to test.

Don't summarize what each call was about. I sat through them.
```

**Output:** ~400 words.
**Anti-pattern:** Don't generate this from a sample of 1. Need ≥4 calls or the patterns are noise.

---

## 9. The "should I write about this" filter

**Use when:** you have a half-formed essay idea and don't know if it's a newsletter
post, a tweet, or a private thought.

**Trigger phrases:** "should I write about", "newsletter idea check", "is this a post"

```
Idea: [paste 1-3 sentence sketch].

Output:
1. The one paragraph this idea is actually about. Cut everything else. If you
   can't write it, the idea isn't ready.
2. Who already wrote a better version of this? Name 3 essays/posts. Be honest.
3. The angle that's mine to take. If it doesn't exist, kill the idea.
4. The one sentence that would make this tweetable. If you can't write it, this
   is a thread, not a post.
5. Verdict: post / thread / private journal / kill.

Vlad's voice rules apply: lowercase tendencies, em-dashes, no "five lessons," no
corporate hedging. If the idea fights the voice, kill it.
```

**Output:** ~250 words.
**Anti-pattern:** Don't run this in the middle of writing. Run before you start.

---

## 10. The Tuesday-9am triage

**Use when:** the morning briefing already landed but you have 5 minutes before
the first call and the briefing is too long.

**Trigger phrases:** "triage my morning", "5-minute version", "what's the one thing"

```
Read this morning's briefing canvas: [link or paste].

Output exactly 3 lines:
1. The one thing I have to know before my 9am call.
2. The one thing I can defer until 5pm without consequence.
3. The one thing I should ignore today even though I'll be tempted to engage.

Don't add a preamble. Don't include caveats. Three lines. Then quit.
```

**Output:** 3 lines, exact.
**Anti-pattern:** Don't run more than once per morning. The briefing already exists; this is the triage of the triage.

---

## How to ship these to `/resources`

Add these to `src/lib/snippets.ts` as exports, then surface a new section
"Operator prompts" on `src/pages/resources.astro` between the existing
"Five reusable prompts" and "GitHub Action — Daily PR digest". Each one renders
through the existing `<CopyBlock>` component. ~20 min of wiring.
