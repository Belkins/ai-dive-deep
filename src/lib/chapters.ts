// Master ordered list of chapters. Slugs match filenames in src/content/chapters/.
export type ChapterMeta = {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
};

export const CHAPTERS: ChapterMeta[] = [
  { number: 1, slug: '01-killed-my-tabs', title: 'AI as an Operating System', subtitle: 'The Day I Killed My Tabs' },
  { number: 2, slug: '02-five-tools', title: 'The Five-Tool Stack', subtitle: 'Five Tools, Not Fifty' },
  { number: 3, slug: '03-temp-agency', title: 'Why Claude Forgets You', subtitle: 'AI Is a Temp Agency, Not a Genius' },
  { number: 4, slug: '04-the-vault', title: 'Obsidian as Working Memory', subtitle: 'The Vault — Where AI Becomes Useful' },
  { number: 5, slug: '05-skills', title: 'What a Skill Is', subtitle: 'Recipes the Chef Reads Before Cooking' },
  { number: 6, slug: '06-the-swarm', title: 'Parallel Subagents and Fan-Out', subtitle: 'The Swarm' },
  { number: 7, slug: '07-cron', title: 'Scheduled Tasks', subtitle: 'Make AI Work While You Sleep' },
  { number: 8, slug: '08-three-doors', title: 'Chat, Cowork, or Claude Code?', subtitle: 'Three Doors to Claude' },
  { number: 9, slug: '09-dont-get-owned', title: 'Blast Radius and Key Hygiene', subtitle: 'Don\'t Get Owned' },
  { number: 10, slug: '10-wild-stuff', title: 'Hosted Agents, Local Models, Frontier', subtitle: 'The Wild Stuff' },
  { number: 11, slug: '11-build-a-skill', title: 'Build a Skill in 30 Minutes', subtitle: 'How to Build a Skill, End to End' },
  { number: 12, slug: '12-connectors-mcp', title: 'Connectors and MCP', subtitle: 'Types, install paths, custom servers' },
  { number: 13, slug: '13-quickstart', title: 'Claude Code in 10 Minutes', subtitle: 'The 10-Minute Quickstart' },
  { number: 14, slug: '14-cheat-sheet', title: 'Slash Commands and Settings', subtitle: 'The Cheat Sheet' },
  { number: 15, slug: '15-permissions', title: 'When to Skip Permissions', subtitle: 'Permissions, Sandboxes, and Sharp Edges' },
  { number: 16, slug: '16-hooks-subagents', title: 'Hooks and Custom Subagents', subtitle: 'From Autocomplete to Coworker' },
  { number: 17, slug: '17-tips-tricks', title: '25 Operator Tips', subtitle: 'Hard-Won Wisdom from Hour 200' },
  { number: 18, slug: '18-headless-ci', title: 'Headless Claude and CI', subtitle: 'claude --print in Production' },
  { number: 19, slug: '19-build-products', title: 'Shipping a Product in a Saturday', subtitle: 'How to Build Products with AI' },
  { number: 20, slug: '20-terminal-windows', title: 'tmux, Worktrees, Named Sessions', subtitle: 'Running Six Claudes at Once' },
  { number: 21, slug: '21-three-modes', title: 'Which Mode Right Now?', subtitle: 'Interactive, Plan, Auto' },
  { number: 22, slug: '22-sessions', title: 'Resume, Replay, Fork', subtitle: 'Session Management' },
  { number: 23, slug: '23-vibe-coding', title: 'A Saturday Build, Hour by Hour', subtitle: 'Vibe Coding, with the Misfires Kept In' },
  { number: 24, slug: '24-tier-list', title: 'The Tier List', subtitle: 'Every Tool Ranked Without Mercy' },
  { number: 25, slug: '25-evals-or-hope', title: 'Evals — Smoke, Regression, Golden', subtitle: 'Evals or Hope, Pick One' },
  { number: 26, slug: '26-team-adoption', title: 'How Do I Get My Team to Adopt?', subtitle: 'Getting Twelve People to Use This' },
  { number: 27, slug: '27-voice-agents', title: 'Voice Agents — STT, LLM, TTS', subtitle: 'Phone Number to Production' },
  { number: 28, slug: '28-failure-receipts', title: 'Six Failures, Six Bills', subtitle: 'The Receipts I\'d Rather Not Show You' },
  { number: 29, slug: '29-cost-economics', title: 'Why Is My Bill So High?', subtitle: 'Token Math, Caching, Batch, Routing' },
  { number: 30, slug: '30-sdk-direct', title: 'When to Drop CC for the SDK', subtitle: 'Building with the Anthropic SDK Directly' },
  { number: 31, slug: '31-stages', title: 'Six Stages from Idea to Deploy', subtitle: 'Ideation, Foundation, Creation, Polishing, Security, Deploy' },
  { number: 32, slug: '32-archetypes-rick', title: 'Agent Archetypes (Rick Platform)', subtitle: 'OpenClaw, NemoClaw, Hermes' },
  { number: 33, slug: '33-browser-agents', title: 'Browser Agents with Playwright', subtitle: 'Login, Click, Scrape, Post' },
  { number: 34, slug: '34-write-on-behalf', title: 'Persona Agents and the Four NEVERs', subtitle: 'Writing on Your Behalf Without Becoming a Bot' },
  { number: 35, slug: '35-codex-and-cc', title: 'Codex or Claude Code — or Both?', subtitle: 'Day Shift, Night Shift' },
  { number: 36, slug: '36-frameworks-beyond', title: 'When Do I Outgrow Claude Code?', subtitle: 'Beyond CC — CrewAI, LangGraph, SDK' },
  { number: 37, slug: '37-context-files', title: 'Context Files — CLAUDE.md, memory, skills', subtitle: 'Where Conventions Live, Where They Die' },
  { number: 38, slug: '38-run-until-done', title: 'Run Until Done', subtitle: 'Goals, Loops, and the Evaluator That Tells the Agent to Stop' },
  { number: 39, slug: '39-skills-you-should-steal', title: 'Skills You Should Steal', subtitle: 'A tour of the 1M-skill ecosystem, the 73% that\'s broken, and the gaps an operator can fill' },
  { number: 40, slug: '40-prompting-knob', title: "Prompting, or the Knob You Probably Shouldn't Tune", subtitle: 'Why most prompt engineering content is wrong for operators' },
];

// Narrative parts — the journey shape. Different from SECTIONS (which is by topic).
// Parts tell a story: reframe → memory → workshop → building → frontier → tier.
export type PartKey = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export const PARTS: { key: PartKey; label: string; tagline: string; intro: string; slugs: string[] }[] = [
  {
    key: 'I',
    label: 'Part I — The Reframe',
    tagline: 'Stop using AI like a chatbot. Start using it like an OS.',
    intro: "Three chapters that change the question. The tabs die. The temp agency replaces the genius. The tool count drops from fifty to five. Read these in order; everything after assumes you've crossed this line in your head.",
    slugs: ['01-killed-my-tabs', '02-five-tools', '03-temp-agency'],
  },
  {
    key: 'II',
    label: 'Part II — Working Memory',
    tagline: 'The handbook every new instance reads on wake-up.',
    intro: 'The model is the genius with amnesia. The vault is the journal you hand it every morning. Skills are the recipe cards. Connectors are the kitchen. Without these four, every session starts from zero.',
    slugs: ['04-the-vault', '05-skills', '11-build-a-skill', '12-connectors-mcp', '40-prompting-knob'],
  },
  {
    key: 'III',
    label: 'Part III — The Workshop',
    tagline: 'Three doors, one swarm, the modes that own you.',
    intro: "Where the work actually happens. Pick the right surface (Chat / Cowork / Code), pick the right mode (Interactive / Plan / Auto), spawn a swarm when one thread isn't enough. This is the chapter range you'll re-read at hour 200.",
    slugs: ['08-three-doors', '13-quickstart', '14-cheat-sheet', '06-the-swarm', '21-three-modes', '22-sessions', '20-terminal-windows', '17-tips-tricks'],
  },
  {
    key: 'IV',
    label: 'Part IV — Policy and Discipline',
    tagline: 'Hooks turn ad-hoc prompting into policy. Permissions turn speed into safety.',
    intro: "Don't get owned. Don't skip the gates. Don't let the agent off the leash on your main machine. This part is the one most operators skim and most postmortems start with.",
    slugs: ['09-dont-get-owned', '15-permissions', '16-hooks-subagents', '37-context-files'],
  },
  {
    key: 'V',
    label: 'Part V — The Building Site',
    tagline: 'From Saturday idea to deployed URL with receipts.',
    intro: "Six stages: ideation → foundation → creation → polishing → security → deploy. Plus cron, headless, vibe coding, evals, the bill. This is the part that turns reading into shipping.",
    slugs: ['31-stages', '07-cron', '18-headless-ci', '19-build-products', '23-vibe-coding', '25-evals-or-hope', '29-cost-economics', '30-sdk-direct', '38-run-until-done'],
  },
  {
    key: 'VI',
    label: 'Part VI — The Frontier and the Tier',
    tagline: 'Agents that talk, write, browse, and the honest tier list.',
    intro: 'Voice, browser, persona, archetype agents. Two-agent infrastructure. Frameworks beyond Claude Code. Team adoption when twelve people need to use it. Failure stories with dollar amounts. The tier list, ranked without diplomatic phrasing. Plus the community skill ecosystem — what to steal and what to publish.',
    slugs: ['10-wild-stuff', '27-voice-agents', '32-archetypes-rick', '33-browser-agents', '34-write-on-behalf', '35-codex-and-cc', '36-frameworks-beyond', '39-skills-you-should-steal', '26-team-adoption', '28-failure-receipts', '24-tier-list'],
  },
];

// Map: slug -> part metadata for hero pills.
const _partBySlug: Record<string, { key: PartKey; label: string }> = {};
for (const p of PARTS) {
  for (const s of p.slugs) _partBySlug[s] = { key: p.key, label: p.label };
}
export function getPart(slug: string): { key: PartKey; label: string } | null {
  return _partBySlug[slug] ?? null;
}

export type SectionKey = 'general' | 'claude' | 'security' | 'agents' | 'building' | 'resources';

export const SECTIONS: { key: SectionKey; label: string; description: string; slugs: string[] }[] = [
  {
    key: 'general',
    label: 'General',
    description: "Mental models. The temp-agency frame. Five tools, not fifty. The vault that makes any model durable.",
    slugs: ['01-killed-my-tabs', '02-five-tools', '03-temp-agency', '04-the-vault', '05-skills', '37-context-files', '17-tips-tricks'],
  },
  {
    key: 'claude',
    label: 'Claude',
    description: 'Three doors (Chat / Cowork / Code), the swarm, the modes, sessions, the cheat sheet.',
    slugs: ['08-three-doors', '06-the-swarm', '13-quickstart', '14-cheat-sheet', '16-hooks-subagents', '21-three-modes', '22-sessions', '20-terminal-windows', '11-build-a-skill', '12-connectors-mcp', '37-context-files', '38-run-until-done', '40-prompting-knob'],
  },
  {
    key: 'security',
    label: 'Security',
    description: "Don't get owned. Permissions. Sandboxes. The 11-minute leak. Real failures with receipts.",
    slugs: ['09-dont-get-owned', '15-permissions', '28-failure-receipts'],
  },
  {
    key: 'agents',
    label: 'AI Agents',
    description: 'The wild stuff. Rick archetypes. Browser agents. Persona agents. Frameworks beyond Claude Code.',
    slugs: ['10-wild-stuff', '32-archetypes-rick', '33-browser-agents', '34-write-on-behalf', '36-frameworks-beyond', '35-codex-and-cc', '27-voice-agents', '39-skills-you-should-steal'],
  },
  {
    key: 'building',
    label: 'Building Products',
    description: "From Saturday idea to deployed URL. Six stages. Cron. Headless. Vibe coding. The bill, demystified.",
    slugs: ['31-stages', '07-cron', '18-headless-ci', '19-build-products', '23-vibe-coding', '25-evals-or-hope', '29-cost-economics', '30-sdk-direct'],
  },
  {
    key: 'resources',
    label: 'Team + Tier',
    description: "Get twelve people to use this. Rate every tool without diplomatic phrasing.",
    slugs: ['26-team-adoption', '24-tier-list'],
  },
];

export function getNeighbors(slug: string) {
  const idx = CHAPTERS.findIndex((c) => c.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? CHAPTERS[idx - 1] : null,
    next: idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null,
  };
}
