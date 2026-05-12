# Edition 2 — 8 Weekend Builds, Shaped

Eight Saturday-shippable recipes. Each one has been built at least once in the portfolio — Belkins, Folderly, LinguaLive, the newsletter, the mentee work. The numbers are real. The anti-patterns are real because I tripped over them first.

You don't need all eight. You need one that fixes a Tuesday-morning pain you've been dragging around for six months.

---

## Build 1 — Morning briefing canvas

**Problem.** It's 7:43 AM, you're holding coffee, and you have six tabs open trying to figure out what matters today — Slack threads, CRM dashboard, calendar, Stripe MRR, Vercel deploy status. By 8:15 you've context-switched yourself stupid and the actual work hasn't started.
**Who it's for.** Founder or COO running 2+ revenue lines, where "what changed overnight" is non-trivial.
**Time.** 4-6 hours focused — most of it is taste, not code.
**Token cost.** $4-9/mo if you run it weekdays only. Sonnet on a single 6 AM trigger.
**Prereqs.** Cowork + Slack MCP + Stripe MCP + Google Calendar MCP + one vault note that lists the rules for "what counts as news."
**Chapters that teach the bits.** [Ch 5 — Skills](/chapters/05-skills), [Ch 7 — Cron](/chapters/07-cron), [Ch 11 — MCP connectors](/chapters/11-mcp), [Ch 23 — Worked example](/chapters/23-worked-example).
**The shape.**
1. Write the rules note first — five lines max. "Surface deploys that failed. Surface deals that moved a stage. Surface Stripe events over $2k. Skip everything else."
2. Build the skill with named sections — Overnight changes / Today's calendar / Three things I owe people / One thing to kill. Sections are non-negotiable, content under them is the agent's call.
3. Cron at 6 AM weekdays. Output to a Slack canvas in #vlad-private, not a channel anyone else sees.
4. Re-read it Wednesday. Half the sections will be wrong — rewrite the rules note, not the skill.

**Ship gate.** You open Slack at 7:45 AM three days running and the canvas is already there, and you didn't manually retrigger it once.
**Anti-pattern.** Don't make it pretty before you've used it for two weeks — you'll style the wrong thing.

---

## Build 2 — Daily voice brief

**Problem.** You drive to the gym at 6:45 AM and want the morning briefing piped into your AirPods, not a Slack canvas you have to stop and read.
**Who it's for.** Operator with a commute, a dog walk, or a treadmill habit — anyone who'd rather listen than read at the start of the day.
**Time.** 3-5 hours focused, assuming Build 1 already exists.
**Token cost.** $6-12/mo — ElevenLabs API is the real cost here, not the LLM.
**Prereqs.** Build 1 shipped + ElevenLabs API key + a way to host MP3s (Vercel Blob, S3, anything cheap) + iOS Shortcut or Bashpod RSS feed.
**Chapters that teach the bits.** [Ch 5 — Skills](/chapters/05-skills), [Ch 7 — Cron](/chapters/07-cron), [Ch 23 — Worked example](/chapters/23-worked-example).
**The shape.**
1. Take the morning canvas output, pipe it through a "rewrite for voice" prompt — short sentences, no bullets, no URLs, conversational. The same content that reads fine on screen sounds like a robot when spoken.
2. POST the rewritten text to ElevenLabs, save the MP3 to blob storage with a date-stamped filename.
3. Append the MP3 URL to a single-item RSS feed (overwrite, don't grow).
4. Subscribe to the feed in Overcast or Apple Podcasts.

**Ship gate.** You hear yesterday's brief in the car Monday morning without touching your phone past "play."
**Anti-pattern.** Don't TTS the canvas verbatim — "bullet, deal moved to negotiation, bullet, deploy failed" is unlistenable. The rewrite step is the whole point.

---

## Build 3 — Mentee pre-call prep generator

**Problem.** It's Tuesday 12:45 PM, the mentee call is at 1, and you're scrambling through three vault notes — session history, action tracker, last WhatsApp thread — trying to remember what they committed to two weeks ago and what they're avoiding.
**Who it's for.** Anyone running paid 1-on-1s — mentor, coach, advisor, executive coach — where every session needs to feel prepared, not winged.
**Time.** 4-6 hours focused, most of it spent encoding *your* prep heuristics into a skill.
**Token cost.** $2-5/mo per mentee — runs once a week, ~30 minutes before the call.
**Prereqs.** Cowork + vault read access (Obsidian, Notion, plain markdown — doesn't matter) + Google Calendar MCP for trigger timing.
**Chapters that teach the bits.** [Ch 5 — Skills](/chapters/05-skills), [Ch 6 — Skill lifecycle](/chapters/06-skill-lifecycle), [Ch 7 — Cron](/chapters/07-cron), [Ch 11 — MCP](/chapters/11-mcp).
**The shape.**
1. Write the skill spec as a prep checklist — "What did they commit to? What did they avoid? What's the one red flag from the last session? What's the one win to acknowledge?" Four questions, no more.
2. Event-triggered cron — 30 min before any calendar event matching `*Mentoring*`.
3. Output to a single dated Slack DM with a vault path link back to the full session prep doc.
4. After the call, append outcome notes to the action tracker — separate skill, don't bundle.

**Ship gate.** You walk into Tuesday's call without opening the vault, and the four questions are answered.
**Anti-pattern.** Don't let the skill summarize the whole session history every week — the red flag and the one win are what you need, and burying them in 800 words is the same as not having them.

---

## Build 4 — Newsletter draft assistant (voice-locked)

**Problem.** It's Thursday night, the newsletter ships Friday morning, and you've got three half-formed ideas and a blank Substack editor that's somehow more intimidating than a sales call.
**Who it's for.** Operator with a newsletter (1k+ subs, weekly cadence), where voice consistency matters more than length.
**Time.** 5-7 hours focused — the voice calibration is most of the work.
**Token cost.** $3-7/mo if you draft 4-5 issues — Opus for the rigor pass, Sonnet for the draft.
**Prereqs.** 10+ past newsletter issues in markdown + a rules note that lists your "never say this" phrases.
**Chapters that teach the bits.** [Ch 5 — Skills](/chapters/05-skills), [Ch 12 — Voice calibration](/chapters/12-voice), [Ch 16 — Prompt rigor](/chapters/16-rigor).
**The shape.**
1. Feed 10 past issues into a calibration prompt — extract the recurring openings, the rhythm, the swear words, the structural beats. Save as a voice spec.
2. Skill takes a one-line idea + three bullets of receipts, produces a 600-word draft using the voice spec.
3. Second pass — a rigor enforcer prompt that flags hedge words, missing numbers, and "in my opinion" phrases. Reject the draft if any flagged.
4. Open the surviving draft in your editor and rewrite the lede. The lede is always wrong.

**Ship gate.** Three drafts in a row where you keep more than 60% of the agent's output — under that, the voice spec needs work, not the skill.
**Anti-pattern.** Don't let it draft topics — you pick the topic, the agent drafts the prose. Topic selection is taste, not pattern matching.

---

## Build 5 — Weekly P&L summarizer

**Problem.** It's Friday 5 PM, you have a Saturday board sync, and you're staring at Stripe + a QuickBooks export + last month's MRR spreadsheet trying to assemble "how did this week go" into something readable.
**Who it's for.** Founder or fractional CFO with Stripe-based revenue and a weekly investor or board cadence.
**Time.** 3-5 hours focused.
**Token cost.** $2-4/mo — one run per week, Sonnet, ~12k tokens of context.
**Prereqs.** Cowork + Stripe MCP + a "what counts as significant" rules doc (e.g., "any single charge over $5k, any refund over $500, any new sub on the $20k plan").
**Chapters that teach the bits.** [Ch 7 — Cron](/chapters/07-cron), [Ch 11 — MCP](/chapters/11-mcp), [Ch 19 — Reporting](/chapters/19-reporting).
**The shape.**
1. Friday 4 PM cron pulls last 7 days of Stripe — charges, refunds, new subs, churned subs, failed payments.
2. Skill bucket-sorts against the rules doc, computes MRR delta, surfaces the three biggest events.
3. Output is a four-section markdown — Headline number / What moved / What broke / What's at risk next week. Posted to your private Slack.
4. You read it, copy-paste the parts that aren't sensitive into the board sync doc.

**Ship gate.** Two weeks in a row where you don't open Stripe Dashboard on Friday.
**Anti-pattern.** Don't try to compute LTV, CAC, or cohort retention in this build — that's a different report on a different cadence. Keep this weekly and tactical.

---

## Build 6 — Inbox triage agent (Tuesday 9 AM only)

**Problem.** It's Tuesday 8:50 AM, inbox has 247 unread, you know 230 of them are noise, but you can't trust yourself to skim fast enough to find the 17 that need a reply today.
**Who it's for.** Operator with VA-level email volume (100+/day) and a "I respond on Tuesdays and Thursdays" rule that mostly works.
**Time.** 4-6 hours focused.
**Token cost.** $5-10/mo if your volume is genuinely 100+/day — Sonnet on a once-per-day burst.
**Prereqs.** Gmail MCP + a labels doc that names your priority tiers (P1 = client-blocking, P2 = revenue-relevant, P3 = info, P4 = newsletter/noise) + a list of senders that always get P1 regardless of content.
**Chapters that teach the bits.** [Ch 7 — Cron](/chapters/07-cron), [Ch 11 — MCP](/chapters/11-mcp), [Ch 22 — Approval gates](/chapters/22-gates).
**The shape.**
1. Tuesday 9 AM cron pulls everything since last Friday 5 PM that isn't already labeled.
2. Skill labels each thread P1-P4 using the rules doc, drafts a one-line reply for P1s only.
3. Output is a Slack message with grouped counts ("47 P3s archived, 12 P2s waiting for you, 6 P1s drafted") and links to the P1 drafts.
4. You review drafts, send the ones that are right, rewrite the ones that aren't. Never auto-send.

**Ship gate.** Three Tuesdays in a row where you cleared P1s in under 20 minutes.
**Anti-pattern.** Don't auto-send P1 drafts even when they're good — the moment one goes out with the wrong tone to a client, the whole system loses your trust and gets archived.

---

## Build 7 — Auto-generated meeting prep

**Problem.** It's 2:55 PM, your 3 PM is with a customer you last spoke to in February, and you can't remember if the open thread was the renewal pricing or the integration ask. You're going to wing it.
**Who it's for.** Founder or AE with 5+ external meetings a week where context-loading manually doesn't scale.
**Time.** 3-4 hours focused.
**Token cost.** $3-7/mo — runs only on external meetings, ~5-10 fires per week.
**Prereqs.** Google Calendar MCP + Gmail MCP (for thread lookup) + HubSpot or Notion MCP (whichever has your CRM truth) + an "external attendee" filter rule.
**Chapters that teach the bits.** [Ch 7 — Cron](/chapters/07-cron), [Ch 11 — MCP](/chapters/11-mcp), [Ch 17 — Event-triggered agents](/chapters/17-events).
**The shape.**
1. Event-triggered cron — fires 15 min before any calendar event with an external attendee (not @yourcompany.com).
2. Skill pulls last 90 days of email threads with that attendee + their CRM record + any linked deals.
3. Output is a 200-word brief — Who they are / Last interaction / Open thread / What they probably want today. Posted to Slack DM with a link back to the calendar event.
4. You read it on the way to the call. If wrong, edit the rules — don't edit the output.

**Ship gate.** Five meetings in a row where you didn't open HubSpot before the call.
**Anti-pattern.** Don't have it generate "talking points" — those make you sound like you're reading off a card. Generate context only; you decide what to say.

---

## Build 8 — Customer-call synthesis (post-Fathom)

**Problem.** You had four customer calls this week, recorded them in Fathom, watched zero replays, and now Monday's product meeting is asking "what are customers saying about pricing?" and you've got nothing.
**Who it's for.** Product-led founder or PM running customer development calls where the pattern across calls is the actual signal, not any single call.
**Time.** 4-6 hours focused.
**Token cost.** $4-8/mo — depends on call volume, transcript token counts are heavy.
**Prereqs.** Fathom MCP (or Gong, or Fireflies) + a theme taxonomy doc — 5-7 named themes you care about (pricing pushback, feature gaps, integration friction, etc.).
**Chapters that teach the bits.** [Ch 5 — Skills](/chapters/05-skills), [Ch 7 — Cron](/chapters/07-cron), [Ch 11 — MCP](/chapters/11-mcp), [Ch 20 — Pattern extraction](/chapters/20-patterns).
**The shape.**
1. Friday 4 PM cron pulls all Fathom recordings from the past 7 days where you were on the call.
2. Skill reads each transcript, tags quotes against the theme taxonomy, weights by recency and customer ARR.
3. Output is a markdown doc — one section per theme, top 3 quotes per section with timestamps and deep links back to Fathom.
4. You skim Sunday night. Mondays' product meeting now has receipts.

**Ship gate.** You walk into the product meeting with three exact quotes and timestamps, not "customers seem frustrated about pricing."
**Anti-pattern.** Don't let it generate "recommendations" — the agent picks quotes, you pick the strategy. Conflating those two is how product roadmaps get hijacked by whoever talked loudest on the last call.

---

## How to pick one

If you have no recurring async pain, build nothing. If you have one recurring 20-minute Tuesday-morning ritual you hate — build the one that fixes it. The other seven will still be here next Saturday.
