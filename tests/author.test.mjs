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

// Vlad confirmed these five profiles on the decision page (10 Nov 2026) and asked
// that each be added where missing with nothing removed.
test('the author sameAs keeps every earlier profile and adds the five Vlad confirmed', () => {
  const expected = [
    'https://www.linkedin.com/in/chiefdata/',
    'https://x.com/StBelkins',
    'https://www.youtube.com/@stbelkins',
    'https://t.me/belkinsmain',
    'https://vladyslavpodoliako.com',
    'https://vladyslavpodoliako.com/#person',
    'https://www.vladsnewsletter.com',
    'https://linktr.ee/vladyslav.podoliako',
    'https://crunchbase.com/person/vladislav-podolyako',
    'https://builtin.com/authors/Vladyslav-Podoliako',
    'https://thenextweb.com/author/vladyslav-podoliako',
    'https://producthunt.com/@belkins',
  ];
  for (const url of expected) assert.ok(AUTHOR.sameAs.includes(url), `sameAs lacks ${url}`);
  assert.equal(AUTHOR.sameAs.length, 12);
  assert.equal(new Set(AUTHOR.sameAs).size, 12);
});
