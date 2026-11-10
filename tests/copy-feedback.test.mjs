import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

// Copy buttons are the Playbook's core promise (copyable hooks, skills, prompts). A copy that the
// clipboard refuses must be reported, never shown as success, and every copy button must speak
// through the one shared helper so screen-reader users hear the same two messages everywhere.
const source = readFileSync(new URL('../src/lib/copy-feedback.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { copyText, copyMessage, COPY_SUCCESS_MESSAGE, COPY_FAILURE_MESSAGE } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('a copy the clipboard accepts reports copied and writes the exact text', async () => {
  const written = [];
  const result = await copyText('30 7 * * 1-5', { writeText: async (t) => { written.push(t); } });
  assert.equal(result, 'copied');
  assert.deepEqual(written, ['30 7 * * 1-5']);
});

test('a copy the clipboard refuses reports failed instead of throwing or claiming success', async () => {
  assert.equal(await copyText('x', { writeText: () => Promise.reject(new Error('NotAllowedError')) }), 'failed');
  assert.equal(await copyText('x', { writeText: () => { throw new Error('sync throw'); } }), 'failed');
});

test('a page without a clipboard API (insecure origin, old browser) reports failed', async () => {
  assert.equal(await copyText('x', undefined), 'failed');
  assert.equal(await copyText('x', null), 'failed');
  assert.equal(await copyText('x', {}), 'failed');
});

test('the two announced messages are the agreed wording', () => {
  assert.equal(COPY_SUCCESS_MESSAGE, 'Copied to clipboard');
  assert.equal(COPY_FAILURE_MESSAGE, 'Copy failed. Select the text and copy it by hand.');
  assert.equal(copyMessage('copied'), 'Copied to clipboard');
  assert.equal(copyMessage('failed'), 'Copy failed. Select the text and copy it by hand.');
});

const CALL_SITES = [
  'src/widgets/CopyBlock.tsx',
  'src/widgets/CronBuilder.tsx',
  'src/widgets/SkillComposer.tsx',
  'src/widgets/StarterSkillCard.tsx',
  'src/widgets/TierListBuilder.tsx',
  'src/pages/cfo-case.astro',
  'src/pages/research-notes.astro',
];

test('every copy button goes through the shared helper and shows the failure text', () => {
  for (const file of CALL_SITES) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(text, /navigator\.clipboard/, `${file} calls the clipboard directly, bypassing the shared feedback`);
    // Used in a ternary, not only imported: the button shows the failure text on a failed copy.
    assert.match(text, /[?:]\s*COPY_FAILURE_MESSAGE\b/, `${file} never shows the failure message`);
    if (file.endsWith('.tsx')) assert.match(text, /<CopyLiveRegion message=/, `${file} renders no live region`);
    else assert.match(text, /copyLiveRegion\(\)/, `${file} creates no live region`);
  }
});
