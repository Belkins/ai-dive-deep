# Builds — Wave A Ideation

15 candidate "Saturday builds" for operators finishing the book. Each is buildable in 4-7 hours with Claude Code + Cowork + MCPs + Vercel/Cron. No SaaS in disguise — these are personal ops weapons.

| # | Name | Problem (1 sentence) | Who's it for | Why now | Chapters that teach it |
|---|---|---|---|---|---|
| 1 | **Inbox Sniper** | Your Gmail has 2,400 unreads and 14 of them are actual deals — the rest is Notion digests and Stripe receipts. | Founders/operators drowning in email | Gmail MCP + Claude classifier is 11 lines of skill; cron runs every 30 min, labels + drafts replies for the 14 | Ch 7 (cron), Ch 12 (MCP), Ch 5 (skills), Ch 34 (write-on-behalf) |
| 2 | **Pipeline Heartbeat** | Sales pipeline rots silently — deals go stale, you find out at Friday standup. | B2B founders running HubSpot/Stripe | HubSpot MCP + Stripe MCP exist; 4hr build = daily Slack post: "3 deals untouched 7+ days, $42K at risk" | Ch 12 (MCP), Ch 7 (cron), Ch 19 (build products) |
| 3 | **Newsletter Lieutenant** | Sub count plateaus because you write when you feel like it, not when the calendar demands. | Newsletter operators (1K-50K subs) | Cron + Claude writes 5 hook drafts every Sunday 6pm from your week's notes; you pick + ship Monday | Ch 7 (cron), Ch 34 (write-on-behalf), Ch 22 (sessions) |
| 4 | **Deliverability Sentinel** | One blacklist hit nukes your cold campaign; you find out 36 hours late from a confused SDR. | Cold email teams, Folderly shape | Cron pings MXToolbox + Glock + GMass health every hour; Telegram alert when score drops 10+ points | Ch 7 (cron), Ch 12 (MCP), Ch 28 (failure receipts) |
| 5 | **Mentee Memory** | Your 1:1s blur together — you forget what Chris committed to last Tuesday. | Mentors, advisors, EMs | Fathom MCP + skill that auto-extracts commitments → writes them into per-mentee vault file, generates next-session prep | Ch 5 (skills), Ch 12 (MCP), Ch 4 (vault) |
| 6 | **Investor Update Bot** | Monthly investor email is 4 hours of pulling Stripe + Mixpanel + Linear. | Founders with 10+ angels/funds | Skill stitches Stripe MRR + GitHub commits + key win events into draft email, you edit + send | Ch 5 (skills), Ch 12 (MCP), Ch 34 (write-on-behalf) |
| 7 | **Hiring Funnel** | 80 applications, you read 6, you miss 3 good ones. | Founders hiring without a recruiter | Gmail MCP + Claude scores inbound applications against your scorecard, drafts intro reply for top 8 | Ch 12 (MCP), Ch 5 (skills), Ch 34 (write-on-behalf) |
| 8 | **Competitor Whisperer** | Your top 3 competitors ship things and you find out from a customer. | Founders in noisy categories | Cron crawls competitor changelogs + LinkedIn + Twitter weekly; Claude diffs vs. last week, posts 1 paragraph to Slack | Ch 7 (cron), Ch 33 (browser agents), Ch 5 (skills) |
| 9 | **Support Triage Captain** | 40 support tickets/day, 4 are P0, you find them at 6pm. | Solo founders or 2-person support teams | Skill pulls inbox/Intercom hourly, classifies severity, escalates P0 to phone, drafts replies for P2/P3 | Ch 5 (skills), Ch 12 (MCP), Ch 34 (write-on-behalf) |
| 10 | **Calendar Defender** | You agreed to 14 meetings this week, 9 should have been async. | Calendar-overrun execs | Gcal MCP + skill scores incoming invites against your principles (no recurring without agenda, no 30-min disco calls), drafts decline | Ch 12 (MCP), Ch 34 (write-on-behalf), Ch 5 (skills) |
| 11 | **Podcast-to-Post Loom** | Your podcast episode dies in audio — never becomes a tweet, never becomes a blog post. | Podcasters with <10K downloads | Voice agent (Ch 27) transcribes → Claude generates 3 LinkedIn posts + 1 newsletter + 1 thread; you publish | Ch 27 (voice), Ch 34 (write-on-behalf), Ch 22 (sessions) |
| 12 | **Stripe Pulse** | You don't know your MRR right now without opening Stripe + a spreadsheet. | SaaS founders, $5K-$500K MRR | Cron + Stripe MCP posts daily Telegram: "MRR $43,218 (+$420). 2 new, 1 churn ($89). Net new $331." | Ch 7 (cron), Ch 12 (MCP) |
| 13 | **Skill Forge** | You keep doing the same 4-step Claude prompt manually; you haven't turned it into a skill because it's "not worth it". | Anyone with 30+ days in Claude Code | Meta-skill: reads your last 50 sessions, finds repeated prompt patterns, drafts SKILL.md candidates for you | Ch 11 (build-a-skill), Ch 22 (sessions), Ch 5 (skills) |
| 14 | **Portfolio Standup** | You run 4 companies and don't know which deploy broke at 3am. | Multi-company CEOs (Vlad shape) | Cron pings GitHub Actions + Vercel + Sentry across N projects every hour, single dashboard + Telegram on red | Ch 7 (cron), Ch 12 (MCP), Ch 18 (headless CI) |
| 15 | **LinkedIn Listener** | Someone tagged you 2 days ago, you missed the comment, the lead went cold. | Founders selling via LinkedIn | Browser agent (Ch 33) checks notifications + mentions + DMs every 2 hrs, classifies, drafts replies for hot ones | Ch 33 (browser agents), Ch 7 (cron), Ch 34 (write-on-behalf) |

## Three I'd kill on cost-benefit

- **#11 Podcast-to-Post Loom** — voice agents are still flaky in 2026 for low-volume podcasters; the ROI is one good post a week. Cheaper to hire a $300/mo VA. Saturday build, but the maintenance tail is real.
- **#15 LinkedIn Listener** — browser agents on LinkedIn are a cat-and-mouse compliance war; LinkedIn ban risk is non-trivial. Teaches Ch 33 well but the operator will get rate-limited or worse.
- **#7 Hiring Funnel** — most book readers aren't hiring this Saturday. Niche audience. Better as a sidebar in #1 (Inbox Sniper) than a standalone build.

## Three I'd double down on

- **#1 Inbox Sniper** — universal pain (everyone has Gmail), teaches 4 of the book's core chapters (cron + MCP + skills + write-on-behalf), and the operator gets a tangible win Sunday morning when their inbox is sorted. Highest "send-it-to-a-friend" velocity.
- **#12 Stripe Pulse** — smallest scope, biggest dopamine. Every SaaS founder wants to see MRR ticker without opening Stripe. 2-hour build, 6-month payoff. Perfect "first build after the book" because success rate is ~95%.
- **#13 Skill Forge** — meta-skill that compounds. The operator who builds this on Saturday ships 3 more skills the following week because the friction dropped. Teaches Ch 11 (build-a-skill) in the most concrete possible way — the build IS the chapter.
