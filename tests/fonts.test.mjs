// Source-level guards for the self-hosted fonts (src/styles/fonts.css, public/fonts/).
// Why: the Google Fonts stylesheet blocked first paint on every page. If a third-party
// font link comes back, or a @font-face points at a file that is not shipped, readers
// either wait on another origin again or silently get a fallback typeface.
// Reads source only (CI runs these tests before the build).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const publicFile = (urlPath) => new URL(`../public${urlPath}`, import.meta.url);

const layout = read('src/layouts/BaseLayout.astro');
const fontsCss = read('src/styles/fonts.css');
const fontUrls = [...fontsCss.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]);

test('BaseLayout loads no font from Google', () => {
  assert.equal(layout.includes('fonts.googleapis.com'), false, 'BaseLayout still references fonts.googleapis.com');
  assert.equal(layout.includes('fonts.gstatic.com'), false, 'BaseLayout still references fonts.gstatic.com');
  assert.match(layout, /import '@\/styles\/fonts\.css';/, 'BaseLayout must import the self-hosted @font-face rules');
});

test('every url() in fonts.css names a file under public/', () => {
  // 3 families x 3 subsets (latin, latin-ext, greek), one url() per weight face.
  assert.equal(fontUrls.length, 30, 'expected 30 @font-face src urls');
  for (const u of new Set(fontUrls)) {
    assert.ok(u.startsWith('/fonts/'), `${u} should be a site-root /fonts/ path`);
    assert.ok(existsSync(publicFile(u)), `fonts.css names ${u}, which is missing under public/`);
  }
});

test('each family keeps its latin face with swap', () => {
  for (const family of ['Inter', 'JetBrains Mono', 'Source Serif 4']) {
    assert.ok(fontsCss.includes(`font-family: '${family}';`), `${family} has no @font-face`);
  }
  const faces = fontsCss.match(/@font-face \{/g) ?? [];
  const swaps = fontsCss.match(/font-display: swap;/g) ?? [];
  assert.equal(swaps.length, faces.length, 'every face must use font-display: swap');
});

test('preloads are at most two and each one matches a face in fonts.css', () => {
  const preloads = [...layout.matchAll(/<link rel="preload" href=\{`[^`]*?(\/fonts\/[^`]+)`\} as="font" type="font\/woff2" crossorigin \/>/g)].map((m) => m[1]);
  assert.ok(preloads.length >= 1 && preloads.length <= 2, `expected 1-2 font preloads, found ${preloads.length}`);
  for (const p of preloads) {
    // A preload whose URL no face uses downloads a file twice or for nothing.
    assert.ok(fontUrls.includes(p), `preload ${p} is not used by fonts.css`);
    assert.ok(existsSync(publicFile(p)), `preload ${p} is missing under public/`);
  }
});

test('the font licence ships beside the files', () => {
  const licence = read('public/fonts/LICENSE.txt');
  for (const name of ['Inter', 'JetBrains Mono', 'Source Serif 4', 'SIL OPEN FONT LICENSE Version 1.1']) {
    assert.ok(licence.includes(name), `LICENSE.txt does not name ${name}`);
  }
});
