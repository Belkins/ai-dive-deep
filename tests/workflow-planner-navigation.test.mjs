import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { loadTs } from './helpers/load-ts.mjs';

const source = readFileSync(new URL('../src/widgets/WorkflowPlanner.tsx', import.meta.url), 'utf8');
const tree = ts.createSourceFile('WorkflowPlanner.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let effect;
const visit = node => {
  if (ts.isCallExpression(node) && node.expression.getText(tree) === 'useEffect' && node.arguments[0].getText(tree).includes('restorePreset')) effect = node.arguments[0];
  ts.forEachChild(node, visit);
};
visit(tree);
assert.ok(effect);
const compiled = ts.transpileModule(`globalThis.mount = ${effect.getText(tree)};`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
const workflow = loadTs(new URL('../src/lib/workflow-plan.ts', import.meta.url));

function harness(path = '/book/workflow-planner/?preset=content-review') {
  const window = new EventTarget();
  const document = new EventTarget();
  const state = { draft: null, preset: null, hydrated: false, notice: '' };
  const writes = [];
  const historyState = { index: 3, astroMetadata: 'preserve' };
  const navigate = href => { window.location = new URL(href, 'https://example.test'); };
  navigate(path);
  window.history = { state: historyState, replaceState: (value, title, href) => { writes.push({ value, href }); navigate(href); } };
  const context = {
    window, document, ...workflow, baseline: { current: null }, revision: { current: 0 }, loadedSearch: { current: null },
    setTemplateId: value => { state.preset = value; }, setDraft: value => { state.draft = value; },
    setNotice: value => { state.notice = value; }, setHydrated: value => { state.hydrated = value; },
  };
  runInNewContext(compiled, context);
  const cleanup = context.mount();
  return { window, document, state, writes, historyState, navigate, cleanup };
}
test('cross-route Back preserves destination Library filters before the planner unmounts', () => {
  const h = harness();
  const draft = h.state.draft;
  h.navigate('/book/library/?q=Fable&kind=Chapter&topic=Team%20%2B%20Tier');
  h.window.dispatchEvent(new Event('popstate'));
  h.document.dispatchEvent(new Event('astro:page-load'));
  assert.equal(h.window.location.search, '?q=Fable&kind=Chapter&topic=Team%20%2B%20Tier');
  assert.deepEqual(h.writes, []);
  assert.equal(h.state.draft, draft);
  h.cleanup();
});
test('preset changes on the same planner path restore once and clean up listeners', () => {
  const h = harness();
  h.navigate('/book/workflow-planner/?preset=recruiting-question-pack');
  h.window.dispatchEvent(new Event('popstate'));
  assert.equal(h.state.preset, 'recruiting-question-pack');
  assert.equal(h.state.draft.objective, workflow.getWorkflowTemplate('recruiting-question-pack').objective);
  h.state.draft.objective = 'UNSAVED SYNTHETIC FIXTURE';
  h.document.dispatchEvent(new Event('astro:page-load'));
  assert.equal(h.state.draft.objective, 'UNSAVED SYNTHETIC FIXTURE');
  h.cleanup();
  assert.equal(getEventListeners(h.window, 'popstate').length, 0);
  assert.equal(getEventListeners(h.document, 'astro:page-load').length, 0);
});
test('planner-only URL sanitization preserves Astro history state and ignores supplied fields', () => {
  const h = harness('/workflow-planner/?preset=content-review&owner=SYNTHETIC#workflow-preview');
  assert.equal(h.window.location.search, '?preset=content-review');
  assert.equal(h.window.location.hash, '#workflow-preview');
  assert.equal(h.writes[0].value, h.historyState);
  assert.equal(h.state.draft.owner, workflow.getWorkflowTemplate('content-review').owner);
  assert.match(h.state.notice, /Unsupported URL options/);
  h.cleanup();
});
