import { useMemo, useState } from 'react';

type Q = {
  q: string;
  short: string;
  answer: string;
  chapters: { slug: string; label: string }[];
  category: 'getting-started' | 'building' | 'security' | 'agents' | 'team' | 'cost';
};

const QUESTIONS: Q[] = [
  // Getting started
  {
    q: "What's the difference between Chat, Cowork, Claude Code, and the API?",
    short: "Same model, three vehicles, plus the engine room.",
    answer: "Chat is the sedan — phone, casual, no connectors. Cowork is the SUV — daily ops, talks to Slack/HubSpot/calendar, scheduled tasks while you sleep. Claude Code is the pickup — repo work, swarms, hooks, real engineering. The Anthropic SDK is the engine — programmatic, what you reach for when CC and Cowork stop being the answer.",
    chapters: [
      { slug: '08-three-doors', label: 'Ch 8 — Three doors to Claude' },
      { slug: '30-sdk-direct', label: 'Ch 30 — Anthropic SDK directly' },
    ],
    category: 'getting-started',
  },
  {
    q: "How do I install Claude Code and get my first prompt running?",
    short: "Five minutes if your terminal works.",
    answer: "npm install -g @anthropic-ai/claude-code, claude --version, cd into a repo, type claude, /init, edit the auto-CLAUDE.md by hand. By minute 11 you've shipped a code change.",
    chapters: [
      { slug: '13-quickstart', label: 'Ch 13 — The 10-minute quickstart' },
      { slug: '14-cheat-sheet', label: 'Ch 14 — The cheat sheet' },
    ],
    category: 'getting-started',
  },
  {
    q: "What should I do tomorrow morning if I want to actually use this?",
    short: "Tick the boxes on the day-zero page.",
    answer: "Twelve concrete steps from clean machine to first scheduled task. GitHub → Vercel → Claude Pro → install CC → install Cowork → vault → CLAUDE.md → first prompt → first skill → first cron → first swarm → security tonight. Each step links to its deep chapter.",
    chapters: [
      { slug: '13-quickstart', label: 'Ch 13 — The 10-minute quickstart' },
    ],
    category: 'getting-started',
  },

  // Building
  {
    q: "How do I create a skill?",
    short: "If you've explained it three times, codify it.",
    answer: "A skill is a folder. SKILL.md is the only required file. Description on top — that's the trigger. Body underneath with steps, output format, anti-patterns. Drop in ~/.claude/skills/, test by typing the natural-language phrase, iterate the description until it fires when you want it.",
    chapters: [
      { slug: '05-skills', label: 'Ch 5 — Recipes the chef reads' },
      { slug: '11-build-a-skill', label: 'Ch 11 — Build a skill end-to-end' },
    ],
    category: 'building',
  },
  {
    q: "How do I use swarms?",
    short: "One conductor, N subagents, one tool batch.",
    answer: "In Claude Code: 'Spawn 3 Explore subagents in parallel — one looks at X, one at Y, one at Z.' One message, multiple Agent calls = true parallelism. Fan-out for breadth, pipeline for depth, map-reduce for scale, adversarial for truth.",
    chapters: [
      { slug: '06-the-swarm', label: 'Ch 6 — The swarm' },
      { slug: '16-hooks-subagents', label: 'Ch 16 — Hooks and subagents' },
    ],
    category: 'building',
  },
  {
    q: "How do I make cron jobs / scheduled tasks?",
    short: "Saved instruction + trigger + delivery target.",
    answer: "In Cowork: type 'every weekday at 7 AM' and the UI generates the cron. In CC headless: claude --print piped through a real crontab. Morning briefing is the highest-leverage first one. Run for two weeks before adding a second.",
    chapters: [
      { slug: '07-cron', label: 'Ch 7 — Cron, while you sleep' },
      { slug: '18-headless-ci', label: 'Ch 18 — Headless and CI' },
    ],
    category: 'building',
  },
  {
    q: "How do I ship a product in a Saturday?",
    short: "Six stages. Hour by hour. Cut the rabbit holes early.",
    answer: "Ideation → Foundation → Creation → Polishing → Security → Deploy. The 'not done' list is more valuable than the 'done' list. Spec at hour 1, URL by hour 2, MVP by hour 6, ship at hour 7 even if it's ugly.",
    chapters: [
      { slug: '19-build-products', label: 'Ch 19 — Build products with AI' },
      { slug: '23-vibe-coding', label: 'Ch 23 — Vibe coding (a Saturday)' },
      { slug: '31-stages', label: 'Ch 31 — The six stages' },
    ],
    category: 'building',
  },

  // Agents — the brief's top questions live here
  {
    q: "How do I make agents like Rick — OpenClaw, NemoClaw, Hermes?",
    short: "Pick a preset, port to a CC subagent when you outgrow it.",
    answer: "Rick is the training-wheels surface. Pick the archetype that matches the job (NemoClaw for sales, OpenClaw for research, Hermes for ops), install via meetrick.ai/install, give it 30 days. Graduate to a CC subagent only when you can name what the preset can't do.",
    chapters: [
      { slug: '32-archetypes-rick', label: 'Ch 32 — How to build Rick' },
      { slug: '10-wild-stuff', label: 'Ch 10 — The wild stuff' },
    ],
    category: 'agents',
  },
  {
    q: "How expensive are agents really, right now?",
    short: "$50–2,000 per month per archetype, or $200–800 per CC subagent in tokens.",
    answer: "Rick presets sit at $50–150/mo per seat for Pro tier; $300–1,200/mo for a small team plan. Custom CC subagents cost $200–800/mo in tokens depending on volume. Compare to a senior eng at $120K/yr fully loaded — even at 10B tokens/mo you're at 5–10x leverage.",
    chapters: [
      { slug: '32-archetypes-rick', label: 'Ch 32 — Cost model per archetype' },
      { slug: '29-cost-economics', label: 'Ch 29 — The bill, demystified' },
    ],
    category: 'cost',
  },
  {
    q: "How do I use Codex AND Claude Code together?",
    short: "Codex is the night shift. CC is the day shift.",
    answer: "Codex runs against Sentry/GitHub 24/7 — incident response, regression catching, simple fixes from logs. CC is your day driver — features, refactors, anything needing a strong opinion. They share the same .mcp.json and CLAUDE.md. Branch protection keeps Codex off main.",
    chapters: [
      { slug: '35-codex-and-cc', label: 'Ch 35 — Codex × Claude Code' },
    ],
    category: 'agents',
  },
  {
    q: "How do I make an agent browse or login into social networks?",
    short: "Playwright + Claude. Save state.json. Read the kill switch chapter twice.",
    answer: "Use Playwright (headless browser) with the Anthropic SDK in a loop: read DOM → reason → click → verify. Save the session state once, reuse forever. CAPTCHA is real. ToS is real. Have a kill switch before the first run, not after the first wrong post.",
    chapters: [
      { slug: '33-browser-agents', label: 'Ch 33 — Browser agents' },
    ],
    category: 'agents',
  },
  {
    q: "How do I make someone (an agent) write on my behalf in Slack?",
    short: "Voice clone in a SKILL.md, plus a hard human-approval gate.",
    answer: "Persona agent = a SKILL.md that encodes your voice rules + a hard rule: agent drafts, human approves, agent posts. Audit log every send. Four hard NEVERs: deals, hires, breakups, condolences — never agent-only. The day someone notices, the gate is what saves you.",
    chapters: [
      { slug: '34-write-on-behalf', label: 'Ch 34 — Writing on your behalf' },
      { slug: '05-skills', label: 'Ch 5 — Skills' },
    ],
    category: 'agents',
  },
  {
    q: "When should I leave Claude Code for LangChain or CrewAI?",
    short: "When you need 5+ agents with strict handoff contracts and persistent state.",
    answer: "CC's subagent system covers ~80% of orchestration. Reach for CrewAI when you need explicit task dependencies. Reach for LangGraph when you need a state machine that survives a process restart. AutoGen for research prototypes only. Anthropic SDK direct is the floor.",
    chapters: [
      { slug: '36-frameworks-beyond', label: 'Ch 36 — Frameworks beyond CC' },
      { slug: '30-sdk-direct', label: 'Ch 30 — Anthropic SDK directly' },
    ],
    category: 'agents',
  },

  // Security
  {
    q: "How do I keep my API keys safe?",
    short: "Seven non-negotiables. Treat one chat-paste as compromised.",
    answer: "Never paste in a prompt. Never commit. Use scoped keys (read-only when possible). Different keys per env. Rotate quarterly. Use a secrets manager. Monitor usage. The bot in Sofia doesn't take a coffee break.",
    chapters: [
      { slug: '09-dont-get-owned', label: "Ch 9 — Don't get owned" },
    ],
    category: 'security',
  },
  {
    q: "What's --dangerously-skip-permissions and when can I use it?",
    short: "On a sandbox, not on your laptop. Ever.",
    answer: "It disables every approval gate. Use it only inside a Docker container, devcontainer, GitHub Codespace, or any disposable environment where the worst case is 'rebuild the container.' On your main machine with prod credentials sitting in .env, it's the kind of move that ends weekends.",
    chapters: [
      { slug: '15-permissions', label: 'Ch 15 — Permissions and sandboxes' },
      { slug: '21-three-modes', label: 'Ch 21 — Interactive / Plan / Auto' },
    ],
    category: 'security',
  },
  {
    q: "How do I write evals for my AI workflows?",
    short: "Three categories. Smoke, regression, golden-set. Schedule them like tests.",
    answer: "An eval is a test for your AI workflow. If you don't have one, you don't have a workflow — you have a hope. Smoke test the happy path. Regression-check on the failure modes you've already fixed. Golden-set lock the known-good outputs. Run them on cron 30 min before the real workflow fires.",
    chapters: [
      { slug: '25-evals-or-hope', label: 'Ch 25 — Evals or hope, pick one' },
    ],
    category: 'security',
  },

  // Drift / research-shaped
  {
    q: "Why does my agent corrupt the document after I delegate 20 edits in a row?",
    short: "Bursty drift — invisible to vibes, visible only to a content-diff eval.",
    answer: "Microsoft Research's OPS-204 (May 2026) ran 19 frontier models across 52 domains and found the top three corrupt ~25% of a document after 20 sequential edits; the average across all 19 is ~50%. Losses are bursty: ~80% come from rare single-step drops of 10-30%. Plugging in tools (search/code-exec/file-edit) makes it ~6% worse on average. Python is the safe domain; prose, recipes, music, financial reports are the worst. Operator move: break long edit chains into shorter sessions, run a content-checksum eval on cron, and don't reach for agentic tools by default in editing workflows.",
    chapters: [
      { slug: '25-evals-or-hope', label: 'Ch 25 — Evals, smoke / regression / golden' },
      { slug: '22-sessions', label: 'Ch 22 — Resume, replay, fork' },
      { slug: '28-failure-receipts', label: 'Ch 28 — Six failures, six bills' },
    ],
    category: 'security',
  },

  // Team
  {
    q: "How do I get my team to actually use this?",
    short: "Adoption is a gravity problem, not a training problem.",
    answer: "The 4-3-2-2-1 distribution shows up on day 1 — 4 power users, 3 watchers, 2 holdouts, 2 'just send me the briefing,' 1 will-not-use. Make the AI path the path of least resistance, or the team routes around it. Skills as policy, not productivity. Track tab-count, not usage.",
    chapters: [
      { slug: '26-team-adoption', label: 'Ch 26 — Getting twelve people to use this' },
    ],
    category: 'team',
  },
  {
    q: "What's your stack? What should I copy?",
    short: "Five tools, eighty percent of the output.",
    answer: "Claude (CC + Cowork) for ~80% of tokens. Gemini AI Studio for million-token bulk-PDF work. ChatGPT mobile + Codex on graveyard shift for ~7%. ElevenLabs for voice. The rest is noise dressed up as productivity.",
    chapters: [
      { slug: '02-five-tools', label: 'Ch 2 — Five tools, not fifty' },
      { slug: '24-tier-list', label: 'Ch 24 — The tier list' },
    ],
    category: 'getting-started',
  },
];

const CATEGORIES: { key: Q['category']; label: string }[] = [
  { key: 'getting-started', label: 'Getting started' },
  { key: 'building',        label: 'Building' },
  { key: 'agents',          label: 'Agents' },
  { key: 'security',        label: 'Security' },
  { key: 'cost',            label: 'Cost' },
  { key: 'team',            label: 'Team' },
];

export default function QuestionsBoard() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<Q['category'] | 'all'>('all');

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return QUESTIONS.filter((q) => {
      if (activeCat !== 'all' && q.category !== activeCat) return false;
      if (!needle) return true;
      return (q.q + ' ' + q.short + ' ' + q.answer).toLowerCase().includes(needle);
    });
  }, [search, activeCat]);

  const baseUrl = (import.meta as any).env?.BASE_URL ?? '/';
  const base = baseUrl.replace(/\/$/, '');

  return (
    <div className="container-wide" style={{ marginTop: '1.5rem', marginBottom: '4rem' }}>
      <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type your question…"
            className="flex-1 px-3 py-2 rounded-md text-sm"
            style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" onClick={() => setActiveCat('all')} className="text-[11px] px-2 py-1 rounded-md" style={{ background: activeCat === 'all' ? 'rgb(var(--accent))' : 'transparent', color: activeCat === 'all' ? 'white' : 'rgb(var(--fg) / 0.85)', border: '1px solid ' + (activeCat === 'all' ? 'rgb(var(--accent))' : 'rgb(var(--line))') }}>All ({QUESTIONS.length})</button>
            {CATEGORIES.map((c) => {
              const count = QUESTIONS.filter((q) => q.category === c.key).length;
              return (
                <button key={c.key} type="button" onClick={() => setActiveCat(c.key)} className="text-[11px] px-2 py-1 rounded-md" style={{ background: activeCat === c.key ? 'rgb(var(--accent))' : 'transparent', color: activeCat === c.key ? 'white' : 'rgb(var(--fg) / 0.85)', border: '1px solid ' + (activeCat === c.key ? 'rgb(var(--accent))' : 'rgb(var(--line))') }}>
                  {c.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: 'rgb(var(--muted))' }}>
            No matches. Try Cmd-K or browse the chapter list.
          </div>
        )}
        {filtered.map((q, i) => (
          <article key={i} className="rounded-lg p-5" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted))' }}>From the inbox</div>
            <h3 className="m-0 font-display text-xl md:text-2xl leading-snug">{q.q}</h3>
            <p className="mt-2 italic" style={{ color: 'rgb(var(--accent))' }}>{q.short}</p>
            <p className="mt-3 text-base leading-relaxed" style={{ color: 'rgb(var(--fg) / 0.92)' }}>{q.answer}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>Read more in:</span>
              {q.chapters.map((c) => (
                <a key={c.slug} href={`${base}/chapters/${c.slug}`} className="text-xs px-2.5 py-1 rounded-md no-underline" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--accent))' }}>
                  {c.label} →
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
