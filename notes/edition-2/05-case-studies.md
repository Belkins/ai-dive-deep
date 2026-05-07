# Case Studies

## Case 1

**The 11 minutes that almost cost a friend $4,200**

2:14 AM London time. A friend pings me — the kind of ping where the punctuation is gone and the message is just "vlad call me." His Stripe dashboard is showing charges he didn't make. Three of them. Then five. Then twelve. From IPs in Sofia he's never seen.

Here's what happened, reconstructed from his commit log and Stripe's events feed.

2:03 AM — he pushes a hotfix to a public GitHub repo. The hotfix touches a config file. The config file, two commits ago, had a `STRIPE_RESTRICTED_KEY=rk_live_...` baked in for a one-off migration script. He thought he'd scrubbed it. He hadn't — he'd scrubbed the line, not the history.

2:04 AM — GitHub's secret scanner flags it. Stripe's partner integration receives the flag. Stripe's automated rotation queue picks it up. Average rotation latency in 2026: somewhere between 8 and 14 minutes depending on key type and load.

2:05 AM through 2:14 AM — a bot he doesn't know exists, scraping new public commits for `rk_live_` and `sk_live_` patterns, pulls the key. It runs his key against `/v1/charges` with a list of test cards it bought for $40 on a Telegram channel. The cards mostly fail. Forty-two of them succeed. Average charge: $100. Total processed: $4,200 across 11 minutes from three Sofia IPs.

2:15 AM — Stripe rotates the key. The bot's next call 401s. The bleeding stops.

2:18 AM — my friend wakes up to the dashboard alert. He's now sitting on $4,200 of fraudulent charges, all of which will become disputes, all of which will hit his dispute ratio, which at his volume could trigger a Stripe account review.

The mechanism worth understanding: the window isn't the rotation latency. The window is the gap between commit-push and key-detection-by-attacker. Stripe's bot saw the key at roughly the same moment the scraping bot did. Whoever wins the race wins. In 2026 the scraping bots win more often than they should because their infrastructure is cheap and their patience is zero.

The operator move — what I made him do that night, what I do for every Stripe key in my own portfolio:

1. **Restricted keys only, never secret keys**, for any code touching repos. Restricted keys can be scoped to one resource (charges, customers, products) and one verb (read, write).
2. **Rate caps at the key level**, not just the account level. Stripe lets you set per-key daily volume limits. He had none. His daily account cap was $50K. His daily *key* cap should have been $200.
3. **GitHub secret scanning + push protection enabled** at the org level, not just the repo level. Push protection blocks the push before the secret hits the public commit graph. He had scanning on. He didn't have push protection on.
4. **A `git-secrets` pre-commit hook** locally — belt and suspenders, blocks the secret before it becomes a commit, not just before it becomes a push.
5. **Webhook-fed Slack alert** on `charge.succeeded` from any new IP geography. He'd have seen Sofia at charge #2, not charge #42.
6. **Daily Stripe events review automated** — a 30-second cron that diffs yesterday's charge IPs against last-90-days. New countries trigger a page.
7. **A rotation drill once a quarter** — actually rotate a live key on purpose, see what breaks, fix what breaks. Most teams have never rotated a key intentionally. The night they have to do it forced is the wrong night.

He paid about $1,800 of the $4,200 net of disputes won and Stripe's fraud refunds. The remaining damage was the dispute ratio hit, which took six months to age out.

The thing nobody tells you: his daily limit was $5,000. If it had been $50,000, he wouldn't have a story. He'd have a closure email.

## Case 2

**The $81 Saturday — a voice memo that took a single day**

Saturday 8:42 AM. I'm on the second espresso, scrolling through last week's calendar, and I notice something — every Monday my prep starts at 7:30 AM, which is too late, because by 8 my first call kicks off and I haven't finished thinking. I want a brief in my ear at 7:00 AM, voice, 90 seconds, while I'm walking the dog. I want it Monday. It's Saturday.

Hour-by-hour, what it cost.

8:42 AM Saturday — I dictate a one-paragraph spec into Claude. "Read my Sunday-night calendar, my last 14 days of Slack DMs, my open Linear tickets. Output a 250-word brief. Pass it to ElevenLabs. Drop the mp3 into iCloud Drive at 7:00 AM Monday. That's it."

10:15 AM Saturday — first scaffold runs. Claude pulls the calendar fine. Slack DM access is through an app token I'd already wired six months ago for a different project. Linear is one MCP call. The brief comes out at 410 words. I tell it 250. It comes out at 261. Good enough.

Token cost so far: about $14. Mostly the Slack-DM-pull, because two weeks of DMs is a lot of context.

3:30 PM Saturday — I take a break. Walk. Eat. Think about whether I'm building the right thing. I'm not — the brief is good but the *order* is wrong. It's leading with the lowest-stakes meeting because that's what's earliest in the day. I rewrite the prompt to weight by stakes, not by time. Stakes is a function of: revenue if it's a customer call, headcount if it's a hire, my own irritation level if it's a vendor.

5:45 PM Saturday — second scaffold. Output is now front-loaded with the calls that matter. ~$20 more in tokens.

Sunday 11:30 AM — ElevenLabs integration. I use the Vlad voice clone I made eighteen months ago for the newsletter. Cost per 90-second mp3: $1.10. I run it five times tweaking pacing. $5.50.

Sunday 4:00 PM — iCloud Drive drop with a launchd job set for 7:00 AM Monday. Zero cost. Zero compute. Just a plist on my Mac.

Sunday 9:43 PM — I press play on a test run. I hear my own voice walk me through Monday. The cadence is right. The order is right. I close the laptop.

Monday 7:00 AM — phone vibrates. mp3 in iCloud. I AirPods, I walk the dog, I hear the brief. By 7:35 AM I've heard my Monday and I haven't opened a screen.

Total spend, ledgered:
- Tokens (Saturday + Sunday scaffolding + tweaks): **$74.40**
- ElevenLabs voice synthesis: **$5.50**
- Compute (launchd, local): **$0**
- Storage (iCloud, already paid): **$0**
- **Total: $79.90, call it $81 with the cup of coffee.**

The thing I want to flag: last year this is a four-day project because I'd be wiring three APIs by hand and writing a queue. Two years ago this is a two-week project because I'm building the prompt-loop infrastructure from scratch. In 2026 this is one Saturday and one Sunday because the orchestration layer is free.

Nobody charged me for the hard part. The hard part was deciding the brief should be voice, not text, and front-loaded by stakes, not by time.

## Case 3

**25,000 words in 6 minutes wall-clock**

Thursday 2:11 PM. I'm in my main Claude session. I have an outline for a 25-chapter book — the one you're reading. Each chapter is roughly 1,500 to 2,000 words. I want a draft by 2:30. I have a 3 PM call.

In one message I dispatch fifteen subagents. The prompt is the same template fifteen times with the chapter number and the chapter brief swapped. Each subagent gets: the voice rules, the brief, the chapter number, an instruction to write a markdown file at a specific path, an instruction to return only the path when done.

2:11 PM the message lands. 2:11 PM all fifteen agents start. 2:17 PM the last one finishes.

Six minutes wall-clock. The orchestrator main session reads each returned path, concatenates the markdown, fixes two duplicated section headers, and the manuscript is on disk. By 2:24 I've skimmed it. By 2:38 I've sent the diffs to my editor.

Procurement note — what this would have cost through the four other channels I've actually paid for in the last two years:

- **A senior ghostwriter at $1.50 a word** for a 25,000-word manuscript: **$37,500**, six to ten weeks. I have the receipts on this one — I paid a ghostwriter $32,000 in 2024 for a deck-and-narrative project that came in at 21,000 words. Nine weeks, three rounds.
- **An editorial team — writer, editor, copy editor, project manager**: roughly **$55,000 to $80,000** for a book-length manuscript on a four-week sprint. I've been quoted this twice. I never bought it.
- **A content agency on a retainer model** producing one 1,500-word chapter per week per writer, three writers: **eight weeks, $40,000-ish**. I've watched this happen at a portfolio company and it was the slowest of the four.
- **Fifteen agents in parallel from my main Claude session**: the API spend was **under $40**. I have the dashboard screenshot. Output cost was the dominant line item — input was cheap because each agent only read the brief and the voice rules, not the other chapters.

The mechanism worth naming: the bottleneck isn't tokens. The bottleneck is *coordination*. Fifteen humans can't write a book in six minutes because they have to meet, align, hand off, revise. Fifteen agents can write a book in six minutes because they don't talk to each other. Each one writes its own chapter in isolation, against the same voice rules, and the orchestrator does the assembly.

This breaks if the chapters need to reference each other heavily. It works because mine don't — each chapter is a standalone scene with a standalone argument. The voice consistency comes from the locked voice rules, not from cross-chapter coordination.

The operator move — and the only thing I'd tell a builder reading this:

You are not racing the agents. You are racing your own procurement instinct. The first time I did this I wasted two days getting quotes from ghostwriters. The math was better in twenty minutes of API calls. The instinct cost more than the work.

The book you're reading was drafted in six minutes. The week of editing came after. The editing is still mine. The drafting was never the hard part — I just used to think it was, because somebody used to charge me $37,500 for it.
