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
    id: 'shutdown',
    title: 'Set safety boundaries before connecting anything',
    estimate: '8 min',
    body: "Start with the security chapter. Use a disposable project and synthetic data, keep permission prompts enabled, and leave production credentials out. Review scopes before granting access and set a budget for metered usage. A deny rule or temporary folder is not a complete security boundary.",
    cta: { label: 'See Ch 9 — don\'t get owned', href: '/chapters/09-dont-get-owned/' },
  },
  {
    id: 'claude-pro',
    title: 'Confirm Claude Code access',
    estimate: '2 min',
    body: "Use an eligible Claude subscription, an organization-provided account, or approved metered API access. Check current plan limits and billing before choosing; the installation itself does not include usage.",
    cta: { label: 'claude.ai/pricing', href: 'https://claude.ai/pricing', external: true },
  },
  {
    id: 'install-cc',
    title: 'Install Claude Code',
    estimate: '5 min',
    body: "Use the official native installer in Ch 13; it needs no Node.js runtime. Confirm with `claude --version` and `claude doctor`, then sign in. The optional npm route requires Node.js 22+. Follow your organization's installation policy.",
    cta: { label: 'See Ch 13 — the 10-minute quickstart', href: '/chapters/13-quickstart/' },
  },
  {
    id: 'first-prompt',
    title: 'Get a read-only project summary',
    estimate: '3 min',
    body: "Inside the disposable project, ask Claude Code to summarize its files and identify one unanswered question. Request no edits, shell execution, or external connections. Check the summary against the files before granting more access.",
    link: { label: 'See Ch 13 — the quickstart', href: '/chapters/13-quickstart/' },
  },
  {
    id: 'github',
    title: 'GitHub account (optional later)',
    estimate: '2 min',
    body: "Create an account when you need a remote repository. A local read-only task does not require GitHub or a push. Use a test repository for the first publishing workflow.",
    cta: { label: 'github.com/signup', href: 'https://github.com/signup', external: true },
  },
  {
    id: 'vercel',
    title: 'Hosting account (optional later)',
    estimate: '3 min',
    body: "Add hosting when you have something to deploy. Vercel Hobby is for personal, non-commercial use; check the plan and limits for business work. Hosting is not required for your first local task.",
    cta: { label: 'Vercel Hobby plan terms', href: 'https://vercel.com/docs/plans/hobby', external: true },
  },
  {
    id: 'install-cowork',
    title: 'Cowork and one connector (optional later)',
    estimate: '4 min',
    body: "Add the desktop workflow only when you need it. Start with one approved read-only connector and a test account. Review its scopes and data destination before connecting; do not connect customer systems just to complete this checklist.",
    cta: { label: 'See Ch 8 — three doors to Claude', href: '/chapters/08-three-doors/' },
  },
  {
    id: 'install-obsidian',
    title: 'Obsidian vault (optional later)',
    estimate: '6 min',
    body: "Start with local Markdown and synthetic notes. Add 00-Inbox, 01-Daily, 02-Projects, 03-People, and 04-Companies as needed. Review data-handling rules before syncing work or customer information to another service.",
    cta: { label: 'obsidian.md', href: 'https://obsidian.md', external: true },
    link: { label: 'See Ch 4 — the vault', href: '/chapters/04-the-vault/' },
  },
  {
    id: 'claude-md',
    title: 'Drop a CLAUDE.md at your repo root',
    estimate: '5 min',
    body: "Record the project's purpose, current task, commands, and approval boundaries. Keep secrets and customer records out. Review generated instructions before relying on them; a CLAUDE.md is context, not an access-control mechanism.",
    cta: { label: 'Copy the skeleton from /resources', href: '/resources/' },
  },
  {
    id: 'first-skill',
    title: 'Build a skill (optional later)',
    estimate: '15 min',
    body: "Pick a workflow you've explained to Claude three times. Codify it. Drop the SKILL.md into ~/.claude/skills/. Test by typing the natural-language trigger phrase.",
    cta: { label: 'See Ch 11 — build a skill end-to-end', href: '/chapters/11-build-a-skill/' },
  },
  {
    id: 'first-cron',
    title: 'Schedule one task (optional later)',
    estimate: '10 min',
    body: "Schedule only after a manual run and failure-case tests pass. Set an explicit timezone, source window, budget, owner, and failure notification. Validate the exact output before delivery; start with a test destination and a way to stop the schedule.",
    cta: { label: 'See Ch 7 — cron jobs', href: '/chapters/07-cron/' },
  },
  {
    id: 'first-swarm',
    title: 'Try a bounded swarm (optional later)',
    estimate: '5 min',
    body: "Try a small read-only investigation in the disposable project. Define distinct questions, cap agent count and spend, and review the combined answer yourself. Parallel work is optional, not a prerequisite for a useful result.",
    cta: { label: 'See Ch 6 — the swarm', href: '/chapters/06-the-swarm/' },
  },
];

const STORAGE_KEY = 'cc-dayzero-steps';

function restoreDone(raw: string | null): Record<string, boolean> {
  try {
    const value: unknown = raw === null ? null : JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const restored: Record<string, boolean> = {};
    for (const { id } of STEPS) {
      const entry = Object.getOwnPropertyDescriptor(value, id);
      if (entry && typeof entry.value === 'boolean') restored[id] = entry.value;
    }
    return restored;
  } catch {
    return {};
  }
}

export default function DayZeroChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setDone(restoreDone(localStorage.getItem(STORAGE_KEY)));
    } catch {} finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch {}
  }, [done, hydrated]);

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
