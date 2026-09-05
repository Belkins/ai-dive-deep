import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { parseFragment } from 'parse5';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/model-releases.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const { MODEL_RELEASES, MODEL_RELEASES_CHECKED } = await import(dataUrl);

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

test('rendered cards keep each model rate, qualifier, boundary and sources together', async () => {
  const component = readFileSync(new URL('../src/components/CurrentModels.astro', import.meta.url), 'utf8');
  const compiled = await transform(component, {
    internalURL: import.meta.resolve('astro/compiler-runtime'),
    resolvePath: specifier => specifier,
  });
  // Resolve the one source alias in memory without a dev server or disk fixture.
  const renderedModule = ts.transpileModule(compiled.code, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    transformers: { before: [(context) => (root) => ts.visitEachChild(root, (node) => {
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === '@/lib/model-releases') {
        return ts.factory.updateImportDeclaration(node, node.modifiers, node.importClause,
          ts.factory.createStringLiteral(dataUrl), node.attributes);
      }
      return node;
    }, context)] },
  });
  const { default: CurrentModels } = await import(`data:text/javascript;base64,${Buffer.from(renderedModule.outputText).toString('base64')}`);
  const container = await AstroContainer.create();
  const doc = parseFragment(await container.renderToString(CurrentModels));
  const elements = (node, tag) => [...(node.tagName === tag ? [node] : []), ...(node.childNodes ?? []).flatMap(child => elements(child, tag))];
  const text = (node) => node.value ?? (node.childNodes ?? []).map(text).join('');
  const cards = elements(doc, 'article');
  assert.equal(cards.length, MODEL_RELEASES.length);
  for (const [index, model] of MODEL_RELEASES.entries()) {
    const card = cards[index];
    const content = text(card);
    assert.equal(text(elements(card, 'h3')[0]), model.name);
    assert.ok(content.includes(model.modelId));
    assert.ok(content.includes(`$${model.inputPerMillion} / $${model.outputPerMillion} per million tokens.`));
    for (const field of ['availability', 'pricingNote', 'context', 'candidate', 'boundary']) {
      assert.ok(content.includes(model[field]), `${model.name} must render ${field} beside its rates`);
    }
    const links = elements(card, 'a').map(node => node.attrs.find(attr => attr.name === 'href')?.value);
    assert.deepEqual(links, model.sources.map(source => source.href));
  }
  assert.ok(text(doc).includes('evaluation is pending'));
  assert.ok(text(doc).includes('API context / maximum output'));
});
