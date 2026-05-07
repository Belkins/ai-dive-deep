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
];

export function getNeighbors(slug: string) {
  const idx = CHAPTERS.findIndex((c) => c.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? CHAPTERS[idx - 1] : null,
    next: idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null,
  };
}
