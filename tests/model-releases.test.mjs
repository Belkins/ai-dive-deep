import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/model-releases.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { MODEL_RELEASES, MODEL_RELEASES_CHECKED } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('new models retain exact API identities, release dates, and source provenance', () => {
  assert.equal(MODEL_RELEASES_CHECKED, '2026-09-05');
  assert.deepEqual(MODEL_RELEASES.map((m) => m.modelId), ['gpt-6-astra', 'claude-fable-5-1']);
  for (const model of MODEL_RELEASES) {
    assert.ok(model.released <= MODEL_RELEASES_CHECKED);
    assert.ok(model.sources.length >= 3);
    for (const source of model.sources) assert.equal(new URL(source.href).protocol, 'https:');
    assert.equal('tier' in model, false, 'launch evidence cannot assign a personal tier');
  }
});

test('pricing qualifiers and fallback boundaries remain adjacent to headline rates', () => {
  const [astra, fable] = MODEL_RELEASES;
  assert.equal(astra.inputPerMillion, 10);
  assert.equal(fable.inputPerMillion, 10);
  assert.equal(astra.outputPerMillion, 50);
  assert.equal(fable.outputPerMillion, 50);
  assert.match(astra.pricingNote, /272K.*whole request.*\$20.*\$75/);
  assert.match(fable.pricingNote, /Cache reads cost \$0\.25/);
  assert.match(astra.availability, /Staged rollout/);
  assert.match(fable.boundary, /fallback/);
  assert.match(fable.boundary, /Restricted-access Mythos.*not interchangeable/);
});

test('current model notes remain visibly untested and expose stable navigation target', () => {
  const component = readFileSync(new URL('../src/components/CurrentModels.astro', import.meta.url), 'utf8');
  assert.match(component, /id="sec-models"/);
  assert.match(component, /editorial hypotheses/);
  assert.match(component, /evaluation is pending/);
  assert.match(component, /API context \/ maximum output/);
});
