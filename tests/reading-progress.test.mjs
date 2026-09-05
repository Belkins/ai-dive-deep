import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/reading-progress.ts', import.meta.url), 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const progress = await import(`data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString('base64')}`);
const chapters = [
  { slug: '01-first', number: 1, title: 'First chapter' },
  { slug: '02-second', number: 2, title: 'Second chapter' },
  { slug: '48-last', number: 48, title: 'Last chapter' },
];
const visit = { slug: '01-first', pct: 42, anchor: 'a-section', visitedAt: 1788564000000 };

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  const writes = [];
  return {
    values, writes,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { writes.push({ key, value }); values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
}

test('percentage clamps accept only finite numbers, without coercing strings or booleans', () => {
  for (const value of [undefined, null, NaN, Infinity, -Infinity, '90', true, {}, []]) {
    assert.equal(progress.clampProgress(value), 0);
  }
  assert.equal(progress.clampProgress(-1), 0);
  assert.equal(progress.clampProgress(1000), 100);
  assert.equal(progress.clampProgress(12.5), 12.5);
});

test('storage parsing recovers from malformed JSON and wrong root shapes', () => {
  for (const raw of [null, '', '{', 'null', '[]', '[42]', '42', 'true', '"text"']) {
    assert.deepEqual(progress.parseReadingProgress(raw), {});
    assert.equal(progress.parseLastRead(raw), null);
  }
});

test('legacy progress stays a numeric map while invalid entries and nonfinite numbers are ignored', () => {
  assert.deepEqual(progress.parseReadingProgress('{"01-first":42.5,"02-second":-9,"48-last":120,"bad":1e999,"string":"85","object":{},"bool":true,"__proto__":99,"../bad":100}'), {
    '01-first': 42.5, '02-second': 0, '48-last': 100,
  });
  assert.equal({}.polluted, undefined);
});

test('last-read parsing validates route, timestamp, and percentage independently of anchor', () => {
  assert.deepEqual(progress.parseLastRead(JSON.stringify(visit)), visit);
  assert.deepEqual(progress.parseLastRead(JSON.stringify({ ...visit, pct: 999, anchor: '#invalid' })), { ...visit, pct: 100, anchor: null });
  for (const invalid of [
    { slug: '../elsewhere' }, { slug: 'https://example.com' }, { pct: '50' }, { pct: null },
    { visitedAt: 0 }, { visitedAt: -1 }, { visitedAt: 1.5 }, { visitedAt: '123' }, { visitedAt: 9e15 },
  ]) assert.equal(progress.parseLastRead(JSON.stringify({ ...visit, ...invalid })), null);
  assert.equal(progress.parseLastRead('{"slug":"01-first","pct":1e999,"visitedAt":123}'), null);
});

test('heading anchors reject malformed fragments and lone surrogates but preserve Unicode IDs', () => {
  for (const value of ['', null, {}, '#section', 'two words', 'line\nfeed', '\ud800', 'x'.repeat(513)]) {
    assert.equal(progress.normalizeAnchor(value), null);
  }
  assert.equal(progress.normalizeAnchor('caf\u00e9-models'), 'caf\u00e9-models');
  assert.equal(progress.normalizeAnchor('section:2.1'), 'section:2.1');
});

test('scroll percentages are finite, bounded and handle short articles', () => {
  assert.equal(progress.calculateReadingProgress(200, 3000, 1000), 0);
  assert.equal(progress.calculateReadingProgress(-1000, 3000, 1000), 50);
  assert.equal(progress.calculateReadingProgress(-9000, 3000, 1000), 100);
  assert.equal(progress.calculateReadingProgress(600, 500, 1000), 0);
  assert.equal(progress.calculateReadingProgress(400, 500, 1000), 100);
  assert.equal(progress.calculateReadingProgress(0, 1000, 1000), 100);
  for (const args of [[NaN, 3000, 1000], [0, Infinity, 1000], [0, 3000, NaN], [0, 0, 1000], [0, -1, 1000], [0, 3000, 0]]) {
    assert.equal(progress.calculateReadingProgress(...args), 0);
  }
});

test('section selection returns the last heading at the reading line and does not skip ahead', () => {
  assert.equal(progress.findReadingAnchor([{ id: 'intro', top: 300 }]), null);
  assert.equal(progress.findReadingAnchor([
    { id: 'intro', top: -600 }, { id: 'current', top: 96 }, { id: 'next', top: 97 },
  ]), 'current');
  assert.equal(progress.findReadingAnchor([{ id: 'intro', top: -100 }, { id: 'invalid', top: NaN }]), 'intro');
  assert.equal(progress.findReadingAnchor([]), null);
  assert.equal(progress.findReadingAnchor([{ id: 'previous', top: -133.97 }, { id: 'anatomy-of-a-skill', top: 96.2265625 }]), 'anatomy-of-a-skill');
});

test('furthest read percentage never falls, while resume position follows backward scrolling', () => {
  const previous = { '01-first': 90, '48-last': 55 };
  const next = progress.updateReadingProgress(previous, null, visit);
  assert.deepEqual(next.progress, previous);
  assert.equal(next.lastRead.pct, 42);
  assert.equal(next.lastRead.anchor, 'a-section');
  assert.notEqual(next.progress, previous);
  assert.equal(progress.updateReadingProgress({}, null, visit, 100).progress['01-first'], 100);
  assert.equal(progress.updateReadingProgress({ '01-first': NaN }, null, visit).progress['01-first'], 42);
  assert.equal(progress.updateReadingProgress({}, null, { ...visit, pct: NaN }).lastRead, null);
});

test('older delayed writes merge progress without replacing newer metadata', () => {
  const newer = { ...visit, slug: '02-second', visitedAt: visit.visitedAt + 1000 };
  const next = progress.updateReadingProgress({ '02-second': 42 }, newer, visit);
  assert.equal(next.lastRead, newer);
  assert.deepEqual(next.progress, { '02-second': 42, '01-first': 42 });
});

test('resume chooses the last actual chapter, not the highest chapter number or furthest percentage', () => {
  const target = progress.getResumeTarget({ '01-first': 90, '48-last': 80 }, visit, chapters);
  assert.equal(target.slug, '01-first');
  assert.equal(target.pct, 42);
  assert.equal(target.anchor, 'a-section');
  for (const pct of [0, 100]) {
    assert.equal(progress.getResumeTarget({ '01-first': pct }, { ...visit, pct }, chapters).pct, pct);
  }
});

test('legacy resume fallback is deterministic, has no invented recency and ignores unknown chapters', () => {
  const target = progress.getResumeTarget({ '48-last': 30, unknown: 90, '01-first': 40 }, null, chapters);
  assert.equal(target.slug, '01-first');
  assert.equal(target.visitedAt, null);
  assert.equal(target.anchor, null);
  assert.equal(progress.getResumeTarget({}, visit, chapters), null);
  assert.equal(progress.getResumeTarget({ '01-first': 100, unknown: 90 }, null, chapters), null);
  assert.equal(progress.getResumeTarget({ '01-first': 42 }, { ...visit, slug: 'deleted' }, chapters).slug, '01-first');
});

test('resume links encode section anchors and preserve base-path deployments', () => {
  assert.equal(progress.readingHref(visit.slug, visit.anchor), '/chapters/01-first/#a-section');
  assert.equal(progress.readingHref(visit.slug, null, '/book/'), '/book/chapters/01-first/');
  assert.equal(progress.readingHref(visit.slug, 'caf\u00e9', '/book///'), '/book/chapters/01-first/#caf%C3%A9');
  assert.equal(progress.readingHref(visit.slug, 'invalid fragment'), '/chapters/01-first/');
  assert.equal(progress.readingHref(visit.slug, '\ud800'), '/chapters/01-first/');
});

test('storage writes recover corrupt records and keep legacy data separate from resume metadata', () => {
  const storage = memoryStorage({ 'cc-progress': 'null', 'cc-last-read': '{' });
  assert.equal(progress.writeReadingProgress(visit, 75, storage), true);
  assert.deepEqual(JSON.parse(storage.getItem('cc-progress')), { '01-first': 75 });
  assert.deepEqual(JSON.parse(storage.getItem('cc-last-read')), visit);
  assert.equal(progress.writeReadingProgress({ ...visit, pct: 2, visitedAt: visit.visitedAt + 1 }, 2, storage), true);
  assert.equal(progress.readReadingProgress(storage)['01-first'], 75);
  assert.equal(progress.readLastRead(storage).pct, 2);
});

test('unavailable or blocked storage never throws and reports unsuccessful writes', () => {
  const storage = {
    getItem() { throw new Error('Blocked'); },
    setItem() { throw new Error('Quota'); },
    removeItem() { throw new Error('Blocked'); },
  };
  for (const candidate of [null, storage]) {
    assert.deepEqual(progress.readReadingProgress(candidate), {});
    assert.equal(progress.readLastRead(candidate), null);
    assert.equal(progress.writeReadingProgress(visit, 42, candidate), false);
    assert.equal(progress.resetReadingProgress(candidate), false);
  }
  assert.deepEqual(progress.readReadingProgress(), {});
});

test('reset clears both progress keys without touching unrelated preferences', () => {
  const storage = memoryStorage({ 'cc-progress': '{}', 'cc-last-read': JSON.stringify(visit), theme: 'dark' });
  assert.equal(progress.resetReadingProgress(storage), true);
  assert.deepEqual([...storage.values], [['theme', 'dark']]);
  const attempted = [];
  assert.equal(progress.resetReadingProgress({
    ...storage,
    removeItem(key) { attempted.push(key); if (key === 'cc-progress') throw new Error('Blocked'); },
  }), false);
  assert.deepEqual(attempted, ['cc-progress', 'cc-last-read']);
});

const component = readFileSync(new URL('../src/components/ProgressBar.astro', import.meta.url), 'utf8');
const componentScript = component.slice(component.indexOf('<script>') + '<script>'.length, component.lastIndexOf('</script>'));
const runtime = ts.transpileModule(componentScript, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

// Run the real tracker against deterministic geometry, events, frames and timers; no browser is controlled.
function trackerHarness(storage = memoryStorage()) {
  const window = new EventTarget();
  const document = new EventTarget();
  const frames = new Map();
  const timers = new Map();
  let now = visit.visitedAt;
  let id = 0;
  let root;
  let article;
  let top;
  window.innerHeight = 1000;
  window.scrollTo = () => assert.fail('Normal visits must never restore scroll automatically');
  document.visibilityState = 'visible';
  document.getElementById = () => root;
  document.querySelector = () => article;
  const mount = (slug = '01-first') => {
    top = 400;
    const bar = { style: {} };
    root = slug ? { dataset: { progressSlug: slug }, querySelector: () => bar } : null;
    article = slug ? {
      getBoundingClientRect: () => ({ top, height: 3000 }),
      querySelectorAll: () => [0, 1200, 1800].map((offset, index) => ({
        id: `section-${index + 1}`, getBoundingClientRect: () => ({ top: top + offset }),
      })),
    } : null;
  };
  mount();
  runInNewContext(runtime, {
    exports: {}, window, document, AbortController,
    Date: { now: () => now },
    setTimeout: (fn, delay) => { const key = ++id; timers.set(key, { fn, at: now + delay }); return key; },
    clearTimeout: (key) => timers.delete(key),
    requestAnimationFrame: (fn) => { const key = ++id; frames.set(key, fn); return key; },
    cancelAnimationFrame: (key) => frames.delete(key),
    require: (path) => {
      if (path === '@/lib/chapters') return { CHAPTERS: chapters };
      assert.equal(path, '@/lib/reading-progress');
      return { ...progress, writeReadingProgress: (value, max) => progress.writeReadingProgress(value, max, storage) };
    },
  });
  return {
    window, document, storage, timers, frames,
    scroll(nextTop) { top = nextTop; window.dispatchEvent(new Event('scroll')); },
    frame() { const pending = [...frames.values()]; frames.clear(); pending.forEach((fn) => fn()); },
    advance(ms) {
      now += ms;
      for (const [key, timer] of [...timers]) if (timer.at <= now) { timers.delete(key); timer.fn(); }
    },
    navigate(slug) {
      document.dispatchEvent(new Event('astro:before-swap'));
      mount(slug);
      document.dispatchEvent(new Event('astro:page-load'));
    },
    reset() { progress.resetReadingProgress(storage); window.dispatchEvent(new Event(progress.PROGRESS_RESET_EVENT)); },
  };
}

test('tracker starts once per chapter and throttles scroll writes with a trailing latest position', () => {
  const harness = trackerHarness();
  assert.equal(harness.storage.writes.length, 2);
  harness.document.dispatchEvent(new Event('astro:page-load'));
  harness.window.dispatchEvent(new Event('pageshow'));
  assert.equal(harness.storage.writes.length, 2);
  assert.equal(getEventListeners(harness.window, 'scroll').length, 1);
  harness.scroll(-2000);
  harness.frame();
  harness.advance(200);
  harness.scroll(-1300);
  harness.frame();
  assert.equal(harness.storage.writes.length, 2);
  assert.equal(harness.timers.size, 1);
  harness.advance(800);
  assert.equal(harness.storage.writes.length, 4);
  assert.equal(progress.readReadingProgress(harness.storage)['01-first'], 100);
  assert.equal(progress.readLastRead(harness.storage).pct, 65);
  assert.equal(progress.readLastRead(harness.storage).anchor, 'section-2');
  harness.advance(5000);
  assert.equal(harness.storage.writes.length, 4);
});

test('ClientRouter cleanup flushes final geometry and removes all per-page work', () => {
  const harness = trackerHarness();
  harness.scroll(-1300);
  assert.equal(harness.frames.size, 1);
  harness.navigate(null);
  assert.equal(progress.readLastRead(harness.storage).pct, 65);
  assert.equal(harness.frames.size, 0);
  assert.equal(harness.timers.size, 0);
  for (const event of ['scroll', 'resize', 'focus', 'storage', progress.PROGRESS_RESET_EVENT]) {
    assert.equal(getEventListeners(harness.window, event).length, 0);
  }
  assert.equal(getEventListeners(harness.document, 'visibilitychange').length, 0);
  const writes = harness.storage.writes.length;
  harness.scroll(-3000);
  harness.frame();
  harness.advance(2000);
  assert.equal(harness.storage.writes.length, writes);
  for (let i = 0; i < 4; i++) {
    harness.navigate(i % 2 ? '48-last' : '01-first');
    assert.equal(getEventListeners(harness.window, 'scroll').length, 1);
  }
});

test('reset cancels queued progress and stays cleared until a new chapter visit', () => {
  const harness = trackerHarness();
  harness.scroll(-1300);
  harness.frame();
  harness.reset();
  harness.advance(2000);
  harness.scroll(-2000);
  harness.frame();
  harness.window.dispatchEvent(new Event('focus'));
  harness.navigate(null);
  assert.deepEqual(progress.readReadingProgress(harness.storage), {});
  assert.equal(progress.readLastRead(harness.storage), null);
  harness.navigate('02-second');
  assert.deepEqual(progress.readReadingProgress(harness.storage), { '02-second': 0 });
  assert.equal(progress.readLastRead(harness.storage).slug, '02-second');
});

test('cross-tab reset cancels writes and bfcache restores exactly one tracker', () => {
  const harness = trackerHarness();
  harness.scroll(-1300);
  harness.frame();
  progress.resetReadingProgress(harness.storage);
  const event = new Event('storage');
  Object.assign(event, { key: progress.PROGRESS_STORAGE_KEY, newValue: null });
  harness.window.dispatchEvent(event);
  harness.advance(2000);
  assert.equal(progress.readLastRead(harness.storage), null);
  harness.window.dispatchEvent(new Event('pagehide'));
  assert.equal(getEventListeners(harness.window, 'scroll').length, 0);
  harness.window.dispatchEvent(new Event('pageshow'));
  assert.equal(getEventListeners(harness.window, 'scroll').length, 1);
  assert.equal(progress.readLastRead(harness.storage).slug, '01-first');
});

test('hidden pages flush already sampled progress but cannot claim new reading activity', () => {
  const harness = trackerHarness();
  harness.scroll(-1300);
  harness.frame();
  harness.document.visibilityState = 'hidden';
  harness.document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(progress.readLastRead(harness.storage).pct, 65);
  harness.scroll(-2000);
  harness.frame();
  harness.advance(2000);
  assert.equal(progress.readLastRead(harness.storage).pct, 65);
  harness.document.visibilityState = 'visible';
  harness.document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(progress.readLastRead(harness.storage).pct, 100);
});
