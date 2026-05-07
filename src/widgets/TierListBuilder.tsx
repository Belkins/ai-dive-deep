import { useEffect, useMemo, useState } from 'react';

type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'pool';
const TIER_ORDER: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F', 'pool'];
const TIER_DESC: Record<Tier, string> = {
  S: 'Run my life — remove this and three things break by Wednesday',
  A: 'Open every day',
  B: 'Useful for one job each',
  C: 'I see why people use these but I don\'t',
  D: 'Exists, fine, not for me',
  F: 'Actively bad / don\'t',
  pool: 'Unranked pool — drag into a tier',
};
const TIER_COLOR: Record<Tier, string> = {
  S: '#FF6B2C', A: '#FF8E54', B: '#FFB48C', C: '#22D3A0', D: '#56544B', F: '#26251F', pool: '#8C897C',
};

const DEFAULT_PLACEMENTS: Record<string, Tier> = {
  'Claude Code': 'S',
  'Cowork': 'S',
  'ChatGPT (mobile)': 'A',
  'Gemini AI Studio': 'A',
  'ElevenLabs': 'A',
  'Codex (OpenAI)': 'A',
  'Cursor': 'A',
  'Suno': 'B',
  'Nano Banana': 'B',
  'SeeDance': 'B',
  'Claude.ai web Chat': 'B',
  'Whisper': 'B',
  'Perplexity': 'C',
  'GitHub Copilot': 'C',
  'Replit Ghostwriter': 'C',
  'Notion AI': 'C',
  'AutoGPT-style': 'D',
  'Generic ChatGPT-for-X wrappers': 'D',
  'AI girlfriend / companion apps': 'F',
  '“ChatGPT killer” reskins': 'F',
};

const ALL_TOOLS = Object.keys(DEFAULT_PLACEMENTS);
const STORAGE_KEY = 'cc-tier-list';

export default function TierListBuilder() {
  const [placements, setPlacements] = useState<Record<string, Tier>>(DEFAULT_PLACEMENTS);
  const [draggingTool, setDraggingTool] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');

  // Load from URL hash or localStorage
  useEffect(() => {
    try {
      if (window.location.hash.startsWith('#tl=')) {
        const decoded = JSON.parse(atob(decodeURIComponent(window.location.hash.slice(4))));
        setPlacements({ ...DEFAULT_PLACEMENTS, ...decoded });
        return;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlacements({ ...DEFAULT_PLACEMENTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(placements));
    } catch {}
  }, [placements]);

  const byTier = useMemo(() => {
    const out: Record<Tier, string[]> = { S: [], A: [], B: [], C: [], D: [], F: [], pool: [] };
    for (const tool of ALL_TOOLS) out[placements[tool] ?? 'pool'].push(tool);
    return out;
  }, [placements]);

  const onDragStart = (tool: string) => setDraggingTool(tool);
  const onDrop = (tier: Tier) => {
    if (!draggingTool) return;
    setPlacements((prev) => ({ ...prev, [draggingTool]: tier }));
    setDraggingTool(null);
  };

  const reset = () => setPlacements({ ...DEFAULT_PLACEMENTS });
  const share = async () => {
    try {
      const data = btoa(JSON.stringify(placements));
      const url = `${window.location.origin}${window.location.pathname}#tl=${encodeURIComponent(data)}`;
      await navigator.clipboard.writeText(url);
      setShareUrl(url);
      setTimeout(() => setShareUrl(''), 2000);
    } catch {}
  };

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider flex items-center justify-between" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          <span>Build your own tier list</span>
          <div className="flex gap-2">
            <button type="button" onClick={share} className="text-[11px] px-2 py-0.5 rounded-md" style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}>{shareUrl ? 'URL copied' : 'Share'}</button>
            <button type="button" onClick={reset} className="text-[11px] px-2 py-0.5 rounded-md" style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}>Reset to Vlad's</button>
          </div>
        </div>

        <div className="p-3 sm:p-5 grid gap-2">
          {TIER_ORDER.map((tier) => (
            <div
              key={tier}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(tier)}
              className="rounded-md p-3 transition"
              style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="font-display text-2xl font-semibold w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: TIER_COLOR[tier], color: tier === 'B' ? '#0E0F11' : 'white' }}
                >
                  {tier === 'pool' ? '·' : tier}
                </div>
                <div className="text-xs" style={{ color: 'rgb(var(--muted))' }}>{TIER_DESC[tier]}</div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 min-h-[28px]">
                {byTier[tier].map((tool) => (
                  <button
                    key={tool}
                    draggable
                    onDragStart={() => onDragStart(tool)}
                    className="text-xs px-2 py-1 rounded-md cursor-grab active:cursor-grabbing select-none"
                    style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4 text-xs" style={{ color: 'rgb(var(--muted))' }}>
          Drag tools between tiers. State saves locally. <em>Share</em> copies a URL with your tier list encoded — paste it anywhere.
        </div>
      </div>
    </div>
  );
}
