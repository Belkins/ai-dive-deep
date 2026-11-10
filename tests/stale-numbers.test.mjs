import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

// The guard resolves the repo root from its own location, so each case copies
// the real script and ledger into a throwaway tree and runs it there.
const script = fileURLToPath(new URL('../scripts/check-stale-numbers.py', import.meta.url));
const ledger = fileURLToPath(new URL('../scripts/numbers-ledger.json', import.meta.url));

function run(files, { chapters = 3, widgets = 2 } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'stale-numbers-'));
  try {
    mkdirSync(join(root, 'scripts'));
    copyFileSync(script, join(root, 'scripts', 'check-stale-numbers.py'));
    copyFileSync(ledger, join(root, 'scripts', 'numbers-ledger.json'));
    mkdirSync(join(root, 'src', 'content', 'chapters'), { recursive: true });
    for (let i = 1; i <= chapters; i += 1) {
      writeFileSync(join(root, 'src', 'content', 'chapters', `${String(i).padStart(2, '0')}-c.mdx`), 'body\n');
    }
    mkdirSync(join(root, 'src', 'widgets'), { recursive: true });
    for (let i = 1; i <= widgets; i += 1) {
      writeFileSync(join(root, 'src', 'widgets', `W${i}.tsx`), 'export {};\n');
    }
    for (const [rel, text] of Object.entries(files)) {
      mkdirSync(join(root, rel, '..'), { recursive: true });
      writeFileSync(join(root, rel), text);
    }
    const r = spawnSync('python3', ['-I', join(root, 'scripts', 'check-stale-numbers.py')], { encoding: 'utf8' });
    return { status: r.status, out: `${r.stdout}${r.stderr}` };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('README chapter count that matches the chapters folder passes', () => {
  const r = run({ 'README.md': '**A 3-chapter field manual**\n- **3 chapters** in src\n' });
  assert.equal(r.status, 0, r.out);
});

test('README that says 48 chapters while the folder holds 3 fails and names the line', () => {
  const r = run({ 'README.md': 'intro\n**A 48-chapter field manual**\n' });
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /README\.md:2/);
  assert.match(r.out, /says 48, src\/content\/chapters\/\*\.mdx holds 3/);
});

test('share-image SVG with a stale chapter count fails', () => {
  const r = run({ 'public/og-default.svg': '<text>46 chapters · 2 widgets</text>\n' });
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /public\/og-default\.svg:1/);
});

test('README widget count is held to the files in src/widgets', () => {
  assert.equal(run({ 'README.md': '- **2 React/Astro widgets** in src/widgets/\n' }).status, 0);
  const r = run({ 'README.md': '- **31 React/Astro widgets** in src/widgets/\n' });
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /says 31, src\/widgets\/\[A-Z\]\*\.tsx holds 2/);
});

// A widget is a component file (PascalCase .tsx). Hooks and loaders that live
// beside the widgets, such as useCopy.tsx, must not move the count.
test('helper modules in src/widgets are not counted as widgets', () => {
  const r = run({
    'README.md': '- **2 React/Astro widgets** in src/widgets/\n',
    'src/widgets/useThing.tsx': 'export {};\n',
    'src/widgets/entry-helper.ts': 'export {};\n',
  });
  assert.equal(r.status, 0, r.out);
});

test('page prose is not held to the live chapter count', () => {
  const r = run({ 'src/pages/journey.astro': '<p>Read the 46 chapters in any order.</p>\n' });
  assert.equal(r.status, 0, r.out);
});

test('a deprecated model ID on a nested page fails (pages/**)', () => {
  const r = run({ 'src/pages/opus-5/index.astro': '<td>claude-3-opus</td>\n' });
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /src\/pages\/opus-5\/index\.astro:1/);
});

test('the July present-tense AA gap planted on a nested page fails (issue #8)', () => {
  const r = run({
    'src/pages/opus-5/index.astro': '<td>60.69 vs 59.86 — <strong>0.83 points, against a stated ±1%</strong></td>\n',
  });
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /src\/pages\/opus-5\/index\.astro:1/);
});

test('the dated past-tense AA gap in research notes stays legal', () => {
  const r = run({
    'src/lib/research-notes.ts': "'AA had Opus 5 first by 0.83 points against its own stated ±1% interval'\n",
  });
  assert.equal(r.status, 0, r.out);
});
