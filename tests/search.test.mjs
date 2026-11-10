import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { parse as parseAstro } from '@astrojs/compiler';
import ts from 'typescript';

function moduleUrl(source) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
}

const readSource = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const search = await import(moduleUrl(readSource('../src/lib/search.ts')));
const { createSearchIndex, searchItems, normalizeSearchHref, normalizeSearchText, moveSearchSelection, POPULAR_PATHS } = search;

const fixtures = [
  { type: 'page', title: 'Claude Code hooks', subtitle: 'Automation recipes', href: '/claude-code-hooks/', keywords: 'settings.json PreToolUse permissions' },
  { type: 'chapter', title: '16 - Hooks and Custom Subagents', href: '/chapters/16-hooks-subagents/', keywords: 'claude code events' },
  { type: 'section', title: 'Hook JSON shape', subtitle: 'Cheat sheet', href: '/cheat-sheet/#hook-json-shape', keywords: 'configuration settings' },
  { type: 'page', title: 'Glossary', href: '/glossary/' },
  { type: 'note', title: 'First research note', href: '/research-notes/', keywords: 'evidence alpha' },
  { type: 'note', title: 'Second research note', href: '/research-notes/', keywords: 'evidence beta' },
];
const index = createSearchIndex(fixtures);

test('popular destinations match with either slash style and keep curated order', () => {
  const pages = POPULAR_PATHS.map((href) => ({ type: 'page', title: href, href }));
  const results = searchItems(createSearchIndex(pages.reverse()), '', POPULAR_PATHS.map((href) => href.slice(0, -1)));
  assert.deepEqual(results.map(({ href }) => href), [...POPULAR_PATHS]);
  assert.equal(results.length, 9);
});

test('popular results ignore missing destinations, repeated hrefs, and same-URL notes', () => {
  const docs = createSearchIndex([
    { type: 'page', title: 'Learn', href: '/learn/' },
    { type: 'note', title: 'Learn note', href: '/learn/' },
  ]);
  assert.deepEqual(searchItems(docs, '  \n', ['/missing/', '/learn', '/learn/']).map(({ title }) => title), ['Learn']);
});

test('href normalization preserves fragments, query strings, and deployment prefixes', () => {
  assert.equal(normalizeSearchHref('/book/learn/?a=1#intro'), normalizeSearchHref('/book/learn?a=1#intro'));
  assert.notEqual(normalizeSearchHref('/learn/#one'), normalizeSearchHref('/learn/#two'));
  assert.notEqual(normalizeSearchHref('/learn/?a=1'), normalizeSearchHref('/learn/?a=2'));
  assert.notEqual(normalizeSearchHref('/book/learn/'), normalizeSearchHref('/learn/'));
});

test('query whitespace, capitalization, accents, and technical punctuation normalize', () => {
  assert.equal(normalizeSearchText('  CLAUDE.md\n settings.JSON  '), 'claude md settings json');
  assert.equal(normalizeSearchText('caf\u00e9'), 'cafe');
  assert.equal(searchItems(index, '  HOOKS  \n CLAUDE  ')[0].href, '/claude-code-hooks/');
  assert.equal(searchItems(index, 'settings.json permissions')[0].href, '/claude-code-hooks/');
});

// A reader who types "Opus 5.5" means that release. Splitting the number at its dot turned the query
// into "Opus 5", which put the older model's pages on top (issue #50).
test('a dot between two digits stays inside its version number; every other dot still separates words', () => {
  assert.equal(normalizeSearchText('Opus 5.5 effort'), 'opus 5.5 effort');
  assert.equal(normalizeSearchText('Claude Code v2.1.118'), 'claude code v2.1.118');
  assert.equal(normalizeSearchText('CLAUDE.md .5 a.5 5. 5 5..5 5.x'), 'claude md 5 a 5 5 5 5 5 5 x');
});

test('a version query matches only that version, and the bare major number still finds both', () => {
  const docs = createSearchIndex([
    { type: 'page', title: 'Opus 5 — the model file', href: '/opus-5/', keywords: 'effort' },
    { type: 'chapter', title: '54 — Claude Opus 5.5 as the Default', href: '/chapters/54-claude-opus-5-5/', keywords: 'effort' },
  ]);
  assert.deepEqual(searchItems(docs, 'Opus 5.5 effort').map(({ href }) => href), ['/chapters/54-claude-opus-5-5/']);
  assert.deepEqual(searchItems(docs, 'Opus 5 effort').map(({ href }) => href), ['/opus-5/', '/chapters/54-claude-opus-5-5/']);
});

test('a version number is never typo-corrected to a neighbouring version', () => {
  const docs = createSearchIndex([{ type: 'page', title: 'Runtime 10.4 notes', href: '/runtime-10-4/' }]);
  assert.deepEqual(searchItems(docs, 'runtime 10.5'), []);
  assert.deepEqual(searchItems(docs, 'runtmie 10.4').map(({ href, fuzzy }) => [href, fuzzy]), [['/runtime-10-4/', true]]);
});

test('all query tokens must match, in any order and across different fields', () => {
  assert.equal(searchItems(index, 'permissions automation hooks')[0].href, '/claude-code-hooks/');
  assert.deepEqual(searchItems(index, 'hooks impossibleword'), []);
  assert.deepEqual(
    searchItems(index, 'claude hooks').map(({ id }) => id).sort(),
    searchItems(index, 'hooks claude').map(({ id }) => id).sort(),
  );
});

test('exact titles outrank title prefixes and keyword-only hits', () => {
  const docs = createSearchIndex([
    { type: 'page', title: 'Reference', href: '/reference/', keywords: 'hooks' },
    { type: 'page', title: 'Hooks explained', href: '/hooks-explained/' },
    { type: 'glossary', title: 'Hooks', href: '/glossary/#hooks' },
  ]);
  assert.deepEqual(searchItems(docs, 'hooks').map(({ title }) => title), ['Hooks', 'Hooks explained', 'Reference']);
});

test('repeating a query word does not skew scores', () => {
  assert.deepEqual(searchItems(index, 'claude hooks hooks'), searchItems(index, 'claude hooks'));
  assert.deepEqual(searchItems(index, 'glossary glossary'), searchItems(index, 'glossary'));
});

test('same-href notes retain distinct, stable identities', () => {
  const results = searchItems(index, 'evidence');
  assert.equal(results.length, 2);
  assert.equal(new Set(results.map(({ id }) => id)).size, 2);
  const reversed = searchItems(createSearchIndex([...fixtures].reverse()), 'evidence');
  assert.deepEqual(results.map(({ id }) => id).sort(), reversed.map(({ id }) => id).sort());
});

test('duplicate entries collapse without losing their searchable metadata', () => {
  const docs = createSearchIndex([
    { type: 'page', title: 'Reference', href: '/reference', keywords: 'alpha' },
    { type: 'page', title: 'Reference', href: '/reference/', keywords: 'beta' },
    { type: 'section', title: 'Reference', href: '/reference/#one', keywords: 'alpha' },
    { type: 'glossary', title: 'Reference', href: '/reference/', keywords: 'alpha' },
  ]);
  assert.equal(docs.length, 3);
  assert.equal(searchItems(docs, 'alpha beta').length, 1);
  assert.equal(new Set(searchItems(docs, 'reference').map(({ id }) => id)).size, 3);
});

test('fuzzy fallback handles a typo in one title word, not only a full title', () => {
  const results = searchItems(index, 'claude hookz');
  assert.ok(results.length > 0);
  assert.ok(results.some(({ href, fuzzy }) => href === '/claude-code-hooks/' && fuzzy));
  assert.equal(searchItems(index, 'glossry')[0].title, 'Glossary');
});

test('fuzzy matches stay after direct matches and do not duplicate results', () => {
  const docs = createSearchIndex([
    { type: 'page', title: 'Hookz', href: '/hookz/' },
    { type: 'page', title: 'Hooks', href: '/hooks/' },
  ]);
  const results = searchItems(docs, 'hookz');
  assert.deepEqual(results.map(({ fuzzy }) => fuzzy), [false, true]);
  assert.equal(new Set(results.map(({ id }) => id)).size, results.length);
});

test('search result count is bounded and input/index are not mutated', () => {
  const items = Array.from({ length: 100 }, (_, i) => ({ type: 'page', title: `Hook reference ${i}`, href: `/hooks-${i}/` }));
  const docs = createSearchIndex(items);
  const before = JSON.stringify({ items, docs });
  assert.equal(searchItems(docs, 'hook').length, 24);
  assert.ok(searchItems(docs, 'hookz').length <= 5);
  assert.equal(JSON.stringify({ items, docs }), before);
});

test('unknown, punctuation-only, and oversized queries return no results', () => {
  for (const query of ['zzzznothingmatches', '?! /', 'x'.repeat(search.MAX_SEARCH_QUERY_LENGTH + 1)]) {
    assert.deepEqual(searchItems(index, query), []);
  }
  assert.deepEqual(searchItems([], ''), []);
});

test('keyboard selection is absent for no results and recovers after a query change', () => {
  assert.equal(moveSearchSelection(0, 0, 1), -1);
  assert.equal(moveSearchSelection(-1, 0, -1), -1);
  assert.equal(moveSearchSelection(-1, 3, 1), 0);
  assert.equal(moveSearchSelection(-1, 3, -1), 2);
  assert.equal(moveSearchSelection(0, 3, -1), 0);
  assert.equal(moveSearchSelection(2, 3, 1), 2);
  assert.equal(moveSearchSelection(20, 2, 1), 1);
});

// Load the widget's real data factory without React or a DOM. This also works
// on the Node 20 CI runtime, using the same TypeScript compiler as SEO tests.
const paletteSource = readSource('../src/widgets/CommandPalette.tsx');
const paletteAst = ts.createSourceFile('CommandPalette.tsx', paletteSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const catalogSource = readSource('../src/lib/search-catalog.ts');
const catalogAst = ts.createSourceFile('search-catalog.ts', catalogSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const dataDeclarations = catalogAst.statements.filter((statement) => ts.isVariableStatement(statement)
  || (ts.isFunctionDeclaration(statement) && statement.name?.text === 'getPaletteItems'));
const dataImports = [
  ['CHAPTERS', 'chapters'], ['glossary', 'glossary'], ['SETUP_STATS', 'setup'], ['RESEARCH_NOTES', 'research-notes'],
  ['SOP_LIBRARY, SOP_SECTIONS, SOP_INDEX_SECTIONS, sopHref', 'sops'],
].map(([name, file]) => `import { ${name} } from '${moduleUrl(readSource(`../src/lib/${file}.ts`))}';`).join('\n');
const { getPaletteItems } = await import(moduleUrl(dataImports + '\n' + dataDeclarations.map((statement) => statement.getText(catalogAst)).join('\n')));
const realItems = getPaletteItems();
const realIndex = createSearchIndex(realItems);
const { CHAPTERS } = await import(moduleUrl(readSource('../src/lib/chapters.ts')));
const { RESEARCH_NOTES } = await import(moduleUrl(readSource('../src/lib/research-notes.ts')));

test('all existing indexed content types remain available', () => {
  for (const type of ['chapter', 'page', 'section', 'glossary', 'note']) {
    assert.ok(realItems.some((item) => item.type === type), type);
  }
  assert.deepEqual(realItems.filter(({ type }) => type === 'chapter').map(({ href }) => href), CHAPTERS.map(({ slug }) => `/chapters/${slug}/`));
  assert.equal(realIndex.length, realItems.length);
});

test('all nine popular destinations exist in the real index, including a deployment prefix', () => {
  assert.deepEqual(searchItems(realIndex, '').map(({ href }) => href), [...POPULAR_PATHS]);
  const prefix = '/book';
  const paths = POPULAR_PATHS.map((path) => `${prefix}${path}`);
  assert.deepEqual(searchItems(createSearchIndex(getPaletteItems(prefix)), '', paths).map(({ href }) => href), paths);
});

test('a search for mods lands on the Claude Code mods reference page first', () => {
  for (const query of ['mods', 'claude code mods']) {
    assert.equal(searchItems(realIndex, query)[0]?.href, '/claude-code-mods/', query);
  }
});

test('a search for the swarm playbook lands on the swarm build playbook page first', () => {
  for (const query of ['swarm playbook', 'swarm build playbook', 'swarm templates', 'merge lock', 'deploy watcher']) {
    assert.equal(searchItems(realIndex, query)[0]?.href, '/swarm-build-playbook/', query);
  }
});

test('the new library and workflow planner are searchable', () => {
  assert.equal(searchItems(realIndex, 'library')[0].href, '/library/');
  assert.equal(searchItems(realIndex, 'planner workflow')[0].href, '/workflow-planner/');
});

test('model-specific operator queries discover the current canonical guides', () => {
  for (const [query, slug] of [
    ['Astra pricing', '49-gpt-6-astra'],
    ['Astra Codex', '49-gpt-6-astra'],
    ['Fable 5.1 cache pricing', '50-claude-fable-5-1'],
    ['Fable 5.1 Claude Code', '50-claude-fable-5-1'],
    ['Opus 5.5 effort', '54-claude-opus-5-5'],
    ['Opus 5.5 refusal', '54-claude-opus-5-5'],
    ['Sonnet 5.5 pricing', '55-claude-sonnet-5-5'],
    ['Sonnet 5.5 effort', '55-claude-sonnet-5-5'],
  ]) {
    assert.ok(searchItems(realIndex, query).some(({ href }) => href === `/chapters/${slug}/`), query);
  }
});

test('a version number in a query ranks that version\'s guide first, ahead of the older model\'s pages', () => {
  for (const [query, href] of [
    ['Opus 5.5 effort', '/chapters/54-claude-opus-5-5/'],
    ['Opus 5.5 refusal', '/chapters/54-claude-opus-5-5/'],
    ['Sonnet 5.5 pricing', '/chapters/55-claude-sonnet-5-5/'],
    ['Sonnet 5.5 effort', '/chapters/55-claude-sonnet-5-5/'],
    ['Fable 5.1 cache pricing', '/chapters/50-claude-fable-5-1/'],
  ]) {
    assert.equal(searchItems(realIndex, query)[0]?.href, href, query);
  }
  assert.equal(searchItems(realIndex, 'Opus 5 effort')[0]?.href, '/opus-5/', 'Opus 5 effort');
});

test('the SOP index and all six procedures have page and section entries, including base paths', async () => {
  const { SOP_LIBRARY, SOP_SECTIONS, SOP_INDEX_SECTIONS, sopHref } = await import(moduleUrl(readSource('../src/lib/sops.ts')));
  for (const base of ['', '/book']) {
    const items = getPaletteItems(base);
    for (const path of ['/sops/', ...SOP_LIBRARY.map(sopHref)]) {
      assert.equal(items.filter(item => item.type === 'page' && item.href === base + path).length, 1);
    }
    for (const section of SOP_INDEX_SECTIONS) assert.ok(items.some(item => item.type === 'section' && item.href === `${base}/sops/#${section.id}`));
    for (const sop of SOP_LIBRARY) {
      for (const section of SOP_SECTIONS) assert.ok(items.some(item => item.type === 'section' && item.href === `${base}${sopHref(sop)}#${section.id}`));
      assert.ok(searchItems(createSearchIndex(items), `${sop.department} SOP`).some(item => item.href === base + sopHref(sop)));
    }
  }
});

test('real multi-token queries reach existing chapter, section, and glossary entries', () => {
  assert.ok(searchItems(realIndex, 'mcp claude').some(({ href }) => href === '/claude-code-mcp/'));
  assert.ok(searchItems(realIndex, 'shape json hook').some(({ href }) => href === '/cheat-sheet/#hook-json-shape'));
  assert.ok(searchItems(realIndex, 'permissions skip').some(({ href }) => href === '/chapters/15-permissions/'));
});

async function researchNoteTargets() {
  const { ast } = await parseAstro(readSource('../src/pages/research-notes.astro'));
  const frontmatter = ast.children.find((node) => node.type === 'frontmatter');
  assert.ok(frontmatter, 'the research page has frontmatter');
  const frontmatterAst = ts.createSourceFile('research-notes.ts', frontmatter.value, ts.ScriptTarget.Latest, true);
  // Execute the page's row generation, excluding component imports and its deployment-base constant.
  const statements = frontmatterAst.statements.filter((statement) => !ts.isImportDeclaration(statement)
    && !(ts.isVariableStatement(statement) && statement.declarationList.declarations.some((declaration) => declaration.name.getText(frontmatterAst) === 'base')));
  const compiled = ts.transpileModule(`${statements.map((statement) => statement.getText(frontmatterAst)).join('\n')}\nglobalThis.noteRows = rows.filter(row => row.kind === 'note');`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });
  const context = { RESEARCH_NOTES };
  runInNewContext(compiled.outputText, context);

  const noteElements = [];
  const visit = (node) => {
    if (node.type === 'element' && node.attributes.some((attribute) => attribute.name === 'data-note-date')) noteElements.push(node);
    node.children?.forEach(visit);
  };
  visit(ast);
  assert.equal(noteElements.length, 1, 'find the actual note element in the Astro template');
  const id = noteElements[0].attributes.find((attribute) => attribute.name === 'id');
  assert.ok(id, 'the rendered note element must expose an ID');
  assert.ok(['expression', 'quoted'].includes(id.kind), 'support the actual rendered ID attribute');
  return new Map(context.noteRows.map((row) => [row.note.title, id.kind === 'expression'
    ? runInNewContext(`(${id.value})`, { row }) : id.value]));
}

test('research results land on IDs produced by the actual research page and template', async () => {
  const notes = realItems.filter(({ type }) => type === 'note');
  const targets = await researchNoteTargets();
  assert.ok(notes.length > 1);
  assert.equal(new Set(notes.map(({ href }) => href)).size, notes.length);
  assert.equal(targets.size, notes.length);
  assert.equal(new Set(targets.values()).size, targets.size, 'rendered note IDs are unique');
  for (const note of notes) {
    const target = targets.get(note.title);
    assert.equal(typeof target, 'string', note.title);
    assert.ok(target.length > 0, note.title);
    const url = new URL(note.href, 'https://example.test');
    assert.equal(url.pathname, '/research-notes/');
    assert.equal(decodeURIComponent(url.hash.slice(1)), target, note.title);
  }
});

const mountSource = readSource('../src/components/CommandPaletteMount.astro');
const mountScript = mountSource.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1];

function mountHarness(ready = false) {
  const root = Object.assign(new EventTarget(), { dataset: ready ? { paletteReady: 'true' } : {} });
  const window = new EventTarget();
  const document = Object.assign(new EventTarget(), { getElementById: (id) => id === 'cc-palette-root' ? root : null });
  assert.ok(mountScript, 'the pre-hydration open listener is present');
  runInNewContext(mountScript, { window, document });
  return { root, window, document };
}

const component = paletteAst.statements.find((statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === 'CommandPalette');
const declarations = component.body.statements.filter(ts.isVariableStatement)
  .flatMap((statement) => [...statement.declarationList.declarations]);
const declaration = (name) => {
  const found = declarations.find((entry) => entry.name.getText(paletteAst) === name);
  assert.ok(found?.initializer, `the component declares ${name}`);
  return found.initializer.getText(paletteAst);
};
const hydrationEffect = component.body.statements.filter(ts.isExpressionStatement)
  .map((statement) => statement.expression)
  .filter((expression) => ts.isCallExpression(expression) && expression.expression.getText(paletteAst) === 'useEffect')
  .map((expression) => expression.arguments[0])
  .find((callback) => callback.getText(paletteAst).includes("window.addEventListener('open-palette'"));
assert.ok(hydrationEffect, 'the component registers its open listener in an effect');

function hydrationHarness() {
  const mount = mountHarness();
  class Element extends EventTarget {}
  const opener = new Element();
  mount.document.activeElement = opener;
  const state = { open: false, active: 4 };
  const calls = { open: [], focus: 0 };
  const inputRef = { current: null };
  const openerRef = { current: null };
  const navigatingRef = { current: false };
  const context = {
    ...mount, Event, HTMLElement: Element, inputRef, openerRef, navigatingRef,
    setOpen: (value) => { calls.open.push(value); state.open = value; },
    setActive: (value) => { state.active = value; },
  };
  const { outputText } = ts.transpileModule(`globalThis.hydrate = ${hydrationEffect.getText(paletteAst)};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });
  runInNewContext(outputText, context);
  return {
    ...mount, state, calls, opener, openerRef, navigatingRef,
    hydrate() {
      const cleanup = context.hydrate();
      if (state.open) inputRef.current = { focus: () => { calls.focus += 1; } };
      return cleanup;
    },
  };
}

test('the actual hydration effect consumes an early open exactly once and removes the queue listener', () => {
  const { root, window, hydrate, state, calls, openerRef, opener } = hydrationHarness();
  window.dispatchEvent(new Event('open-palette'));
  window.dispatchEvent(new Event('open-palette'));
  assert.equal(root.dataset.openRequested, 'true');
  assert.equal(getEventListeners(window, 'open-palette').length, 1);
  const cleanup = hydrate();
  assert.equal(state.open, true);
  assert.equal(state.active, 0);
  assert.deepEqual(calls.open, [true]);
  assert.equal(openerRef.current, opener);
  assert.equal(root.dataset.paletteReady, 'true');
  assert.equal(root.dataset.openRequested, undefined);
  assert.equal(getEventListeners(window, 'open-palette').length, 1, 'only the hydrated component listener remains');
  window.dispatchEvent(new Event('open-palette'));
  assert.equal(calls.focus, 1);
  assert.deepEqual(calls.open, [true], 'an already open palette is focused rather than reopened');
  assert.equal(root.dataset.openRequested, undefined);
  cleanup();
  assert.equal(root.dataset.paletteReady, undefined);
  assert.equal(getEventListeners(window, 'open-palette').length, 0);
});

test('hydration without a request stays closed, handles live opens, and cleans up on navigation', () => {
  const { root, window, document, hydrate, state, calls, navigatingRef } = hydrationHarness();
  const cleanup = hydrate();
  assert.equal(state.open, false);
  assert.deepEqual(calls.open, []);
  assert.equal(root.dataset.paletteReady, 'true');
  window.dispatchEvent(new Event('open-palette'));
  assert.equal(state.open, true);
  assert.deepEqual(calls.open, [true]);
  document.dispatchEvent(new Event('astro:before-swap'));
  assert.equal(state.open, false);
  assert.equal(navigatingRef.current, true);
  cleanup();
  assert.equal(getEventListeners(document, 'astro:before-swap').length, 0);
  assert.equal(getEventListeners(window, 'open-palette').length, 0);
  window.dispatchEvent(new Event('open-palette'));
  assert.deepEqual(calls.open, [true, false], 'a disposed island cannot handle later requests');
});

test('the early-open listener is removed on navigation and skipped for a ready island', () => {
  const pending = mountHarness();
  pending.document.dispatchEvent(new Event('astro:before-swap'));
  pending.window.dispatchEvent(new Event('open-palette'));
  assert.equal(pending.root.dataset.openRequested, undefined);
  const ready = mountHarness(true);
  ready.window.dispatchEvent(new Event('open-palette'));
  assert.equal(ready.root.dataset.openRequested, undefined);
});

// Most readers never open search, so React, Radix and the catalog must not load with the page.
// The mount's bundled script imports the palette only on an open request or on the search button.
const ENTRY_IMPORT = /(?<!typeof )import\('@\/widgets\/command-palette-entry'\)/g;
const loaderScript = [...mountSource.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
  .find(([, attributes]) => !attributes.includes('is:inline'))?.[2];

// chunkFails: the palette file cannot be fetched. siteAnswers: what the page's own address returns to the
// loader's reachability check: 'ok', 'error' (an answer that is not the page) or 'offline'.
// recoveredMsAgo: how long ago this tab reloaded itself to recover the palette (null = never).
function loaderHarness({ chunkFails = false, siteAnswers = 'ok', recoveredMsAgo = null } = {}) {
  assert.ok(loaderScript, 'the mount has a bundled loader script');
  assert.doesNotMatch(loaderScript, /^\s*import\s/m, 'the palette is never imported statically');
  assert.equal(loaderScript.match(ENTRY_IMPORT)?.length, 1, 'the palette entry is imported dynamically');
  const calls = { imports: 0, mounts: 0 };
  const recovery = { heads: [], reloads: 0 };
  const entry = { mountCommandPalette: () => { calls.mounts += 1; } };
  class Element extends EventTarget {
    constructor(isSearchButton) { super(); this.isSearchButton = isSearchButton; }
    closest(selector) { return this.isSearchButton && selector === '#open-palette-btn' ? this : null; }
  }
  const window = new EventTarget();
  const document = new EventTarget();
  const root = { dataset: {} };
  document.getElementById = (id) => (id === 'cc-palette-root' ? root : null);
  const store = new Map();
  if (recoveredMsAgo !== null) store.set('cc-palette-recovered-at', String(Date.now() - recoveredMsAgo));
  const { outputText } = ts.transpileModule(loaderScript.replace(ENTRY_IMPORT, '__importEntry()'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });
  runInNewContext(outputText, {
    window, document, Element,
    // An idle or timer route would load the palette without intent; these run it at once so a test sees it.
    requestIdleCallback: (callback) => callback(), setTimeout: (callback) => callback(),
    sessionStorage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => { store.set(key, String(value)); } },
    location: { href: 'https://dive.example/chapters/01/', reload: () => { recovery.reloads += 1; } },
    fetch: (url, init) => {
      recovery.heads.push([url, { ...init }]);
      return siteAnswers === 'offline' ? Promise.reject(new TypeError('Failed to fetch')) : Promise.resolve({ ok: siteAnswers === 'ok' });
    },
    // A browser keeps a failed import() failed for the life of the document, so this fake never recovers either.
    __importEntry: () => {
      calls.imports += 1;
      return chunkFails ? Promise.reject(new Error('Failed to fetch dynamically imported module')) : Promise.resolve(entry);
    },
  });
  const settle = () => new Promise((resolve) => setImmediate(resolve));
  const fire = (type, isSearchButton) => {
    for (const listener of getEventListeners(document, type)) listener({ type, target: new Element(isSearchButton) });
  };
  return { calls, recovery, store, root, window, document, settle, fire };
}

test('the palette code loads on intent only: an open request or the search button, never on page load', async () => {
  const { calls, window, document, settle, fire } = loaderHarness();
  await settle();
  assert.deepEqual(calls, { imports: 0, mounts: 0 }, 'nothing loads before intent');
  for (const type of ['pointerenter', 'focusin', 'touchstart']) {
    assert.equal(getEventListeners(document, type).length, 1, type);
    fire(type, false);
  }
  await settle();
  assert.deepEqual(calls, { imports: 0, mounts: 0 }, 'other elements do not load the palette');
  fire('pointerenter', true);
  await settle();
  assert.deepEqual(calls, { imports: 1, mounts: 1 }, 'hovering the search button warms the palette');
  window.dispatchEvent(new Event('open-palette'));
  fire('focusin', true);
  await settle();
  assert.deepEqual(calls, { imports: 1, mounts: 3 }, 'the code is fetched once; each intent asks the entry to mount');
});

test('each intent trigger loads the palette on its own', async () => {
  for (const type of ['pointerenter', 'focusin', 'touchstart']) {
    const { calls, settle, fire } = loaderHarness();
    fire(type, true);
    await settle();
    assert.deepEqual(calls, { imports: 1, mounts: 1 }, type);
  }
});

// A browser keeps a failed import() failed for as long as the document lives, so asking again cannot load
// the palette. It fails when the first request drops, or when a deploy replaced the hashed file under a tab
// that stayed open. The way out is a fresh page load, and only when the reader asked for the palette and the
// site answers: a reader who is offline must keep the page they are reading.
test('a failed palette load reloads the page once when the reader asked and the site answers', async () => {
  const { calls, recovery, store, window, settle } = loaderHarness({ chunkFails: true });
  window.dispatchEvent(new Event('open-palette'));
  await settle();
  assert.deepEqual(calls, { imports: 1, mounts: 0 });
  assert.deepEqual(recovery.heads, [['https://dive.example/chapters/01/', { method: 'HEAD', cache: 'no-store' }]]);
  assert.equal(recovery.reloads, 1);
  assert.ok(store.has('cc-palette-recovered-at'), 'the reload is recorded, so it cannot repeat');
  window.dispatchEvent(new Event('open-palette'));
  await settle();
  assert.deepEqual(calls, { imports: 1, mounts: 0 }, 'the failed import is never asked for again');
  assert.equal(recovery.reloads, 1);
});

test('a failed palette load never reloads for a warm-up, offline, on an error answer, or twice in a minute', async () => {
  const warm = loaderHarness({ chunkFails: true });
  warm.fire('pointerenter', true);
  await warm.settle();
  assert.deepEqual([warm.recovery.heads.length, warm.recovery.reloads], [0, 0], 'a hover is not a request');

  for (const siteAnswers of ['offline', 'error']) {
    const asked = loaderHarness({ chunkFails: true, siteAnswers });
    asked.window.dispatchEvent(new Event('open-palette'));
    await asked.settle();
    assert.deepEqual([asked.recovery.heads.length, asked.recovery.reloads], [1, 0], siteAnswers);
    assert.equal(asked.store.has('cc-palette-recovered-at'), false, siteAnswers);
  }

  const again = loaderHarness({ chunkFails: true, recoveredMsAgo: 20_000 });
  again.window.dispatchEvent(new Event('open-palette'));
  await again.settle();
  assert.deepEqual([again.recovery.heads.length, again.recovery.reloads], [0, 0], 'one reload a minute at most');
});

test('right after a recovery reload the palette opens by itself, and only then', async () => {
  const fresh = loaderHarness({ recoveredMsAgo: 2_000 });
  await fresh.settle();
  assert.deepEqual(fresh.calls, { imports: 1, mounts: 1 });
  assert.equal(fresh.root.dataset.openRequested, 'true');

  const later = loaderHarness({ recoveredMsAgo: 120_000 });
  await later.settle();
  assert.deepEqual(later.calls, { imports: 0, mounts: 0 });
  assert.equal(later.root.dataset.openRequested, undefined);

  const failsAgain = loaderHarness({ chunkFails: true, recoveredMsAgo: 2_000 });
  await failsAgain.settle();
  assert.deepEqual(failsAgain.calls, { imports: 1, mounts: 0 });
  assert.deepEqual([failsAgain.recovery.heads.length, failsAgain.recovery.reloads], [0, 0], 'no second reload');
});

function keyboardHarness(count) {
  const calls = { selected: null, clicks: [], lookups: [], prevented: 0 };
  const options = new Map();
  const context = {
    active: 0, listboxId: 'palette', filtered: [], moveSearchSelection,
    setActive: (value) => { calls.selected = value; context.active = value; },
    document: { getElementById: (id) => { calls.lookups.push(id); return options.get(id) ?? null; } },
  };
  const setResultCount = (count) => {
    context.filtered = Array(count);
    options.clear();
    for (let index = 0; index < count; index++) {
      const id = `palette-option-${index}`;
      options.set(id, { click: () => { calls.clicks.push(id); } });
    }
  };
  setResultCount(count);
  // Re-evaluate the component's selection expressions on each render, not just the key handler.
  const compiled = ts.transpileModule(`globalThis.renderHandler = () => {
    const activeIndex = ${declaration('activeIndex')};
    const activeId = ${declaration('activeId')};
    return ${declaration('handleSearchKey')};
  };`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });
  runInNewContext(compiled.outputText, context);
  const press = (key, extra = {}) => context.renderHandler()({
    key, nativeEvent: { isComposing: false }, preventDefault: () => { calls.prevented += 1; }, ...extra,
  });
  return { calls, press, setResultCount, options };
}

test('the input keyboard handler never activates a nonexistent result', () => {
  const empty = keyboardHarness(0);
  empty.press('ArrowDown');
  empty.press('Enter');
  assert.equal(empty.calls.selected, -1);
  assert.deepEqual(empty.calls.clicks, []);
  assert.deepEqual(empty.calls.lookups, []);
  const populated = keyboardHarness(3);
  populated.press('ArrowDown');
  assert.equal(populated.calls.selected, 1);
  populated.press('Enter');
  assert.deepEqual(populated.calls.lookups, ['palette-option-1']);
  assert.deepEqual(populated.calls.clicks, ['palette-option-1']);
  populated.press('ArrowDown');
  populated.press('Enter');
  populated.press('ArrowUp');
  populated.press('Enter');
  assert.deepEqual(populated.calls.clicks, ['palette-option-1', 'palette-option-2', 'palette-option-1']);
});

test('keyboard selection follows shrinking results and cannot click a removed DOM option', () => {
  const { calls, press, setResultCount, options } = keyboardHarness(3);
  press('ArrowDown');
  press('ArrowDown');
  setResultCount(1);
  press('Enter');
  assert.deepEqual(calls.clicks, ['palette-option-0']);
  options.delete('palette-option-0');
  press('Enter');
  assert.deepEqual(calls.lookups, ['palette-option-0', 'palette-option-0']);
  assert.deepEqual(calls.clicks, ['palette-option-0']);
  setResultCount(0);
  press('Enter');
  assert.equal(calls.lookups.length, 2);
  setResultCount(2);
  press('ArrowUp');
  press('Enter');
  assert.deepEqual(calls.clicks, ['palette-option-0', 'palette-option-0']);
});

test('IME composition and native editing keys are not intercepted', () => {
  const { calls, press } = keyboardHarness(3);
  press('Enter', { nativeEvent: { isComposing: true } });
  press('Enter', { keyCode: 229 });
  press('ArrowDown', { ctrlKey: true });
  press('ArrowUp', { shiftKey: true });
  press('Home');
  press('End');
  press('Tab');
  assert.deepEqual(calls, { selected: null, clicks: [], lookups: [], prevented: 0 });
});
