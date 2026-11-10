import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTs } from './helpers/load-ts.mjs';

const feed = loadTs(new URL('../src/pages/rss/_feed.ts', import.meta.url));

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

test('renderRss escapes text and takes lastBuildDate from the newest item', () => {
  const xml = feed.renderRss(
    { title: "Vlad's Playbook — Test", link: 'https://example.test/', feedUrl: 'https://example.test/rss.xml', description: 'A & B' },
    [{ title: '<T>', link: 'https://example.test/a/', guid: 'https://example.test/a/', pubDate: 'Thu, 07 May 2026 00:00:00 +0000', description: 'x < y' }],
  );
  assert.match(xml, /<lastBuildDate>Thu, 07 May 2026 00:00:00 \+0000<\/lastBuildDate>/);
  assert.match(xml, /<title>&lt;T&gt;<\/title>/);
  assert.match(xml, /<description>A &amp; B<\/description>/);
});
