import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { loadTs } from './helpers/load-ts.mjs';

// The popover once printed its definition as text, so 44 of the 105 glossary
// definitions showed literal <code> and <a href=...> tags to readers, and its related
// terms were plain spans. Radix renders nothing while closed, so the Radix parts are
// replaced with pass-through stubs that also record the props the content receives.
const { glossary } = loadTs(new URL('../src/lib/glossary.ts', import.meta.url));
const contentProps = [];
const pass = ({ children }) => createElement(Fragment, null, children);
const radix = {
  Root: pass,
  Trigger: pass,
  Portal: pass,
  Arrow: () => null,
  Content: ({ children, ...props }) => {
    contentProps.push(props);
    return createElement('div', { 'data-popover-content': '' }, children);
  },
};

const widgetUrl = new URL('../src/widgets/GlossaryPopover.tsx', import.meta.url);
const { outputText } = ts.transpileModule(readFileSync(widgetUrl, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
});
const widget = {};
const req = createRequire(widgetUrl);
// import.meta is not allowed in a Function body; BASE_URL is unset here, so base is ''.
new Function('require', 'exports', 'importMeta', outputText.replaceAll('import.meta', 'importMeta'))(
  (name) => (name === '@radix-ui/react-popover' ? radix : name === '@/lib/glossary' ? { glossary } : req(name)),
  widget,
  { env: {} },
);
const render = (term) => renderToStaticMarkup(createElement(widget.default, { term }, term));

test('every popover definition is rendered as the HTML it is written in, not as text', () => {
  const terms = Object.keys(glossary);
  assert.equal(terms.length, 105);
  // Escaped as text, a definition holding <code>, <a> or an entity would not appear verbatim.
  const asText = terms.filter((t) => !render(t).includes(`>${glossary[t].definition}</div>`));
  assert.deepEqual(asText, []);
});

test('the Opus 5 definition renders its code and links as elements', () => {
  const html = render('Opus 5');
  assert.match(html, /<code>claude-opus-5<\/code>/);
  assert.match(html, /<a href="\/glossary\/#Opus%205\.5">Opus 5\.5<\/a>/);
});

test('related terms are links to the anchors the /glossary page gives each term', () => {
  const html = render('Opus 5');
  for (const [term, href] of [
    ['Opus 5.5', '/glossary/#Opus%205.5'],
    ['Effort dial', '/glossary/#Effort%20dial'],
    ['Fable 5', '/glossary/#Fable%205'],
    ['Sonnet 5', '/glossary/#Sonnet%205'],
  ]) {
    assert.ok(html.includes(`<a href="${href}" style="text-decoration:underline">${term}</a>`), `${term} is not a link to ${href}`);
  }
  // /glossary gives each entry id={term}; every related link must land on one.
  for (const entry of Object.values(glossary)) {
    for (const r of entry.related ?? []) {
      assert.ok(Object.hasOwn(glossary, r), `${entry.term} relates to ${r}, which has no glossary entry`);
    }
  }
});

test('the popover is height-capped and kept 12px inside the viewport', () => {
  contentProps.length = 0;
  render('Opus 5');
  const [props] = contentProps;
  assert.equal(props.collisionPadding, 12);
  assert.match(props.style.maxHeight, /^min\(60vh, 22rem/);
  assert.equal(props.style.overflowY, 'auto');
});
