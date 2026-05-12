// Six drop-in SKILL.md files. Operators paste any one into
// ~/.claude/skills/<name>/SKILL.md and it fires on day one.
//
// Voice rules locked in notes/edition-2/BRIEF.md.

export type StarterSkill = {
  name: string;
  oneLiner: string;
  cadence: string;            // "daily 7:30 AM", "on demand", etc
  chapters: { slug: string; ref: string }[];
  trigger: string;            // example natural-language phrase
  output: string;             // expected deliverable
  skillMd: string;            // full SKILL.md contents
};

export const STARTER_SKILLS: StarterSkill[] = [
  {
    name: 'morning-briefing',
    oneLiner: 'The 6:30 AM Slack canvas you actually run.',
    cadence: 'Daily 7:30 AM weekdays (scheduled task)',
    chapters: [
      { slug: '07-cron', ref: 'Ch 7' },
      { slug: '11-build-a-skill', ref: 'Ch 11' },
      { slug: '12-connectors-mcp', ref: 'Ch 12' },
    ],
    trigger: '"morning briefing", "what\'s on my plate today", scheduled fire',
    output: 'Slack DM titled "Morning Brief — {date}" with calendar, overnight signals, pipeline motion, #1 priority.',
    skillMd: `---
name: morning-briefing
description: |
  Generate the daily morning briefing — pulls calendar for today, overnight
  Slack DMs and channel mentions, HubSpot deal stage changes since 5 PM
  yesterday. Posts a Slack canvas with four sections: today's calendar,
  overnight signals, pipeline motion, #1 priority. Use when user says
  "morning briefing", "daily brief", "what's on my plate today", or when the
  scheduled task fires at 7:30 AM ET weekdays. Do NOT use for end-of-day
  sync (use end-of-day-sync skill) or for weekly wrap-up (use friday-wrapup).
---

# Morning Briefing

## When to use
- User says "morning briefing", "daily brief", "what's on my plate today"
- Scheduled task fires at 7:30 AM ET weekdays
- Surface: Cowork or Claude Code; cadence: daily

## What to do
1. Pull calendar events for today via the calendar MCP
2. Read overnight Slack DMs and channel mentions (Slack MCP)
3. Pull HubSpot deal stage changes since 5 PM yesterday (HubSpot MCP)
4. Identify the single #1 priority — what would hurt most if it slipped today
5. Post the rendered canvas to #morning-briefing in Slack

## Output format
- Slack canvas titled "Morning Brief — {{ date }}"
- Four sections: Today's calendar · Overnight signals · Pipeline motion · #1 priority for today
- Max 250 words across the whole canvas
- No emoji unless the user already uses them in #morning-briefing

## Anti-patterns
- Don't post if there's nothing useful to say (silent skip)
- Don't include LinkedIn notifications (noise)
- Don't speculate on deal status — only confirmed stage changes
- Don't summarize meetings I haven't attended yet
- Don't open with "Good morning!" — get to the signal
`,
  },

  {
    name: 'friday-wrapup',
    oneLiner: 'Saturday-morning canvas that closes the week.',
    cadence: 'Friday 4 PM (scheduled task)',
    chapters: [
      { slug: '07-cron', ref: 'Ch 7' },
      { slug: '05-skills', ref: 'Ch 5' },
      { slug: '24-tier-list', ref: 'Ch 24' },
    ],
    trigger: '"friday wrap", "how did the week go", scheduled Friday 4 PM fire',
    output: 'Slack canvas with the week\'s pipeline, revenue, SEO, leadership signal, Monday priorities.',
    skillMd: `---
name: friday-wrapup
description: |
  Friday-evening weekly reflection. Pulls HubSpot pipeline deltas, Stripe
  revenue motion, Ahrefs keyword movement, leadership Slack signal, and
  calendar archaeology of the week. Synthesizes into a Slack canvas with
  five sections: Pipeline · Revenue · SEO · Leadership signal · Monday
  priorities. Use when user says "friday wrap", "how did the week go",
  "weekly memo", or scheduled task fires Friday 4 PM. Do NOT include the
  morning briefing's daily-shape sections (those belong in morning-briefing).
---

# Friday Wrap-Up

## When to use
- User says "friday wrap", "how did the week go", "weekly wrapup"
- Scheduled task fires Friday 4 PM
- Surface: Cowork (uses connector layer); cadence: weekly

## What to do
1. Pull HubSpot pipeline deltas this week (HubSpot MCP)
2. Read Stripe revenue motion this week vs last week (Stripe MCP)
3. Read Ahrefs movement on tracked keywords if applicable
4. Pull leadership channel Slack signal — what got decided
5. Cross-reference the calendar for meetings that mattered
6. Identify three Monday priorities ranked by which one hurts most if it slips
7. Post the canvas to the leadership channel

## Output format
- Slack canvas titled "Friday Wrap — {{ date }}"
- Five sections: Pipeline · Revenue · SEO · Leadership signal · Monday priorities
- 600-800 words total
- Each section has receipts (real numbers), not vibes

## Anti-patterns
- Don't guess at numbers. Pull or skip.
- Don't include LinkedIn notifications
- Silent skip if no real motion to report — silence is a feature
- Don't write "this week was challenging" — say what specifically broke
`,
  },

  {
    name: 'deal-postmortem',
    oneLiner: 'The "we lost X" template — no empathy, just signal.',
    cadence: 'On demand, fires within 24h of a deal closing lost',
    chapters: [
      { slug: '11-build-a-skill', ref: 'Ch 11' },
      { slug: '28-failure-receipts', ref: 'Ch 28' },
    ],
    trigger: '"deal post-mortem", "we lost X", "deal autopsy"',
    output: '~250 words: the moment the deal died, what we said vs what they said, what diverged, would the same prospect close next quarter?',
    skillMd: `---
name: deal-postmortem
description: |
  Sales post-mortem for a deal that went dark or closed lost. Reads HubSpot
  stage history, last 5 emails, Gong transcripts of the last 2 calls.
  Outputs: the single moment the deal was actually dead, what was said vs
  what they were actually telling us, two patterns that match deals that
  closed, one that diverged, and a verdict on whether the same prospect
  closes if we run them again next quarter. Use when user says "deal
  post-mortem", "we lost X", "deal autopsy". Do NOT run on deals <$10K —
  prep cost outweighs the lesson.
---

# Deal Post-Mortem

## When to use
- User says "deal post-mortem", "we lost X", "deal autopsy"
- Fires within 24h of a deal stage-change to "Closed Lost" or going dark >2 weeks
- Deal value ≥ $10K (skip below)

## What to do
1. Read HubSpot stage history for this deal — every transition + when
2. Pull last 5 emails from the deal owner side
3. Pull Gong transcripts of the last 2 calls — annotate the moment quote-by-quote
4. Cross-reference with last 5 closed-won deals at this stage for pattern match

## Output format
~250 words, structured:
1. The single moment we should have detected the deal was dead. Which call, which line, which signal? Quote it.
2. What we said vs what they were actually telling us. Two columns, three rows.
3. Two patterns this deal had in common with deals that closed.
4. The one pattern that diverged.
5. One sentence: would the same prospect close if we ran the deal again next quarter?

## Anti-patterns
- No empathy. No "they weren't ready." If they ghosted us, we missed something.
- Don't blame the prospect. Blame the playbook.
- Don't open with "this deal was challenging."
- Don't suggest re-engaging at the end — that's a different skill.
`,
  },

  {
    name: 'weekly-newsletter-draft',
    oneLiner: 'Substack draft in your voice, not LinkedIn-thinkfluencer mush.',
    cadence: 'On demand, typically Sunday evening or Tuesday morning',
    chapters: [
      { slug: '05-skills', ref: 'Ch 5' },
      { slug: '17-tips-tricks', ref: 'Ch 17' },
    ],
    trigger: '"newsletter draft", "substack draft", paste of rough scratch',
    output: 'A draft with opening hook (concrete moment), three-act argument, anti-takeaway closer. ~1500-2000 words.',
    skillMd: `---
name: weekly-newsletter-draft
description: |
  Voice and structure for the operator newsletter. Drafts come out in
  punchy operator voice: lowercase tendencies, em-dashes, comma splices
  intentional, one operator-grade number per claim. Three-act argument
  shape (incident → mechanism → operator move). Anti-takeaway closer.
  Use when user says "newsletter draft", "substack draft", or pastes a
  rough scratch from the week. Do NOT use for LinkedIn posts (different
  format) or for tweets (use a separate skill).
---

# Weekly Newsletter Draft

## When to use
- User says "newsletter draft", "substack draft", "weekly post"
- Pastes a rough scratch / Apple Note from earlier in the week
- Surface: Cowork or Claude Code (both fine)

## What to do
1. Read the scratch / topic seed
2. Read the most recent 3-5 published essays from vladsnewsletter.com (RSS or vault)
3. Identify the load-bearing concept this essay will land
4. Find the time-stamped scene that opens it (a Tuesday morning, a 2 AM moment, a specific deal call)
5. Draft to ~1500-2000 words

## Output structure
- **Opening:** concrete moment, time-stamped, specific people redacted
- **Paragraph 2:** the reframe — name the load-bearing concept once
- **Act 1: incident.** What happened, with receipts.
- **Act 2: mechanism.** Why it worked / failed. The system underneath.
- **Act 3: operator move.** What the reader should do Monday morning.
- **Closer:** anti-takeaway. One line that lands without a list.

## Voice rules (LOCKED)
- Lowercase tendencies welcome
- Em-dashes — yes
- Comma splices intentional
- One operator-grade number per claim ("3-10B tokens", "$4,200 in 11 minutes")
- No "in conclusion", no "to summarize", no "five lessons learned"
- No "I'm thrilled to share" / "I'm excited to" / "honored to"
- Cut adverbs. Cut "really". Cut "very". Cut "literally".

## Anti-patterns
- Don't open with a definition ("Today we're talking about X")
- Don't end with bullets
- Don't sanitize the punch lines into clauses
- Don't add "key takeaways" — the closer is the takeaway
`,
  },

  {
    name: 'kill-decision',
    oneLiner: '60-day "should we shut this down" rubric.',
    cadence: 'On demand, typically quarterly review',
    chapters: [
      { slug: '24-tier-list', ref: 'Ch 24' },
      { slug: '28-failure-receipts', ref: 'Ch 28' },
    ],
    trigger: '"kill decision", "should we kill X", "is X working"',
    output: '~300 words: steelman both sides, the single metric that ends it, cost of running 60 more days, verdict.',
    skillMd: `---
name: kill-decision
description: |
  Decision framework for a project, hire, or product line that's been
  mediocre for 3+ months and you keep telling yourself "next quarter."
  Steelmans both "this is working" and "this is dead" sides, names the
  single metric that ends it in 60 days, costs running 60 more days vs
  shutting now, delivers a one-sentence verdict. Use when user says "kill
  decision", "should we kill X", "is X working". Do NOT run on things <30
  days old — founders kill too early on instinct then regret.
---

# Kill Decision

## When to use
- User says "kill decision", "should we kill X", "is X working"
- Project / hire / product / feature has existed ≥30 days
- Recent metrics are mediocre but not catastrophic

## What to do
1. Read the original goal (one line — what was this supposed to do)
2. Read the last 3 monthly snapshots of the metrics that matter
3. Read the project's Slack channel — find the moments where it almost worked
4. Read any internal reviews / external signals (customer feedback, churn, social)
5. Cross-reference with similar projects at similar age that succeeded vs failed

## Output format
~300 words, structured:
1. **The version of "this is working" that's true.** Steelman.
2. **The version of "this is dead" that's true.** Steelman harder.
3. **The single metric that, if it doesn't move in 60 days, ends it.** Number + threshold.
4. **The cost of running it 60 more days vs shutting now.** Cash + opportunity cost.
5. **The verdict in one sentence.** Not "it depends."

## Anti-patterns
- Don't run on things <30 days old
- Don't say "it depends" — pick a side
- Don't suggest "rebrand and try again" without a specific change
- Don't soften the verdict with "but I could be wrong"
- The metric must be measurable in 60 days — not "user love"
`,
  },

  {
    name: 'process-miner',
    oneLiner: "Scans your connected tools for repeating work you should automate next.",
    cadence: 'Scheduled Monday 9 AM (or on demand)',
    chapters: [
      { slug: '05-skills', ref: 'Ch 5' },
      { slug: '07-cron', ref: 'Ch 7' },
      { slug: '11-build-a-skill', ref: 'Ch 11' },
      { slug: '12-connectors-mcp', ref: 'Ch 12' },
    ],
    trigger: '"what should I automate", "find me skills to build", "process mine my week"',
    output: '3-5 candidate skills ranked by leverage. Each: trigger phrase, time saved per week, SKILL.md scaffold ready to commit.',
    skillMd: `---
name: process-miner
description: |
  Scans the last 7 days of activity across all connected MCPs (Slack,
  HubSpot, Stripe, calendar, Gmail, GitHub) plus the local skill output
  channels. Surfaces repeating workflows that should be automated or
  scheduled. Outputs 3-5 candidate skills ranked by leverage, each with a
  ready-to-commit SKILL.md scaffold. Use when scheduled (Monday 9 AM) or
  when user says "what should I automate", "find me skills to build",
  "process mine my week". Do NOT propose skills for one-off work (the
  threshold is 3+ repetitions in 7 days).
---

# Process Miner

## When to use
- Scheduled Monday 9 AM (recommended cadence)
- User says "what should I automate", "find me skills to build", "process mine my week"
- After any sprint or focus week where workflows likely repeated

## What to do
1. Pull last 7 days of message volume from each connected MCP — count messages, draft retries, repeated phrasings
2. Read Slack DMs the user sent — flag any message drafted 3+ times in different threads
3. Read calendar — find any meeting type that recurs ≥2x/week with similar prep needs
4. Read recent Gong/Fireflies transcripts — find any question the user answered 3+ times to different prospects
5. Cross-reference with the user's existing skills folder (~/.claude/skills/) — don't recommend something they already built
6. Rank candidates by leverage: (time saved per fire) × (frequency per week) × (operator-grade fit)

## Output format
3-5 candidates, each:

\`\`\`
### Candidate N — <kebab-case-name>
- **Trigger:** the natural-language phrase the user already says
- **Frequency:** how many times this fired in the last 7 days
- **Time saved per fire:** realistic estimate in minutes
- **Annual leverage:** rough hours saved per year
- **SKILL.md scaffold:** [paste a starter skeleton — name, description, what-to-do, output, anti-patterns]
\`\`\`

End with a one-sentence verdict: which candidate to ship first.

## Anti-patterns
- Don't propose skills for one-off work (threshold: 3+ reps in 7 days)
- Don't suggest a skill that overlaps with an existing one in the user's folder
- Don't surface "you should do morning briefings" if morning-briefing already exists
- Don't pad the list to 5 if only 2 are real
- Don't recommend skills that need access the user hasn't granted (no Salesforce skill if no Salesforce MCP wired)
`,
  },
];
