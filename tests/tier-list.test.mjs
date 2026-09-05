import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function compile(source) {
  return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
}
const source = readFileSync(new URL('../src/lib/tier-list.ts', import.meta.url), 'utf8');
const { sanitizePlacements, restorePlacements, groupPlacements, isTier, TIER_ORDER } = await import(`data:text/javascript;base64,${Buffer.from(compile(source)).toString('base64')}`);
const defaults = Object.freeze({ 'Claude Code': 'S', Cowork: 'A', Cursor: 'B' });
const sharedHash = (value) => `#tl=${encodeURIComponent(btoa(JSON.stringify(value)))}`;

test('every supported tier round-trips through the existing shared URL format', () => {
  for (const tier of TIER_ORDER) {
    assert.equal(isTier(tier), true);
    assert.deepEqual(restorePlacements(sharedHash({ 'Claude Code': tier }), null, defaults), { ...defaults, 'Claude Code': tier });
  }
});

test('unknown tools and invalid tier values are discarded without losing valid choices', () => {
  for (const invalid of ['X', 's', 'S ', 'constructor', '__proto__', 'toString', [], {}, true, null, 1]) {
    const sanitized = sanitizePlacements({ 'Claude Code': invalid, Cowork: 'F', retired: 'S' }, defaults);
    assert.deepEqual(sanitized, { ...defaults, Cowork: 'F' });
    assert.doesNotThrow(() => groupPlacements(sanitized, Object.keys(defaults)));
  }
});

test('prototype-related and arbitrary payload keys never enter restored state or global prototypes', () => {
  const raw = '{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},"prototype":"S","toString":"F","Claude Code":"D"}';
  const sanitized = restorePlacements(`#tl=${encodeURIComponent(btoa(raw))}`, null, defaults);
  assert.deepEqual(sanitized, { ...defaults, 'Claude Code': 'D' });
  assert.deepEqual(Object.keys(sanitized), Object.keys(defaults));
  assert.equal(Object.getPrototypeOf(sanitized), Object.prototype);
  assert.equal(Object.hasOwn(sanitized, '__proto__'), false);
  assert.equal(Object.hasOwn(sanitized, 'constructor'), false);
  assert.equal({}.polluted, undefined);
});

test('inherited tool placements and getters are not trusted or executed', () => {
  const payload = Object.create({ 'Claude Code': 'F' });
  Object.defineProperty(payload, 'Cowork', { get() { throw new Error('untrusted getter'); } });
  payload.Cursor = 'D';
  assert.deepEqual(sanitizePlacements(payload, defaults), { ...defaults, Cursor: 'D' });
});

test('null, arrays and non-object storage payloads restore defaults', () => {
  for (const raw of ['null', '[]', '["S"]', 'false', '42', '"S"', 'not json', null]) {
    assert.deepEqual(restorePlacements('', raw, defaults), defaults);
  }
});

test('a valid shared ranking takes precedence over storage', () => {
  assert.deepEqual(restorePlacements(sharedHash({ Cowork: 'C' }), JSON.stringify({ Cowork: 'D' }), defaults), { ...defaults, Cowork: 'C' });
});

test('malformed, non-object and oversized shared payloads fall back to valid storage', () => {
  const stored = JSON.stringify({ Cowork: 'F' });
  for (const hash of ['#tl=%ZZ', '#tl=!!!!', sharedHash(null), sharedHash([]), '#other', `#tl=${'A'.repeat(40_000)}`]) {
    assert.deepEqual(restorePlacements(hash, stored, defaults), { ...defaults, Cowork: 'F' });
  }
  assert.deepEqual(restorePlacements('', JSON.stringify({ padding: 'x'.repeat(20_000), Cowork: 'F' }), defaults), defaults);
});

test('restoration does not mutate defaults and returns a fresh object', () => {
  const result = restorePlacements('', null, defaults);
  assert.notEqual(result, defaults);
  result.Cowork = 'F';
  assert.equal(defaults.Cowork, 'A');
  assert.equal(restorePlacements('', null, defaults).Cowork, 'A');
});

test('grouping handles invalid runtime values defensively and includes each known tool once', () => {
  const groups = groupPlacements({ 'Claude Code': 'constructor', Cowork: 'F', Cursor: {}, unexpected: 'S' }, Object.keys(defaults));
  assert.deepEqual(groups.F, ['Cowork']);
  assert.deepEqual(groups.pool, ['Claude Code', 'Cursor']);
  assert.equal(Object.values(groups).flat().length, Object.keys(defaults).length);
});

const widgetSource = readFileSync(new URL('../src/widgets/TierListBuilder.tsx', import.meta.url), 'utf8');
const ast = ts.createSourceFile('TierListBuilder.tsx', widgetSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const defaultDeclaration = ast.statements.filter(ts.isVariableStatement).flatMap((statement) => [...statement.declarationList.declarations])
  .find((declaration) => declaration.name.getText(ast) === 'DEFAULT_PLACEMENTS');
const realDefaultsContext = {};
runInNewContext(compile(`globalThis.defaults = ${defaultDeclaration.initializer.getText(ast)};`), realDefaultsContext);

test('all shipped tool names survive an unchanged share round-trip', () => {
  const real = JSON.parse(JSON.stringify(realDefaultsContext.defaults));
  assert.ok(Object.keys(real).length > 20);
  assert.deepEqual(restorePlacements(sharedHash(real), null, real), real);
});

test('the persistence effect cannot overwrite stored state before hydration completes', () => {
  const component = ast.statements.find((statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === 'TierListBuilder');
  const effects = component.body.statements.filter(ts.isExpressionStatement)
    .map((statement) => statement.expression)
    .filter((expression) => ts.isCallExpression(expression) && expression.expression.getText(ast) === 'useEffect');
  const persist = effects.find((effect) => effect.arguments[0].getText(ast).includes('localStorage.setItem'));
  const writes = [];
  const context = { hydrated: false, placements: defaults, STORAGE_KEY: 'cc-tier-list', localStorage: { setItem: (...args) => writes.push(args) } };
  const code = compile(`(${persist.arguments[0].getText(ast)})();`);
  runInNewContext(code, context);
  assert.equal(writes.length, 0);
  context.hydrated = true;
  runInNewContext(code, context);
  assert.deepEqual(writes, [['cc-tier-list', JSON.stringify(defaults)]]);
});
