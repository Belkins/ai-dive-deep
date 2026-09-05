import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../scripts/check-rendered-targets.py', import.meta.url));
function run(files) {
  const root = mkdtempSync(join(tmpdir(), 'dive-targets-'));
  try {
    for (const [name, html] of Object.entries(files)) {
      const path = join(root, name);
      mkdirSync(join(path, '..'), { recursive: true });
      writeFileSync(path, html);
    }
    return spawnSync('python3', [script, root], { encoding: 'utf8' });
  } finally { rmSync(root, { recursive: true, force: true }); }
}

test('rendered target guard accepts real routes, assets, query strings, and encoded fragments', () => {
  const result = run({
    'index.html': '<a href="/guide/?q=agent#A%20B">Guide</a><a href="https://dive.vladyslavpodoliako.com/guide/#A%20B">Absolute</a><a href="/sample.json">Data</a><a href="https://example.com/missing">External</a>',
    'guide/index.html': '<h2 id="A B">A</h2><a href="../#top">Back</a>',
    'sample.json': '{}',
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /missing fragment/);
  const valid = run({ 'index.html': '<p id="top"></p><a href="/guide/?q=1#A%20B">Guide</a>', 'guide/index.html': '<h2 id="A B"></h2><a href="../#top">Back</a><a href="https://example.com/missing">External</a><script>const fake = \'<a href="/missing/">\';</script>' });
  assert.equal(valid.status, 0, valid.stdout + valid.stderr);
});

test('rendered target guard catches missing interpolated destinations and wrong plus-encoded fragments', () => {
  const result = run({ 'index.html': '<a href="/missing/">Broken</a><a href="/glossary/#A+B">Wrong encoding</a>', 'glossary/index.html': '<div id="A B"></div>' });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /\/missing\/ \(missing destination\)/);
  assert.match(result.stdout, /A\+B \(missing fragment\)/);
});

test('relative artifact links resolve beside the artifact, not at the site root', () => {
  const result = run({ 'artifacts/robots.html': '<a href="pitch.html#plan">Pitch</a>', 'artifacts/pitch.html': '<h2 id="plan"></h2>' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('an empty build cannot pass rendered validation', () => {
  assert.equal(run({}).status, 1);
});

test('inert nested templates contribute no links, fragment targets, or base URLs', () => {
  const valid = run({
    'index.html': '<template id="template-node"><a href="/missing/" id="ghost" name="legacy"></a><template><a href="/also-missing/">Inert</a></template><base href="/elsewhere/"><a href="/still-inert/">Inert</a></template><a href="#template-node">Template node</a><a href="/guide/#real">Guide</a>',
    'guide/index.html': '<h2 id="real">Real heading</h2>',
  });
  assert.equal(valid.status, 0, valid.stdout + valid.stderr);

  const broken = run({
    'index.html': '<template><h2 id="ghost">Inert heading</h2><template><a name="legacy"></a></template></template><a href="#ghost">Broken</a><a href="#legacy">Also broken</a>',
  });
  assert.equal(broken.status, 1);
  assert.match(broken.stdout, /#ghost \(missing fragment\)/);
  assert.match(broken.stdout, /#legacy \(missing fragment\)/);
});

test('a self-closing template slash does not expose its inert contents', () => {
  const result = run({
    'index.html': '<template/><h2 id="ghost">Inert</h2></template><a href="#ghost">Broken</a>',
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /#ghost \(missing fragment\)/);
});

test('the first href attribute wins, including empty and valueless attributes', () => {
  const broken = run({
    'index.html': '<a HREF="/missing/" href="/guide/">Broken first destination</a>',
    'guide/index.html': '<p>Guide</p>',
  });
  assert.equal(broken.status, 1);
  assert.match(broken.stdout, /\/missing\/ \(missing destination\)/);

  const valid = run({
    'index.html': '<a href="/guide/" href="/missing/">Valid first destination</a><a href="" href="/missing/">Empty first</a><a href href="/missing/">Valueless first</a>',
    'guide/index.html': '<p>Guide</p>',
  });
  assert.equal(valid.status, 0, valid.stdout + valid.stderr);
});

test('later duplicate id and name attributes cannot satisfy fragment links', () => {
  const result = run({
    'index.html': '<h2 id="real" id="ghost">Heading</h2><a name="legacy" name="ghost-name"></a><a href="#real">Valid</a><a href="#legacy">Valid</a><a href="#ghost">Broken</a><a href="#ghost-name">Broken</a>',
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /#ghost \(missing fragment\)/);
  assert.match(result.stdout, /#ghost-name \(missing fragment\)/);
  assert.doesNotMatch(result.stdout, /#(?:real|legacy) \(missing fragment\)/);
});

test('active base href is rejected even when document-relative targets would pass', () => {
  for (const base of ['<base href="/missing/">', '<base href="https://example.com/">', '<base href="">', '<base href>']) {
    const result = run({
      'index.html': `${base}<a href="target.html">Wrong resolution</a>`,
      'target.html': '<p>Document-relative target exists</p>',
    });
    assert.equal(result.status, 1, base);
    assert.match(result.stdout, /<base href> \(unsupported base URL\)/);
  }
  assert.equal(run({ 'index.html': '<base href="/missing/">' }).status, 1);
});

test('base target without href does not change destination resolution', () => {
  const result = run({
    'index.html': '<base target="_blank"><a href="target.html">Target</a>',
    'target.html': '<p>Target exists</p>',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
