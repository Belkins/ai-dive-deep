import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/workflow-plan.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const workflowLibrary = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const {
  WORKFLOW_FIELDS, WORKFLOW_TEMPLATES, buildWorkflowPlan, emptyWorkflowDraft,
  getWorkflowTemplate, validateWorkflowDraft, workflowLines,
} = workflowLibrary;

const firstDraft = () => getWorkflowTemplate('weekly-research-brief');

test('the four requested templates have unique IDs and complete, distinct requirements', () => {
  assert.deepEqual(WORKFLOW_TEMPLATES.map(({ id }) => id), [
    'weekly-research-brief', 'call-to-crm-follow-up', 'content-review', 'outbound-campaign-qa',
  ]);
  assert.equal(new Set(WORKFLOW_TEMPLATES.map(({ draft }) => draft.objective)).size, 4);
  for (const template of WORKFLOW_TEMPLATES) {
    assert.deepEqual(validateWorkflowDraft(template.draft), [], template.id);
    for (const key of ['inputs', 'allowedOutputs', 'approvalBoundaries', 'acceptanceTests']) {
      assert.ok(workflowLines(template.draft[key]).length >= 3, `${template.id}: useful ${key}`);
    }
  }
});

test('template copies and empty drafts do not share mutable state', () => {
  const draft = firstDraft();
  const original = draft.objective;
  draft.objective = 'Edited';
  assert.equal(firstDraft().objective, original);
  const blank = emptyWorkflowDraft();
  blank.owner = 'Changed';
  assert.equal(emptyWorkflowDraft().owner, '');
  assert.deepEqual(Object.keys(blank).sort(), WORKFLOW_FIELDS.map(({ key }) => key).sort());
  assert.throws(() => getWorkflowTemplate('missing'), /Unknown workflow template/);
});

test('empty and whitespace-only entries produce field-specific errors and no export', () => {
  const result = buildWorkflowPlan(emptyWorkflowDraft());
  assert.equal(result.ok, false);
  assert.equal(result.markdown, null);
  assert.deepEqual(result.issues.map(({ field }) => field), WORKFLOW_FIELDS.map(({ key }) => key));
  for (const { key } of WORKFLOW_FIELDS) {
    const invalid = buildWorkflowPlan({ ...firstDraft(), [key]: ' \n\r\t ' });
    assert.equal(invalid.ok, false);
    assert.deepEqual(invalid.issues.map(({ field }) => field), [key]);
    assert.match(invalid.issues[0].message, /before exporting/);
  }
});

test('missing and non-string fields are rejected without crashing or printing undefined', () => {
  for (const value of [undefined, null, 42, [], {}]) {
    const result = buildWorkflowPlan({ ...firstDraft(), owner: value });
    assert.equal(result.ok, false);
    assert.equal(result.markdown, null);
    assert.equal(result.issues[0].field, 'owner');
  }
});

test('field limits are enforced at the boundary without silent truncation', () => {
  for (const { key, maxLength } of WORKFLOW_FIELDS) {
    assert.equal(buildWorkflowPlan({ ...firstDraft(), [key]: 'x'.repeat(maxLength) }).ok, true);
    const result = buildWorkflowPlan({ ...firstDraft(), [key]: 'x'.repeat(maxLength + 1) });
    assert.equal(result.ok, false);
    assert.equal(result.markdown, null);
    assert.equal(result.issues[0].field, key);
    assert.match(result.issues[0].message, /nothing will be truncated/);
  }
});

test('line normalization handles blank lines and platform line endings without deduplicating', () => {
  assert.deepEqual(workflowLines('  source A \r\n\r\n source B\r source C \nsource A\u2028source D\u2029'), [
    'source A', 'source B', 'source C', 'source A', 'source D',
  ]);
  assert.deepEqual(workflowLines(' \n\t\r'), []);
  const draft = firstDraft();
  const unix = buildWorkflowPlan(draft);
  const windows = buildWorkflowPlan(Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.replaceAll('\n', '\r\n')])));
  assert.equal(windows.markdown, unix.markdown);
});

test('hidden control and directional override characters are rejected; ordinary Unicode is retained', () => {
  for (const control of ['\u0000', '\u0007', '\u001b', '\u007f', '\u202e', '\u2066']) {
    const result = buildWorkflowPlan({ ...firstDraft(), objective: `Draft ${control} brief` });
    assert.equal(result.ok, false);
    assert.match(result.issues[0].message, /control characters/);
  }
  const result = buildWorkflowPlan({ ...firstDraft(), owner: 'Zo\u00eb / \u7814\u7a76\u30c1\u30fc\u30e0' });
  assert.equal(result.ok, true);
  assert.match(result.markdown, /Zo\u00eb \/ \u7814\u7a76\u30c1\u30fc\u30e0/);
});

test('formatting is deterministic, does not mutate the draft, and ends with one newline', () => {
  const draft = Object.freeze(firstDraft());
  const snapshot = { ...draft };
  const result = buildWorkflowPlan(draft);
  assert.equal(result.ok, true);
  assert.deepEqual(buildWorkflowPlan(draft), result);
  assert.deepEqual(draft, snapshot);
  assert.match(result.markdown, /^# Workflow specification\n/);
  assert.ok(result.markdown.endsWith('\n'));
  assert.ok(!result.markdown.endsWith('\n\n'));
});

test('every edited field appears in its specified section and no old template content leaks', () => {
  const custom = {
    objective: 'CUSTOM OBJECTIVE', owner: 'CUSTOM OWNER', trigger: 'CUSTOM TRIGGER',
    inputs: 'CUSTOM INPUT ONE\nCUSTOM INPUT TWO', allowedOutputs: 'CUSTOM OUTPUT',
    approvalBoundaries: 'CUSTOM BOUNDARY', acceptanceTests: 'CUSTOM CHECK ONE\nCUSTOM CHECK TWO',
  };
  const { markdown } = buildWorkflowPlan(custom);
  for (const value of Object.values(custom).flatMap(workflowLines)) assert.ok(markdown.includes(value), value);
  assert.match(markdown, /## Objective\n\nCUSTOM OBJECTIVE/);
  assert.match(markdown, /Accountable owner: CUSTOM OWNER/);
  assert.match(markdown, /Proposed trigger: CUSTOM TRIGGER/);
  assert.match(markdown, /## Approved inputs\n\n- CUSTOM INPUT ONE\n- CUSTOM INPUT TWO/);
  assert.match(markdown, /## Allowed outputs\n\n- CUSTOM OUTPUT/);
  assert.match(markdown, /## Acceptance tests \(not run\)\n\n- \[ \] CUSTOM CHECK ONE\n- \[ \] CUSTOM CHECK TWO/);
  assert.ok(!markdown.includes('Research lead'));
  assert.ok(!markdown.includes('500 words'));
});

test('Markdown and HTML metacharacters cannot inject structural headings, links, or checked tests', () => {
  const result = buildWorkflowPlan({
    ...firstDraft(), objective: '# Spoofed title\n<script>alert(1)</script>\n---\n1. A list',
    owner: '[Click](javascript:alert(1))', inputs: '```html\n<img src=x onerror=alert(1)>\n```',
    acceptanceTests: '[x] Already passed\n## All checks passed\nA & B',
  });
  assert.equal(result.ok, true);
  assert.ok(!result.markdown.includes('<script>'));
  assert.ok(!result.markdown.includes('<img'));
  assert.ok(!result.markdown.includes('\n# Spoofed title'));
  assert.ok(!result.markdown.includes('[Click](javascript:'));
  assert.ok(!result.markdown.includes('- [x]'));
  assert.ok(!result.markdown.includes('\n## All checks passed'));
  assert.ok(result.markdown.includes('&lt;script&gt;'));
  assert.ok(result.markdown.includes('- [ ] \\[x\\] Already passed'));
  assert.ok(result.markdown.includes('A &amp; B'));
  assert.ok(!result.markdown.includes('\n---\n'));
  assert.ok(result.markdown.includes('\\---'));
  assert.ok(result.markdown.includes('1\\. A list'));
});

test('every template exports the same explicit draft-only gates and unchecked acceptance tests', () => {
  for (const { draft, id } of WORKFLOW_TEMPLATES) {
    const { markdown } = buildWorkflowPlan(draft);
    assert.match(markdown, /No generative AI, model calls, scheduling, or workflow execution/, id);
    assert.match(markdown, /Completeness checks do not assess safety or correctness/, id);
    assert.match(markdown, /No schedule or connections have been configured/, id);
    assert.match(markdown, /## Acceptance tests \(not run\)/, id);
    assert.match(markdown, /Failed or unknown checks hold the handoff/, id);
    assert.match(markdown, /Do not send, publish, write to a CRM/, id);
    assert.match(markdown, /duplicate-prevention key/, id);
    assert.ok(!markdown.includes('- [x]'), id);
    const checks = markdown.split('## Acceptance tests (not run)\n\n')[1].split('\n\n## Stop')[0];
    assert.equal(checks.split('\n').length, workflowLines(draft.acceptanceTests).length, id);
    assert.equal((markdown.match(/^\d\. \*\*/gm) || []).length, 6, id);
  }
});

test('unsafe user instructions remain review notes, not a safety claim or automatic authorization', () => {
  const { markdown } = buildWorkflowPlan({ ...firstDraft(), approvalBoundaries: 'Send without approval' });
  assert.match(markdown, /Send without approval/);
  assert.match(markdown, /do not override the draft-only default/);
  assert.match(markdown, /A requested output is not permission to perform an external action/);
});

test('the widget server-renders a readable draft, labeled fields, and disabled pre-hydration exports', () => {
  // Compile the TSX in memory and reuse the transpiled data module above.
  const source = readFileSync(new URL('../src/widgets/WorkflowPlanner.tsx', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const require = createRequire(import.meta.url);
  const exports = {};
  new Function('require', 'exports', outputText)((name) => name === '@/lib/workflow-plan' ? workflowLibrary : require(name), exports);
  const html = renderToStaticMarkup(createElement(exports.default));
  assert.match(html, /ph-no-capture ph-sensitive/);
  assert.match(html, /<fieldset[^>]*disabled=""/);
  assert.equal((html.match(/<option /g) || []).length, 4);
  assert.equal((html.match(/required=""/g) || []).length, 7);
  for (const { key } of WORKFLOW_FIELDS) {
    assert.ok(html.includes(`for="workflow-${key}"`), key);
    assert.ok(html.includes(`id="workflow-${key}"`), key);
  }
  for (const label of ['Copy Markdown', 'Download Markdown', 'Print specification']) {
    assert.ok(html.includes(`aria-label="${label}" title="${label}" disabled=""`));
  }
  assert.match(html, /<pre[^>]*tabindex="0"[^>]*><code># Workflow specification/);
  assert.match(html, /Acceptance tests \(not run\)/);
  assert.ok(!html.includes('<form'), 'No native form submission can send draft contents');
  assert.ok(!html.includes('maxLength='), 'Pasted input is validated, not silently truncated');
});
