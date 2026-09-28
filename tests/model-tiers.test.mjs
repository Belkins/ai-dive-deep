import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const source = readFileSync(new URL('../src/lib/model-tiers.ts', import.meta.url), 'utf8');
const { MODEL_TIERS, MODEL_TIER_ORDER, MODEL_TIERS_UPDATED } = await import(`data:text/javascript;base64,${Buffer.from(compile(source)).toString('base64')}`);
const names = (tier) => MODEL_TIERS[tier].map((model) => model.name);

// Vlad's 2026-09-28 tier image, row by row. The page publishes his opinion, so a
// placement that drifts from what he supplied misquotes him; re-date and update
// both sides together when he sends a new list.
test('published model tiers match the list Vlad supplied on 2026-09-28', () => {
  assert.equal(MODEL_TIERS_UPDATED, '2026-09-28');
  assert.deepEqual([...MODEL_TIER_ORDER], ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'E', 'Google']);
  assert.deepEqual(names('SSS'), ['Opus 5.5']);
  assert.deepEqual(names('SS'), ['GPT-6 Astra']);
  assert.deepEqual(names('S'), ['Fable 5.1', 'GPT-6 Sol']);
  assert.deepEqual(names('A'), ['Opus 5', 'Fable 5', 'GPT-5.6 SOL', 'Kimi K3', 'Grok 4.6', 'Qwen3.8 Max 0902', 'GLM-5.3', 'GPT-6 Luna', 'Muse Spark 1.3', 'DeepSeek V4.1 Flash', 'Hy-4 Preview', 'Grok 4.7']);
  assert.deepEqual(names('B'), ['GPT-5.6 Terra', 'Qwen3.8-Flash-Next', 'GLM-5.3 Flash', 'Sonnet 5', 'K2 Horizon 375B A23B']);
  assert.deepEqual(names('C'), ['GPT-5.6 Luna', 'Grok 4.5', 'Qwen3.8 27B', 'Muse Spark 1.2', 'mimo V2.5 Pro', 'Hy-3', 'MiniMax-M3']);
  assert.deepEqual(names('D'), ['Inkling', 'Nemotron 3 Ultra', 'Muse Glimmer']);
  assert.deepEqual(names('E'), ['Haiku 4.5', 'Mistral Medium 3.5', 'Nemotron 3.5 Lightning']);
  assert.deepEqual(names('Google'), ['Gemini 3.8 Flash', 'Gemini 3.7 Flash', 'Gemini 3.6 Flash', 'Gemini 3.5 Flash']);
});

test('every tier renders and no model holds two placements', () => {
  assert.deepEqual(Object.keys(MODEL_TIERS), [...MODEL_TIER_ORDER]);
  for (const tier of MODEL_TIER_ORDER) assert.ok(MODEL_TIERS[tier].length > 0, `${tier} would render an empty row`);
  const all = MODEL_TIER_ORDER.flatMap(names);
  assert.equal(new Set(all).size, all.length);
});

// The page shows both lists side by side. A model left in the tools builder would
// carry a second, older tier (Opus 5 was S there and is A here), so the two lists
// must never share a name.
test('the tools builder never re-ranks a model the model list already places', () => {
  const widget = readFileSync(new URL('../src/widgets/TierListBuilder.tsx', import.meta.url), 'utf8');
  const ast = ts.createSourceFile('TierListBuilder.tsx', widget, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declaration = ast.statements.filter(ts.isVariableStatement).flatMap((statement) => [...statement.declarationList.declarations])
    .find((d) => d.name.getText(ast) === 'DEFAULT_PLACEMENTS');
  const context = {};
  runInNewContext(compile(`globalThis.defaults = ${declaration.initializer.getText(ast)};`), context);
  const tools = new Set(Object.keys(context.defaults).map((name) => name.toLowerCase()));
  const shared = MODEL_TIER_ORDER.flatMap(names).filter((name) => tools.has(name.toLowerCase()));
  assert.deepEqual(shared, []);
});
