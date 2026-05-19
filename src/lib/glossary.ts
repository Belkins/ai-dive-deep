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
      'A command, HTTP endpoint, or short LLM prompt Claude Code runs automatically at lifecycle points (PreToolUse, PostToolUse, Stop, SessionStart, …). Lives in <code>settings.json</code>, not the chat — the model can\'t skip it.',
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
  Htmlization: {
    term: 'Htmlization',
    definition:
      'Shipping every deliverable — report, pitch, audit, deck, model — as a live interactive HTML artifact on a deployed link instead of a dead PDF/slide attachment. It gets opened, clicked into, forwarded; it stays current because it\'s re-rendered, not re-attached. See the <a href="/html-first">HTML-first method</a>.',
    related: ['Persona agent', 'Swarm'],
  },
};

export const glossaryTerms = Object.keys(glossary);
