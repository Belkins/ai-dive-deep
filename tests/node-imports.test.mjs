import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// package.json still allows Node 20 (engines >=20), which cannot import a TypeScript file.
// Newer Node strips types by itself, so such an import passes every check on the Node 26
// the workflows run and breaks on Node 20. A .mjs file is one Node loads directly (the Astro
// config, the scripts, these tests), so none of them may import a .ts or .tsx file. Read a
// TypeScript module in a test through tests/helpers/load-ts.mjs; give the config a .mjs helper.
const repo = fileURLToPath(new URL('..', import.meta.url));
const SKIP = new Set(['node_modules', 'dist', '.git', '.astro', '.claude', '.vercel']);
const TS_IMPORT = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])([^'"\n]+\.tsx?)\1/g;

function typeScriptImports(source) {
  return [...source.matchAll(TS_IMPORT)].map((match) => ({
    specifier: match[2],
    line: source.slice(0, match.index).split('\n').length,
  }));
}

function moduleFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return SKIP.has(entry.name) ? [] : moduleFiles(join(dir, entry.name));
    return entry.name.endsWith('.mjs') ? [join(dir, entry.name)] : [];
  });
}

test('an import of a TypeScript file is found in each of its forms, and a path that is only read is not', () => {
  const ts = ['./lib/seo', 'ts'].join('.');
  const tsx = ['../widgets/Card', 'tsx'].join('.');
  const planted = [
    `import { a } from '${ts}';`,
    `const b = await import("${ts}");`,
    `import '${ts}';`,
    `export { c } from '${tsx}';`,
  ].join('\n');
  assert.deepEqual(typeScriptImports(planted), [
    { specifier: ts, line: 1 },
    { specifier: ts, line: 2 },
    { specifier: ts, line: 3 },
    { specifier: tsx, line: 4 },
  ]);

  const allowed = [
    `const source = readFileSync(new URL('${ts}', import.meta.url), 'utf8');`,
    `const mod = loadTs(new URL('${ts}', import.meta.url));`,
    "import { d } from './lib/radar-config.mjs';",
  ].join('\n');
  assert.deepEqual(typeScriptImports(allowed), []);
});

test('no file that Node loads directly imports a TypeScript file', () => {
  const files = moduleFiles(repo);
  assert.ok(files.some((file) => relative(repo, file) === 'astro.config.mjs'), 'the scan missed astro.config.mjs');
  assert.ok(files.length >= 20, `the scan found only ${files.length} .mjs files`);
  const found = files.flatMap((file) =>
    typeScriptImports(readFileSync(file, 'utf8')).map(({ specifier, line }) => `${relative(repo, file)}:${line} imports ${specifier}`),
  );
  assert.deepEqual(found, []);
});
