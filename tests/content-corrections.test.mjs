import test from 'node:test';
import assert from 'node:assert/strict';
import { closeSync, existsSync, mkdtempSync, openSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs';
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

test('published block-push hooks read JSON stdin and return blocking decisions', async () => {
  const { HOOK_BLOCK_PUSH_TO_MAIN } = await import(`data:text/javascript;base64,${Buffer.from(compile(source('src/lib/snippets.ts'))).toString('base64')}`);
  const section = chapter('16-hooks-subagents').split('### 3. block-push-to-main')[1].split('### 4.')[0];
  const chapterConfig = JSON.parse(section.match(/```json\n([\s\S]*?)\n```/)[1]);
  const configs = [JSON.parse(HOOK_BLOCK_PUSH_TO_MAIN).hooks, chapterConfig];
  for (const config of configs) {
    assert.equal(config.PreToolUse[0].matcher, 'Bash');
    const command = config.PreToolUse[0].hooks[0].command;
    for (const [input, expectedStatus, legacyInput] of [
      [{ tool_input: { command: 'git push origin main' } }, 2, ''],
      [{ tool_input: { command: 'git status && git push origin main' } }, 2, ''],
      [{ tool_input: { command: 'git push origin feature/hooks' } }, 0, 'git push origin main'],
      [{ tool_input: { command: 'git status', description: 'git push origin main' } }, 0, ''],
      [{ tool_input: { command: 'printf "quoted text\\n"' } }, 0, ''],
      [{ tool_input: {} }, 2, ''],
      [{ tool_input: { command: 42 } }, 2, ''],
      ['{invalid', 2, ''],
    ]) {
      const result = spawnSync('sh', ['-c', command], {
        input: typeof input === 'string' ? input : JSON.stringify(input),
        env: { ...process.env, CLAUDE_TOOL_INPUT: legacyInput },
        encoding: 'utf8', timeout: 5000,
      });
      assert.ifError(result.error);
      assert.equal(result.status, expectedStatus, JSON.stringify(input));
      assert.equal(result.stdout, '', 'exit-code hooks must not emit a JSON decision');
      if (expectedStatus === 2) assert.match(result.stderr, /Blocked:/);
      else assert.equal(result.stderr, '');
    }
    const jqPath = spawnSync('sh', ['-c', 'command -v jq'], { encoding: 'utf8' }).stdout.trim();
    const bin = mkdtempSync(join(tmpdir(), 'hook-jq-only-'));
    try {
      // Missing jq exits before reading stdin. A pipe races that exit and can
      // report EPIPE; a file keeps the hook's blocking decision observable.
      const inputPath = join(bin, 'input.json');
      writeFileSync(inputPath, JSON.stringify({
        tool_input: { command: 'git push origin main' },
        padding: 'x'.repeat(1024 * 1024), // Exceeds pipe capacity to expose regressions.
      }));
      const inputFd = openSync(inputPath, 'r');
      try {
        const missingJq = spawnSync('/bin/sh', ['-c', command], {
          stdio: [inputFd, 'pipe', 'pipe'],
          env: { PATH: '/nonexistent' }, encoding: 'utf8', timeout: 5000,
        });
        assert.ifError(missingJq.error);
        assert.equal(missingJq.status, 2, 'missing jq must not silently allow a push');
        assert.equal(missingJq.stdout, '', 'exit-code hooks must not emit a JSON decision');
        assert.match(missingJq.stderr, /Blocked:/);
      } finally {
        closeSync(inputFd);
      }
      symlinkSync(jqPath, join(bin, 'jq'));
      const noGrep = spawnSync('/bin/sh', ['-c', command], {
        input: JSON.stringify({ tool_input: { command: 'git push origin main' } }),
        env: { PATH: bin }, encoding: 'utf8', timeout: 5000,
      });
      assert.ifError(noGrep.error);
      assert.equal(noGrep.status, 2, 'the matcher must block with only jq on PATH');
      assert.equal(noGrep.stderr, 'Blocked: push to main requires a human.\n');
    } finally {
      rmSync(bin, { recursive: true, force: true });
    }
  }
});

const hookSnippets = await import(`data:text/javascript;base64,${Buffer.from(compile(source('src/lib/snippets.ts'))).toString('base64')}`);
const hookChapter = chapter('16-hooks-subagents');
const chapterJson = (start, end) => JSON.parse(hookChapter.split(start)[1].split(end)[0].match(/```json\n([\s\S]*?)\n```/)[1]);
const hookInput = (input) => (typeof input === 'string' ? input : JSON.stringify(input));
// Stub tools that log each call, one bracket per argument, so a path with a space shows whether it was quoted.
// Told to fail, a stub complains on stderr the way a real formatter does.
const stub = (name, extra = '') => `#!/bin/sh\n{ printf '%s' ${name}; for a in "$@"; do printf ' [%s]' "$a"; done; printf '\\n'; } >> "$HOOK_CALLS"\n${extra}[ "\${STUB_EXIT_${name.toUpperCase()}:-0}" = 0 ] || echo '${name}: failed' >&2\nexit "\${STUB_EXIT_${name.toUpperCase()}:-0}"\n`;
const withStubs = (fn) => {
  const dir = mkdtempSync(join(tmpdir(), 'hook-stubs-'));
  const log = join(dir, 'calls.log');
  try {
    for (const name of ['prettier', 'ruff', 'npx']) writeFileSync(join(dir, name), stub(name), { mode: 0o755 });
    writeFileSync(join(dir, 'curl'), stub('curl', 'cat >> "$HOOK_CALLS"\n'), { mode: 0o755 });
    const run = (command, input, env = {}) => spawnSync('/bin/sh', ['-c', command], {
      input: hookInput(input),
      env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, HOOK_CALLS: log, ...env },
      encoding: 'utf8', timeout: 10000,
    });
    const calls = () => (existsSync(log) ? readFileSync(log, 'utf8') : '');
    const reset = () => rmSync(log, { force: true });
    return fn({ dir, run, calls, reset });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};
const runScript = (script, input, env = {}) => spawnSync('/bin/bash', ['-c', script], {
  input: hookInput(input), env: { ...process.env, ...env }, encoding: 'utf8', timeout: 10000,
});
// Multi-line text far past a pipe buffer: `echo … | grep -q` under pipefail misses a match on its first line.
const longText = (firstLine) => `${firstLine}\n${`${'x'.repeat(99)}\n`.repeat(10_500)}`;

// Every file under src/ except the generated feed data that every radar run rewrites.
const srcFiles = (dir = 'src') => readdirSync(new URL(`../${dir}`, import.meta.url), { withFileTypes: true }).flatMap((entry) => {
  const path = `${dir}/${entry.name}`;
  if (!entry.isDirectory()) return [path];
  return path === 'src/data' ? [] : srcFiles(path);
});
// Each line under src/ that matches, as `path: trimmed line`.
const srcLines = (pattern) => srcFiles().flatMap((path) => source(path).split('\n').filter((line) => pattern.test(line)).map((line) => `${path}: ${line.trim()}`));

test('no page names a hook environment variable Claude Code never sets', () => {
  // The hooks reference names none of these: command hooks get their input as JSON on stdin.
  const hits = srcLines(/CLAUDE_(?:TOOL_INPUT|FILE_PATH|SESSION_ID|TURN_DURATION_MS|USER_PROMPT)/);
  // Lines that name one only to say it must not be read.
  const corrections = [
    'src/content/chapters/56-skill-leaderboard.mdx: # Do not read $CLAUDE_TOOL_INPUT: Claude Code never sets it. Appends one JSONL line per use.',
    'src/pages/claude-code-hooks.astro: The previous block-push example read <code>CLAUDE_TOOL_INPUT</code> and returned <code>exit 1</code>. Both were wrong for this hook: read the JSON on stdin and return <code>exit 2</code> to block. Hooks that emit a valid JSON decision have additional controls; the example below uses exit codes alone.',
  ];
  assert.deepEqual(corrections.filter((line) => hits.includes(line)), corrections, 'the scan must see the correction lines it allows');
  assert.deepEqual(hits.filter((line) => !corrections.includes(line)), [], 'Claude Code sends hook input as JSON on stdin and never sets these variables');
});

test('hook wiring names the subagent tool Agent, as the hooks reference does', () => {
  // The reference documents the Agent tool's input and has no Task tool.
  // A hook wired to a tool: the tool as a whole word in a matcher value, after PreToolUse or PostToolUse on the
  // same line (one table cell at most), or as "<tool> tool" / "<tool> call".
  const wiring = (tool) => new RegExp(`"matcher"\\s*:\\s*"[^"]*\\b${tool}\\b[^"]*"|(?:PreToolUse|PostToolUse)[^<\\n]*?\\b${tool}\\b|\\b${tool} (?:tool|call)\\b`);
  assert.deepEqual(srcLines(wiring('Task')), []);
  const agentPaths = new Set(srcLines(wiring('Agent')).map((hit) => hit.slice(0, hit.indexOf(': '))));
  for (const path of ['src/lib/snippets.ts', 'src/pages/claude-code-hooks.astro']) {
    assert.ok(agentPaths.has(path), `the scan must see the Agent wiring in ${path}`);
  }
});

test('the published secrets-scan hook reads the write from JSON stdin and blocks live keys', () => {
  const script = hookSnippets.HOOK_SECRETS_SCAN;
  const key = `sk-ant-api03-${'A'.repeat(24)}`; // assembled here so no key-shaped literal sits in the repo
  for (const [label, input, status, env = {}] of [
    ['Write content', { tool_input: { file_path: '/tmp/a.env', content: `A=1\n${key}\n` } }, 2],
    ['Edit new_string', { tool_input: { file_path: '/tmp/a.ts', old_string: 'x', new_string: key } }, 2],
    ['key on the first line of a long write', { tool_input: { content: longText(key) } }, 2],
    ['unreadable JSON', '{invalid', 2],
    ['content that is not a string', { tool_input: { content: 42 } }, 2],
    ['clean write', { tool_input: { content: 'hello' } }, 0],
    ['key only in the variable Claude Code never sets', { tool_input: { content: 'hello' } }, 0, { CLAUDE_TOOL_INPUT: key }],
  ]) {
    const result = runScript(script, input, { CLAUDE_TOOL_INPUT: '', ...env });
    assert.ifError(result.error);
    assert.equal(result.status, status, label);
    if (status === 2) assert.match(result.stderr, /^secrets-scan: /m, `${label}: exit 2 hands Claude stderr as the reason`);
    else assert.equal(result.stderr, '', label);
  }
  const bin = mkdtempSync(join(tmpdir(), 'hook-no-jq-'));
  try {
    // Without jq the hook exits before reading stdin; a file instead of a pipe keeps that exit observable.
    const inputPath = join(bin, 'input.json');
    writeFileSync(inputPath, JSON.stringify({ tool_input: { content: key } }));
    const inputFd = openSync(inputPath, 'r');
    try {
      const noJq = spawnSync('/bin/bash', ['-c', script], {
        stdio: [inputFd, 'pipe', 'pipe'], env: { PATH: bin }, encoding: 'utf8', timeout: 10000,
      });
      assert.ifError(noJq.error);
      assert.equal(noJq.status, 2, 'a missing jq must not let an unscanned write through');
      assert.match(noJq.stderr, /^secrets-scan: /m);
    } finally {
      closeSync(inputFd);
    }
  } finally {
    rmSync(bin, { recursive: true, force: true });
  }
});

test('the published agent watchdog logs the subagent from JSON stdin and never blocks', () => {
  const script = hookSnippets.HOOK_AGENT_WATCHDOG;
  assert.match(script, /^# PreToolUse on Agent /m);
  assert.match(script, /"matcher": "Agent"/);
  const home = mkdtempSync(join(tmpdir(), 'hook-home-'));
  try {
    const log = join(home, '.claude', 'health', 'subagent-launches.jsonl');
    const description = `Find "API" endpoints\nand list them ${'x'.repeat(80)}`;
    const env = { HOME: home, CLAUDE_PROJECT_DIR: '/work/app', CLAUDE_SESSION_ID: 'stale', CLAUDE_TOOL_INPUT: 'stale' };
    const logged = runScript(script, { session_id: 'sess-1', tool_name: 'Agent', tool_input: { description, prompt: 'p' } }, env);
    assert.equal(logged.status, 0);
    assert.equal(logged.stdout, '');
    assert.equal(logged.stderr, '');
    const rows = readFileSync(log, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.equal(rows.length, 1);
    assert.equal(rows[0].session, 'sess-1');
    assert.equal(rows[0].desc, description.slice(0, 80));
    assert.equal(rows[0].project, '/work/app');
    assert.match(rows[0].ts, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/);
    const first = readFileSync(log, 'utf8');
    assert.equal(runScript(script, '{invalid', env).status, 0, 'a logging failure must not block the subagent');
    assert.equal(readFileSync(log, 'utf8'), first, 'unreadable input logs nothing and keeps the earlier rows');
    assert.equal(runScript(script, { session_id: 'sess-2', tool_input: { description: 'second' } }, env).status, 0);
    const sessions = readFileSync(log, 'utf8').trim().split('\n').map((line) => JSON.parse(line).session);
    assert.deepEqual(sessions, ['sess-1', 'sess-2'], 'each launch appends its own row');
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('the published format and test hooks read the edited file from JSON stdin', () => {
  const file = '/tmp/hook demo/a b.ts';
  const testFile = '/tmp/hook demo/a b.test.ts';
  const notATest = '/tmp/hook demo/latest.ts'; // "test" in the name, but not *.test.*
  const formatHooks = [
    ['snippet', JSON.parse(hookSnippets.HOOK_FORMAT_ON_SAVE).hooks.PostToolUse[0].hooks[0].command],
    ['chapter hook 1', chapterJson('### 1. format-on-save', '### 2.').hooks[0].command],
  ];
  const testHooks = [
    ['snippet', JSON.parse(hookSnippets.HOOK_TEST_ON_WRITE).hooks.PostToolUse[0].hooks[0].command],
    ['chapter hook 2', chapterJson('### 2. test-on-write', '### 3.').hooks[0].command],
  ];
  withStubs(({ run, calls, reset }) => {
    const intro = chapterJson('the shape of a real', 'The `matcher` field').hooks.PostToolUse[0].hooks[0].command;
    assert.equal(run(intro, { tool_input: { file_path: file } }, { CLAUDE_FILE_PATH: '/tmp/stale.ts' }).status, 0);
    assert.equal(calls(), `prettier [--write] [${file}]\n`, 'chapter intro');
    for (const [label, command] of formatHooks) {
      reset();
      let result = run(command, { tool_input: { file_path: file } }, { CLAUDE_FILE_PATH: '/tmp/stale.ts' });
      assert.equal(result.status, 0, label);
      assert.equal(calls(), `prettier [--write] [${file}]\n`, label);
      reset();
      result = run(command, { tool_input: { file_path: file } }, { STUB_EXIT_PRETTIER: '1' });
      assert.equal(result.status, 0, label);
      assert.equal(calls(), `prettier [--write] [${file}]\nruff [format] [${file}]\n`, `${label}: falls back to Ruff`);
      reset();
      result = run(command, { tool_input: { file_path: file } }, { STUB_EXIT_PRETTIER: '1', STUB_EXIT_RUFF: '1' });
      assert.equal(result.status, 0, `${label}: a file neither formatter takes stays silent`);
      assert.equal(result.stderr, '', label);
      reset();
      result = run(command, { tool_input: {} }, { CLAUDE_FILE_PATH: '/tmp/stale.ts' });
      assert.equal(result.status, 0, label);
      assert.equal(calls(), '', `${label}: no file_path, no formatter`);
    }
    for (const [label, command] of testHooks) {
      reset();
      let result = run(command, { tool_input: { file_path: testFile } }, { CLAUDE_FILE_PATH: '/tmp/stale.ts' });
      assert.equal(result.status, 0, label);
      assert.equal(calls(), `npx [vitest] [run] [${testFile}]\n`, label);
      reset();
      result = run(command, { tool_input: { file_path: notATest } }, { CLAUDE_FILE_PATH: '/tmp/stale.test.ts' });
      assert.equal(result.status, 0, label);
      assert.equal(calls(), '', `${label}: only *.test.* files run`);
    }
  });
});

test('the published Slack hook times the turn itself and posts JSON only after two minutes', () => {
  for (const [label, config] of [
    ['snippet', JSON.parse(hookSnippets.HOOK_SLACK_NOTIFY_LONG_TASK).hooks],
    ['chapter hook 5', chapterJson('### 5. slack-notify-on-long-task', '\n---\n')],
  ]) {
    withStubs(({ dir, run, calls, reset }) => {
      const begin = config.UserPromptSubmit[0].hooks[0].command;
      const stop = config.Stop[0].hooks[0].command;
      const env = { TMPDIR: dir, SLACK_WEBHOOK: 'https://hooks.example.test/T0/B0/x', CLAUDE_TURN_DURATION_MS: '999999', CLAUDE_SESSION_ID: 'stale' };
      const stamp = join(dir, 'cc-turn-sess-1');
      const began = run(begin, { session_id: 'sess-1', prompt: 'refactor the app' }, env);
      assert.equal(began.status, 0, label);
      assert.equal(began.stdout, '', `${label}: UserPromptSubmit stdout would be added to Claude's context`);
      const now = Date.now() / 1000;
      assert.ok(existsSync(stamp), `${label}: stamps the turn's start`);
      assert.ok(Math.abs(statSync(stamp).mtimeMs / 1000 - now) <= 5, `${label}: stamps the turn's start`);
      assert.equal(run(begin, '{invalid', env).status, 0, `${label}: a failed read still exits 0`);
      let result = run(stop, { session_id: 'sess-1' }, env);
      assert.equal(result.status, 0, label);
      assert.equal(calls(), '', `${label}: a short turn posts nothing`);
      utimesSync(stamp, now - 100, now - 100);
      result = run(stop, { session_id: 'sess-1' }, env);
      assert.equal(result.status, 0, label);
      assert.equal(calls(), '', `${label}: a 100 s turn posts nothing`);
      utimesSync(stamp, now - 200, now - 200);
      result = run(stop, { session_id: 'sess-1' }, env);
      assert.equal(result.status, 0, label);
      // Slack's incoming webhooks take a JSON body with a text field, sent as application/json.
      const [call, body, ...rest] = calls().trim().split('\n');
      assert.match(call, /^curl .*\[-H\] \[content-type: application\/json\]/i, label);
      assert.ok(call.endsWith(' [https://hooks.example.test/T0/B0/x]'), `${label}: posts to $SLACK_WEBHOOK`);
      const message = JSON.parse(body);
      assert.equal(typeof message.text, 'string', label);
      assert.notEqual(message.text, '', label);
      assert.deepEqual(rest, [], label);
      reset();
      assert.equal(run(begin, { session_id: 'sess-1', prompt: 'next task' }, env).status, 0, label);
      result = run(stop, { session_id: 'sess-1' }, env);
      assert.equal(result.status, 0, label);
      assert.equal(calls(), '', `${label}: a new turn restarts the clock`);
      result = run(stop, { session_id: 'sess-2' }, env);
      assert.equal(result.status, 0, `${label}, no stamp: a Stop hook that exits 2 keeps Claude going`);
      assert.equal(calls(), '', `${label}, no stamp`);
    });
  }
});

test('the published prompt-cache guard reads the prompt from JSON stdin', () => {
  const script = hookSnippets.HOOK_PROMPT_CACHE_GUARD;
  const run = (input, env = {}) => runScript(script, input, { CLAUDE_USER_PROMPT: '', ...env });
  for (const [label, prompt] of [
    ['short prompt', 'Please update CLAUDE.md with the new rule'],
    ['long multi-line prompt', longText('edit CLAUDE.md first')],
  ]) {
    const result = run({ prompt });
    assert.equal(result.status, 0, label);
    assert.match(result.stderr, /^prompt-cache-guard: /m, label);
  }
  const stale = run({ prompt: 'hello' }, { CLAUDE_USER_PROMPT: 'edit CLAUDE.md' });
  assert.equal(stale.status, 0);
  assert.equal(stale.stderr, '', 'reads the prompt from stdin, not from the variable Claude Code never sets');
  assert.equal(run('{invalid').status, 0, 'a warn-only hook must not block a prompt it cannot read');
});

test('the cheat sheet gives the hook exit codes the reference documents', () => {
  const block = source('src/pages/cheat-sheet.astro').split("h: 'Hook JSON shape'")[1].split("h: '")[0];
  // Checks what each row says, not its wording.
  const rows = Object.fromEntries([...block.matchAll(/\[(?:'([^']+)'|"([^"]+)"), (?:'([^']*)'|"([^"]*)")\]/g)]
    .map(([, key1, key2, value1, value2]) => [key1 ?? key2, value1 ?? value2]));
  const row = (key) => {
    assert.ok(Object.hasOwn(rows, key), `the block keeps its ${key} row`);
    return rows[key];
  };
  assert.match(row('stdin'), /tool_input/, 'the input arrives as JSON on stdin');
  row('.tool_input.file_path');
  assert.match(row('exit 0'), /success/i, 'exit 0 is success');
  assert.match(row('exit 2'), /(?<!non-)\bblock/i, 'exit 2 blocks');
  assert.doesNotMatch(row('exit 2'), /non-?blocking|not block|goes ahead|proceeds/i, 'exit 2 blocks');
  assert.match(row('exit 2'), /stderr/, 'exit 2 hands Claude stderr as the reason');
  assert.match(row('other exit codes'), /non-blocking|does not block|goes ahead|proceeds/i, 'other exit codes do not block on their own');
  assert.match(row('stdout JSON'), /hookSpecificOutput/, 'PreToolUse returns its decision inside hookSpecificOutput');
  assert.doesNotMatch(block, /non-zero/);
});

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

test('pricing page keeps vendor prices in PRICES and no superseded model reads as current', () => {
  const page = source('src/pages/claude-code-pricing.astro');
  const block = page.match(/\nconst PRICES = \{[\s\S]*?\n\};\n/)?.[0];
  assert.ok(block, 'PRICES block not found');
  const prose = page.replace(block, '\n');
  // A price typed into prose goes stale at the next price change; only Vlad's own receipts may stay literal (#77).
  const receipts = ['$400', '$2,216', '$556', '$1,200', '$4,312', '$1,108', '$600', '$300'];
  assert.deepEqual((prose.match(/\$\d(?:[\d,.]*\d)?/g) ?? []).filter((amount) => !receipts.includes(amount)), []);
  // Stamps and month-year phrases reach the page only through PRICES: a typed one reads as current and goes stale.
  // Date an event with its day instead ("July 24, 2026").
  const months = 'January|February|March|April|May|June|July|August|September|October|November|December';
  assert.deepEqual(prose.match(new RegExp(`\\b20\\d\\d-\\d\\d-\\d\\d\\b|\\b(?:${months}) 20\\d\\d\\b`, 'g')) ?? [], []);
  // A bare year ("cost in 2026?") goes stale on January 1, so it comes from the stamps too (#79).
  const dayBefore = new RegExp(`(?:${months}) \\d{1,2}, $`);
  assert.deepEqual([...prose.matchAll(/\b20[23]\d\b/g)].filter((m) => !dayBefore.test(prose.slice(Math.max(0, m.index - 20), m.index))).map((m) => m[0]), [], 'a year outside PRICES must come from stampYear or sit in a "Month D, YYYY" event date');
  // The heading reads its year from stampYear, and nothing on the page reads the build clock, which would print the
  // year of the build over prices last checked in an earlier one. The one Date the page builds is the stamp's.
  assert.match(page, /<h2[^>]*>How much does Claude Code cost in \{stampYear\}\?<\/h2>/, 'the pricing heading does not read stampYear');
  assert.doesNotMatch(page, /\bnew Date\b(?!\(newestStamp\))|Date\.now\(|get(?:UTC)?FullYear|\.format\(\)/, 'the pricing page reads the build clock');
  // Run the frontmatter that turns the stamps into text, with two different stamps: the title, description and heading
  // year take the newer stamp, and FAQ answer 2 (the FAQPage JSON-LD) prints the plans stamp, interpolated rather than typed.
  // The stamps sit in years no build will run in, so a year read from the clock cannot pass for a stamp's.
  // The run uses the real PRICES block and plan(), whose one type annotation is stripped for the vm.
  const code = ['newestStamp', 'stampMonth', 'stampYear', 'title', 'description'].map((name) => page.match(new RegExp(`\\nconst ${name} = [^\\n]+`))?.[0] ?? assert.fail(`const ${name} not found`));
  const faq = page.match(/\nconst faqItems = \[[\s\S]*?\n\];\n/)?.[0] ?? assert.fail('faqItems not found');
  const planCode = page.match(/\nconst plan = \(name: string\) => \{[\s\S]*?\n\};\n/)?.[0].replace('(name: string)', '(name)') ?? assert.fail('plan() not found');
  for (const [lastVerified, apiLastVerified] of [['2098-01-01', '2097-12-15'], ['2097-12-15', '2098-01-01']]) {
    const stamps = `PRICES.lastVerified = '${lastVerified}'; PRICES.apiLastVerified = '${apiLastVerified}';`;
    const out = runInNewContext(`${block}${stamps}${planCode}${code.join('')}${faq}; ({ title, description, stampYear, faqItems })`);
    assert.ok(out.title.includes('January 2098') && out.description.includes('January 2098'), 'title or description month is not the newer stamp');
    assert.equal(out.stampYear, '2098', 'the heading year is not the newer stamp');
    assert.ok(out.faqItems[1].a.includes(`verified against claude.com/pricing on ${lastVerified},`), 'FAQ answer 2 does not print PRICES.lastVerified');
    assert.ok(out.faqItems.every((item) => !/\$\{|undefined/.test(item.q + item.a)), 'an FAQ string prints template source or "undefined"');
    assert.doesNotMatch(out.title + out.description, /undefined/, 'the title or description prints "undefined"');
    assert.deepEqual((out.title + out.description).match(/\b20\d\d\b/g).filter((year) => year !== '2098'), [], 'the title or description prints a year other than the newer stamp');
    const faqYears = [...out.faqItems].flatMap((item) => (item.q + item.a).match(/\b20\d\d\b/g) ?? []);
    assert.deepEqual(faqYears.filter((year) => year !== '2098' && year !== lastVerified.slice(0, 4)), [], 'an FAQ string prints a year that is not a stamp\'s');
  }
  // plan() reads a price cell by its "annual" label, so a re-check that writes the annual price first cannot print it as monthly.
  const planOf = (price) => runInNewContext(`const PRICES = { plans: [{ plan: 'X', price: ${JSON.stringify(price)} }] };${planCode}; plan('X')`);
  for (const price of ['$20/mo · $17/mo annual', '$17/mo annual · $20/mo', '$17/mo Annual · $20/mo', '$17/mo billed yearly · $20/mo']) {
    const { monthly, annual } = planOf(price);
    assert.ok(monthly === '$20' && annual === '$17', `plan() read "${price}" as monthly ${monthly}, annual ${annual}`);
  }
  assert.throws(() => planOf('$17/mo annual'), /no monthly price/);
  // A cell with two unlabelled prices is ambiguous, so it fails the build instead of guessing which one is monthly.
  assert.throws(() => planOf('$17/mo on a 12-month plan · $20/mo'), /more than one price without an "annual" label/);
  // A part without a price is a note, not a third price.
  const noted = planOf('$25/seat · $20 annual · 2-seat minimum');
  assert.ok(noted.monthly === '$25' && noted.annual === '$20', `plan() read a cell with a note as monthly ${noted.monthly}, annual ${noted.annual}`);
  // On the real table annual billing is the cheaper rate, so a monthly price at or below its annual one was misread,
  // and a cell with two prices must yield both.
  const amount = (s) => Number(s.replace(/[^\d.]/g, ''));
  for (const [name, price, { monthly, annual }] of runInNewContext(`${block}${planCode}; PRICES.plans.map((p) => [p.plan, p.price, plan(p.plan)])`)) {
    assert.ok(price.split('$').length > 2 ? annual && amount(monthly) > amount(annual) : !annual, `${name}: "${price}" read as monthly ${monthly}, annual ${annual}`);
  }
  // Max and Ultra API credits can't pay for Claude Code on the plan (Claude support article 11145838), so a plan note
  // that offers credits says so. Usage credits, in any case, are exempt on every row: they pay for use past the plan's
  // limits, Claude Code included (17154008 calls that extra usage), so the qualifier would be false there. "API usage
  // credits", 11145838's phrase for Console API credits, is not exempt.
  const credits = block.split('\n').filter((line) => /credit/i.test(line.replace(/(?<!API )usage credits/gi, '')));
  assert.ok(credits.every((line) => /(?:don[’']t|do not) cover Claude Code|can[’']t be used in Claude Code/.test(line)), 'a plan note offers API credits without saying they do not cover Claude Code usage');
  // The footnote under the table quotes both support articles behind that qualifier, each beside its own link, and
  // keeps where the claude -p exception stops. Literals copied from the articles as captured on 2026-11-08, in page order.
  const footnote = prose.match(/<p[^>]*>The Max and Ultra API credits[\s\S]*?<\/p>/)?.[0] ?? assert.fail('API credits footnote not found');
  let at = -1;
  for (const text of [
    '“Monthly API credits included with the Max plan can’t be used in Claude Code or the Claude apps, including for usage credits”',
    'href="https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-max-or-ultra-plan"',
    'which says the same of Ultra',
    '“API credits cover <code>claude -p</code> and the Claude Agent SDK when you run them yourself with an API key from your linked Claude Console organization”',
    '“Runs started by the Claude Code GitHub Action, an IDE extension or the Claude desktop app count as Claude Code usage, so API credits don\'t cover them, even with <code>-p</code>”',
    'href="https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans"',
  ]) {
    const next = footnote.indexOf(text, at + 1);
    assert.ok(next > at, `the API credits footnote lost ${text}, or it moved away from its article`);
    at = next;
  }
  assert.doesNotMatch(page, /still the only current Haiku|the current top Opus|is now the default on Claude Max/);
  for (const model of ['Fable 5.1', 'Opus 5.5', 'Sonnet 5.5', 'Haiku 5.5 (prompts up to 100K tokens)']) {
    const row = block.split('\n').find((line) => line.includes(`model: '${model}',`)) ?? '';
    assert.match(row, /input: '\$\d[\d.]*', output: '\$\d[\d.]*'/, `no API row with input and output prices for ${model}`);
  }
  // Each prose price reads the row of the model or plan its sentence names: "Opus 5.5 at {rate('Opus 5 (legacy)')}" is a stale price.
  // The search runs on the page with whitespace collapsed, so wrapping a paragraph does not change the answer.
  const flat = page.replace(/\s+/g, ' ');
  const label = /\b(?:(?:Fable|Opus|Sonnet|Haiku|Mythos) \d(?:\.\d)?|Free|Pro|Max|Ultra|Team|Enterprise)\b/g;
  const reads = [...flat.matchAll(/\{(rate|plan)\((['"`])(.+?)\2\)/g)];
  assert.ok(reads.length, 'no rate() or plan() reads found');
  for (const read of reads) {
    const from = Math.max(...['<p', '`', '. '].map((mark) => flat.lastIndexOf(mark, read.index)));
    const after = flat.slice(read.index + read[0].length).split(/[`?]|\. |<\/p>/)[0];
    const named = flat.slice(from, read.index).replace(/<[^>]+>/g, '').match(label)?.at(-1) ?? after.replace(/<[^>]+>/g, '').match(label)?.[0];
    assert.ok(named && (read[3] === named || read[3].startsWith(`${named} `)), `"${named}" reads ${read[1]}('${read[3]}')`);
  }
});
