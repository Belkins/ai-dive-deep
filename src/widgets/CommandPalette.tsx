import { useEffect, useMemo, useRef, useState } from 'react';

type Item = { type: 'chapter' | 'page' | 'glossary'; title: string; subtitle?: string; href: string; keywords?: string };

// These are populated at module load — small enough to inline.
import { CHAPTERS } from '@/lib/chapters';
import { glossary } from '@/lib/glossary';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseUrl = (typeof window !== 'undefined' && (window as any).BASE_URL) || (import.meta as any).env?.BASE_URL || '/';
  const base = baseUrl.replace(/\/$/, '');

  const items: Item[] = useMemo(() => {
    const chapterItems: Item[] = CHAPTERS.map((c) => ({
      type: 'chapter',
      title: `${String(c.number).padStart(2, '0')} — ${c.title}`,
      subtitle: c.subtitle,
      href: `${base}/chapters/${c.slug}`,
      keywords: `${c.title} ${c.subtitle}`.toLowerCase(),
    }));
    const pages: Item[] = [
      { type: 'page', title: 'How to read this book', href: `${base}/how-to-read`,     subtitle: 'The prologue — start here if new' },
      { type: 'page', title: 'Day zero',              href: `${base}/day-zero`,        subtitle: 'First 30 minutes, 12 steps' },
      { type: 'page', title: 'The journey',           href: `${base}/journey`,         subtitle: 'Six parts. One arc.' },
      { type: 'page', title: 'Questions people ask',  href: `${base}/questions`,       subtitle: "Top questions from Vlad's inbox" },
      { type: 'page', title: "Vlad's CC setup",        href: `${base}/showcase`,        subtitle: '62 skills + 32 agents + 12 plugins' },
      { type: 'page', title: "Vlad's Cowork setup",    href: `${base}/cowork-setup`,    subtitle: 'Connectors + scheduled tasks (sanitized)' },
      { type: 'page', title: 'Sections',              href: `${base}/sections`,        subtitle: 'Chapters by theme' },
      { type: 'page', title: 'Glossary',              href: `${base}/glossary`,        subtitle: '30+ terms you need' },
      { type: 'page', title: 'Resources',             href: `${base}/resources`,       subtitle: '15 prompts + templates + hooks' },
      { type: 'page', title: 'Tier list',             href: `${base}/tier-list`,       subtitle: 'Drag-and-drop yours' },
      { type: 'page', title: 'Cheat sheet',           href: `${base}/cheat-sheet`,     subtitle: 'Print + tape it up' },
      { type: 'page', title: '30-day plan',           href: `${base}/thirty-day-plan`, subtitle: 'Custom roadmap' },
      { type: 'page', title: 'About',                 href: `${base}/about`,           subtitle: 'Vlad + portfolio + newsletter' },
    ];
    const glossaryItems: Item[] = Object.keys(glossary).map((term) => ({
      type: 'glossary',
      title: term,
      subtitle: glossary[term].definition.slice(0, 80) + '…',
      href: `${base}/glossary#${encodeURIComponent(term)}`,
      keywords: `${term} ${glossary[term].definition}`.toLowerCase(),
    }));
    return [...pages, ...chapterItems, ...glossaryItems];
  }, [base]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items.slice(0, 24);
    const needle = q.toLowerCase();
    return items
      .filter((it) => (it.title + ' ' + (it.subtitle || '') + ' ' + (it.keywords || '')).toLowerCase().includes(needle))
      .slice(0, 24);
  }, [q, items]);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    window.addEventListener('open-palette', onOpen);
    return () => window.removeEventListener('open-palette', onOpen);
  }, []);

  useEffect(() => { setActive(0); }, [q, open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(filtered.length - 1, i + 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
      if (e.key === 'Enter')     {
        e.preventDefault();
        const it = filtered[active];
        if (it) window.location.href = it.href;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32 px-4"
      style={{ background: 'rgb(0 0 0 / 0.6)' }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-xl overflow-hidden shadow-2xl"
        style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'rgb(var(--line))' }}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'rgb(var(--muted))' }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search chapters, pages, glossary…"
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: 'rgb(var(--fg))' }}
          />
          <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>esc</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 && <div className="px-4 py-8 text-sm text-center" style={{ color: 'rgb(var(--muted))' }}>No matches.</div>}
          {filtered.map((it, idx) => (
            <a
              key={it.href}
              href={it.href}
              className="flex items-center gap-3 px-4 py-2.5 no-underline"
              style={{ background: idx === active ? 'rgb(var(--line) / 0.6)' : 'transparent', color: 'rgb(var(--fg))' }}
              onMouseEnter={() => setActive(idx)}
            >
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>{it.type}</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{it.title}</div>
                {it.subtitle && <div className="text-xs truncate" style={{ color: 'rgb(var(--muted))' }}>{it.subtitle}</div>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
