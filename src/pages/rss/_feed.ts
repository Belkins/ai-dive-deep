// Shared builders for the site's generated feeds. The leading underscore keeps
// this file out of Astro's routes. Dates come from the repo's data, never build time.
import { toPlainText } from '@/lib/seo';

export const SITE = 'https://dive.vladyslavpodoliako.com';

export interface FeedItem {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  description: string;
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Convert ISO yyyy-mm-dd or a full ISO timestamp → RFC 822 (e.g. "Tue, 13 May 2026 00:00:00 +0000")
export function rfc822(iso: string): string {
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00Z` : iso);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[d.getUTCDay()];
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const time = [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
  return `${dayName}, ${day} ${month} ${year} ${time} +0000`;
}

export interface ChapterFeedInput {
  id: string;
  number: number;
  title: string;
  tldr: string;
}

export type ChapterDates = Record<string, { published?: string; modified?: string }>;

// One item per chapter with a published date, newest first (ties: higher chapter number first).
export function chapterFeedItems(chapters: ChapterFeedInput[], dates: ChapterDates): FeedItem[] {
  return chapters
    .filter((c) => dates[c.id]?.published)
    .sort((a, b) => dates[b.id].published!.localeCompare(dates[a.id].published!) || b.number - a.number)
    .map((c) => {
      const link = `${SITE}/chapters/${c.id}/`;
      return {
        title: c.title,
        link,
        guid: link,
        pubDate: rfc822(dates[c.id].published!),
        description: toPlainText(c.tldr),
      };
    });
}

export function renderRss(channel: { title: string; link: string; feedUrl: string; description: string }, items: FeedItem[]): string {
  const body = items.map((item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`);
  const lastBuild = items.length > 0 ? `\n    <lastBuildDate>${items[0].pubDate}</lastBuildDate>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${channel.link}</link>
    <atom:link href="${channel.feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(channel.description)}</description>
    <language>en</language>${lastBuild}
${body.join('\n')}
  </channel>
</rss>
`;
}
