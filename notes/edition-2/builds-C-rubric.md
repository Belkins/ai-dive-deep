# Rubric

six categories. each is pass/fail, not vibes.

1. **shippable in one Saturday by one operator** — if it needs two weekends or a teammate, it dies before week 2. eight hours, end-to-end, including the demo gif.
2. **earns its slot inside seven days** — produces a thing the operator opens, reads, or acts on before next Sunday. no "this will be useful eventually" — useful by next Sunday or kill it.
3. **reuses chapters the book already teaches** — composes from skills, swarms, crons, permissions, connectors. if it forces a new primitive into Edition 2, that's a chapter, not a weekend build.
4. **blast radius is bounded** — read-only, or write-with-approval, or write-to-self-only. nothing that can DM a customer, ship code to prod, or move money on a cron without a human gate.
5. **survives the second week of running** — does it still get opened on day 14? most operator builds are demo-grade and abandoned by day 21. the rubric kills "build it once, never look again" toys.
6. **the failure mode is embarrassing, not catastrophic** — wrong summary in a Slack canvas is fine. wrong DM to a prospect is a fireable mistake at someone else's company.
7. **the operator learns the chapter by building it** — the build itself is the lesson. if you can finish it without understanding the underlying primitive, it's a copy-paste exercise, not a build.

# 8 I'd actually build (ranked)

1. **Weekly Stripe MRR / P&L summary canvas** — single read-only cron, one connector, one canvas, the operator opens it every Monday for a year. anti-pattern that nearly killed it: most operators over-engineer the chart layer instead of letting numbers sit raw.
2. **Auto-generated pre-meeting prep doc** — fires 30 min before a calendar event, pulls last email + last call + CRM notes, drops a doc link in Slack; the operator uses it 4-6× per week guaranteed. anti-pattern: scope creep into "AI-generated talking points" — keep it to receipts, not opinions.
3. **Mentee pre-call prep skill** — Vlad already does this for Chris Tuesdays at 1 PM ET; a skill that ingests vault notes + last session and outputs a tight prep file is 4 hours of work and saves 30 min/week forever. anti-pattern: trying to make it "general purpose" across mentees instead of one mentee, one skill, ship it.
4. **Customer-call synthesis from Gong/Fireflies** — one webhook in, one structured doc out, lives in a folder you can search; the synthesis becomes a corpus by month 3. anti-pattern: building a "search the corpus" UI before the corpus exists.
5. **"What did I ship today" daily wrap** — pulls git commits + closed PRs + sent emails into a 5-line end-of-day Slack post; cheap, durable, and becomes the seed for a weekly retro. anti-pattern: turning it into a productivity score — the wrap is a memory tool, not a scoreboard.
6. **Newsletter draft assistant in operator voice** — Vlad ships vladsnewsletter.com to 10K+ subs; a skill that drafts in his voice from a week's vault notes saves 2 hours per issue. anti-pattern: letting the model "improve" the voice — the assistant drafts, Vlad writes.
7. **Auto-changelog from git log** — read-only, deterministic, ships in 90 minutes, and the changelog itself is a marketing artifact (release notes, internal updates, weekly ops review). anti-pattern: writing the prompt to include "marketing flavor" — keep it boring, let the human add flavor.
8. **Investor monthly update auto-drafter** — once a month, takes 3 data sources (Stripe, hiring, top wins) and drafts the email; the operator edits and sends. anti-pattern: thinking the LLM should write the narrative — it assembles, Vlad narrates.

# 5 I'd skip

1. **Daily voice brief (MP3 of morning Slack canvas)** — nobody listens to their own brief after week 2; TTS is a demo, not a habit. dies on rubric #5.
2. **Persona Slack DM responder with approval gate** — even with approval, you'll approve a wrong DM at 11 PM tired and burn a relationship. blast radius too wide. fails rubric #4 and #6.
3. **Twitter/X listener for brand mentions** — the platform's API tier shifts twice a year, the alerts become noise within 10 days, and the operator already gets emails from Brand24-class tools. dies on rubric #2 and #5.
4. **Competitor pricing-page watcher (browser agent)** — pricing pages change quarterly, the agent breaks monthly, and the signal is too slow to act on. fails rubric #1 (browser agents are a 2-weekend build minimum) and #5.
5. **Real-time Slack outage detector** — duplicates BetterStack/PagerDuty and competes with tools that have actual paging discipline; the operator's homebrew detector will miss the one outage that matters. fails rubric #4 — you'll trust it when you shouldn't.

# The one most operators will pick that I'd actually warn them about

**Persona Slack DM responder with approval gate.** this is the trap. it looks like the highest-leverage build in the list — "the agent answers my DMs, I just hit yes" — and it's the one that ends careers. the failure mode isn't "the agent wrote something weird." it's: the operator approves 47 in a row at 7 AM, the 48th has a confident hallucination about a customer commitment, and now there's a Slack thread where the CEO promised a discount or a deadline or a refund and the customer has the receipt. approval gates feel safe until you're tired. nobody is tired-proof. the smart operator doesn't build their own DM responder — they build a *DM triager* that sorts by urgency and drafts a one-line reply in a personal doc the operator copy-pastes. zero auto-send. ever. if you must build this, the responder writes to a private channel where only you see it, and you manually move the text. the moment it gains "send" permission, it gains the power to cost you a customer.

# The one most operators will skip that I'd push them toward

**Auto-changelog from git log.** every operator skips this because it sounds like a Friday afternoon nice-to-have, not a Saturday build. they're wrong. here's what they miss: a changelog is the seed crystal for four other artifacts — the weekly Slack update to the team, the monthly investor letter's "what we shipped" section, the changelog page on the marketing site, and the LinkedIn post about velocity. one read-only cron, four downstream uses, zero blast radius, and it gets opened every single week for years. the reason operators skip it: it's boring. there's no AI magic to demo. but boring builds compound. the voice brief and the Slack ticker won't outlive their first novelty week. a git-log changelog will be running unchanged in 2028. build the boring one.
