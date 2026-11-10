import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { chapterSections } from '@/lib/search-sections';

// Every chapter H2 and H3, for the command palette. Headings and ids come from Astro's render(),
// the same call the chapter page makes, so each entry links to the id the page renders.
export const GET: APIRoute = async () => {
  const chapters = (await getCollection('chapters')).sort((a, b) => a.data.number - b.data.number);
  const payload = await Promise.all(chapters.map(async (chapter) => {
    const { headings } = await render(chapter);
    return chapterSections({ id: chapter.id, number: chapter.data.number, title: chapter.data.title }, headings);
  }));
  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
