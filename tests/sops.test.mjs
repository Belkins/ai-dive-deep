import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@astrojs/compiler';
import ts from 'typescript';
import { loadTs } from './helpers/load-ts.mjs';

const sops = loadTs(new URL('../src/lib/sops.ts', import.meta.url));
const workflow = loadTs(new URL('../src/lib/workflow-plan.ts', import.meta.url));
const downloads = loadTs(new URL('../src/pages/sops/[slug].md.ts', import.meta.url));
const { SOP_LIBRARY, SOP_SECTIONS, SOP_STATUS, SOP_BOUNDARY, getSopSections, sopHref, sopDownloadHref, renderSopMarkdown } = sops;
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('six unique canonical SOP routes have substantive departmental contracts and aligned presets', () => {
  assert.deepEqual(SOP_LIBRARY.map(sop => sop.slug), [
    'sales-call-to-crm', 'marketing-content-review', 'operations-intelligence-brief',
    'customer-success-escalation', 'recruiting-interview-scorecard', 'ai-agent-execution',
  ]);
  assert.equal(new Set(SOP_LIBRARY.map(sopHref)).size, 6);
  assert.equal(new Set(SOP_LIBRARY.map(sopDownloadHref)).size, 6);
  assert.equal(new Set(SOP_LIBRARY.map(sop => sop.presetId)).size, 6);
  assert.deepEqual(SOP_LIBRARY.slice(0, 3).map(sop => sop.presetId), ['call-to-crm-follow-up', 'content-review', 'weekly-research-brief']);
  for (const sop of SOP_LIBRARY) {
    assert.match(sopHref(sop), /^\/sops\/[a-z0-9-]+\/$/);
    assert.equal(sop.steps.length, 6);
    assert.ok(sop.inputs.length >= 4 && sop.outputs.length >= 4 && sop.qualityChecks.length >= 4 && sop.acceptanceTests.length >= 4);
    assert.ok(sop.owner && sop.reviewer && sop.trigger && sop.stopRecovery.length >= 3);
    assert.ok(renderSopMarkdown(sop).split(/\s+/).length >= 600, sop.slug);
    assert.deepEqual(workflow.validateWorkflowDraft(workflow.getWorkflowTemplate(sop.presetId)), []);
  }
  assert.ok(workflow.WORKFLOW_TEMPLATES.some(item => item.id === 'outbound-campaign-qa'));
});

test('the real Astro static paths and Markdown endpoint use the same six source records', async () => {
  const { ast } = await parse(read('../src/pages/sops/[slug].astro'));
  const frontmatter = ast.children.find(node => node.type === 'frontmatter').value;
  const tree = ts.createSourceFile('page.ts', frontmatter, ts.ScriptTarget.Latest, true);
  const paths = tree.statements.find(statement => ts.isVariableStatement(statement) && statement.declarationList.declarations.some(declaration => declaration.name.getText(tree) === 'getStaticPaths'));
  const compiled = ts.transpileModule(paths.getText(tree), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('SOP_LIBRARY', 'exports', compiled)(SOP_LIBRARY, exports);
  assert.deepEqual(exports.getStaticPaths(), downloads.getStaticPaths());
  for (const { params, props } of downloads.getStaticPaths()) {
    const response = downloads.GET({ params, props });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
    assert.equal(response.headers.get('content-disposition'), `attachment; filename="${params.slug}.md"`);
    assert.equal(await response.text(), renderSopMarkdown(props.sop));
  }
});

test('every rendered section item comes from the same content as its Markdown download', () => {
  const page = read('../src/pages/sops/[slug].astro');
  assert.match(page, /const sections = getSopSections\(sop\)/);
  assert.match(page, /data-sop-content>\{item\}/);
  assert.match(page, /id=\{section.id\}/);
  assert.ok(!page.includes('set:html'), 'content is escaped by Astro, not injected as raw HTML');
  for (const original of SOP_LIBRARY) {
    const sop = { ...original, steps: [...original.steps, 'SOURCE PARITY SENTINEL'] };
    const sections = getSopSections(sop);
    assert.deepEqual(sections.map(section => section.id), SOP_SECTIONS.map(section => section.id));
    for (const section of sections) for (const item of section.items) assert.ok(renderSopMarkdown(sop).includes(item), item);
    assert.ok(sections.find(section => section.id === 'procedure').items.includes('SOURCE PARITY SENTINEL'));
    assert.ok(renderSopMarkdown(sop).includes('SOURCE PARITY SENTINEL'));
  }
});

test('downloaded Markdown links work without a website base and identify the canonical source SOP', () => {
  const origin = 'https://dive.vladyslavpodoliako.com';
  for (const sop of SOP_LIBRARY) {
    const md = renderSopMarkdown(sop);
    assert.ok(md.includes(`Source: [Canonical SOP](${origin}${sopHref(sop)})`));
    const links = [...md.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(match => match[1]);
    assert.deepEqual(links, [
      `${origin}${sopHref(sop)}`, `${origin}/sops/`,
      `${origin}/workflow-planner/?preset=${sop.presetId}`,
    ]);
    for (const href of links) {
      assert.equal(new URL(href).origin, origin);
      assert.equal(new URL(href).protocol, 'https:');
    }
    assert.doesNotMatch(md, /\]\(\/(?!\/)/, 'no root-relative links in an offline export');
  }
});

test('all procedure steps and checks are explicitly unrun with no completed results or implied approval', () => {
  for (const sop of SOP_LIBRARY) {
    const md = renderSopMarkdown(sop);
    assert.ok(md.includes(SOP_STATUS) && md.includes(SOP_BOUNDARY));
    assert.doesNotMatch(md, /\[[xX]\]|\b(?:PASSED|COMPLETED|APPROVED)\b/);
    assert.equal((md.match(/\[ \] Not run:/g) || []).length, sop.steps.length + sop.qualityChecks.length + sop.acceptanceTests.length);
    assert.match(md, /Run status: Not run/);
    assert.match(md, /Human decision: pending/);
    assert.match(md, /Named person: not assigned/);
    assert.match(md, /Expected results above are not observations/);
    assert.equal(md, renderSopMarkdown(sop), 'deterministic export');
    assert.ok(md.endsWith('\n') && !md.endsWith('\n\n'));
  }
});

test('recruiting is a role-only question pack with no filled scorecard or decision surface', () => {
  const sop = SOP_LIBRARY.find(sop => sop.department === 'Recruiting');
  const md = renderSopMarkdown(sop);
  assert.match(md, /Candidate records are not permitted inputs/);
  assert.match(md, /does not score, rank, profile, reject, select, or make hiring decisions/);
  assert.match(md, /No resumes, applicant records, interview transcripts/);
  assert.match(md, /evidence sheet is blank and contains no ratings or recommendations/);
  assert.match(md, /Processing stops and requests role-only inputs/);
  assert.doesNotMatch(md, /\|\s*(?:Candidate|Score|Rank)\s*\||\b[1-5]\/5\b/);
});

test('preset URLs allow only one exact known ID and reject unknown, duplicated, or injected options', () => {
  for (const { id } of workflow.WORKFLOW_TEMPLATES) {
    assert.deepEqual(workflow.parseWorkflowPreset(`?preset=${id}`), { presetId: id, search: `?preset=${id}`, rejected: false });
    assert.equal(workflow.workflowPresetHref(id, '/book/'), `/book/workflow-planner/?preset=${id}`);
    const url = new URL(workflow.workflowPresetHref(id), 'https://example.test');
    assert.deepEqual([...url.searchParams.keys()], ['preset']);
    const malicious = workflow.parseWorkflowPreset(`?preset=${id}&objective=PRIVATE_SENTINEL&owner=secret`);
    assert.equal(malicious.presetId, id);
    assert.equal(malicious.search, `?preset=${id}`);
    assert.ok(malicious.rejected);
  }
  for (const query of ['?preset=unknown', '?preset=', '?preset=__proto__', '?preset=content-review&preset=content-review', '?preset=content-review&preset=unknown', '?preset=CONTENT-REVIEW', '?preset=%3Cscript%3E', '?preset=content-review%00', '?objective=PRIVATE_SENTINEL', '?Preset=content-review', '?preset[]=content-review']) {
    const result = workflow.parseWorkflowPreset(query);
    assert.deepEqual(result, { presetId: 'weekly-research-brief', search: '', rejected: true }, query);
  }
  assert.deepEqual(workflow.parseWorkflowPreset(''), { presetId: 'weekly-research-brief', search: '', rejected: false });
  assert.equal(workflow.parseWorkflowPreset('?preset=%63ontent-review').search, '?preset=content-review');
  assert.throws(() => workflow.workflowPresetHref('unknown'), /Unknown workflow preset/);
});

test('Edition 14.3 is latest and owns the only banner; home and Chapter 11 link to the library', () => {
  const { CHANGELOG } = loadTs(new URL('../src/lib/changelog.ts', import.meta.url));
  assert.equal(CHANGELOG[0].edition, 'Edition 14.3');
  assert.equal(CHANGELOG[0].date, '2026-09-05');
  assert.equal(CHANGELOG[0].bannerHref, '/sops/');
  assert.equal(CHANGELOG.filter(entry => entry.bannerText || entry.bannerHref).length, 1);
  assert.ok(read('../src/pages/index.astro').includes('href={`${base}/sops/`} class="card'));
  assert.match(read('../src/content/chapters/11-build-a-skill.mdx'), /<Callout[^>]*>[\s\S]*?\[AI SOP library\]\(\/sops\/\)[\s\S]*?<\/Callout>/);
});
