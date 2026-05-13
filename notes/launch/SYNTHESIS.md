# Launch Playbook — Synthesis

Three agents in parallel: distribution sequence (marketing-strategist), in-product viral mechanics (general-purpose), hook & messaging audit (general-purpose). Reports in `distribution.md`, `viral-mechanics.md`, `hooks.md` respectively. This file converges them into a single ordered playbook.

---

## The convergent signal — what all 3 agents said without being asked

1. **The `/research-notes` page is the news peg the launch otherwise lacks.** Distribution wants it shared cold-side, viral-mechanics wants RSS on it, hooks dedicated 3 of 10 hooks to the research-note data and 1 of 3 launch-day picks. This is the artifact's most-share-worthy surface that's not the tier-list. The Anthropic 81k-interviews "horses" quote + DELEGATE-52's 25% corruption number do work the book itself cannot — they give it a citation to be paired *with*, not just shared *about*.

2. **"No email gate, no upsell" is load-bearing in the first 3 lines, everywhere.** Distribution flagged it as the LinkedIn reflex-buster. Hooks implied it by what they're NOT (no LinkedIn-influencer cadence). Viral mechanics only proposed loops that gate nothing. If any page sprouts a newsletter wall during launch week, the trust thesis collapses on contact.

3. **The tier-list page is the X-engine; the share artifact IS the OG card if it gets built.** Distribution leads its X thread with the LMArena wedge, not the launch. Viral-mechanics ranks dynamic OG for tier-list shares as the second-highest-leverage build. They're describing the same lever from two sides.

4. **Vlad's known-as-Belkins-CEO context is a risk, not just an asset.** All three reports flag (implicitly or explicitly) that "free book by B2B outreach company founder" reads as funnel-bait by default. The hooks are voice-deliberate, the distribution is anti-promo, the viral mechanics avoid every gamification reflex. The whole launch is built around defusing that one suspicion.

---

## Phase 0 — Ship before launch (this weekend, 3 hours)

**Build: `/llms.txt` + `/chapters.json` + JSON-LD schema across all 36 chapter pages.**

Why this is the only pre-launch code change worth making:
- Highest leverage-to-effort ratio of anything in any report. 180 LOC, 3 hours.
- Doesn't depend on anything. No Vercel migration. No design polish required.
- Compounds silently for 12+ months. By the time launch traffic plateaus in week 3, LLM crawlers (Anthropic, OpenAI, Perplexity) will be indexing structured pull-quotes + tldrs + key concepts. One ChatGPT citation is worth ~50 traditional backlinks today.
- 32 of 36 chapters already have a `<PullQuote>` — the data shape is essentially free to extract.

What NOT to ship before launch:
- ❌ **Dynamic OG cards.** Tempting because they 4-8× tier-list unfurl-to-click, but: 4 hours + Vercel sidecar + new subdomain + `@vercel/og` cold-start risk on Tue 08:30 ET when Twitter's unfurl bot scrapes the HN-frontpage URL for the first time. Cold-start timing on launch day is the wrong place to take new infra risk. Ship after launch when you have signal on which shares are actually firing.
- ❌ **Completion stamps, RSS feeds, embed widget.** All depend on Phase 0 work or post-launch demand surfacing. Premature.

---

## Phase 1 — Day 0 launch (Tuesday)

Full day-by-day in `distribution.md`. Compressed timing:

| Time (ET) | Channel | Hook |
|---|---|---|
| **Day -2 Sun** | X quote-RT LMArena leaderboard | "spent the week disagreeing with this. publishing the operator-tier version tuesday." |
| **Day -1 Mon** | ~50 personal DMs to known operators | "publishing tuesday, link before it goes wide" |
| **08:30** | HN Show HN, page = root | Title: *"Show HN: A 36-chapter operator field manual on AI tools (with failure receipts)"* |
| **10:00** | LinkedIn long-form (600 words) | Opener = **Hook 5** ("stop using AI like a chatbot. start using it like an OS.") wrapped in "no email gate, no upsell" first 3 lines |
| **11:30** | X thread of 3 | Tweet 1 = LMArena-vs-tier-list wedge. Tweet 2 = **Hook 8** ("unreliability is 26.7%, n=80,508, three lines of Python is the fix"). Tweet 3 = launch close, no CTA verb |
| **14:00** | Subreddit drops 30-min apart | r/ClaudeAI → `/sections`. r/SaaS → `/cfo-case`. r/PromptEngineering → `/weekend-builds`. r/LocalLLaMA → `/tier-list` only |
| **16:00** | DMs to 5 cold-side amplifiers | Each gets a *specific page*, not the root (see distribution.md §7) |

Vlad's part: reply substantively to the first HN comment within 10 minutes. Stay in HN thread 4-6 hours. Never push social during HN peak.

---

## Phase 2 — Week 1 layering (Day 1-7)

| Day | Move | Hook |
|---|---|---|
| Day 1 (Wed) | Newsletter — meta about build process, 4 deep-links not root, P.S. with LMArena disagreement | Subject candidate: **Hook 3** ("skipping stages is faster. skipping stages is also how Saturdays die") |
| Day 2 (Thu) | LinkedIn reply pass with specific page links per commenter. Second subreddit batch. | Hook ammo: **Hook 4** (cache-not-tokens) for finance-leaning replies, **Hook 7** (billing-alert) for engineering replies |
| Day 3 (Fri) | "3 things I got wrong this week" tweet | Hook ammo: **Hook 6** ($4,200 in 11 minutes from leaked Stripe key) for r/devops cross-post if security wedge has legs |
| Day 6 (Mon) | HN re-share *only* if Day 0 flopped — page = `/tier-list`, title = LMArena-disagreement angle | Different surface, different title, same artifact |
| Day 7 (Tue) | Cold-side amplifier follow-up + LinkedIn post #2 (`/cfo-case` thread) | **Hook 9** (50% vs 14% operator empowerment) for LinkedIn |
| Day 8-10 | 5-7 podcast pitches + Indie Hackers post on the *build process* (docx → 36-ch site) | — |
| Day 11-12 | Second X thread — paste entire CFO-case as a thread, link at end | — |
| Day 13-14 | LinkedIn recap with real numbers (visitors, top chapters, top criticism, what I'd remove) | — |

Realistic ceiling: **10-25K visitors if HN lands, 5-8K if not.** HN is binary; LinkedIn + X + Newsletter are independent of HN outcome.

---

## Phase 3 — Week 2-3 build (after launch signal lands)

Now ship **dynamic OG cards for tier-list shares.** 250 LOC, 4 hours, Vercel sidecar. Reasons to ship now-not-before:

- Launch signal tells us which tier-list URLs are actually being shared. If volume is low, OG cards are over-engineering.
- The Vercel migration the embed widget needs is also paid for by this work — bundle if embed demand surfaces.
- Cold-start risk is academic once the launch peak is past. Twitter's bot will scrape the URL whenever, no Tuesday-morning timing penalty.

Same wave: ship RSS for `/research-notes` and `/changelog`. 120 LOC, 2h. Compounds the research-note distribution loop the launch already used.

---

## Phase 4 — Month 2+ (optional)

- **Completion stamp** at 36/36. Reuses dynamic OG infra. ~300 LOC. Only valuable if 100+ readers actually complete the book — wait for the signal.
- **Embed widget.** Vercel-primary migration required. Only if operator blogs ask for it organically.

---

## Decisions Vlad needs to make

1. **HN title — Hook 8 angle or distribution agent's "failure receipts" framing?** My call: use distribution agent's title (`Show HN: A 36-chapter operator field manual on AI tools (with failure receipts)`) — HN-native, doesn't require the 81k-interviews citation visible in the title. Put **Hook 8** in tweet 2 instead, where the eval-discourse audience actually lives.

2. **Tuesday calendar — what is launch-day Tuesday?** The whole sequence anchors on it. Distribution agent assumed "next Tuesday" — pick the date now, work backwards. The `Show HN: A 36-chapter operator field manual` title has roughly 36-hour viability, so the date locks tweet 2's research-note framing.

3. **Cold-side amplifier list.** Distribution agent named 5 (Simon Willison, swyx/Latent Space, Peter Yang, Ben Tossell, Aakash Gupta). Vlad should swap in any operator he has a warm intro to — a personal DM from a name they recognize outperforms a cold one with better fit.

4. **Newsletter sequencing.** Distribution agent said Day 1, framed as meta-not-promo. Tradeoff: Day 1 = list amplifies Day 0 HN/LI/X organically; Day 3 = lets Day 0 land independently then layers on top. My recommendation: **Day 1, meta-framed.** The 10K list is a leveraged Day-2 reply pass either way.

---

## What this synthesis cuts from the agents' reports

- **Subscriber-count guesswork.** Distribution agent flagged Simon Willison's subscriber count as unverified. Don't quote unverified numbers in the launch post itself.
- **Completion-stamp pre-launch.** Hooks/viral-mechanics implied this would be high-leverage, but the design risk is real ("LinkedIn course completion badge" is the failure mode) and the absolute volume is low. Defer.
- **Embed widget pre-launch.** Triggers a Vercel migration the launch doesn't need. Defer until embed demand is real, not anticipated.
- **r/MachineLearning, r/singularity, r/programming.** Distribution agent dropped these — keep them dropped. Wrong audience, hostile mod culture.

---

## The single-sentence launch thesis

**This is a free, no-gate operator field manual launched anti-promo by a known operator, using the Anthropic 81k-interviews citation as the news peg, the LMArena vs operator-tier-list wedge as the X conversation, and the "stop using AI like a chatbot, start using it like an OS" line as the LinkedIn opener — with one cheap code change shipping beforehand (`/llms.txt` + JSON-LD) to silently capture the long-tail LLM citation traffic that lasts long after launch traffic plateaus.**

If any of those load-bearing pieces wobble — gate appears, citation goes stale, hook gets softened to LinkedIn-influencer voice, OG image stays static when shares are actually firing — the next piece in the chain absorbs less amplification. Each one earns the next one's leverage.
