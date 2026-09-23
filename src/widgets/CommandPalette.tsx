import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, Delete, Search, X } from 'lucide-react';
import { createSearchIndex, MAX_SEARCH_QUERY_LENGTH, moveSearchSelection, POPULAR_PATHS, searchItems } from '@/lib/search';
import type { SearchResult } from '@/lib/search';
import { getPaletteItems } from '@/lib/search-catalog';
export { getPaletteItems };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const navigatingRef = useRef(false);
  const listboxId = useId();

  const baseUrl = (typeof window !== 'undefined' && (window as any).BASE_URL) || (import.meta as any).env?.BASE_URL || '/';
  const base = baseUrl.replace(/\/$/, '');
  const items = useMemo(() => getPaletteItems(base), [base]);

  const index = useMemo(() => createSearchIndex(items), [items]);
  const popularHrefs = useMemo(() => POPULAR_PATHS.map((path) => `${base}${path}`), [base]);
  const filtered = useMemo(() => searchItems(index, q, popularHrefs), [index, q, popularHrefs]);
  const exactCount = filtered.filter((item) => !item.fuzzy).length;
  const activeIndex = filtered.length ? Math.max(0, Math.min(active, filtered.length - 1)) : -1;
  const activeId = activeIndex < 0 ? undefined : `${listboxId}-option-${activeIndex}`;

  useEffect(() => {
    const onOpen = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        return;
      }
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      navigatingRef.current = false;
      setActive(0);
      setOpen(true);
    };
    const onNavigate = () => { navigatingRef.current = true; setOpen(false); };
    window.addEventListener('open-palette', onOpen);
    document.addEventListener('astro:before-swap', onNavigate);
    const root = document.getElementById('cc-palette-root');
    if (root) {
      root.dataset.paletteReady = 'true';
      root.dispatchEvent(new Event('palette-ready'));
      if (root.dataset.openRequested === 'true') {
        delete root.dataset.openRequested;
        onOpen();
      }
    }
    return () => {
      window.removeEventListener('open-palette', onOpen);
      document.removeEventListener('astro:before-swap', onNavigate);
      if (root) delete root.dataset.paletteReady;
    };
  }, []);

  useEffect(() => {
    if (open && activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId, open, filtered]);

  // PostHog: capture searches (debounced 500ms) and clicks. No-op when
  // window.posthog isn't loaded (env var absent or ad-blocker active).
  useEffect(() => {
    if (!open || !q.trim()) return;
    const t = setTimeout(() => {
      const ph = (window as any).posthog;
      if (ph?.capture) ph.capture('cmd_k_search', { query: q, result_count: filtered.length });
    }, 500);
    return () => clearTimeout(t);
  }, [q, open, filtered.length]);

  const trackClick = (it: SearchResult, position: number) => {
    const ph = (window as any).posthog;
    if (ph?.capture) ph.capture('cmd_k_click', { query: q, href: it.href, type: it.type, position, fuzzy: it.fuzzy });
  };

  const handleSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(moveSearchSelection(activeIndex, filtered.length, event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeId) document.getElementById(activeId)?.click();
    }
  };

  const clearSearch = () => {
    setQ('');
    setActive(0);
    inputRef.current?.focus();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: 'rgb(0 0 0 / 0.6)' }} />
        <Dialog.Content
          className="fixed top-16 sm:top-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col max-h-[calc(100dvh-6rem)] rounded-lg overflow-hidden shadow-2xl"
          style={{ width: 'min(36rem, calc(100vw - 2rem))', background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}
          onOpenAutoFocus={(event) => { event.preventDefault(); inputRef.current?.focus(); }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (navigatingRef.current) return;
            const opener = openerRef.current?.isConnected ? openerRef.current : document.getElementById('open-palette-btn');
            opener?.focus({ preventScroll: true });
          }}
        >
          <Dialog.Title className="sr-only">Search the playbook</Dialog.Title>
          <Dialog.Description className="sr-only">Chapters, pages, sections, glossary terms, and research notes.</Dialog.Description>
          <div className="flex shrink-0 items-center gap-2 px-3 py-3 border-b" style={{ borderColor: 'rgb(var(--line))' }}>
            <Search aria-hidden="true" className="h-4 w-4 shrink-0" style={{ color: 'rgb(var(--muted))' }} />
            <input
              ref={inputRef}
              value={q}
              onChange={(event) => { setQ(event.target.value); setActive(0); }}
              onKeyDown={handleSearchKey}
              role="combobox"
              aria-label="Search the playbook"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-activedescendant={activeId}
              autoComplete="off"
              spellCheck={false}
              maxLength={MAX_SEARCH_QUERY_LENGTH}
              enterKeyHint="go"
              placeholder="Search the playbook…"
              className="min-w-0 flex-1 bg-transparent outline-none text-base"
              style={{ color: 'rgb(var(--fg))' }}
            />
            {q && (
              <button type="button" onClick={clearSearch} aria-label="Clear search" title="Clear search" className="flex h-9 w-9 shrink-0 items-center justify-center rounded hover:bg-white/5" style={{ color: 'rgb(var(--muted))' }}>
                <Delete aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
            <Dialog.Close aria-label="Close search" title="Close search (Escape)" className="flex h-9 w-9 shrink-0 items-center justify-center rounded hover:bg-white/5" style={{ color: 'rgb(var(--fg))', border: '1px solid rgb(var(--line))' }}>
              <X aria-hidden="true" className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {!q.trim() ? `${filtered.length} popular pages.` : filtered.length ? `${filtered.length} results. ${filtered.length - exactCount} approximate matches.` : 'No matches.'}
          </div>
          <div className="min-h-0 max-h-[60dvh] overflow-y-auto">
            {!q.trim() && filtered.length > 0 && (
              <div className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>Popular</div>
            )}
            <div id={listboxId} role="listbox" aria-label={q.trim() ? 'Search results' : 'Popular pages'}>
              {filtered.map((it, idx) => (
                <div key={it.id} role="presentation">
                  {it.fuzzy && idx === exactCount && (
                    <div aria-hidden="true" className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider border-t" style={{ color: 'rgb(var(--muted))', borderColor: 'rgb(var(--line))' }}>Approximate matches</div>
                  )}
                  <a
                    id={`${listboxId}-option-${idx}`}
                    role="option"
                    aria-selected={idx === activeIndex}
                    tabIndex={-1}
                    href={it.href}
                    className="flex items-center gap-3 px-4 py-2.5 no-underline"
                    style={{ background: idx === activeIndex ? 'rgb(var(--line) / 0.6)' : 'transparent', color: 'rgb(var(--fg))', opacity: it.fuzzy ? 0.75 : 1 }}
                    onMouseEnter={() => setActive(idx)}
                    onMouseDown={(event) => { if (event.button === 0) event.preventDefault(); }}
                    onClick={(event) => {
                      trackClick(it, idx);
                      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                        navigatingRef.current = true;
                        setOpen(false);
                      }
                    }}
                  >
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>{it.type}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate" style={{ fontStyle: it.fuzzy ? 'italic' : 'normal' }}>{it.title}</div>
                      {it.subtitle && <div className="text-xs truncate" style={{ color: 'rgb(var(--muted))' }}>{it.subtitle}</div>}
                      {it.fuzzy && <span className="sr-only">Approximate match</span>}
                    </div>
                  </a>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-sm text-center" style={{ color: 'rgb(var(--muted))' }}>
                <p className="m-0">No matches.</p>
                <a href={`${base}/library/`} onClick={() => { navigatingRef.current = true; setOpen(false); }} className="mt-4 inline-flex items-center gap-2" style={{ color: 'rgb(var(--accent))' }}>
                  <BookOpen aria-hidden="true" className="h-4 w-4" /> Browse chapters
                </a>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
