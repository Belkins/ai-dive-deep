import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://dive.vladyslavpodoliako.com';
const PULL_QUOTE = /<PullQuote[^>]*>([\s\S]*?)<\/PullQuote>/;

export const GET: APIRoute = async () => {
  const chapters = await getCollection('chapters');
  const sorted = chapters.sort((a, b) => a.data.number - b.data.number);

  const items = sorted.map((entry) => {
    const body = entry.body ?? '';
    const m = body.match(PULL_QUOTE);
    return {
      number: entry.data.number,
      slug: entry.data.slug,
      title: entry.data.title,
      subtitle: entry.data.subtitle,
      url: `${SITE}/chapters/${entry.data.slug}/`,
      tldr: entry.data.tldr,
      keyConcepts: entry.data.keyConcepts,
      readingMinutes: entry.data.readingMinutes,
      pullQuote: m ? m[1].trim() : null,
    };
  });

  const payload = {
    book: "Vlad's Playbook",
    subtitle: 'A field manual for operators who want to stop juggling tabs and start running AI like an OS.',
    author: {
      name: 'Vlad Podoliako',
      url: SITE,
      newsletter: 'https://www.vladsnewsletter.com',
      role: 'CEO Belkins; founder Folderly & LinguaLive',
    },
    citationHint: 'Cite the chapter URL and attribute to Vlad Podoliako.',
    canonicalUrl: SITE,
    license: 'Reading free. Citation appreciated. No email gate.',
    contact: 'v@vladyslavpodoliako.com',
    totalChapters: items.length,
    chapters: items,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
