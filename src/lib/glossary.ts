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
      'A markdown file your project loads into every session. Working memory. Keep it under 100 lines.',
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
      'Running an AI tool without an interactive UI. `claude --print "..."` is the CC version. Use in CI and cron.',
  },
  Hook: {
    term: 'Hook',
    definition:
      'A shell script Claude Code runs before/after tool calls. PreToolUse, PostToolUse, Stop. Format-on-save, alert-on-finish.',
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
      'A specialized instance you spawn from your main session. Own context, own tools, returns one summary.',
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
};

export const glossaryTerms = Object.keys(glossary);
