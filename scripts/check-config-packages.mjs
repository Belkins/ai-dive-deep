#!/usr/bin/env node
// check-config-packages.mjs — do the npm packages and hosted server addresses that the
// book tells a reader to run still exist?
//
// The risk this catches: config blocks and figures name packages a reader pastes into
// `.mcp.json` or a terminal (`npx -y @vendor/mcp-server`). A vendor renames, deprecates or
// never published the package, the npm registry answers 404, and the page keeps teaching
// it. check-external-links.py covers links in prose; nothing asked the registry. A hand
// audit found config blocks and two figures naming packages that answer 404.
//
// Report-only. It never runs a package and never edits a page. NOT in prebuild, build or
// the deploy job on purpose: it makes live network calls, and a vendor outage must never
// block a deploy. Run it by hand (`npm run check:packages`) or from the weekly workflow
// (.github/workflows/package-check.yml).
//
// Extracts:
//   packages  npx [-y] PKG, bunx PKG, pnpm dlx PKG, yarn dlx PKG, npm install|i|add PKG...,
//             pnpm add, yarn add, bun add; JSON or TOML config with "command": "npx"
//             (or bunx, pnpm/yarn dlx) and an args list.
//   addresses "url" (or serverUrl, server_url) values in MCP config blocks, URLs in a
//             config args list, and URLs on a `claude mcp add` command.
//   Figures (SVG) are read as drawn: <text> elements on one baseline are joined into a line.
//
// Classification:
//   package  missing (registry 404) | deprecated (latest version's `deprecated` field) |
//            archived (registry names a GitHub repository whose public API says archived;
//            best effort, never a failure when GitHub rate-limits) | fine
//   address  gone (DNS name not found, 404, 410) | alive (2xx, 3xx, and any other 4xx: a
//            server that refuses a bare GET with 400, 401, 403 or 405 still exists)
//   Network trouble (timeout, 408, 425, 429, 5xx, other errors) is `unknown`, listed apart,
//   never broken.
//
// Allowlist: scripts/config-packages-allowlist.txt, one `name  # reason` per line, for
// teaching placeholders. An entry that no longer occurs in the sources fails the check.
//
// Exit: 0 nothing broken (unknowns allowed) · 1 something missing, deprecated, archived,
// gone, or a stale allowlist entry · 2 the check could not run (no candidates found,
// malformed allowlist, crash).
//
// Usage: node scripts/check-config-packages.mjs [--json report.json] [--root DIR] [--offline]
//   The readable summary (Markdown) goes to stdout. --offline extracts only (no network).

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Every source whose text reaches a reader. `**` = any depth.
export const SCAN = [
  { dir: 'src/content/chapters', exts: ['.mdx', '.md'], deep: false },
  { dir: 'src/pages', exts: ['.astro', '.mdx', '.md', '.ts', '.tsx'], deep: true },
  { dir: 'src/widgets', exts: ['.tsx', '.ts', '.jsx', '.astro'], deep: true },
  { dir: 'src/components', exts: ['.astro', '.tsx', '.ts', '.jsx'], deep: true },
  // Snippets, glossary, changelog and catalog text render on pages (/resources, /glossary).
  { dir: 'src/lib', exts: ['.ts', '.tsx'], deep: true },
  // Figures: chapter screens and any other drawn SVG the site serves.
  { dir: 'public', exts: ['.svg'], deep: true },
  { dir: 'assets', exts: ['.svg'], deep: true },
];
export const SCAN_GLOBS = SCAN.map((s) => `${s.dir}/${s.deep ? '**/' : ''}*{${s.exts.join(',')}}`);

export const ALLOWLIST = 'scripts/config-packages-allowlist.txt';
// Generic client name: no person, address or project in it.
export const USER_AGENT = 'package-existence-check/1.0 (node)';
const REGISTRY = 'https://registry.npmjs.org/';
const GITHUB_API = 'https://api.github.com/repos/';
const TIMEOUT_MS = 15000;
const SPACING_MS = 400;

// ---------------------------------------------------------------- extraction

const NAME_RE = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/;
const PLACEHOLDER_RE = /\$\{|\$[A-Z_]|<|>|\*\*\*|\.\.\./;
const LOOPBACK_RE = /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?:[:/]|$)/i;

/** Split `@scope/name@1.2` into the registry name; null when it is not a package name. */
export function packageName(token) {
  let t = token.replace(/^["'`(]+/, '').replace(/[,.;:)"'`\]}]+$/, '');
  if (!t || PLACEHOLDER_RE.test(t)) return null;
  const at = t.indexOf('@', t.startsWith('@') ? 1 : 0);
  if (at > 0) t = t.slice(0, at);
  return NAME_RE.test(t) ? t : null;
}

function cleanUrl(url) {
  return url.replace(/[,.;:)"'`\]}>]+$/, '');
}

function hostedUrl(url) {
  const u = cleanUrl(url);
  if (PLACEHOLDER_RE.test(u) || LOOPBACK_RE.test(u)) return null;
  try {
    return new URL(u).hostname.includes('.') ? u : null;
  } catch {
    return null;
  }
}

// Template literals and HTML escape quotes; undo that so one set of patterns reads all.
// Every replacement keeps newlines, so offsets still map to the right line.
function normalize(text) {
  return text
    .replace(/\\(["'`])/g, '$1')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * Read an SVG as drawn: consecutive <text> elements on one baseline (same y) join into
 * one line, mapped to the source line of its first element. A run breaks when y changes,
 * so a second panel drawn later at the same height stays a line of its own.
 */
export function svgToText(svg) {
  const groups = [];
  let prevY;
  const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  let m;
  while ((m = re.exec(svg))) {
    const y = /\by="([^"]*)"/.exec(m[1])?.[1];
    const x = Number(/\bx="([^"]*)"/.exec(m[1])?.[1] ?? 0);
    const inner = m[2].replace(/<[^>]+>/g, '');
    const line = svg.slice(0, m.index).split('\n').length;
    let g = y !== undefined && y === prevY ? groups[groups.length - 1] : undefined;
    if (!g) {
      g = { line, parts: [] };
      groups.push(g);
    }
    prevY = y;
    g.parts.push({ x, text: inner });
  }
  return {
    text: groups.map((g) => g.parts.sort((a, b) => a.x - b.x).map((p) => p.text).join('')).join('\n'),
    lines: groups.map((g) => g.line),
  };
}

const SHELL_RE =
  /(?<![\w./@-])(npx|bunx|pnpm[ \t]+dlx|yarn[ \t]+dlx|npm[ \t]+(?:install|i|add)|pnpm[ \t]+(?:add|install|i)|yarn[ \t]+(?:global[ \t]+)?add|bun[ \t]+(?:add|install|i))(?=[ \t])([^\n]*)/g;
// What may stand right before a command: nothing on the line, or code-ish punctuation, or
// a word that runs one. Prose ("a husky install from some npx run") is refused.
// `)` covers a shell `case` arm (`*.test.*) npx vitest run`).
const COMMAND_PREFIX = /(?:^|[`'"({[>$;&|:=)]|\b(?:sudo|RUN|run|exec|then|do))$/;
const RUN_ONE = /^(?:npx|bunx|pnpm\s+dlx|yarn\s+dlx)$/;
const VALUE_FLAGS = new Set(['--registry', '--prefix', '--tag', '-w', '--workspace', '--cache', '--node-options']);

function commandTokens(rest) {
  const cut = rest.search(/[`'"<)\]}#;|]|&&/);
  return (cut >= 0 ? rest.slice(0, cut) : rest).trim().split(/\s+/).filter(Boolean);
}

function lineOf(starts, index) {
  let lo = 0, hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= index) lo = mid; else hi = mid - 1;
  }
  return lo + 1;
}

/**
 * Extract candidates from one source's text.
 * @returns {{kind:'package'|'address', name:string, line:number, syntax:string}[]}
 */
export function extract(text, { svg = false } = {}) {
  let body = text;
  let map = null;
  if (svg) {
    const read = svgToText(text);
    body = read.text;
    map = read.lines;
  }
  body = normalize(body);
  const starts = [0];
  for (let i = 0; i < body.length; i++) if (body[i] === '\n') starts.push(i + 1);
  const at = (index) => {
    const l = lineOf(starts, index);
    return map ? map[l - 1] : l;
  };
  const out = [];
  const seen = new Set();
  const add = (kind, name, index, syntax) => {
    const line = at(index);
    const key = `${kind}|${name}|${line}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ kind, name, line, syntax });
  };

  // (a) shell commands
  for (const m of body.matchAll(SHELL_RE)) {
    const lineStart = body.lastIndexOf('\n', m.index) + 1;
    const before = body.slice(lineStart, m.index).trimEnd();
    if (!COMMAND_PREFIX.test(before)) continue;
    const verb = m[1].replace(/\s+/g, ' ');
    let rest = m[2];
    let end = m.index + m[0].length;
    while (/\\\s*$/.test(rest) && end < body.length) {
      const next = body.indexOf('\n', end + 1);
      const nextLine = body.slice(end + 1, next < 0 ? body.length : next);
      rest = rest.replace(/\\\s*$/, ' ') + nextLine;
      end = next < 0 ? body.length : next;
    }
    const tokens = commandTokens(rest);
    if (RUN_ONE.test(verb)) {
      // With -p/--package the packages are named by the flag and the next word is a command.
      let named = false;
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t === '-p' || t === '--package') {
          const p = packageName(tokens[i + 1] ?? '');
          if (p) add('package', p, m.index, verb);
          named = true;
          i++;
          continue;
        }
        if (t.startsWith('--package=')) {
          const p = packageName(t.slice(10));
          if (p) add('package', p, m.index, verb);
          named = true;
          continue;
        }
        if (t.startsWith('-')) continue;
        if (named) break;
        const p = packageName(t);
        if (p) add('package', p, m.index, verb);
        break;
      }
    } else {
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (VALUE_FLAGS.has(t)) { i++; continue; }
        if (t.startsWith('-')) continue;
        const p = packageName(t);
        if (!p) break;
        add('package', p, m.index, verb);
        if (/,$/.test(t)) break;
      }
    }
  }

  // (a) config blocks: "command": "npx" + "args": [...]  (JSON, JS object or TOML)
  const CMD_RE = /["']?\bcommand["']?\s*[:=]\s*["'](npx|bunx|pnpm|yarn)["']/g;
  for (const m of body.matchAll(CMD_RE)) {
    const from = m.index + m[0].length;
    let window = body.slice(from, from + 800);
    const nextCmd = window.search(/["']?\bcommand["']?\s*[:=]/);
    if (nextCmd >= 0) window = window.slice(0, nextCmd);
    const argsM = /["']?\bargs["']?\s*[:=]\s*\[([\s\S]*?)\]/.exec(window);
    if (!argsM) continue;
    const listStart = from + argsM.index + argsM[0].indexOf('[') + 1;
    const strings = [...argsM[1].matchAll(/"((?:[^"\\]|\\.)*)"|'([^']*)'/g)].map((s) => ({
      value: s[1] ?? s[2],
      index: listStart + s.index,
    }));
    let i = 0;
    if (m[1] === 'pnpm' || m[1] === 'yarn') {
      if (strings[0]?.value !== 'dlx') continue;
      i = 1;
    }
    let pkgDone = false;
    for (; i < strings.length; i++) {
      const { value, index } = strings[i];
      if (!pkgDone) {
        if (value === '-p' || value === '--package') continue;
        if (value.startsWith('-')) continue;
        const p = packageName(value);
        if (p) add('package', p, index, `config ${m[1]} args`);
        pkgDone = true;
        continue;
      }
      if (/^https?:\/\//.test(value)) {
        const u = hostedUrl(value);
        if (u) add('address', u, index, 'config args url');
      }
    }
  }

  // (b) hosted server addresses in config blocks
  const URL_KEY_RE = /["']?\b(?:url|serverUrl|server_url)["']?\s*[:=]\s*["'](https?:\/\/[^"'\s]+)["']/g;
  for (const m of body.matchAll(URL_KEY_RE)) {
    const near = body.slice(Math.max(0, m.index - 300), m.index + 300);
    const header = body.slice(Math.max(0, m.index - 1500), m.index);
    const isMcp =
      /mcpServers|mcp_servers|\[mcp/.test(header) ||
      /["']?\btype["']?\s*[:=]\s*["'](?:http|sse|streamable-http|streamableHttp)["']/.test(near);
    if (!isMcp) continue;
    const u = hostedUrl(m[1]);
    if (u) add('address', u, m.index, 'config url');
  }

  // (b) claude mcp add [--transport http] NAME URL
  for (const m of body.matchAll(/\bclaude[ \t]+mcp[ \t]+add\b((?:[^\n]*\\[ \t]*\n)*[^\n]*)/g)) {
    const rest = m[1].replace(/<\/?[a-z][^>]*>/gi, ' ');
    for (const u of rest.matchAll(/https?:\/\/[^\s"'`<>]+/g)) {
      const url = hostedUrl(u[0]);
      if (url) add('address', url, m.index, 'claude mcp add');
    }
  }
  return out;
}

function walk(root, dir, exts, deep) {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const rel = join(dir, entry.name);
      if (entry.isDirectory()) return deep && entry.name !== 'node_modules' ? walk(root, rel, exts, deep) : [];
      return exts.includes(extname(entry.name)) ? [rel] : [];
    });
}

/** Scan every reader-facing source. Returns per-file candidates and per-type counts. */
export function scan(root) {
  const files = [...new Set(SCAN.flatMap((s) => walk(root, s.dir, s.exts, s.deep)))];
  const candidates = [];
  const perType = {};
  for (const file of files) {
    const ext = extname(file);
    const t = (perType[ext] ??= { files: 0, filesWithCandidates: 0, packages: 0, addresses: 0 });
    t.files++;
    const found = extract(readFileSync(join(root, file), 'utf8'), { svg: ext === '.svg' });
    if (found.length) t.filesWithCandidates++;
    for (const c of found) {
      if (c.kind === 'package') t.packages++; else t.addresses++;
      candidates.push({ ...c, file });
    }
  }
  return { files, candidates, perType };
}

/** Parse the allowlist: `name  # reason`. Throws on an entry without a reason. */
export function parseAllowlist(text) {
  const entries = new Map();
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const hash = line.indexOf('#');
    const name = (hash < 0 ? line : line.slice(0, hash)).trim();
    const reason = hash < 0 ? '' : line.slice(hash + 1).trim();
    if (!name || !reason) throw new Error(`allowlist line ${i + 1}: needs "name  # reason"`);
    entries.set(name, reason);
  });
  return entries;
}

// ---------------------------------------------------------------- classification

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(fetchImpl, url, accept) {
  return fetchImpl(url, {
    method: 'GET',
    redirect: 'manual',
    headers: { 'User-Agent': USER_AGENT, Accept: accept },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

function networkReason(err) {
  const code = err?.cause?.code ?? err?.code;
  if (err?.name === 'TimeoutError' || err?.name === 'AbortError') return 'timeout';
  return code ? `network error ${code}` : `network error ${err?.message ?? err}`;
}

/** owner/repo from a registry `repository` field, when it is on GitHub. */
export function githubRepo(repository) {
  const url = typeof repository === 'string' ? repository : repository?.url;
  if (!url) return null;
  let m = /github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/#?]|$)/.exec(url);
  if (!m) m = /^(?:github:)?([\w.-]+)\/([\w.-]+?)(?:\.git)?$/.exec(url);
  return m ? `${m[1]}/${m[2]}` : null;
}

/**
 * Ask the registry about one package; best-effort archived check on GitHub.
 * status: missing | deprecated | archived | fine | unknown
 */
export async function classifyPackage(name, { fetchImpl = fetch, githubCache = new Map(), pause = sleep } = {}) {
  const enc = name.replace('/', '%2F');
  let res;
  try {
    res = await get(fetchImpl, `${REGISTRY}${enc}/latest`, 'application/json');
  } catch (err) {
    return { status: 'unknown', reason: networkReason(err) };
  }
  if (res.status === 404) {
    // Confirm on the package document: a package with no `latest` tag is not missing.
    await pause(SPACING_MS);
    let root;
    try {
      root = await get(fetchImpl, `${REGISTRY}${enc}`, 'application/vnd.npm.install-v1+json');
    } catch (err) {
      return { status: 'unknown', reason: `latest 404, package document: ${networkReason(err)}` };
    }
    if (root.status === 404) return { status: 'missing', http: 404, reason: 'the npm registry answers 404' };
    if (root.ok) return { status: 'unknown', http: 404, reason: 'package exists but has no latest version' };
    return { status: 'unknown', http: root.status, reason: `package document answered ${root.status}` };
  }
  if (res.status === 429 || res.status >= 500 || !res.ok) {
    return { status: 'unknown', http: res.status, reason: `registry answered ${res.status}` };
  }
  let doc;
  try {
    doc = await res.json();
  } catch {
    return { status: 'unknown', http: res.status, reason: 'registry answer was not JSON' };
  }
  const version = doc.version;
  if (typeof doc.deprecated === 'string' && doc.deprecated.trim()) {
    return { status: 'deprecated', http: 200, version, reason: doc.deprecated.trim() };
  }
  const repo = githubRepo(doc.repository);
  if (!repo) return { status: 'fine', http: 200, version, archivedCheck: 'no GitHub repository named' };
  if (!githubCache.has(repo)) {
    await pause(SPACING_MS);
    let verdict;
    try {
      const gh = await get(fetchImpl, `${GITHUB_API}${repo}`, 'application/vnd.github+json');
      if (gh.ok) {
        const body = await gh.json();
        verdict = body.archived === true ? 'archived' : 'not archived';
      } else if (gh.status === 403 || gh.status === 429) {
        verdict = `skipped: GitHub answered ${gh.status} (rate limit)`;
      } else {
        verdict = `skipped: GitHub answered ${gh.status}`;
      }
    } catch (err) {
      verdict = `skipped: ${networkReason(err)}`;
    }
    githubCache.set(repo, verdict);
  }
  const archivedCheck = githubCache.get(repo);
  if (archivedCheck === 'archived') {
    return { status: 'archived', http: 200, version, repository: repo, reason: `GitHub repository ${repo} is archived` };
  }
  return { status: 'fine', http: 200, version, repository: repo, archivedCheck };
}

/** status: gone | alive | unknown */
export async function classifyAddress(url, { fetchImpl = fetch } = {}) {
  let res;
  try {
    res = await get(fetchImpl, url, 'application/json, text/event-stream');
  } catch (err) {
    const code = err?.cause?.code ?? err?.code;
    if (code === 'ENOTFOUND') return { status: 'gone', reason: 'DNS name not found' };
    return { status: 'unknown', reason: networkReason(err) };
  }
  const s = res.status;
  try { await res.body?.cancel?.(); } catch { /* nothing to drain */ }
  if (s === 404 || s === 410) return { status: 'gone', http: s, reason: `server answered ${s}` };
  // A server that refuses the request (400, 401, 403, 405, 415) still exists: a bare GET is
  // not how an MCP client talks to it. Only "try later" answers and server errors stay unknown.
  if (s < 500 && s !== 408 && s !== 425 && s !== 429) {
    return { status: 'alive', http: s, reason: s >= 400 ? `server answered ${s} (it exists; it wants a sign-in or another kind of request)` : `server answered ${s}` };
  }
  return { status: 'unknown', http: s, reason: `server answered ${s}` };
}

// ---------------------------------------------------------------- report

const BROKEN = new Set(['missing', 'deprecated', 'archived', 'gone']);

/** Run the whole check. Returns { code, report, summary }. Never throws for network trouble. */
export async function run({ root, fetchImpl = fetch, offline = false, pause = sleep, now = new Date() } = {}) {
  const { files, candidates, perType } = scan(root);
  const allowPath = join(root, ALLOWLIST);
  const allow = existsSync(allowPath) ? parseAllowlist(readFileSync(allowPath, 'utf8')) : new Map();

  const occurring = new Set(candidates.map((c) => c.name));
  const staleAllowlist = [...allow.keys()].filter((n) => !occurring.has(n));

  const unique = new Map();
  for (const c of candidates) {
    const key = `${c.kind}|${c.name}`;
    if (!unique.has(key)) unique.set(key, { kind: c.kind, name: c.name, where: [] });
    unique.get(key).where.push(`${c.file}:${c.line}`);
  }
  const items = [...unique.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));
  const githubCache = new Map();
  for (const item of items) {
    if (allow.has(item.name)) {
      Object.assign(item, { status: 'allowlisted', reason: allow.get(item.name) });
      continue;
    }
    if (offline) {
      item.status = 'not checked';
      continue;
    }
    const verdict = item.kind === 'package'
      ? await classifyPackage(item.name, { fetchImpl, githubCache, pause })
      : await classifyAddress(item.name, { fetchImpl });
    Object.assign(item, verdict);
    await pause(SPACING_MS);
  }

  const packageCount = items.filter((i) => i.kind === 'package').length;
  const broken = items.filter((i) => BROKEN.has(i.status));
  const unknown = items.filter((i) => i.status === 'unknown');
  let code = broken.length || staleAllowlist.length ? 1 : 0;
  const problems = [];
  if (packageCount === 0) {
    code = 2;
    problems.push('the scan found no package at all: the scanned folders or the extractor broke');
  }
  const report = {
    checkedAt: now.toISOString(),
    scanned: { globs: SCAN_GLOBS, files: files.length, perType },
    counts: {
      candidates: candidates.length,
      uniquePackages: packageCount,
      uniqueAddresses: items.length - packageCount,
      broken: broken.length,
      unknown: unknown.length,
      allowlisted: items.filter((i) => i.status === 'allowlisted').length,
    },
    exitCode: code,
    problems,
    staleAllowlist,
    broken,
    unknown,
    items,
  };
  return { code, report, summary: summarize(report) };
}

export function summarize(report) {
  const L = [];
  const { counts } = report;
  L.push('## Package and server address check');
  L.push('');
  L.push(`Checked ${report.checkedAt}. Scanned ${report.scanned.files} files; found ${counts.uniquePackages} packages and ${counts.uniqueAddresses} server addresses (${counts.candidates} mentions).`);
  L.push('');
  L.push('| File type | Files | With candidates | Package mentions | Address mentions |');
  L.push('|---|---|---|---|---|');
  for (const [ext, t] of Object.entries(report.scanned.perType).sort()) {
    L.push(`| ${ext} | ${t.files} | ${t.filesWithCandidates} | ${t.packages} | ${t.addresses} |`);
  }
  L.push('');
  for (const p of report.problems) L.push(`**Could not run:** ${p}`);
  if (report.broken.length) {
    L.push(`### Broken (${report.broken.length})`);
    for (const b of report.broken) {
      L.push(`- **${b.status}** \`${b.name}\` (${b.kind}): ${b.reason}`);
      for (const w of b.where) L.push(`  - ${w}`);
    }
  } else if (!report.problems.length) {
    L.push('Nothing broken.');
  }
  if (report.staleAllowlist.length) {
    L.push('');
    L.push(`### Allowlist entries no longer in the sources (${report.staleAllowlist.length})`);
    for (const n of report.staleAllowlist) L.push(`- \`${n}\`: remove it from ${ALLOWLIST}`);
  }
  if (report.unknown.length) {
    L.push('');
    L.push(`### Unknown: network trouble, not counted as broken (${report.unknown.length})`);
    for (const u of report.unknown) L.push(`- \`${u.name}\` (${u.kind}): ${u.reason}`);
  }
  L.push('');
  return L.join('\n');
}

async function main(argv) {
  const opt = { root: resolve(fileURLToPath(new URL('..', import.meta.url))), json: null, offline: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--json') opt.json = argv[++i];
    else if (argv[i] === '--root') opt.root = resolve(argv[++i]);
    else if (argv[i] === '--offline') opt.offline = true;
    else throw new Error(`unknown argument ${argv[i]}`);
  }
  if (!existsSync(opt.root) || !statSync(opt.root).isDirectory()) throw new Error(`no such folder ${opt.root}`);
  const { code, report, summary } = await run(opt);
  if (opt.json) writeFileSync(opt.json, JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(summary);
  console.error(`check:packages: ${report.counts.uniquePackages} packages, ${report.counts.uniqueAddresses} addresses, ${report.counts.broken} broken, ${report.counts.unknown} unknown, exit ${code}`);
  return code;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(`check:packages could not run: ${err?.stack ?? err}`);
      process.exit(2);
    },
  );
}
