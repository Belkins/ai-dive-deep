import { useEffect, useMemo, useRef, useState } from 'react';

type Item = { type: 'chapter' | 'page' | 'section' | 'glossary' | 'note'; title: string; subtitle?: string; href: string; keywords?: string };

// These are populated at module load — small enough to inline.
import { CHAPTERS } from '@/lib/chapters';
import { glossary } from '@/lib/glossary';
import { RESEARCH_NOTES } from '@/lib/research-notes';

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Deep-link section anchors so Cmd-K resolves "permissions", "hooks",
// "model routing", etc. straight to the right block on long reference pages.
// Mirrors the section titles in cheat-sheet.astro / resources.astro toc.
const CHEAT_SHEET_SECTIONS = [
  'Daily slash commands', 'CLI flags', 'Settings.json keys', 'File paths',
  'Environment vars', 'Keyboard shortcuts', 'Hook events (90% rule)', 'Cron syntax',
  'Permission rule syntax', 'Subagent frontmatter', 'SKILL.md frontmatter',
  '.mcp.json shape', 'Hook JSON shape', 'Headless / CI one-liners',
  'Plan → Auto → /goal ladder', 'Model routing + cost',
];
const HTMLFIRST_SECTIONS: { id: string; label: string }[] = [
  { id: 'the-case', label: 'The case for HTML-first' },
  { id: 'case-afc', label: 'AFC — idea became a company' },
  { id: 'case-audit', label: 'The 90-domain deliverability audit' },
  { id: 'do-this', label: 'Do this Monday' },
];
const SOVEREIGN_SECTIONS: { id: string; label: string }[] = [
  { id: 'two-stack', label: 'The two-stack thesis' },
  { id: 'leaderboard', label: 'The 2026 open-weights bench' },
  { id: 'runtimes', label: 'Ollama, LM Studio, the rest' },
  { id: 'hardware', label: 'Hardware — five tiers' },
  { id: 'quant-ctx', label: 'Quantization + context math' },
  { id: 'vs-closed', label: 'Open vs closed — honest' },
  { id: 'heretic', label: 'The heretic question' },
  { id: 'mythos', label: 'The Mythos lesson' },
  { id: 'nanogpt', label: 'nano-gpt — a Saturday' },
  { id: 'watch', label: 'The 6-month watch' },
  { id: 'monday', label: 'Do this Monday' },
];
const RESOURCES_SECTIONS: { id: string; label: string }[] = [
  { id: 'working-memory', label: 'Working memory (CLAUDE.md)' },
  { id: 'connectors-mcp', label: 'Connectors / MCP' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'subagents', label: 'Subagents (custom agent .md)' },
  { id: 'sandboxes', label: 'Sandboxes (Docker / devcontainer)' },
  { id: 'skill-md-templates', label: 'SKILL.md templates' },
  { id: 'five-reusable-prompts', label: 'Five reusable prompts' },
  { id: 'ten-more-operator-prompts', label: 'Eighteen more operator prompts' },
  { id: 'github-action', label: 'GitHub Action' },
];

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
      { type: 'page', title: 'Starter skills',         href: `${base}/starter-skills`,  subtitle: 'Six drop-in SKILL.md files' },
      { type: 'page', title: 'Vault starter',          href: `${base}/vault-starter`,   subtitle: 'PARA vs 7 others. Project-as-entity. Working vault to clone.' },
      { type: 'page', title: 'Weekend builds',         href: `${base}/weekend-builds`,  subtitle: '8 Saturday-ship recipes + the trap pick' },
      { type: 'page', title: 'For your CFO',           href: `${base}/cfo-case`,        subtitle: '600 words. Defend the spend.' },
      { type: 'page', title: 'Build vs Buy',           href: `${base}/build-vs-buy`,    subtitle: 'Sequencing wedge + cost ladder + 5-question matrix' },
      { type: 'page', title: 'Research notes',         href: `${base}/research-notes`,  subtitle: 'External findings that shift what to do Monday' },
      { type: 'page', title: 'The journey',           href: `${base}/journey`,         subtitle: 'Six parts. One arc.' },
      { type: 'page', title: 'Questions people ask',  href: `${base}/questions`,       subtitle: "Top questions from Vlad's inbox" },
      { type: 'page', title: "Vlad's CC setup",        href: `${base}/showcase`,        subtitle: '62 skills + 32 agents + 12 plugins' },
      { type: 'page', title: "Vlad's Cowork setup",    href: `${base}/cowork-setup`,    subtitle: 'Connectors + scheduled tasks (sanitized)' },
      { type: 'page', title: 'Sections',              href: `${base}/sections`,        subtitle: 'Chapters by theme' },
      { type: 'page', title: 'Glossary',              href: `${base}/glossary`,        subtitle: `${Object.keys(glossary).length} terms, A–Z` },
      { type: 'page', title: 'Resources',             href: `${base}/resources`,       subtitle: 'Copy-paste templates, hooks, prompts' },
      { type: 'page', title: 'The launch (Edition 6 is public)', href: `${base}/launch`,    subtitle: 'May 20, 2026 — the repo is open; the source is the recipe' },
      { type: 'page', title: 'Launch week — live receipts', href: `${base}/launch-week`, subtitle: 'The launch as its own experiment in the thesis. Numbers as they come in.' },
      { type: 'page', title: 'HTML-ization',          href: `${base}/html-first`,      subtitle: 'Stop sending dead files — 2 live, clickable case studies' },
      { type: 'page', title: 'The Sovereign Stack',   href: `${base}/sovereign-stack`, subtitle: 'Open-weights LLMs that survive the deprecation calendar — Ollama, hardware, the heretic question, nano-gpt' },
      { type: 'page', title: 'The 12-rule CLAUDE.md', href: `${base}/claude-md-rules`, subtitle: 'Karpathy at 11%. Operator overlay gets to 3%.' },
      { type: 'page', title: 'Tier list',             href: `${base}/tier-list`,       subtitle: 'Drag-and-drop yours' },
      { type: 'page', title: 'Cheat sheet',           href: `${base}/cheat-sheet`,     subtitle: 'Print + tape it up' },
      { type: 'page', title: '30-day plan',           href: `${base}/thirty-day-plan`, subtitle: 'Custom roadmap' },
      { type: 'page', title: 'About',                 href: `${base}/about`,           subtitle: 'Vlad + portfolio + newsletter' },
      { type: 'page', title: 'Changelog',             href: `${base}/changelog`,       subtitle: "What's new in each edition" },
    ];
    const glossaryItems: Item[] = Object.keys(glossary).map((term) => ({
      type: 'glossary',
      title: term,
      subtitle: glossary[term].definition.replace(/<[^>]+>/g, '').slice(0, 80) + '…',
      href: `${base}/glossary#${encodeURIComponent(term)}`,
      keywords: `${term} ${glossary[term].definition}`.toLowerCase(),
    }));
    const sectionItems: Item[] = [
      ...CHEAT_SHEET_SECTIONS.map((h) => ({
        type: 'section' as const,
        title: h,
        subtitle: 'Cheat sheet',
        href: `${base}/cheat-sheet#${slugify(h)}`,
        keywords: `cheat sheet ${h}`.toLowerCase(),
      })),
      ...RESOURCES_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Resources',
        href: `${base}/resources#${s.id}`,
        keywords: `resources ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...HTMLFIRST_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'HTML-ization',
        href: `${base}/html-first#${s.id}`,
        keywords: `html-ization htmlization html first artifact ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...SOVEREIGN_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'The Sovereign Stack',
        href: `${base}/sovereign-stack#${s.id}`,
        keywords: `sovereign stack open source llm ollama lm studio kimi qwen glm deepseek heretic abliteration nano-gpt karpathy mythos ${s.label} ${s.id}`.toLowerCase(),
      })),
    ];
    const noteItems: Item[] = RESEARCH_NOTES.map((n) => ({
      type: 'note',
      title: n.title,
      subtitle: n.tagline,
      href: `${base}/research-notes`,
      keywords: `${n.title} ${n.tagline} ${(n.implications || []).join(' ')}`.toLowerCase(),
    }));
    return [...pages, ...chapterItems, ...sectionItems, ...glossaryItems, ...noteItems];
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
            placeholder="Search chapters, pages, sections, glossary, notes…"
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
