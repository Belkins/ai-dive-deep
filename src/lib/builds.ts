// Eight Saturday-ship recipes, synthesized from three perspectival agents:
// - A: wide ideation (Gemini-shaped) — 15 candidates, killed 3, doubled-down on 3
// - B: PRD shaping (Claude-shaped) — 8 fully-shaped recipes
// - C: adversarial critic (GPT-thinking-shaped) — 7-criterion rubric, 8 picks,
//      5 kills, 1 trap pick, 1 contrarian push
//
// Final 8: where all three converged + the contrarian "auto-changelog" pick
// + the trap-pick warning visible to the reader.

export type WeekendBuild = {
  rank: number;
  name: string;
  problem: string;           // one-sentence time-stamped scene
  whoFor: string;
  time: string;              // hands-on hours
  tokenCost: string;         // realistic per-month band
  prereqs: string[];
  chapters: { slug: string; ref: string }[];
  shape: string[];           // 3-5 steps
  shipGate: string;          // when you stop polishing
  antiPattern: string;
  earnsItsSlotBy: string;    // when it stops being a demo and becomes infra
};

export const WEEKEND_BUILDS: WeekendBuild[] = [
  {
    rank: 1,
    name: 'Stripe Pulse',
    problem: "You don't know your MRR right now without opening Stripe and a spreadsheet. By the time you've answered, the question that mattered has moved on.",
    whoFor: 'SaaS founder, $5K-$500K MRR, board calls or investor pings weekly.',
    time: '2-3 hours hands-on.',
    tokenCost: '~$2-4/mo (one cron fire/day, Sonnet, small context).',
    prereqs: ['Cowork + Stripe MCP', 'Telegram or Slack DM target'],
    chapters: [
      { slug: '07-cron', ref: 'Ch 7' },
      { slug: '12-connectors-mcp', ref: 'Ch 12' },
    ],
    shape: [
      'Daily 7:00 AM cron pulls last 24h of Stripe — charges, new subs, churn, failed payments.',
      'Skill computes MRR delta, surfaces the 3 biggest events.',
      "Output one line: 'MRR $43,218 (+$420). 2 new, 1 churn ($89). Net new $331.' Posted to Telegram or Slack DM.",
      'You read it with coffee. No dashboard.',
    ],
    shipGate: "Three mornings in a row you read MRR on your phone before opening any app.",
    antiPattern: "Don't add charts. Numbers as text are the win — the smaller the artifact, the more it survives.",
    earnsItsSlotBy: 'Day 3.',
  },
  {
    rank: 2,
    name: 'Pre-meeting prep, auto-generated',
    problem: "It's 2:55 PM, your 3 PM is with a customer you last spoke to in February, and you can't remember if the open thread was the renewal pricing or the integration ask. You're going to wing it.",
    whoFor: 'Founder or AE with 5+ external meetings/week.',
    time: '3-4 hours hands-on.',
    tokenCost: '~$3-7/mo — fires only on external meetings (~5-10/week).',
    prereqs: ['Google Calendar MCP', 'Gmail MCP', 'HubSpot or Notion MCP', 'External-attendee filter rule'],
    chapters: [
      { slug: '07-cron', ref: 'Ch 7' },
      { slug: '12-connectors-mcp', ref: 'Ch 12' },
      { slug: '05-skills', ref: 'Ch 5' },
    ],
    shape: [
      'Event-triggered cron — fires 15 min before any calendar event with an external attendee.',
      'Skill pulls last 90 days of email threads with that attendee + their CRM record + linked deals.',
      'Output: 200-word brief — Who they are / Last interaction / Open thread / What they probably want today. Slack DM with calendar link.',
      'Read it on the way to the call. If wrong, edit the rules — not the output.',
    ],
    shipGate: 'Five external meetings in a row where you did not open HubSpot before the call.',
    antiPattern: "Don't generate \"talking points\" — those make you sound like you're reading off a card. Generate context only. You decide what to say.",
    earnsItsSlotBy: 'Week 1.',
  },
  {
    rank: 3,
    name: 'Mentee pre-call prep',
    problem: "It's Tuesday 12:45 PM, the mentee call is at 1, and you're scrambling through three vault notes trying to remember what they committed to two weeks ago and what they're avoiding.",
    whoFor: 'Anyone running paid 1-on-1s — mentor, coach, advisor.',
    time: '4-5 hours hands-on (most of it encoding your prep heuristics).',
    tokenCost: '~$2-5/mo per mentee.',
    prereqs: ['Cowork', 'Vault read access (Obsidian / Notion / markdown)', 'Google Calendar MCP for trigger'],
    chapters: [
      { slug: '05-skills', ref: 'Ch 5' },
      { slug: '04-the-vault', ref: 'Ch 4' },
      { slug: '07-cron', ref: 'Ch 7' },
    ],
    shape: [
      'Write the spec as a 4-question checklist — what did they commit to / what did they avoid / one red flag from last session / one win to acknowledge.',
      'Event-triggered cron — 30 min before any calendar event matching *Mentoring*.',
      'Output to a single dated Slack DM with a vault path link to the full session prep doc.',
      'After the call, a separate skill appends outcome notes to the action tracker. Do not bundle.',
    ],
    shipGate: "You walk into Tuesday's call without opening the vault, and the four questions are answered.",
    antiPattern: "Don't summarize the whole session history — the red flag and the one win are what you need. Burying them in 800 words is the same as not having them.",
    earnsItsSlotBy: 'After the first session that goes better because of it.',
  },
  {
    rank: 4,
    name: 'Inbox triage — Tuesday-9-AM only',
    problem: "It's Tuesday 8:50 AM, inbox has 247 unread, you know 230 are noise, but you can't trust yourself to skim fast enough to find the 17 that need a reply today.",
    whoFor: 'Operator with 100+ emails/day and a "I respond on Tue + Thu" rhythm.',
    time: '4-6 hours hands-on.',
    tokenCost: '~$5-10/mo — once-per-day burst, Sonnet.',
    prereqs: ['Gmail MCP', 'A 4-tier labels doc (P1 client-blocking → P4 newsletter/noise)', 'List of always-P1 senders'],
    chapters: [
      { slug: '07-cron', ref: 'Ch 7' },
      { slug: '12-connectors-mcp', ref: 'Ch 12' },
      { slug: '34-write-on-behalf', ref: 'Ch 34' },
    ],
    shape: [
      'Tuesday 9 AM cron pulls everything since Friday 5 PM that is not already labeled.',
      'Skill labels each thread P1-P4 against the rules doc.',
      "Drafts a one-line reply for P1 only. Output: Slack message with counts (\"47 P3s archived, 12 P2s waiting, 6 P1s drafted\") + links to the drafts.",
      'You review drafts, send the right ones, rewrite the rest. Never auto-send.',
    ],
    shipGate: 'Three Tuesdays in a row you cleared P1 inbox in under 20 minutes.',
    antiPattern: "Don't auto-send P1 drafts even when they're good. The moment one goes out with the wrong tone, the whole system loses your trust and gets archived.",
    earnsItsSlotBy: 'Tuesday 3.',
  },
  {
    rank: 5,
    name: 'Auto-changelog from git log',
    problem: "It's Friday 4 PM. Your investor letter, your team update, your marketing changelog, and your LinkedIn velocity post — all need to know what shipped this week. You haven't kept track since Monday.",
    whoFor: "Solo dev or small team where the operator wears the 'what did we ship' hat.",
    time: '90 minutes hands-on.',
    tokenCost: '~$1-2/mo. Sonnet on a once-per-week 4k-token job.',
    prereqs: ['GitHub MCP or local git access', 'Vault file or repo path for the rolling changelog'],
    chapters: [
      { slug: '18-headless-ci', ref: 'Ch 18' },
      { slug: '07-cron', ref: 'Ch 7' },
      { slug: '11-build-a-skill', ref: 'Ch 11' },
    ],
    shape: [
      'Friday 4 PM cron runs git log since last entry across the repos that matter.',
      'Skill groups commits by area (features / fixes / infra), writes 3-5 plain-English lines per group.',
      'Append to a single rolling CHANGELOG.md. No marketing flavor at this stage — boring is the feature.',
      'You skim it Friday night, copy whatever bits you need into the investor letter, team update, LinkedIn post, or your changelog page.',
    ],
    shipGate: "Three Fridays in a row you didn't ask anyone 'wait, what did we ship this week?'",
    antiPattern: "Don't let the prompt add marketing flavor. Keep it boring. You add flavor downstream per artifact. Boring builds compound.",
    earnsItsSlotBy: "Week 4 — when the rolling changelog has enough mass to feed four downstream artifacts.",
  },
  {
    rank: 6,
    name: 'Newsletter draft assistant (voice-locked)',
    problem: "It's Thursday night, the newsletter ships Friday morning, and you've got three half-formed ideas and a blank Substack editor that's somehow more intimidating than a sales call.",
    whoFor: 'Operator with a newsletter (1k+ subs, weekly cadence). Voice consistency matters more than length.',
    time: '5-7 hours hands-on (voice calibration is most of the work).',
    tokenCost: '~$3-7/mo if you draft 4-5 issues.',
    prereqs: ['10+ past issues in markdown', 'A "never say this" rules note'],
    chapters: [
      { slug: '05-skills', ref: 'Ch 5' },
      { slug: '34-write-on-behalf', ref: 'Ch 34' },
      { slug: '10-wild-stuff', ref: 'Ch 10 (the rigor enforcer)' },
    ],
    shape: [
      'Feed 10 past issues into a calibration prompt — extract openings, rhythm, structural beats. Save as a voice spec.',
      'Skill takes a 1-line idea + 3 bullets of receipts → produces a 600-word draft in the voice spec.',
      'Second pass: rigor enforcer flags hedge words, missing numbers, "in my opinion" phrases. Reject if any flagged.',
      'Open the surviving draft. Rewrite the lede. The lede is always wrong.',
    ],
    shipGate: 'Three drafts in a row where you keep >60% of the agent\'s output. Under that, the voice spec needs work — not the skill.',
    antiPattern: "Don't let it pick the topic. You pick, the agent drafts. Topic selection is taste, not pattern matching.",
    earnsItsSlotBy: "Issue 3 — that's when the voice spec converges.",
  },
  {
    rank: 7,
    name: 'Customer-call synthesis',
    problem: "You had four customer calls this week, recorded them in Fathom / Gong / Fireflies, watched zero replays, and now Monday's product meeting is asking 'what are customers saying about pricing?' and you've got nothing.",
    whoFor: 'Product-led founder or PM running customer dev calls. Patterns across calls are the real signal.',
    time: '4-6 hours hands-on.',
    tokenCost: '~$4-8/mo — transcript token counts are heavy.',
    prereqs: ['Fathom / Gong / Fireflies MCP', 'Theme taxonomy doc — 5-7 named themes you care about'],
    chapters: [
      { slug: '05-skills', ref: 'Ch 5' },
      { slug: '07-cron', ref: 'Ch 7' },
      { slug: '12-connectors-mcp', ref: 'Ch 12' },
    ],
    shape: [
      'Friday 4 PM cron pulls all recordings from the past 7 days where you were on the call.',
      'Skill reads each transcript, tags quotes against the theme taxonomy, weights by recency and customer ARR.',
      'Output: markdown — one section per theme, top 3 quotes per section with timestamps and deep links.',
      'Skim Sunday night. Monday meeting has receipts.',
    ],
    shipGate: "You walk into the product meeting with three exact quotes and timestamps — not 'customers seem frustrated about pricing.'",
    antiPattern: "Don't let it generate 'recommendations.' The agent picks quotes, you pick the strategy. Conflating those two is how roadmaps get hijacked by whoever talked loudest.",
    earnsItsSlotBy: 'Month 2 — by then the corpus has enough mass that patterns are real.',
  },
  {
    rank: 8,
    name: "Investor monthly update — auto-drafter",
    problem: "It's the 28th of the month. The investor email is due tomorrow. You have Stripe open, GitHub open, Linear open, and no draft. You're going to pull an all-nighter that ends with 'thrilled to share' in paragraph one.",
    whoFor: 'Founder with 10+ angels / a fund / a board cadence.',
    time: '4-5 hours hands-on.',
    tokenCost: '~$3-5/mo — runs monthly, Sonnet, ~15k token context.',
    prereqs: ['Stripe MCP', 'GitHub MCP', 'Internal "key wins" doc', 'Voice spec from Build 6 if you already have it'],
    chapters: [
      { slug: '05-skills', ref: 'Ch 5' },
      { slug: '12-connectors-mcp', ref: 'Ch 12' },
      { slug: '34-write-on-behalf', ref: 'Ch 34' },
    ],
    shape: [
      "End-of-month cron pulls Stripe MRR delta, GitHub commits grouped by area, last month's hires/departures, and a paste of the wins doc.",
      'Skill assembles the four canonical sections — Metrics / Shipped / People / Asks. Draft only. Numbers as text.',
      'You read, narrate, edit. The LLM never writes the narrative. It assembles the receipts.',
      'You hit send. The whole thing took 20 minutes, not three hours.',
    ],
    shipGate: 'Two consecutive months where the investor letter took less than 30 minutes from cron to sent.',
    antiPattern: "Don't let the LLM write the narrative arc. It assembles, you narrate. The day the LLM picks the storyline is the day the investors hear a different voice and stop reading.",
    earnsItsSlotBy: 'Month 2 — the cadence is the unlock.',
  },
];

// Read-aloud separately on the page — explicit warnings from the rubric agent.
export const BUILD_WARNINGS = {
  trap: {
    name: 'Persona Slack DM responder with approval gate',
    why: "Looks like the highest-leverage build in the list — the agent answers your DMs, you just hit yes. It's the trap. The failure mode isn't 'the agent wrote something weird.' It's: you approve 47 in a row at 7 AM, the 48th has a confident hallucination about a customer commitment, and now there's a Slack thread where the CEO promised a discount or a refund. Approval gates feel safe until you're tired. Nobody is tired-proof.",
    instead: "Build a DM triager that sorts by urgency and drafts to a private channel only you see. Zero send permission. You manually move the text.",
  },
  contrarian: {
    name: 'Auto-changelog (build #5 above) — most operators will skip this',
    why: "Looks like a Friday afternoon nice-to-have. It's not. The changelog becomes the seed crystal for four downstream artifacts: team update, investor letter, marketing changelog, LinkedIn velocity post. One read-only cron, four downstream uses, zero blast radius, and it gets opened every week for years. Boring builds compound. Build the boring one first.",
    instead: '',
  },
  skipped: [
    {
      name: 'Daily voice brief (MP3 of morning Slack canvas)',
      why: 'Nobody listens to their own brief after week 2. TTS is a demo, not a habit.',
    },
    {
      name: 'Twitter/X listener for brand mentions',
      why: 'API tier shifts twice a year. Alerts become noise within 10 days. Brand24-class tools already do this for less effort.',
    },
    {
      name: 'Competitor pricing-page watcher (browser agent)',
      why: 'Pricing pages change quarterly. The browser agent breaks monthly. Signal is too slow to act on. 2-weekend build at minimum.',
    },
    {
      name: 'Real-time Slack outage detector',
      why: 'Duplicates BetterStack / PagerDuty. Your homebrew detector will miss the one outage that actually matters.',
    },
    {
      name: 'LinkedIn Listener (browser-driven)',
      why: 'Cat-and-mouse compliance war with LinkedIn ToS. Ban risk is non-trivial.',
    },
  ],
};
