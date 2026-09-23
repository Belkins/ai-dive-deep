#!/usr/bin/env node
/**
 * Local-only Jev consumer for the public AI Dive Deep search catalog.
 *
 * Ranking and href ownership stay local. The installed shared CLI receives
 * only the bounded query and ranked { id, title, summary } candidates.
 */
import { spawn as nodeSpawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const MAX_CANDIDATES = 12;
export const MAX_CHILD_STDOUT_BYTES = 32 * 1024;
export const MAX_CHILD_STDERR_BYTES = 8 * 1024;
export const DEFAULT_CHILD_TIMEOUT_MS = 7_000;
export const DEFAULT_SEARCH_CLI_PATH = join(
  homedir(),
  '.codex',
  'skills',
  'jev-review',
  'scripts',
  'search-cli.mjs',
);

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEARCH_SOURCE = resolve(REPO_ROOT, 'src/lib/search.ts');
const CATALOG_SOURCE = resolve(REPO_ROOT, 'src/lib/search-catalog.ts');
const CATALOG_DEPENDENCIES = {
  chapters: resolve(REPO_ROOT, 'src/lib/chapters.ts'),
  glossary: resolve(REPO_ROOT, 'src/lib/glossary.ts'),
  setup: resolve(REPO_ROOT, 'src/lib/setup.ts'),
  'research-notes': resolve(REPO_ROOT, 'src/lib/research-notes.ts'),
};
const VALID_STATUSES = new Set(['prepared', 'ok', 'unavailable', 'error']);
const VALID_SOURCES = new Set(['none', 'mock', 'transport', 'model', 'local-cli']);
const OPAQUE_ID_PATTERN = /^c[0-9a-z]{1,2}$/;

let runtimePromise;

function moduleUrl(source) {
  return 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
}

function transpile(source, fileName) {
  return ts.transpileModule(source, {
    fileName,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
}

async function importTranspiled(filePath) {
  const source = await readFile(filePath, 'utf8');
  return import(moduleUrl(transpile(source, filePath)));
}

async function importCatalog() {
  const dependencyUrls = {};
  for (const [name, filePath] of Object.entries(CATALOG_DEPENDENCIES)) {
    dependencyUrls[name] = moduleUrl(transpile(await readFile(filePath, 'utf8'), filePath));
  }
  let source = transpile(await readFile(CATALOG_SOURCE, 'utf8'), CATALOG_SOURCE);
  for (const [name, url] of Object.entries(dependencyUrls)) {
    source = source.replace(
      new RegExp("from ['\"]\\./" + name + "['\"]", 'g'),
      "from '" + url + "'",
    );
  }
  return import(moduleUrl(source));
}

async function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = Promise.all([importTranspiled(SEARCH_SOURCE), importCatalog()])
      .then(([search, catalog]) => ({ search, getPaletteItems: catalog.getPaletteItems }))
      .catch((error) => {
        runtimePromise = undefined;
        throw error;
      });
  }
  return runtimePromise;
}

function candidateSummary(item) {
  const summary = typeof item.subtitle === 'string' ? item.subtitle.trim() : '';
  return summary || 'Public playbook ' + item.type + ' entry.';
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export async function rankLocalCandidates(query, options = {}) {
  const { search, getPaletteItems } = options.runtime ?? await loadRuntime();
  const items = options.items ?? getPaletteItems(options.base ?? '');
  const index = options.index ?? search.createSearchIndex(items);
  const queryText = typeof query === 'string' ? query : '';
  const results = queryText.trim()
    ? search.searchItems(index, queryText)
    : [];
  const ranked = results.slice(0, MAX_CANDIDATES);
  const candidates = ranked.map((item, index) => ({
    id: 'c' + (index + 1).toString(36),
    title: item.title,
    summary: candidateSummary(item),
  }));
  const hrefById = new Map(ranked.map((item, index) => [
    'c' + (index + 1).toString(36),
    item.href,
  ]));
  return {
    query: queryText,
    ranked,
    candidates,
    hrefById,
    deterministicTopHref: ranked[0]?.href ?? null,
  };
}

function usageError() {
  throw new Error('usage');
}

export function parseArgs(argv = []) {
  let query;
  let mode = 'inspect';
  let consent = false;
  let cliPath = DEFAULT_SEARCH_CLI_PATH;
  let timeoutMs = DEFAULT_CHILD_TIMEOUT_MS;
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      help = true;
      continue;
    }
    if (arg === '--query') {
      if (index + 1 >= argv.length) usageError();
      query = argv[++index];
      continue;
    }
    if (arg === '--mock' || arg === '--live') {
      if (mode !== 'inspect') usageError();
      mode = arg.slice(2);
      continue;
    }
    if (arg === '--consent') {
      consent = true;
      continue;
    }
    if (arg === '--cli') {
      if (index + 1 >= argv.length || !argv[index + 1]) usageError();
      cliPath = resolve(argv[++index]);
      continue;
    }
    if (arg === '--timeout-ms') {
      if (index + 1 >= argv.length) usageError();
      timeoutMs = Number(argv[++index]);
      if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 250 || timeoutMs > 15_000) usageError();
      continue;
    }
    usageError();
  }

  if (help) return { help: true };
  if (typeof query !== 'string' || (consent && mode !== 'live')) usageError();
  return { query, mode, consent, cliPath, timeoutMs };
}

function localAbstention(mode, reason, ranked = null) {
  return {
    status: 'abstained',
    mode,
    source: 'local',
    selectedId: null,
    href: null,
    reason,
    candidateCount: ranked?.candidates.length ?? 0,
    candidates: ranked?.candidates ?? [],
    deterministicTopHref: ranked?.deterministicTopHref ?? null,
  };
}

function childProjection(child, mode) {
  if (!isRecord(child)) {
    return {
      reportedMode: null,
      projection: {
        status: 'unavailable',
        mode,
        source: 'local-cli',
        selectedId: null,
        reason: 'invalid_cli_result',
        nextStep: 'Choose manually; the installed search CLI did not return its fixed result shape.',
        attempts: 0,
        redactions: 0,
      },
    };
  }
  const status = VALID_STATUSES.has(child.status) ? child.status : 'error';
  const source = VALID_SOURCES.has(child.source) ? child.source : 'local-cli';
  return {
    reportedMode: typeof child.mode === 'string' ? child.mode : null,
    projection: {
      status,
      mode,
      source,
      selectedId: child.selectedId === null || typeof child.selectedId === 'string' ? child.selectedId : null,
      reason: typeof child.reason === 'string' ? child.reason : 'invalid_cli_result',
      nextStep: typeof child.nextStep === 'string' ? child.nextStep : undefined,
      attempts: Number.isSafeInteger(child.attempts) && child.attempts >= 0 ? child.attempts : 0,
      redactions: Number.isSafeInteger(child.redactions) && child.redactions >= 0 ? child.redactions : 0,
    },
  };
}

function resolveSelection(projected, ranked, requestedMode, consent, reportedMode) {
  if (typeof projected.selectedId !== 'string') {
    return {
      ...projected,
      status: ['prepared', 'unavailable', 'error'].includes(projected.status)
        ? projected.status
        : 'abstained',
      selectedId: null,
      href: null,
      reason: projected.reason || 'abstained',
    };
  }
  if (projected.status !== 'ok') {
    return {
      ...projected,
      selectedId: null,
      href: null,
      reason: projected.reason || 'unavailable',
    };
  }
  if (reportedMode !== requestedMode) {
    return {
      ...projected,
      status: 'abstained',
      selectedId: null,
      href: null,
      reason: 'mode_mismatch',
      nextStep: 'Choose manually; the installed search CLI reported a different mode.',
    };
  }
  if (requestedMode !== 'live' || consent !== true) {
    return {
      ...projected,
      status: 'abstained',
      selectedId: null,
      href: null,
      reason: 'offline_selection',
      nextStep: 'Choose manually; inspect and mock modes never select a candidate.',
    };
  }
  if (projected.source !== 'model' || projected.reason !== 'selected_candidate') {
    return {
      ...projected,
      status: 'abstained',
      selectedId: null,
      href: null,
      reason: 'invalid_selection_result',
      nextStep: 'Choose manually; the live advisory did not return its fixed selection result.',
    };
  }
  if (!OPAQUE_ID_PATTERN.test(projected.selectedId) || !ranked.hrefById.has(projected.selectedId)) {
    return {
      ...projected,
      status: 'abstained',
      selectedId: null,
      href: null,
      reason: 'unknown_selection',
      nextStep: 'Choose manually; the advisory selected an ID outside the local candidate set.',
    };
  }
  return {
    ...projected,
    status: 'selected',
    href: ranked.hrefById.get(projected.selectedId),
  };
}

export function invokeSearchCli(packet, options = {}) {
  const mode = options.mode ?? 'inspect';
  const cliPath = options.cliPath ?? DEFAULT_SEARCH_CLI_PATH;
  const timeoutMs = options.timeoutMs ?? DEFAULT_CHILD_TIMEOUT_MS;
  const spawnImpl = options.spawnImpl ?? nodeSpawn;
  const nodePath = options.nodePath ?? process.execPath;
  const args = [];
  if (mode === 'mock') args.push('--mock');
  if (mode === 'live') {
    args.push('--live');
    if (options.consent === true) args.push('--consent');
  }
  args.push('--input', '-');

  return new Promise((resolveResult) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timer;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolveResult(value);
    };
    const stop = (reason) => {
      try {
        child.kill('SIGKILL');
      } catch {
        // The process may already have exited.
      }
      finish({ ok: false, reason });
    };

    let child;
    try {
      child = spawnImpl(nodePath, [cliPath, ...args], {
        cwd: options.cwd ?? REPO_ROOT,
        shell: false,
        env: { ...(options.env ?? process.env) },
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch {
      finish({ ok: false, reason: 'spawn_error' });
      return;
    }

    timer = setTimeout(() => stop('timeout'), timeoutMs);
    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
      if (Buffer.byteLength(stdout) > MAX_CHILD_STDOUT_BYTES) stop('stdout_too_large');
    });
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
      if (Buffer.byteLength(stderr) > MAX_CHILD_STDERR_BYTES) stop('stderr_too_large');
    });
    child.on('error', () => finish({ ok: false, reason: 'spawn_error' }));
    child.on('close', (code) => {
      if (settled) return;
      if (code !== 0 && code !== 2) {
        finish({ ok: false, reason: 'cli_exit' });
        return;
      }
      let parsed;
      try {
        if (!stdout.trim() || Buffer.byteLength(stdout) > MAX_CHILD_STDOUT_BYTES) throw new Error('invalid');
        parsed = JSON.parse(stdout);
      } catch {
        finish({ ok: false, reason: 'invalid_cli_output' });
        return;
      }
      finish({ ok: true, code, result: parsed });
    });

    try {
      child.stdin?.end(JSON.stringify(packet));
    } catch {
      stop('stdin_error');
    }
  });
}

export async function runCuratedSearch(argv = process.argv.slice(2), dependencies = {}) {
  let args;
  try {
    args = parseArgs(argv);
  } catch {
    return { exitCode: 2, result: { status: 'error', reason: 'usage' } };
  }
  if (args.help) {
    return {
      exitCode: 0,
      result: {
        status: 'help',
        usage: 'node scripts/jev-search.mjs --query "..." [--mock | --live --consent] [--cli path]',
      },
    };
  }

  let ranked;
  try {
    ranked = await rankLocalCandidates(args.query, { runtime: dependencies.runtime });
  } catch {
    return {
      exitCode: 2,
      result: {
        status: 'unavailable',
        mode: args.mode,
        source: 'local',
        selectedId: null,
        href: null,
        reason: 'catalog_unavailable',
      },
    };
  }
  if (!args.query.trim()) return { exitCode: 0, result: localAbstention(args.mode, 'empty_query', ranked) };
  if (ranked.ranked.length === 0) return { exitCode: 0, result: localAbstention(args.mode, 'no_matches', ranked) };

  const packet = {
    schemaVersion: 1,
    query: args.query,
    candidates: ranked.candidates,
  };
  const child = await invokeSearchCli(packet, {
    mode: args.mode,
    consent: args.consent,
    cliPath: args.cliPath,
    timeoutMs: args.timeoutMs,
    spawnImpl: dependencies.spawnImpl,
    nodePath: dependencies.nodePath,
    cwd: dependencies.cwd,
    env: dependencies.env,
  });
  if (!child.ok) {
    return {
      exitCode: 2,
      result: {
        status: 'unavailable',
        mode: args.mode,
        source: 'local-cli',
        selectedId: null,
        href: null,
        reason: child.reason,
        candidateCount: ranked.candidates.length,
        candidates: ranked.candidates,
        deterministicTopHref: ranked.deterministicTopHref,
      },
    };
  }

  const { projection, reportedMode } = childProjection(child.result, args.mode);
  const resolved = resolveSelection(projection, ranked, args.mode, args.consent, reportedMode);
  return {
    exitCode: resolved.status === 'unavailable' || resolved.status === 'error' ? 2 : 0,
    result: {
      ...resolved,
      candidateCount: ranked.candidates.length,
      candidates: ranked.candidates,
      deterministicTopHref: ranked.deterministicTopHref,
    },
  };
}

export async function main(argv = process.argv.slice(2)) {
  const { exitCode, result } = await runCuratedSearch(argv);
  process.stdout.write(JSON.stringify(result) + '\n');
  process.exitCode = exitCode;
  return exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
