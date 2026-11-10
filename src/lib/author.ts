// Author + publisher entity graph for schema.org JSON-LD.
// Machine-readable only — never rendered to readers. Consumed by
// BaseLayout.astro to populate the Article/Book `author` and `publisher`
// nodes so search engines and LLMs get citation-grade entity data.

export const AUTHOR = {
  '@type': 'Person',
  '@id': 'https://dive.vladyslavpodoliako.com/about/#vlad',
  name: 'Vlad Podoliako',
  alternateName: 'Vladyslav Podoliako',
  url: 'https://dive.vladyslavpodoliako.com/about/',
  jobTitle: 'CEO, Belkins',
  worksFor: {
    '@type': 'Organization',
    name: 'Belkins',
    url: 'https://belkins.io',
  },
  description:
    'Operator. CEO of Belkins (B2B email outreach, $30M+ ARR); founder of Folderly and LinguaLive; writes vladsnewsletter.com (10K+ subscribers).',
  knowsAbout: [
    'agentic AI',
    'Claude Code',
    'AI agents',
    'AI agent orchestration',
    'Model Context Protocol (MCP)',
    'prompt engineering',
    'AI agent memory',
    'agent memory curation',
    'context engineering',
    'AI for operators and founders',
    'AI tooling',
  ],
  // Profile URLs as published on vladyslavpodoliako.com (verified 2026-08-03), then
  // the five profiles Vlad confirmed on the decision page on 10 Nov 2026.
  sameAs: [
    'https://www.linkedin.com/in/chiefdata/',
    'https://x.com/StBelkins',
    'https://www.youtube.com/@stbelkins',
    'https://t.me/belkinsmain',
    'https://vladyslavpodoliako.com',
    // The personal site's Person node, so both sites describe one entity.
    'https://vladyslavpodoliako.com/#person',
    'https://www.vladsnewsletter.com',
    // The five confirmed by Vlad on 10 Nov 2026.
    'https://linktr.ee/vladyslav.podoliako',
    'https://crunchbase.com/person/vladislav-podolyako',
    'https://builtin.com/authors/Vladyslav-Podoliako',
    'https://thenextweb.com/author/vladyslav-podoliako',
    'https://www.producthunt.com/@belkins',
  ],
} as const;

export const PUBLISHER = {
  '@type': 'Organization',
  name: "Vlad's Playbook",
  url: 'https://dive.vladyslavpodoliako.com',
} as const;
