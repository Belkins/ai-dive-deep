import { useMemo, useState } from 'react';
import {
  CATEGORIES, MODELS, LAB_META, TIER_COLOR, TIER_DESC,
  SNAPSHOT_DATE, SOURCE_URL, SOURCE_LABEL,
  type Tier, type Category, type Lab,
} from '@/lib/sovereign-stack';

const TIER_ORDER: Tier[] = ['S', 'A', 'B', 'C', 'D'];
const ALL_LABS: Lab[] = ['zai', 'moonshot', 'minimax', 'deepseek', 'stepfun', 'alibaba', 'mimo', 'mistral', 'nvidia', 'openai', 'meta', 'google'];

type SizeFilter = 'all' | 'small' | 'medium' | 'large';

function paramsToB(p: string): number {
  // "744B" -> 744, "1T" -> 1000, "27B" -> 27
  const cleaned = p.trim().toUpperCase();
  if (cleaned.endsWith('T')) return parseFloat(cleaned) * 1000;
  if (cleaned.endsWith('B')) return parseFloat(cleaned);
  return parseFloat(cleaned) || 0;
}

function bucketFor(p: string): 'small' | 'medium' | 'large' {
  const b = paramsToB(p);
  if (b < 50) return 'small';
  if (b < 250) return 'medium';
  return 'large';
}

export default function OnyxLeaderboard() {
  const [activeCat, setActiveCat] = useState<Category>('overall');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [activeLab, setActiveLab] = useState<Lab | null>(null);

  const cat = useMemo(() => CATEGORIES.find((c) => c.id === activeCat)!, [activeCat]);

  // Build tier -> filtered model list.
  const filtered = useMemo(() => {
    const out: Record<Tier, string[]> = { S: [], A: [], B: [], C: [], D: [] };
    for (const tier of TIER_ORDER) {
      for (const name of cat.tiers[tier]) {
        const m = MODELS[name];
        if (!m) continue;
        if (sizeFilter !== 'all' && bucketFor(m.params) !== sizeFilter) continue;
        if (activeLab && m.lab !== activeLab) continue;
        out[tier].push(name);
      }
    }
    return out;
  }, [cat, sizeFilter, activeLab]);

  return (
    <div
      className="rounded-2xl border p-5 md:p-7 my-8"
      style={{
        borderColor: 'rgb(var(--border))',
        background: 'rgb(var(--bg))',
        color: 'rgb(var(--fg))',
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <div className="text-[0.7rem] uppercase tracking-[0.25em]" style={{ color: 'rgb(var(--accent))' }}>
            Best Open-Source Models — 2026 Rankings
          </div>
          <h3 className="m-0 font-display text-2xl md:text-3xl mt-1">Open-source LLM leaderboard</h3>
          <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: 'rgb(var(--muted))' }}>
            S/A/B/C/D ranking across reasoning, coding, math, chat, instruction-following — snapshot from {SOURCE_LABEL}.
            {' '}
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgb(var(--accent))' }}>
              See it live at onyx.app →
            </a>
          </p>
        </div>
        <div className="text-[0.65rem] uppercase tracking-[0.2em] shrink-0" style={{ color: 'rgb(var(--muted))' }}>
          Snapshot · {SNAPSHOT_DATE}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className="px-3 py-1.5 text-sm rounded-md transition-colors"
            style={{
              background: activeCat === c.id ? 'rgb(var(--fg))' : 'transparent',
              color: activeCat === c.id ? 'rgb(var(--bg))' : 'rgb(var(--fg))',
              border: `1px solid ${activeCat === c.id ? 'rgb(var(--fg))' : 'rgb(var(--border))'}`,
              fontWeight: activeCat === c.id ? 600 : 500,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Size + lab filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center text-xs">
        <span className="uppercase tracking-[0.18em]" style={{ color: 'rgb(var(--muted))' }}>Size</span>
        {(['all', 'small', 'medium', 'large'] as SizeFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setSizeFilter(s)}
            className="px-2 py-1 rounded text-[0.72rem] transition-colors"
            style={{
              background: sizeFilter === s ? 'rgba(var(--accent) / 0.15)' : 'transparent',
              color: sizeFilter === s ? 'rgb(var(--accent))' : 'rgb(var(--muted))',
              border: `1px solid ${sizeFilter === s ? 'rgb(var(--accent))' : 'rgb(var(--border))'}`,
            }}
            title={s === 'small' ? '<50B params' : s === 'medium' ? '50–250B params' : s === 'large' ? '>250B params' : 'Any size'}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="ml-2 uppercase tracking-[0.18em]" style={{ color: 'rgb(var(--muted))' }}>Lab</span>
        <button
          onClick={() => setActiveLab(null)}
          className="px-2 py-1 rounded text-[0.72rem] transition-colors"
          style={{
            background: activeLab === null ? 'rgba(var(--accent) / 0.15)' : 'transparent',
            color: activeLab === null ? 'rgb(var(--accent))' : 'rgb(var(--muted))',
            border: `1px solid ${activeLab === null ? 'rgb(var(--accent))' : 'rgb(var(--border))'}`,
          }}
        >
          All
        </button>
        {ALL_LABS.map((l) => (
          <button
            key={l}
            onClick={() => setActiveLab(activeLab === l ? null : l)}
            className="px-2 py-1 rounded text-[0.72rem] transition-colors flex items-center gap-1"
            style={{
              background: activeLab === l ? `${LAB_META[l].color}22` : 'transparent',
              color: activeLab === l ? LAB_META[l].color : 'rgb(var(--muted))',
              border: `1px solid ${activeLab === l ? LAB_META[l].color : 'rgb(var(--border))'}`,
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: LAB_META[l].color }}
            />
            {LAB_META[l].label}
            <span className="opacity-60 text-[0.6rem]">{LAB_META[l].country}</span>
          </button>
        ))}
      </div>

      {/* Category blurb */}
      <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgb(var(--muted))' }}>
        {cat.blurb}
      </p>

      {/* Tier rows */}
      <div className="space-y-2">
        {TIER_ORDER.map((tier) => {
          const models = filtered[tier];
          return (
            <div
              key={tier}
              className="flex items-stretch gap-3 rounded-lg overflow-hidden"
              style={{ background: 'rgba(var(--fg) / 0.03)' }}
            >
              <div
                className="shrink-0 w-14 md:w-16 flex flex-col items-center justify-center font-display text-3xl md:text-4xl font-bold"
                style={{ background: TIER_COLOR[tier], color: '#fff' }}
                title={TIER_DESC[tier]}
              >
                {tier}
              </div>
              <div className="flex-1 py-3 px-2 flex flex-wrap gap-2 items-center min-h-[60px]">
                {models.length === 0 && (
                  <span className="text-xs italic" style={{ color: 'rgb(var(--muted))' }}>
                    No models match the current filters.
                  </span>
                )}
                {models.map((name) => {
                  const m = MODELS[name];
                  const meta = LAB_META[m.lab];
                  return (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm"
                      style={{
                        background: 'rgb(var(--bg))',
                        border: `1px solid rgb(var(--border))`,
                      }}
                      title={`${meta.label} (${meta.country}) — ${m.license}${m.bestAt ? ` · ${m.bestAt}` : ''}`}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{ background: meta.color }}
                      />
                      <span style={{ color: 'rgb(var(--fg))' }}>{m.name}</span>
                      <span className="text-[0.7rem]" style={{ color: 'rgb(var(--muted))' }}>
                        {m.params}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {TIER_ORDER.map((t) => (
          <div key={t} className="flex items-start gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm mt-0.5 shrink-0"
              style={{ background: TIER_COLOR[t] }}
            />
            <span style={{ color: 'rgb(var(--muted))' }}>
              <b style={{ color: 'rgb(var(--fg))' }}>{t}</b> — {TIER_DESC[t]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-[0.7rem]" style={{ color: 'rgb(var(--muted))' }}>
        Hover a model chip for lab + license + strengths. Snapshot from {SNAPSHOT_DATE}; re-snap when the bench moves.
        License legend: <b>open</b> = open weights, redistributable. <b>open-non-commercial</b> = research-only.
        <b> open-permissive</b> = MIT/Apache-style.
      </div>
    </div>
  );
}
