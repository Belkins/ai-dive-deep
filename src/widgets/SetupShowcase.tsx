import { useMemo, useState } from 'react';
import { SKILLS, AGENTS, PLUGINS } from '@/lib/setup';

type Tab = 'skills' | 'agents' | 'plugins';

const SKILL_CATS: { key: string; label: string; tagline: string }[] = [
  { key: 'ops',       label: 'Daily ops',          tagline: 'Standups, vault hygiene, the morning + Friday loops.' },
  { key: 'review',    label: 'Code review + QA',   tagline: 'Audits, security passes, bug hunts, debugging.' },
  { key: 'build',     label: 'Build + ship',       tagline: 'Scaffolding, deploys, env flips, framework-specific muscle.' },
  { key: 'strategy',  label: 'Strategy + research',tagline: 'Office hours, competitor intel, ultra-plans, monetization.' },
  { key: 'portfolio', label: 'Portfolio-specific', tagline: "Belkins/Folderly/LinguaLive — Vlad's actual book of business." },
  { key: 'meta',      label: 'Meta',               tagline: 'Skills that build other skills, verify other agents, etc.' },
];

const PLUGIN_CATS: Record<string, string> = {
  workflow: 'Workflow',
  design: 'Design',
  review: 'Review',
  docs: 'Docs',
  platform: 'Platform',
  build: 'Build',
};

export default function SetupShowcase() {
  const [tab, setTab] = useState<Tab>('skills');
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');

  const items = tab === 'skills' ? SKILLS : tab === 'agents' ? AGENTS : PLUGINS;
  const cats = tab === 'skills' ? SKILL_CATS.map((c) => c.key) : tab === 'plugins' ? Object.keys(PLUGIN_CATS) : [];

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return items.filter((it: any) => {
      if (activeCat !== 'all' && (it.category ?? '') !== activeCat) return false;
      if (!needle) return true;
      const hay = (it.name + ' ' + (it.description ?? '') + ' ' + (it.source ?? '')).toLowerCase();
      return hay.includes(needle);
    });
  }, [items, search, activeCat]);

  const skillCount = SKILLS.length;
  const agentCount = AGENTS.length;
  const pluginCount = PLUGINS.length;

  return (
    <div className="container-wide" style={{ marginTop: '1.5rem', marginBottom: '4rem' }}>
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Tab active={tab === 'skills'}  onClick={() => { setTab('skills');  setActiveCat('all'); }} label={`Skills · ${skillCount}`} />
        <Tab active={tab === 'agents'}  onClick={() => { setTab('agents');  setActiveCat('all'); }} label={`Agents · ${agentCount}`} />
        <Tab active={tab === 'plugins'} onClick={() => { setTab('plugins'); setActiveCat('all'); }} label={`Plugins · ${pluginCount}`} />
      </div>

      {/* Filter row */}
      <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${tab}…`}
            className="flex-1 px-3 py-2 rounded-md text-sm"
            style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}
          />
          {cats.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button type="button" onClick={() => setActiveCat('all')} className="text-[11px] px-2 py-1 rounded-md" style={{ background: activeCat === 'all' ? 'rgb(var(--accent))' : 'transparent', color: activeCat === 'all' ? 'white' : 'rgb(var(--fg) / 0.85)', border: '1px solid ' + (activeCat === 'all' ? 'rgb(var(--accent))' : 'rgb(var(--line))') }}>All</button>
              {cats.map((c) => {
                const count = items.filter((it: any) => it.category === c).length;
                if (count === 0) return null;
                const label = tab === 'skills' ? (SKILL_CATS.find((s) => s.key === c)?.label ?? c) : (PLUGIN_CATS[c] ?? c);
                return (
                  <button key={c} type="button" onClick={() => setActiveCat(c)} className="text-[11px] px-2 py-1 rounded-md" style={{ background: activeCat === c ? 'rgb(var(--accent))' : 'transparent', color: activeCat === c ? 'white' : 'rgb(var(--fg) / 0.85)', border: '1px solid ' + (activeCat === c ? 'rgb(var(--accent))' : 'rgb(var(--line))') }}>
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      {tab === 'skills' && activeCat === 'all' ? (
        // Group by category when "all" selected
        <div className="space-y-8">
          {SKILL_CATS.map((cat) => {
            const catItems = SKILLS.filter((s) => s.category === cat.key && (
              !search.trim() || (s.name + ' ' + s.description).toLowerCase().includes(search.trim().toLowerCase())
            ));
            if (catItems.length === 0) return null;
            return (
              <div key={cat.key}>
                <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: '1px solid rgb(var(--line))' }}>
                  <div>
                    <h3 className="m-0 font-display text-2xl">{cat.label}</h3>
                    <p className="text-sm m-0 mt-1" style={{ color: 'rgb(var(--muted))' }}>{cat.tagline}</p>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'rgb(var(--muted))' }}>{catItems.length}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {catItems.map((s) => <SkillCard key={s.name} skill={s} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-sm" style={{ color: 'rgb(var(--muted))' }}>
              No matches.
            </div>
          )}
          {tab === 'skills' && filtered.map((s: any) => <SkillCard key={s.name} skill={s} />)}
          {tab === 'agents' && filtered.map((a: any) => <AgentCard key={a.name} agent={a} />)}
          {tab === 'plugins' && filtered.map((p: any) => <PluginCard key={p.name} plugin={p} />)}
        </div>
      )}
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-medium px-3 py-2 rounded-md transition-colors"
      style={{
        background: active ? 'rgb(var(--accent))' : 'rgb(var(--paper))',
        color: active ? 'white' : 'rgb(var(--fg))',
        border: '1px solid ' + (active ? 'rgb(var(--accent))' : 'rgb(var(--line))'),
      }}
    >
      {label}
    </button>
  );
}

function SkillCard({ skill }: { skill: { name: string; description: string; category: string } }) {
  return (
    <div className="rounded-md p-3 h-full" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <code className="font-mono text-sm" style={{ color: 'rgb(var(--accent))' }}>{skill.name}</code>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>{skill.category}</span>
      </div>
      <p className="text-xs leading-relaxed m-0" style={{ color: 'rgb(var(--fg) / 0.85)' }}>
        {skill.description || <em style={{ color: 'rgb(var(--muted))' }}>No description in frontmatter.</em>}
      </p>
    </div>
  );
}

function AgentCard({ agent }: { agent: { name: string; description: string } }) {
  return (
    <div className="rounded-md p-3 h-full" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <code className="font-mono text-sm" style={{ color: 'rgb(var(--accent-2))' }}>{agent.name}</code>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>agent</span>
      </div>
      <p className="text-xs leading-relaxed m-0" style={{ color: 'rgb(var(--fg) / 0.85)' }}>{agent.description}</p>
    </div>
  );
}

function PluginCard({ plugin }: { plugin: { name: string; source: string; category: string } }) {
  return (
    <div className="rounded-md p-3 h-full" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <code className="font-mono text-sm" style={{ color: 'rgb(var(--accent))' }}>{plugin.name}</code>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>{plugin.category}</span>
      </div>
      <div className="text-xs font-mono" style={{ color: 'rgb(var(--muted))' }}>@{plugin.source}</div>
    </div>
  );
}
