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
const dataDeclarations = paletteAst.statements.filter((statement) => ts.isVariableStatement(statement)
  || (ts.isFunctionDeclaration(statement) && statement.name?.text === 'getPaletteItems'));
const dataImports = [
  ['CHAPTERS', 'chapters'], ['glossary', 'glossary'], ['SETUP_STATS', 'setup'], ['RESEARCH_NOTES', 'research-notes'],
  ['SOP_LIBRARY, SOP_SECTIONS, SOP_INDEX_SECTIONS, sopHref', 'sops'],
].map(([name, file]) => `import { ${name} } from '${moduleUrl(readSource(`../src/lib/${file}.ts`))}';`).join('\n');
const { getPaletteItems } = await import(moduleUrl(dataImports + '\n' + dataDeclarations.map((statement) => statement.getText(paletteAst)).join('\n')));
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
  ]) {
    assert.ok(searchItems(realIndex, query).some(({ href }) => href === `/chapters/${slug}/`), query);
  }
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
