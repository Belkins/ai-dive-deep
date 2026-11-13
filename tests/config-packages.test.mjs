import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { parse } from 'yaml';
import {
  extract,
  classifyPackage,
  classifyAddress,
  run,
} from '../scripts/check-config-packages.mjs';

// A reader pastes these commands and config blocks. When a package stops existing on npm
// (or a hosted server goes away), the page keeps teaching it; the weekly check is the only
// thing that notices. These tests pin what it extracts and how it judges an answer.

const names = (found, kind = 'package') => found.filter((c) => c.kind === kind).map((c) => c.name);
const where = (found) => found.map((c) => `${c.name}@${c.line}`);

test('npx with and without -y names the package, without its version', () => {
  assert.deepEqual(names(extract('npx -y @modelcontextprotocol/server-filesystem ~/notes')), ['@modelcontextprotocol/server-filesystem']);
  assert.deepEqual(names(extract('$ npx create-next-app@latest my-app')), ['create-next-app']);
  assert.deepEqual(names(extract('Run `npx --yes tsx server.ts` once.')), ['tsx']);
  assert.deepEqual(names(extract('npx -p @scope/tool@2 tool --help')), ['@scope/tool']);
  // A shell case arm inside a hook command.
  assert.deepEqual(names(extract('case "$f" in *.test.*) npx vitest run "$f";; esac')), ['vitest']);
});

test('npm install and npm i name every package and skip flags', () => {
  assert.deepEqual(names(extract('npm i @modelcontextprotocol/sdk zod\nnpm i -D typescript tsx')), [
    '@modelcontextprotocol/sdk', 'zod', 'typescript', 'tsx',
  ]);
  assert.deepEqual(names(extract('RUN npm install -g @anthropic-ai/claude-code@latest')), ['@anthropic-ai/claude-code']);
  assert.deepEqual(names(extract('      - run: npm install --save-dev left-pad && npm test')), ['left-pad']);
  // Stops at the end of the command, not at the end of the line.
  assert.deepEqual(names(extract('answer: "npm install -g @anthropic-ai/claude-code, claude --version, cd into a repo"')), ['@anthropic-ai/claude-code']);
});

test('pnpm dlx and bunx name the package', () => {
  assert.deepEqual(names(extract('pnpm dlx shadcn@latest init')), ['shadcn']);
  assert.deepEqual(names(extract('<code>bunx @vendor/cli login</code>')), ['@vendor/cli']);
});

test('prose that only mentions npx or npm install is not a command', () => {
  assert.deepEqual(extract('a husky install from some npx run had landed in the wrong git root'), []);
  assert.deepEqual(extract('the skill catalog, a 60-second npx install, and the receipts'), []);
  assert.deepEqual(extract('If the agent needs egress for npm install or API tests, flip it.'), []);
});

test('a JSON config block with command npx and an args list names the package, in every spelling', () => {
  const json = [
    '{',
    '  "mcpServers": {',
    '    "stripe": {',
    '      "command": "npx",',
    '      "args": ["-y", "@stripe/mcp-server"],',
    '    },',
    '    "postgres": {',
    '      "command": "npx",',
    '      "args": [',
    '        "-y",',
    '        "@modelcontextprotocol/server-postgres",',
    '        "postgresql://localhost/mydb"',
    '      ]',
    '    }',
    '  }',
    '}',
  ].join('\n');
  assert.deepEqual(where(extract(json)), ['@stripe/mcp-server@5', '@modelcontextprotocol/server-postgres@11']);
  // Inside a template literal in a .tsx or .astro file the quotes may be escaped.
  assert.deepEqual(names(extract('config: `{ \\"gong\\": { \\"command\\": \\"npx\\", \\"args\\": [\\"-y\\", \\"@gong/mcp-server\\"] } }`')), ['@gong/mcp-server']);
  // One-line entries, as chapter 35 writes them.
  assert.deepEqual(names(extract('"slack": { "command": "npx", "args": ["-y", "@slack/mcp-server"], "env": {} },')), ['@slack/mcp-server']);
  // Codex TOML.
  assert.deepEqual(names(extract('[mcp_servers.sentry]\ncommand = "npx"\nargs = ["-y", "@sentry/mcp-server"]')), ['@sentry/mcp-server']);
  // pnpm needs dlx to run a package; a command that is not a package runner yields nothing.
  assert.deepEqual(names(extract('"command": "pnpm", "args": ["dlx", "@vendor/mcp"]')), ['@vendor/mcp']);
  assert.deepEqual(extract('"command": "node", "args": ["server.js"]'), []);
  assert.deepEqual(extract('"command": "pnpm", "args": ["run", "start"]'), []);
});

test('a figure is read as drawn: text on one baseline joins into a line at its source line', () => {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg">',
    '  <text x="10" y="20">Panel title</text>',
    '  <text x="30" y="168">4</text><text x="110" y="168">"command"</text><text x="240" y="168">: </text><text x="265" y="168">"npx"</text>',
    '  <text x="30" y="196">5</text><text x="110" y="196">"args"</text><text x="190" y="196">: [</text><text x="230" y="196">"-y"</text><text x="275" y="196">, </text><text x="295" y="196">"@mcp/filesystem"</text><text x="540" y="196">]</text>',
    '  <text x="28" y="226">5</text><text x="80" y="226">"github"</text><text x="200" y="226">: { npx </text><text x="290" y="226">@github/mcp-server</text><text x="545" y="226"> }</text>',
    '  <text x="28" y="300">$ npm install -g <tspan fill="#fff">@anthropic-ai/claude-code</tspan></text>',
    '</svg>',
  ].join('\n');
  assert.deepEqual(where(extract(svg, { svg: true })), [
    '@github/mcp-server@5',
    '@anthropic-ai/claude-code@6',
    '@mcp/filesystem@4',
  ]);
});

test('hosted server addresses in config blocks and claude mcp add commands are found; loopback and templates are not', () => {
  const json = '{ "mcpServers": { "github": { "type": "http", "url": "https://api.githubcopilot.com/mcp/" },\n "local": { "type": "http", "url": "http://localhost:3000/mcp" },\n "lan": { "type": "http", "url": "http://127.0.0.1:8080/mcp" },\n "tpl": { "type": "http", "url": "https://${HOST}/mcp" } } }';
  assert.deepEqual(names(extract(json), 'address'), ['https://api.githubcopilot.com/mcp/']);
  // "type": "http" alone marks an MCP entry even without the mcpServers header nearby.
  assert.deepEqual(names(extract('"posthog": { "type": "http", "url": "https://mcp.posthog.com/mcp" }'), 'address'), ['https://mcp.posthog.com/mcp']);
  assert.deepEqual(names(extract('[mcp_servers.linear]\nurl = "https://mcp.linear.app/mcp"'), 'address'), ['https://mcp.linear.app/mcp']);
  assert.deepEqual(names(extract('claude mcp add --transport http sentry https://mcp.sentry.dev/mcp'), 'address'), ['https://mcp.sentry.dev/mcp']);
  assert.deepEqual(names(extract('<code>claude mcp add --transport sse asana https://mcp.asana.com/sse</code>'), 'address'), ['https://mcp.asana.com/sse']);
  // A URL passed to a bridge package in an args list.
  assert.deepEqual(names(extract('"command": "npx", "args": ["-y", "mcp-remote", "https://mcp.example-vendor.io/sse"]'), 'address'), ['https://mcp.example-vendor.io/sse']);
  // A link in prose or in an unrelated JSON object is not a server address.
  assert.deepEqual(extract('{ "title": "Paper", "url": "https://arxiv.org/abs/2609.05370" }'), []);
});

// ---------------------------------------------------------------- classification
// Fixtures recorded from the real registry on 11 Nov 2026 with this script's own request
// (GET /<name>/latest): @stripe/mcp-server (404), @modelcontextprotocol/server-slack
// (deprecated), zod (healthy). github-repo-archived.json is the real API answer for
// modelcontextprotocol/servers-archived, trimmed to five fields; github-repo-live.json is the
// same five fields of the real answer for colinhacks/zod, recorded on 13 Nov 2026.

const fixture = (name) => readFileSync(new URL(`./fixtures/npm-registry/${name}`, import.meta.url), 'utf8');
const REGISTRY_DOCS = {
  '/@modelcontextprotocol%2Fserver-slack/latest': fixture('deprecated-latest.json'),
  '/zod/latest': fixture('healthy-latest.json'),
  // Made up, not recorded: a package document with no `latest` tag (the registry rarely holds one).
  '/no-latest-tag': '{"name":"no-latest-tag","dist-tags":{},"versions":{}}',
};

/**
 * A stand-in for the network that refuses what the real services refuse: an unknown
 * package gets the registry's real 404 body, unauthenticated GitHub answers 403 unless a
 * repository is given, and an unknown host fails DNS. Every request must carry a generic
 * User-Agent. `sent` keeps each request's host and its Authorization header, if any.
 */
function stubNetwork({ github = {}, hosts = {} } = {}) {
  const calls = [];
  const agents = [];
  const sent = [];
  const impl = async (url, init) => {
    calls.push(url);
    agents.push(init?.headers?.['User-Agent'] ?? '');
    const u = new URL(url);
    sent.push({ host: u.hostname, authorization: init?.headers?.Authorization ?? null });
    if (u.hostname === 'registry.npmjs.org') {
      const body = REGISTRY_DOCS[u.pathname];
      return body ? new Response(body, { status: 200 }) : new Response(fixture('missing-404.json'), { status: 404 });
    }
    if (u.hostname === 'api.github.com') {
      const repo = u.pathname.replace('/repos/', '');
      if (github[repo]) return new Response(github[repo], { status: 200 });
      return new Response('{"message":"API rate limit exceeded"}', { status: 403 });
    }
    if (hosts[u.hostname] !== undefined) {
      const h = hosts[u.hostname];
      if (h instanceof Error) throw h;
      return new Response('', { status: h });
    }
    throw new TypeError('fetch failed', { cause: Object.assign(new Error('getaddrinfo ENOTFOUND'), { code: 'ENOTFOUND' }) });
  };
  return { impl, calls, agents, sent };
}
const noPause = async () => {};
const netError = (code) => new TypeError('fetch failed', { cause: Object.assign(new Error(code), { code }) });

test('every request carries a generic User-Agent, with no person, address or project in it', async () => {
  const { impl, agents } = stubNetwork({ hosts: { 'ok.test': 200 } });
  await classifyPackage('zod', { fetchImpl: impl, pause: noPause });
  await classifyPackage('@stripe/mcp-server', { fetchImpl: impl, pause: noPause });
  await classifyAddress('https://ok.test/mcp', { fetchImpl: impl });
  assert.equal(agents.length, 5);
  for (const ua of agents) assert.match(ua, /^[a-z-]+\/\d+(\.\d+)* \(node\)$/, `User-Agent is not generic: ${ua}`);
});

test('a package the registry answers 404 for is missing, and an unknown package never passes as fine', async () => {
  const { impl } = stubNetwork();
  const stripe = await classifyPackage('@stripe/mcp-server', { fetchImpl: impl, pause: noPause });
  assert.equal(stripe.status, 'missing');
  const unheard = await classifyPackage('@nobody/never-published', { fetchImpl: impl, pause: noPause });
  assert.equal(unheard.status, 'missing');
});

test('a package whose latest version carries the deprecated field is deprecated, with the registry message', async () => {
  const { impl } = stubNetwork();
  const slack = await classifyPackage('@modelcontextprotocol/server-slack', { fetchImpl: impl, pause: noPause });
  assert.equal(slack.status, 'deprecated');
  assert.match(slack.reason, /^Package no longer supported/);
});

test('a healthy package stays fine when GitHub rate-limits the archived check', async () => {
  const { impl, calls } = stubNetwork();
  const zod = await classifyPackage('zod', { fetchImpl: impl, pause: noPause });
  assert.equal(zod.status, 'fine');
  assert.equal(zod.repository, 'colinhacks/zod');
  assert.match(zod.archivedCheck, /^skipped: GitHub answered 403/);
  assert.ok(calls.includes('https://api.github.com/repos/colinhacks/zod'), 'the archived check never asked GitHub');
});

test('a package whose GitHub repository is archived is archived', async () => {
  const { impl } = stubNetwork({ github: { 'colinhacks/zod': fixture('github-repo-archived.json') } });
  const zod = await classifyPackage('zod', { fetchImpl: impl, pause: noPause });
  assert.equal(zod.status, 'archived');
});

test('a package whose GitHub repository is live is fine, and the archived check says it ran', async () => {
  // The everyday answer for a healthy package: without this, "every repository is archived" passes.
  const { impl } = stubNetwork({ github: { 'colinhacks/zod': fixture('github-repo-live.json') } });
  const zod = await classifyPackage('zod', { fetchImpl: impl, pause: noPause });
  assert.equal(zod.status, 'fine');
  assert.equal(zod.archivedCheck, 'not archived');
});

test('a package that exists but has no latest version is unknown, not missing', async () => {
  const { impl } = stubNetwork();
  const v = await classifyPackage('no-latest-tag', { fetchImpl: impl, pause: noPause });
  assert.equal(v.status, 'unknown');
  assert.match(v.reason, /no latest version/);
});

test('the GitHub token signs the archived check and reaches no other host', async (t) => {
  const page = '<code>npm i zod</code>\n<code>npx -y @stripe/mcp-server</code>\n{ "mcpServers": { "x": { "type": "http", "url": "https://ok.test/mcp" } } }';
  const root = siteRoot(t, { 'src/pages/a.astro': page });
  const live = { github: { 'colinhacks/zod': fixture('github-repo-live.json') }, hosts: { 'ok.test': 200 } };
  const signed = stubNetwork(live);
  await run({ root, fetchImpl: signed.impl, pause: noPause, githubToken: 'test-token' });
  assert.deepEqual([...new Set(signed.sent.map((c) => c.host))].sort(), ['api.github.com', 'ok.test', 'registry.npmjs.org']);
  assert.deepEqual(signed.sent.filter((c) => c.authorization), [{ host: 'api.github.com', authorization: 'Bearer test-token' }]);
  // Without a token no request is signed.
  const anonymous = stubNetwork(live);
  await run({ root, fetchImpl: anonymous.impl, pause: noPause });
  assert.deepEqual(anonymous.sent.filter((c) => c.authorization), []);
});

test('a server address is gone on DNS failure, 404 or 410; alive on 2xx, 3xx and a 4xx that only refuses the request; unknown on network trouble', async () => {
  const timeout = Object.assign(new Error('The operation was aborted due to timeout'), { name: 'TimeoutError' });
  const { impl } = stubNetwork({
    hosts: { 'ok.test': 200, 'moved.test': 301, 'signin.test': 401, 'forbidden.test': 403, 'method.test': 405,
      // A hosted MCP endpoint answers a bare GET with 400 or 415: it exists, it wants a POST.
      'badrequest.test': 400, 'mediatype.test': 415,
      'gone404.test': 404, 'gone410.test': 410, 'busy.test': 429, 'early.test': 425, 'waited.test': 408, 'down.test': 503, 'slow.test': timeout,
      // Only "no such name" means gone: a resolver that asks to retry, or a refused connection, is trouble on the way.
      'dnsretry.test': netError('EAI_AGAIN'), 'refused.test': netError('ECONNREFUSED') },
  });
  const status = async (host) => (await classifyAddress(`https://${host}/mcp`, { fetchImpl: impl })).status;
  for (const host of ['ok.test', 'moved.test', 'signin.test', 'forbidden.test', 'method.test', 'badrequest.test', 'mediatype.test']) assert.equal(await status(host), 'alive', host);
  for (const host of ['gone404.test', 'gone410.test', 'no-such-name.test']) assert.equal(await status(host), 'gone', host);
  for (const host of ['busy.test', 'early.test', 'waited.test', 'down.test', 'slow.test', 'dnsretry.test', 'refused.test']) assert.equal(await status(host), 'unknown', host);
});

test('registry trouble (429, 5xx, timeout) is unknown, not missing', async () => {
  for (const failure of [new Response('', { status: 429 }), new Response('', { status: 503 })]) {
    const v = await classifyPackage('zod', { fetchImpl: async () => failure.clone(), pause: noPause });
    assert.equal(v.status, 'unknown');
  }
  const v = await classifyPackage('zod', {
    fetchImpl: async () => { throw Object.assign(new Error('aborted'), { name: 'TimeoutError' }); },
    pause: noPause,
  });
  assert.equal(v.status, 'unknown');
});

// ---------------------------------------------------------------- whole run

function siteRoot(t, files) {
  const root = mkdtempSync(join(tmpdir(), 'config-packages-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}

test('the run exits 1 on a missing package and lists it with file and line', async (t) => {
  const root = siteRoot(t, {
    'src/content/chapters/01-x.mdx': 'Intro\n\n```bash\nnpx -y @stripe/mcp-server\n```\n',
    'src/pages/setup.astro': '<code>npm i zod</code>',
  });
  const { code, report } = await run({ root, fetchImpl: stubNetwork().impl, pause: noPause });
  assert.equal(code, 1);
  assert.deepEqual(report.broken.map((b) => [b.name, b.status, b.where]), [
    ['@stripe/mcp-server', 'missing', ['src/content/chapters/01-x.mdx:4']],
  ]);
  assert.equal(report.scanned.perType['.mdx'].packages, 1);
  assert.equal(report.scanned.perType['.astro'].packages, 1);
});

test('one-off network trouble leaves the run green and lists the unknowns apart', async (t) => {
  const root = siteRoot(t, { 'src/pages/a.astro': '<code>npm i zod left-pad</code>' });
  const net = stubNetwork();
  // The registry answers for zod and is down for left-pad.
  const flaky = async (url, init) => (url.includes('/left-pad') ? new Response('', { status: 503 }) : net.impl(url, init));
  const { code, report, summary } = await run({ root, fetchImpl: flaky, pause: noPause });
  assert.equal(code, 0);
  assert.equal(report.broken.length, 0);
  assert.deepEqual(report.unknown.map((u) => u.name), ['left-pad']);
  assert.match(summary, /### Unknown: network trouble, not counted as broken \(1\)/);
});

test('a registry that answers for no package exits 2: nothing was checked', async (t) => {
  // A blocked client or an outage must not read as a clean week.
  const root = siteRoot(t, { 'src/pages/a.astro': '<code>npm i zod left-pad</code>' });
  const down = async () => new Response('', { status: 503 });
  const { code, report, summary } = await run({ root, fetchImpl: down, pause: noPause });
  assert.equal(code, 2);
  assert.equal(report.broken.length, 0);
  assert.match(report.problems.join('\n'), /answered for none of the 2 packages/);
  assert.match(summary, /\*\*Could not run:\*\*/);
  assert.doesNotMatch(summary, /Nothing broken\./);
});

test('an archived check GitHub did not answer is listed in the summary, not passed over', async (t) => {
  const root = siteRoot(t, { 'src/pages/a.astro': '<code>npm i zod</code>' });
  const limited = await run({ root, fetchImpl: stubNetwork().impl, pause: noPause });
  assert.equal(limited.code, 0);
  assert.equal(limited.report.counts.archivedCheckSkipped, 1);
  assert.match(limited.summary, /### Archived check skipped \(1\)\n[^\n]+\n- `zod` \(colinhacks\/zod\): GitHub answered 403 \(rate limit\)/);
  const answered = await run({ root, fetchImpl: stubNetwork({ github: { 'colinhacks/zod': fixture('github-repo-live.json') } }).impl, pause: noPause });
  assert.equal(answered.report.counts.archivedCheckSkipped, 0);
  assert.doesNotMatch(answered.summary, /Archived check skipped/);
});

test('an allowlisted teaching name passes, and an allowlist entry no longer in the sources fails the run', async (t) => {
  const page = '<code>npx -y @acme/teaching-server</code> and <code>npm i zod</code>';
  const allowed = siteRoot(t, {
    'src/pages/a.astro': page,
    'scripts/config-packages-allowlist.txt': '# comment\n@acme/teaching-server  # invented name in the example\n',
  });
  const ok = await run({ root: allowed, fetchImpl: stubNetwork().impl, pause: noPause });
  assert.equal(ok.code, 0);
  assert.deepEqual(ok.report.staleAllowlist, []);

  const stale = siteRoot(t, {
    'src/pages/a.astro': '<code>npm i zod</code>',
    'scripts/config-packages-allowlist.txt': '@acme/teaching-server  # invented name in the example\n',
  });
  const bad = await run({ root: stale, fetchImpl: stubNetwork().impl, pause: noPause });
  assert.equal(bad.code, 1);
  assert.deepEqual(bad.report.staleAllowlist, ['@acme/teaching-server']);

  const noReason = siteRoot(t, { 'src/pages/a.astro': page, 'scripts/config-packages-allowlist.txt': '@acme/teaching-server\n' });
  await assert.rejects(run({ root: noReason, fetchImpl: stubNetwork().impl, pause: noPause }), /needs "name {2}# reason"/);
});

test('a scan that finds no package at all exits 2: the check could not run', async (t) => {
  const root = siteRoot(t, { 'src/pages/a.astro': '<p>No commands here.</p>' });
  const { code } = await run({ root, fetchImpl: stubNetwork().impl, pause: noPause });
  assert.equal(code, 2);
});

test('the weekly workflow only reads, and the check stays out of prebuild, build and deploy', () => {
  const wf = parse(readFileSync(new URL('../.github/workflows/package-check.yml', import.meta.url), 'utf8'));
  assert.ok(wf.on.schedule?.[0]?.cron, 'no weekly cron');
  assert.ok('workflow_dispatch' in wf.on);
  // The top level and every job: nothing but read. A job's own permissions block replaces the top one.
  const grants = [wf.permissions, ...Object.values(wf.jobs).map((job) => job.permissions).filter((p) => p !== undefined)];
  for (const grant of grants) assert.deepEqual(grant, { contents: 'read' });
  const steps = wf.jobs.check.steps;
  assert.ok(steps.some((s) => s.uses === 'actions/checkout@v5'));
  assert.equal(steps.find((s) => s.uses?.startsWith('actions/setup-node@'))?.with?.['node-version'], '26');
  assert.ok(steps.some((s) => /check-config-packages\.mjs/.test(s.run ?? '') && /GITHUB_STEP_SUMMARY/.test(s.run)));
  const commands = Object.values(wf.jobs).flatMap((job) => job.steps).map((s) => s.run ?? '').join('\n');
  assert.doesNotMatch(commands, /\bgh (?:issue|pr|api|release)\b|\bcurl\b|\bwget\b|slack/i, 'the workflow posts somewhere');
  // The run's own token reaches the check step alone, and no stored secret is read.
  const text = readFileSync(new URL('../.github/workflows/package-check.yml', import.meta.url), 'utf8');
  assert.equal(text.split('github.token').length - 1, 1);
  assert.doesNotMatch(text, /secrets\./);
  assert.equal(steps.find((s) => /check-config-packages\.mjs/.test(s.run ?? '')).env.GITHUB_TOKEN, '${{ github.token }}');

  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  for (const script of ['prebuild', 'predev', 'build', 'postbuild']) {
    assert.doesNotMatch(pkg.scripts[script], /check-config-packages|check:packages/, script);
  }
  const deploy = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.doesNotMatch(deploy, /check-config-packages|check:packages/);
});
