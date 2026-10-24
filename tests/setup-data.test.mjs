import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const source = readFileSync(new URL('../src/lib/setup.ts', import.meta.url), 'utf8');
const { SKILLS, AGENTS } = await import(`data:text/javascript;base64,${Buffer.from(compile(source)).toString('base64')}`);

// The generator once read a folded YAML description (`description: >-` and indented
// lines) as the bare marker, so /showcase published `>` as a skill's whole description.
// A card is only worth showing if it says what the skill does.
test('every published skill and agent carries a real description', () => {
  for (const item of [...SKILLS, ...AGENTS]) {
    const text = item.description.trim();
    assert.ok(text.length > 0, `${item.name} has no description`);
    assert.doesNotMatch(text, /^[>|][-+]?$/, `${item.name} publishes the YAML block marker as its description`);
  }
});

// The "All" view groups skills by these six keys (SKILL_CATS in SetupShowcase.tsx),
// so a skill filed under any other category silently drops out of it.
test('every skill sits in one of the six groups the All view renders', () => {
  const groups = ['ops', 'review', 'build', 'strategy', 'portfolio', 'meta'];
  for (const skill of SKILLS) assert.ok(groups.includes(skill.category), `${skill.name} is filed under "${skill.category}"`);
});
