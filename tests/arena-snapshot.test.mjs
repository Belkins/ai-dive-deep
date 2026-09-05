import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Transpile in memory so these tests also run on Node 20 without TS stripping.
const source = readFileSync(new URL('../src/lib/lmarena.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const arenaLibrary = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const { LMARENA, LMARENA_SNAPSHOT, LMARENA_MIRROR, ARENA_AGENT, ARENA_AGENT_META, LAB_CLAIMS, VENDOR_META } = arenaLibrary;
const board = id => LMARENA.find(category => category.id === id);

// Exact primary-payload metadata and rounded leaders, captured 2026-09-05.
const published = [
  ['text', '2026-09-02T21:00:00.000Z', 7999020, 400, 'claude-fable-5', 1507],
  ['code', '2026-09-04T17:00:00.000Z', 648157, 125, 'claude-fable-5.1-max', 1763],
  ['image-to-code', '2026-08-25T00:00:00.000Z', 110117, 44, 'claude-opus-5-max', 1664],
  ['document', '2026-07-26T18:00:00.000Z', 322650, 39, 'claude-opus-5-high', 1520],
  ['vision', '2026-08-27T13:00:00.000Z', 1258468, 148, 'claude-fable-5', 1313],
  ['search', '2026-08-24T20:00:00.000Z', 1110523, 34, 'gpt-5.6-sol-xhigh', 1257],
  ['text-to-image', '2026-09-04T12:00:00.000Z', 6120042, 76, 'gpt-image-2 (medium)', 1382],
  ['image-edit', '2026-09-03T22:00:00.000Z', 29426679, 53, 'gpt-image-2 (medium)', 1461],
  ['text-to-video', '2026-09-04T16:00:00.000Z', 668045, 47, 'gemini-omni-1.1-flash', 1515],
  ['image-to-video', '2026-09-02T20:00:00.000Z', 1906002, 47, 'minimax-h3', 1497],
  ['video-to-video', '2026-08-26T18:00:00.000Z', 27930, 10, 'wan3.0', 1414],
];

test('all eleven boards retain exact primary cutoffs separately from capture dates', () => {
  assert.equal(LMARENA_SNAPSHOT, '2026-09-05');
  assert.deepEqual(LMARENA.map(category => category.id), published.map(row => row[0]));
  for (const [id, cutoff, votes, models, leader, score] of published) {
    const category = board(id);
    assert.equal(category.source.url, `https://arena.ai/leaderboard/${id}`);
    assert.equal(category.source.captured, '2026-09-05');
    assert.equal(category.source.voteCutoffISOString, cutoff);
    assert.equal(category.source.totalVotes, votes);
    assert.equal(category.source.totalModels, models);
    assert.ok(category.freshness.startsWith(`votes through ${cutoff.slice(0, 10)}`));
    assert.ok(Date.parse(cutoff) < Date.parse(`${category.source.captured}T00:00:00Z`));
    assert.equal(category.rows[0].model, leader);
    assert.equal(category.rows[0].score, score);
  }
  assert.match(board('document').freshness, /cutoff unchanged since July/);
  assert.match(board('image-to-code').note, /single-sourced/i);
  assert.match(LMARENA_MIRROR, /\/data\/2026-09-05$/);
});

test('board adjustments and renamed payload slugs are not silently mixed', () => {
  for (const category of LMARENA) {
    const mode = ['text', 'vision'].includes(category.id) ? 'style_control' : 'raw';
    assert.ok(category.source.snapshotId.endsWith(`-overall-${mode}/leaderboard-snapshots/latest`));
  }
  assert.match(board('text').note, /Style-controlled/);
  assert.match(board('vision').note, /Style-controlled/);
  assert.match(board('code').source.snapshotId, /\/webdev-overall-raw\//);
  assert.match(board('image-to-code').source.snapshotId, /\/image_to_webdev-overall-raw\//);
});

test('published ranks survive rounded score ties and complete-board expansion', () => {
  for (const category of LMARENA) {
    assert.equal(category.rows.length, ['text', 'code'].includes(category.id) ? 12 : 10);
    assert.equal(new Set(category.rows.map(row => row.model)).size, category.rows.length);
    category.rows.forEach((row, index) => {
      assert.equal(row.rank, index + 1);
      assert.ok(Number.isInteger(row.score) && row.score > 1000);
      assert.ok(Object.hasOwn(VENDOR_META, row.vendor));
      assert.equal(Object.hasOwn(row, 'net'), false);
      if (index) assert.ok(category.rows[index - 1].score >= row.score);
    });
  }
  assert.deepEqual(board('image-edit').rows.slice(1, 3).map(({ rank, model, score }) => [rank, model, score]), [
    [2, 'mai-image-2.6', 1439],
    [3, 'grok-imagine-image-2.0 (low)', 1439],
  ]);
  assert.equal(board('video-to-video').rows.length, board('video-to-video').source.totalModels);
});

test('Fable 5.1 keeps its max effort and only its two published board results', () => {
  const entries = LMARENA.flatMap(category => category.rows
    .filter(row => /fable-5[.-]1/.test(row.model))
    .map(row => [category.id, row.model, row.rank, row.score, row.vendor]));
  assert.deepEqual(entries, [
    ['text', 'claude-fable-5.1-max', 3, 1504, 'anthropic'],
    ['code', 'claude-fable-5.1-max', 1, 1763, 'anthropic'],
  ]);
  assert.match(board('text').note, /2,906 votes/);
  assert.match(board('text').note, /overlaps/);
  assert.match(board('code').note, /2,227 votes/);
  assert.match(board('code').note, /Preliminary/);
  assert.ok(board('code').rows.some(row => row.model === 'gpt-5.6-sol-xhigh (codex-harness)'));
  assert.ok(board('image-to-code').rows.some(row => row.model === 'gpt-5.6-sol-xhigh (codex-harness)'));
});

test('catalog-listed Astra is not assigned invented ranked rows or agent scores', () => {
  assert.equal(LMARENA.some(category => category.rows.some(row => /astra/i.test(row.model))), false);
  assert.equal(ARENA_AGENT.some(row => /astra|fable.?5[.-]1/i.test(row.model)), false);
  assert.match(board('text').note, /catalog-listed but has no published row/);
  for (const id of ['image-to-code', 'document', 'vision', 'search']) {
    assert.match(board(id).note, /neither (?:Fable 5\.1 nor Astra|Astra nor Fable 5\.1)/i);
  }
  assert.match(ARENA_AGENT_META.note, /58 published rows/);
});

test('Agent preserves percentage CIs, published date and its separate metric', () => {
  assert.equal(ARENA_AGENT_META.source, 'https://arena.ai/leaderboard/agent');
  assert.equal(ARENA_AGENT_META.published, '2026-09-01');
  assert.equal(ARENA_AGENT_META.captured, '2026-09-05');
  assert.equal(ARENA_AGENT_META.lastUpdatedISOString, '2026-09-01T21:00:00.000Z');
  assert.equal(ARENA_AGENT_META.totalSessions, 2188416);
  assert.equal(ARENA_AGENT_META.totalModels, 58);
  assert.equal(ARENA_AGENT_META.metric, 'Net Improvement Score');
  assert.deepEqual(ARENA_AGENT.map(row => [row.model, row.net]), [
    ['Claude Opus 5 (High)', '13.74% \u00b1 1.80%'],
    ['Claude Opus 5 (Max)', '11.69% \u00b1 2.01%'],
    ['Claude Fable 5 (High)', '10.61% \u00b1 1.53%'],
    ['GPT 5.6 Sol (xHigh)', '9.49% \u00b1 1.51%'],
    ['Claude Opus 4.8 (High)', '9.22% \u00b1 1.53%'],
    ['Kimi K3 (Max)', '8.71% \u00b1 0.66%'],
    ['GPT 5.5 (xHigh)', '7.53% \u00b1 1.08%'],
    ['Claude Sonnet 5 (High)', '7.51% \u00b1 2.11%'],
    ['Claude Opus 4.7 (High)', '6.49% \u00b1 1.42%'],
    ['GLM 5.2 (Max)', '6.23% \u00b1 0.77%'],
  ]);
  ARENA_AGENT.forEach((row, index) => {
    assert.equal(row.rank, index + 1);
    assert.equal(Object.hasOwn(row, 'score'), false);
    assert.ok(Object.hasOwn(VENDOR_META, row.vendor));
  });
});

test('historical lab claims stay dated and retain their fallback caveat', () => {
  for (const claim of LAB_CLAIMS) {
    assert.match(claim.source, /2026-07-/);
    assert.equal(claim.entries.some(row => /astra|fable.?5[.-]1/i.test(row.model)), false);
  }
  const frontier = LAB_CLAIMS.find(claim => claim.bench === 'FrontierBench v0.1');
  assert.match(frontier.caveat, /Opus 4\.8 silently substituted/);
  assert.match(frontier.caveat, /4% of Opus 5/);
  assert.match(frontier.caveat, /26% of Fable 5/);
});

const widgetSource = readFileSync(new URL('../src/widgets/LMArenaLeaderboard.tsx', import.meta.url), 'utf8');
const compiledWidget = ts.transpileModule(widgetSource, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const require = createRequire(import.meta.url);
function renderBoard(category) {
  const exports = {};
  new Function('require', 'exports', compiledWidget)((name) => name === '@/lib/lmarena'
    ? { ...arenaLibrary, LMARENA: [category, ...LMARENA.filter(other => other.id !== category.id)] }
    : require(name), exports);
  return renderToStaticMarkup(createElement(exports.default));
}

test('widget preserves full configuration labels and board-specific provenance', () => {
  for (const category of LMARENA) {
    const html = renderBoard(category);
    assert.ok(html.includes(`href="${category.source.url}"`));
    assert.ok(html.includes(`href="${LMARENA_MIRROR}"`));
    assert.ok(html.includes('Ten of eleven Elo boards were cross-checked against the 2026-09-05'));
    assert.ok(html.includes('Image-to-Code is single-sourced. Arena remains the primary source.'));
    for (const row of category.rows) {
      assert.ok(html.includes(`>${row.model}</div>`), row.model);
    }
    assert.match(html, /\.lmb-md\{[^}]*overflow-wrap:anywhere;white-space:normal/);
    assert.match(html, /grid-template-columns:28px minmax\(0,1fr\) 54px/);
    assert.doesNotMatch(html, /text-overflow:ellipsis/);
    assert.doesNotMatch(html, /a gap operators rarely feel in practice/);
  }
});

test('top-ten callout excludes rows eleven and twelve and qualifies the inference', () => {
  const html = renderBoard(board('text'));
  assert.match(html, /top 10 is 15 points/);
  assert.match(html, /spread alone does not establish a statistically resolved ranking/);
  assert.doesNotMatch(html, /top 10 is 18 points/);
});
