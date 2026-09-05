import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/widgets/ThirtyDayPlan.tsx', import.meta.url), 'utf8');
const ast = ts.createSourceFile('ThirtyDayPlan.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const helpers = ast.statements.filter((statement) => ts.isVariableStatement(statement)
  || ts.isTypeAliasDeclaration(statement)
  || (ts.isFunctionDeclaration(statement) && !['ThirtyDayPlan', 'Pick', 'download', 'linkify'].includes(statement.name?.text)));
const compiled = ts.transpileModule(helpers.map((statement) => statement.getText(ast)).join('\n') + '\nexport { buildPlan, buildICS, absoluteChapterLinks };', {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { buildPlan, buildICS, absoluteChapterLinks } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);
const stacks = ['beginner', 'operator', 'builder'];
const focuses = ['ops', 'eng', 'creative'];
const cadences = ['gentle', 'aggressive'];

test('all 18 plans have 30 days and safety gates before any setup or automation', () => {
  for (const stack of stacks) for (const cadence of cadences) for (const focus of focuses) {
    const days = buildPlan(stack, cadence, focus);
    assert.equal(days.length, 30, `${stack}/${cadence}/${focus}`);
    assert.deepEqual(days.map(({ day }) => day), Array.from({ length: 30 }, (_, i) => i + 1));
    assert.equal(days[0].chapter, '09');
    assert.equal(days[1].chapter, '15');
    assert.equal(days.filter(({ chapter }) => chapter === '09').length, 1);
    assert.equal(days.filter(({ chapter }) => chapter === '15').length, 1);
    for (const chapter of ['04', '05', '06', '07', '13', '16', '18']) {
      const position = days.findIndex((day) => day.chapter === chapter);
      assert.ok(position === -1 || position > 1, `${chapter} occurs after safety gates`);
    }
    assert.ok(days.every((day) => day.tasks.length > 0 && day.tasks.every((task) => typeof task === 'string' && task.length > 0)));
  }
});

test('Focus changes exercises and outputs on every stack and cadence', () => {
  for (const stack of stacks) for (const cadence of cadences) {
    const plans = focuses.map((focus) => buildPlan(stack, cadence, focus));
    assert.equal(new Set(plans.map((plan) => JSON.stringify(plan.map(({ tasks }) => tasks)))).size, 3);
    const skills = plans.map((days) => days.find(({ chapter }) => chapter === '05').tasks.join(' '));
    assert.match(skills[0], /operations brief/);
    assert.match(skills[1], /failing-test proposal/);
    assert.match(skills[2], /newsletter outline/);
  }
});

test('Cadence adds a concrete exercise and changes work-session duration without assigning rest-day work', () => {
  for (const stack of stacks) for (const focus of focuses) {
    const gentle = buildPlan(stack, 'gentle', focus);
    const aggressive = buildPlan(stack, 'aggressive', focus);
    for (let i = 0; i < gentle.length; i++) {
      assert.equal(gentle[i].theme, aggressive[i].theme);
      if (gentle[i].minutes === 0) {
        assert.deepEqual(gentle[i], aggressive[i]);
      } else {
        assert.equal(gentle[i].minutes, 30);
        assert.equal(aggressive[i].minutes, 75);
        assert.equal(aggressive[i].tasks.length, gentle[i].tasks.length + 1);
        assert.deepEqual(aggressive[i].tasks.slice(0, -1), gentle[i].tasks);
        assert.ok(!gentle[i].tasks.includes(aggressive[i].tasks.at(-1)));
      }
    }
  }
});

test('generating and editing one plan does not mutate later plans or template arrays', () => {
  const first = buildPlan('operator', 'gentle', 'ops');
  const expected = structuredClone(first);
  first[0].tasks.push('mutation');
  buildPlan('operator', 'aggressive', 'creative');
  assert.deepEqual(buildPlan('operator', 'gentle', 'ops'), expected);
});

const unfold = (ics) => ics.replace(/\r\n[ \t]/g, '');
function events(ics) {
  return [...unfold(ics).matchAll(/BEGIN:VEVENT\r\n([\s\S]*?)END:VEVENT/g)].map(([, body]) => Object.fromEntries(
    body.trim().split('\r\n').map((line) => [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1)]),
  ));
}
function dateFromICS(value) {
  return new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}Z`);
}

test('calendar export uses actual durations, omits rest days, and includes timestamp and chapter links', () => {
  const now = new Date('2026-09-05T12:34:56Z');
  for (const cadence of cadences) {
    const days = buildPlan('operator', cadence, 'ops');
    const rows = events(buildICS(days, now));
    assert.equal(rows.length, days.filter(({ minutes }) => minutes > 0).length);
    assert.equal(new Set(rows.map(({ UID }) => UID)).size, rows.length);
    for (const row of rows) {
      assert.equal((dateFromICS(row.DTEND) - dateFromICS(row.DTSTART)) / 60_000, cadence === 'gentle' ? 30 : 75);
      assert.equal(row.DTSTAMP, '20260905T123456Z');
    }
    assert.match(rows[0].DESCRIPTION, /https:\/\/dive\.vladyslavpodoliako\.com\/chapters\/09-dont-get-owned\//);
    assert.ok(rows.every((row) => !row.SUMMARY.includes('Rest day')));
  }
});

test('calendar sessions remain at 9 AM local time across both daylight-saving transitions', () => {
  const originalTZ = process.env.TZ;
  process.env.TZ = 'Europe/London';
  try {
    for (const [now, hours] of [['2026-03-27T12:00:00Z', 23], ['2026-10-23T12:00:00Z', 25]]) {
      const rows = events(buildICS(buildPlan('beginner', 'gentle', 'ops'), new Date(now)));
      assert.equal((dateFromICS(rows[1].DTSTART) - dateFromICS(rows[0].DTSTART)) / 3_600_000, hours);
      assert.ok(rows.every((row) => dateFromICS(row.DTSTART).getHours() === 9));
    }
  } finally {
    if (originalTZ === undefined) delete process.env.TZ;
    else process.env.TZ = originalTZ;
  }
});

test('calendar text escapes field delimiters and folds Unicode lines within 75 bytes', () => {
  const days = [{ day: 1, theme: 'Review, verify; ship', minutes: 30, tasks: ['Check \\path; one,two\nBEGIN:VEVENT', 'Read '.repeat(30) + '\u00e9'.repeat(80)] }];
  const ics = buildICS(days, new Date('2026-09-05T12:00:00Z'));
  assert.ok(ics.split('\r\n').every((line) => Buffer.byteLength(line) <= 75));
  assert.equal(events(ics).length, 1);
  assert.match(unfold(ics), /Review\\, verify\\; ship/);
  assert.match(unfold(ics), /Check \\\\path\\; one\\,two\\nBEGIN:VEVENT/);
  assert.ok(ics.endsWith('\r\n'));
});

test('exported chapter links are absolute and new start dates use different calendar IDs', () => {
  assert.equal(absoluteChapterLinks('Read [Ch 9](09-dont-get-owned)'), 'Read [Ch 9](https://dive.vladyslavpodoliako.com/chapters/09-dont-get-owned/)');
  const plan = buildPlan('builder', 'aggressive', 'eng');
  const first = events(buildICS(plan, new Date('2026-09-05T12:00:00Z')))[0].UID;
  const second = events(buildICS(plan, new Date('2026-09-06T12:00:00Z')))[0].UID;
  assert.notEqual(first, second);
});
