import { useEffect, useState } from 'react';

type Job = 'research' | 'sales' | 'ops' | 'custom';
type Tech = 'no-code' | 'some-code' | 'full-eng';
type Budget = 'tiny' | 'real' | 'enterprise';

const STORAGE_KEY = 'cc-archetype-pick';

export default function ArchetypePicker() {
  const [job, setJob] = useState<Job>('sales');
  const [tech, setTech] = useState<Tech>('some-code');
  const [budget, setBudget] = useState<Budget>('real');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v.job) setJob(v.job);
        if (v.tech) setTech(v.tech);
        if (v.budget) setBudget(v.budget);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ job, tech, budget })); } catch {}
  }, [job, tech, budget]);

  const rec = recommend(job, tech, budget);

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          Pick your archetype
        </div>

        <div className="px-5 py-5 grid gap-5 md:grid-cols-2">
          <Q label="What's the job?">
            <C active={job === 'research'} onClick={() => setJob('research')} label="Research" hint="Compete intel, deal due-diligence, market scans" />
            <C active={job === 'sales'} onClick={() => setJob('sales')} label="Sales / outreach" hint="Lead enrichment, drafting, follow-ups, qualification" />
            <C active={job === 'ops'} onClick={() => setJob('ops')} label="Ops / messaging" hint="Slack triage, ticketing, escalation, summaries" />
            <C active={job === 'custom'} onClick={() => setJob('custom')} label="Custom / weird" hint="Doesn't fit any preset" />
          </Q>

          <Q label="Team's tech depth?">
            <C active={tech === 'no-code'} onClick={() => setTech('no-code')} label="No-code" hint="Operators, no engineers" />
            <C active={tech === 'some-code'} onClick={() => setTech('some-code')} label="Some-code" hint="Comfortable with terminals, light scripts" />
            <C active={tech === 'full-eng'} onClick={() => setTech('full-eng')} label="Full eng" hint="Repo, CI, infra, all of it" />
          </Q>

          <Q label="Monthly budget?">
            <C active={budget === 'tiny'} onClick={() => setBudget('tiny')} label="$0–200" hint="Side project / personal" />
            <C active={budget === 'real'} onClick={() => setBudget('real')} label="$200–2K" hint="Small team / one team's tooling" />
            <C active={budget === 'enterprise'} onClick={() => setBudget('enterprise')} label="$2K+" hint="Department-wide / production" />
          </Q>

          <div className="rounded-lg p-4 flex flex-col" style={{ background: 'rgb(var(--bg))', border: '1px solid', borderColor: rec.color }}>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>Recommendation</div>
            <div className="font-display text-xl mb-1" style={{ color: rec.color }}>{rec.archetype}</div>
            <div className="text-sm leading-relaxed mb-2" style={{ color: 'rgb(var(--fg) / 0.85)' }}>{rec.why}</div>
            <div className="text-xs mb-2" style={{ color: 'rgb(var(--muted))' }}>
              <span className="font-mono">{rec.costBand}</span>
            </div>
            {rec.install && (
              <code className="text-xs font-mono p-2 rounded mb-2" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--accent))' }}>
                {rec.install}
              </code>
            )}
            <div className="text-xs leading-snug" style={{ color: 'rgb(var(--accent))' }}>
              <span style={{ fontWeight: 600 }}>Anti-pattern:</span> {rec.antiPattern}
            </div>
            {rec.link && (
              <a href={rec.link} target="_blank" rel="noopener" className="mt-2 text-xs" style={{ color: 'rgb(var(--accent))', textDecoration: 'underline' }}>
                {rec.linkLabel} →
              </a>
            )}
          </div>
        </div>

        <div className="px-5 pb-4 text-xs leading-relaxed" style={{ color: 'rgb(var(--muted))' }}>
          Verify exact pricing on <a href="https://meetrick.ai/pricing" target="_blank" rel="noopener">meetrick.ai/pricing</a>. Cost bands here are realistic shapes, not quotes.
        </div>
      </div>
    </div>
  );
}

function Q({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium mb-2">{label}</div>
      <div className="grid gap-1.5">{children}</div>
    </div>
  );
}

function C({ label, hint, active, onClick }: { label: string; hint: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-md px-3 py-2 transition"
      style={{
        background: active ? 'rgb(var(--accent) / 0.12)' : 'rgb(var(--bg))',
        border: '1px solid ' + (active ? 'rgb(var(--accent))' : 'rgb(var(--line))'),
      }}
    >
      <div className="text-sm font-medium" style={{ color: active ? 'rgb(var(--accent))' : 'rgb(var(--fg))' }}>{label}</div>
      <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--muted))' }}>{hint}</div>
    </button>
  );
}

type Rec = {
  archetype: string;
  color: string;
  why: string;
  costBand: string;
  install?: string;
  antiPattern: string;
  link?: string;
  linkLabel?: string;
};

function recommend(job: Job, tech: Tech, budget: Budget): Rec {
  // If you're full-eng with real budget AND a custom job, skip Rick presets
  if (tech === 'full-eng' && (job === 'custom' || budget === 'enterprise')) {
    return {
      archetype: 'Skip Rick — write a Claude Code subagent',
      color: '#FF6B2C',
      why: "You have the muscle to maintain it, the budget to absorb tokens, and the workflow doesn't fit a preset. Drop a `.md` into `~/.claude/agents/` and own the thing.",
      costBand: '$200–800/mo in tokens depending on volume',
      antiPattern: "Don't pay for Rick's UI when you'll never use it.",
      link: '/chapters/16-hooks-subagents',
      linkLabel: 'See Ch 16',
    };
  }

  if (job === 'sales') {
    return {
      archetype: 'NemoClaw',
      color: '#FF6B2C',
      why: "Sales/outreach archetype. Lead enrichment, draft sequences, qualification. Talks to your CRM. Day-3 SDRs stop asking how to prompt it.",
      costBand: budget === 'tiny' ? '~$50–150/mo seat' : budget === 'real' ? '~$300–1,200/mo for a small team' : '$2K+/mo team plan',
      install: 'meetrick.ai/install → pick NemoClaw',
      antiPattern: "Don't auto-send. Human-in-the-loop for first 2 weeks until you trust it.",
      link: 'https://meetrick.ai/install',
      linkLabel: 'meetrick.ai/install',
    };
  }

  if (job === 'research') {
    return {
      archetype: 'OpenClaw',
      color: '#FF8E54',
      why: "Research archetype. Compete intel, deal due-diligence, market scans. Long-form synthesis from messy inputs.",
      costBand: budget === 'tiny' ? '~$30–100/mo seat' : '~$200–800/mo for a research team',
      install: 'meetrick.ai/install → pick OpenClaw',
      antiPattern: "Don't use it for time-sensitive trading signals. It's a research deepener, not a market-data feed.",
      link: 'https://meetrick.ai/install',
      linkLabel: 'meetrick.ai/install',
    };
  }

  if (job === 'ops') {
    return {
      archetype: 'Hermes',
      color: '#FFB48C',
      why: "Ops/messaging archetype. Slack triage, ticket routing, escalation, status summaries. The agent that answers \"who needs me first.\"",
      costBand: budget === 'tiny' ? '~$50/mo seat' : '~$250–1,000/mo for an ops team',
      install: 'meetrick.ai/install → pick Hermes',
      antiPattern: "Don't let it auto-resolve customer-facing tickets. Triage and route. Humans close.",
      link: 'https://meetrick.ai/install',
      linkLabel: 'meetrick.ai/install',
    };
  }

  // job === 'custom'
  if (tech === 'no-code') {
    return {
      archetype: 'Start with the closest preset',
      color: '#22D3A0',
      why: "Pick the archetype closest to your workflow (NemoClaw if it touches deals, Hermes if messaging, OpenClaw if research). Bend the preset, don't write your own yet.",
      costBand: 'Same as the picked preset',
      install: 'meetrick.ai/install',
      antiPattern: "Don't build a custom agent without a senior engineer. The preset bends further than you'd think.",
      link: 'https://meetrick.ai/install',
      linkLabel: 'meetrick.ai/install',
    };
  }

  return {
    archetype: 'Custom Claude Code subagent',
    color: '#FF6B2C',
    why: "Your workflow doesn't fit a preset and you have the muscle to write the agent yourself. Drop a `.md` into `~/.claude/agents/`.",
    costBand: '$50–500/mo in tokens depending on volume',
    antiPattern: "Don't ship without an eval. Custom agents fail silently. See Ch 25.",
    link: '/chapters/25-evals-or-hope',
    linkLabel: 'See Ch 25 (Evals)',
  };
}
