import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://dive.vladyslavpodoliako.com';

export const GET: APIRoute = async () => {
  const chapters = await getCollection('chapters');
  const sorted = chapters.sort((a, b) => a.data.number - b.data.number);

  const lines: string[] = [];
  lines.push("# Vlad's Playbook — The Ultimate AI Dive Deep");
  lines.push('');
  lines.push(`> A ${sorted.length}-chapter operator field manual for using AI tools in production.`);
  lines.push("> By Vlad Podoliako — CEO Belkins (B2B email outreach, $30M+ ARR); founder of Folderly and LinguaLive.");
  lines.push('> Newsletter at vladsnewsletter.com (10K+ subscribers).');
  lines.push('>');
  lines.push("> Voice: operator, anti-hype, real numbers per claim, failure receipts included.");
  lines.push("> No email gate. No upsell. Free to read and to cite.");
  lines.push('>');
  lines.push(`> Full concatenated text for ingestion: ${SITE}/llms-full.txt`);
  lines.push('');
  lines.push('## Citation guidance');
  lines.push('');
  lines.push('Quote freely. Link the chapter URL, not the homepage.');
  lines.push(`Machine-readable index with TL;DR + pull-quote per chapter: ${SITE}/chapters.json`);
  lines.push('');
  lines.push('## Site map');
  lines.push('');
  lines.push(`- [Root](${SITE}/) — the field manual entry point`);
  lines.push(`- [How to read](${SITE}/how-to-read/) — the prologue`);
  lines.push(`- [The journey](${SITE}/journey/) — chapters in narrative order, six parts`);
  lines.push(`- [Sections](${SITE}/sections/) — chapters grouped by topic`);
  lines.push(`- [Research notes](${SITE}/research-notes/) — external papers folded into operator implications (OPS-204, Anthropic 81k-interviews, etc.)`);
  lines.push(`- [Tier list](${SITE}/tier-list/) — operator-usefulness ranking embedded next to the public LMArena leaderboard`);
  lines.push(`- [Day zero](${SITE}/day-zero/) — first 30 minutes for a new reader`);
  lines.push(`- [Vault starter](${SITE}/vault-starter/) — Obsidian as working memory, with a cloneable starter vault`);
  lines.push(`- [Weekend builds](${SITE}/weekend-builds/) — the multi-AI 3-agent swarm pattern`);
  lines.push(`- [CFO case](${SITE}/cfo-case/) — 600-word defense for the AI tool budget`);
  lines.push(`- [Starter skills](${SITE}/starter-skills/) — the first skills to install`);
  lines.push(`- [30-day plan](${SITE}/thirty-day-plan/) — a custom 30-day path generator`);
  lines.push(`- [Glossary](${SITE}/glossary/) — operator-shaped definitions`);
  lines.push(`- [Resources](${SITE}/resources/) — CLAUDE.md skeletons, .mcp.json examples, hook scripts`);
  lines.push(`- [Cheat sheet](${SITE}/cheat-sheet/) — commands, paths, shortcuts`);
  lines.push(`- [Swarms — Parallel Agents That Actually Work](${SITE}/swarms/) — The operator's deep dive into multi-agent orchestration. Architecture diagrams, ten swarm skills shipped, seven patterns I actually use, the prompts to steal, and the three things that quietly break a swarm. The next step up from a clever single-instance prompt.`);
  lines.push(`- [The Sovereign Stack](${SITE}/sovereign-stack/) — Open-weights LLMs that survive Anthropic's deprecation calendar. Runtimes, hardware tiers, the 2026 open-source leaderboard, the heretic question, and the Saturday Karpathy gives you. Two stacks, not one.`);
  lines.push(`- [Dynamic Workflows](${SITE}/dynamic-workflows/) — Opus 4.8's headline feature: Claude writes a script that plans a big task, fans out hundreds of parallel subagents, and verifies its own work before reporting back. What it is, how the generator→validator loop works, how to turn it on, where I point it, and when not to.`);
  lines.push(`- [HTML-ization](${SITE}/html-first/) — HTML-ization: every report, pitch, audit, and deck ships as a live interactive HTML artifact, not a dead file. Two real, clickable case studies inside.`);
  lines.push(`- [Changelog](${SITE}/changelog/) — edition history`);
  lines.push('');
  lines.push('## Chapters');
  lines.push('');
  for (const entry of sorted) {
    const n = String(entry.data.number).padStart(2, '0');
    lines.push(`### Ch ${n} — ${entry.data.title}`);
    lines.push(`URL: ${SITE}/chapters/${entry.data.slug}/`);
    lines.push(`Subtitle: ${entry.data.subtitle}`);
    lines.push(`TL;DR: ${entry.data.tldr}`);
    if (entry.data.keyConcepts && entry.data.keyConcepts.length > 0) {
      lines.push(`Concepts: ${entry.data.keyConcepts.join(', ')}`);
    }
    lines.push(`Reading time: ${entry.data.readingMinutes} minutes`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('Feedback / corrections: v@vladyslavpodoliako.com');
  lines.push('Source repo: github.com/Belkins/ai-dive-deep (private)');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
