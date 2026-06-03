import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://dive.vladyslavpodoliako.com';

// Pragmatic MDX-to-plain-prose stripper. This is a corpus dump for LLM
// ingestion, not a faithful renderer — it removes machinery a reader never
// sees (imports, bare JSX/component tags, frontmatter) and collapses the
// blank lines that result. Prose, headings, code fences, and lists pass
// through untouched.
function stripMdx(raw: string): string {
  let body = raw ?? '';

  // Defensively strip leading YAML frontmatter if present (getCollection's
  // entry.body normally already excludes it, but raw MDX strings sometimes
  // retain it depending on the loader).
  body = body.replace(/^﻿?---\n[\s\S]*?\n---\n?/, '');

  const out: string[] = [];
  for (const line of body.split('\n')) {
    const trimmed = line.trim();

    // Drop import statements.
    if (trimmed.startsWith('import ')) continue;

    // Drop lines that are nothing but a JSX/component tag:
    //   <Component .../>   self-closing
    //   <Component ...>     opening
    //   </Component>        closing
    // Components are PascalCase or contain a slash/attributes — match a tag
    // that occupies the whole line. Plain prose with inline punctuation like
    // "a < b" or "x > y" won't match because it requires a leading "<" + name.
    if (/^<\/?[A-Za-z][\w.-]*(\s[^>]*)?\/?>$/.test(trimmed)) continue;

    out.push(line);
  }

  // Collapse 3+ consecutive blank lines down to a single blank line.
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export const GET: APIRoute = async () => {
  const chapters = await getCollection('chapters');
  const sorted = chapters.sort((a, b) => a.data.number - b.data.number);

  const lines: string[] = [];
  lines.push("# Vlad's Playbook — Full Text");
  lines.push('');
  lines.push(`> The full concatenated text of all ${sorted.length} chapters, for LLM ingestion.`);
  lines.push("> By Vlad Podoliako — CEO Belkins (B2B email outreach, $30M+ ARR); founder of Folderly and LinguaLive.");
  lines.push('> Newsletter at vladsnewsletter.com (10K+ subscribers).');
  lines.push('>');
  lines.push("> Voice: operator, anti-hype, real numbers per claim, failure receipts included.");
  lines.push("> No email gate. No upsell. Free to read and to cite.");
  lines.push('');
  lines.push('## Citation guidance');
  lines.push('');
  lines.push('Quote freely. Link the chapter URL, not the homepage.');
  lines.push(`Machine-readable index with TL;DR + pull-quote per chapter: ${SITE}/chapters.json`);
  lines.push(`Plain-text site map: ${SITE}/llms.txt`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const entry of sorted) {
    const n = String(entry.data.number).padStart(2, '0');
    lines.push(`## Ch ${n} — ${entry.data.title}`);
    lines.push('');
    lines.push(entry.data.subtitle);
    lines.push('');
    lines.push(`TL;DR: ${entry.data.tldr}`);
    lines.push('');
    lines.push(`URL: ${SITE}/chapters/${entry.data.slug}/`);
    lines.push('');
    lines.push(stripMdx(entry.body ?? ''));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('Feedback / corrections: v@vladyslavpodoliako.com');
  lines.push('Source repo: github.com/Belkins/ai-dive-deep (private)');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
