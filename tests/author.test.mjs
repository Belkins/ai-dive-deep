import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { loadTs } from './helpers/load-ts.mjs';

const { AUTHOR } = loadTs(new URL('../src/lib/author.ts', import.meta.url));

// The Playbook's Person must resolve to the same entity as the personal site's,
// so name variants and the two sites are tied together in markup only.
test('the Playbook author links to its profile page and to the personal site Person', () => {
  assert.equal(AUTHOR['@id'], 'https://dive.vladyslavpodoliako.com/about/#vlad');
  assert.equal(AUTHOR.url, 'https://dive.vladyslavpodoliako.com/about/');
  assert.equal(AUTHOR.alternateName, 'Vladyslav Podoliako');
  assert.ok(AUTHOR.sameAs.includes('https://vladyslavpodoliako.com/#person'));
  assert.ok(AUTHOR.sameAs.includes('https://vladyslavpodoliako.com'));
});

test('the radar Dataset creator is the same Person node as the author', () => {
  const source = readFileSync(new URL('../src/components/RadarBoard.astro', import.meta.url), 'utf8');
  const creator = source.match(/^\s*creator: \{[^\n]*\},$/m)?.[0] ?? '';
  assert.match(creator, /'@id': AUTHOR\['@id'\]/);
});
