import { useEffect, useState } from 'react';

type Step = {
  id: string;
  title: string;
  estimate: string;
  body: string;
  cta?: { label: string; href: string; external?: boolean };
  link?: { label: string; href: string };
};

const STEPS: Step[] = [
  {
    id: 'github',
    title: 'GitHub account',
    estimate: '2 min',
    body: "If you don't have one, get one. Free. The floor of every workflow in this book lives in a repo. The rest of the day-zero setup assumes you can `git push`.",
    cta: { label: 'github.com/signup', href: 'https://github.com/signup', external: true },
  },
  {
    id: 'vercel',
    title: 'Vercel account (linked to GitHub)',
    estimate: '3 min',
    body: "Sign in with GitHub. You'll deploy your first product to Vercel by the end of the week. Free tier covers everything in this book. Netlify works too — pick one and don't argue with yourself.",
    cta: { label: 'vercel.com', href: 'https://vercel.com', external: true },
  },
  {
    id: 'claude-pro',
    title: 'Claude Pro or Max plan',
    estimate: '2 min',
    body: "Cheapest path to Claude Code + Cowork without an API budget. Pro covers the casual operator. Max if you'll burn tokens daily. You can graduate to API keys later.",
    cta: { label: 'claude.ai/pricing', href: 'https://claude.ai/pricing', external: true },
  },
  {
    id: 'install-cc',
    title: 'Install Claude Code',
    estimate: '5 min',
    body: "One npm command, then `claude --version` to confirm. Authenticates against your Pro/Max account on first run.",
    cta: { label: 'See Ch 13 — the 10-minute quickstart', href: '/chapters/13-quickstart' },
  },
  {
    id: 'install-cowork',
    title: 'Install Cowork (desktop app)',
    estimate: '4 min',
    body: "Cowork is the desktop driver for ops work — connectors to Slack, HubSpot, Stripe, your calendar. Install, connect 3 things you already pay for, ask 'what's on my plate today.'",
    cta: { label: 'See Ch 8 — three doors to Claude', href: '/chapters/08-three-doors' },
  },
  {
    id: 'install-obsidian',
    title: 'Install Obsidian + create your vault',
    estimate: '6 min',
    body: "Local-first markdown brain. iCloud or Dropbox sync. Five folders: 00-Inbox, 01-Daily, 02-Projects, 03-People, 04-Companies. Numeric prefixes force ordering.",
    cta: { label: 'obsidian.md', href: 'https://obsidian.md', external: true },
    link: { label: 'See Ch 4 — the vault', href: '/chapters/04-the-vault' },
  },
  {
    id: 'claude-md',
    title: 'Drop a CLAUDE.md at your repo root',
    estimate: '5 min',
    body: "One page. Who you are, what you run, your active projects, your preferences, this week's focus. The handbook every new instance reads on wake-up.",
    cta: { label: 'Copy the skeleton from /resources', href: '/resources' },
  },
  {
    id: 'first-prompt',
    title: 'Run your first real prompt',
    estimate: '3 min',
    body: "In Cowork: \"Read CLAUDE.md and tell me what's on my plate today.\" In Claude Code (inside a repo): /init then ask it to summarize the codebase. If both work, the loop is live.",
    link: { label: 'See Ch 13 — the quickstart', href: '/chapters/13-quickstart' },
  },
  {
    id: 'first-skill',
    title: 'Build your first skill',
    estimate: '15 min',
    body: "Pick a workflow you've explained to Claude three times. Codify it. Drop the SKILL.md into ~/.claude/skills/. Test by typing the natural-language trigger phrase.",
    cta: { label: 'See Ch 11 — build a skill end-to-end', href: '/chapters/11-build-a-skill' },
  },
  {
    id: 'first-cron',
    title: 'Schedule one task',
    estimate: '10 min',
    body: "The morning briefing is the highest-leverage first scheduled task. Slack DM at 7:30 AM with calendar + overnight signals + open deals. Run it for two weeks before adding a second.",
    cta: { label: 'See Ch 7 — cron jobs', href: '/chapters/07-cron' },
  },
  {
    id: 'first-swarm',
    title: 'Spawn your first swarm',
    estimate: '5 min',
    body: "In Claude Code: \"Spawn 3 Explore subagents in parallel — one looks at X, one at Y, one at Z.\" Watch them work concurrently. Single-threaded work feels broken after this.",
    cta: { label: 'See Ch 6 — the swarm', href: '/chapters/06-the-swarm' },
  },
  {
    id: 'shutdown',
    title: 'Read the security chapter before bed',
    estimate: '8 min',
    body: "Don't skip this. The 11-minute leak that cost a friend $4,200 lives in chapter 9. Set spend caps. Rotate keys. Add deny rules for Bash(rm -rf*) and Edit(.env*) tonight.",
    cta: { label: 'See Ch 9 — don\'t get owned', href: '/chapters/09-dont-get-owned' },
  },
];

const STORAGE_KEY = 'cc-dayzero-steps';

export default function DayZeroChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch {}
  }, [done]);

  const toggle = (id: string) => setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  const completed = STEPS.filter((s) => done[s.id]).length;
  const pct = Math.round((completed / STEPS.length) * 100);

  const baseUrl = (import.meta as any).env?.BASE_URL ?? '/';
  const base = baseUrl.replace(/\/$/, '');

  return (
    <div className="container-wide" style={{ marginTop: '1rem', marginBottom: '4rem' }}>
      <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap" style={{ borderBottom: '1px solid rgb(var(--line))' }}>
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>Day-zero progress</div>
            <div className="font-display text-lg">{completed} of {STEPS.length} steps complete</div>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-[200px] max-w-md">
            <div className="flex-1 h-2 rounded-full" style={{ background: 'rgb(var(--bg))' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'rgb(var(--accent))' }} />
            </div>
            <span className="font-mono text-sm" style={{ color: 'rgb(var(--accent))' }}>{pct}%</span>
          </div>
          {completed === STEPS.length && (
            <button type="button" onClick={() => setDone({})} className="text-xs px-2 py-1 rounded-md" style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}>Reset</button>
          )}
        </div>
      </div>

      <ol className="grid gap-3 list-none p-0 m-0">
        {STEPS.map((step, i) => {
          const isDone = !!done[step.id];
          return (
            <li key={step.id} className="m-0">
              <div
                className="rounded-lg p-4 grid grid-cols-[40px_1fr] gap-4"
                style={{
                  background: isDone ? 'rgb(var(--accent-2) / 0.05)' : 'rgb(var(--paper))',
                  border: '1px solid ' + (isDone ? 'rgb(var(--accent-2))' : 'rgb(var(--line))'),
                  opacity: isDone ? 0.85 : 1,
                  transition: 'all 200ms',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(step.id)}
                  aria-label={isDone ? `Mark step ${i + 1} as not done` : `Mark step ${i + 1} as done`}
                  className="rounded-md flex items-center justify-center transition"
                  style={{
                    height: 32, width: 32,
                    background: isDone ? 'rgb(var(--accent-2))' : 'rgb(var(--bg))',
                    border: '2px solid ' + (isDone ? 'rgb(var(--accent-2))' : 'rgb(var(--line))'),
                    color: isDone ? 'white' : 'rgb(var(--muted))',
                  }}
                >
                  {isDone ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5 9-9" /></svg>
                  ) : (
                    <span className="text-xs font-mono">{i + 1}</span>
                  )}
                </button>
                <div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-display text-lg" style={{ textDecoration: isDone ? 'line-through' : 'none' }}>{step.title}</span>
                    <span className="text-xs font-mono" style={{ color: 'rgb(var(--muted))' }}>{step.estimate}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed m-0" style={{ color: 'rgb(var(--fg) / 0.85)' }}>{step.body}</p>
                  <div className="mt-3 flex items-center gap-3 flex-wrap text-xs">
                    {step.cta && (
                      <a
                        href={step.cta.external ? step.cta.href : `${base}${step.cta.href}`}
                        target={step.cta.external ? '_blank' : undefined}
                        rel={step.cta.external ? 'noopener' : undefined}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md no-underline"
                        style={{ background: 'rgb(var(--accent))', color: 'white', textDecoration: 'none' }}
                      >
                        {step.cta.label} →
                      </a>
                    )}
                    {step.link && (
                      <a
                        href={`${base}${step.link.href}`}
                        className="inline-flex items-center gap-1.5"
                        style={{ color: 'rgb(var(--muted))' }}
                      >
                        {step.link.label} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
