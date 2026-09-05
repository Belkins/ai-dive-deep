import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { parseFragment } from 'parse5';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const compile = (source, module = ts.ModuleKind.ESNext) => ts.transpileModule(source, {
  compilerOptions: { module, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const importTs = async (path) => import(`data:text/javascript;base64,${Buffer.from(compile(read(path))).toString('base64')}`);
const snapshot = await importTs('../src/lib/artificial-analysis.ts');
const ranking = await importTs('../src/lib/aa-rank.ts');
const arena = await importTs('../src/lib/lmarena.ts');
const { AA_MODELS, AA_METHODOLOGY } = snapshot;

test('snapshot is dated, attributed v4.2 public evidence, not a keyed data feed', () => {
  assert.equal(snapshot.AA_SNAPSHOT, '2026-09-05');
  assert.equal(snapshot.AA_INDEX_VERSION, 'Intelligence Index v4.2');
  assert.equal(AA_METHODOLOGY.version, 'v4.2');
  assert.equal(snapshot.AA_SOURCE_URL, 'https://artificialanalysis.ai/models');
  assert.equal(snapshot.AA_METHODOLOGY_URL, 'https://artificialanalysis.ai/methodology/intelligence-benchmarking');
  assert.equal(snapshot.AA_TERMS_URL, 'https://artificialanalysis.ai/docs/legal/Terms-of-Use.pdf');
  assert.match(snapshot.AA_ATTRIBUTION, /Artificial Analysis \(2025\)/);
  assert.match(snapshot.AA_SCOPE_NOTE, /not the full leaderboard/);
  assert.equal('AA_AGENTIC_URL' in snapshot, false);
});

test('ten benchmarks and category weights match the v4.2 methodology', () => {
  assert.deepEqual(AA_METHODOLOGY.categories.map(({ weight }) => weight), [30, 20, 20, 30]);
  assert.equal(AA_METHODOLOGY.categories.reduce((sum, { weight }) => sum + weight, 0), 100);
  const benches = AA_METHODOLOGY.categories.flatMap(({ benches }) => benches);
  assert.equal(benches.length, 10);
  assert.equal(new Set(benches).size, 10);
  for (const category of AA_METHODOLOGY.categories) {
    const weights = category.benches.map((bench) => Number(bench.match(/· (\d+)%/)[1]));
    assert.equal(weights.reduce((sum, weight) => sum + weight, 0), category.weight);
  }
  assert.ok(benches.includes('AA-Briefcase · 15%'));
  assert.ok(benches.includes('GDP.pdf · 10%'));
  assert.ok(benches.includes('AA-LCR v1.1 · 5%'));
  assert.equal(benches.some((bench) => bench.includes('GPQA')), false);
  assert.deepEqual(AA_METHODOLOGY.retired, ['GPQA Diamond']);
  assert.match(AA_METHODOLOGY.changes, /not a like-for-like trend/);
});

test('the limited selection contains only verified same-effort numeric rows', () => {
  assert.equal(AA_MODELS.length, 7);
  assert.equal(new Set(AA_MODELS.map(({ model }) => model)).size, AA_MODELS.length);
  for (const row of AA_MODELS) {
    assert.ok(Object.hasOwn(arena.VENDOR_META, row.vendor));
    assert.ok(Number.isFinite(row.intelligence) && row.intelligence > 0 && row.intelligence <= 100);
    assert.ok(Number.isFinite(row.costPerTaskUsd) && row.costPerTaskUsd > 0);
    assert.equal(Object.hasOwn(row, 'agentic'), false, 'No August agentic values in v4.2');
    if (row.outputTokensPerSec !== undefined) assert.ok(Number.isFinite(row.outputTokensPerSec) && row.outputTokensPerSec > 0);
  }
  assert.deepEqual(AA_MODELS, [
    { model: 'Claude Fable 5.1 (max with fallback)', vendor: 'anthropic', intelligence: 56.8, costPerTaskUsd: 6.117, outputTokensPerSec: 67.1 },
    { model: 'GPT-6 Astra (max)', vendor: 'openai', intelligence: 54.7, costPerTaskUsd: 2.567, outputTokensPerSec: 62.5 },
    { model: 'Claude Opus 5 (max)', vendor: 'anthropic', intelligence: 54.1, costPerTaskUsd: 4.205, outputTokensPerSec: 57.5 },
    { model: 'Muse Spark 1.3 (max)', vendor: 'meta', intelligence: 53.0, costPerTaskUsd: 0.959, outputTokensPerSec: 190.1 },
    { model: 'GPT-5.6 Sol (max)', vendor: 'openai', intelligence: 51.3, costPerTaskUsd: 1.249, outputTokensPerSec: 85.4 },
    { model: 'Gemini 3.8 Flash (high)', vendor: 'google', intelligence: 47.1, costPerTaskUsd: 0.738 },
    { model: 'GPT-5.6 Luna (max)', vendor: 'openai', intelligence: 43.4, costPerTaskUsd: 0.097, outputTokensPerSec: 133.0 },
  ]);
  assert.equal(AA_MODELS.some(({ model }) => /Astra.*xhigh/.test(model)), false);
  assert.match(snapshot.AA_SCOPE_NOTE, /no numeric xhigh row/);
  assert.match(snapshot.AA_DISCLOSURE, /Fable 5\.1.*with fallback/);
});

test('missing speed stays unknown and old agentic data is explicitly unavailable', () => {
  const gemini = AA_MODELS.find(({ model }) => model === 'Gemini 3.8 Flash (high)');
  assert.equal(Object.hasOwn(gemini, 'outputTokensPerSec'), false);
  assert.equal(ranking.rankBy(AA_MODELS, (model) => model.outputTokensPerSec, true).at(-1).m, gemini);
  assert.equal(ranking.agenticLeader(AA_MODELS), undefined);
  assert.match(snapshot.AA_AGENTIC_NOTE, /HTTP 404/);
  assert.match(snapshot.AA_AGENTIC_NOTE, /not carried into v4\.2/);
  assert.match(snapshot.AA_SPEED_NOTE, /differs between/);
  assert.doesNotMatch(snapshot.AA_PRECISION, /0\.98|Treat.*as a tie/);
});

test('the July Opus effort ladder remains an unchanged, separately dated artifact', () => {
  assert.equal(snapshot.OPUS5_EFFORT_CAPTURED, '2026-07-27');
  assert.notEqual(snapshot.OPUS5_EFFORT_CAPTURED, snapshot.AA_SNAPSHOT);
  assert.deepEqual(snapshot.OPUS5_EFFORT_LADDER, [
    { effort: 'low', intelligence: 51.0, rankOf190: 23, costToRunIndexUsd: 556.06, outputTokensM: 12, ttftSeconds: 3.66 },
    { effort: 'medium', intelligence: 56.3, rankOf190: 8, costToRunIndexUsd: 1114.96, outputTokensM: 29, ttftSeconds: 5.88 },
    { effort: 'high', intelligence: 58.9, rankOf190: 5, costToRunIndexUsd: 1973.77, outputTokensM: 52, ttftSeconds: 21.67 },
    { effort: 'xhigh', intelligence: 60.1, rankOf190: 2, costToRunIndexUsd: 2909.91, outputTokensM: 76, ttftSeconds: 37.38 },
    { effort: 'max', intelligence: 60.7, rankOf190: 1, costToRunIndexUsd: 3835.51, outputTokensM: 100, ttftSeconds: 66.36 },
  ]);
});

const widgetSource = read('../src/widgets/ArtificialAnalysisPanel.tsx');
const require = createRequire(import.meta.url);
function renderPanel(metric = 'cost') {
  const module = { exports: {} };
  const imports = {
    '@/lib/artificial-analysis': snapshot,
    '@/lib/aa-rank': ranking,
    '@/lib/lmarena': arena,
    react: { ...React, useState: (initial) => React.useState(initial === 'cost' ? metric : initial) },
  };
  runInNewContext(compile(widgetSource, ts.ModuleKind.CommonJS), {
    module, exports: module.exports, require: (name) => imports[name] ?? require(name),
  });
  return renderToStaticMarkup(React.createElement(module.exports.default));
}
const hasClass = (node, value) => node.attrs?.some(({ name, value: classes }) => name === 'class' && classes.split(' ').includes(value));
function elements(node, predicate) {
  return [...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap((child) => elements(child, predicate))];
}
const textContent = (node) => node.value ?? (node.childNodes ?? []).map(textContent).join('');

for (const metric of ['cost', 'intelligence', 'speed']) {
  test(`panel renders and ranks ${metric} with no Agentic leader or fabricated values`, () => {
    const html = renderPanel(metric);
    const doc = parseFragment(html);
    const buttons = elements(doc, (node) => node.tagName === 'button');
    assert.equal(buttons.length, 3);
    const pressed = buttons.filter((node) => node.attrs.some(({ name, value }) => name === 'aria-pressed' && value === 'true'));
    assert.equal(pressed.length, 1);
    assert.match(textContent(pressed[0]), { cost: /^Cost \/ task/, intelligence: /^Intelligence/, speed: /^Speed/ }[metric]);
    assert.equal(buttons.some((node) => textContent(node).includes('Agentic')), false);
    const rows = elements(doc, (node) => hasClass(node, 'aap-row'));
    assert.equal(rows.length, 7);
    const names = rows.map((row) => textContent(elements(row, (node) => hasClass(node, 'aap-mdname'))[0]));
    const first = metric === 'cost' ? 'GPT-5.6 Luna (max)' : metric === 'speed' ? 'Muse Spark 1.3 (max)' : 'Claude Fable 5.1 (max with fallback)';
    assert.equal(names[0], first);
    if (metric === 'speed') {
      assert.equal(names.at(-1), 'Gemini 3.8 Flash (high)');
      assert.equal(textContent(elements(rows.at(-1), (node) => hasClass(node, 'aap-cell')).at(-1)), '\u2014');
    }
    assert.doesNotMatch(html, /NaN|Infinity|capabilities\/agentic|0\.98|fair-use|v4\.1\.1/);
    assert.ok(html.includes(snapshot.AA_TERMS_URL));
    assert.match(html, /in this selection/);
    assert.match(html, /no numeric xhigh row/);
  });
}
