import { useState } from 'react';

type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

type Connector = {
  name: string;
  tier: Tier;
  category: string;
  blurb: string;
  installHint?: string;
};

const CONNECTORS: Connector[] = [
  // Productivity & storage
  { name: 'Filesystem', tier: 'S', category: 'Productivity & storage', blurb: "Your AI agent's hands. Without it, none of the rest matters.", installHint: 'npx -y @modelcontextprotocol/server-filesystem /path' },
  { name: 'Google Drive', tier: 'A', category: 'Productivity & storage', blurb: 'Files, docs, the substrate of work. Read-only first.' },
  { name: 'Notion', tier: 'A', category: 'Productivity & storage', blurb: 'Read access at minimum for teams that live in Notion.' },
  { name: 'Box', tier: 'D', category: 'Productivity & storage', blurb: 'Fine if your team already lives there. Drive eats their lunch.' },
  { name: 'Dropbox', tier: 'D', category: 'Productivity & storage', blurb: "Don't migrate to it in 2026." },
  // Comms
  { name: 'Slack', tier: 'S', category: 'Communication', blurb: 'Read it programmatically; don\'t read it manually.' },
  { name: 'Gmail', tier: 'A', category: 'Communication', blurb: 'Inbox = highest-ROI connector after filesystem. Read-only.' },
  { name: 'Outlook / MS 365', tier: 'A', category: 'Communication', blurb: 'Same role as Gmail for Microsoft shops.' },
  { name: 'Discord', tier: 'D', category: 'Communication', blurb: 'Read-only is fine; write violates ToS in many cases.' },
  // CRM
  { name: 'HubSpot', tier: 'A', category: 'Sales & CRM', blurb: 'Pipeline source of truth. No autoclose without human-in-the-loop.' },
  { name: 'Salesforce', tier: 'C', category: 'Sales & CRM', blurb: 'Use HubSpot if you have a choice. Heavier auth dance.' },
  { name: 'Close / Pipedrive', tier: 'A', category: 'Sales & CRM', blurb: 'Lighter SaaS CRMs. Same role.' },
  // Billing
  { name: 'Stripe', tier: 'A', category: 'Billing & finance', blurb: 'Your money is signal. MRR motion, dispute trends.' },
  { name: 'Ramp', tier: 'B', category: 'Billing & finance', blurb: 'Spend insight + categorization without dashboard hopping.' },
  { name: 'QuickBooks', tier: 'B', category: 'Billing & finance', blurb: 'Books inside the agent for finance ops.' },
  // Engineering
  { name: 'GitHub', tier: 'S', category: 'Engineering', blurb: 'Every operator should have this on every repo. Free. Essential.' },
  { name: 'Linear / Jira', tier: 'B', category: 'Engineering', blurb: 'Connect when you have an ops-on-engineering use case.' },
  { name: 'Sentry', tier: 'B', category: 'Engineering', blurb: 'Production reality. Errors, stack traces, regression context.' },
  { name: 'Vercel', tier: 'B', category: 'Engineering', blurb: 'Deploys, build logs, runtime errors.' },
  { name: 'Cloudflare', tier: 'B', category: 'Engineering', blurb: 'Edge logs, KV, DNS.' },
  // Data & analytics
  { name: 'Postgres / Supabase', tier: 'A', category: 'Data & analytics', blurb: 'Agent that can write SQL is a different animal.' },
  { name: 'BigQuery / Snowflake', tier: 'A', category: 'Data & analytics', blurb: 'Warehouse-scale; same shape, more compute.' },
  { name: 'PostHog / Amplitude / Mixpanel', tier: 'C', category: 'Data & analytics', blurb: 'Pick one. Three is noise.' },
  { name: 'Ahrefs', tier: 'B', category: 'Data & analytics', blurb: 'Keyword data on demand inside your normal workflow.' },
  { name: 'GSC', tier: 'B', category: 'Data & analytics', blurb: 'Real Google search data, free.' },
  // Marketing
  { name: 'Customer.io', tier: 'B', category: 'Marketing', blurb: 'Pulling segments and campaign analytics through Claude saves hours.' },
  { name: 'Klaviyo', tier: 'B', category: 'Marketing', blurb: 'Same role for ecom-native stacks.' },
  // Voice
  { name: 'ElevenLabs', tier: 'A', category: 'Voice & AV', blurb: 'Output voice. No second place.' },
  { name: 'Whisper', tier: 'B', category: 'Voice & AV', blurb: 'Voice-to-text. Solid. Mostly invisible.' },
  // Browser
  { name: 'Playwright / Puppeteer', tier: 'B', category: 'Browser & web', blurb: 'Let the agent click buttons. Lock it down.' },
  // Knowledge
  { name: 'Confluence / Guru', tier: 'B', category: 'Vault & knowledge', blurb: 'Internal SOPs, playbooks, legal templates.' },
  { name: 'Obsidian (community)', tier: 'A', category: 'Vault & knowledge', blurb: "Your second brain. Where AI memory actually lives." },
  // Calendar
  { name: 'Google Calendar', tier: 'A', category: 'Calendar', blurb: 'Half the questions you ask need calendar context.' },
  { name: 'Calendly', tier: 'B', category: 'Calendar', blurb: 'Booked-meeting metadata for prep workflows.' },
  // Meetings
  { name: 'Fireflies', tier: 'B', category: 'Meeting transcripts', blurb: 'Pick ONE transcriber, not three.' },
  { name: 'Granola', tier: 'B', category: 'Meeting transcripts', blurb: 'Sleek alternative; same role.' },
  { name: 'Gong', tier: 'B', category: 'Meeting transcripts', blurb: 'Read-only is the safe default.' },
  // Risky
  { name: 'Self-built (intern code)', tier: 'F', category: 'Risk', blurb: 'Same energy as a SQL injection vector. Get senior review.' },
  { name: 'Community MCP, no maintainer', tier: 'E', category: 'Risk', blurb: 'Supply-chain risk. Read the source. Don\'t install like a Chrome extension.' },
];

const CATEGORIES = Array.from(new Set(CONNECTORS.map((c) => c.category)));
const TIER_COLORS: Record<Tier, string> = {
  S: '#FF6B2C', A: '#FF8E54', B: '#FFB48C', C: '#8C897C', D: '#56544B', E: '#3A3933', F: '#26251F',
};
const TIER_FG: Record<Tier, string> = {
  S: 'white', A: 'white', B: '#0E0F11', C: 'white', D: 'white', E: 'white', F: 'white',
};

export default function ConnectorMap() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory ? CONNECTORS.filter((c) => c.category === activeCategory) : CONNECTORS;

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider flex flex-wrap items-center gap-2 justify-between" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          <span>Connector taxonomy</span>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setActiveCategory(null)} type="button" className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: !activeCategory ? 'rgb(var(--accent))' : 'transparent', color: !activeCategory ? 'white' : 'rgb(var(--fg) / 0.85)', border: '1px solid ' + (!activeCategory ? 'rgb(var(--accent))' : 'rgb(var(--line))') }}>All</button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} type="button" className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: activeCategory === cat ? 'rgb(var(--accent))' : 'transparent', color: activeCategory === cat ? 'white' : 'rgb(var(--fg) / 0.85)', border: '1px solid ' + (activeCategory === cat ? 'rgb(var(--accent))' : 'rgb(var(--line))') }}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="p-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.name} className="rounded-md p-3" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="font-medium text-sm">{c.name}</div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: TIER_COLORS[c.tier], color: TIER_FG[c.tier] }}>{c.tier}</span>
              </div>
              <div className="text-xs leading-relaxed" style={{ color: 'rgb(var(--muted))' }}>{c.blurb}</div>
              <div className="mt-1.5 text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>{c.category}</div>
              {c.installHint && (
                <pre className="mt-2 p-2 text-[11px] font-mono rounded overflow-x-auto" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--accent))' }}><code>{c.installHint}</code></pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
