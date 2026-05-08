// Master ordered list of chapters. Slugs match filenames in src/content/chapters/.
export type ChapterMeta = {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
};

export const CHAPTERS: ChapterMeta[] = [
  { number: 1, slug: '01-killed-my-tabs', title: 'The Day I Killed My Tabs', subtitle: 'A Tuesday morning that changed how I work.' },
  { number: 2, slug: '02-five-tools', title: 'Five Tools, Not Fifty', subtitle: 'Five tools, eighty percent of my output. The kitchen brigade.' },
  { number: 3, slug: '03-temp-agency', title: 'AI Is A Temp Agency, Not A Genius', subtitle: 'Why every Claude session is a fresh employee on day one.' },
  { number: 4, slug: '04-the-vault', title: 'The Vault: Where AI Becomes Useful', subtitle: 'Obsidian, neuron logic, and the second brain that makes AI durable.' },
  { number: 5, slug: '05-skills', title: 'Skills: Recipes The Chef Reads Before Cooking', subtitle: 'Recipe cards the chef reads before cooking.' },
  { number: 6, slug: '06-the-swarm', title: 'The Swarm', subtitle: 'Stop doing things sequentially. The fan-out is the unlock.' },
  { number: 7, slug: '07-cron', title: 'Cron: Make AI Work While You Sleep', subtitle: 'How to make AI work while you sleep.' },
  { number: 8, slug: '08-three-doors', title: 'Three Doors to Claude', subtitle: 'Chat, Cowork, Code — same engine, three vehicles.' },
  { number: 9, slug: '09-dont-get-owned', title: "Don't Get Owned", subtitle: 'The blast-radius mental model.' },
  { number: 10, slug: '10-wild-stuff', title: 'The Wild Stuff', subtitle: "Agents, local models, and what I'd do tomorrow morning." },
  { number: 11, slug: '11-build-a-skill', title: 'How to Build a Skill, End to End', subtitle: 'How to build a skill end-to-end, in code.' },
  { number: 12, slug: '12-connectors-mcp', title: 'Connectors and MCP', subtitle: 'Types of connectors, how to install, and how to write your own.' },
  { number: 13, slug: '13-quickstart', title: 'The 10-Minute Quickstart', subtitle: 'From zero to first task in under ten minutes.' },
  { number: 14, slug: '14-cheat-sheet', title: 'Slash Commands & The Cheat Sheet', subtitle: 'Slash commands, settings, and the keys you actually press.' },
  { number: 15, slug: '15-permissions', title: 'Permissions, Sandboxes, and the Sharp Edges', subtitle: 'Permissions, sandboxes, and the foot-gun named --dangerously-skip-permissions.' },
  { number: 16, slug: '16-hooks-subagents', title: 'Hooks and Subagents', subtitle: 'How to turn Claude Code from autocomplete into a coworker.' },
  { number: 17, slug: '17-tips-tricks', title: 'Tips, Tricks, and Hard-Won Wisdom', subtitle: 'Twenty-five operator tips you only learn at hour two hundred.' },
  { number: 18, slug: '18-headless-ci', title: 'Headless, CI, and Claude in Production', subtitle: 'How to run Claude in production: headless, cron, GitHub Actions.' },
  { number: 19, slug: '19-build-products', title: 'How to Build Products With AI', subtitle: 'From idea to deployed URL in a single Saturday.' },
  { number: 20, slug: '20-terminal-windows', title: 'Terminal Windows', subtitle: 'tmux, named sessions, worktrees — running 6 Claudes without losing your mind.' },
  { number: 21, slug: '21-three-modes', title: 'Interactive, Plan, Auto', subtitle: 'Knowing which mode you are in is half the discipline.' },
  { number: 22, slug: '22-sessions', title: 'Session Management', subtitle: 'Resume, replay, fork — the right way to re-enter work.' },
  { number: 23, slug: '23-vibe-coding', title: 'Vibe Coding', subtitle: 'A real Saturday build, hour by hour, with the misfires kept in.' },
  { number: 24, slug: '24-tier-list', title: 'The Tier List', subtitle: 'Vlad rates every AI tool, connector, and adjacent tool he uses.' },
  { number: 25, slug: '25-evals-or-hope', title: 'Evals or Hope, Pick One', subtitle: "If you don't have evals, you don't have a workflow — you have a prayer with a Slack channel." },
  { number: 26, slug: '26-team-adoption', title: 'Getting Twelve People to Use This', subtitle: 'Single-operator AI is easy. Team AI is a change-management problem dressed up as a tooling problem.' },
  { number: 27, slug: '27-voice-agents', title: 'Voice Agents, Phone Number to Production', subtitle: 'Why every voice-agent demo is a lie about latency and what a real stack costs.' },
  { number: 28, slug: '28-failure-receipts', title: "The Receipts I'd Rather Not Show You", subtitle: "Six failures, six bills, six things the demo videos won't tell you." },
  { number: 29, slug: '29-cost-economics', title: 'The Bill, Demystified', subtitle: 'Token math, prompt caching, batch API, model routing — what actually moves your invoice.' },
  { number: 30, slug: '30-sdk-direct', title: 'Building With the Anthropic SDK Directly', subtitle: 'When Claude Code and Cowork stop being the answer and you have to write 30 lines of Python.' },
  { number: 31, slug: '31-stages', title: 'The Stages: Ideation to Deploy', subtitle: 'Six stages. One Saturday. The order matters more than the speed.' },
  { number: 32, slug: '32-archetypes-rick', title: 'How to Build Rick', subtitle: 'OpenClaw, NemoClaw, Hermes — pick a preset, the agent shows up dressed for the job.' },
  { number: 33, slug: '33-browser-agents', title: 'Browser Agents: Login, Click, Scrape, Post', subtitle: "When the connector doesn't exist and the workflow lives on a webpage." },
  { number: 34, slug: '34-write-on-behalf', title: 'Writing On Your Behalf, Without Becoming a Bot', subtitle: 'Voice clones, persona agents, and the four lines you should never let an agent cross.' },
  { number: 35, slug: '35-codex-and-cc', title: 'Codex × Claude Code', subtitle: "They're not competing. They're shifts." },
  { number: 36, slug: '36-frameworks-beyond', title: 'Frameworks Beyond Claude Code', subtitle: "When CC's subagent system stops being the answer and you have to architect a graph." },
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
    slugs: ['04-the-vault', '05-skills', '11-build-a-skill', '12-connectors-mcp'],
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
    slugs: ['09-dont-get-owned', '15-permissions', '16-hooks-subagents'],
  },
  {
    key: 'V',
    label: 'Part V — The Building Site',
    tagline: 'From Saturday idea to deployed URL with receipts.',
    intro: "Six stages: ideation → foundation → creation → polishing → security → deploy. Plus cron, headless, vibe coding, evals, the bill. This is the part that turns reading into shipping.",
    slugs: ['31-stages', '07-cron', '18-headless-ci', '19-build-products', '23-vibe-coding', '25-evals-or-hope', '29-cost-economics', '30-sdk-direct'],
  },
  {
    key: 'VI',
    label: 'Part VI — The Frontier and the Tier',
    tagline: 'Agents that talk, write, browse, and the honest tier list.',
    intro: 'Voice, browser, persona, archetype agents. Two-agent infrastructure. Frameworks beyond Claude Code. Team adoption when twelve people need to use it. Failure stories with dollar amounts. The tier list, ranked without diplomatic phrasing.',
    slugs: ['10-wild-stuff', '27-voice-agents', '32-archetypes-rick', '33-browser-agents', '34-write-on-behalf', '35-codex-and-cc', '36-frameworks-beyond', '26-team-adoption', '28-failure-receipts', '24-tier-list'],
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
    slugs: ['01-killed-my-tabs', '02-five-tools', '03-temp-agency', '04-the-vault', '05-skills', '17-tips-tricks'],
  },
  {
    key: 'claude',
    label: 'Claude',
    description: 'Three doors (Chat / Cowork / Code), the swarm, the modes, sessions, the cheat sheet.',
    slugs: ['08-three-doors', '06-the-swarm', '13-quickstart', '14-cheat-sheet', '16-hooks-subagents', '21-three-modes', '22-sessions', '20-terminal-windows', '11-build-a-skill', '12-connectors-mcp'],
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
    slugs: ['10-wild-stuff', '32-archetypes-rick', '33-browser-agents', '34-write-on-behalf', '36-frameworks-beyond', '35-codex-and-cc', '27-voice-agents'],
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
