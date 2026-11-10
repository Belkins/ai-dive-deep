import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Two animated GIFs (3,152,183 B and 2,576,246 B) now ship with WebM/MP4 versions and a
// poster beside them. Chapters cite screenshots by id, so the scanner must keep every id
// pointing at the same file, never turn a poster into an id, and pair the videos.
const scanner = fileURLToPath(new URL('../scripts/scan-screenshots.py', import.meta.url));
const runScan = (dir) => {
  const code = [
    'import importlib.util, json, sys',
    'spec = importlib.util.spec_from_file_location("scan", sys.argv[1])',
    'm = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)',
    'files, videos = m.scan(sys.argv[2])',
    'print(json.dumps({"files": files, "videos": videos}))',
  ].join('\n');
  const r = spawnSync('python3', ['-I', '-c', code, scanner, dir], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
};

test('a GIF keeps its id and file; its videos and poster are paired, not new ids', () => {
  const dir = mkdtempSync(join(tmpdir(), 'screens-'));
  for (const f of ['a.png', 'b.gif', 'b.webm', 'b.mp4', 'b.poster.webp', 'c.gif', 'd.gif', 'd.mp4']) writeFileSync(join(dir, f), '');
  const { files, videos } = runScan(dir);
  assert.deepEqual(files, { a: 'a.png', b: 'b.gif', c: 'c.gif', d: 'd.gif' });
  assert.deepEqual(videos, {
    b: { sources: ['b.webm', 'b.mp4'], poster: 'b.poster.webp' },
    d: { sources: ['d.mp4'], poster: null },
  });
});

test('the committed map keeps both GIF ids on their GIFs and lists their videos', () => {
  const src = readFileSync(new URL('../src/lib/screenshots.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`).then(({ SCREENSHOTS, SCREENSHOT_COUNT, VIDEOS }) => {
    assert.equal(SCREENSHOT_COUNT, 133);
    assert.equal(SCREENSHOTS['dynamic-workflows-slider'], 'dynamic-workflows-slider.gif');
    assert.equal(SCREENSHOTS['42-codex-on-a-loop-3'], '42-codex-on-a-loop-3.gif');
    assert.ok(!Object.keys(SCREENSHOTS).some((id) => id.endsWith('.poster')), 'a poster became a screenshot id');
    assert.deepEqual(VIDEOS['dynamic-workflows-slider'], {
      sources: ['dynamic-workflows-slider.webm', 'dynamic-workflows-slider.mp4'],
      poster: 'dynamic-workflows-slider.poster.webp',
    });
    assert.deepEqual(VIDEOS['42-codex-on-a-loop-3'], {
      sources: ['42-codex-on-a-loop-3.webm', '42-codex-on-a-loop-3.mp4'],
      poster: '42-codex-on-a-loop-3.poster.webp',
    });
  });
});
