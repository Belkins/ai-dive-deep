import type { APIRoute } from 'astro';
import { CHANGELOG } from '@/lib/changelog';

const SITE = 'https://dive.vladyslavpodoliako.com';
const FEED_URL = `${SITE}/rss/changelog.xml`;
const PAGE_URL = `${SITE}/changelog/`;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Convert ISO yyyy-mm-dd → RFC 822 (e.g. "Tue, 13 May 2026 00:00:00 +0000")
function rfc822(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[d.getUTCDay()];
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${dayName}, ${day} ${month} ${year} 00:00:00 +0000`;
}

export const GET: APIRoute = async () => {
  const items = CHANGELOG.map((entry) => {
    const title = `${entry.edition} — ${entry.tagline}`;
    const link = `${PAGE_URL}#${slugify(entry.edition)}`;
    const guid = `${entry.edition}|${entry.date}`;
    // Full-text description: tagline + shipped list + receipts
    const parts: string[] = [];
    parts.push(entry.tagline);
    parts.push('');
    parts.push('Shipped:');
    for (const s of entry.shipped) parts.push(`- ${s}`);
    if (entry.receipts && entry.receipts.length > 0) {
      parts.push('');
      parts.push('Receipts:');
      for (const r of entry.receipts) parts.push(`- ${r.label}: ${r.value}`);
    }
    const description = parts.join('\n');
    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
      <pubDate>${rfc822(entry.date)}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
  });

  const lastBuild = CHANGELOG.length > 0 ? rfc822(CHANGELOG[0].date) : rfc822(new Date().toISOString().slice(0, 10));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vlad's Ultimate AI Dive Deep — Changelog</title>
    <link>${PAGE_URL}</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>Edition history. What shipped, when, and the receipts behind each.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
