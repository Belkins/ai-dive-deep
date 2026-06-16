export type GlossaryEntry = {
  term: string;
  definition: string;
  related?: string[];
};

export const glossary: Record<string, GlossaryEntry> = {
  Agent: {
    term: 'Agent',
    definition:
      'An LLM in a loop with tools, working toward a goal across multiple turns. The bar isn\'t "uses tools once" — it\'s "decides for itself what to do next."',
    related: ['Subagent', 'Swarm'],
  },
  'CLAUDE.md': {
    term: 'CLAUDE.md',
    definition:
      'A markdown file loaded on every turn of every session. Stacks: global <code>~/.claude/CLAUDE.md</code> + repo-local + subdirectory, nearest wins. Under 100 lines — every line is billed in perpetuity and edits void the prompt cache.',
    related: ['Prompt caching', 'Context window'],
  },
  'Claude Code': {
    term: 'Claude Code',
    definition:
      "Anthropic's CLI tool. `claude` in your terminal. Reads/writes your repo, spawns subagents, talks to MCP servers.",
  },
  'Design system': {
    term: 'Design system',
    definition:
      'The written-down rules a product\'s look obeys — color/spacing/type tokens, component recipes, and the principles behind them. Your past taste decisions encoded so the next screen, or the next model, starts from your judgment instead of the internet\'s average.',
    related: ['Design token', 'Skill'],
  },
  'Design token': {
    term: 'Design token',
    definition:
      'A named design value — an accent color, a spacing step, a radius — stored once and referenced everywhere, so a theme change is one edit. The atom of a design system; the W3C DTCG format is the portable spec.',
    related: ['Design system'],
  },
  'Contrast ratio': {
    term: 'Contrast ratio',
    definition:
      'The measured luminance ratio between text and its background, from 1:1 to 21:1. WCAG AA wants at least 4.5:1 for body text — a number, not an opinion, which is why a check catches what the eye approves.',
  },
  Connector: {
    term: 'Connector',
    definition:
      'Friendly UI for an MCP server. In Cowork & the Claude apps, "connector" is what you see; MCP is what\'s underneath.',
    related: ['MCP'],
  },
  'Context window': {
    term: 'Context window',
    definition:
      "The total tokens an instance can hold at once. The bigger the window, the more you can stuff in — but more isn't free.",
    related: ['Token', 'Instance'],
  },
  Cowork: {
    term: 'Cowork',
    definition:
      "Anthropic's desktop app for knowledge work. Connectors, skills, scheduled tasks, mounted folders.",
  },
  Cron: {
    term: 'Cron',
    definition:
      'A scheduling syntax. `0 7 * * 1-5` = 7 AM weekdays. Most modern surfaces hide it behind a UI.',
  },
  // [VLAD: the four definitions below are factual drafts from the design swarm — revoice in your register. Keys/related-wiring are infra.]
  Dreaming: {
    term: 'Dreaming',
    definition:
      'An automated memory-curation pass — an agent reads its own recent sessions, finds patterns, and improves its persistent memory. Anthropic ships it in Managed Agents (a research preview as of mid-2026), where it can auto-update memory; the local Claude Code build in <a href="/chapters/44-dreaming">Ch 44</a> is deliberately propose-only — it surfaces candidates and never writes.',
    related: ['Agent memory', 'Memory curation', 'Propose-only', 'CLAUDE.md'],
  },
  'Agent memory': {
    term: 'Agent memory',
    definition:
      'What an agent carries between sessions. In Claude Code it is four layers — CLAUDE.md, memory/, skills, and the session itself. The hard part is not writing it; it is curating it so it stays deduped and true.',
    related: ['Dreaming', 'Memory curation', 'CLAUDE.md'],
  },
  'Memory curation': {
    term: 'Memory curation',
    definition:
      'Keeping the memory layer clean across hundreds of sessions — deduping, verifying each lesson against its source, and holding the index under its bloat ceiling. The failure modes are a confident duplicate write and quiet abandonment.',
    related: ['Dreaming', 'Agent memory', 'Propose-only'],
  },
  'Propose-only': {
    term: 'Propose-only',
    definition:
      'A tool that can read and recommend but structurally cannot write. The safety ceiling, not just the default — the most a propose-only dreaming pass can do is surface a review file a human acts on.',
    related: ['Dreaming', 'Memory curation', 'Hallucination'],
  },
  Eval: {
    term: 'Eval',
    definition:
      "A test for your AI workflow. If you don't have evals, you don't have a workflow — you have a hope.",
  },
  'Function calling': {
    term: 'Function calling',
    definition:
      'A model output format that says "I want to call X with Y." Your code does the actual call.',
    related: ['Tool use'],
  },
  Hallucination: {
    term: 'Hallucination',
    definition:
      'When the model confidently invents something. Less common in 2026 than 2023, still possible. Verify destructive actions.',
  },
  'Headless mode': {
    term: 'Headless mode',
    definition:
      'Running Claude Code with no interactive UI via <code>claude --print</code> (<code>-p</code>). Prints to stdout, exits — pipeable, cron-able, drops straight into a GitHub Action.',
    related: ['Night shift'],
  },
  Hook: {
    term: 'Hook',
    definition:
      'A command, HTTP endpoint, or short LLM prompt Claude Code runs automatically at lifecycle points (PreToolUse, PostToolUse, Stop, SessionStart, …). Lives in <code>settings.json</code>, not the chat — the model can\'t skip it. Ten real configs with verdicts and failure receipts: <a href="/claude-code-hooks">Claude Code hooks</a>.',
    related: ['PreToolUse', 'PostToolUse', 'Stop hook'],
  },
  Inference: {
    term: 'Inference',
    definition:
      'The act of running a model on an input to produce an output. Each chat turn is one inference.',
  },
  Instance: {
    term: 'Instance',
    definition:
      'A single context window with a system prompt, tools, and history. When the window closes, the instance dies.',
  },
  'Knowledge cutoff': {
    term: 'Knowledge cutoff',
    definition:
      "The date past which the model can't reliably answer. Mid-2025 for current frontier models.",
  },
  MCP: {
    term: 'MCP',
    definition:
      'Model Context Protocol. The open standard that lets any AI client talk to any tool. USB-C for AI.',
    related: ['Connector'],
  },
  Multimodal: {
    term: 'Multimodal',
    definition: 'Models that handle more than text — images, audio, video, code.',
  },
  Plugin: {
    term: 'Plugin',
    definition:
      'A bundle of skills, MCP servers, commands, and hooks. Install once, get many capabilities.',
    related: ['Skill', 'Hook'],
  },
  'Prompt injection': {
    term: 'Prompt injection',
    definition:
      'When adversarial text in tool output tricks an agent into doing something unintended. The new XSS.',
  },
  Quantization: {
    term: 'Quantization',
    definition:
      "Compressing a model's weights to run on smaller hardware. Q4 quant of a 70B is shockingly close to full precision.",
  },
  RAG: {
    term: 'RAG',
    definition:
      'Retrieval-Augmented Generation. Pull relevant chunks from a vector DB, stuff into context, generate.',
  },
  Skill: {
    term: 'Skill',
    definition:
      'A folder with a SKILL.md the model auto-loads when its description matches your request. Procedural memory.',
    related: ['Plugin'],
  },
  Subagent: {
    term: 'Subagent',
    definition:
      'A child instance spawned from your main session: own context window, own tool allow-list (restrict it to bound blast radius), own system prompt, returns one summary.',
    related: ['Agent', 'Swarm'],
  },
  Swarm: {
    term: 'Swarm',
    definition:
      'Multiple subagents running in parallel. Fan-out / fan-in is the default pattern.',
    related: ['Subagent'],
  },
  'System prompt': {
    term: 'System prompt',
    definition:
      'The instruction that boots up an instance. Sets identity, constraints, defaults.',
  },
  Token: {
    term: 'Token',
    definition: 'About 0.75 of a word. Models count by tokens. So do bills.',
  },
  'Tool use': {
    term: 'Tool use',
    definition: "The model's ability to call functions/connectors during a turn.",
    related: ['Function calling'],
  },
  Vault: {
    term: 'Vault',
    definition:
      'Your second brain. A folder of markdown files an AI can read, link, and update. Obsidian is the typical home.',
  },
  Webhook: {
    term: 'Webhook',
    definition: 'An HTTP callback. Useful for event-triggered scheduled tasks.',
  },
  Sandbox: {
    term: 'Sandbox',
    definition:
      'An isolated environment (Docker, VM, devcontainer) where an agent can run with skip-permissions safely. Rebuild the container if anything goes wrong.',
  },
  Worktree: {
    term: 'Worktree',
    definition:
      "Git's built-in way to check out multiple branches of the same repo into separate folders. The single most useful Unix trick when running parallel CC sessions.",
  },
  PreToolUse: {
    term: 'PreToolUse',
    definition:
      'A <code>Hook</code> event that fires before any tool call. Validate, block, or audit-log; a non-zero exit blocks the call and the stderr goes back into the model\'s context.',
    related: ['Hook', 'PostToolUse', 'Permission mode'],
  },
  PostToolUse: {
    term: 'PostToolUse',
    definition:
      'A <code>Hook</code> event that fires after a tool call succeeds. The format-on-save / lint / test / notify slot.',
    related: ['Hook', 'PreToolUse'],
  },
  'Stop hook': {
    term: 'Stop hook',
    definition:
      'A <code>Hook</code> that fires when the agent\'s turn ends. The custom-logic autonomous-loop primitive — the next turn runs if your script returns non-zero, stops on 0. Determinism beats vibes.',
    related: ['Hook', '/goal', '/loop'],
  },
  '/goal': {
    term: '/goal',
    definition:
      '<code>/goal &lt;condition&gt;</code> runs turns until a small evaluator reading the transcript says the condition holds. Removes per-turn approval the way Auto mode removes per-tool. Always add an "or stop after N turns" clause.',
    related: ['Stop hook', '/loop', 'Auto mode', 'Evaluator', 'Eval'],
  },
  '/loop': {
    term: '/loop',
    definition:
      '<code>/loop [interval] [prompt]</code> — interval-driven, no evaluator. Run this prompt every N minutes (polling). The slash-command replacement for rigging cron.',
    related: ['/goal', 'Cron', 'Stop hook'],
  },
  Evaluator: {
    term: 'Evaluator',
    definition:
      'The small fast model (Haiku by default) that judges a <code>/goal</code> condition from the transcript after each turn. It has no tools — if your output can\'t prove "done," it loops forever.',
    related: ['/goal', 'Eval'],
  },
  'Plan mode': {
    term: 'Plan mode',
    definition:
      'The agent describes what it WOULD do — every file, every line — without writing a byte. Approve the plan as one unit. The safety stop between Interactive and Auto that nobody uses.',
    related: ['Auto mode', 'Interactive mode'],
  },
  'Auto mode': {
    term: 'Auto mode',
    definition:
      'No prompts, no approvals — <code>--dangerously-skip-permissions</code> (nuclear), an <code>--allowed-tools</code> allow-list (what pros use), or <code>--auto</code> (a classifier). The flag isn\'t the problem; the environment is.',
    related: ['Plan mode', 'Interactive mode', 'Permission mode', 'Sandbox'],
  },
  'Interactive mode': {
    term: 'Interactive mode',
    definition:
      'The default. Every Edit/Write/Bash/WebFetch shows a preview and asks "approve?" Slow on purpose — the slowness is the safety margin.',
    related: ['Plan mode', 'Auto mode'],
  },
  'Permission mode': {
    term: 'Permission mode',
    definition:
      'The settings layer evaluated <code>deny → ask → allow</code> across managed/user/project files. Deny wins and is sticky upward. Tool names are case-sensitive.',
    related: ['Auto mode', 'Sandbox', 'Hook'],
  },
  '.mcp.json': {
    term: '.mcp.json',
    definition:
      'The repo-root file declaring <code>MCP</code> servers, committed so the whole team (and both Codex + CC) gets the same connector set.',
    related: ['MCP', 'Connector', 'MCP server'],
  },
  stdio: {
    term: 'stdio',
    definition:
      'An <code>MCP</code> transport where the server runs as a local subprocess piping JSON-RPC over stdin/stdout. Zero network exposure — the filesystem/local-DB default.',
    related: ['MCP', '.mcp.json'],
  },
  'MCP server': {
    term: 'MCP server',
    definition:
      'The tool side of <code>MCP</code> — the thing exposing Slack messages or Stripe charges. Same object a consumer UI labels a "connector," seen from the build side.',
    related: ['MCP', 'Connector', '.mcp.json'],
  },
  'Prompt caching': {
    term: 'Prompt caching',
    definition:
      'Not a feature you turn on — a contract about what changes between calls. A cache read costs ~1/10th of full input; one CLAUDE.md edit voids the prefix and the bill spikes downstream.',
    related: ['Cache breakpoint', 'CLAUDE.md', 'Token'],
  },
  'Cache breakpoint': {
    term: 'Cache breakpoint',
    definition:
      'The <code>cache_control</code> point in a prompt marking the cached prefix. Put volatile content (new CLAUDE.md sections) <em>behind</em> it or you pay the write premium for a discount you never collect.',
    related: ['Prompt caching', 'Token'],
  },
  'Batch API': {
    term: 'Batch API',
    definition:
      'Half-price async inference if you can wait (up to 24h). The cost lever for non-interactive bulk work.',
    related: ['Token', 'Inference'],
  },
  Fork: {
    term: 'Fork',
    definition:
      'Resuming an old session and submitting a new prompt grows a new branch — the original timeline survives on disk. You can\'t overwrite; every new prompt on an old session is a new branch.',
    related: ['Instance', 'Context window'],
  },
  'Persona agent': {
    term: 'Persona agent',
    definition:
      'An agent that writes/posts in one specific human\'s voice behind an approval gate. Default is always <em>wait</em>, never time-based auto-post, with the Four NEVERs (deals, hires, firings, condolences) off-limits.',
    related: ['Skill', 'Agent', 'Hook'],
  },
  LSP: {
    term: 'LSP',
    definition:
      'A Language Server Protocol server wired into CC for symbol-level navigation ("go to definition") instead of string <code>grep</code>. Not automatic — install the code-intelligence plugin + a language-server binary.',
    related: ['Subagent', 'Plugin'],
  },
  'Night shift': {
    term: 'Night shift',
    definition:
      'A monitoring agent (typically Codex) running 24/7 against Sentry, issues, and cron failures — opens a PR, posts a summary, goes back to watching. The day driver (Claude Code) reviews and merges.',
    related: ['Agent', 'Headless mode'],
  },
  'HTML-ization': {
    term: 'HTML-ization',
    definition:
      'Shipping every deliverable — report, pitch, audit, deck, model — as a live interactive HTML artifact on a deployed link instead of a dead PDF/slide attachment. It gets opened, clicked into, forwarded; it stays current because it\'s re-rendered, not re-attached. See <a href="/html-first">HTML-ization</a>.',
    related: ['Persona agent', 'Swarm'],
  },
  'Sovereign stack': {
    term: 'Sovereign stack',
    definition:
      'A second LLM stack you run yourself — open-weights models (GLM-4.7, Kimi K2.5, Qwen 3.5, DeepSeek) on hardware you own, behind a runtime you control (Ollama / LM Studio / vLLM). Not a replacement for Claude / GPT / Gemini — insurance against the deprecation calendar, plus a 10–30× cheaper batch tier for evaluators, summarization, and RAG. See <a href="/sovereign-stack">The Sovereign Stack</a>.',
    related: ['Mythos', 'Heretic model'],
  },
  'Heretic model': {
    term: 'Heretic model',
    definition:
      'An open-weights model whose refusal direction has been surgically removed via abliteration — orthogonalizing weight matrices against the linear refusal direction in the residual stream (Arditi et al., 2024). Not jailbreaking: the weights themselves no longer encode the refusal, persistent across all sessions. Trade-off: 1–6% benchmark regression, and the model is no longer aligned by its lab — alignment becomes your problem. See <a href="/sovereign-stack#heretic">The heretic question</a>.',
    related: ['Sovereign stack'],
  },
  'Mythos': {
    term: 'Mythos',
    definition:
      'Vlad\'s private name for Claude Opus 3 — the model his team had learned to write against, retired by Anthropic on January 5, 2026. The Mythos lesson: any model you build a moat around is on someone else\'s calendar. Treat as a tail risk; eval-suite the alternative before the deprecation email arrives, not after. See <a href="/sovereign-stack#mythos">The Mythos lesson</a>. Not the same thing as <a href="/glossary#Mythos+5">Claude Mythos 5</a>, the model Anthropic shipped in June 2026 — three uses of one name, kept apart on purpose.',
    related: ['Sovereign stack', 'Mythos 5', 'Fable 5'],
  },
  'Fable 5': {
    term: 'Fable 5',
    definition:
      'Anthropic\'s most capable generally available model (released June 9, 2026; model id <code>claude-fable-5</code>). A Mythos-class model made safe for general use: safety classifiers gate offensive-cyber, bio/chem, and distillation requests — fallback to Opus 4.8 is built into the Claude apps and Managed Agents, opt-in on the API (blocked API requests error, unbilled). $10/$50 per Mtok, 1M context, 128K output. Also available as an advisor model cheaper workers call mid-task. See <a href="/fable-5">the model file</a>.',
    related: ['Mythos 5', 'Mythos-class'],
  },
  'Mythos 5': {
    term: 'Mythos 5',
    definition:
      'The raw twin of <a href="/glossary#Fable+5">Fable 5</a> — same underlying model, safeguards lifted in some areas, restricted to Project Glasswing partners and (next) vetted biology researchers. Reported scores sit within 1–3 points of Fable 5 except where the safeguards bite. Not Vlad\'s "Mythos" (that was Opus 3), and not Mythos Preview (the withheld March 2026 disclosure). See <a href="/fable-5/vs-mythos-5">Fable 5 vs Mythos 5</a>.',
    related: ['Fable 5', 'Mythos'],
  },
  'Mythos-class': {
    term: 'Mythos-class',
    definition:
      'Anthropic\'s tier above Opus — currently Fable 5 (generally available) and Mythos 5 (gated). Mythos-class traffic carries a limited 30-day retention requirement (misuse detection only, not training) and the classifier-plus-fallback safety architecture. See <a href="/fable-5">Fable 5</a>.',
    related: ['Fable 5', 'Mythos 5'],
  },
  'Abliteration': {
    term: 'Abliteration',
    definition:
      'A technique (coined by FailSpy in 2024, automated by the Heretic CLI in 2025) for permanently removing a model\'s refusal behavior by orthogonalizing every weight matrix that writes into the residual stream against the empirically-found refusal direction. Produces a "<a href="/glossary#Heretic+model">heretic model</a>" — same weights minus one specific behavior. See <a href="/sovereign-stack#heretic">The heretic question</a>.',
    related: ['Heretic model', 'Sovereign stack'],
  },
  'Dynamic workflows': {
    term: 'Dynamic workflows',
    definition:
      'Opus 4.8\'s headline Claude Code feature: Claude writes a JavaScript script that plans a big task, fans out subagents (up to 16 at once, 1,000 per run), runs an adversarial verifier pass, and returns one answer — the orchestration runs in the background, outside your context. A research preview. See <a href="/dynamic-workflows">Dynamic Workflows</a>.',
    related: ['ultracode', '/effort', 'Agent teams', 'Subagent'],
  },
  'Agent teams': {
    term: 'Agent teams',
    definition:
      'The other shape of Claude Code parallelism: a roster you define up front (one lead session plus named roles like Frontend Specialist, Backend Engineer) — for work that decomposes cleanly into domains. Contrast <a href="/dynamic-workflows#teams-vs-workflows">dynamic workflows</a>, where Claude writes the decomposition itself.',
    related: ['Dynamic workflows', 'Subagent'],
  },
  '/effort': {
    term: '/effort',
    definition:
      'The Opus 4.8 slash command that sets how hard the model thinks before it acts: low → medium → high (the default) → xhigh → max, with a separate <a href="/glossary#ultracode">ultracode</a> notch. Most people leave it on the default and never feel the ceiling. See <a href="/dynamic-workflows#the-on-ramp">Dynamic Workflows — turning it on</a>.',
    related: ['ultracode', 'Dynamic workflows'],
  },
  'ultracode': {
    term: 'ultracode',
    definition:
      'The top notch of the Opus 4.8 <a href="/glossary#%2Feffort">/effort</a> dial — xhigh reasoning plus workflows (parallel agents, a deeper plan). A Claude Code setting, not a model effort level: a mode, not a volume knob. See <a href="/dynamic-workflows#the-loop">Dynamic Workflows</a>.',
    related: ['/effort', 'Dynamic workflows'],
  },
  'Self-Audit': {
    term: 'Self-Audit',
    definition:
      'The multi-agent code audit pointed at the agent\'s own configuration — skills, hooks, memory, permissions, schedulers — with an adversarial red-team re-verifying every finding before anything executes. Config rot is silent by construction; the audit is what makes it visible. Method and receipts: <a href="/self-audit">The Self-Audit</a>.',
    related: ['Dynamic workflows', 'Agent teams'],
  },
};

export const glossaryTerms = Object.keys(glossary);
