import { SOP_LIBRARY, sopHref } from './sops';

export type LibraryItem = {
  href: string;
  title: string;
  description: string;
  kind: 'Chapter' | 'Guide' | 'Tool' | 'SOP';
  topics: string[];
  minutes?: number;
  number?: number;
};

export const LEARNING_PATHS = [
  {
    id: 'first-workflow', title: 'Build your first workflow',
    outcome: 'A repeatable task with clear inputs, a reusable skill, and a human approval step.',
    slugs: ['08-three-doors', '13-quickstart', '09-dont-get-owned', '11-build-a-skill'],
  },
  {
    id: 'reliable-agents', title: 'Make agents reliable',
    outcome: 'A bounded agent task with persistent context, regression checks, and a stop condition.',
    slugs: ['37-context-files', '15-permissions', '25-evals-or-hope', '38-run-until-done'],
  },
  {
    id: 'ship-a-product', title: 'Ship a product',
    outcome: 'A small product brief, a build sequence, and evidence for the release decision.',
    slugs: ['31-stages', '23-vibe-coding', '46-designing-with-ai', '47-measurement-layer'],
  },
  {
    id: 'team-rollout', title: 'Roll AI out to a team',
    outcome: 'An adoption pilot with ownership, a cost model, and a measurable quality bar.',
    slugs: ['26-team-adoption', '29-cost-economics', '28-failure-receipts', '47-measurement-layer'],
  },
] as const;

export const LIBRARY_RESOURCES: LibraryItem[] = [
  { href: '/sops/', title: 'AI SOP library', description: 'Six untested departmental procedures with Markdown downloads, approval roles, and unrun checks.', kind: 'Guide', topics: ['Reference', 'AI Agents'] },
  ...SOP_LIBRARY.map(sop => ({ href: sopHref(sop), title: sop.title, description: sop.summary, kind: 'SOP' as const, topics: [sop.department, 'Reference'] })),
  { href: '/workflow-planner/', title: 'AI workflow planner', description: 'Define inputs, approvals, and acceptance tests. Export an operating specification.', kind: 'Tool', topics: ['Building Products', 'AI Agents'] },
  { href: '/learn/', title: 'Learn the basics', description: 'Free foundational courses and a learning ladder before the playbook.', kind: 'Guide', topics: ['Getting started'] },
  { href: '/day-zero/', title: 'Day zero', description: 'A first-session path for operators new to working with AI.', kind: 'Guide', topics: ['Getting started'] },
  { href: '/resources/', title: 'Templates and configurations', description: 'Context-file skeletons, MCP configuration examples, and hook scripts.', kind: 'Guide', topics: ['Reference', 'AI Agents'] },
  { href: '/cheat-sheet/', title: 'Command cheat sheet', description: 'Commands, paths, and settings to keep beside your terminal.', kind: 'Guide', topics: ['Reference'] },
  { href: '/glossary/', title: 'AI operator glossary', description: 'Definitions connected to the chapters where each concept is used.', kind: 'Guide', topics: ['Reference', 'Getting started'] },
  { href: '/research-notes/', title: 'Research notes', description: 'Papers translated into operator implications, with links to their sources.', kind: 'Guide', topics: ['Research'] },
  { href: '/radar/', title: 'AI Radar', description: 'A source-linked feed of AI papers, repositories, and ecosystem developments.', kind: 'Tool', topics: ['Research'] },
  { href: '/agent-workflow/', title: 'Agent workflow', description: 'Issue specifications, task queues, and review responsibilities for a multi-agent team.', kind: 'Guide', topics: ['AI Agents', 'Building Products'] },
  { href: '/vault-starter/', title: 'Vault starter', description: 'An Obsidian working-memory structure for reusable context.', kind: 'Guide', topics: ['Getting started', 'Reference'] },
  { href: '/starter-skills/', title: 'Starter skills', description: 'Reusable task instructions to adapt for your own work.', kind: 'Guide', topics: ['AI Agents', 'Reference'] },
  { href: '/thirty-day-plan/', title: '30-day learning plan', description: 'Build a learning schedule around your available time and experience.', kind: 'Tool', topics: ['Getting started'] },
];

export function matchesLibraryItem(item: LibraryItem, query: string, kind = '', topic = ''): boolean {
  if (kind && item.kind !== kind) return false;
  if (topic && !item.topics.includes(topic)) return false;
  const text = `${item.title} ${item.description} ${item.topics.join(' ')} ${item.number ?? ''}`.normalize('NFKC').toLocaleLowerCase();
  return query.normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean).every(term => text.includes(term));
}
