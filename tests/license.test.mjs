import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { loadTs } from './helpers/load-ts.mjs';

const LICENSE = loadTs(new URL('../src/lib/license.ts', import.meta.url));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// Vlad decided one licence statement everywhere (10 Nov 2026): code MIT,
// content CC BY-NC-SA 4.0, as the README badge says. The licence itself did
// not change, so these literals must never drift from the README and the repo files.
test('the licence module states code MIT and content CC BY-NC-SA 4.0', () => {
  assert.equal(LICENSE.CONTENT_LICENSE_NAME, 'CC BY-NC-SA 4.0');
  assert.equal(LICENSE.CONTENT_LICENSE_URL, 'https://creativecommons.org/licenses/by-nc-sa/4.0/');
  assert.equal(LICENSE.CODE_LICENSE_NAME, 'MIT');
  assert.equal(LICENSE.LICENSE_STATEMENT, 'code MIT, content CC BY-NC-SA 4.0');
});

// Every place that states a licence in data reads the one module, so the
// statements cannot disagree again (the Dataset once named llms.txt as its licence).
test('every licence statement in the site data reads the licence module', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  assert.match(layout, /from '@\/lib\/license'/);
  assert.equal((layout.match(/license: CONTENT_LICENSE_URL,/g) ?? []).length, 2, 'Book and chapter Article both carry the content licence');

  const chaptersJson = read('src/pages/chapters.json.ts');
  assert.match(chaptersJson, /license: CONTENT_LICENSE_NAME,/);
  assert.match(chaptersJson, /licenseUrl: CONTENT_LICENSE_URL,/);
  assert.match(chaptersJson, /codeLicense: CODE_LICENSE_NAME,/);
  // The authored access sentence is kept, under its own field.
  assert.match(chaptersJson, /access: 'Reading free\. Citation appreciated\. No email gate\.',/);

  // llms.txt and llms-full.txt carry the same line, right under the authored access sentence.
  for (const path of ['src/pages/llms.txt.ts', 'src/pages/llms-full.txt.ts']) {
    const llms = read(path);
    assert.match(llms, /Free to read and to cite\./, path);
    assert.match(llms, /> License: \$\{LICENSE_STATEMENT\} \(\$\{CONTENT_LICENSE_URL\}\)\./, path);
  }

  // The Radar Dataset names the content licence, not llms.txt.
  const radar = read('src/components/RadarBoard.astro');
  assert.match(radar, /isAccessibleForFree: true, license: CONTENT_LICENSE_URL, url: pageUrl,/);
  assert.doesNotMatch(radar, /license: `\$\{SITE\}\/llms\.txt`/);

  for (const path of ['src/layouts/BaseLayout.astro', 'src/components/RadarBoard.astro', 'src/pages/chapters.json.ts', 'src/pages/llms.txt.ts', 'src/pages/llms-full.txt.ts']) {
    assert.doesNotMatch(read(path), /creativecommons\.org/, `${path} hard-codes a licence URL`);
  }
});

// GitHub detects a licence only when LICENSE holds one licence text.
test('LICENSE holds the MIT text alone and LICENSE-CONTENT the CC BY-NC-SA 4.0 legal code', () => {
  const mit = read('LICENSE');
  assert.equal(mit.split('\n')[0], 'MIT License');
  assert.match(mit, /Copyright \(c\) 2026 Vlad Podoliako/);
  assert.doesNotMatch(mit, /Creative Commons|CC BY-NC-SA/);
  const content = read('LICENSE-CONTENT');
  assert.equal(content.split('\n')[0], 'Attribution-NonCommercial-ShareAlike 4.0 International');
  assert.match(content, /Creative Commons Attribution-NonCommercial-ShareAlike 4\.0 International\nPublic License/);
});
