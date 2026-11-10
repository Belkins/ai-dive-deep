// Next and Previous follow the six parts, the journey the part introductions describe (Vlad's
// decision of 10 Nov 2026), not chapter numbers. In number order the footer of a Part IV chapter
// said "Next: Part III" and "You finished the book" sat on a Part V chapter while Part VI came later.
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTs } from './helpers/load-ts.mjs';

const { CHAPTERS, getNeighbors, getPart } = loadTs(new URL('../src/lib/chapters.ts', import.meta.url));
const slugOf = (c) => (c ? c.slug : null);

test('every chapter is in the reading order exactly once', () => {
  const seen = [];
  let slug = '01-killed-my-tabs';
  while (slug) {
    seen.push(slug);
    slug = slugOf(getNeighbors(slug).next);
    assert.ok(seen.length <= CHAPTERS.length, 'the next chain loops');
  }
  assert.deepEqual([...seen].sort(), CHAPTERS.map((c) => c.slug).sort());
});

test('the first chapter of Part I has no previous, the last chapter of Part VI has no next', () => {
  assert.equal(getNeighbors('01-killed-my-tabs').prev, null);
  assert.equal(slugOf(getNeighbors('01-killed-my-tabs').next), '02-five-tools');
  assert.equal(getNeighbors('56-skill-leaderboard').next, null);
  assert.equal(slugOf(getNeighbors('56-skill-leaderboard').prev), '55-claude-sonnet-5-5');
});

test('at a part boundary Next is the first chapter of the following part, and Previous mirrors it', () => {
  for (const [last, first] of [
    ['40-prompting-knob', '08-three-doors'], // Part II -> Part III
    ['37-context-files', '31-stages'], // Part IV -> Part V
    ['58-conductor-never-codes', '10-wild-stuff'], // Part V -> Part VI
  ]) {
    assert.equal(slugOf(getNeighbors(last).next), first, `${last} should lead to ${first}`);
    assert.equal(slugOf(getNeighbors(first).prev), last, `${first} should come after ${last}`);
  }
});

test('a Part IV chapter no longer points back into Part III', () => {
  const { next } = getNeighbors('16-hooks-subagents');
  assert.equal(slugOf(next), '57-claude-code-mods');
  assert.equal(getPart(next.slug).key, 'IV');
});

test('the chapter that said "You finished the book" now leads into Part VI', () => {
  const { next } = getNeighbors('58-conductor-never-codes');
  assert.notEqual(next, null);
  assert.equal(getPart(next.slug).label, 'Part VI — The Frontier and the Tier');
});

test('an unknown slug has no neighbours', () => {
  assert.deepEqual(getNeighbors('99-no-such-chapter'), { prev: null, next: null });
});
