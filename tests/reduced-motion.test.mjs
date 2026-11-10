import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

// Runs the postbuild guard against a throwaway dist with fixture CSS (tests
// never read the real dist: CI runs them before the build).
const checker = fileURLToPath(new URL('../scripts/check-reduced-motion.mjs', import.meta.url));

function run(css) {
  const dist = mkdtempSync(join(tmpdir(), 'reduced-motion-'));
  try {
    mkdirSync(join(dist, '_astro'));
    css.forEach((text, i) => writeFileSync(join(dist, '_astro', `f${i}.css`), text));
    const r = spawnSync(process.execPath, [checker, dist], { encoding: 'utf8' });
    return { status: r.status, out: `${r.stdout}${r.stderr}` };
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
}

// What astro build emitted on 2026-11-10 for the src/styles/global.css block
// (copied from dist/_astro/about.*.css).
const KILL = '@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}';

test('built CSS with the global kill switch passes', () => {
  const r = run(['.a{color:red}', `.b{color:blue}${KILL}.c{color:green}`]);
  assert.equal(r.status, 0, r.out);
});

test('built CSS without the kill switch fails and names the block', () => {
  const r = run(['.a{color:red}@media (prefers-reduced-motion:no-preference){.a{animation:x 1s}}']);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /prefers-reduced-motion: reduce/);
});

test('a component-scoped reduce block does not count as the global one', () => {
  const r = run(['@media (prefers-reduced-motion:reduce){.bar[data-astro-cid-x]{animation-duration:.01ms!important;transition-duration:.01ms!important}}']);
  assert.equal(r.status, 1, r.out);
});

test('the durations must be .01ms with !important', () => {
  assert.equal(run([KILL.replace('animation-duration:.01ms!important', 'animation-duration:.01ms')]).status, 1);
  assert.equal(run([KILL.replace('transition-duration:.01ms!important', 'transition-duration:.2s!important')]).status, 1);
});

test('a missing dist fails instead of passing silently', () => {
  const r = spawnSync(process.execPath, [checker, join(tmpdir(), 'no-such-dist-reduced-motion')], { encoding: 'utf8' });
  assert.equal(r.status, 1);
});
