import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import chapterDates from '@/data/chapter-dates.json';
import { SITE, chapterFeedItems, renderRss } from './_feed';

const FEED_URL = `${SITE}/rss/chapters.xml`;

export const GET: APIRoute = async () => {
  const chapters = await getCollection('chapters');
  const items = chapterFeedItems(
    chapters.map((c) => ({ id: c.id, number: c.data.number, title: c.data.title, tldr: c.data.tldr })),
    chapterDates,
  );
  const xml = renderRss({
    title: "Vlad's Playbook — Chapters",
    link: `${SITE}/`,
    feedUrl: FEED_URL,
    description: `A ${chapters.length}-chapter operator field manual for using AI tools in production.`,
  }, items);

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
