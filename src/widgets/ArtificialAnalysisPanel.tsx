import { useEffect, useMemo, useState } from 'react';
import { VENDOR_META, type Vendor } from '@/lib/lmarena';
import {
  AA_MODELS, AA_SNAPSHOT, AA_INDEX_VERSION, AA_SOURCE_URL, AA_AGENTIC_URL,
  AA_METHODOLOGY_URL, AA_METHODOLOGY, AA_DISCLOSURE, AA_PRECISION, AA_AGENTIC_NOTE,
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
  { key: 'intelligence', label: 'Intelligence', unit: 'Index v4.1.1', higherBetter: true,
    value: (m) => m.intelligence, fmt: (v) => v.toFixed(1) },
  { key: 'agentic', label: 'Agentic', unit: 'Agentic Index', higherBetter: true,
    value: (m) => m.agentic, fmt: (v) => v.toFixed(1) },
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

  const rows = useMemo(() => {
    const withVal = AA_MODELS.map((m) => ({ m, v: sort.value(m) }));
    // missing values always sort last, regardless of direction
    return withVal.sort((a, b) => {
      if (a.v === undefined) return 1;
      if (b.v === undefined) return -1;
      return sort.higherBetter ? b.v - a.v : a.v - b.v;
    });
  }, [active]);

  // bar geometry for the active metric: best = longest. 8% floor so every bar shows.
  const vals = rows.map((r) => r.v).filter((v): v is number => v !== undefined);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = Math.max(1e-9, max - min);
  const width = (v: number | undefined) => {
    if (v === undefined) return 0;
    const good = sort.higherBetter ? (v - min) / span : (max - v) / span;
    return 8 + good * 92;
  };

  // Dynamic intelligence-vs-cost callout — computed, never hardcoded, so it can't
  // drift. It previously ASSERTED that the smartest model is also the priciest,
  // which was true on the 2026-06-16 board and became false on 2026-07-27 the
  // moment Opus 5 took #1 at $2.03 while Fable 5 sat at $2.75. A sentence that
  // only holds for one snapshot is a stat-drift bug with a delayed fuse, so the
  // relationship is now derived rather than assumed.
  const smartest = [...AA_MODELS].sort((a, b) => b.intelligence - a.intelligence)[0];
  const cheapest = [...AA_MODELS].sort((a, b) => a.costPerTaskUsd - b.costPerTaskUsd)[0];
  const priciest = [...AA_MODELS].sort((a, b) => b.costPerTaskUsd - a.costPerTaskUsd)[0];
  const agenticLead = [...AA_MODELS].filter((m) => m.agentic !== undefined).sort((a, b) => b.agentic! - a.agentic!)[0];
  const multiple = smartest.costPerTaskUsd / cheapest.costPerTaskUsd;
  const smartestIsPriciest = smartest.model === priciest.model;
  // How much of the leader's capability the cheapest row actually delivers.
  const cheapShare = Math.round((cheapest.intelligence / smartest.intelligence) * 100);
  const cheapCostShare = (cheapest.costPerTaskUsd / smartest.costPerTaskUsd) * 100;

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
    .aap-row{display:grid;grid-template-columns:34px minmax(120px,1.3fr) 1fr 58px 58px 70px 56px;align-items:center;gap:12px;padding:9px 24px;border-bottom:1px solid rgb(var(--line) / .5)}
    .aap-row:last-child{border-bottom:0}
    .aap-rk{font:500 16px/1 var(--font-display,Georgia,serif);color:rgb(var(--muted))}
    .aap-md{display:flex;align-items:center;gap:8px;min-width:0}
    .aap-sw{width:9px;height:9px;border-radius:2px;flex:none}
    .aap-mdname{font:400 14px/1.2 var(--font-mono,monospace);color:rgb(var(--fg));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .aap-track{height:6px;border-radius:3px;background:rgb(var(--line))}
    .aap-fill{height:6px;border-radius:3px;transition:width .35s cubic-bezier(.4,0,.2,1)}
    .aap-cell{font:500 13px/1 var(--font-mono,monospace);color:rgb(var(--muted));text-align:right}
    .aap-cell[data-on="1"]{font-weight:700;color:rgb(var(--fg))}
    .aap-colh{display:grid;grid-template-columns:34px minmax(120px,1.3fr) 1fr 58px 58px 70px 56px;gap:12px;padding:8px 24px;border-bottom:1px solid rgb(var(--line))}
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
      .aap-cell:not([data-on="1"]),.aap-colh .h{display:none}
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
            <div className="aap-title">Agentic intelligence, priced per task</div>
          </div>
          <div className="aap-fresh">
            <span className="aap-dot" style={{ background: fr.tone }} />
            captured {AA_SNAPSHOT} · {AA_INDEX_VERSION}
            <div style={{ marginTop: 2 }}>{days === 0 ? 'captured today' : `${days} days old`} · {fr.word}</div>
          </div>
        </div>

        <div className="aap-pills">
          <span className="aap-pills-lab">Rank by</span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              className="aap-pill"
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
          <span className="r" data-on={active === 'agentic' ? '1' : '0'}>Agentic</span>
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
                <div className="aap-cell" data-on={active === 'agentic' ? '1' : '0'}>{m.agentic !== undefined ? m.agentic.toFixed(1) : '—'}</div>
                <div className="aap-cell" data-on={active === 'cost' ? '1' : '0'}>{m.costPerTaskUsd < 1 ? `$${m.costPerTaskUsd.toFixed(3)}` : `$${m.costPerTaskUsd.toFixed(2)}`}</div>
                <div className="aap-cell" data-on={active === 'speed' ? '1' : '0'}>{m.outputTokensPerSec ? Math.round(m.outputTokensPerSec) : '—'}</div>
              </div>
            );
          })}
        </div>

        <div className="aap-callout">
          <strong>{smartest.model}</strong> tops the Index ({smartest.intelligence.toFixed(1)}) at $
          {smartest.costPerTaskUsd.toFixed(2)} per Index task
          {smartestIsPriciest ? (
            <> — and is also the most expensive row on this board.</>
          ) : (
            <>
              {' '}— and is <em>not</em> the most expensive row on this board:{' '}
              <strong>{priciest.model}</strong> pays ${priciest.costPerTaskUsd.toFixed(2)} for{' '}
              {(smartest.intelligence - priciest.intelligence).toFixed(1)} fewer points. The frontier stopped
              being the priciest thing on the menu.
            </>
          )}{' '}
          Meanwhile <strong>{cheapest.model}</strong> delivers {cheapShare}% of the leader&rsquo;s Index at{' '}
          {cheapCostShare.toFixed(1)}% of its cost per task — a {Math.round(multiple)}× price ratio.
          On the Agentic Index — AA&rsquo;s agentic benches as their own board —{' '}
          {agenticLead.model === smartest.model
            ? <>the same model leads ({agenticLead.agentic!.toFixed(1)})</>
            : <><strong>{agenticLead.model}</strong> leads instead ({agenticLead.agentic!.toFixed(1)})</>}.
          Capability is the vanity metric; cost-per-task is the one that shows up on the invoice. Sort by it.
        </div>

        <details className="aap-meth">
          <summary>How the Index is built — {AA_METHODOLOGY.version} ({AA_METHODOLOGY.since})</summary>
          <ul>
            {AA_METHODOLOGY.categories.map((c) => (
              <li key={c.name}><strong>{c.name} · {c.weight}%</strong> — {c.benches.join(' · ')}</li>
            ))}
          </ul>
          <div style={{ marginTop: 6 }}>The v4.1 redesign retired {AA_METHODOLOGY.retired.join(', ')} to chase agentic signal; v4.1.1 (August 2026) is a maintenance cut — 𝜏³-Banking moved to upstream tau2-bench v1.0.1, grader models upgraded. It's a weighted composite — change the weights and you change the king. Independent buys disinterest, not infallibility: read it as a third reading that disagrees usefully with the crowd and the labs, not a tiebreaker that overrules them.</div>
          <div style={{ marginTop: 8 }}><strong>Precision.</strong> {AA_PRECISION} Treat the top of this board as a tie, not a ranking.</div>
          <div style={{ marginTop: 8 }}><strong>Disclosure.</strong> {AA_DISCLOSURE}</div>
          <div style={{ marginTop: 8 }}><strong>The Agentic column.</strong> {AA_AGENTIC_NOTE} Source: <a href={AA_AGENTIC_URL} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))' }}>the Agentic Index board</a>.</div>
          <div style={{ marginTop: 8 }}><strong>One column, one denominator.</strong> AA publishes several numbers it calls "cost per task": the Intelligence Index one shown here, a separate larger Agentic Index one (GPT-5.6 Sol: $2.55 there vs $1.23 here), and an AA-Briefcase one before that. Secondary coverage quotes them interchangeably. This column is always the Intelligence Index.</div>
        </details>

        <div className="aap-foot">
          <span>
            Source:{' '}
            <a href={AA_SOURCE_URL} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))' }}>Artificial Analysis</a>
            {' '}— independent evals, run on their own harness. Hand-captured fair-use snapshot; figures verified against AA's public board on {AA_SNAPSHOT}.{' '}
            <a href={AA_METHODOLOGY_URL} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))' }}>Methodology →</a>
          </span>
          <a href={AA_SOURCE_URL} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))', fontWeight: 600 }}>Open artificialanalysis.ai →</a>
        </div>
      </div>
    </div>
  );
}
