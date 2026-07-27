import { useMemo, useState } from 'react';
import {
  LMARENA, VENDOR_META, LMARENA_SNAPSHOT, LMARENA_LIVE, LMARENA_MIRROR,
  type Vendor, type Category,
} from '@/lib/lmarena';

// Snapshot-only, deliberately.
//
// This widget used to fetch the lmarena-ai/leaderboard-dataset HF feed live and
// fall back to the static mirror on failure. That feed was retired when LMArena
// rebranded to Arena and now returns 404 on every request, so the "live" path
// was a guaranteed round-trip to a dead endpoint on every tab click, ending in
// the fallback it always ends in. Arena publishes no replacement public API.
// Removed rather than left to fail quietly — a fetch that can only fail is not
// a freshness guarantee, it is a freshness costume.
//
// Freshness is instead carried honestly: each board renders its OWN publish date
// from `freshness`, because Arena recomputes each on its own cadence and the
// spread across this capture is 34 days.

export default function LMArenaLeaderboard() {
  const cats = LMARENA;
  const [active, setActive] = useState(cats[0].id);
  const cat = cats.find((c) => c.id === active) as Category;
  const rows = cat.rows;

  const min = useMemo(() => Math.min(...rows.map((r) => r.score)), [rows]);
  const max = useMemo(() => Math.max(...rows.map((r) => r.score)), [rows]);
  const span = Math.max(1, max - min);

  // pattern callout: top vendor's share of the visible top 10
  const top10 = rows.slice(0, 10);
  const counts = top10.reduce<Record<string, number>>((m, r) => ((m[r.vendor] = (m[r.vendor] || 0) + 1), m), {});
  const lead = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const leadVendor = lead ? (lead[0] as Vendor) : 'anthropic';
  const leadN = lead ? lead[1] : 0;

  const css = `
    .lmb-wrap{background:rgb(var(--paper));border:1px solid rgb(var(--line));border-radius:14px;overflow:hidden}
    .lmb-head{padding:20px 24px;border-bottom:1px solid rgb(var(--line));display:flex;flex-wrap:wrap;gap:8px 16px;align-items:baseline;justify-content:space-between}
    .lmb-tabs{display:flex;flex-wrap:wrap;gap:6px;padding:14px 20px;border-bottom:1px solid rgb(var(--line))}
    .lmb-tab{font:600 12px/1 var(--font-sans,inherit);letter-spacing:.04em;padding:7px 12px;border-radius:999px;border:1px solid rgb(var(--line));background:transparent;color:rgb(var(--muted));cursor:pointer;white-space:nowrap;transition:all .12s}
    .lmb-tab:hover{color:rgb(var(--fg));border-color:rgb(var(--muted) / .5)}
    .lmb-tab[data-on="1"]{background:rgb(var(--accent));border-color:rgb(var(--accent));color:#fff}
    .lmb-row{display:grid;grid-template-columns:42px 132px 1fr 110px 72px;align-items:center;gap:12px;padding:9px 24px;border-bottom:1px solid rgb(var(--line) / .5)}
    .lmb-row:last-child{border-bottom:0}
    .lmb-rk{font:500 17px/1 var(--font-display,Georgia,serif);color:rgb(var(--fg))}
    .lmb-vd{font:600 10px/1.3 var(--font-sans,inherit);letter-spacing:.08em;text-transform:uppercase}
    .lmb-md{font:400 14px/1.2 var(--font-mono,monospace);color:rgb(var(--fg));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .lmb-track{height:6px;border-radius:3px;background:rgb(var(--line))}
    .lmb-fill{height:6px;border-radius:3px}
    .lmb-sc{font:600 17px/1 var(--font-mono,monospace);color:rgb(var(--fg));text-align:right}
    .lmb-foot{padding:14px 24px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;justify-content:space-between;font-size:12px;color:rgb(var(--muted));border-top:1px solid rgb(var(--line))}
    .lmb-callout{margin:16px 24px 4px;padding:12px 16px;border:1px solid rgb(var(--accent-2) / .5);border-radius:10px;background:rgb(var(--accent-2) / .08);font-size:13px;color:rgb(var(--fg))}
    .lmb-note{margin:12px 24px 4px;padding:12px 16px;border-left:3px solid rgb(var(--accent));border-radius:0 8px 8px 0;background:rgb(var(--accent) / .06);font-size:12.5px;line-height:1.55;color:rgb(var(--fg) / .9)}
    .lmb-note b{font-weight:600;color:rgb(var(--accent))}
    @media (max-width:680px){.lmb-row{grid-template-columns:32px 1fr 64px;gap:8px;padding:9px 16px}.lmb-vd,.lmb-track,.lmb-fill{display:none}.lmb-head,.lmb-tabs,.lmb-foot,.lmb-callout,.lmb-note{padding-left:16px;padding-right:16px}.lmb-callout,.lmb-note{margin-left:16px;margin-right:16px}}
  `;

  return (
    <div className="container-wide">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="lmb-wrap">
        <div className="lmb-head">
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--accent-2))' }}>
              Arena · {cat.name}
            </div>
            <div className="font-display" style={{ fontSize: '1.4rem', lineHeight: 1.2, marginTop: 4 }}>
              {cat.blurb}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: 'rgb(var(--muted))' }}>
            captured {LMARENA_SNAPSHOT}
            <div style={{ marginTop: 2 }}>{cat.freshness}</div>
          </div>
        </div>

        <div className="lmb-tabs">
          {cats.map((c) => (
            <button
              key={c.id}
              className="lmb-tab"
              data-on={c.id === active ? '1' : '0'}
              onClick={() => setActive(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div>
          {rows.map((r) => {
            const vm = VENDOR_META[r.vendor];
            const w = 8 + ((r.score - min) / span) * 92;
            return (
              <div className="lmb-row" key={`${r.rank}-${r.model}-${r.score}`}>
                <div className="lmb-rk">{r.rank}</div>
                <div className="lmb-vd" style={{ color: vm.color }}>
                  {vm.label || '—'}
                </div>
                <div className="lmb-md" title={r.model}>{r.model}</div>
                <div className="lmb-track">
                  <div className="lmb-fill" style={{ width: `${w}%`, background: vm.color }} />
                </div>
                <div className="lmb-sc">{r.score}</div>
              </div>
            );
          })}
        </div>

        {leadN >= 4 && (
          <div className="lmb-callout">
            <strong style={{ color: VENDOR_META[leadVendor].color }}>
              {VENDOR_META[leadVendor].label}
            </strong>{' '}
            holds {leadN} of the top 10 here. The Elo spread across this top 10 is{' '}
            {max - min} points — a gap operators rarely feel in practice.
          </div>
        )}

        {cat.note && (
          <div className="lmb-note">
            <b>Read the board, not the rank.</b> {cat.note}
          </div>
        )}

        <div className="lmb-foot">
          <span>
            Crowdsourced head-to-head votes, hand-mirrored on {LMARENA_SNAPSHOT}. Arena ships no public API;
            ten of eleven boards were cross-checked against a{' '}
            <a href={LMARENA_MIRROR} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))' }}>
              community mirror
            </a>{' '}
            — a corroborating source, never the citation.
          </span>
          <a href={LMARENA_LIVE} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))', fontWeight: 600 }}>
            Open arena.ai →
          </a>
        </div>
      </div>
    </div>
  );
}
