import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/ChapterToc.astro', import.meta.url), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
const compiled = ts.transpileModule(script, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;

function page(ids = ['first', 'second', 'third']) {
  const links = ids.map((id) => {
    const attributes = new Map([['data-toc-link', id]]);
    return {
      getAttribute: (name) => attributes.get(name) ?? null,
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: (name) => attributes.delete(name),
    };
  });
  const heads = new Map(ids.map((id, i) => {
    const heading = { id, top: i * 400, detached: false, getBoundingClientRect() {
      assert.equal(this.detached, false, 'a detached heading must not be measured');
      return { top: this.top };
    } };
    return [id, heading];
  }));
  return { links, heads };
}

function harness() {
  let currentPage = page();
  const frames = new Map();
  let nextFrame = 0;
  const window = new EventTarget();
  const document = Object.assign(new EventTarget(), {
    querySelectorAll: (selector) => {
      assert.equal(selector, '.chapter-toc a[data-toc-link]', 'standalone section navigation must not be selected');
      return currentPage.links;
    },
    getElementById: (id) => currentPage.heads.get(id) ?? null,
  });
  runInNewContext(compiled, {
    window, document,
    requestAnimationFrame: (callback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  return {
    window, document, frames,
    get page() { return currentPage; },
    setPage: (next) => { currentPage = next; },
    load: () => document.dispatchEvent(new Event('astro:page-load')),
    flush: () => { const pending = [...frames.values()]; frames.clear(); pending.forEach((callback) => callback()); },
  };
}

test('the active heading receives the CSS-matching value and aria-current', () => {
  const h = harness();
  h.load();
  assert.equal(h.page.links[0].getAttribute('data-active'), 'true');
  assert.equal(h.page.links[0].getAttribute('aria-current'), 'location');
  assert.equal(h.page.links[1].getAttribute('data-active'), null);
  h.page.heads.get('second').top = 100;
  h.window.dispatchEvent(new Event('scroll'));
  h.flush();
  assert.equal(h.page.links[0].getAttribute('data-active'), null);
  assert.equal(h.page.links[0].getAttribute('aria-current'), null);
  assert.equal(h.page.links[1].getAttribute('data-active'), 'true');
});

test('scroll and resize updates are coalesced into one frame', () => {
  const h = harness();
  h.load();
  h.page.heads.get('second').top = 100;
  h.window.dispatchEvent(new Event('scroll'));
  h.window.dispatchEvent(new Event('resize'));
  h.window.dispatchEvent(new Event('scroll'));
  assert.equal(h.frames.size, 1);
  h.flush();
  assert.equal(h.page.links[1].getAttribute('aria-current'), 'location');
  assert.equal(h.frames.size, 0);
});

test('navigation removes listeners and cancels frames before headings detach', () => {
  const h = harness();
  h.load();
  h.window.dispatchEvent(new Event('scroll'));
  assert.equal(h.frames.size, 1);
  h.document.dispatchEvent(new Event('astro:before-swap'));
  assert.equal(h.frames.size, 0);
  h.page.heads.forEach((heading) => { heading.detached = true; });
  h.window.dispatchEvent(new Event('scroll'));
  h.window.dispatchEvent(new Event('resize'));
  h.flush();
  assert.equal(h.frames.size, 0);
  h.setPage(page(['new-first', 'new-second', 'new-third']));
  h.load();
  assert.equal(h.page.links[0].getAttribute('aria-current'), 'location');
});

test('repeated page-load events do not accumulate listeners or leave an old frame pending', () => {
  const h = harness();
  h.load();
  h.window.dispatchEvent(new Event('scroll'));
  h.load();
  assert.equal(h.frames.size, 0);
  h.window.dispatchEvent(new Event('resize'));
  assert.equal(h.frames.size, 1);
});

test('pages without chapter TOC links or corresponding headings install no scroll work', () => {
  const h = harness();
  h.load();
  h.setPage(page([]));
  h.load();
  h.window.dispatchEvent(new Event('scroll'));
  assert.equal(h.frames.size, 0);
  const missing = page();
  missing.heads.clear();
  h.setPage(missing);
  h.load();
  h.window.dispatchEvent(new Event('resize'));
  assert.equal(h.frames.size, 0);
});
