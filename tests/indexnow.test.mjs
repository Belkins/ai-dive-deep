import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { pageHash } from '../scripts/indexnow-manifest.mjs';

// IndexNow asks senders not to resubmit unchanged URLs. The ping compares the
// build's manifest with the one that was live before the deploy; these cases
// run it in --dry-run (no network when a build manifest is given).
const ping = fileURLToPath(new URL('../scripts/indexnow-ping.py', import.meta.url));
const HOST = 'https://dive.vladyslavpodoliako.com';

function run({ next, previous, extra = [] }) {
  const dir = mkdtempSync(join(tmpdir(), 'indexnow-'));
  try {
    const nextPath = join(dir, 'next.json');
    const prevPath = join(dir, 'prev.json');
    writeFileSync(nextPath, JSON.stringify({ version: 1, pages: next }));
    if (typeof previous === 'string') writeFileSync(prevPath, previous);
    else if (previous) writeFileSync(prevPath, JSON.stringify({ version: 1, pages: previous }));
    const r = spawnSync('python3', ['-I', ping, '--dry-run', '--manifest', nextPath, '--previous', prevPath, ...extra], { encoding: 'utf8' });
    const submitted = [...r.stdout.matchAll(/submit: (\S+)/g)].map((m) => m[1].replace(HOST, ''));
    return { status: r.status, out: `${r.stdout}${r.stderr}`, submitted };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const BASE = { '/': 'aaaa', '/radar/': 'bbbb', '/chapters/01-x/': 'cccc' };

test('unchanged pages submit nothing', () => {
  const r = run({ next: BASE, previous: BASE });
  assert.equal(r.status, 0, r.out);
  assert.deepEqual(r.submitted, []);
  assert.match(r.out, /nothing changed; no POST sent/);
});

test('a page whose main content changed is the only one submitted', () => {
  const r = run({ next: { ...BASE, '/radar/': 'b2b2' }, previous: BASE });
  assert.equal(r.status, 0, r.out);
  assert.deepEqual(r.submitted, ['/radar/']);
});

test('a new page is submitted', () => {
  const r = run({ next: { ...BASE, '/radar/frozen-day/': 'dddd' }, previous: BASE });
  assert.deepEqual(r.submitted, ['/radar/frozen-day/']);
});

test('a removed page is not submitted', () => {
  const next = { '/': 'aaaa', '/radar/': 'bbbb' };
  const r = run({ next, previous: BASE });
  assert.deepEqual(r.submitted, []);
});

test('no previous manifest submits every page once', () => {
  const r = run({ next: BASE, previous: null });
  assert.deepEqual(r.submitted, ['/', '/chapters/01-x/', '/radar/']);
  assert.match(r.out, /no readable previous manifest/);
});

test('an unreadable previous manifest submits every page once', () => {
  assert.equal(run({ next: BASE, previous: '<html>404</html>' }).submitted.length, 3);
  assert.equal(run({ next: BASE, previous: '{"pages": ["/"]}' }).submitted.length, 3);
});

test('--full resends every page even when nothing changed', () => {
  const r = run({ next: BASE, previous: BASE, extra: ['--full'] });
  assert.deepEqual(r.submitted, ['/', '/chapters/01-x/', '/radar/']);
});

test('the page hash ignores shared chrome and per-build ids, not the main text', () => {
  const page = (nav, main) => `<html><body><nav>${nav}</nav><main id="main-content">${main}</main><footer>f</footer></body></html>`;
  const a = page('Edition 20.2', '<astro-island uid="Z1abc" component-url="/_astro/Tier.AbCd1234.js"></astro-island><p>Chapter text</p>');
  const chrome = page('Edition 20.3', '<astro-island uid="9xYz" component-url="/_astro/Tier.ZzZz9876.js"></astro-island><p>Chapter text</p>');
  const edited = page('Edition 20.2', '<astro-island uid="Z1abc" component-url="/_astro/Tier.AbCd1234.js"></astro-island><p>Chapter text, revised</p>');
  assert.equal(pageHash(a), pageHash(chrome));
  assert.notEqual(pageHash(a), pageHash(edited));
});

test('the page hash ignores island prefixes and the React ids built from them', () => {
  const page = (prefix, rid) => `<main><astro-island uid="Z1" prefix="${prefix}"><button aria-controls="radix-${rid}">Skill</button></astro-island></main>`;
  assert.equal(pageHash(page('r4', ':r4R0:')), pageHash(page('r9', ':r9R0:')));
  assert.notEqual(pageHash(page('r4', ':r4R0:')), pageHash(page('r4', ':r4R0:').replace('Skill', 'Hook')));
});

// Chapter 07's CronBuilder renders its next runs from the build clock, so a
// build on Tuesday and one on Wednesday differ only in those date-times. That
// must not resubmit the page every day; a prose edit, or a date in the prose,
// still must.
test('the page hash ignores build-clock times inside a widget, not dates in the prose', () => {
  const page = (runs, prose = '<p>Cron runs at 7:30.</p>') =>
    `<main>${prose}<astro-island uid="Z4" component-url="/_astro/CronBuilder.Bpyg0QF_.js"><ul>${runs.map((r) => `<li><span>${r}</span></li>`).join('')}</ul><p>Next 7 runs</p></astro-island></main>`;
  const tuesday = page(['Tue, Nov 10, 07:30 AM', 'Wed, Nov 11, 07:30 AM']);
  const wednesday = page(['Wed, Nov 11, 07:30 AM', 'Thu, Nov 12, 07:30 AM']);
  assert.equal(pageHash(tuesday), pageHash(wednesday));
  assert.notEqual(pageHash(tuesday), pageHash(tuesday.replace('Next 7 runs', 'Next 5 runs')));
  const prose = (when) => page(['Tue, Nov 10, 07:30 AM'], `<p>It was ${when}.</p>`);
  assert.notEqual(pageHash(prose('Tue, Nov 10, 9:14 AM')), pageHash(prose('Wed, Nov 11, 9:14 AM')));
});
