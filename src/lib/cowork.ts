// Cowork stack — publicly safe summary derived from the published book content
// (chapters 7, 12, 24). No local data was scanned. No workspace names, contact
// names, or account IDs appear here.

export type CoworkConnector = {
  category: string;
  services: { name: string; tier: 'S' | 'A' | 'B'; mode: 'read' | 'read-write'; note?: string }[];
};

export const COWORK_CONNECTORS: CoworkConnector[] = [
  {
    category: 'Filesystem & storage',
    services: [
      { name: 'Filesystem', tier: 'S', mode: 'read-write', note: "The agent's hands. Without it, none of the rest matters." },
      { name: 'Google Drive', tier: 'A', mode: 'read', note: 'Read-only first; expand only when the workflow needs write.' },
    ],
  },
  {
    category: 'Communication',
    services: [
      { name: 'Slack', tier: 'S', mode: 'read-write', note: 'Read everything; writes go through a confirmation step.' },
      { name: 'Gmail / Outlook', tier: 'A', mode: 'read', note: 'Inbox = highest-ROI connector after filesystem.' },
    ],
  },
  {
    category: 'Sales & CRM',
    services: [
      { name: 'HubSpot', tier: 'A', mode: 'read-write', note: 'No autoclose without human-in-the-loop.' },
    ],
  },
  {
    category: 'Billing & finance',
    services: [
      { name: 'Stripe', tier: 'A', mode: 'read', note: 'MRR motion, dispute trends. Read-only.' },
    ],
  },
  {
    category: 'Engineering',
    services: [
      { name: 'GitHub', tier: 'S', mode: 'read-write' },
      { name: 'Vercel', tier: 'B', mode: 'read', note: 'Build logs, deploys, runtime errors.' },
      { name: 'Sentry', tier: 'B', mode: 'read', note: 'Errors, stack traces, regression context.' },
    ],
  },
  {
    category: 'Data & analytics',
    services: [
      { name: 'Postgres / Supabase', tier: 'A', mode: 'read', note: 'Warehouse-shape SQL on demand.' },
      { name: 'Ahrefs', tier: 'B', mode: 'read', note: 'Keyword + backlink data inline.' },
      { name: 'Google Search Console', tier: 'B', mode: 'read' },
    ],
  },
  {
    category: 'Marketing',
    services: [
      { name: 'Customer.io', tier: 'B', mode: 'read', note: 'Pulling segments + campaign analytics through Claude.' },
      { name: 'Klaviyo', tier: 'B', mode: 'read' },
    ],
  },
  {
    category: 'Voice & AV',
    services: [
      { name: 'ElevenLabs', tier: 'A', mode: 'read-write', note: 'Output voice — no second place.' },
      { name: 'Whisper', tier: 'B', mode: 'read', note: 'Voice-to-text. Solid. Mostly invisible.' },
    ],
  },
  {
    category: 'Calendar',
    services: [
      { name: 'Google Calendar', tier: 'A', mode: 'read', note: 'Half the questions need calendar context.' },
    ],
  },
  {
    category: 'Meeting transcripts',
    services: [
      { name: 'Fireflies', tier: 'B', mode: 'read', note: 'Pick ONE transcriber, not three.' },
      { name: 'Granola', tier: 'B', mode: 'read' },
      { name: 'Gong', tier: 'B', mode: 'read' },
    ],
  },
  {
    category: 'Knowledge & vault',
    services: [
      { name: 'Notion', tier: 'A', mode: 'read', note: 'Read-only at minimum for teams that live in Notion.' },
      { name: 'Obsidian (community connector)', tier: 'A', mode: 'read-write', note: "Where the second brain lives." },
    ],
  },
  {
    category: 'Browser & web',
    services: [
      { name: 'Playwright', tier: 'B', mode: 'read-write', note: 'Lock down the agent\'s allowlist tightly.' },
    ],
  },
];

// Scheduled-task patterns. From Ch 7 — types of work, never with channel names
// or recipient names, just cadence + job shape.
export type CoworkSchedule = {
  cron: string;
  cronHuman: string;
  task: string;
  description: string;
  delivery: string;
  category: 'briefing' | 'sync' | 'alert' | 'wrap' | 'meta' | 'meeting';
};

export const COWORK_SCHEDULES: CoworkSchedule[] = [
  {
    cron: '30 7 * * 1-5',
    cronHuman: 'Daily 7:30 AM weekdays',
    task: 'Morning briefing',
    description: 'Calendar, overnight Slack, portfolio metrics. Lands as a Slack DM by the time the coffee is poured.',
    delivery: 'Slack DM',
    category: 'briefing',
  },
  {
    cron: '0 9 * * 1-5',
    cronHuman: 'Daily 9 AM weekdays',
    task: 'Sales pipeline ticker',
    description: 'Overnight HubSpot motion + recent call notes — what advanced, what stalled, what went dark.',
    delivery: 'Slack DM',
    category: 'briefing',
  },
  {
    cron: '0 17 * * 1-5',
    cronHuman: 'Daily 5 PM ET weekdays',
    task: 'Deal-advancement alerts',
    description: 'Stage changes since 5 PM yesterday. One paragraph each, "why this matters."',
    delivery: 'Slack DM + leadership canvas',
    category: 'alert',
  },
  {
    cron: '0 19 * * *',
    cronHuman: 'Daily 7 PM',
    task: 'Vault sync',
    description: "Reads what shipped today, writes back to the vault so tomorrow's instance starts smarter.",
    delivery: 'Vault file',
    category: 'sync',
  },
  {
    cron: '0 16 * * 5',
    cronHuman: 'Friday 4 PM',
    task: 'Friday wrap-up',
    description: 'Cross-system synthesis — pipeline, revenue, SEO, leadership signal, Monday priorities.',
    delivery: 'Slack canvas',
    category: 'wrap',
  },
  {
    cron: '0 9 * * 1',
    cronHuman: 'Monday 9 AM',
    task: 'Process-mining scan',
    description: "Looks at last week's activity for repeating workflows that should become skills.",
    delivery: 'Vault file + Slack summary',
    category: 'meta',
  },
  {
    cron: '0 * * * *',
    cronHuman: 'Hourly',
    task: 'Sentry watcher',
    description: 'Codex-style — opens auto-PRs for non-trivial bugs. Reviewed like junior-engineer work.',
    delivery: 'GitHub PRs + Slack #ops',
    category: 'alert',
  },
  {
    cron: 'event',
    cronHuman: '30 min before each meeting',
    task: 'Pre-meeting prep',
    description: 'Attendees, last interaction, open threads, suggested agenda. Walk into every call already loaded.',
    delivery: 'Slack DM + vault file',
    category: 'meeting',
  },
];

// Cowork "day shape" — when each task fires, narrative.
export type CoworkDaySlot = { time: string; what: string; output: string };

export const COWORK_DAY: CoworkDaySlot[] = [
  { time: '6:30 AM',  what: 'Morning briefing fires', output: 'Slack DM lands while coffee brews' },
  { time: '7:30 AM',  what: 'Pipeline ticker',         output: 'What moved overnight in the funnel' },
  { time: '8:00 AM',  what: 'Read briefing on phone',  output: 'Decisions for the day, before tabs open' },
  { time: '~30 min before',  what: 'Pre-meeting prep auto-runs', output: 'Attendee context, open threads, agenda' },
  { time: '5:00 PM ET',  what: 'Deal-advancement alerts', output: 'Slack canvas to leadership channel' },
  { time: '7:00 PM',  what: 'End-of-day vault sync', output: "Tomorrow's instance starts smart" },
  { time: 'Friday 4 PM', what: 'Friday wrap-up cross-system synthesis', output: 'Saturday-morning canvas' },
  { time: 'Monday 9 AM', what: 'Process-mining scan', output: 'Candidate skills for next week' },
];

// Stats — derived from the structure above. Numbers are summary counts only.
export const COWORK_STATS = {
  connectorCategories: COWORK_CONNECTORS.length,
  servicesWired: COWORK_CONNECTORS.reduce((s, c) => s + c.services.length, 0),
  scheduledTasks: COWORK_SCHEDULES.length,
  daySlots: COWORK_DAY.length,
} as const;
