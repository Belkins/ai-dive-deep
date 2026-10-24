import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const source = readFileSync(new URL('../src/lib/setup.ts', import.meta.url), 'utf8');
const setup = await import(`data:text/javascript;base64,${Buffer.from(compile(source)).toString('base64')}`);
const { SKILLS, AGENTS, SETUP_STATS } = setup;
const generator = readFileSync(new URL('../scripts/build-setup-data.py', import.meta.url), 'utf8');

// The generator once read a folded YAML description (`description: >-` and indented
// lines) as the bare marker, so /showcase published `>` as a skill's whole description.
// A card is only worth showing if it says what the skill does.
test('every published skill and agent carries a real description', () => {
  for (const item of [...SKILLS, ...AGENTS]) {
    const text = item.description.trim();
    assert.ok(text.length > 0, `${item.name} has no description`);
    assert.doesNotMatch(text, /^[>|][-+]?$/, `${item.name} publishes the YAML block marker as its description`);
  }
  // use-railway's description is a folded block over five lines. The card shows all five
  // joined with spaces, cut like every card at the generator's existing 360-character cap.
  // The patterns come from line one, the join of lines one and two, line four, line five,
  // and the cut itself, which moves if the cap does.
  const railway = SKILLS.find((skill) => skill.name === 'use-railway')?.description ?? '';
  assert.match(railway, /^Operate Railway infrastructure: projects, services/);
  assert.match(railway, /buckets, deploys, environments/);
  assert.match(railway, /railway\.toml/);
  assert.match(railway, /Do NOT fire for Vercel/);
  assert.match(railway, /generic deployment\/build-failure\/M…$/);
});

// A skill missing from SKILL_CATEGORIES falls back to Meta, which is how use-railway
// sat under Meta on main. Every published skill is filed on purpose.
test('every published skill has its own SKILL_CATEGORIES entry', () => {
  const map = generator.slice(generator.indexOf('SKILL_CATEGORIES = {'), generator.indexOf('PLUGIN_CATEGORIES = {'));
  const filed = new Set([...map.matchAll(/'([a-z0-9-]+)':/g)].map((match) => match[1]));
  for (const skill of SKILLS) assert.ok(filed.has(skill.name), `${skill.name} has no SKILL_CATEGORIES entry`);
});

// The page's copy (the date in the meta description, the garden sentence's "36 more
// skills gone, 24 new") describes the 2026-10-24 snapshot. The copy and the counts are
// pinned together, so regenerated data fails here until the copy is re-dated with it.
test('the published snapshot is the 2026-10-24 one the page describes', () => {
  const page = readFileSync(new URL('../src/pages/showcase.astro', import.meta.url), 'utf8');
  assert.ok(page.includes('refreshed 2026-10-24'), 'the meta description is not dated 2026-10-24');
  assert.ok(page.includes('The 2026-10-24 refresh'), 'the garden paragraph does not name the 2026-10-24 refresh');
  assert.deepEqual({ ...SETUP_STATS }, { skills: 54, agents: 0, plugins: 10 });
  const counts = {};
  for (const skill of SKILLS) counts[skill.category] = (counts[skill.category] ?? 0) + 1;
  assert.deepEqual(counts, { ops: 7, review: 15, build: 18, strategy: 6, portfolio: 1, meta: 7 });
});

// setup.ts is published as generated, so this checks the published text, not the
// generator: nothing strips a home-directory path or an address. The scrubbed names
// are checked in every tracked file by tests/private-names.test.mjs.
test('the published data carries no home-directory path or email address', () => {
  assert.doesNotMatch(source, /\/Users\//);
  assert.doesNotMatch(source, /[\w.+-]+@[\w-]+\.[\w.-]+/);
});

const widget = ts.transpileModule(readFileSync(new URL('../src/widgets/SetupShowcase.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const require = createRequire(import.meta.url);
function renderShowcase(data) {
  const exports = {};
  new Function('require', 'exports', widget)((name) => (name === '@/lib/setup' ? data : require(name)), exports);
  return renderToStaticMarkup(createElement(exports.default));
}

// An Agents tab with no agents opens on "No matches.", so it stays hidden while the
// custom-agents folder is empty and comes back with the first agent.
test('the Agents tab shows only when there are agents', () => {
  const html = renderShowcase(setup);
  assert.ok(html.includes('Skills · 54'), 'the Skills tab is missing its count');
  assert.ok(html.includes('Plugins · 10'), 'the Plugins tab is missing its count');
  assert.ok(!html.includes('Agents ·'), 'an empty Agents tab is shown');
  const withAgent = renderShowcase({ ...setup, AGENTS: [{ name: 'probe', description: 'A probe agent.', category: 'agent' }] });
  assert.ok(withAgent.includes('Agents · 1'), 'the Agents tab stays hidden with an agent present');
});

// The All view renders one group per SKILL_CATS key, so a skill filed under any other
// category, or a renamed or dropped key, loses skills here even when the data is right.
test('the All view renders the six groups with 54 skills between them', () => {
  const groups = [...renderShowcase(setup).matchAll(/<h3[^>]*>([^<]+)<\/h3>[\s\S]*?>(\d+)<\/span>/g)].map((match) => [match[1], Number(match[2])]);
  assert.deepEqual(groups, [['Daily ops', 7], ['Code review + QA', 15], ['Build + ship', 18], ['Strategy + research', 6], ['Portfolio-specific', 1], ['Meta', 7]]);
});
