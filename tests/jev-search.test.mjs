import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  DEFAULT_SEARCH_CLI_PATH,
  MAX_CANDIDATES,
  invokeSearchCli,
  rankLocalCandidates,
  runCuratedSearch,
} from '../scripts/jev-search.mjs';

const fixtures = JSON.parse(await readFile(new URL('./fixtures/jev-search.json', import.meta.url), 'utf8'));

test('frozen authored queries retain deterministic top result and bounded candidate recall', async () => {
  const rows = [];
  for (const fixture of fixtures) {
    const ranked = await rankLocalCandidates(fixture.query);
    const hrefs = ranked.ranked.map(({ href }) => href);
    assert.equal(ranked.deterministicTopHref, fixture.expectedTopHref, fixture.id);
    assert.ok(ranked.candidates.length <= MAX_CANDIDATES, fixture.id);
    assert.ok(hrefs.includes(fixture.expectedHref), fixture.id);
    rows.push({
      id: fixture.id,
      deterministicTopHref: ranked.deterministicTopHref,
      candidateCount: ranked.candidates.length,
      recalled: hrefs.includes(fixture.expectedHref),
    });
  }
  assert.ok(rows.every(({ recalled }) => recalled));
  assert.equal('N/A', 'N/A', 'Jev mock report accuracy is intentionally not claimed');
});

test('ranked packet has exactly bounded opaque candidates and no provider-controlled paths', async () => {
  const ranked = await rankLocalCandidates('html live artifact');
  assert.equal(ranked.candidates.length, MAX_CANDIDATES);
  for (const candidate of ranked.candidates) {
    assert.deepEqual(Object.keys(candidate), ['id', 'title', 'summary']);
    assert.match(candidate.id, /^c[0-9a-z]{1,2}$/);
    assert.equal('href' in candidate, false);
    assert.equal('path' in candidate, false);
    assert.equal('url' in candidate, false);
  }
});

test('empty and unknown queries abstain locally without spawning the shared CLI', async () => {
  let calls = 0;
  const spawnImpl = () => {
    calls += 1;
    throw new Error('should not spawn');
  };
  const empty = await runCuratedSearch(['--query', ''], { spawnImpl });
  const unknown = await runCuratedSearch(['--query', 'zzzznothingmatches'], { spawnImpl });
  assert.equal(empty.exitCode, 0);
  assert.equal(empty.result.status, 'abstained');
  assert.equal(empty.result.reason, 'empty_query');
  assert.equal(unknown.exitCode, 0);
  assert.equal(unknown.result.status, 'abstained');
  assert.equal(unknown.result.reason, 'no_matches');
  assert.equal(calls, 0);
});

function fakeChild(result, code = 0, output = JSON.stringify(result)) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.stdin = {
    end(value) {
      child.packet = JSON.parse(value);
      queueMicrotask(() => {
        child.stdout.emit('data', output);
        child.emit('close', code);
      });
    },
  };
  child.kill = () => {};
  return child;
}

test('inspect mode preserves the fixed result with an injected child', async () => {
  const result = await runCuratedSearch(['--query', 'permissions sandbox'], {
    spawnImpl: () => fakeChild({
      status: 'prepared',
      mode: 'inspect',
      source: 'none',
      selectedId: null,
      reason: 'inspect_only',
      nextStep: 'Review the finite candidate set manually; no provider decision was requested.',
      attempts: 0,
      redactions: 0,
    }),
  });
  assert.equal(result.exitCode, 0);
  assert.equal(result.result.status, 'prepared');
  assert.equal(result.result.mode, 'inspect');
  assert.equal(result.result.selectedId, null);
  assert.equal(result.result.href, null);
  assert.equal(result.result.source, 'none');
  assert.equal(result.result.candidateCount, 2);
  assert.equal(result.result.deterministicTopHref, '/chapters/15-permissions/');
  assert.match(DEFAULT_SEARCH_CLI_PATH, /\.codex\/skills\/jev-review\/scripts\/search-cli\.mjs$/);
});

test('mock mode preserves abstention with an injected child', async () => {
  const result = await runCuratedSearch(['--mock', '--query', 'permissions sandbox'], {
    spawnImpl: () => fakeChild({
      status: 'ok',
      mode: 'mock',
      source: 'mock',
      selectedId: null,
      reason: 'mock_abstention',
      nextStep: 'Review the finite candidate set manually; mock mode never selects a candidate.',
      attempts: 0,
      redactions: 0,
    }),
  });
  assert.equal(result.exitCode, 0);
  assert.equal(result.result.status, 'abstained');
  assert.equal(result.result.mode, 'mock');
  assert.equal(result.result.reason, 'mock_abstention');
  assert.equal(result.result.selectedId, null);
  assert.equal(result.result.href, null);
});

test('installed CLI acceptance is opt in and covers inspect plus mock', { skip: process.env.JEV_SEARCH_INSTALLED_ACCEPTANCE !== '1' }, async () => {
  const inspect = await runCuratedSearch(['--query', 'permissions sandbox']);
  assert.equal(inspect.exitCode, 0);
  assert.equal(inspect.result.status, 'prepared');
  assert.equal(inspect.result.mode, 'inspect');
  assert.equal(inspect.result.reason, 'inspect_only');
  assert.equal(inspect.result.selectedId, null);
  assert.equal(inspect.result.href, null);

  const mock = await runCuratedSearch(['--mock', '--query', 'permissions sandbox']);
  assert.equal(mock.exitCode, 0);
  assert.equal(mock.result.status, 'abstained');
  assert.equal(mock.result.mode, 'mock');
  assert.equal(mock.result.reason, 'mock_abstention');
  assert.equal(mock.result.selectedId, null);
  assert.equal(mock.result.href, null);
});

test('an explicitly missing CLI path fails closed within the child bound', async () => {
  const result = await runCuratedSearch([
    '--query', 'permissions sandbox',
    '--cli', '/definitely/missing/jev-search-cli.mjs',
    '--timeout-ms', '1000',
  ]);
  assert.equal(result.exitCode, 2);
  assert.equal(result.result.status, 'unavailable');
  assert.ok(['cli_exit', 'timeout'].includes(result.result.reason));
  assert.equal(result.result.href, null);
});

test('offline child selections abstain even when the child reports a matching mode', async () => {
  for (const [args, mode] of [
    [['--query', 'permissions sandbox'], 'inspect'],
    [['--mock', '--query', 'permissions sandbox'], 'mock'],
  ]) {
    const result = await runCuratedSearch(args, {
      spawnImpl: () => fakeChild({
        status: 'ok',
        mode,
        source: mode === 'mock' ? 'mock' : 'none',
        selectedId: 'c1',
        reason: 'selected_candidate',
        nextStep: 'Should never be used offline.',
        attempts: 0,
        redactions: 0,
      }),
    });
    assert.equal(result.exitCode, 0, mode);
    assert.equal(result.result.status, 'abstained', mode);
    assert.equal(result.result.reason, 'offline_selection', mode);
    assert.equal(result.result.selectedId, null, mode);
    assert.equal(result.result.href, null, mode);
  }
});

test('mismatched child mode abstains before resolving a live selection', async () => {
  const result = await runCuratedSearch(
    ['--live', '--consent', '--query', 'permissions sandbox'],
    {
      spawnImpl: () => fakeChild({
        status: 'ok',
        mode: 'mock',
        source: 'mock',
        selectedId: 'c1',
        reason: 'selected_candidate',
        nextStep: 'Should never cross modes.',
        attempts: 0,
        redactions: 0,
      }),
      env: { TYPESAFE_API_KEY: 'apikey_test_only' },
    },
  );
  assert.equal(result.exitCode, 0);
  assert.equal(result.result.status, 'abstained');
  assert.equal(result.result.reason, 'mode_mismatch');
  assert.equal(result.result.selectedId, null);
  assert.equal(result.result.href, null);
});

test('malformed live source and reason tuples abstain before resolving a known ID', async () => {
  for (const tuple of [
    { source: 'none', reason: 'selected_candidate' },
    { source: 'model', reason: 'inspect_only' },
  ]) {
    const result = await runCuratedSearch(
      ['--live', '--consent', '--query', 'permissions sandbox'],
      {
        spawnImpl: () => fakeChild({
          status: 'ok',
          mode: 'live',
          ...tuple,
          selectedId: 'c1',
          nextStep: 'Malformed tuple.',
          attempts: 0,
          redactions: 0,
        }),
        env: { TYPESAFE_API_KEY: 'apikey_test_only' },
      },
    );
    assert.equal(result.exitCode, 0, JSON.stringify(tuple));
    assert.equal(result.result.status, 'abstained', JSON.stringify(tuple));
    assert.equal(result.result.reason, 'invalid_selection_result', JSON.stringify(tuple));
    assert.equal(result.result.selectedId, null, JSON.stringify(tuple));
    assert.equal(result.result.href, null, JSON.stringify(tuple));
  }
});

test('accepted IDs resolve only through the local candidate map', async () => {
  let observed;
  const childResult = {
    status: 'ok',
    mode: 'live',
    source: 'model',
    selectedId: 'c1',
    reason: 'selected_candidate',
    nextStep: 'Confirm locally.',
    attempts: 1,
    redactions: 0,
  };
  const spawnImpl = (nodePath, args, options) => {
    observed = { nodePath, args, options };
    const child = fakeChild(childResult);
    observed.child = child;
    return child;
  };
  const accepted = await runCuratedSearch(
    ['--live', '--consent', '--cli', '/tmp/operator-approved-search-cli.mjs', '--query', 'permissions sandbox'],
    { spawnImpl, env: { TYPESAFE_API_KEY: 'apikey_test_only' } },
  );
  assert.equal(accepted.exitCode, 0);
  assert.equal(accepted.result.status, 'selected');
  assert.equal(accepted.result.selectedId, 'c1');
  assert.equal(accepted.result.href, '/chapters/15-permissions/');
  assert.deepEqual(Object.keys(observed.child.packet), ['schemaVersion', 'query', 'candidates']);
  assert.equal(observed.child.packet.schemaVersion, 1);
  assert.equal(observed.child.packet.query, 'permissions sandbox');
  assert.equal(observed.child.packet.candidates.length, 2);
  for (const candidate of observed.child.packet.candidates) {
    assert.deepEqual(Object.keys(candidate), ['id', 'title', 'summary']);
    assert.doesNotMatch(JSON.stringify(candidate), /href|path|url/i);
  }
  assert.deepEqual(observed.args.slice(1), ['--live', '--consent', '--input', '-']);
  assert.equal(observed.options.shell, false);
  assert.equal(observed.options.env.TYPESAFE_API_KEY, 'apikey_test_only');
  assert.deepEqual(Object.keys(observed.options), ['cwd', 'shell', 'env', 'stdio']);
  assert.deepEqual(Object.keys(observed.options.stdio), ['0', '1', '2']);
  assert.doesNotMatch(JSON.stringify(accepted.result), /apikey_test_only/);

  const unknown = await runCuratedSearch(
    ['--live', '--consent', '--cli', '/tmp/operator-approved-search-cli.mjs', '--query', 'permissions sandbox'],
    {
      spawnImpl: () => fakeChild({ ...childResult, selectedId: 'c99' }),
      env: { TYPESAFE_API_KEY: 'apikey_test_only' },
    },
  );
  assert.equal(unknown.exitCode, 0);
  assert.equal(unknown.result.status, 'abstained');
  assert.equal(unknown.result.reason, 'unknown_selection');
  assert.equal(unknown.result.selectedId, null);
  assert.equal(unknown.result.href, null);
});

test('the child process output and timeout are bounded without exposing stderr', async () => {
  const oversized = await invokeSearchCli(
    { schemaVersion: 1, query: 'permissions sandbox', candidates: [{ id: 'c1', title: 'x', summary: 'y' }] },
    {
      mode: 'inspect',
      spawnImpl: () => fakeChild({}, 0, 'x'.repeat(33 * 1024)),
      env: { TYPESAFE_API_KEY: 'apikey_test_only' },
    },
  );
  assert.deepEqual(oversized, { ok: false, reason: 'stdout_too_large' });
  assert.doesNotMatch(JSON.stringify(oversized), /apikey_test_only/);

  let timedChild;
  const timeout = await invokeSearchCli(
    { schemaVersion: 1, query: 'permissions sandbox', candidates: [{ id: 'c1', title: 'x', summary: 'y' }] },
    {
      mode: 'inspect',
      timeoutMs: 250,
      spawnImpl: () => {
        timedChild = new EventEmitter();
        timedChild.stdout = new EventEmitter();
        timedChild.stderr = new EventEmitter();
        timedChild.stdin = { end() {} };
        timedChild.kill = () => {};
        return timedChild;
      },
      env: { TYPESAFE_API_KEY: 'apikey_test_only' },
    },
  );
  assert.deepEqual(timeout, { ok: false, reason: 'timeout' });
  assert.ok(timedChild);
});

test('live consent is the only mode that forwards consent flags to the child', async () => {
  let observed;
  const spawnImpl = (nodePath, args, options) => {
    observed = { nodePath, args, options };
    return fakeChild({
      status: 'unavailable',
      mode: 'live',
      source: 'none',
      selectedId: null,
      reason: 'consent_required',
      nextStep: 'Consent required.',
      attempts: 0,
      redactions: 0,
    });
  };
  const result = await runCuratedSearch(
    ['--live', '--consent', '--cli', '/tmp/operator-approved-search-cli.mjs', '--query', 'mcp setup'],
    { spawnImpl, env: { TYPESAFE_API_KEY: 'apikey_test_only' } },
  );
  assert.equal(result.exitCode, 2);
  assert.equal(result.result.status, 'unavailable');
  assert.deepEqual(observed.args.slice(1), ['--live', '--consent', '--input', '-']);
  assert.equal(observed.options.shell, false);
});
