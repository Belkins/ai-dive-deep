import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LMARENA, VENDOR_META, LMARENA_SNAPSHOT, LMARENA_LIVE, LMARENA_HF,
  type Row, type Vendor, type Category,
} from '@/lib/lmarena';

// Category id -> HF datasets-server config. null = no live config (snapshot only).
const CONFIG: Record<string, string | null> = {
  text: 'text',
  webdev: 'webdev',
  'image-to-webdev': null,
  document: 'document',
  vision: 'vision',
  search: 'search',
  'text-to-image': 'text_to_image',
  'image-edit': 'image_edit',
  'text-to-video': 'text_to_video',
  'image-to-video': 'image_to_video',
  'video-edit': 'video_edit',
};

// HF datasets-server caps `length` at 100. The primary board sits at the
// top of the `latest` split, so 100 rows always covers the top 12 we show.
const ENDPOINT = (cfg: string) =>
  `https://datasets-server.huggingface.co/rows?dataset=lmarena-ai/leaderboard-dataset&config=${cfg}&split=latest&offset=0&length=100`;

function vendorOf(org: string): Vendor {
  const o = (org || '').toLowerCase();
  if (o.includes('anthropic')) return 'anthropic';
  if (o.includes('openai')) return 'openai';
  if (o.includes('google') || o.includes('deepmind')) return 'google';
  if (o.includes('meta')) return 'meta';
  if (o.includes('xai') || o.includes('x.ai')) return 'xai';
  if (o.includes('zhipu') || o.includes('z.ai')) return 'zhipu';
  if (o.includes('moonshot')) return 'moonshot';
  if (o.includes('alibaba') || o.includes('qwen')) return 'alibaba';
  if (o.includes('baidu')) return 'baidu';
  if (o.includes('bytedance') || o.includes('dreamina')) return 'bytedance';
  return 'other';
}

type Loaded = { rows: Row[]; date: string | null; source: 'live' | 'snapshot' };

export default function LMArenaLeaderboard() {
  const cats = LMARENA;
  const [active, setActive] = useState(cats[0].id);
  const [byCat, setByCat] = useState<Record<string, Loaded>>({});
  const [loading, setLoading] = useState(false);
  const fetched = useRef<Set<string>>(new Set());

  const cat = cats.find((c) => c.id === active) as Category;
  const snapshot = (c: Category): Loaded => ({ rows: c.rows, date: null, source: 'snapshot' });

  useEffect(() => {
    const cfg = CONFIG[active];
    if (!cfg || fetched.current.has(active)) return;
    fetched.current.add(active);
    let cancelled = false;
    setLoading(true);
    fetch(ENDPOINT(cfg))
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d: any) => {
        if (cancelled) return;
        const raw: any[] = (d?.rows ?? []).map((x: any) => x.row).filter(Boolean);
        if (!raw.length) throw new Error('empty');
        const primary = active === 'text' ? 'overall' : raw[0].category;
        const seen = new Set<string>();
        const rows: Row[] = raw
          .filter((r) => r.category === primary && typeof r.rating === 'number')
          .sort((a, b) => (a.rank ?? 1e9) - (b.rank ?? 1e9))
          .filter((r) => (seen.has(r.model_name) ? false : seen.add(r.model_name)))
          .slice(0, 12)
          .map((r, i) => ({
            rank: Math.round(r.rank ?? i + 1),
            model: String(r.model_name),
            score: Math.round(r.rating),
            vendor: vendorOf(r.organization),
          }));
        if (!rows.length) throw new Error('no rows after filter');
        const date = raw[0].leaderboard_publish_date ?? null;
        setByCat((p) => ({ ...p, [active]: { rows, date, source: 'live' } }));
      })
      .catch(() => {
        if (!cancelled) setByCat((p) => ({ ...p, [active]: snapshot(cat) }));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [active]);

  const data: Loaded = byCat[active] ?? snapshot(cat);
  const rows = data.rows;
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
    .lmb-foot{padding:14px 24px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;justify-content:space-between;font-size:12px;color:rgb(var(--muted))}
    .lmb-callout{margin:16px 24px 4px;padding:12px 16px;border:1px solid rgb(var(--accent-2) / .5);border-radius:10px;background:rgb(var(--accent-2) / .08);font-size:13px;color:rgb(var(--fg))}
    @media (max-width:680px){.lmb-row{grid-template-columns:32px 1fr 64px;gap:8px;padding:9px 16px}.lmb-vd,.lmb-track,.lmb-fill{display:none}.lmb-head,.lmb-tabs,.lmb-foot,.lmb-callout{padding-left:16px;padding-right:16px}.lmb-callout{margin-left:16px;margin-right:16px}}
  `;

  return (
    <div className="container-wide">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="lmb-wrap">
        <div className="lmb-head">
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--accent-2))' }}>
              LMArena · {cat.name}
            </div>
            <div className="font-display" style={{ fontSize: '1.4rem', lineHeight: 1.2, marginTop: 4 }}>
              {cat.blurb}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: 'rgb(var(--muted))' }}>
            {loading && !byCat[active] ? (
              'loading live…'
            ) : data.source === 'live' ? (
              <>live · as of {data.date}</>
            ) : (
              <>snapshot · {LMARENA_SNAPSHOT}{CONFIG[active] ? ' (live unavailable)' : ''}</>
            )}
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
              <div className="lmb-row" key={`${r.rank}-${r.model}`}>
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

        <div className="lmb-foot">
          <span>
            Crowdsourced head-to-head votes. Live data via the{' '}
            <a href={LMARENA_HF} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))' }}>
              lmarena-ai HF dataset
            </a>
            ; falls back to a hand-verified snapshot if offline.
          </span>
          <a href={LMARENA_LIVE} target="_blank" rel="noopener" style={{ color: 'rgb(var(--accent))', fontWeight: 600 }}>
            Open lmarena.ai →
          </a>
        </div>
      </div>
    </div>
  );
}
