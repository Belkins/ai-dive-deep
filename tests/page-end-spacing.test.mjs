import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// The owner picked the space above the 'Stay close' newsletter block: 48 px above its top border and
// 48 px between the border and 'Stay close' (96 px in all, down from 144). The chapter end stays as it was:
// 48 px under the article and 64 px above the previous/next cards. Tailwind's spacing step is 4 px, so a
// class like mt-12 is 12 x 4 = 48 px. The numbers below are the design, written out, not read from the code.
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const footer = read('../src/components/Footer.astro');
const chapterFooter = read('../src/components/ChapterFooter.astro');
const chapterPage = read('../src/pages/chapters/[slug].astro');

const px = (classes, prefix) => {
  const hits = classes.split(/\s+/).filter((c) => new RegExp(`^${prefix}-\\d+$`).test(c));
  assert.equal(hits.length, 1, `expected exactly one ${prefix}-N class in "${classes}"`);
  return Number(hits[0].split('-')[1]) * 4;
};

test('the newsletter block sits 48 px under the page and keeps 48 px above Stay close', () => {
  const section = footer.match(/<section data-newsletter class="([^"]+)"/);
  assert.ok(section, 'the newsletter section lost its data-newsletter hook');
  assert.equal(px(section[1], 'mt'), 48, 'margin above the border');
  const inner = footer.slice(section.index).match(/<div class="(container-wide [^"]+)"/);
  assert.equal(px(inner[1], 'py'), 48, 'padding between the border and Stay close');
});

test('the chapter end keeps 48 px under the article and 64 px above the previous/next cards', () => {
  const article = chapterPage.match(/<article class="(chapter-body [^"]+)"/);
  assert.equal(px(article[1], 'pb'), 48);
  const nav = chapterFooter.match(/<nav class="(container-prose [^"]+grid[^"]*)"/);
  assert.equal(px(nav[1], 'mt'), 64);
});
