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
