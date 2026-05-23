import { useEffect, useMemo, useRef, useState } from 'react';

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

// Vlad's picks — updated May 2026. Public leaderboards rank capability;
// operators rank usefulness. These are usefulness rankings.
const DEFAULT_PLACEMENTS: Record<string, Tier> = {
  // S — load-bearing
  'Claude Code': 'S',
  'Cowork': 'S',
  'Perplexity': 'S',
  'Nano Banana': 'S',
  'ElevenLabs': 'S',
  'SeeDance': 'S',
  // A — open every day
  'Gemini Pro': 'A',
  'Codex (OpenAI)': 'A',
  'Suno': 'A',
  'OpenClaw': 'A',
  'Hermes': 'A',
  'NemoClaw': 'A',
  'Kimi 2.6': 'A',
  // B — useful for one job
  'Claude web chat': 'B',
  'Grok': 'B',
  'ChatGPT': 'B',
  'Cursor': 'B',
  'DeepSeek': 'B',
  // C — see the appeal, not for me
  'GitHub Copilot': 'C',
  'Notion AI': 'C',
  'Replit': 'C',
  // D — exists
  'AutoGPT': 'D',
  'Wrappers': 'D',
  // F — actively bad
  'AI girlfriends': 'F',
  '"ChatGPT killer" reskins': 'F',
};

const ALL_TOOLS = Object.keys(DEFAULT_PLACEMENTS);
const STORAGE_KEY = 'cc-tier-list';

export default function TierListBuilder() {
  const [placements, setPlacements] = useState<Record<string, Tier>>(DEFAULT_PLACEMENTS);
  const [draggingTool, setDraggingTool] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [canNativeShare, setCanNativeShare] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Hydrate from URL hash or localStorage
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
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

  // Close share popover on outside click
  useEffect(() => {
    if (!shareOpen) return;
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShareOpen(false); };
    setTimeout(() => document.addEventListener('click', onClick), 0);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [shareOpen]);

  const byTier = useMemo(() => {
    const out: Record<Tier, string[]> = { S: [], A: [], B: [], C: [], D: [], F: [], pool: [] };
    for (const tool of ALL_TOOLS) out[placements[tool] ?? 'pool'].push(tool);
    return out;
  }, [placements]);

  // Share URLs route through the OG sidecar (Vercel project ai-dive-deep-og).
  // The sidecar serves an HTML page with a dynamic og:image rendered from the
  // base64 payload, then JS-redirects humans to the canonical page (where the
  // same payload is loaded via #tl= hash). Twitter/LinkedIn unfurl bots scrape
  // the OG meta on the sidecar page before any redirect, so every share's
  // unfurl shows the recipient's actual tier list.
  // When Vlad maps og.vladyslavpodoliako.com → cname.vercel-dns.com, flip
  // OG_HOST to https://og.vladyslavpodoliako.com.
  const OG_HOST = 'https://ai-dive-deep-og.vercel.app';

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    try {
      const data = btoa(JSON.stringify(placements));
      return `${OG_HOST}/s/${encodeURIComponent(data)}`;
    } catch {
      return '';
    }
  }, [placements]);

  const sTierCount = byTier.S.length;
  const shareText = `My AI tools tier list — ${sTierCount} tools in S-tier. What's yours?`;

  const onDragStart = (tool: string) => setDraggingTool(tool);
  const onDrop = (tier: Tier) => {
    if (!draggingTool) return;
    setPlacements((prev) => ({ ...prev, [draggingTool]: tier }));
    setDraggingTool(null);
  };

  const reset = () => setPlacements({ ...DEFAULT_PLACEMENTS });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 1800);
    } catch {}
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "Vlad's Playbook — tier list", text: shareText, url: shareUrl });
    } catch {}
  };

  return (
    <div className="container-wide" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider flex items-center justify-between gap-3 flex-wrap relative" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          <span>Build your own tier list</span>
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShareOpen((v) => !v); }}
              className="text-[11px] px-2 py-0.5 rounded-md inline-flex items-center gap-1.5"
              style={{ border: '1px solid rgb(var(--accent))', color: 'rgb(var(--accent))', background: 'rgb(var(--accent) / 0.08)' }}
              aria-expanded={shareOpen}
              aria-haspopup="dialog"
            >
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Share
            </button>
            <button type="button" onClick={reset} className="text-[11px] px-2 py-0.5 rounded-md" style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}>Reset to Vlad's</button>
          </div>

          {shareOpen && (
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Share your tier list"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-3 top-12 z-20 w-[min(380px,calc(100vw-2rem))] rounded-lg p-3 normal-case"
              style={{
                background: 'rgb(var(--bg))',
                border: '1px solid rgb(var(--line))',
                boxShadow: '0 12px 32px rgb(0 0 0 / 0.5)',
                color: 'rgb(var(--fg))',
                letterSpacing: 'normal',
              }}
            >
              <div className="text-xs mb-2" style={{ color: 'rgb(var(--muted))' }}>
                Your tier list is encoded in the URL. Anyone who opens it sees exactly your placements.
              </div>

              <div className="flex items-stretch gap-1.5 mb-2">
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 text-[11px] px-2 py-1.5 rounded-md font-mono truncate"
                  style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}
                  aria-label="Shareable URL"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="text-[11px] px-2.5 py-1.5 rounded-md whitespace-nowrap"
                  style={{ background: copyStatus === 'copied' ? 'rgb(var(--accent-2))' : 'rgb(var(--accent))', color: copyStatus === 'copied' ? 'rgb(var(--bg))' : 'white', border: '0', fontWeight: 500 }}
                >
                  {copyStatus === 'copied' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <a
                  href={tweetUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-[11px] px-2 py-1.5 rounded-md inline-flex items-center justify-center gap-1.5 no-underline"
                  style={{ border: '1px solid rgb(var(--line))', background: 'rgb(var(--paper))', color: 'rgb(var(--fg))' }}
                >
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Tweet
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-[11px] px-2 py-1.5 rounded-md inline-flex items-center justify-center gap-1.5 no-underline"
                  style={{ border: '1px solid rgb(var(--line))', background: 'rgb(var(--paper))', color: 'rgb(var(--fg))' }}
                >
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93s-1.62.59-1.62 2v4.67h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                  LinkedIn
                </a>
                {canNativeShare && (
                  <button
                    type="button"
                    onClick={nativeShare}
                    className="text-[11px] px-2 py-1.5 rounded-md inline-flex items-center justify-center gap-1.5 col-span-2"
                    style={{ border: '1px solid rgb(var(--line))', background: 'rgb(var(--paper))', color: 'rgb(var(--fg))' }}
                  >
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Share via device
                  </button>
                )}
              </div>

              <div className="mt-2 text-[10px]" style={{ color: 'rgb(var(--muted))' }}>
                S-tier ({sTierCount}): {byTier.S.slice(0, 4).join(', ')}{byTier.S.length > 4 ? `, +${byTier.S.length - 4}` : ''}
              </div>
            </div>
          )}
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
          Drag tools between tiers. State saves locally. <em>Share</em> opens copy / Tweet / LinkedIn / device share — the URL encodes every placement, so whoever opens it sees exactly your tiers.
        </div>
      </div>
    </div>
  );
}
