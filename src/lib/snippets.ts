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
