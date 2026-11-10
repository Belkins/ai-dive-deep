import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
  // Each licence line is read inside its own JSON-LD block, as that block's last key: a condition
  // or spread around it would take the licence off every chapter (or off the home page) while
  // the words stay in the file.
  const articleAt = layout.indexOf("'@type': 'Article'");
  const rootAt = layout.indexOf(': isRoot', articleAt);
  const bookAt = layout.indexOf("'@type': 'Book'", rootAt);
  const webPageAt = layout.indexOf("'@type': 'WebPage'", bookAt);
  assert.ok(articleAt > 0 && rootAt > articleAt && bookAt > rootAt && webPageAt > bookAt, 'the Article, Book and WebPage blocks are found in that order');
  assert.ok(layout.slice(articleAt, rootAt).trimEnd().endsWith("      inLanguage: 'en',\n      license: CONTENT_LICENSE_URL,\n    }"),
    'the chapter Article ends with the content licence, with no condition around it');
  assert.ok(layout.slice(bookAt, webPageAt).includes("        inLanguage: 'en',\n        license: CONTENT_LICENSE_URL,\n      }\n    : {"),
    'the home page Book ends with the content licence, with no condition around it');
  assert.equal((layout.match(/CONTENT_LICENSE_URL/g) ?? []).length, 3, 'one import and the two uses above');

  const chaptersJson = read('src/pages/chapters.json.ts');
  assert.match(chaptersJson, /license: CONTENT_LICENSE_NAME,/);
  assert.match(chaptersJson, /licenseUrl: CONTENT_LICENSE_URL,/);
  assert.match(chaptersJson, /codeLicense: CODE_LICENSE_NAME,/);
  // The authored access sentence is kept, under its own field.
  assert.match(chaptersJson, /access: 'Reading free\. Citation appreciated\. No email gate\.',/);

  // llms.txt and llms-full.txt carry the same line, right under the authored access sentence,
  // and always: the two statements are matched as whole consecutive lines, so an `if` in front
  // of the push, or the line moved elsewhere, fails here.
  const accessThenLicence = '  lines.push("> No email gate. No upsell. Free to read and to cite.");\n'
    + '  lines.push(`> License: ${LICENSE_STATEMENT} (${CONTENT_LICENSE_URL}).`);\n';
  for (const path of ['src/pages/llms.txt.ts', 'src/pages/llms-full.txt.ts']) {
    assert.ok(read(path).includes(accessThenLicence), `${path}: the licence line follows the access sentence, with no condition`);
  }

  // The Radar Dataset names the content licence, not llms.txt.
  const radar = read('src/components/RadarBoard.astro');
  assert.match(radar, /isAccessibleForFree: true, license: CONTENT_LICENSE_URL, url: pageUrl,/);
  assert.doesNotMatch(radar, /license: `\$\{SITE\}\/llms\.txt`/);

  for (const path of ['src/layouts/BaseLayout.astro', 'src/components/RadarBoard.astro', 'src/pages/chapters.json.ts', 'src/pages/llms.txt.ts', 'src/pages/llms-full.txt.ts']) {
    assert.doesNotMatch(read(path), /creativecommons\.org/, `${path} hard-codes a licence URL`);
  }
});

// GitHub detects a licence only when LICENSE holds one licence text, whole. The MIT wording is
// written out here because a licence file with a paragraph missing still looks like a licence.
const MIT_TEXT = `MIT License

Copyright (c) 2026 Vlad Podoliako

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

test('LICENSE holds the MIT text alone and LICENSE-CONTENT the CC BY-NC-SA 4.0 legal code', () => {
  assert.equal(read('LICENSE'), MIT_TEXT);
  // LICENSE-CONTENT is Creative Commons' own file, byte for byte:
  // https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.txt, compared on 11 Nov 2026.
  const content = readFileSync(new URL('../LICENSE-CONTENT', import.meta.url));
  assert.equal(content.toString('utf8').split('\n')[0], 'Attribution-NonCommercial-ShareAlike 4.0 International');
  assert.equal(content.length, 20850, 'LICENSE-CONTENT byte length');
  assert.equal(createHash('sha256').update(content).digest('hex'),
    'e66c269d4819aaab34b49ef5220c4ddab6756f21bb5180761a4eb8561f2b7bbd', 'LICENSE-CONTENT differs from the Creative Commons legal code');
});
