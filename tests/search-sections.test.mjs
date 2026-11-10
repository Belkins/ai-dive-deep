import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import ts from 'typescript';
import astroConfig from '../astro.config.mjs';

// A reader who remembers a section heading from inside a chapter must find it in Cmd-K and land on it.
// Section entries come from /search-sections.json, built from Astro's own headings, so this suite
// checks the builder against Astro's markdown pipeline and the ranking against the real catalog,
// without reading dist (CI runs tests before the build).

function moduleUrl(source) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
}
const readSource = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const { createSearchIndex, searchItems } = await import(moduleUrl(readSource('../src/lib/search.ts')));
const sections = await import(moduleUrl(readSource('../src/lib/search-sections.ts')));
const { chapterSections, chapterSectionItems, loadChapterSectionItems } = sections;

// Literal headings from chapters 16, 21 and 37, with the ids their built pages carry
// (dist/chapters/<slug>/index.html, checked when this test was written).
const SAMPLE = [
  ['## The exploration/editing split', 'The exploration/editing split', 'the-explorationediting-split'],
  ['### 3. block-push-to-main', '3. block-push-to-main', '3-block-push-to-main'],
  ['## Hooks + subagents = real systems', 'Hooks + subagents = real systems', 'hooks--subagents--real-systems'],
  ['## Mode 4 — `/goal`', 'Mode 4 — /goal', 'mode-4--goal'],
  ['## A note on `~/.claude/CLAUDE.md` (the global one)', 'A note on ~/.claude/CLAUDE.md (the global one)', 'a-note-on-claudeclaudemd-the-global-one'],
];

test('section entries link to the ids Astro renders and show the heading text as written', async () => {
  const processor = await createMarkdownProcessor(astroConfig.markdown);
  const source = [...SAMPLE.map(([markdown]) => markdown), '#### A fourth-level heading', '## Do this Monday', '## Do this Monday']
    .join('\n\nBody text.\n\n');
  const { code, metadata } = await processor.render(source);
  const renderedIds = [...code.matchAll(/<h[234] id="([^"]+)"/g)].map(([, id]) => id);
  const data = chapterSections({ id: '16-hooks-subagents', number: 16, title: 'Hooks and Custom Subagents' }, metadata.headings);
  const items = chapterSectionItems([data]);

  assert.deepEqual(items.map(({ title }) => title), [...SAMPLE.map(([, text]) => text), 'Do this Monday', 'Do this Monday'],
    'H2 and H3 only, without the appended "#" anchor');
  assert.deepEqual(items.map(({ href }) => href), [
    ...SAMPLE.map(([, , id]) => `/chapters/16-hooks-subagents/#${id}`),
    '/chapters/16-hooks-subagents/#do-this-monday',
    '/chapters/16-hooks-subagents/#do-this-monday-1',
  ]);
  for (const { href } of items) assert.ok(renderedIds.includes(href.split('#')[1]), `${href} is an id on the rendered page`);
  assert.ok(items.every((item) => item.type === 'section' && item.heading === true
    && item.subtitle === 'Ch 16 · Hooks and Custom Subagents'));
  assert.equal(chapterSectionItems([data], '/book')[0].href, '/book/chapters/16-hooks-subagents/#the-explorationediting-split');
});

const catalogSource = readSource('../src/lib/search-catalog.ts');
const catalogAst = ts.createSourceFile('search-catalog.ts', catalogSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const dataDeclarations = catalogAst.statements.filter((statement) => ts.isVariableStatement(statement)
  || (ts.isFunctionDeclaration(statement) && statement.name?.text === 'getPaletteItems'));
const dataImports = [
  ['CHAPTERS', 'chapters'], ['glossary', 'glossary'], ['SETUP_STATS', 'setup'], ['RESEARCH_NOTES', 'research-notes'],
  ['SOP_LIBRARY, SOP_SECTIONS, SOP_INDEX_SECTIONS, sopHref', 'sops'],
].map(([name, file]) => `import { ${name} } from '${moduleUrl(readSource(`../src/lib/${file}.ts`))}';`).join('\n');
const { getPaletteItems } = await import(moduleUrl(dataImports + '\n' + dataDeclarations.map((statement) => statement.getText(catalogAst)).join('\n')));
const catalog = getPaletteItems();

// Section data in the shape the endpoint writes. The last headings are written to collide with
// existing titles, so they would outrank them if headings were scored like everything else.
const CHAPTER_SECTIONS = [
  { id: '16-hooks-subagents', number: 16, title: 'Hooks and Custom Subagents', headings: [
    { slug: 'the-explorationediting-split', text: 'The exploration/editing split' },
    { slug: '3-block-push-to-main', text: '3. block-push-to-main' },
    { slug: 'claude-code-hooks', text: 'Claude Code hooks' },
  ] },
  { id: '54-claude-opus-5-5', number: 54, title: 'Claude Opus 5.5 as the Default', headings: [
    { slug: 'opus-55-effort', text: 'Opus 5.5 effort' },
    { slug: 'mods', text: 'Mods' },
    { slug: 'library', text: 'Library' },
  ] },
];
const withSections = createSearchIndex([...catalog, ...chapterSectionItems(CHAPTER_SECTIONS)]);
const withoutSections = createSearchIndex(catalog);

test('a chapter heading is found by its own words and opens at that heading', () => {
  const [first] = searchItems(withSections, 'exploration editing split');
  assert.equal(first?.href, '/chapters/16-hooks-subagents/#the-explorationediting-split');
  assert.equal(first?.subtitle, 'Ch 16 · Hooks and Custom Subagents');
  assert.deepEqual(searchItems(withoutSections, 'exploration editing split').filter(({ fuzzy }) => !fuzzy), []);
  assert.ok(searchItems(withSections, 'block push main').some(({ href }) => href === '/chapters/16-hooks-subagents/#3-block-push-to-main'));
});

test('chapter headings rank below every page, chapter and glossary match, even with the same title', () => {
  for (const [query, firstHref, headingHref] of [
    ['Opus 5.5 effort', '/chapters/54-claude-opus-5-5/', '/chapters/54-claude-opus-5-5/#opus-55-effort'],
    ['claude code hooks', '/claude-code-hooks/', '/chapters/16-hooks-subagents/#claude-code-hooks'],
    ['mods', '/claude-code-mods/', '/chapters/54-claude-opus-5-5/#mods'],
    ['library', '/library/', '/chapters/54-claude-opus-5-5/#library'],
  ]) {
    const results = searchItems(withSections, query);
    assert.equal(results[0]?.href, firstHref, query);
    const headingAt = results.findIndex(({ href }) => href === headingHref);
    assert.ok(headingAt > 0, `${query}: the heading is listed`);
    assert.ok(results.slice(headingAt).every(({ heading }) => heading), `${query}: no other result follows a heading`);
    assert.deepEqual(results.slice(0, headingAt).map(({ id }) => id),
      searchItems(withoutSections, query).map(({ id }) => id), `${query}: the other results keep their order`);
  }
});

test('the palette works without the section file: a failed or malformed fetch adds nothing and is retried', async () => {
  const calls = [];
  const responses = [
    () => Promise.reject(new TypeError('offline')),
    () => Promise.resolve({ ok: false, status: 404, json: async () => CHAPTER_SECTIONS }),
    () => Promise.resolve({ ok: true, status: 200, json: async () => ({ not: 'a list' }) }),
  ];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (url) => { calls.push(url); return (responses.shift() ?? (() => Promise.resolve({ ok: true, status: 200, json: async () => CHAPTER_SECTIONS })))(); };
  try {
    assert.deepEqual(await loadChapterSectionItems(), [], 'offline');
    assert.deepEqual(await loadChapterSectionItems(), [], 'HTTP 404');
    assert.deepEqual(await loadChapterSectionItems(), [], 'a malformed body');
    const loaded = await loadChapterSectionItems();
    assert.equal(loaded.length, 6);
    assert.equal(loaded[0].href, '/chapters/16-hooks-subagents/#the-explorationediting-split');
    assert.equal(await loadChapterSectionItems(), loaded, 'a loaded file is fetched once');
    assert.deepEqual(calls, Array(4).fill('/search-sections.json'));
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.deepEqual(chapterSectionItems([{ id: 'x', number: 1, title: 'T', headings: [{ slug: '', text: 'No id' }, { slug: 'ok', text: '  ' }, null] }]), []);
});
