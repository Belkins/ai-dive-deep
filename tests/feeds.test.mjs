import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { loadTs } from './helpers/load-ts.mjs';
import { getRadarArchiveDates } from '../src/lib/radar-config.mjs';

const feed = loadTs(new URL('../src/pages/rss/_feed.ts', import.meta.url));
const RFC822 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} \+0000$/;

test('rfc822 formats dates and timestamps in UTC', () => {
  assert.equal(feed.rfc822('2026-05-07'), 'Thu, 07 May 2026 00:00:00 +0000');
  assert.equal(feed.rfc822('2026-05-13T22:28:33.327Z'), 'Wed, 13 May 2026 22:28:33 +0000');
});

test('chapter feed: one item per dated chapter, newest published first, TL;DR as plain text', () => {
  const chapters = [
    { id: '01-a', number: 1, title: 'First', tldr: 'Plain **bold** words.' },
    { id: '02-b', number: 2, title: 'Second', tldr: 'Two.' },
    { id: '03-c', number: 3, title: 'Third', tldr: 'Three.' },
    { id: '04-undated', number: 4, title: 'Undated', tldr: 'No date.' },
  ];
  const dates = {
    '01-a': { published: '2026-05-07', modified: '2026-06-01' },
    '02-b': { published: '2026-07-01', modified: '2026-07-01' },
    '03-c': { published: '2026-05-07', modified: '2026-05-08' },
  };
  const items = feed.chapterFeedItems(chapters, dates);
  assert.deepEqual(items.map((i) => i.title), ['Second', 'Third', 'First']);
  assert.equal(items[2].link, 'https://dive.vladyslavpodoliako.com/chapters/01-a/');
  assert.equal(items[2].pubDate, 'Thu, 07 May 2026 00:00:00 +0000');
  assert.equal(items[2].description, 'Plain bold words.');
});

test('radar feed: eligible archive dates only, newest first, capped at 60', () => {
  const archives = Array.from({ length: 70 }, (_, i) => ({
    date: `2026-0${1 + Math.floor(i / 28)}-${String((i % 28) + 1).padStart(2, '0')}`,
    generated: '2026-01-01T06:00:00Z',
  }));
  const eligible = archives.map((a) => a.date).filter((d) => d !== '2026-03-14');
  const items = feed.radarFeedItems(archives, [...eligible, '2026-12-31']);
  assert.equal(items.length, 60);
  assert.equal(items[0].link, 'https://dive.vladyslavpodoliako.com/radar/2026-03-13/');
  assert.equal(items[0].title, 'Radar — 2026-03-13');
  assert.ok(items.every((i) => RFC822.test(i.pubDate)));
  assert.ok(!items.some((i) => i.link.includes('2026-03-14') || i.link.includes('2026-12-31')));
});

test('radar feed over the real archive matches the sitemap eligibility', () => {
  const dir = new URL('../src/data/radar/archive/', import.meta.url);
  const archives = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(new URL(f, dir), 'utf8')));
  const today = JSON.parse(readFileSync(new URL('../src/data/radar/today.json', import.meta.url), 'utf8'));
  const eligible = getRadarArchiveDates(archives, today.date);
  const items = feed.radarFeedItems(archives, eligible);
  assert.equal(items.length, Math.min(60, eligible.length));
  assert.deepEqual(items.map((i) => i.link), eligible.slice(0, 60).map((d) => `https://dive.vladyslavpodoliako.com/radar/${d}/`));
});

test('renderRss escapes text and takes lastBuildDate from the newest item', () => {
  const xml = feed.renderRss(
    { title: "Vlad's Playbook — Test", link: 'https://example.test/', feedUrl: 'https://example.test/rss.xml', description: 'A & B' },
    [{ title: '<T>', link: 'https://example.test/a/', guid: 'https://example.test/a/', pubDate: 'Thu, 07 May 2026 00:00:00 +0000', description: 'x < y' }],
  );
  assert.match(xml, /<lastBuildDate>Thu, 07 May 2026 00:00:00 \+0000<\/lastBuildDate>/);
  assert.match(xml, /<title>&lt;T&gt;<\/title>/);
  assert.match(xml, /<description>A &amp; B<\/description>/);
});
