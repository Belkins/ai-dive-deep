import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

async function loadModule(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { LEARNING_PATHS, LIBRARY_RESOURCES, matchesLibraryItem } = await loadModule('../src/lib/library.ts');
const { CHAPTERS } = await loadModule('../src/lib/chapters.ts');

test('library matches all query words independently of order and applies both filters', () => {
  const item = { title: 'Claude Code workflows', description: 'Evaluate the output', kind: 'Chapter', topics: ['Agents'], number: 25 };
  assert.ok(matchesLibraryItem(item, 'CODE claude'));
  assert.ok(matchesLibraryItem(item, '25 output', 'Chapter', 'Agents'));
  assert.ok(matchesLibraryItem(item, '  '));
  assert.equal(matchesLibraryItem(item, 'code missing'), false);
  assert.equal(matchesLibraryItem(item, '', 'Tool'), false);
  assert.equal(matchesLibraryItem(item, '', '', 'Security'), false);
});

test('learning paths have unique IDs and reference real chapters', () => {
  const slugs = new Set(CHAPTERS.map(chapter => chapter.slug));
  assert.equal(new Set(LEARNING_PATHS.map(path => path.id)).size, LEARNING_PATHS.length);
  for (const path of LEARNING_PATHS) {
    assert.ok(path.slugs.length >= 3);
    assert.equal(new Set(path.slugs).size, path.slugs.length);
    for (const slug of path.slugs) assert.ok(slugs.has(slug), `Unknown chapter ${slug}`);
  }
});

test('curated resource URLs are unique canonical local pages', () => {
  assert.equal(new Set(LIBRARY_RESOURCES.map(item => item.href)).size, LIBRARY_RESOURCES.length);
  for (const { href } of LIBRARY_RESOURCES) {
    assert.match(href, /^\/[a-z0-9-]+\/$/);
    assert.ok(existsSync(new URL(`../src/pages${href.slice(0, -1)}.astro`, import.meta.url)) || existsSync(new URL(`../src/pages${href}index.astro`, import.meta.url)), href);
  }
});
