import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { parse } from 'yaml';

const generator = new URL('../scripts/gen-chapter-dates.py', import.meta.url);
const mapPath = 'src/data/chapter-dates.json';
const chapterPath = (slug) => `src/content/chapters/${slug}.mdx`;
// Fixture git commands must never inherit the caller's worktree or index.
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
Object.assign(env, { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' });

function git(root, args, extraEnv = {}) {
  const result = spawnSync('git', [
    '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false',
    '-c', 'user.name=Metadata fixture', '-c', 'user.email=metadata@example.test', ...args,
  ], { cwd: root, env: { ...env, ...extraEnv }, encoding: 'utf8', timeout: 10000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function fixture(t, { repository = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'dive-chapter-dates-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ['scripts', 'src/content/chapters', 'src/data']) {
    mkdirSync(join(root, directory), { recursive: true });
  }
  copyFileSync(generator, join(root, 'scripts/gen-chapter-dates.py'));
  writeFileSync(join(root, mapPath), '{}\n');
  if (repository) git(root, ['init', '--initial-branch=main']);
  return root;
}

function commit(root, paths, authorDate) {
  git(root, ['add', '--', ...paths]);
  git(root, ['commit', '-m', 'Fixture content change'], {
    GIT_AUTHOR_DATE: `${authorDate}T12:00:00+02:00`,
    GIT_COMMITTER_DATE: '2025-01-01T12:00:00Z',
  });
}

function generate(root) {
  return spawnSync('python3', ['scripts/gen-chapter-dates.py'], {
    cwd: root, env, encoding: 'utf8', timeout: 10000,
  });
}

function dates(root) {
  const result = generate(root);
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(readFileSync(join(root, mapPath), 'utf8'));
}

test('chapter author history sets dates; rebuilds and unrelated commits do not refresh them', (t) => {
  const root = fixture(t);
  const first = chapterPath('01-first');
  const second = chapterPath('02-second');
  writeFileSync(join(root, first), '# First chapter\n');
  writeFileSync(join(root, second), '# Second chapter\n');
  commit(root, [first, second], '2020-01-02');
  writeFileSync(join(root, first), '# First chapter\nA substantive update.\n');
  commit(root, [first], '2020-02-03');
  const expected = {
    '01-first': { published: '2020-01-02', modified: '2020-02-03' },
    '02-second': { published: '2020-01-02', modified: '2020-01-02' },
  };
  assert.deepEqual(dates(root), expected);
  const before = readFileSync(join(root, mapPath), 'utf8');
  writeFileSync(join(root, 'unrelated.txt'), 'An unrelated release\n');
  commit(root, ['unrelated.txt'], '2020-03-04');
  assert.deepEqual(dates(root), expected);
  assert.equal(readFileSync(join(root, mapPath), 'utf8'), before);
  assert.deepEqual(dates(root), expected, 'rebuilding must be deterministic');
});

test('newly committed chapters enter the map while uncommitted chapters get no invented dates', (t) => {
  const root = fixture(t);
  writeFileSync(join(root, chapterPath('49-new')), '# Chapter 49\n');
  commit(root, [chapterPath('49-new')], '2020-04-05');
  writeFileSync(join(root, chapterPath('50-new')), '# Chapter 50\n');
  assert.deepEqual(dates(root), { '49-new': { published: '2020-04-05', modified: '2020-04-05' } });
  commit(root, [chapterPath('50-new')], '2020-05-06');
  assert.deepEqual(dates(root), {
    '49-new': { published: '2020-04-05', modified: '2020-04-05' },
    '50-new': { published: '2020-05-06', modified: '2020-05-06' },
  });
});

test('following a chapter rename preserves its original publication date', (t) => {
  const root = fixture(t);
  const original = chapterPath('01-original');
  const renamed = chapterPath('01-renamed');
  writeFileSync(join(root, original), '# A chapter with history\n');
  commit(root, [original], '2020-01-02');
  git(root, ['mv', original, renamed]);
  commit(root, [renamed], '2020-06-07');
  assert.deepEqual(dates(root), { '01-renamed': { published: '2020-01-02', modified: '2020-06-07' } });
});

test('a shallow checkout fails without rewriting stale data, then succeeds with full history', (t) => {
  const root = fixture(t);
  const chapter = chapterPath('01-first');
  writeFileSync(join(root, chapter), '# First version\n');
  commit(root, [chapter, mapPath, 'scripts/gen-chapter-dates.py'], '2020-01-02');
  writeFileSync(join(root, chapter), '# Updated version\n');
  commit(root, [chapter], '2020-02-03');
  const shallow = join(root, 'shallow');
  git(root, ['clone', '--depth=1', pathToFileURL(root).href, shallow]);
  assert.equal(git(shallow, ['rev-parse', '--is-shallow-repository']), 'true');
  const result = generate(shallow);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /full git history required.*fetch-depth: 0/);
  assert.equal(readFileSync(join(shallow, mapPath), 'utf8'), '{}\n');
  git(shallow, ['fetch', '--unshallow']);
  assert.deepEqual(dates(shallow), { '01-first': { published: '2020-01-02', modified: '2020-02-03' } });
});

test('an export without git history fails instead of silently reusing cached dates', (t) => {
  const root = fixture(t, { repository: false });
  const result = generate(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /git history unavailable/);
  assert.equal(readFileSync(join(root, mapPath), 'utf8'), '{}\n');
});

test('verification and deployment build jobs fetch full history before generating metadata', () => {
  for (const [file, job] of [['verify.yml', 'verify'], ['deploy.yml', 'build']]) {
    const workflow = parse(readFileSync(new URL(`../.github/workflows/${file}`, import.meta.url), 'utf8'));
    const steps = workflow.jobs[job].steps;
    const checkout = steps.findIndex((step) => step.uses?.startsWith('actions/checkout@'));
    const build = steps.findIndex((step) => step.run === 'npm run build');
    assert.ok(checkout >= 0 && build > checkout, file);
    assert.equal(steps[checkout].with?.['fetch-depth'], 0, file);
  }
});
