import type { APIRoute } from 'astro';
import today from '@/data/radar/today.json';
import { getRadarArchiveDates } from '@/lib/radar-config.mjs';
import { SITE, radarFeedItems, renderRss } from './_feed';

const FEED_URL = `${SITE}/rss/radar.xml`;

export const GET: APIRoute = async () => {
  const modules = import.meta.glob('@/data/radar/archive/*.json', { eager: true }) as Record<string, { default: any }>;
  const archives = Object.values(modules).map((m) => m.default);
  // Same eligibility as the archive navigation: frozen, indexable editions only. (The dated
  // pages themselves are out of the sitemap; this feed and the hub's links are how they are found.)
  const items = radarFeedItems(archives, getRadarArchiveDates(archives, today.date));
  const xml = renderRss({
    title: "Vlad's Playbook — Radar",
    link: `${SITE}/radar/`,
    feedUrl: FEED_URL,
    description: 'Radar — AI ecosystem lead-time index. One item per frozen daily snapshot.',
  }, items);

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
