// Tests for src/lib/radar-chapters.ts — the filter behind OnTheRadar.astro. The strip
// must show only items the pipeline linked to THIS chapter, never demoted ones, and
// stay a strip (capped) rather than a second board.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/radar-chapters.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { radarItemsForChapter, MAX_ITEMS } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const it = (title, chapters, demoted = false) => ({ title, url: `https://x.test/${title}`, chapters, demoted });

test('only items linked to this chapter, in board order', () => {
  const items = [it('a', ['12-connectors-mcp']), it('b', ['25-evals-or-hope']), it('c', ['25-evals-or-hope', '12-connectors-mcp'])];
  assert.deepEqual(radarItemsForChapter(items, '12-connectors-mcp').map((x) => x.title), ['a', 'c']);
});

test('a demoted item never reaches a chapter page, even if linked', () => {
  assert.deepEqual(radarItemsForChapter([it('a', ['12-connectors-mcp'], true)], '12-connectors-mcp'), []);
});

test('items without the field (pipeline off or older payload) render nothing', () => {
  assert.deepEqual(radarItemsForChapter([{ title: 'a', url: 'u' }], '12-connectors-mcp'), []);
  assert.deepEqual(radarItemsForChapter(undefined, '12-connectors-mcp'), []);
});

test('capped at four, keeping the first four in board order', () => {
  const many = Array.from({ length: 7 }, (_, i) => it(`t${i}`, ['25-evals-or-hope']));
  assert.deepEqual(radarItemsForChapter(many, '25-evals-or-hope').map((x) => x.title), ['t0', 't1', 't2', 't3']);
  assert.equal(MAX_ITEMS, 4);
});
