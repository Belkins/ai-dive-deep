// Each chapter shares its own card (public/og/chapters/<slug>.png), drawn from its part label,
// title and subtitle. The cards are committed, not built in CI, so this test is what notices a
// chapter added or retitled without its card being redrawn. It never reads dist.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { loadTs } from './helpers/load-ts.mjs';
import { cardHash, cardInputs } from '../scripts/og-card-inputs.mjs';

const { CHAPTERS, PARTS } = loadTs(new URL('../src/lib/chapters.ts', import.meta.url));
const dir = new URL('../public/og/chapters/', import.meta.url);
const ledger = JSON.parse(readFileSync(new URL('../scripts/og-cards.json', import.meta.url), 'utf8'));
const REBUILD = 'run npm run og:cards -- --playwright <playwright-core folder> and commit public/og/chapters and scripts/og-cards.json';

function pngSize(buffer) {
  assert.equal(buffer.subarray(1, 4).toString('latin1'), 'PNG', 'not a PNG file');
  assert.equal(buffer.subarray(12, 16).toString('latin1'), 'IHDR', 'PNG without an IHDR header');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test('every chapter has a 1200 by 630 card', () => {
  for (const { slug } of CHAPTERS) {
    const file = new URL(`${slug}.png`, dir);
    assert.ok(existsSync(file), `public/og/chapters/${slug}.png is missing: ${REBUILD}`);
    assert.deepEqual(pngSize(readFileSync(file)), { width: 1200, height: 630 }, `${slug}.png is not 1200x630`);
  }
});

test('no card is left over from a chapter that no longer exists', () => {
  const slugs = new Set(CHAPTERS.map((c) => c.slug));
  const orphans = readdirSync(dir).filter((f) => !slugs.has(f.replace(/\.png$/, '')));
  assert.deepEqual(orphans, [], `files in public/og/chapters with no chapter: ${orphans.join(', ')}`);
});

test("each card's ledger hash matches today's part label, title and subtitle", () => {
  const stale = [];
  for (const chapter of CHAPTERS) {
    const part = PARTS.find((p) => p.slugs.includes(chapter.slug));
    assert.ok(part, `${chapter.slug} is in no part`);
    if (ledger[chapter.slug] !== cardHash(cardInputs(chapter, part.label))) stale.push(chapter.slug);
  }
  const extra = Object.keys(ledger).filter((slug) => !CHAPTERS.some((c) => c.slug === slug));
  assert.deepEqual({ stale, extra }, { stale: [], extra: [] }, `share cards out of date: ${REBUILD}`);
});

test('the card hash covers every input and nothing else', () => {
  const base = { template: 'chapter-card-v1', part: 'Part IV — Policy and Discipline', title: 'Hooks and Custom Subagents', subtitle: 'From Autocomplete to Coworker' };
  assert.equal(cardHash(base), cardHash({ ...base }));
  for (const key of Object.keys(base)) {
    assert.notEqual(cardHash({ ...base, [key]: `${base[key]}.` }), cardHash(base), `${key} does not change the hash`);
  }
  assert.match(cardHash(base), /^[0-9a-f]{64}$/);
});
