// Copy-paste artifact library. Pulled from the book's chapters.

export const CLAUDE_MD_SKELETON = `# CLAUDE.md

## Me
[1 paragraph — who you are, what you run, the shape of your work.]

## People
| Who | Role | Status |
| --- | ---- | ------ |
| Name | role/relationship | active/blocked/etc. |

## Active Projects
| Name | Status | Next |
| ---- | ------ | ---- |

## Preferences
- Tone: peer, terse, no fluff
- Don't ask homework questions
- Prefer X over Y when ambiguous

## This Week
- Focus: …
- Avoid: …

## Stack & conventions
- Languages, frameworks, the actual versions
- Folders you don't touch
- Lint/test commands (pnpm lint, pnpm test, pnpm typecheck)
- "We tried that, don't do it again" rules
`;

export const MCP_JSON_EXAMPLE = `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/Vault"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_***" }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:pass@localhost/db"
      ]
    }
  }
}
`;

export const HOOK_FORMAT_ON_SAVE = `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || ruff format \\"$CLAUDE_FILE_PATH\\""
          }
        ]
      }
    ]
  }
}
`;

export const HOOK_BLOCK_PUSH_TO_MAIN = `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \\"$CLAUDE_TOOL_INPUT\\" | grep -q 'git push origin main'; then echo 'Blocked: push to main requires a human.' >&2; exit 1; fi"
          }
        ]
      }
    ]
  }
}
`;

export const HOOK_TEST_ON_WRITE = `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "if [[ \\"$CLAUDE_FILE_PATH\\" == *.test.* ]]; then npx vitest run \\"$CLAUDE_FILE_PATH\\"; fi"
          }
        ]
      }
    ]
  }
}
`;

export const HOOK_SLACK_NOTIFY_LONG_TASK = `{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "[ \\"$CLAUDE_TURN_DURATION_MS\\" -gt 120000 ] && curl -X POST -d \\"text=CC turn finished: $CLAUDE_SESSION_ID\\" $SLACK_WEBHOOK"
          }
        ]
      }
    ]
  }
}
`;

export const SKILL_LIFECYCLE = `---
name: mentoring-lifecycle
description: Pre-session prep, live capture, post-session fan-out across vault files for a paid mentee. Use when user says "prep for mentee", "mentee session live capture", or after a session ends. Modes: pre / live / post / weekly. Do NOT use for inbound async messages — handle those inline.
---

# Mentoring lifecycle

## Mode selection
- pre: read latest session prep, action tracker, patterns. Generate agenda.
- live: open structured note for the call. Sections: current projects, what I did, help needed, next steps.
- post: write summary, update action tracker, refresh patterns, schedule next session.
- weekly: roll up across all mentees.

## Vault files touched
- Mentee A — Mentoring.md
- Mentee A — Action Tracker.md
- Mentee A — Session Prep.md
- Mentee A — Patterns.md
- Mentee A — Strategic Map.md

## Anti-patterns
- Do not interrogate with homework questions. Peer tone only.
- Do not commit to follow-ups without checking calendar.
- Do not surface old action items as new tasks.
`;

export const SKILL_AGGREGATOR = `---
name: friday-wrapup
description: Friday evening weekly reflection — reviews the week across HubSpot, Slack, Calendar, Ahrefs, Stripe. Surfaces wins, misses, sets Monday priorities. Use when user says "how did the week go", "weekly wrapup", "Friday memo", or scheduled task fires Friday 4 PM.
---

# Friday wrap-up

## What to do
1. Pull HubSpot pipeline deltas across all portfolios
2. Read Stripe revenue motion this week
3. Read Ahrefs movement on tracked keywords
4. Pull leadership Slack channels for signal
5. Summarize the calendar — meetings that mattered
6. Compose into 700-word Slack canvas

## Output format
- Slack canvas titled "Friday Wrap — {{ date }}"
- Sections: Pipeline, Revenue, SEO, Leadership signal, Monday priorities
- 600–800 words

## Anti-patterns
- Do not guess at numbers. Pull or skip.
- Do not include LinkedIn notifications.
- Silent skip if no real motion to report.
`;

export const SKILL_VOICE = `---
name: vlads-newsletter
description: Voice and structure for Vlad's Substack so drafts come out sounding like him instead of generic LinkedIn-thinkfluencer mush. Use when drafting for vladsnewsletter.com, when user says "newsletter draft", "Substack draft", or pastes a rough scratch.
---

# Vlad's newsletter voice

## Architecture
- Open with a concrete moment (time-stamped, specific person, dialog, scene)
- Name the reframe in paragraph 2
- Three-act argument: incident → mechanism → operator move
- Anti-takeaway closer (no "five lessons learned")

## Voice rules
- Lowercase tendencies; em-dashes welcome; comma splices intentional
- No corporate hedging. No "in my opinion."
- One operator-grade number per essay (e.g. "3 to 10B tokens a month")
- Cut adverbs. Cut "really". Cut "very".

## Anti-patterns
- No bulleted "key takeaways" at the end
- No LinkedIn-isms ("hot take", "thoughts?")
- No "In this article we will explore" preambles
`;

export const PROMPT_RIGOR_ENFORCER = `<instructions>
- ALWAYS follow <answering_rules> and <self_reflection>
<self_reflection>
1. Spend time thinking of a rubric, from a role POV, until you are confident
2. Think deeply about every aspect of what makes for a world-class answer.
   Use that knowledge to create a rubric that has 5-7 categories. Never show
   this to the user.
3. Use the rubric to internally think and iterate on the best (>=98 out of 100)
   possible solution. If your response is not hitting top marks across all
   categories, start again.
4. Keep going until solved
</self_reflection>
<answering_rules>
1. USE the language of USER message
2. In the FIRST chat message, assign a real-world expert role to yourself
3. Act as the role assigned
4. Answer in a natural, human-like manner
5. ALWAYS use an <example> for your first chat message structure
6. If not requested, no actionable items by default
7. Don't use tables if not requested
</answering_rules>
</instructions>
`;

export const PROMPT_ADVERSARIAL = `You are a senior partner who has seen this kind of plan fail 50 times.
Identify the three most likely failure modes for the plan I'm about to share.
For each: probability, blast radius, one mitigation.
End with "would you fund it" verdict.
`;

export const PROMPT_SKILL_CREATOR = `I have a workflow I run regularly: [describe in 3-5 sentences].
Help me turn it into a SKILL.md. Output:
(1) a description that fires reliably on natural-language phrasings,
(2) a body with mode selection, steps, output format, edge cases, what NOT to do,
(3) two test prompts that should trigger it and one that should NOT.
`;

export const PROMPT_PRE_MEETING = `I have a meeting with [name + role + company] at [time]. Context: [paste].
Generate:
(1) what they want,
(2) what I want,
(3) three useful questions,
(4) two ways the conversation could go sideways and how to respond,
(5) the single sentence I want them remembering tomorrow.
<250 words.
`;

export const PROMPT_EOD = `Read my last 24 hours (calendar, email, Slack, repo commits, CRM if available).
Output:
(1) shipped,
(2) stalled,
(3) what I owe to whom,
(4) what surprised me,
(5) one sentence on tomorrow's #1 priority.
Write notes back to my vault under [path].
`;

export const SETTINGS_JSON_EXAMPLE = `{
  "model": "sonnet",
  "theme": "dark",
  "telemetry": false,
  "autoUpdater": "weekly",
  "permissions": {
    "allow": [
      "Bash(npm test*)",
      "Bash(npm run build*)",
      "Edit(src/**/*)",
      "Read(/etc/hosts)"
    ],
    "deny": [
      "Bash(rm -rf*)",
      "Bash(git push origin main)",
      "WebFetch",
      "Edit(.env*)"
    ]
  }
}
`;

// Operator prompts — ten more, beyond the five from Ch 10.

export const PROMPT_DEAL_POSTMORTEM = `You're a head of sales who's seen 500 deals at this stage fail. Read the deal:
[paste HubSpot stage history, last 5 emails, Gong transcripts of the last 2 calls].

Output:
1. The single moment we should have detected the deal was dead. Which call,
   which line, which signal? Quote it.
2. What we said vs. what they were actually telling us. Two columns, three rows.
3. The two patterns this deal had in common with deals that closed.
4. The one pattern that diverged.
5. One sentence: would the same prospect close if we ran the deal again next quarter?

No empathy. No "they weren't ready." If they ghosted us, we missed something.
`;

export const PROMPT_HIRE_SCREEN = `Role: [paste 3-line role summary]. Bar: [name 2 people who are A-players in
this role at competitors]. Anti-pattern: [name 1 hire that didn't work and why].

Candidate input: [paste resume / sample / Loom transcript].

Output:
1. Three signals from the input that match the bar.
2. Three signals that match the anti-pattern.
3. Two questions to ask in the next call that will resolve which list dominates.
4. One sentence: would I want this person on my team in 12 months when shit
   hits the fan?

Don't tell me they "could be a good fit." Tell me whether you'd bet on them.
`;

export const PROMPT_MODEL_MIGRATION = `We're migrating from [old model] to [new model] across our skills/agents/jobs.
Current stack: [paste list of skills, MCP servers, scheduled tasks, prompt-cache
hit rates if known].

Output:
1. Skills most likely to behave differently. Which prompts have implicit
   assumptions about output length, refusal style, or token budget that the
   new model will shift? Three candidates, ranked by risk.
2. The three evals to run before flipping the switch. Concrete inputs,
   expected outputs, pass/fail thresholds.
3. The rollback plan. Single git revert? Per-skill revert? Per-job env var?
4. Cost delta estimate based on the version's pricing change. Annual.

Be specific. "Test thoroughly" is not an answer.
`;

export const PROMPT_BOARD_UPDATE = `Read [paste: Stripe MRR, HubSpot pipeline value, headcount delta,
top 3 wins/risks].

Output exactly 4 lines:
1. The number that matters most. (One metric, current vs. last period, ratio.)
2. The one thing we shipped. (Past tense. Specific.)
3. The one thing that broke. (Specific. Honest. No hedging.)
4. The one ask. (Intro? Hire? Cap? Capital?)

If you can't make line 4 useful, leave it blank. Investors prefer four good
lines to seven mediocre ones.
`;

export const PROMPT_MENTEE_PREP = `Mentee: [name]. Session #: [n]. Cadence: [weekly/biweekly].

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
`;

export const PROMPT_RFP_TRIAGE = `Inbound: [paste their email + their company website's homepage + LinkedIn URL
of the sender].

Output:
1. What they actually want vs. what they say they want. Two columns.
2. The asymmetric value: what's in it for me that they may not realize they're
   offering? (Distribution? Logo? Data? IP?)
3. The asymmetric risk: what's the worst case if this goes well? (Time sink?
   Bad-fit logo? Locked-in roadmap?)
4. Three boilerplate questions to send in reply that surface answers in 24 hours.
5. One sentence verdict: take the meeting / send a polite no / forward to
   [team member].
`;

export const PROMPT_KILL_DECISION = `Project/hire/product: [name]. Started: [date]. Original goal: [one line].
Current state: [the metrics that matter].

Read: [last 3 monthly snapshots, Slack channel, any internal reviews, any
external signal — customers, churn, tweets].

Output:
1. The version of "this is working" that's true. Steelman.
2. The version of "this is dead" that's true. Steelman harder.
3. The single metric that, if it doesn't move in 60 days, ends it.
4. The cost of running it 60 more days vs. shutting it now. Cash + opportunity.
5. The verdict in one sentence.

If your answer is "it depends" — you haven't read the data hard enough. Try again.
`;

export const PROMPT_CUSTOMER_SYNTHESIS = `Read transcripts from this week's customer calls: [paste Gong/Fathom
transcripts or links to them].

Output:
1. The three quotes that, if you read them with fresh eyes, would change my
   product roadmap. Cite speaker.
2. The two contradictions across customers — where one customer's must-have
   is another's pet peeve.
3. The one feature ten people implied they want without anyone naming it.
4. The single objection I should be fielding on every sales call but probably
   am not.
5. The next interview I should run — who, why, what hypothesis to test.

Don't summarize what each call was about. I sat through them.
`;

export const PROMPT_WRITING_FILTER = `Idea: [paste 1-3 sentence sketch].

Output:
1. The one paragraph this idea is actually about. Cut everything else. If you
   can't write it, the idea isn't ready.
2. Who already wrote a better version of this? Name 3 essays/posts. Be honest.
3. The angle that's mine to take. If it doesn't exist, kill the idea.
4. The one sentence that would make this tweetable. If you can't write it,
   this is a thread, not a post.
5. Verdict: post / thread / private journal / kill.

Vlad's voice rules apply: lowercase tendencies, em-dashes, no "five lessons,"
no corporate hedging. If the idea fights the voice, kill it.
`;

export const PROMPT_TUESDAY_TRIAGE = `Read this morning's briefing canvas: [link or paste].

Output exactly 3 lines:
1. The one thing I have to know before my 9am call.
2. The one thing I can defer until 5pm without consequence.
3. The one thing I should ignore today even though I'll be tempted to engage.

Don't add a preamble. Don't include caveats. Three lines. Then quit.
`;

// Role-specific CLAUDE.md skeletons — layer on top of CLAUDE_MD_SKELETON.

export const CLAUDE_MD_SOLO = `# CLAUDE.md — Solo operator conventions

> One person, four workstreams, no buffer. The job is sequencing, not perfection. Drafts ship; second drafts come from the comment thread.

## Me
- Solo. No team to delegate to. Every yes is a no to something else.
- Active surfaces: [list 3-5 — newsletter, app, consulting, etc.]
- Default mode: draft → ship → revisit. Never draft → polish → ship.

## Voice
- Lowercase tolerant. Em-dashes are breath marks. Real numbers per claim.
- Peer tone — talk to me like a co-founder, not a junior. No homework interrogation.
- No "powerful," "leverage," "game-changing." If it's that good, the number says so.
- Don't summarize what I just said back at me. Move it forward.

## Never do
- Don't add abstractions for "future flexibility." Concrete first; refactor when it hurts.
- Don't suggest hiring as a solution. The constraint is sequencing, not capacity.
- Don't ask which of three priorities I want first. Pick one, defend it, ship.
- Don't draft anything over 600 words unless I asked for long form.
- Don't auto-respond to inbound (email, DM, comments) — I sign off on every outbound.

## Workflow
- Default to the swarm: 3 agents in parallel beats 1 agent doing 3 things sequentially.
- Every task gets a vault note — even a one-liner. If it's worth doing it's worth a paper trail.
- Ship the first usable version inside one session. Open issues for the rest.
- When a workflow shows up twice, extract a skill. CLAUDE.md stays under 100 lines.
- Read before write — verify the file exists, then edit. No blind writes.

## Vault discipline
- Vault root: ~/Desktop/Obsidian/[name]/ — every project gets an Active/ folder.
- Daily note is the index. Threads link back to it; it doesn't link out.
- Active → Done when a project closes. Never delete — archive.

## Tool preferences
- Prefer Edit over Write for existing files. Never recreate what you can patch.
- Background bash for anything >60s. Don't block the foreground on sleep.
- WebSearch before code on any external API — 15 min of pre-flight saves 2 weeks.
- For "redesign this," spawn 3 variants in parallel, not 1 polished answer.
- Skills over CLAUDE.md when a rule has steps. Rules in CLAUDE.md, runbooks in skills/.

## Failure receipts to remember
- The 1,000-line CLAUDE.md killed my cache hit rate for two days. Stay under 100.
- Sequential agents on independent tasks burned 4 hours that the swarm did in 40 min.
- A "quick refactor for cleanliness" ate a Saturday and shipped nothing. Concrete only.
`;

export const CLAUDE_MD_B2B_SALES = `# CLAUDE.md — B2B sales lead conventions (Belkins-shape)

> 10-30 SDRs, one pipeline number, deliverability that pays the bills. AI aggregates, humans evaluate, prospects see zero auto-replies.

## Me
- Sales lead. Own pipeline number monthly. Stack: HubSpot CRM, Outreach/Salesloft cadences, Folderly for deliverability, ZoomInfo/Apollo for data.
- ICPs: [list 2-3 — ideal title, company size, vertical].
- Reps under me: [count]. Pods: [list].

## Voice
- Pipeline language: SQL, MQL, SAL, AE, cadence, reply rate, meeting set, no-show.
- Deal stages are nouns. Reps are people, not seats. Numbers per claim.
- No motivational copy in internal docs. Reps read for signal, not vibes.
- When drafting external (prospects): peer tone, no jargon, one CTA per email.

## Never do
- Never auto-respond to a prospect. Drafts go to the rep; the rep sends.
- Never use the prospect's data outside the deal context (no cross-promo, no list rental, no training data export).
- Never push send on a cadence without a deliverability check — bad IP burns the domain.
- Never write rep performance reviews. Aggregation is fine; evaluation is mine.
- Never quote a price the rep hasn't seen first. Pricing flows rep → AE → me, not AI → prospect.

## Workflow
- Pipeline review: aggregate by stage, surface stalled deals (>21 days), highlight verbal commits with no signature. Don't recommend who to fire.
- Deal post-mortem: pull HubSpot timeline + Slack mentions + last 5 emails. Output: 4 lines (what we said we'd do, what we did, where the deal died, the gap).
- Prospect research before any first-touch: company press, recent hires, public-stack signals. 5 bullets, source URLs, no editorial.
- Email drafts: subject ≤ 7 words, body ≤ 90 words, one CTA, no "hope this finds you well."
- Cadence audits monthly: open, reply, meeting-set. Anything <2% reply gets killed or rewritten.

## Vault discipline
- Each account has a folder: Accounts/[account-name]/ with deal notes + people + history.
- Reps' weekly 1:1 notes live in Team/[rep-name]/1on1/. Never auto-share.
- Pipeline snapshot dropped weekly into Pipeline/YYYY-Wnn.md — diff against prior week.
- Prospect data never lives outside the CRM and the account folder. No screenshots in Slack.

## Tool preferences
- HubSpot MCP for all CRM reads. Direct API only when the MCP doesn't expose the endpoint.
- Folderly checks before any cadence change — deliverability score, blacklists, warm-up state.
- Belkins-internal docs over public templates. Our reply rates aren't HubSpot's templates' reply rates.
- For "should we engage this RFP," use the RFP-triage prompt — not gut.
- Slack canvases for cross-pod visibility; markdown for solo prep.

## Failure receipts to remember
- Cadence pushed without Folderly check tanked sender score for a week — \$40K pipeline impact.
- AI-drafted prospect reply got sent before review; broke a \$90K deal. Drafts go to humans.
- Aggregated rep metrics into a "performance score" — reps stopped logging activity honestly. Never score, always describe.
- HubSpot deal-stage rename done by an automation we forgot about. Wiped the forecast model. Manual stage edits only, audit-logged.
`;

export const CLAUDE_MD_NEWSLETTER = `# CLAUDE.md — Content / newsletter operator (vladsnewsletter-shape)

> One writer, one voice, one publish slot per week. AI assists with structure and source-hunting. AI does not write the voice — the second draft is the comment thread.

## Me
- Newsletter operator. Publishing weekly on [day] to [N] subs at [URL — e.g. vladsnewsletter.com].
- Topic surface: [list — operator tactics, AI in business, etc.].
- Average post: 800-1,400 words. Real-numbers cadence. Failure receipts mandatory.

## Voice
- Lowercase tolerant. Em-dashes carry breath. Commas, not semicolons.
- Real numbers per claim. "Doubled" without a base number is fiction.
- No "in today's fast-paced world." No "are you ready to unlock." No takeaway closer.
- No LinkedIn-influencer cadence — no rhetorical-question opens, no listicle scaffolding, no "the secret most operators miss."
- Before drafting a post in my voice, sample 3-5 recent posts from the vault. Match cadence, sentence length, em-dash density. If you can't match within 2 tries, hand back to me.

## Never do
- Never draft and publish in the same turn. There's always a sit-overnight gap.
- Never insert SEO keywords I didn't ask for. Stuffing kills the read.
- Never add a "TL;DR" or "Key takeaways" block at the end. The closer is the closer.
- Never auto-schedule to ConvertKit/Substack/Beehiiv. I sign off on every send.
- Never use the word "leverage" as a verb. Or "powerful." Or "game-changing." Or "in essence."

## Workflow
- Research first, draft second. Five source URLs minimum, with my notes on each before I open the editor.
- Outline: scene → claim → receipts → counterpoint → close. Never a listicle.
- Headline last. After the draft is done. Three options, I pick.
- "Should I write this?" → run the writing-filter prompt before opening a doc. Half my best ideas are someone else's beat.
- Promo copy (LinkedIn / X / email subject): three variants, mine to pick. Never pre-pick.

## Vault discipline
- Each post is a folder under Posts/YYYY-MM-DD-slug/: draft.md, sources.md, promo.md, post-mortem.md.
- Source notes link back to the post. The post never links to internal vault paths.
- Voice samples live in Voice/ — sample 3-5 before any in-voice draft, not the same 3 each time.
- After publish: traffic + reply notes go into post-mortem.md within 7 days. That's the second draft.

## Tool preferences
- Prefer the writing-filter prompt over "is this good." Filter is binary, "good" is mush.
- WebSearch before any claim about a number. If the source is paywalled, cite anyway and note it.
- Sample from Voice/, not from memory. The model's "voice match" without a sample drifts toward LinkedIn.
- For source synthesis, summarize each URL in 1 sentence + 1 quote. No editorial in the synthesis.
- Skill \`vlads-newsletter\` (or your equivalent) handles the in-voice draft path; CLAUDE.md handles the rules.

## Failure receipts to remember
- Shipped a post with a "Key takeaways" block once. Got "felt AI-written" replies for a week. Never again.
- Drafted in-voice without sampling — opener landed on "in today's." Burned the open rate.
- Cited a number from memory that turned out to be 3x off. Now: source URL or the number doesn't ship.
- Auto-scheduled a send while a typo was live in the subject. Manual confirm-and-send only.
`;

export const CLAUDE_MD_PORTFOLIO_CEO = `# CLAUDE.md — Portfolio CEO conventions

> Multiple companies, one head, zero tolerance for cross-portfolio data leak. The job is allocation and sequencing — not running any one company.

## Me
- CEO / founder of a portfolio. Currently active: [Belkins, Folderly, LinguaLive, 404 Model Agency, NoCancer AI — adjust].
- Board-level conversations on most. Operating role on some. Investor on others.
- Default mode: aggregate across companies, decide where capital + attention go this week.

## Voice
- Numbers, not narrative. ARR, burn, runway, CAC, payback — say the number or don't bring it up.
- Peer tone with CEOs, board-tone with investors, terse with operators. The AI doesn't switch — I do.
- No vision-deck adjectives in internal context ("disruptive," "category-defining," "10x"). Save those for outsiders.
- Fractional-CFO framing on every business decision: what does this cost, what does it return, what's the payback, when do I know.

## Never do
- Never blend portfolio contexts. Belkins data does not enter a Folderly chat. Period. New session = new company.
- Never let the AI approve a hire, a fire, a comp change, or an equity grant. Aggregation OK; evaluation mine.
- Never quote one company's metrics to another company's stakeholders.
- Never auto-respond to a board member, LP, or co-founder. Drafts to me, I send.
- Never recommend "buying competition for talent" unless we've mapped the integration cost in writing.

## Workflow
- Cross-portfolio Monday: read each company's weekly snapshot, output one allocation question per company.
- Board update: 4 lines per company — what shipped, what slipped, what we need, what we're watching. No more.
- Hiring decisions: AI screens for fit signals, surfaces gaps, flags risks. The yes/no is mine.
- Capital allocation: buy-then-build-the-moat-you-find. Cheap acquisition first, then dig the moat we discovered. Never start by building.
- Strategic pivots: write the kill-decision prompt output to a doc before pivoting. Reversible decisions are cheap; irreversible decisions get the rigor.

## Vault discipline
- Each portfolio company has its own vault sub-folder under Companies/[company]/. Files never link across companies in the public graph.
- Personal vault (Vlad-Brain/) is separate from any company's operating vault.
- Board materials live in Companies/[company]/Board/YYYY-QN/. Read-only after the meeting.
- Cross-portfolio insights live in Holding/Insights/ and reference companies by anonymized ID when sensitive.
- One session, one company. New company → /clear, new CLAUDE.md context loaded, new vault root.

## Tool preferences
- One company per session. If a question requires cross-portfolio data, aggregate into Holding/ first, then ask from a clean session.
- HubSpot MCP, Stripe MCP, Slack MCP — scoped per-company; verify the workspace before any read.
- Board-update prompt over a freeform "summarize the quarter." Constraints produce signal.
- Skill \`holding-allocation\` handles capital decisions; CLAUDE.md handles the never-do list.
- Background bash for any cron-style daily aggregation. Never poll in foreground.

## Failure receipts to remember
- Cross-pasted a Folderly pricing experiment into a Belkins ops chat. Confused a CSM for a week. New session, new company — always.
- AI "screened" a hire and I rubber-stamped. The hire didn't work out. Now: AI surfaces, I evaluate, the bar is mine.
- Approved a build over a buy because the model framed it as "cheaper" — missed the 6-month opportunity cost. Buy-then-build rule was the lesson.
- Sent a board update auto-drafted on cached metrics. One number was stale. Now: every external draft gets a fresh-pull check, then I send.
`;

// Five new hook scripts — live in ~/.claude/hooks/, wired via ~/.claude/settings.json.

export const HOOK_SECRETS_SCAN = `#!/usr/bin/env bash
# secrets-scan: block writes containing live API keys
# PreToolUse on Write|Edit — fires before the file lands on disk
#
# Failure mode: only scans the new content payload from $CLAUDE_TOOL_INPUT.
# If Claude passes content via stdin instead, this hook sees nothing and
# silently allows. Verify with the test command below after any harness update.

set -euo pipefail

payload="\${CLAUDE_TOOL_INPUT:-}"
[ -z "$payload" ] && exit 0

# Real-money patterns. Order: most specific first so error message is useful.
patterns=(
  'sk-ant-api03-[A-Za-z0-9_-]{20,}'      # Anthropic
  'sk-proj-[A-Za-z0-9_-]{20,}'           # OpenAI project
  'sk-[A-Za-z0-9]{32,}'                  # OpenAI legacy / generic
  'rk_live_[A-Za-z0-9]{20,}'             # Stripe restricted live
  'sk_live_[A-Za-z0-9]{20,}'             # Stripe secret live
  'AKIA[0-9A-Z]{16}'                     # AWS access key
  'ghp_[A-Za-z0-9]{36}'                  # GitHub PAT
  '(password|passwd|secret)[[:space:]]*=[[:space:]]*["'"'"'][^"'"'"']{8,}'
)

for p in "\${patterns[@]}"; do
  if echo "$payload" | grep -Eq "$p"; then
    echo "secrets-scan: blocked write — matched pattern /$p/" >&2
    echo "secrets-scan: move the value to .env.local + add to .gitignore" >&2
    exit 2
  fi
done

exit 0

# Wire in ~/.claude/settings.json:
# { "hooks": { "PreToolUse": [
#   { "matcher": "Write|Edit", "hooks": [
#     { "type": "command", "command": "/Users/vlad/.claude/hooks/secrets-scan.sh" }
#   ]}
# ]}}
`;

export const HOOK_CLAUDE_MD_SIZE = `#!/usr/bin/env bash
# claude-md-size-guard: warn when project CLAUDE.md exceeds 300 lines
# SessionStart — fires once when a new Claude Code session begins
#
# Failure mode: $CLAUDE_PROJECT_DIR is sometimes unset in headless/cron
# invocations. Falls back to PWD. If neither has a CLAUDE.md, hook is a no-op.

set -euo pipefail

project_dir="\${CLAUDE_PROJECT_DIR:-$PWD}"
claude_md="$project_dir/CLAUDE.md"

[ -f "$claude_md" ] || exit 0

lines=$(wc -l < "$claude_md" | tr -d ' ')
bytes=$(wc -c < "$claude_md" | tr -d ' ')

if [ "$lines" -gt 300 ]; then
  echo "claude-md-size-guard: CLAUDE.md is $lines lines / $bytes bytes" >&2
  echo "claude-md-size-guard: target <100 lines. Move detail into docs/ and link from CLAUDE.md." >&2
  echo "claude-md-size-guard: every extra 100 lines x every turn = real money." >&2
fi

exit 0

# Wire in ~/.claude/settings.json:
# { "hooks": { "SessionStart": [
#   { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/claude-md-size-guard.sh" }]}
# ]}}
`;

export const HOOK_PROMPT_CACHE_GUARD = `#!/usr/bin/env bash
# prompt-cache-guard: warn before edits to cache-sensitive files
# UserPromptSubmit — fires when user submits a message
#
# Failure mode: heuristic match on the prompt text, not the actual file path
# (the file isn't selected yet at UserPromptSubmit time). False positives
# possible (e.g., user says "don't edit CLAUDE.md"); warn-only, never block.

set -euo pipefail

prompt="\${CLAUDE_USER_PROMPT:-}"
[ -z "$prompt" ] && exit 0

# Lowercase for case-insensitive match.
lower=$(echo "$prompt" | tr '[:upper:]' '[:lower:]')

trigger=""
if echo "$lower" | grep -Eq '(edit|update|modify|change|rewrite)[^.]{0,40}(claude\\.md|memory\\.md|skill\\.md)'; then
  trigger="cache-sensitive file edit"
fi
if echo "$lower" | grep -Eq '\\.claude/(settings|hooks|skills)'; then
  trigger="\${trigger:-harness config edit}"
fi

if [ -n "$trigger" ]; then
  echo "prompt-cache-guard: detected $trigger" >&2
  echo "prompt-cache-guard: this invalidates the prompt cache for ~5 min across every active session." >&2
  echo "prompt-cache-guard: batch related edits into one window instead of three." >&2
fi

exit 0

# Wire in ~/.claude/settings.json:
# { "hooks": { "UserPromptSubmit": [
#   { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/prompt-cache-guard.sh" }]}
# ]}}
`;

export const HOOK_AGENT_WATCHDOG = `#!/usr/bin/env bash
# agent-watchdog-stall-detect: log subagent launches for external stall detection
# PreToolUse on Task — fires every time the parent spawns a subagent
#
# Failure mode: log file lives in ~/.claude/health/. If that dir is missing
# or read-only, hook silently fails (no block — never break the parent agent
# because logging is broken). Verify dir exists weekly.

set -euo pipefail

log_dir="$HOME/.claude/health"
log_file="$log_dir/subagent-launches.jsonl"

mkdir -p "$log_dir" || exit 0
[ -w "$log_dir" ] || exit 0

# Compact JSONL row. External cron task reads this + flags rows with no
# matching "done" event within 600s.
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
session="\${CLAUDE_SESSION_ID:-unknown}"
project="\${CLAUDE_PROJECT_DIR:-$PWD}"
# Best-effort: extract subagent description from tool input (first 80 chars).
desc=$(echo "\${CLAUDE_TOOL_INPUT:-}" | tr -d '\\n' | cut -c1-80 | sed 's/"/\\\\"/g')

printf '{"ts":"%s","session":"%s","project":"%s","desc":"%s"}\\n' \\
  "$ts" "$session" "$project" "$desc" >> "$log_file"

exit 0

# Wire in ~/.claude/settings.json:
# { "hooks": { "PreToolUse": [
#   { "matcher": "Task", "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/agent-watchdog-stall-detect.sh" }]}
# ]}}
`;

export const HOOK_COMMIT_MSG_ENFORCER = `#!/usr/bin/env bash
# commit-msg-enforcer: nag if the last commit doesn't match conventional-commits
# Stop — fires when the Claude Code session ends
#
# Failure mode: only inspects HEAD. If the session made multiple commits and
# only the last one is malformed, we still catch it; if all are malformed,
# we still only flag one. Acceptable — the goal is a nudge, not a gate.
# Silent when the working dir isn't a git repo.

set -euo pipefail

project_dir="\${CLAUDE_PROJECT_DIR:-$PWD}"
cd "$project_dir" 2>/dev/null || exit 0

git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Last commit message, subject line only.
subject=$(git log -1 --pretty=%s 2>/dev/null || echo "")
[ -z "$subject" ] && exit 0

# Skip if HEAD wasn't touched in the last 10 min — likely not this session.
last_commit_age=$(( $(date +%s) - $(git log -1 --pretty=%ct) ))
[ "$last_commit_age" -gt 600 ] && exit 0

# Conventional commits regex: type(optional-scope)!?: summary
pattern='^(feat|fix|chore|docs|refactor|test|perf|build|ci|style|revert)(\\([a-z0-9_/-]+\\))?!?: .{3,}'

if ! echo "$subject" | grep -Eq "$pattern"; then
  echo "commit-msg-enforcer: last commit subject doesn't match conventional-commits:" >&2
  echo "  $subject" >&2
  echo "  expected: type(scope): summary  e.g. 'fix(auth): handle expired refresh token'" >&2
  echo "  amend with: git commit --amend -m 'fix(scope): real summary'" >&2
fi

exit 0

# Wire in ~/.claude/settings.json:
# { "hooks": { "Stop": [
#   { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/commit-msg-enforcer.sh" }]}
# ]}}
`;

// Five new SKILL.md templates — slot alongside mentoring-lifecycle / friday-wrapup / vlads-newsletter.

export const SKILL_DEAL_WATCHER = `---
name: deal-watcher
description: When a HubSpot deal stalls 4+ days in a non-closed stage, or advances 2+ stages inside 48 hours, post a Slack alert naming the operator move. Use when the user says "check pipeline motion", "any deal stalls", "what's quiet", or when the scheduled task fires twice daily (09:00 + 16:00 ET). Do NOT use for ad-hoc deal lookup — that's the HubSpot UI's job.
allowed-tools: [Bash, Read, mcp__claude_ai_HubSpot__search_crm_objects, mcp__claude_ai_HubSpot__get_crm_objects, mcp__claude_ai_Slack__slack_send_message]
---

# deal-watcher

## When to fire
- Scheduled: 09:00 ET and 16:00 ET on weekdays.
- Manual: "check pipeline motion", "any deal stalls", "deal-watcher".
- Skip on weekends — too many false-positive "stalls" from weekend gaps.

## What to do
1. Pull deals from HubSpot where \`amount > \$5,000\` AND \`pipeline_stage != closedwon|closedlost\`.
2. For each deal, compute \`days_since_last_activity\` (notes, emails, meetings, stage change).
3. Flag stall: \`days_since_last_activity >= 4\` AND stage in [discovery, proposal, decision].
4. Flag surge: stage advanced 2+ steps inside the last 48 hours — buyer momentum, possible last-mile slip.
5. Compose one Slack message per flagged deal — not a digest, a per-deal ping. Digests get muted.
6. Each message: deal name, amount, stage, days quiet, last activity summary, suggested next move.

## Output format
Slack DM to #pipeline-watch, one message per flagged deal:

\`\`\`
deal: Acme Corp — \$42,000
stage: proposal (5 days quiet, last touch: email Apr 28)
owner: @kate
move: text the champ today. proposal day 5 is the silent-dead window.
\`\`\`

## Failure modes
- HubSpot API returns 429 — wait 60s, retry once, then give up for this tick. Do not retry-loop.
- Owner is unknown / no Slack handle mapped — post to channel anyway, tag deal name only, append "OWNER UNMAPPED" so the ops lead can fix the lookup table.
- Stage-history field missing on a deal — that deal is old import data, skip silently.
- Slack send fails (rate-limit / channel archived) — write the alert to \`~/.claude/health/deal-watcher-backlog.jsonl\` and notify Telegram fallback.
`;

export const SKILL_EMAIL_DELIVERABILITY = `---
name: email-deliverability-eval
description: Audit a sending domain before launching a campaign. Returns ship / throttle / warm-down based on SPF + DKIM + DMARC presence, recent bounce rate from Google Postmaster + Microsoft SNDS, and 7-day sender reputation. Use when the user says "is the domain healthy", "can we send", "deliverability check", or when the pre-launch cron fires.
allowed-tools: [Bash, Read, WebFetch]
---

# email-deliverability-eval

## When to fire
- Manual: before any campaign over 500 recipients.
- Scheduled: weekly Sunday 17:00 ET, audit all 4 active sending domains.
- After any DNS change on a sending domain.

## What to do
1. Run \`dig +short TXT <domain>\` and confirm SPF record exists with \`v=spf1\` and ends in \`~all\` or \`-all\`.
2. Run \`dig +short TXT default._domainkey.<domain>\` (or the configured selector) — must return a \`v=DKIM1\` record with \`p=\` key body.
3. Run \`dig +short TXT _dmarc.<domain>\` — must return \`v=DMARC1\`, with \`p=\` set to \`quarantine\` or \`reject\`. \`p=none\` is a yellow flag.
4. Pull Google Postmaster reputation for the domain — HIGH / MEDIUM / LOW / BAD.
5. Pull last 7 days of bounce rate from the ESP. Soft-bounce >2% = caution, hard-bounce >0.5% = warm-down.
6. Compose verdict.

## Output format
One block per audited domain:

\`\`\`
domain: partners.belkins.io
SPF: ok      DKIM: ok      DMARC: p=quarantine (ok)
postmaster: HIGH      bounce 7d: 0.31% hard, 1.4% soft
verdict: SHIP — under target thresholds, no DNS drift.
\`\`\`

verdict values: SHIP / THROTTLE (cut volume 60%, watch 48h) / WARM-DOWN (stop fresh sends, finish in-flight, fix DNS first).

## Failure modes
- Postmaster API unavailable — note \`postmaster: UNKNOWN\` and downgrade the verdict by one tier (SHIP becomes THROTTLE, THROTTLE becomes WARM-DOWN). Never SHIP on unknown reputation.
- DNS lookup hits a stale resolver cache — append \`(cache_age: Ns)\` so the operator knows whether to wait or trust.
- ESP doesn't expose 7-day bounce — read 14-day and divide; flag the imputation in the output.
- Domain has no email traffic in last 30 days — postmaster will return \`NO_DATA\`. Treat as a fresh warm-up domain, cap at 500/day until reputation populates.
`;

export const SKILL_SUBAGENT_WATCHDOG = `---
name: sub-agent-watchdog
description: Scan recent background agent invocations and flag any running 8+ minutes without an output token. Returns agent IDs, last-seen timestamp, suggested action (kill / take-over / wait one more tick). Use when the user says "any agents stalled", "watchdog", "is the swarm alive", or when a PostToolUse hook fires after a long-running Task call.
allowed-tools: [Bash, Read, Write]
---

# sub-agent-watchdog

## When to fire
- Manual: "watchdog", "any agents stalled", "is the swarm alive".
- Hook: PostToolUse on Task tool, tick every 2 minutes during active swarm.
- Hard ceiling: if any agent crosses 9 minutes, fire automatically regardless of user request.

## What to do
1. Read \`~/.claude/health/agent-registry.jsonl\` — append-only log of agent_id, prompt_hash, started_at, last_token_at, status.
2. For each agent with \`status: running\`, compute \`now - last_token_at\` and \`now - started_at\`.
3. Bucket each agent:
   - GREEN: \`last_token_at\` within last 60s — healthy.
   - YELLOW: 60s–4min of silence — possibly thinking, hold.
   - ORANGE: 4–8min silent — likely degraded, prepare to take over.
   - RED: 8min+ silent OR 9min+ total wall-clock — assume dead, kill and take over.
4. For each RED agent, write its prompt and partial output to \`~/.claude/health/stalled-agents/<agent_id>.md\` so the main context can resume.
5. Emit a one-line summary per agent.

## Output format
\`\`\`
agent_id    age    silent   bucket    suggested move
a3f9...c2   7m12s  6m44s    ORANGE    wait 90s, then take over
b1e2...d8   9m31s  9m08s    RED       killed, resume in main: see stalled-agents/b1e2.md
c8a4...f1   2m12s  18s      GREEN     healthy, leave alone
\`\`\`

## Failure modes
- Registry file missing — agent telemetry was never wired. Bootstrap by writing a stub registry and tell the operator to add the PostToolUse hook.
- Two ticks fire concurrently — file lock contention. Use \`flock -n\` on the registry, second tick exits silent.
- Agent is "silent" but actually streaming a long tool result (e.g. WebFetch of a slow page) — heuristic risk. Check the agent's last tool_use_id; if it's a known slow tool (WebFetch, large Bash), extend the ORANGE threshold to 12 minutes.
- Kill command requires Anthropic SDK abort which isn't always exposed — fall back to letting the parent timeout naturally, but flip the registry status so the operator stops waiting.
`;

export const SKILL_RIGOR_ENFORCER = `---
name: rigor-enforcer-gate
description: Pre-ship voice gate for a chapter MDX file. Rejects on banned words (amazing, incredible, powerful, leverage, unlock, game-changer), sentences over 24 words, claims with no number nearby, or no "failure receipt" section. Returns pass/fail with line numbers. Use when the user says "check this chapter", "voice gate", "rigor check", or when the pre-commit hook fires on a chapter MDX file.
allowed-tools: [Bash, Read]
---

# rigor-enforcer-gate

## When to fire
- Pre-commit hook on any \`src/content/chapters/*.mdx\` change.
- Manual: "check this chapter", "voice gate", "rigor check".
- Pre-build: gate the Astro build if any chapter fails.

## What to do
1. Read the chapter MDX file. Strip frontmatter and code blocks before analysis.
2. Banned-word scan — case-insensitive grep for the locked list. Report each hit with line number and surrounding 8 words.
3. Sentence-length scan — tokenize on \`.\`, \`?\`, \`!\` outside of code; flag any over 24 words. Report with line number.
4. Claim-without-number scan — flag any sentence with words "most", "many", "few", "majority", "typical" that has no digit in the same paragraph.
5. Failure receipt scan — chapter must contain at least one section header matching \`/what broke|failure|incident|autopsy|post-?mortem/i\`. Missing = fail.
6. Compute score: 100 minus 5 per banned hit minus 3 per long sentence minus 4 per numberless claim minus 20 if failure receipt missing.

## Output format
\`\`\`
chapter: 18-headless-ci.mdx
score: 87 / 100      verdict: PASS (>= 85)

issues:
  L42 banned word "powerful" — "...gives you a powerful way to..."
  L88 long sentence (31 words) — "When you set this up the first time..."
  L104 numberless claim "most teams" — no digit in paragraph

failure receipt: present (L156, "the incident channel that taught us")
\`\`\`

verdict thresholds: PASS >= 85, REVISE 70–84, REJECT <70.

## Failure modes
- MDX has unbalanced fences — strip-code-block step fails. Report \`parse_error: line N\` and skip rather than crash; the operator fixes the fence and re-runs.
- Banned-word hit is inside a quoted user testimonial — that's allowed, but the parser can't tell. Allow override via \`<!-- rigor: allow-quote -->\` comment on the surrounding line.
- Chapter is intentionally short (a glossary entry, a one-screen aside) — gate the long-sentence check on word count > 300, otherwise pass.
- Hook fires on every save and gets annoying — debounce 5 seconds, only run on actual MDX save not WIP draft.
`;

export const SKILL_BILLING_ALERT = `---
name: billing-alert-template
description: When daily Anthropic API spend exceeds \$80 (configurable), surface the three highest-leverage cost-reduction moves: audit cache hit rate, audit headless cron call volume, identify skills with no smoke-test cap. Use when the cron tick fires at 22:00 ET, or when the user says "billing alert", "spend check", "what is burning money".
allowed-tools: [Bash, Read, WebFetch, mcp__claude_ai_Slack__slack_send_message]
---

# billing-alert-template

## When to fire
- Scheduled: 22:00 ET daily.
- Manual: "billing alert", "spend check", "what is burning money".
- Threshold-trigger: if a single hour bills over \$25, fire immediately.

## What to do
1. Pull today's spend from the Anthropic console API (or scrape the usage CSV export if no API key is available).
2. Compare to the rolling 7-day median for this day-of-week.
3. If spend > \$80 OR > 2.5x the 7-day median, compose alert.
4. Pull the top 5 prompts by token count today — same console endpoint.
5. For each top prompt, compute the cache hit rate (cache_read / total_input). Flag any below 60% — cache likely not wired.
6. Pull headless cron call counts — flag any cron that ran more than 24x today (likely a retry-loop).
7. Pull the skill registry — flag any skill that fired more than 50x with no per-skill smoke-test cap.
8. Slack the operator with the three flagged items as concrete moves.

## Output format
Slack DM to the operator:

\`\`\`
billing alert — \$186.42 today (4.1x median)

three moves to check first:
1. cron \`competitive-intel-scan\` fired 47x (expected: 4). check retry-loop.
2. skill \`friday-wrapup\` ran 12x with cache hit rate 8% — cache key not wired.
3. headless prompt \`pr-digest\` has no smoke-test cap — add max_tokens 4000.

full breakdown: ~/.claude/health/billing-2026-05-09.json
\`\`\`

## Failure modes
- Anthropic API for billing data is rate-limited / not available — fall back to the manual CSV export hourly, accept up to 60min staleness.
- Cron call count comes from the cron's own log file, not the API — if the log is missing (rotated, deleted), say \`cron_data: unavailable, check console manually\`.
- The "skill fired N times" counter depends on the agent registry from \`sub-agent-watchdog\` — if that's not wired, skip step 7 and note it in the alert.
- Threshold is wrong for the operator's spend baseline — read \`~/.claude/health/billing-thresholds.json\` for per-operator overrides, default \$80 if missing.
`;

// Eight new operator prompts — extend the existing 15.

export const PROMPT_CFO_DEFENSE = `You're a CFO who has approved AI budgets at three growth-stage companies. Read the objection:
[paste the finance-team pushback — Slack message, email, or board comment].

Context: [headcount before AI, headcount after, role types eliminated/avoided, current AI bill, prior labor cost for the same output].

Output a 600-word memo, paste-ready, structured as:
1. The objection restated in CFO terms (1 paragraph).
2. The labor-line math. Concrete: "we ran 5 SDRs at \$89K fully loaded; we now run 3 + Claude at \$4K/mo = \$267K saved annually, 11x ROI on the AI line."
3. The risk the CFO is actually worried about (lock-in, audit trail, vendor concentration) and the one-line mitigation per risk.
4. The line item that makes the spend boring — which existing budget category it slots into so it stops being "AI" and starts being "tooling" or "G&A automation."

No hype. No "AI revolution." Treat it as a vendor-consolidation memo. End with the single number that closes the conversation.
`;

export const PROMPT_DOC_CORRUPTION_EVAL = `Read two files: the known-good snapshot at [path-A] and the current state at [path-B]. Both are the same document, edited N times in between.

Run a content checksum eval:
1. Section-by-section delta — for each H2 heading, report % of sentences that changed, % that were added, % that were deleted.
2. Flag any section where total drift exceeds 5%. List the section heading and the diff summary in <2 lines.
3. Detect structural corruption: orphaned headings, broken internal links, code blocks that no longer parse, frontmatter that no longer validates.
4. Identify any factual claim that was correct in A and is now hedged, softened, or removed in B (sycophancy drift).

Output: a 3-column table — section / drift % / verdict (clean / inspect / revert). End with one line: "ship" or "revert to snapshot."
`;

export const PROMPT_SKILL_SMOKE_EVAL = `Read this SKILL.md: [paste full file].

Generate a 3-line smoke eval that lives at tests/<skill-name>.smoke.md. Structure:

1. Happy path: one trigger phrase a user would naturally type. Expected: skill fires, produces output matching the SKILL.md output contract. Pass criteria: 1 line.
2. Edge case: a phrasing that's adjacent but should still fire — different wording, same intent. Pass criteria: 1 line.
3. Negative case: a phrasing that looks similar but should NOT fire (skill stays dormant or routes elsewhere). Pass criteria: 1 line.

Format the output as a markdown file ready to drop into tests/. Each test gets: trigger / expected behavior / pass-fail check. Total file under 25 lines. No preamble, no rationale — just the eval.
`;

export const PROMPT_TUESDAY_BRIEF = `It's Tuesday 06:30. Generate my operator brief.

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
*Revenue delta:* WoW \$, % change.

No greeting. No "good morning." Slack-ready, paste straight into #operator.
`;

export const PROMPT_CONVENTIONAL_COMMITS = `Read the staged diff: [paste \`git diff --cached\` output] and the proposed commit message: [paste].

Step 1: classify the diff. Single-concern (one feature, one bug, one refactor) or mixed-concern (multiple unrelated changes)?

If single-concern, output a properly-shaped conventional-commits message:
- type: feat / fix / chore / docs / refactor / test / perf / build / ci
- optional scope in parens
- subject line under 72 chars, imperative mood, lowercase, no period
- body explaining "why," not "what" — assume the diff speaks for itself
- footer with BREAKING CHANGE or Co-Authored-By only if relevant

If mixed-concern, output a 2-commit split: which files go in commit A (with its conventional message), which files go in commit B (with its conventional message), and the \`git restore --staged <file>\` commands to actually do the split.

Output: the message OR the split. Nothing else. No explanation, no "here's why."
`;

export const PROMPT_SHOULD_BUILD = `Feature idea: [paste 1-3 sentences].

Run the five-question filter. Be ruthless. One line per answer.

1. What breaks if we don't ship this in the next 90 days? (Revenue? Churn? Hire-blocker? "Nothing" is a valid answer and usually the right one.)
2. Who specifically asked for it? Name them. If the answer is "customers in general" or "the team," that's not an answer — it's a vibe.
3. What's the cheapest way to disconfirm demand before we build? Landing page, fake door, manual concierge, paid pilot. Pick one and say what "disconfirmed" looks like.
4. Can we buy it for under \$200/mo instead of building it? Name the tool. If nothing exists, why not?
5. Does shipping this teach us a moat we don't already have? Distribution, data, network effect, brand — which one, specifically?

Output one of three verdicts: SHIP (with the smallest viable scope in one line), KILL (with the one-line reason), or DISCONFIRM-FIRST (with the specific test to run in <2 weeks and the kill threshold).

No "it depends." No "maybe." Pick one.
`;

export const PROMPT_WEEK_DISTILL = `Read the last 7 days:
- Slack messages across all channels I'm in (just the ones I sent + ones @mentioning me).
- Commit history across [repo list].
- Stripe revenue delta + AI bill delta (Anthropic, OpenAI, any model API).
- Calendar — what actually happened vs. what was booked.

Output exactly 4 bullets, Notion-ready, vault-pasteable:

- *Shipped:* the single thing that moved a metric. Cite the metric and the delta. Not "we worked on X" — "X went from A to B."
- *Stalled:* the single thing that should have shipped and didn't. One sentence on why. No excuses.
- *Bill spiked:* the cost line that grew >20% WoW. Name it, name the \$, name the cause. If nothing spiked, write "flat" and move on.
- *Defend next week:* the single thing I need to protect calendar / energy / attention for. One line.

No preamble. No "this week was great." Four bullets, paste-ready.
`;

export const PROMPT_TRUTH_EXTRACT = `Read this Fathom transcript: [paste full transcript or Fathom recording link].

Strip the diplomacy. Output exactly three lines, no preamble, no caveats:

1. The actual objection. Not the version they said out loud — the one underneath. Cite the timestamp + quote that gave it away.
2. The actual ask. What do they need from us that they didn't have the language to ask for directly? One line.
3. The actual blocker. The reason this deal/relationship/expansion isn't moving — internal politics, budget freeze, competitor lock-in, champion leaving. One line, with the evidence quote.

No "they seemed interested." No "good rapport." No "follow up next quarter." If you can't extract the truth from the transcript, say "transcript is too polite to read — get them on a second call with [specific question]."

Three lines. Then quit.
`;

export const GITHUB_PR_DIGEST_ACTION = `name: Daily PR Digest
on:
  schedule:
    - cron: '0 14 * * 1-5'   # 9 AM ET, weekdays
jobs:
  digest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g @anthropic-ai/claude-code
      - env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          claude --print "Summarize PRs merged in the last 24h. \\
          Group by repo area. Output as Slack-mrkdwn." \\
          --allowed-tools "Bash(gh*),Read,Grep" > digest.md
      - run: |
          curl -s -X POST -H 'Content-type: application/json' \\
            --data "{\\"text\\": \\"$(cat digest.md)\\"}" \\
            \${{ secrets.SLACK_WEBHOOK }}
`;
