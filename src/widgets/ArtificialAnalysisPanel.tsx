import { useEffect, useMemo, useState } from 'react';
import { VENDOR_META, type Vendor } from '@/lib/lmarena';
import { rankBy } from '@/lib/aa-rank';
import {
  AA_MODELS, AA_SNAPSHOT, AA_INDEX_VERSION, AA_SOURCE_URL, AA_TERMS_URL, AA_ATTRIBUTION,
  AA_METHODOLOGY_URL, AA_METHODOLOGY, AA_DISCLOSURE, AA_PRECISION, AA_AGENTIC_NOTE,
  AA_SCOPE_NOTE, AA_SPEED_NOTE,
  type AAMetric, type AAModel,
} from '@/lib/artificial-analysis';

type SortDef = {
  key: AAMetric;
  label: string;
  unit: string;
  // higher value = better? (false for cost — lower is better)
  higherBetter: boolean;
  value: (m: AAModel) => number | undefined;
  fmt: (v: number) => string;
};

const SORTS: SortDef[] = [
  { key: 'intelligence', label: 'Intelligence', unit: AA_INDEX_VERSION.replace('Intelligence ', ''), higherBetter: true,
    value: (m) => m.intelligence, fmt: (v) => v.toFixed(1) },
  { key: 'cost', label: 'Cost / task', unit: 'USD per Index task', higherBetter: false,
    value: (m) => m.costPerTaskUsd, fmt: (v) => `$${v < 1 ? v.toFixed(3) : v.toFixed(2)}` },
  { key: 'speed', label: 'Speed', unit: 'tok/s', higherBetter: true,
    value: (m) => m.outputTokensPerSec, fmt: (v) => Math.round(v).toString() },
];

// Days since capture — computed in the browser at view time, so the staleness
// guard is honest without any cron. AA revs the index every few months, so this
// surfaces rot the way LMArena's live fetch can't (there's no live feed to heal it).
function daysOld(): number {
  const cap = new Date(`${AA_SNAPSHOT}T00:00:00Z`).getTime();
  return Math.max(0, Math.floor((Date.now() - cap) / 86_400_000));
}

function freshness(days: number): { tone: string; word: string } {
  if (days <= 30) return { tone: 'rgb(var(--accent-2))', word: 'fresh' };
  if (days <= 60) return { tone: '#F5C24A', word: 'aging' };
  return { tone: 'rgb(var(--accent))', word: 'stale — verify against AA' };
}

export default function ArtificialAnalysisPanel() {
  const [active, setActive] = useState<AAMetric>('cost');
  const sort = SORTS.find((s) => s.key === active) as SortDef;

  // missing values always sort last, regardless of direction — pinned by
  // tests/aa-rank.test.mjs, which is why the ranking lives in @/lib/aa-rank.
  const rows = useMemo(() => rankBy(AA_MODELS, sort.value, sort.higherBetter), [active]);

  // bar geometry for the active metric: best = longest. 8% floor so every bar shows.
  const vals = rows.map((r) => r.v).filter((v): v is number => v !== undefined);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = Math.max(1e-9, max - min);
  const width = (v: number | undefined) => {
    if (v === undefined) return 0;
    const good = sort.higherBetter ? (v - min) / span : (max - v) / span;
    return 8 + good * 92;
  };

  // Claims are limited to this selection, not AA's entire leaderboard.
  const smartest = [...AA_MODELS].sort((a, b) => b.intelligence - a.intelligence)[0];
  const cheapest = [...AA_MODELS].sort((a, b) => a.costPerTaskUsd - b.costPerTaskUsd)[0];
  const multiple = smartest.costPerTaskUsd / cheapest.costPerTaskUsd;

  // compute staleness only after mount, so SSR and first client render agree
  // (build-time date vs view-time date would otherwise be a hydration mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const days = mounted ? daysOld() : 0;
  const fr = freshness(days);

  const css = `
    .aap-wrap{background:rgb(var(--paper));border:1px solid rgb(var(--line));border-radius:14px;overflow:hidden}
    .aap-head{padding:20px 24px;border-bottom:1px solid rgb(var(--line));display:flex;flex-wrap:wrap;gap:8px 16px;align-items:baseline;justify-content:space-between}
    .aap-eyebrow{font:600 11px/1 var(--font-sans,inherit);letter-spacing:.14em;text-transform:uppercase;color:rgb(var(--accent-2))}
    .aap-title{font:1.4rem/1.2 var(--font-display,Georgia,serif);margin-top:4px;color:rgb(var(--fg))}
    .aap-fresh{text-align:right;font-size:12px;color:rgb(var(--muted))}
    .aap-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;vertical-align:middle}
    .aap-pills{display:flex;flex-wrap:wrap;gap:6px;padding:14px 20px;border-bottom:1px solid rgb(var(--line));align-items:center}
    .aap-pills-lab{font:600 10px/1 var(--font-sans,inherit);letter-spacing:.1em;text-transform:uppercase;color:rgb(var(--muted));margin-right:4px}
    .aap-pill{font:600 12px/1 var(--font-sans,inherit);letter-spacing:.02em;padding:7px 12px;border-radius:999px;border:1px solid rgb(var(--line));background:transparent;color:rgb(var(--muted));cursor:pointer;white-space:nowrap;transition:all .12s}
    .aap-pill:hover{color:rgb(var(--fg));border-color:rgb(var(--muted) / .5)}
    .aap-pill[data-on="1"]{background:rgb(var(--accent));border-color:rgb(var(--accent));color:#fff}
    .aap-pill small{font-weight:400;opacity:.7;margin-left:5px}
    .aap-row,.aap-colh{grid-template-columns:34px minmax(120px,1.3fr) 1fr 58px 70px 56px}
    .aap-row{display:grid;align-items:center;gap:12px;padding:9px 24px;border-bottom:1px solid rgb(var(--line) / .5)}
    .aap-row:last-child{border-bottom:0}
    .aap-rk{font:500 16px/1 var(--font-display,Georgia,serif);color:rgb(var(--muted))}
    .aap-md{display:flex;align-items:center;gap:8px;min-width:0}
    .aap-sw{width:9px;height:9px;border-radius:2px;flex:none}
    .aap-mdname{font:400 14px/1.3 var(--font-mono,monospace);color:rgb(var(--fg));overflow-wrap:anywhere}
    .aap-track{height:6px;border-radius:3px;background:rgb(var(--line))}
    .aap-fill{height:6px;border-radius:3px;transition:width .35s cubic-bezier(.4,0,.2,1)}
    .aap-cell{font:500 13px/1 var(--font-mono,monospace);color:rgb(var(--muted));text-align:right}
    .aap-cell[data-on="1"]{font-weight:700;color:rgb(var(--fg))}
    .aap-colh{display:grid;gap:12px;padding:8px 24px;border-bottom:1px solid rgb(var(--line))}
    .aap-colh span{font:600 9px/1.2 var(--font-sans,inherit);letter-spacing:.08em;text-transform:uppercase;color:rgb(var(--muted))}
    .aap-colh .r{text-align:right}
    .aap-callout{margin:16px 24px 4px;padding:12px 16px;border:1px solid rgb(var(--accent-2) / .5);border-radius:10px;background:rgb(var(--accent-2) / .08);font-size:13px;line-height:1.5;color:rgb(var(--fg))}
    .aap-meth{margin:14px 24px;font-size:12.5px;color:rgb(var(--muted))}
    .aap-meth summary{cursor:pointer;font-weight:600;color:rgb(var(--fg) / .85)}
    .aap-meth ul{margin:8px 0 0;padding-left:18px}
    .aap-meth li{margin:3px 0}
    .aap-foot{padding:14px 24px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;justify-content:space-between;font-size:12px;color:rgb(var(--muted));border-top:1px solid rgb(var(--line))}
    @media (max-width:680px){
      .aap-row,.aap-colh{grid-template-columns:28px 1fr 64px;gap:8px;padding:9px 16px}
      .aap-track,.aap-sw{display:none}
      .aap-cell:not([data-on="1"]),.aap-colh .r:not([data-on="1"]),.aap-colh .h{display:none}
      .aap-head,.aap-pills,.aap-foot,.aap-callout,.aap-meth{padding-left:16px;padding-right:16px}
      .aap-callout,.aap-meth{margin-left:16px;margin-right:16px}
    }
  `;

  return (
    <div className="container-wide">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="aap-wrap">
        <div className="aap-head">
          <div>
            <div className="aap-eyebrow">Independent evals · Artificial Analysis</div>
            <div className="aap-title">Intelligence, priced per task</div>
          </div>
          <div className="aap-fresh">
            <span className="aap-dot" style={{ background: fr.tone }} />
            captured {AA_SNAPSHOT} · {AA_INDEX_VERSION}
            <div style={{ marginTop: 2 }}>{mounted ? `${days} days old · ${fr.word}` : 'Dated public snapshot'}</div>
          </div>
        </div>

        <div className="aap-pills">
          <span className="aap-pills-lab">Rank by</span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              className="aap-pill"
              aria-pressed={s.key === active}
              data-on={s.key === active ? '1' : '0'}
              onClick={() => setActive(s.key)}
            >
              {s.label}<small>{s.unit}</small>
            </button>
          ))}
        </div>

        <div className="aap-colh">
          <span>#</span>
          <span>Model</span>
          <span className="h">{sort.label}</span>
          <span className="r" data-on={active === 'intelligence' ? '1' : '0'}>Intel</span>
          <span className="r" data-on={active === 'cost' ? '1' : '0'}>$/task</span>
          <span className="r" data-on={active === 'speed' ? '1' : '0'}>tok/s</span>
        </div>

        <div>
          {rows.map(({ m, v }, i) => {
            const vm = VENDOR_META[m.vendor as Vendor];
            return (
              <div className="aap-row" key={m.model}>
                <div className="aap-rk">{i + 1}</div>
                <div className="aap-md">
                  <span className="aap-sw" style={{ background: vm.color }} title={vm.label || undefined} />
                  <span className="aap-mdname" title={m.model}>{m.model}</span>
                </div>
                <div className="aap-track">
                  <div className="aap-fill" style={{ width: `${width(v)}%`, background: vm.color }} />
                </div>
                <div className="aap-cell" data-on={active === 'intelligence' ? '1' : '0'}>{m.intelligence.toFixed(1)}</div>
                <div className="aap-cell" data-on={active === 'cost' ? '1' : '0'}>{m.costPerTaskUsd < 1 ? `$${m.costPerTaskUsd.toFixed(3)}` : `$${m.costPerTaskUsd.toFixed(2)}`}</div>
                <div className="aap-cell" data-on={active === 'speed' ? '1' : '0'}>{m.outputTokensPerSec !== undefined ? Math.round(m.outputTokensPerSec) : '—'}</div>
              </div>
            );
          })}
        </div>

        <div className="aap-callout">
          <strong>{smartest.model}</strong> has the highest Index score in this selection ({smartest.intelligence.toFixed(1)})
          {' '}at ${smartest.costPerTaskUsd.toFixed(2)} per Index task.{' '}
          <strong>{cheapest.model}</strong> is the lowest-cost selected row: {cheapest.intelligence.toFixed(1)} points
          {' '}at ${cheapest.costPerTaskUsd.toFixed(3)} per task, a {Math.round(multiple)}× cost difference.
          These are weighted benchmark costs, not a quote for your workload.
        </div>
        <p className="aap-meth">{AA_SCOPE_NOTE}</p>

        <details className="aap-meth">
          <summary>How the Index is built — {AA_METHODOLOGY.version} ({AA_METHODOLOGY.since})</summary>
          <ul>
            {AA_METHODOLOGY.categories.map((c) => (
              <li key={c.name}><strong>{c.name} · {c.weight}%</strong> — {c.benches.join(' · ')}</li>
            ))}
          </ul>
          <div style={{ marginTop: 6 }}>{AA_METHODOLOGY.changes}</div>
          <div style={{ marginTop: 8 }}><strong>Precision.</strong> {AA_PRECISION}</div>
          <div style={{ marginTop: 8 }}><strong>Disclosure.</strong> {AA_DISCLOSURE}</div>
          <div style={{ marginTop: 8 }}><strong>Agentic evidence.</strong> {AA_AGENTIC_NOTE}</div>
          <div style={{ marginTop: 8 }}><strong>Speed.</strong> {AA_SPEED_NOTE}</div>
          <div style={{ marginTop: 8 }}><strong>One denominator.</strong> Cost is the weighted USD average per Intelligence Index task, including input, answer, reasoning and cache tokens. It is not standalone AA-Briefcase cost, a whole-Index run, or token-list pricing.</div>
        </details>

        <div className="aap-foot">
          <span>
            Source:{' '}
            <a href={AA_SOURCE_URL} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))' }}>Artificial Analysis</a>
            {' '}· {AA_ATTRIBUTION} Limited public-data selection captured {AA_SNAPSHOT}; no keyed API.{' '}
            <a href={AA_METHODOLOGY_URL} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))' }}>Methodology →</a>
            {' '}· <a href={AA_TERMS_URL} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))' }}>Source terms</a>
          </span>
          <a href={AA_SOURCE_URL} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))', fontWeight: 600 }}>Open artificialanalysis.ai →</a>
        </div>
      </div>
    </div>
  );
}
