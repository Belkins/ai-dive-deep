import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// scripts/build-setup-data.py reads the names it scrubs from private/venture-map.json,
// which .gitignore keeps out of this public repo. The repo keeps only hashes of each
// name: [its word count, SHA-256 of its lowercase words joined by spaces] and [1, SHA-256
// of those words run together]. That finds the name however it is cased or punctuated,
// without the repo spelling it.
const NAME_HASHES = [
  [2, '59ba69401a67e224fac2afbd023be57112aa7aef1fdd16744c80b671934717f3'],
  [1, 'ad32be5d2d3ecb1ef033a12cb2a29d7a5a3fead57879ad32db537baa4f0ae212'],
];

const root = fileURLToPath(new URL('..', import.meta.url));
const words = (text) => text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const key = ([count, hash]) => `${count}:${hash}`;

test('no tracked file contains a scrubbed name, however it is written', () => {
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  assert.ok(files.includes('src/lib/setup.ts'), 'git ls-files did not list the published data');
  const wanted = new Set(NAME_HASHES.map(key));
  const counts = new Set(NAME_HASHES.map(([count]) => count));
  const hits = [];
  for (const file of files) {
    const bytes = readFileSync(join(root, file));
    if (bytes.includes(0)) continue; // binary, by git's own test
    const tokens = words(bytes.toString('utf8'));
    for (const count of counts) {
      const runs = new Set();
      for (let i = 0; i + count <= tokens.length; i++) runs.add(tokens.slice(i, i + count).join(' '));
      for (const run of runs) if (wanted.has(key([count, sha256(run)]))) hits.push(file);
    }
  }
  assert.deepEqual(hits, [], 'these files contain a name the scrub keeps off /showcase');
});

// The list exists only where the data is generated, so CI skips this. Where it exists,
// the hashes above must match it exactly, or a name added to it later goes unchecked.
const MAP = join(root, 'private', 'venture-map.json');
test('the stored hashes match the local scrub list', { skip: !existsSync(MAP) && 'private/venture-map.json is not on this machine' }, () => {
  const names = Object.keys(JSON.parse(readFileSync(MAP, 'utf8')));
  const pairs = names.flatMap((name) => [[words(name).length, sha256(words(name).join(' '))], [1, sha256(words(name).join(''))]]);
  assert.deepEqual([...new Set(pairs.map(key))].sort(), NAME_HASHES.map(key).sort());
});
