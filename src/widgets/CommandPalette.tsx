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
  { id: 'portfolio', label: 'More across the portfolio' },
  { id: 'recipe', label: 'The recipe — Saturday walkthrough' },
  { id: 'gallery', label: 'Applications gallery (12 shapes)' },
  { id: 'not-for-everything', label: 'Where it fails (anti-cases)' },
  { id: 'in-the-wild', label: 'The pattern in the wild (12 public)' },
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
// Per-chapter synonyms — model names, company names, and use-case terms that
// readers type into Cmd-K but don't appear in chapter titles/subtitles.
const CHAPTER_SYNONYMS: Record<string, string> = {
  '02-five-tools':      'chatgpt cursor windsurf claude code cowork picker which tool model picker',
  '03-temp-agency':     'context window memory state amnesia session forgets',
  '04-the-vault':       'obsidian PARA notes zettelkasten knowledge graph working memory',
  '08-three-doors':     'chat cowork claude code which mode picker door',
  '09-dont-get-owned':  'security secrets api key blast radius hygiene attack owned',
  '10-wild-stuff':      'hosted agents local models frontier openai anthropic google deepmind meta xai grok llama gpt opus sonnet haiku gemini',
  '12-connectors-mcp':  'mcp connectors model context protocol install server custom',
  '15-permissions':     'permissions sandbox docker devcontainer yolo skip dangerous',
  '17-tips-tricks':     'tips tricks operator wisdom 25',
  '18-headless-ci':     'headless CI claude --print pipeline automation production github actions',
  '24-tier-list':       'tier list ranking compare which model best leaderboard lmarena chatgpt gpt gpt-5 gpt-4 o1 o3 claude opus sonnet haiku gemini grok deepseek qwen llama mistral kimi glm anthropic openai google meta xai',
  '25-evals-or-hope':   'evals benchmark smoke regression golden testing eval',
  '27-voice-agents':    'voice STT TTS speech elevenlabs cartesia deepgram phone call agent',
  '29-cost-economics':  'cost economics bill pricing tokens cents caching batch routing api openai anthropic google',
  '30-sdk-direct':      'sdk anthropic typescript python direct api drop cc claude api',
  '32-archetypes-rick': 'agent archetypes rick platform openclaw nemoclaw hermes',
  '33-browser-agents':  'browser agents playwright scrape login click post automation',
  '34-write-on-behalf': 'persona agents write on behalf newsletter social ghostwriter writing email outreach',
  '35-codex-and-cc':    'codex openai claude code anthropic gemini google day shift night shift compare',
  '36-frameworks-beyond':'frameworks crewai langgraph sdk alternatives openai assistants beyond',
  '37-context-files':   'claude.md memory skills conventions context files',
};

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
      keywords: `${c.title} ${c.subtitle} ${CHAPTER_SYNONYMS[c.slug] || ''}`.toLowerCase(),
    }));
    const pages: Item[] = [
      { type: 'page', title: 'How to read this book', href: `${base}/how-to-read`,     subtitle: 'The prologue — start here if new',                                                                  keywords: 'prologue start beginner first time intro reading guide' },
      { type: 'page', title: 'Day zero',              href: `${base}/day-zero`,        subtitle: 'First 30 minutes, 12 steps',                                                                          keywords: 'day zero getting started onboarding first install setup quickstart' },
      { type: 'page', title: 'Starter skills',         href: `${base}/starter-skills`,  subtitle: 'Six drop-in SKILL.md files',                                                                          keywords: 'starter skill SKILL.md template recipe drop-in' },
      { type: 'page', title: 'Vault starter',          href: `${base}/vault-starter`,   subtitle: 'PARA vs 7 others. Project-as-entity. Working vault to clone.',                                       keywords: 'vault obsidian PARA notes zettelkasten knowledge graph clone' },
      { type: 'page', title: 'Weekend builds',         href: `${base}/weekend-builds`,  subtitle: '8 Saturday-ship recipes + the trap pick',                                                             keywords: 'weekend saturday recipe build mvp side project ship' },
      { type: 'page', title: 'For your CFO',           href: `${base}/cfo-case`,        subtitle: '600 words. Defend the spend.',                                                                        keywords: 'cfo finance budget cost spend roi defend executive business case' },
      { type: 'page', title: 'Build vs Buy',           href: `${base}/build-vs-buy`,    subtitle: 'Sequencing wedge + cost ladder + 5-question matrix',                                                  keywords: 'build buy make purchase cost ladder sequencing matrix vendor saas' },
      { type: 'page', title: 'Research notes',         href: `${base}/research-notes`,  subtitle: 'External findings that shift what to do Monday',                                                      keywords: 'research notes findings external signal evidence gemini claude anthropic openai mythos karpathy' },
      { type: 'page', title: 'The journey',           href: `${base}/journey`,         subtitle: 'Six parts. One arc.',                                                                                 keywords: 'journey arc path roadmap parts' },
      { type: 'page', title: 'Questions people ask',  href: `${base}/questions`,       subtitle: "Top questions from Vlad's inbox",                                                                     keywords: 'faq questions common asked help' },
      { type: 'page', title: "Vlad's CC setup",        href: `${base}/showcase`,        subtitle: '62 skills + 32 agents + 12 plugins',                                                                  keywords: 'showcase claude code setup skills agents plugins configuration mine' },
      { type: 'page', title: "Vlad's Cowork setup",    href: `${base}/cowork-setup`,    subtitle: 'Connectors + scheduled tasks (sanitized)',                                                            keywords: 'cowork claude.ai setup connectors scheduled tasks routines' },
      { type: 'page', title: 'Sections',              href: `${base}/sections`,        subtitle: 'Chapters by theme',                                                                                   keywords: 'sections themes chapters parts table of contents toc' },
      { type: 'page', title: 'Glossary',              href: `${base}/glossary`,        subtitle: `${Object.keys(glossary).length} terms, A–Z`,                                                          keywords: 'glossary terms definitions vocabulary a-z dictionary' },
      { type: 'page', title: 'Resources',             href: `${base}/resources`,       subtitle: 'Copy-paste templates, hooks, prompts',                                                                keywords: 'resources templates hooks prompts subagents claude.md mcp permissions copy paste' },
      { type: 'page', title: 'The launch (Edition 6 is public)', href: `${base}/launch`,    subtitle: 'May 20, 2026 — the repo is open; the source is the recipe',                                       keywords: 'launch edition 6 7 8 public open repo announcement github' },
      { type: 'page', title: 'Launch week — live receipts', href: `${base}/launch-week`, subtitle: 'The launch as its own experiment in the thesis. Numbers as they come in.',                          keywords: 'launch week numbers receipts day-by-day live metrics analytics' },
      { type: 'page', title: 'HTML-ization',          href: `${base}/html-first`,      subtitle: 'Stop sending dead files — 2 live, clickable case studies',                                            keywords: 'html-ization htmlization html-first html first interactive artifact deliverable single-file static page case study clickable afc folderly audit' },
      { type: 'page', title: 'The Sovereign Stack',   href: `${base}/sovereign-stack`, subtitle: 'Open-weights LLMs that survive the deprecation calendar — Ollama, hardware, the heretic question, nano-gpt', keywords: 'sovereign stack open source weights local llm on-device edge ollama lm studio kimi qwen glm deepseek llama mistral grok gpt-oss heretic abliteration nano-gpt nanogpt karpathy mythos hardware mac studio rtx 3090 4090 mythos meta google deepmind anthropic openai xai zhipu alibaba' },
      { type: 'page', title: 'The 12-rule CLAUDE.md', href: `${base}/claude-md-rules`, subtitle: 'Karpathy at 11%. Operator overlay gets to 3%.',                                                       keywords: 'claude.md rules karpathy twelve 12 conventions context file always-loaded operator overlay' },
      { type: 'page', title: 'Tier list',             href: `${base}/tier-list`,       subtitle: 'Drag-and-drop yours',                                                                                 keywords: 'tier list ranking compare which model best leaderboard lmarena chatgpt gpt gpt-5 gpt-4 o1 o3 claude opus sonnet haiku gemini grok deepseek qwen llama mistral kimi glm anthropic openai google meta xai cohere perplexity' },
      { type: 'page', title: 'Cheat sheet',           href: `${base}/cheat-sheet`,     subtitle: 'Print + tape it up',                                                                                  keywords: 'cheat sheet reference quick cmd-k command palette search slash commands settings shortcut keyboard print' },
      { type: 'page', title: '30-day plan',           href: `${base}/thirty-day-plan`, subtitle: 'Custom roadmap',                                                                                      keywords: '30 day thirty plan roadmap onboarding schedule monthly week-by-week' },
      { type: 'page', title: 'About',                 href: `${base}/about`,           subtitle: 'Vlad + portfolio + newsletter',                                                                       keywords: 'about vlad podoliako belkins folderly lingualive nocancer portfolio playbook author bio newsletter' },
      { type: 'page', title: 'Changelog',             href: `${base}/changelog`,       subtitle: "What's new in each edition",                                                                          keywords: 'changelog edition history versions updates release notes whats new' },
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
        keywords: `html-ization htmlization html-first html first interactive artifact deliverable single-file static page case study ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...SOVEREIGN_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'The Sovereign Stack',
        href: `${base}/sovereign-stack#${s.id}`,
        keywords: `sovereign stack open source weights local llm on-device edge ollama lm studio kimi qwen glm deepseek llama mistral grok gpt-oss heretic abliteration nano-gpt nanogpt karpathy mythos hardware openai anthropic google deepmind meta xai zhipu alibaba ${s.label} ${s.id}`.toLowerCase(),
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
