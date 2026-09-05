import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Match the existing in-memory TypeScript tests while resolving local imports.
export function loadTs(url, overrides = {}, cache = new Map()) {
  const filename = fileURLToPath(url);
  if (cache.has(filename)) return cache.get(filename);
  const source = readFileSync(url, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  cache.set(filename, exports);
  const require = createRequire(url);
  new Function('require', 'exports', outputText)((name) => {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name.startsWith('.') || name.startsWith('@/')) {
      const base = name.startsWith('@/') ? new URL(`../../src/${name.slice(2)}`, import.meta.url) : new URL(name, url);
      const target = ['.ts', '.tsx'].map(ext => new URL(`${base.href}${ext}`)).find(existsSync);
      if (target) return loadTs(target, overrides, cache);
    }
    return require(name);
  }, exports);
  return exports;
}
