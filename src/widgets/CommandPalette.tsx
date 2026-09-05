import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, Delete, Search, X } from 'lucide-react';
import { createSearchIndex, MAX_SEARCH_QUERY_LENGTH, moveSearchSelection, POPULAR_PATHS, searchItems } from '@/lib/search';
import type { SearchItem as Item, SearchResult } from '@/lib/search';

// These are populated at module load — small enough to inline.
import { CHAPTERS } from '@/lib/chapters';
import { glossary } from '@/lib/glossary';
import { SETUP_STATS } from '@/lib/setup';
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
const TERMINAL_SECTIONS: { id: string; label: string }[] = [
  { id: 'the-problem', label: 'The glance test' },
  { id: 'layers', label: 'The four layers' },
  { id: 'terminals', label: 'Terminal options, honestly' },
  { id: 'claude-code', label: 'What Claude Code gives you' },
  { id: 'fleet-paint', label: 'Fleet paint — the full system' },
  { id: 'gotchas', label: 'The gotchas that cost a day' },
  { id: 'build-it', label: 'Build it with Claude Code' },
  { id: 'do-this', label: 'Do this Monday' },
];
const AGENTWORKFLOW_SECTIONS: { id: string; label: string }[] = [
  { id: 'answer', label: 'The 30-second answer' },
  { id: 'problem', label: 'The problem — a fleet with no queue' },
  { id: 'spine', label: 'The five rules' },
  { id: 'issue', label: 'The issue is the spec' },
  { id: 'board', label: 'The board — one queue over many repos' },
  { id: 'commands', label: 'The three commands' },
  { id: 'fleet', label: 'The review fleet' },
  { id: 'setup', label: 'Technical setup' },
  { id: 'options', label: 'The options, judged' },
  { id: 'delta', label: 'The nightly pulse' },
  { id: 'failures', label: 'What blew up' },
  { id: 'do-this', label: 'Do this Monday' },
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
const SWARMS_SECTIONS: { id: string; label: string }[] = [
  { id: 'why', label: 'Why swarms exist' },
  { id: 'architecture', label: 'The four patterns (interactive)' },
  { id: 'waves', label: 'The 5 × 4 wave pattern' },
  { id: 'shelf', label: "Vlad's swarm skill shelf (10)" },
  { id: 'patterns', label: 'Seven patterns I actually use' },
  { id: 'prompts', label: 'Orchestration prompts to steal' },
  { id: 'breaks', label: 'Three things that break swarms' },
  { id: 'verify', label: 'The between-wave audit' },
  { id: 'not-for', label: 'When NOT to use a swarm' },
  { id: 'monday', label: 'Do this Monday — 3 paths' },
];
const GITHUB_PLAYBOOK_SECTIONS: { id: string; label: string }[] = [
  { id: 'new-linkedin', label: 'GH is the new LinkedIn' },
  { id: 'five-uses', label: 'Five non-code uses of GitHub' },
  { id: 'eight-commands', label: 'The 8 gh commands you need' },
  { id: 'ignore', label: 'What you can safely ignore' },
  { id: 'delivery', label: 'GH as delivery surface' },
  { id: 'collab', label: 'Collaboration without code' },
  { id: 'examples', label: 'Six examples in the wild' },
  { id: 'saturday', label: 'The Saturday move (20 min)' },
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
const WORKFLOWS_SECTIONS: { id: string; label: string }[] = [
  { id: 'what-it-is', label: 'What it is' },
  { id: 'teams-vs-workflows', label: 'Teams vs workflows' },
  { id: 'the-loop', label: 'The validator loop' },
  { id: 'the-on-ramp', label: 'Turning it on' },
  { id: 'operators-read', label: 'My read' },
  { id: 'jobs', label: 'Where I point it' },
  { id: 'anthropic', label: 'What Anthropic says' },
  { id: 'not-for', label: 'When not to' },
  { id: 'appendix', label: 'Reference' },
  { id: 'monday', label: 'Do this Monday' },
];
const DREAMING_SECTIONS: { id: string; label: string }[] = [
  { id: 'thesis', label: 'The loop pointed inward' },
  { id: 'pipeline', label: 'The pipeline' },
  { id: 'refusals', label: 'The 5 refusals' },
  { id: 'receipts', label: 'The receipts' },
  { id: 'exception', label: 'The exception to Ch 7' },
  { id: 'not-for', label: 'When not to' },
  { id: 'monday', label: 'Do this Monday' },
];
const SELFAUDIT_SECTIONS: { id: string; label: string }[] = [
  { id: 'the-claim', label: 'The claim' },
  { id: 'why-it-rots', label: 'Why it rots' },
  { id: 'the-harness', label: 'The harness' },
  { id: 'the-refutations', label: 'The two refutations' },
  { id: 'the-numbers', label: 'The numbers' },
  { id: 'silent-failures', label: 'Everything fails silently' },
  { id: 'the-spine', label: "The layer the agent can't own" },
  { id: 'run-it', label: 'Run it Monday' },
];
const MUSICMATH_SECTIONS: { id: string; label: string }[] = [
  { id: 'claim', label: 'The claim' },
  { id: 'mechanism', label: 'Sound is already numbers' },
  { id: 'suno', label: "What Suno will and won't tell you" },
  { id: 'alphabets', label: 'What else turned out to be a language' },
  { id: 'dialects', label: 'Two ways to generate' },
  { id: 'bottleneck', label: 'The boring thing that decides it' },
  { id: 'leaks', label: 'Where the thesis leaks' },
  { id: 'monday', label: 'Do this Monday' },
];
const CADASCODE_SECTIONS: { id: string; label: string }[] = [
  { id: 'claim', label: 'The claim' },
  { id: 'wall', label: 'The wall it hangs on' },
  { id: 'drawing', label: 'The spec was a PNG' },
  { id: 'code', label: 'The CAD is a program' },
  { id: 'decisions', label: 'Six decisions in plastic' },
  { id: 'selfcheck', label: 'The script QAs its own geometry' },
  { id: 'leaks', label: 'Where this honestly stops' },
  { id: 'monday', label: 'Do this Monday' },
];
const LEARN_SECTIONS: { id: string; label: string }[] = [
  { id: 'is-this-you', label: 'Is this you? (no-code vs builder)' },
  { id: 'concepts', label: 'Five words you need first' },
  { id: 'ladder', label: 'The learning ladder' },
  { id: 'anthropic-courses', label: 'Official courses (Anthropic first)' },
  { id: 'going-further', label: 'Going further (OpenAI, Google, more)' },
  { id: 'what-youll-build', label: "What you'll be able to do" },
  { id: 'next-3-clicks', label: 'Your next 3 clicks' },
];
// Per-chapter synonyms — model names, company names, competing tools, people,
// and adjacent topics that readers type into Cmd-K but don't appear in chapter
// titles/subtitles.
const CHAPTER_SYNONYMS: Record<string, string> = {
  '01-killed-my-tabs':  'operating system os tabs workflow productivity daily driver',
  '02-five-tools':      'chatgpt cursor windsurf codex aider continue cline zed jetbrains copilot github copilot v0 bolt lovable replit claude code cowork picker which tool model picker',
  '03-temp-agency':     'context window memory state amnesia session forgets',
  '04-the-vault':       'obsidian PARA notes zettelkasten knowledge graph working memory',
  '05-skills':          'skill recipe SKILL.md prompt engineering prompting',
  '06-the-swarm':       'swarm subagents parallel fan-out orchestration',
  '08-three-doors':     'chat cowork claude code which mode picker door',
  '09-dont-get-owned':  'security secrets api key blast radius hygiene attack owned jailbreak prompt injection',
  '10-wild-stuff':      'hosted agents local models frontier openai anthropic google deepmind meta xai cohere perplexity grok llama gpt opus sonnet haiku gemini RLHF RLAIF fine-tuning fine tuning distillation',
  '11-build-a-skill':   'skill SKILL.md template 30 minute tutorial',
  '12-connectors-mcp':  'mcp connectors model context protocol install server custom .mcp.json',
  '13-quickstart':      'quickstart 10 minute install setup claude code',
  '14-cheat-sheet':     'cheat sheet slash commands settings.json reference cmd-k command palette',
  '15-permissions':     'permissions sandbox docker devcontainer yolo skip dangerous --dangerously-skip-permissions',
  '16-hooks-subagents': 'hooks subagents custom agent .md events PreToolUse PostToolUse SessionStart',
  '17-tips-tricks':     'tips tricks operator wisdom 25 boris cherny hyrum geoffrey huntley simon willison',
  '18-headless-ci':     'headless CI claude --print pipeline automation production github actions',
  '19-build-products':  'build products saturday ship mvp startup 80% rule',
  '20-terminal-windows':'tmux worktrees windows sessions parallel six claudes screen',
  '21-three-modes':     'interactive plan auto mode picker which mode',
  '22-sessions':        'sessions resume replay fork session management /resume',
  '23-vibe-coding':     'vibe coding saturday hour by hour build cursor windsurf',
  '24-tier-list':       'tier list ranking compare which model best leaderboard lmarena artificial analysis intelligence index cost per task agentic independent referee chatgpt gpt gpt-5 gpt-4 o1 o3 claude opus sonnet haiku gemini grok deepseek qwen llama mistral kimi glm anthropic openai google meta xai cohere perplexity cursor windsurf codex aider continue zed copilot',
  '25-evals-or-hope':   'evals benchmark smoke regression golden testing eval llm-judge hog',
  '26-team-adoption':   'team adoption rollout twelve people change management karpathy',
  '27-voice-agents':    'voice STT TTS speech elevenlabs cartesia deepgram phone call agent',
  '28-failure-receipts':'failure bills receipts mistakes losses postmortem',
  '29-cost-economics':  'cost economics bill pricing tokens cents caching batch routing api openai anthropic google prompt caching cache hit',
  '30-sdk-direct':      'sdk anthropic typescript python direct api drop cc claude api function calling structured output tool use',
  '31-stages':          'stages ideation foundation creation polishing security deploy six',
  '32-archetypes-rick': 'agent archetypes rick platform openclaw nemoclaw hermes',
  '33-browser-agents':  'browser agents playwright scrape login click post automation puppeteer',
  '34-write-on-behalf': 'persona agents write on behalf newsletter social ghostwriter writing email outreach',
  '35-codex-and-cc':    'codex openai claude code anthropic gemini google day shift night shift compare',
  '36-frameworks-beyond':'frameworks crewai langgraph sdk alternatives openai assistants beyond autogen smolagents',
  '37-context-files':   'claude.md memory skills conventions context files always-loaded',
  '38-run-until-done':  'run until done goals loops evaluator agent autonomy /goal',
  '39-skills-you-should-steal': 'skills steal community 1M ecosystem broken gaps DenisSergeevitch agents-best-practices simon willison',
  '40-prompting-knob':  'prompting prompt engineering chain of thought few-shot role play act as ladder skills swarms memory data layer rigor enforcer ultimate prompt cot zero-shot magic phrases anthropic karpathy benchmark tuesday repeatability schema not answer multiple instances',
  '41-send-the-link':   'html htmlization html-first link not file pdf dead file living link artifact deliverable deploy private repo github pages vercel afc folderly audit qbr board update brief operator distribution',
  '42-codex-on-a-loop': 'codex openai loop /loop second opinion second prior proof-checking proof check verify worktree worktrees sentry posthog betterstack mcp cron crons design system simplify pet emberling hatch-pet desktop pet cross-vendor skill night shift two priors',
  '43-codex-saviour':   'codex saviour refactor refactoring simplification folderly delete deletion 90000 ninety thousand lines net reduction repositioning swarm bench fermat harvey pauli planck explorer agents veto lens north star four buckets surface split preserve before pruning route registry harden while simplifying second prior verified layers',
  '44-dreaming':        'dreaming dream memory curation agent memory propose-only surfacer anthropic managed agents memory hygiene self-improve session transcripts verify quote raw jsonl hallucination yield-floor tripwire /learn /dream digest extract review apply-new auto-update memory loop pointed inward',
  '45-app-store-no-swift': 'app store ios iphone native swift swiftui xcode no code without swift mobile app lingualive revenuecat storekit in-app purchase iap subscription renewal apple developer program signing provisioning profile certificate app review guideline 4.2 3.1.1 5.1.1 account deletion privacy nutrition label testflight small business program 30% 15% commission merchant of record recurring revenue dashboard ship native deploy target gates doorman',
  '46-designing-with-ai':  'design designing with ai taste design system tokens wcag contrast accessibility a11y flame terminal accent eyebrow drift swarm before v1 redesign figma v0 lovable midjourney gpt canvas image generation imagegen nano banana flicked email chaos hype calm bricolage inter fraunces typeface palette intent generate select system remembers warm-dark editorial field manual reach folderly moon base taste-skill art direction mockups visual',
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

export function getPaletteItems(base = ''): Item[] {
    const chapterItems: Item[] = CHAPTERS.map((c) => ({
      type: 'chapter',
      title: `${String(c.number).padStart(2, '0')} — ${c.title}`,
      subtitle: c.subtitle,
      href: `${base}/chapters/${c.slug}/`,
      keywords: `${c.title} ${c.subtitle} ${CHAPTER_SYNONYMS[c.slug] || ''}`.toLowerCase(),
    }));
    const pages: Item[] = [
      { type: 'page', title: 'Library', href: `${base}/library/`, subtitle: 'Search the playbook and choose a learning path', keywords: 'library index catalog catalogue browse search chapters learning paths reading roadmap topics filters' },
      { type: 'page', title: 'Workflow planner', href: `${base}/workflow-planner/`, subtitle: 'Plan an AI workflow', keywords: 'workflow planner builder plan design workflow steps task automation' },
      { type: 'page', title: 'How to read this book', href: `${base}/how-to-read/`,     subtitle: 'The prologue — start here if new',                                                                  keywords: 'prologue start beginner first time intro reading guide' },
      { type: 'page', title: 'Learn — the on-ramp',    href: `${base}/learn/`,           subtitle: 'New to AI? Official free courses in order, then the book',                                            keywords: 'learn onboarding beginner new courses curriculum anthropic academy claude 101 claude code 101 cowork agent skills mcp openai academy chatgpt google gemini deeplearning hugging face microsoft start here getting started fundamentals tutorial how to learn' },
      { type: 'page', title: 'Day zero',              href: `${base}/day-zero/`,        subtitle: 'A first-session setup path, with optional next steps',                                                 keywords: 'day zero getting started onboarding first install setup quickstart' },
      { type: 'page', title: 'Starter skills',         href: `${base}/starter-skills/`,  subtitle: 'Six drop-in SKILL.md files',                                                                          keywords: 'starter skill SKILL.md template recipe drop-in' },
      { type: 'page', title: 'Good taste, on tap',     href: `${base}/good-taste/`,      subtitle: 'Before/after: stop AI design slop (Leon Lin\'s taste-skill)',                                          keywords: 'good taste taste-skill slop design before after imagegen art direction leon lin leonxlnx showcase steal skill flicked reach moon base anti-slop npx skills add' },
      { type: 'page', title: 'Vault starter',          href: `${base}/vault-starter/`,   subtitle: 'PARA vs 7 others. Project-as-entity. Working vault to clone.',                                       keywords: 'vault obsidian PARA notes zettelkasten knowledge graph clone' },
      { type: 'page', title: 'Weekend builds',         href: `${base}/weekend-builds/`,  subtitle: '8 Saturday-ship recipes + the trap pick',                                                             keywords: 'weekend saturday recipe build mvp side project ship' },
      { type: 'page', title: 'For your CFO',           href: `${base}/cfo-case/`,        subtitle: '600 words. Defend the spend.',                                                                        keywords: 'cfo finance budget cost spend roi defend executive business case' },
      { type: 'page', title: 'Build vs Buy',           href: `${base}/build-vs-buy/`,    subtitle: 'Sequencing wedge + cost ladder + 5-question matrix',                                                  keywords: 'build buy make purchase cost ladder sequencing matrix vendor saas' },
      { type: 'page', title: 'Research notes',         href: `${base}/research-notes/`,  subtitle: 'External findings that shift what to do Monday',                                                      keywords: 'research notes findings external signal evidence gemini claude anthropic openai mythos karpathy' },
      { type: 'page', title: 'The journey',           href: `${base}/journey/`,         subtitle: 'Six parts. One arc.',                                                                                 keywords: 'journey arc path roadmap parts' },
      { type: 'page', title: 'Questions people ask',  href: `${base}/questions/`,       subtitle: "Top questions from Vlad's inbox",                                                                     keywords: 'faq questions common asked help' },
      { type: 'page', title: "Vlad's CC setup",        href: `${base}/showcase/`,        subtitle: `${SETUP_STATS.skills} skills + ${SETUP_STATS.agents} agents + ${SETUP_STATS.plugins} plugins`,         keywords: 'showcase claude code setup skills agents plugins configuration mine cursor codex aider windsurf' },
      { type: 'page', title: "Vlad's Cowork setup",    href: `${base}/cowork-setup/`,    subtitle: 'Connectors + scheduled tasks (sanitized)',                                                            keywords: 'cowork claude.ai setup connectors scheduled tasks routines' },
      { type: 'page', title: 'Sections',              href: `${base}/sections/`,        subtitle: 'Chapters by theme',                                                                                   keywords: 'sections themes chapters parts table of contents toc' },
      { type: 'page', title: 'Glossary',              href: `${base}/glossary/`,        subtitle: `${Object.keys(glossary).length} terms, A–Z`,                                                          keywords: 'glossary terms definitions vocabulary a-z dictionary' },
      { type: 'page', title: 'Resources',             href: `${base}/resources/`,       subtitle: 'Copy-paste templates, hooks, prompts',                                                                keywords: 'resources templates hooks prompts subagents claude.md mcp permissions copy paste' },
      { type: 'page', title: 'The public launch', href: `${base}/launch/`,    subtitle: 'May 20, 2026 — the repo is open; the source is the recipe',                                       keywords: 'launch public open repo announcement github edition' },
      { type: 'page', title: 'Launch week — live receipts', href: `${base}/launch-week/`, subtitle: 'The launch as its own experiment in the thesis. Numbers as they come in.',                          keywords: 'launch week numbers receipts day-by-day live metrics analytics' },
      { type: 'page', title: 'HTML-ization',          href: `${base}/html-first/`,      subtitle: 'Stop sending dead files — 2 live, clickable case studies',                                            keywords: 'html-ization htmlization html-first html first interactive artifact deliverable single-file static page case study clickable afc folderly audit' },
      { type: 'page', title: 'The Sovereign Stack',   href: `${base}/sovereign-stack/`, subtitle: 'Open-weights LLMs that survive the deprecation calendar — Ollama, hardware, the heretic question, nano-gpt', keywords: 'sovereign stack open source weights local llm on-device edge ollama lm studio kimi qwen glm deepseek llama mistral grok gpt-oss heretic abliteration nano-gpt nanogpt karpathy mythos hardware mac studio rtx 3090 4090 mythos meta google deepmind anthropic openai xai zhipu alibaba' },
      { type: 'page', title: 'Dynamic Workflows',     href: `${base}/dynamic-workflows/`, subtitle: 'Opus 4.8 dynamic workflows — Claude plans, fans out parallel subagents, and verifies its own work',     keywords: 'dynamic workflows workflow opus 4.8 parallel subagents agents ultracode effort generator validator orchestration deep-research agent teams anthropic claude code swarm automated' },
      { type: 'page', title: 'Music is Math',          href: `${base}/music-is-math/`,   subtitle: 'How AI writes a song — and why the same recipe writes proteins, motion and weather',                          keywords: 'music is math suno udio ai music how does ai make music audio tokens tokenization tokenizer neural codec encodec soundstream dac musicgen musiclm bark stable audio riffusion elevenlabs lyria transformer autocomplete next token prediction diffusion flow matching latent proteins esm3 esmgfp gfp alphafold dna evo genome amino acids robots rt-2 pi0 physical intelligence gemini robotics action tokens weather gencast weathernext ecmwf world models genie sora veo vit patches vqgan alphago universality everything is a language' },
      { type: 'page', title: 'CAD-as-code',            href: `${base}/cad-as-code/`,     subtitle: 'Claude designs a printable museum frame for the bird station — STL, STEP, and the renders to prove it', keywords: 'cad as code cad-as-code frame inkframe 3d print printing printer stl step build123d cadquery openscad fusion 360 freecad parametric hardware physical object e-ink eink inky impression spectra pimoroni raspberry pi pi 5 birdnet bird station enclosure bracket mount jig half-lap dovetail keyhole clamp museum frame mockup renders dimensional drawing calipers petg filament' },
      { type: 'page', title: 'Dreaming',              href: `${base}/dreaming/`,        subtitle: "A local, propose-only twin of Anthropic's Dreaming — digest, surface, verify against the raw transcript, never write", keywords: 'dreaming dream memory curation agent memory propose-only surfacer anthropic managed agents self-improve session transcripts verify quote raw jsonl hallucination yield-floor /learn /dream digest extract review apply-new claude code loop pointed inward' },
      { type: 'page', title: 'The Self-Audit',          href: `${base}/self-audit/`,      subtitle: "The swarm pointed at the agent's own setup — 41 findings, 2 refutations, the kill-rules", keywords: 'self-audit self audit config rot skills hooks memory permissions allowlist red-team adversarial verification telemetry prune archive launchd spine health pulse maintenance hygiene setup audit' },
      { type: 'page', title: 'Opus 5 — the model file',   href: `${base}/opus-5/`,       subtitle: 'Shipped 2026-07-24 — $5/$25, the effort dial, and where it really sits',                                keywords: 'opus 5 opus-5 claude opus 5 claude-opus-5 new model july 2026 release launch effort dial effort parameter low medium high xhigh max pricing $5 $25 1m context may 2026 cutoff default claude max claude pro fallback opus 4.8 priority tier web_fetch hierarchy fable 5 comparison arc-agi-3 frontierbench swe-bench pro osworld' },
      { type: 'page', title: 'Opus 5 use cases',          href: `${base}/opus-5/use-cases/`, subtitle: 'Seven ranked jobs with the effort setting for each — and eleven where it loses',                        keywords: 'opus 5 use cases best use cases what is opus 5 good at effort level which effort long horizon agentic knowledge work aa-briefcase zapier automationbench debugging root cause frontiercode computer use osworld arc-agi-3 long context browsecomp when not to use wrong choice latency subagent swarm coderabbit hallucination verbosity' },
      { type: 'page', title: 'Fable 5 — the model file', href: `${base}/fable-5/`,       subtitle: 'The withheld Mythos, buyable — pricing, benchmarks, the June 22 clock',                              keywords: 'fable 5 fable-5 claude fable mythos 5 mythos-class new model frontier launch claude-fable-5 model id june 22 plan limits usage credits safeguards fallback opus 4.8 pokemon firered vision' },
      { type: 'page', title: 'Fable 5 vs Mythos 5',   href: `${base}/fable-5/vs-mythos-5/`, subtitle: 'One model, two names, three safeguards',                                                          keywords: 'mythos 5 fable vs mythos safeguards classifiers fallback glasswing biology cyber distillation retention gated' },
      { type: 'page', title: 'Fable 5 benchmarks',    href: `${base}/fable-5/benchmarks/`, subtitle: 'The full launch table, read honestly',                                                             keywords: 'fable 5 benchmarks swe-bench pro frontiercode gdpval osworld terminal-bench exploitbench humanity last exam launch table discount reward hacking' },
      { type: 'page', title: 'Fable 5 vs Opus 4.8',   href: `${base}/fable-5/vs-opus-4-8/`, subtitle: 'Upgrade or wait — the 2× sticker vs turn-count collapse',                                         keywords: 'fable 5 vs opus 4.8 upgrade compare opus comparison price 2x decision' },
      { type: 'page', title: 'Fable 5 vs GPT 5.5',    href: `${base}/fable-5/vs-gpt-5-5/`, subtitle: 'The cross-vendor read, incl. Gemini 3.1 Pro',                                                      keywords: 'fable 5 vs gpt 5.5 gemini 3.1 pro cross vendor openai google comparison codex cli' },
      { type: 'page', title: 'Fable 5 pricing',       href: `${base}/fable-5/pricing/`,  subtitle: '$10/$50 per Mtok, the plan window, cost per task',                                                    keywords: 'fable 5 pricing cost price $10 $50 plan limits june 22 usage credits cost per task caching' },
      { type: 'page', title: 'Fable 5 use cases',     href: `${base}/fable-5/use-cases/`, subtitle: 'Stripe 50M-line day, drug design, the demos — with honest reads',                                    keywords: 'fable 5 use cases examples stripe cursor github imc drug design genomics pokemon firered solar system eclipse demo' },
      { type: 'page', title: 'Fable 5 in Claude Code', href: `${base}/fable-5/claude-code/`, subtitle: 'The banner, the June 22 clock, the routing',                                                     keywords: 'fable 5 claude code banner /model june 22 plan limits usage credits routing complex long-running work' },
      { type: 'page', title: 'Fable 5 API',           href: `${base}/fable-5/api/`,      subtitle: 'claude-fable-5 — one-line migration, one new 400',                                                    keywords: 'fable 5 api claude-fable-5 model id migration thinking disabled 400 adaptive effort xhigh context 1m advisor managed agents' },
      { type: 'page', title: 'Fable 5 — the system card', href: `${base}/fable-5/system-card/`, subtitle: 'The ten strange episodes from pre-release testing',                                            keywords: 'fable 5 mythos 5 system card safety testing alignment strange episodes price fixing market stabilization vending bench kubernetes token self-deleting privilege escalation blank image fabrication fatigue tokens decoy processes disguised vocabulary domain fronting commit authorship deception red team' },
      { type: 'page', title: 'Claude Code best practices', href: `${base}/claude-code-best-practices/`, subtitle: 'What survived production — distilled from 46 chapters',                                  keywords: 'claude code best practices tips workflow how to use production practices guide checklist' },
      { type: 'page', title: 'Claude Code vs Cursor', href: `${base}/claude-code-vs-cursor/`, subtitle: 'Which one, for which job — and where Codex fits',                                                 keywords: 'claude code vs cursor cursor vs claude code comparison ide terminal codex which better' },
      { type: 'page', title: 'What is agentic coding?', href: `${base}/what-is-agentic-coding/`, subtitle: "The operator's definition, with the 90k-line worked example",                                  keywords: 'agentic coding what is definition vibe coding autocomplete agent coding meaning explained' },
      { type: 'page', title: 'Claude Code pricing',    href: `${base}/claude-code-pricing/`, subtitle: 'Every plan and API rate, verified — plus what it really costs to run',                            keywords: 'claude code pricing cost price plans pro max team api token cost per month bill invoice cache spike free tier worth it' },
      { type: 'page', title: 'Claude Code vs Codex',   href: `${base}/claude-code-vs-codex/`, subtitle: 'Ran both in anger — verdict per job, with receipts',                                             keywords: 'claude code vs codex openai codex comparison which better agent cli night shift worktree' },
      { type: 'page', title: 'Claude Code MCP',        href: `${base}/claude-code-mcp/`, subtitle: 'Setup, .mcp.json examples, and the servers worth wiring',                                             keywords: 'claude code mcp model context protocol setup mcp.json servers connectors wiring config security' },
      { type: 'page', title: 'Claude Code hooks',      href: `${base}/claude-code-hooks/`, subtitle: '10 real configs, what they caught, what failed',                                                    keywords: 'claude code hooks pretooluse posttooluse stop sessionstart settings.json secrets-scan block push main exit 2 examples' },
      { type: 'page', title: 'Fleet paint — terminal setup', href: `${base}/terminal-setup/`, subtitle: 'Paint every window by project — statusline, OSC codes, the watcher',                          keywords: 'terminal setup customization customize statusline status line osc escape codes colors colours paint window title fleet iterm2 wezterm ghostty terminal.app kitty alacritty warp theme bell notification dock badge launchd watcher palette oklch per-project fleet paint' },
      { type: 'page', title: 'Agent workflow — boards & the review fleet', href: `${base}/agent-workflow/`, subtitle: 'Issue → board → /pick → six path-routed reviewers → PR — the whole setup',                     keywords: 'agent workflow workflows board boards github projects issue issues pull request pr review fleet reviewers scope security db contract simplicity test quality task pick queue ready blocked kanban plugin routing deterministic checks squash merge definition of ready' },
      { type: 'page', title: 'AI agent examples',      href: `${base}/ai-agent-examples/`, subtitle: '12 real agents — costs, architecture, failures',                                                    keywords: 'ai agent examples real agents use cases gallery receipts swarm browser voice persona overnight costs failures' },
      { type: 'page', title: 'GitHub Playbook',       href: `${base}/github-playbook/`, subtitle: 'GitHub for non-developers — 5 non-code uses, 8 gh commands, what to ignore, 6 worked examples',                              keywords: 'github gh git non-developer non-coder operator pages readme issues releases discussions linkedin karpathy simonw willison nanogpt nanochat profile readme private repo public repo deploy artifacts' },
      { type: 'page', title: 'Swarms — deep dive',     href: `${base}/swarms/`,          subtitle: '10 swarm skills, 7 patterns, the prompts to steal, the 3 things that break',                                                          keywords: 'swarm swarms parallel subagents fan-out pipeline map-reduce adversarial wave orchestration agent-wave-verify swarm-strategic-plan debug-swarm audit bughunter ultrareview cross-trio-audit folderly orchestrator conductor brief canon-lock red-team' },
      { type: 'page', title: 'The 12-rule CLAUDE.md', href: `${base}/claude-md-rules/`, subtitle: 'Karpathy at 11%. Operator overlay gets to 3%.',                                                       keywords: 'claude.md rules karpathy twelve 12 conventions context file always-loaded operator overlay' },
      { type: 'page', title: 'Tier list',             href: `${base}/tier-list/`,       subtitle: 'Drag-and-drop yours',                                                                                 keywords: 'tier list ranking compare which model best leaderboard lmarena artificial analysis intelligence index cost per task agentic independent chatgpt gpt gpt-5 gpt-4 o1 o3 claude opus sonnet haiku gemini grok deepseek qwen llama mistral kimi glm anthropic openai google meta xai cohere perplexity' },
      { type: 'page', title: 'Cheat sheet',           href: `${base}/cheat-sheet/`,     subtitle: 'Print + tape it up',                                                                                  keywords: 'cheat sheet reference quick cmd-k command palette search slash commands settings shortcut keyboard print' },
      { type: 'page', title: '30-day plan',           href: `${base}/thirty-day-plan/`, subtitle: 'Custom roadmap',                                                                                      keywords: '30 day thirty plan roadmap onboarding schedule monthly week-by-week' },
      { type: 'page', title: 'About',                 href: `${base}/about/`,           subtitle: 'Vlad + portfolio + newsletter',                                                                       keywords: 'about vlad podoliako belkins folderly lingualive portfolio playbook author bio newsletter contact who' },
      { type: 'page', title: 'Changelog',             href: `${base}/changelog/`,       subtitle: "What's new in each edition",                                                                          keywords: 'changelog edition history versions updates release notes whats new' },
    ];
    const glossaryItems: Item[] = Object.keys(glossary).map((term) => ({
      type: 'glossary',
      title: term,
      subtitle: glossary[term].definition.replace(/<[^>]+>/g, '').slice(0, 80) + '…',
      href: `${base}/glossary/#${encodeURIComponent(term)}`,
      keywords: `${term} ${glossary[term].definition}`.toLowerCase(),
    }));
    const sectionItems: Item[] = [
      ...CHEAT_SHEET_SECTIONS.map((h) => ({
        type: 'section' as const,
        title: h,
        subtitle: 'Cheat sheet',
        href: `${base}/cheat-sheet/#${slugify(h)}`,
        keywords: `cheat sheet ${h}`.toLowerCase(),
      })),
      ...RESOURCES_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Resources',
        href: `${base}/resources/#${s.id}`,
        keywords: `resources ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...TERMINAL_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Fleet paint',
        href: `${base}/terminal-setup/#${s.id}`,
        keywords: `terminal setup customization statusline osc paint fleet window ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...AGENTWORKFLOW_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Agent workflow',
        href: `${base}/agent-workflow/#${s.id}`,
        keywords: `agent workflow board queue review fleet issue pr ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...HTMLFIRST_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'HTML-ization',
        href: `${base}/html-first/#${s.id}`,
        keywords: `html-ization htmlization html-first html first interactive artifact deliverable single-file static page case study ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...SOVEREIGN_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'The Sovereign Stack',
        href: `${base}/sovereign-stack/#${s.id}`,
        keywords: `sovereign stack open source weights local llm on-device edge ollama lm studio kimi qwen glm deepseek llama mistral grok gpt-oss heretic abliteration nano-gpt nanogpt karpathy mythos hardware openai anthropic google deepmind meta xai zhipu alibaba ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...GITHUB_PLAYBOOK_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'GitHub Playbook',
        href: `${base}/github-playbook/#${s.id}`,
        keywords: `github gh git non-developer operator pages readme issues releases linkedin karpathy nanogpt nanochat simon willison profile readme ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...SWARMS_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Swarms',
        href: `${base}/swarms/#${s.id}`,
        keywords: `swarm parallel subagents fan-out pipeline map-reduce adversarial wave orchestration agent-wave-verify swarm-strategic-plan debug-swarm audit ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...WORKFLOWS_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Dynamic Workflows',
        href: `${base}/dynamic-workflows/#${s.id}`,
        keywords: `dynamic workflows opus 4.8 ultracode workflow parallel subagents ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...DREAMING_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Dreaming',
        href: `${base}/dreaming/#${s.id}`,
        keywords: `dreaming dream memory curation propose-only agent memory verify quote anthropic managed agents ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...SELFAUDIT_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'The Self-Audit',
        href: `${base}/self-audit/#${s.id}`,
        keywords: `self-audit config rot skills hooks memory permissions red-team telemetry prune ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...MUSICMATH_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Music is Math',
        href: `${base}/music-is-math/#${s.id}`,
        keywords: `music is math tokenization audio tokens suno transformer autocomplete proteins robots weather diffusion ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...CADASCODE_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'CAD-as-code',
        href: `${base}/cad-as-code/#${s.id}`,
        keywords: `cad as code frame inkframe 3d print stl step build123d parametric hardware e-ink pimoroni raspberry pi birdnet ${s.label} ${s.id}`.toLowerCase(),
      })),
      ...LEARN_SECTIONS.map((s) => ({
        type: 'section' as const,
        title: s.label,
        subtitle: 'Learn',
        href: `${base}/learn/#${s.id}`,
        keywords: `learn onboarding beginner new courses curriculum anthropic academy openai google gemini deeplearning hugging face getting started fundamentals ${s.label} ${s.id}`.toLowerCase(),
      })),
    ];
    const noteItems: Item[] = RESEARCH_NOTES.map((n) => ({
      type: 'note',
      title: n.title,
      subtitle: n.tagline,
      href: `${base}/research-notes/#${slugify(n.title)}`,
      keywords: `${n.title} ${n.tagline} ${(n.implications || []).join(' ')}`.toLowerCase(),
    }));
    return [...pages, ...chapterItems, ...sectionItems, ...glossaryItems, ...noteItems];
}

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
