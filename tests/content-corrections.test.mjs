import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const chapter = (slug) => source(`src/content/chapters/${slug}.mdx`);
const evalChapter = chapter('25-evals-or-hope');
const evalCode = [...evalChapter.matchAll(/```python\n([\s\S]*?)\n```/g)]
  .map((match) => match[1]).find((code) => code.includes('import argparse'));
const fixtureMatch = evalChapter.match(/```json\n([\s\S]*?)\n```/);

test('the published eval is executable and the published fixture passes', () => {
  assert.ok(evalCode, 'missing executable Python example');
  assert.ok(fixtureMatch, 'missing synthetic JSON fixture');
  const fixture = JSON.parse(fixtureMatch[1]);
  const dir = mkdtempSync(join(tmpdir(), 'playbook-eval-'));
  try {
    const candidate = join(dir, 'candidate.json');
    const baseline = join(dir, 'approved-baseline.json');
    const baselineText = JSON.stringify(fixture);
    writeFileSync(candidate, baselineText);
    writeFileSync(baseline, baselineText);
    const run = () => spawnSync('python3', ['-c', evalCode, candidate, baseline], {
      encoding: 'utf8', timeout: 5000,
    });
    const passing = run();
    assert.ifError(passing.error);
    assert.equal(passing.status, 0, passing.stderr);
    assert.match(passing.stdout, /PASS:.*no delivery attempted/);
    assert.equal(run().status, 0, 'replaying the artifact must remain read-only');

    for (const [label, value] of [
      ['failed source', { ...fixture, source: { status: '503', rows: 0 } }],
      ['missing source', { canvas: fixture.canvas }],
      ['incomplete source', { ...fixture, source: { status: 'partial', rows: 12 } }],
      ['negative count', { ...fixture, source: { status: 'ok', rows: -1 } }],
      ['boolean count', { ...fixture, source: { status: 'ok', rows: false } }],
      ['fractional count', { ...fixture, source: { status: 'ok', rows: 0.5 } }],
      ['wrong canvas type', { ...fixture, canvas: [] }],
      ['short canvas', { ...fixture, canvas: 'Pipeline' }],
      ['missing section', { ...fixture, canvas: fixture.canvas.replace('Deal Motion', 'Activity') }],
      ['non-object artifact', []],
    ]) {
      writeFileSync(candidate, JSON.stringify(value));
      const result = run();
      assert.equal(result.status, 1, label);
      assert.match(result.stderr, /BLOCKED:/, label);
    }

    writeFileSync(candidate, '{not json');
    assert.equal(run().status, 1, 'malformed JSON must block');
    writeFileSync(candidate, JSON.stringify(fixture));
    writeFileSync(baseline, JSON.stringify({ ...fixture, source: { status: 'ok', rows: 100 } }));
    const rowDrop = run();
    assert.equal(rowDrop.status, 1, 'busy to empty must block delivery');
    assert.match(rowDrop.stderr, /source row count dropped/, 'busy to empty needs review');
    assert.doesNotMatch(rowDrop.stdout, /PASS/);
    writeFileSync(baseline, JSON.stringify({ ...fixture, canvas: fixture.canvas.repeat(4) }));
    const truncation = run();
    assert.equal(truncation.status, 1, 'truncation must block delivery');
    assert.match(truncation.stderr, /canvas length dropped/, 'truncation needs review');
    assert.doesNotMatch(truncation.stdout, /PASS/);
    writeFileSync(baseline, '{}');
    assert.equal(run().status, 1, 'unvalidated baseline must block');
    writeFileSync(baseline, baselineText);
    assert.equal(readFileSync(baseline, 'utf8'), baselineText);
    assert.equal(run().status, 0, 'a reviewed quiet week must not fail for containing $0');
    assert.equal(readFileSync(baseline, 'utf8'), baselineText, 'checker must not rewrite baseline');
    assert.deepEqual(readdirSync(dir).sort(), ['approved-baseline.json', 'candidate.json']);
    rmSync(baseline);
    assert.equal(run().status, 1, 'missing baseline must not be auto-approved');
    assert.equal(existsSync(baseline), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('research evidence distinguishes interviews and benchmark exploits from incident rates', () => {
  assert.match(evalChapter, /80,508 people across 159 countries and 70 languages/);
  assert.match(evalChapter, /https:\/\/www\.anthropic\.com\/features\/81k-interviews/);
  assert.match(evalChapter, /https:\/\/rdi\.berkeley\.edu\/blog\/trustworthy-benchmarks-cont\//);
  assert.doesNotMatch(evalChapter, /81,000 user-reported issues|three independent confirmations|On April 12, 2026/);
  assert.doesNotMatch(evalChapter, /your_skill_runner\(|bot\$TOKEN|import requests/);
  const rules = source('src/pages/claude-md-rules.astro');
  assert.match(rules, /qualitative interviews/);
  assert.doesNotMatch(rules, /the highest single number in the whole study/);
});

test('recovery and delivery guidance preserves coverage after a failed run', () => {
  const cron = chapter('07-cron');
  assert.match(cron, /last successfully processed cursor/);
  assert.match(cron, /bounded catch-up windows, including weekends/);
  assert.match(cron, /confirmed delivery/);
  assert.match(cron, /America\/New_York/);
  assert.doesNotMatch(cron, /Tomorrow's run catches yesterday|if HubSpot is down, skip silently/);
  assert.match(evalChapter, /validate that exact artifact, then publish those same bytes/);
});

test('quickstart uses native installation and makes npm requirements explicit', () => {
  const quickstart = chapter('13-quickstart');
  assert.match(quickstart, /https:\/\/claude\.ai\/install\.sh/);
  assert.match(quickstart, /https:\/\/claude\.ai\/install\.ps1/);
  assert.match(quickstart, /Node\.js 22\+/);
  assert.match(quickstart, /claude doctor/);
  assert.match(quickstart, /2026-09-05/);
  assert.doesNotMatch(quickstart, /Node\.js 18|v18\.x/);
});

test('day-zero timing and safety precede the shared checklist', () => {
  const page = source('src/pages/day-zero.astro');
  assert.match(page, /about 70 minutes/);
  const safety = page.indexOf('id="before-you-connect"');
  const checklist = page.indexOf('<DayZeroChecklist');
  assert.ok(safety >= 0, 'safety section must exist');
  assert.ok(checklist >= 0, 'checklist must exist');
  assert.ok(safety < checklist, 'safety section must precede checklist');
  assert.match(page, /personal, non-commercial use/);
  assert.doesNotMatch(page, /The literal first 30 minutes|<h1>The first 30 minutes/);
});

test('resources no longer offers the unsafe aggregate-imputation download', () => {
  const page = source('src/pages/resources.astro');
  const snippets = source('src/lib/snippets.ts');
  const template = snippets.match(/export const SKILL_EMAIL_DELIVERABILITY = `([\s\S]*?)\n`;/)?.[1];
  assert.ok(template, 'shared deliverability template must exist');
  assert.match(page, /text=\{SKILL_EMAIL_DELIVERABILITY\}/);
  assert.match(page, /SKILL_EMAIL_DELIVERABILITY,[\s\S]*from '@\/lib\/snippets'/);
  assert.doesNotMatch(page, /const DELIVERABILITY_REVIEW_SKILL|## Measurement rules/);
  assert.match(template, /Never divide a 14-day rate or count to invent a 7-day result/);
  assert.match(template, /zero denominator means NO_DATA/);
  assert.match(template, /100 \* bounce_count \/ denominator/);
  assert.match(template, /REVIEW_REQUIRED/);
  assert.match(template, /allowed-tools: \[Read, WebFetch\]/);
  assert.doesNotMatch(template, /read 14-day and divide|cap at 500\/day|verdict values: SHIP/);
});

const compile = (code) => ts.transpileModule(code, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const widgetSource = source('src/widgets/DayZeroChecklist.tsx');
const widgetAst = ts.createSourceFile('DayZeroChecklist.tsx', widgetSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const helpers = widgetAst.statements.filter((statement) => ts.isVariableStatement(statement)
  || ts.isTypeAliasDeclaration(statement)
  || (ts.isFunctionDeclaration(statement) && statement.name?.text === 'restoreDone'));
const helperCode = compile(helpers.map((statement) => statement.getText(widgetAst)).join('\n') + '\nexport { STEPS, restoreDone };');
const { STEPS, restoreDone } = await import(`data:text/javascript;base64,${Buffer.from(helperCode).toString('base64')}`);

test('day-zero retains all saved step IDs while putting safety and a read-only result first', () => {
  const ids = STEPS.map(({ id }) => id);
  assert.deepEqual([...ids].sort(), ['github', 'vercel', 'claude-pro', 'install-cc', 'install-cowork', 'install-obsidian', 'claude-md', 'first-prompt', 'first-skill', 'first-cron', 'first-swarm', 'shutdown'].sort());
  assert.equal(ids[0], 'shutdown');
  assert.ok(ids.indexOf('first-prompt') < ids.indexOf('install-cowork'));
  assert.equal(STEPS.reduce((sum, step) => sum + parseInt(step.estimate, 10), 0), 68);
  assert.match(STEPS.find(({ id }) => id === 'install-cc').body, /native installer.*no Node\.js runtime/);
  assert.match(STEPS.find(({ id }) => id === 'vercel').body, /personal, non-commercial/);
  assert.match(STEPS.find(({ id }) => id === 'first-cron').body, /manual run and failure-case tests pass/);
  assert.doesNotMatch(widgetSource, /One npm command|Free tier covers everything|security chapter before bed/);
});

test('day-zero storage accepts only existing step IDs with boolean values', () => {
  for (const raw of [null, 'null', '[]', '[true]', 'false', '42', '"done"', '{invalid']) {
    assert.deepEqual(restoreDone(raw), {}, String(raw));
  }
  const payload = '{"shutdown":true,"github":false,"install-cc":"true","first-prompt":1,"first-cron":null,"unknown":true,"__proto__":{"polluted":true},"constructor":true}';
  assert.deepEqual(restoreDone(payload), { shutdown: true, github: false });
  const all = Object.fromEntries(STEPS.map(({ id }, i) => [id, i % 2 === 0]));
  assert.deepEqual(restoreDone(JSON.stringify(all)), all, 'existing saved progress must survive reordering');
  assert.equal({}.polluted, undefined);
});

test('day-zero effects hydrate before persisting and tolerate unavailable storage', () => {
  const component = widgetAst.statements.find((statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === 'DayZeroChecklist');
  const effects = component.body.statements.filter(ts.isExpressionStatement).map((statement) => statement.expression)
    .filter((expression) => ts.isCallExpression(expression) && expression.expression.getText(widgetAst) === 'useEffect');
  const restore = effects.find((effect) => effect.arguments[0].getText(widgetAst).includes('localStorage.getItem'));
  const persist = effects.find((effect) => effect.arguments[0].getText(widgetAst).includes('localStorage.setItem'));
  assert.ok(restore && persist, 'both storage effects must exist');
  assert.match(component.getText(widgetAst), /\[hydrated, setHydrated\] = useState\(false\)/);
  assert.match(persist.arguments[1].getText(widgetAst), /done, hydrated/);
  const restoreCode = compile(`(${restore.arguments[0].getText(widgetAst)})();`);
  const persistCode = compile(`(${persist.arguments[0].getText(widgetAst)})();`);
  const writes = [];
  let nextDone = {};
  let nextHydrated = false;
  const context = {
    done: {}, hydrated: false, restoreDone, STORAGE_KEY: 'cc-dayzero-steps',
    setDone: (value) => { nextDone = value; },
    setHydrated: (value) => { nextHydrated = value; },
    localStorage: { getItem: () => '{"shutdown":true}', setItem: (...args) => writes.push(args) },
  };
  runInNewContext(restoreCode, context);
  runInNewContext(persistCode, context);
  assert.deepEqual(writes, [], 'initial render closure must not overwrite saved progress');
  assert.deepEqual(nextDone, { shutdown: true });
  assert.equal(nextHydrated, true);
  Object.assign(context, { done: nextDone, hydrated: nextHydrated });
  runInNewContext(persistCode, context);
  assert.deepEqual(writes, [['cc-dayzero-steps', '{"shutdown":true}']]);
  nextHydrated = false;
  context.localStorage.getItem = () => { throw new Error('storage denied'); };
  assert.doesNotThrow(() => runInNewContext(restoreCode, context));
  assert.equal(nextHydrated, true, 'unavailable storage must not prevent hydration');
  context.localStorage.setItem = () => { throw new Error('storage full'); };
  assert.doesNotThrow(() => runInNewContext(persistCode, context));
});

test('research notes preserve titles and distinguish primary evidence from operator inference', async () => {
  const notesSource = source('src/lib/research-notes.ts');
  const { RESEARCH_NOTES } = await import(`data:text/javascript;base64,${Buffer.from(compile(notesSource)).toString('base64')}`);
  const interviews = RESEARCH_NOTES.find(({ title }) => title === "Anthropic's 81k interviews — what 80,508 Claude users in 159 countries actually want from AI");
  const berkeley = RESEARCH_NOTES.find(({ title }) => title === 'Berkeley RDI reward-hacked 8 major agent benchmarks');
  assert.ok(interviews && berkeley, 'titles must remain stable for existing fragments');
  assert.ok(interviews.links.some(({ href }) => href === 'https://www.anthropic.com/features/81k-interviews'));
  assert.ok(berkeley.links.some(({ href }) => href === 'https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/'));
  assert.match(JSON.stringify(interviews), /not a percentage of failed tasks/);
  assert.match(JSON.stringify(berkeley), /automated scanning agent/);
  assert.match(berkeley.source, /April 2026.*note reviewed 2026-09-05/);
  assert.doesNotMatch(notesSource, /Dec 2024 fieldwork|highest single number in the whole study|three independent confirmations|Three methods, one answer|every public score is contaminated|paper released 2026-04-12/);
  assert.doesNotMatch(JSON.stringify(berkeley), /10-15 points|72\.5%|3 method-independent/);
});

test('showcase chapter references resolve to existing topic-appropriate routes', () => {
  const page = source('src/pages/showcase.astro');
  assert.doesNotMatch(page, /href: '(25-evals|14-newsletters|11-building|22-distribution)'/);
  for (const slug of ['25-evals-or-hope', '34-write-on-behalf', '31-stages']) {
    assert.ok(page.includes(`href: '${slug}'`));
    assert.ok(chapter(slug).startsWith('---'));
  }
  assert.match(page, /href: 'launch-week'.*external: true/);
  assert.ok(source('src/pages/launch-week.astro'));
});

test('rules-page fragments point to real headings', () => {
  const rules = source('src/pages/claude-md-rules.astro');
  assert.match(rules, /href="#three-rules"/);
  assert.match(rules, /id="three-rules"/);
  assert.match(rules, /resources\/#working-memory/);
  assert.match(source('src/pages/resources.astro'), /id="working-memory"/);
  assert.doesNotMatch(rules, /\$\{base\}\/#three-rules|resources\/#claude-md/);
});

test('incident and measurement chapters link to the existing operating resources', () => {
  assert.match(chapter('28-failure-receipts'), /https:\/\/vladyslavpodoliako\.com\/thoughts\/ai-agent-incident-review-template/);
  assert.match(chapter('47-measurement-layer'), /https:\/\/vladyslavpodoliako\.com\/thoughts\/ai-agent-evaluation-metrics-that-matter/);
  assert.doesNotMatch(chapter('47-measurement-layer'), /told you to skip for an internal skill/);
});
