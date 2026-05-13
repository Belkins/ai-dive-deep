# 8 skill-chain scenarios for /showcase

A skill on its own is a recipe card. A chain is a service ticket — three recipe cards pinned in the right order, fired by one phrase, finished before the operator's coffee cools. These eight scenarios show what actually happens on a Tuesday morning when the library is doing the work and the operator is just reading Slack. Real portfolios, real numbers, real failure surfaces.

---

### Chain 1: The deal-pipeline tuesday

**When:** Tuesday 06:35 ET

**Skills that fire (in order):**
1. `deal-watcher` — twice-daily HubSpot sweep that flags stalls (4+ days quiet) and surges (2+ stage jumps in 48h) per-deal, not as a digest
2. `friday-wrapup` — last Friday's aggregator memo still pinned in #pipeline-watch, carries the "deals to revisit Tue" list
3. `belkins-sales-intelligence` — joins HubSpot stage data with Gong transcript signals + calendar moves

**The scene:** 06:35. Coffee on, kid still asleep. Slack opens to two deal-watcher pings from the 04:00 scheduled tick — Acme Corp $42k quiet 5 days in proposal, Northwind $18k advanced two stages overnight (good news, but a last-mile slip risk). Below those, friday-wrapup from Apr 26 still pinned: "Tuesday revisit — three deals from last week's calls had no follow-up touch." belkins-sales-intelligence had already cross-referenced the Gong transcripts: two of the three had verbal commitments that never made it to HubSpot notes. Vlad reads for 7 minutes, fires 4 outbound DMs to Kate and the AEs at 06:48. Acme replies at 09:12, deal closed Apr 30.

**Receipt:** $42k deal recovered from the silent-dead window. 7 minutes of operator attention vs. the old 45-minute "read the dashboard, decide" Tuesday ritual.

**Where it's brittle:** deal-watcher posts per-deal pings; on a 12-flag morning the channel becomes a wall and the operator skims. If flag count > 6, the chain needs a fallback digest mode — currently absent.

---

### Chain 2: The newsletter ship loop

**When:** Wednesday 14:00 ET

**Skills that fire (in order):**
1. `vlads-newsletter` — drafts in Vlad's voice from vault sources (Vlad-Brain/Drafts/, recent retros, last week's calls)
2. `voice-calibration` — pulls 3 sample paragraphs from the published archive, scores the draft against them on cadence + sentence-length variance
3. `rigor-enforcer-gate` — kills "Key takeaways" lists, numberless claims ("many users…"), and the four banned superlatives

**The scene:** 14:00, draft prompt opens with "newsletter on why CFOs are mispricing AI tokens." vlads-newsletter pulls three angle candidates from the vault, picks the one with the strongest opening hook (the Folderly $9k/mo bill conversation from Apr 11), drafts 1,150 words in 8 minutes. voice-calibration runs at 14:12 — flags two paragraphs as "too LinkedIn thinkfluencer", suggests cuts. rigor-enforcer-gate runs at 14:25 — catches one "studies show" claim with no link, one "Key Takeaways" closer, three em-dash overdoses (rare for the gate to fire on em-dashes since Vlad likes them, but the threshold is 11 per piece). Vlad hand-edits for 22 minutes. Published draft in Substack at 14:47.

**Receipt:** 47-minute cycle from idea → published draft. Old cycle was 4 hours including the "wait, this sounds AI-written" rewrite pass. 1,150 words shipped at vladsnewsletter.com.

**Where it's brittle:** voice-calibration scores on syntax, not argument shape. A draft can pass voice and still be a topical retread of last month's piece — the chain needs a "have I shipped this argument before" check that doesn't exist yet.

---

### Chain 3: The mentee tuesday prep

**When:** Tuesday 12:30 ET (30 min before the 13:00 Chris call)

**Skills that fire (in order):**
1. `mentoring-lifecycle` — pre-session mode: loads Session History + Action Tracker + Patterns file + last Session Prep for Chris Laverdure
2. `friday-wrapup` — pulls any Belkins/Folderly cross-portfolio context Chris should know (e.g., Folderly upsell warm lead Chris flagged in Session 3)
3. `vault-note` — writes the 1-page prep into Vlad-Brain/Projects/Active/Mentoring/Chris Laverdure - Session Prep 5.md with proper frontmatter + wikilinks

**The scene:** 12:30. Chris call at 13:00 ET. mentoring-lifecycle fires in pre-session mode, loads four files from the vault: Mentoring.md (session history table), Action Tracker (3 commitments overdue 2.5 weeks from Vlad — GTM referrals), Patterns.md (Chris's "result is attached to me, my identity" emotional pattern), Session Prep 4 (the legal bottleneck discovery). friday-wrapup adds the Folderly upsell warm lead status — Chris had mentioned inbox issues, the Folderly team had been pinged but no follow-up yet. vault-note writes the prep at 12:38. Vlad reads for 6 minutes, walks into the call at 12:58 knowing the attorney status is the load-bearing question.

**Receipt:** 1-page prep doc written in 8 minutes vs. the old 35-minute scramble through vault files. Chris's $2,375/mo retainer kept defensible because the session opens on his actual question, not Vlad's last-mentee context bleeding through.

**Where it's brittle:** mentoring-lifecycle assumes the vault paths are stable. When Cowork's bindfs mirror got re-synced on May 9 the chain returned an empty Patterns.md for 18 minutes — verify-file-durability now runs as a pre-check, but the chain doesn't fail loudly when a source file is silently empty.

---

### Chain 4: The CFO defense friday

**When:** Friday 16:45 ET

**Skills that fire (in order):**
1. `billing-alert-template` — already flagged the Anthropic spend spike Tuesday morning, $9,240 month-to-date vs. $5,800 budget
2. `cfo-case` — defense generator, builds the "what this spend bought" memo from git activity + shipped artifacts + revenue-attached outcomes
3. `model-comparison` — pulls Claude Opus 4.7 vs. GPT-5 cost-per-task on the actual prompts Vlad ran that month

**The scene:** 16:45. Slack DM from Maria (Belkins CFO): "Vlad, the Anthropic bill is up 59% this month, can you justify before the board on Monday?" billing-alert-template had already pinged Tuesday — Vlad had ignored it because the spike was a swarm-strategic-plan run for a new portfolio venture, deliberate. cfo-case fires at 16:48: pulls git activity across 4 repos (Partner Connector ships, ai-dive-deep edition 4, belkins.app hub, LinguaLive), maps Claude usage to specific outcomes ($28k Folderly upsell recovered Tuesday, 36-chapter book shipped May 11, 18 Stripe Payment Links live). model-comparison runs at 16:55: same prompts on GPT-5 would have cost $14,100 with worse output on the long-context chapter drafts.

**Receipt:** 4-paragraph response to Maria at 17:08, board memo attached. $9,240 bill defended with $74k of attached deal-and-shipped-product outcomes. 23 minutes total vs. the old "spend Saturday reconstructing what the money bought" pattern.

**Where it's brittle:** cfo-case maps spend to git activity, but a third of Vlad's Claude usage is conversational (mentoring prep, strategic thinking) with no git trail. The defense undercounts the actual value — currently the chain reports the floor, not the truth.

---

### Chain 5: The pre-launch sweep

**When:** Saturday 10:00 ET, day before any public artifact ships

**Skills that fire (in order):**
1. `preflight-external-deps` — spawns parallel research agents to verify every external API/data source is still alive and rate-limit-shaped as documented
2. `cross-trio-audit` — reads landing + day-1 fulfillment page + welcome email side-by-side, catches tier/price/refund/cadence drift
3. `rigor-enforcer-gate` — voice check + claim check on every customer-facing string before money moves

**The scene:** Saturday 10:00, the day before the 10k MRR Ideas demand-test decision (May 18 noon). preflight-external-deps spawns 4 parallel agents at 10:02 — one per external dep: Formspark (lead capture), Stripe Payment Links (18 of them), Resend (welcome email infra), Mailgun (Belkins sender for follow-ups). Wave returns at 10:14: Formspark's free-tier monthly cap was 250 submissions, the hub had logged 312 — silent throttle starting in 6 days. cross-trio-audit runs at 10:18 across the 10 subdomains: catches that 2 of them had a stale $19/mo tier on the landing while the welcome email quoted $29/mo. rigor-enforcer-gate runs at 10:32 on every customer-facing string — flags 3 "we'll get back to you soon" hedges that should name the actual SLA.

**Receipt:** 3 launch-killing drifts caught before the May 18 decision. Form provider swapped to a $9/mo tier by 11:00. Saved roughly 2-3 weeks of "why aren't leads coming in" debugging on a portfolio of 10 day-1 pages.

**Where it's brittle:** preflight-external-deps only checks deps that the operator named in the brief. If a dep is implicit (Vercel's Edge Config quietly underpins the redirect map) the chain misses it. Implicit-dep discovery is still a manual eye.

---

### Chain 6: The sales-team adoption loop

**When:** Wednesday 11:15 ET, week 2 of SDR onboarding

**Skills that fire (in order):**
1. `mentoring-lifecycle` — SDR-onboarding variant, loads the new hire's first-week artifacts (sent emails, recorded discoveries, HubSpot notes)
2. `email-deliverability-eval` — gate before any SDR's first owned campaign — runs SPF/DKIM/DMARC + Postmaster reputation check
3. `customer-call-truth-extractor` — Belkins SDR's first prompt — strips marketing hedge language out of discovery call summaries

**The scene:** 11:15. Belkins onboarded 3 new SDRs on May 1. mentoring-lifecycle (SDR variant) loads their week-1 artifacts at 11:17 — reads 47 sent emails, 6 Gong-recorded discoveries, HubSpot deal notes. One SDR (Jamie) had been writing notes like "buyer seems excited, likely close Q3" — empty signal. customer-call-truth-extractor flagged 9 instances of marketing-hedge language across her notes, suggested rewrites ("buyer named budget $40k, named decision date May 30, named blocker = legal review"). email-deliverability-eval ran on jamie's new sender domain before her first owned send Tuesday — caught a missing DKIM selector, fixed in 4 minutes before the 8AM send window.

**Receipt:** 3 SDRs in week 2, customer-call-truth-extractor stuck (used 38 times across the team that week), email-deliverability-eval caught the DKIM miss that would have torched a 2,400-message send. Week-2 patterns memo written for the next cohort.

**Where it's brittle:** the SDR-onboarding variant of mentoring-lifecycle exists as a mode toggle, not a separate skill — and the trigger phrases between mentee-prep and SDR-onboarding overlap. Wrong mode fires roughly 1 in 7 invocations; the operator catches it because the prep doc lands in the wrong vault folder.

---

### Chain 7: The saturday product build

**When:** Saturday 09:00 → 15:00 ET

**Skills that fire (in order):**
1. `gstack-office-hours` — builder mode, six forcing questions on whether the idea is worth the Saturday
2. `swarm-strategic-plan` — 5-wave × 4-agent scaffold if the idea survives office hours
3. `agent-wave-verify` — between-wave audit, catches silent agent failures + scope drift before wave N+1 fires
4. `pitch-html` — single-file interactive artifact, email-attachable, no build step

**The scene:** Saturday 09:00. Idea: a "deal-cause-of-death autopsy" tool for outbound agencies — given a lost deal, generate the autopsy. gstack-office-hours runs at 09:05: six questions kill the "everyone wants this" assumption, narrows wedge to "Belkins-internal first, 30 lost deals/month, 15-min autopsy each." Survives. swarm-strategic-plan fires at 09:25, wave 1 (BRIEF + MARKET + PROBLEM + PERSONA) returns at 09:48. agent-wave-verify at 09:50 — wave 1 clean. Waves 2-5 fire across the morning with audits in between. agent-wave-verify catches wave 3 at 12:14: the monetization agent silently wrote to the wrong folder, scope-drift on positioning. Re-run wave 3 with corrected scope at 12:20. pitch-html runs at 14:30 with the BRIEF + MONETIZATION + REVENUE-MODEL + BRAND-IDENTITY → single .html file at 14:51. Sent to two Belkins ops leads at 15:00.

**Receipt:** 6 hours from idea → 20 strategic docs + 1 shippable HTML pitch. Wave-3 silent failure caught by audit before it cascaded into 4 downstream wave-4 docs writing against bad positioning. Roughly 3 hours of rework avoided.

**Where it's brittle:** swarm-strategic-plan assumes 4-agent parallelism stays under the empirical ceiling. Saturday morning's API load is low, but if a Saturday build coincides with a Belkins prod incident also burning agent budget, wave-2 agents start returning 429 — the chain doesn't backoff gracefully.

---

### Chain 8: The cross-portfolio hygiene check

**When:** Monday 08:30 ET

**Skills that fire (in order):**
1. `friday-wrapup` — Friday's aggregated state across Belkins / Folderly / LinguaLive / 404 Model Agency / NoCancer AI
2. `cross-portfolio-check` — runs context-leak detection: did a Belkins-flavored prompt accidentally reach a Folderly customer-facing draft, and vice versa
3. `claude-md-portfolio` — verifies the portfolio CLAUDE.md instructions haven't drifted from the actual project state

**The scene:** Monday 08:30. friday-wrapup memo from Apr 26 still pinned, summarizes the 5 portfolio cos at end-of-week. cross-portfolio-check fires at 08:32, reads through draft Slack messages, draft emails, draft newsletter pieces from the weekend — flags one: Vlad's weekend draft for a Folderly partner outreach quoted a Belkins-internal closed-won number that's confidential. claude-md-portfolio at 08:45 — checks the per-project CLAUDE.md files against current state: catches that LinguaLive's CLAUDE.md still references the old payment provider (swapped to Stripe Connect on May 4), Partner Connector's still says "v10.46.12" when prod is on 10.47.8.

**Receipt:** 1 confidential-number leak caught before send — would have been a Monday-morning lawyer email otherwise. 2 stale CLAUDE.md drifts fixed in 11 minutes. Cross-portfolio hygiene done before 09:00, instead of being the thing Vlad notices Wednesday when something has already shipped.

**Where it's brittle:** cross-portfolio-check matches on entity names (Belkins, Folderly, etc.) but doesn't catch paraphrased leaks — "an agency client of mine closed $X" reads as generic, fails the regex, ships. The chain catches the obvious leaks; the lawyer-grade ones still need a human eye.

---

## 8 chain titles + word count

1. The deal-pipeline tuesday
2. The newsletter ship loop
3. The mentee tuesday prep
4. The CFO defense friday
5. The pre-launch sweep
6. The sales-team adoption loop
7. The saturday product build
8. The cross-portfolio hygiene check

Word count: ~2,640
