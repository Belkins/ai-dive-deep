// After npm run build, run against a local preview with node --test tests/sops-browser.mjs.
// PLAYWRIGHT_MODULE may point to an existing Playwright installation; no dependency install is required.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadTs } from './helpers/load-ts.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.SOP_PREVIEW_URL || 'http://127.0.0.1:4337';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(origin).hostname), 'QA must not target production');
const output = resolve('dist/sop-qa');
const { SOP_LIBRARY, SOP_SECTIONS, getSopSections, renderSopMarkdown, sopHref, sopDownloadHref } = loadTs(new URL('../src/lib/sops.ts', import.meta.url));
const { getWorkflowTemplate } = loadTs(new URL('../src/lib/workflow-plan.ts', import.meta.url));
let browser;
let context;
const requests = [];
const errors = [];

before(async () => {
  mkdirSync(output, { recursive: true });
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  // Never send analytics or contact a model/provider during local browser QA.
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  context.on('request', request => requests.push(`${request.url()} ${request.postData() || ''}`));
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
});
after(async () => { await browser?.close(); });

test('all six rendered SOPs match source and downloaded Markdown, with indexable canonical routes', async () => {
  const page = await context.newPage();
  const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
  for (const sop of SOP_LIBRARY) {
    const response = await page.goto(origin + sopHref(sop));
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('h1').textContent(), sop.title);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://dive.vladyslavpodoliako.com${sopHref(sop)}`);
    assert.ok(await page.locator('meta[name="robots"]').evaluateAll(tags => tags.every(tag => !tag.content.includes('noindex'))));
    assert.ok(sitemap.includes(`https://dive.vladyslavpodoliako.com${sopHref(sop)}`));
    assert.deepEqual(await page.locator('[data-sop-content]').allTextContents(), getSopSections(sop).flatMap(section => section.items));
    assert.equal(await page.locator('.sop-state').count(), sop.steps.length + sop.qualityChecks.length + sop.acceptanceTests.length);
    for (const section of SOP_SECTIONS) assert.equal(await page.locator(`section#${section.id}`).count(), 1);
    const md = await context.request.get(origin + sopDownloadHref(sop));
    assert.equal(await md.text(), renderSopMarkdown(sop));
    assert.equal(readFileSync(`dist${sopDownloadHref(sop)}`, 'utf8'), renderSopMarkdown(sop));
  }
  await page.close();
});

test('index, every SOP, and planner fit 320/390/768/1440px with readable non-overlapping content', async () => {
  const page = await context.newPage();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/sops/', ...SOP_LIBRARY.map(sopHref), '/workflow-planner/?preset=recruiting-question-pack']) {
      await page.goto(origin + path);
      if (path.startsWith('/workflow')) await page.waitForFunction(() => !document.querySelector('#workflow-template').disabled);
      const layout = await page.evaluate(() => {
        const root = document.querySelector('.sop-page, .workflow-planner-page');
        const boxes = [...root.querySelectorAll('h1,h2,h3,p, .sop-actions a')].filter(element => element.getClientRects().length && !element.closest('details:not([open])')).map(element => ({ tag: element.tagName, text: element.textContent.slice(0, 50), rect: element.getBoundingClientRect().toJSON() }));
        return {
          viewport: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
          overflow: boxes.filter(({ rect }) => rect.left < -1 || rect.right > document.documentElement.clientWidth + 1),
          overlaps: boxes.flatMap((a, i) => boxes.slice(i + 1).filter(b => a.rect.left < b.rect.right - 2 && a.rect.right > b.rect.left + 2 && a.rect.top < b.rect.bottom - 2 && a.rect.bottom > b.rect.top + 2).map(b => [a.text, b.text])),
        };
      });
      assert.ok(layout.scroll <= layout.viewport + 1, `${width} ${path}: document overflow ${JSON.stringify(layout)}`);
      assert.deepEqual(layout.overflow, [], `${width} ${path}`);
      assert.deepEqual(layout.overlaps, [], `${width} ${path}`);
      const name = path.split('/')[2] || 'index';
      await page.screenshot({ path: `${output}/${width}-${path.startsWith('/workflow') ? 'planner' : name}.png`, fullPage: true });
    }
  }
  await page.close();
});

test('SOP-to-planner client transitions, exports, replacement, and navigation do not retain or transmit draft values', async () => {
  const page = await context.newPage();
  const sentinel = 'SOPPRIVATEFIXTURE20260905';
  await page.goto(origin + '/sops/');
  for (const sop of SOP_LIBRARY) {
    await page.locator(`.sop-directory a[href="${sopHref(sop)}"]`).click();
    await page.getByRole('link', { name: 'Adapt planner preset', exact: true }).click();
    await page.waitForFunction(id => document.querySelector('#workflow-template')?.value === id && !document.querySelector('#workflow-template')?.disabled, sop.presetId);
    assert.equal(await page.locator('#workflow-objective').inputValue(), getWorkflowTemplate(sop.presetId).objective);
    assert.equal(new URL(page.url()).search, `?preset=${sop.presetId}`);
    await page.locator('#workflow-objective').fill(sentinel);
    // A repeated Astro event must not reset unsaved edits or install another listener.
    await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')));
    assert.equal(await page.locator('#workflow-objective').inputValue(), sentinel);
    assert.ok(!page.url().includes(sentinel));
    await page.getByRole('link', { name: 'Department SOP library', exact: true }).click();
    await page.waitForURL(origin + '/sops/');
  }
  await page.goto(origin + '/workflow-planner/?preset=customer-success-escalation&objective=URL_INPUT_MUST_NOT_LOAD&unknown=discard');
  await page.waitForFunction(() => !document.querySelector('#workflow-template').disabled);
  assert.equal(new URL(page.url()).search, '?preset=customer-success-escalation');
  assert.equal(await page.locator('#workflow-objective').inputValue(), getWorkflowTemplate('customer-success-escalation').objective);
  await page.locator('#workflow-objective').fill(sentinel);
  await page.locator('#workflow-template').selectOption('recruiting-question-pack');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Load template', exact: true }).click();
  assert.equal(await page.locator('#workflow-objective').inputValue(), sentinel);
  assert.equal(new URL(page.url()).search, '?preset=customer-success-escalation');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Load template', exact: true }).click();
  assert.equal(await page.locator('#workflow-objective').inputValue(), getWorkflowTemplate('recruiting-question-pack').objective);
  assert.equal(new URL(page.url()).search, '?preset=recruiting-question-pack');
  await page.locator('#workflow-objective').fill(sentinel);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Fixture denial'); } } }));
  await page.getByRole('button', { name: 'Copy Markdown', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.wp-draft-status').textContent.includes('Clipboard unavailable'));
  const expected = await page.locator('.wp-markdown code').textContent();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Markdown', exact: true }).click();
  const download = await downloadPromise;
  assert.equal(readFileSync(await download.path(), 'utf8'), expected);
  assert.ok(expected.includes(sentinel) && expected.includes('Acceptance tests (not run)'));
  assert.ok(!expected.includes('- [x]'));
  await page.evaluate(() => { window.print = () => { window.__printRequested = true; }; });
  await page.getByRole('button', { name: 'Print specification', exact: true }).click();
  assert.ok(await page.evaluate(() => window.__printRequested));
  assert.equal(await page.locator('.wp-planner form').count(), 0);
  assert.ok(!(await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage }, analytics: window.dataLayer })) ).includes(sentinel));
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Clear all fields', exact: true }).click();
  assert.equal(await page.locator('#workflow-objective').inputValue(), sentinel);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Clear all fields', exact: true }).click();
  assert.equal(await page.locator('#workflow-objective').inputValue(), '');
  assert.ok(await page.getByRole('button', { name: 'Download Markdown', exact: true }).isDisabled());
  assert.equal(new URL(page.url()).search, '');
  await page.reload();
  await page.waitForFunction(() => !document.querySelector('#workflow-template').disabled);
  assert.equal(await page.locator('#workflow-objective').inputValue(), getWorkflowTemplate('weekly-research-brief').objective);
  assert.ok(requests.every(request => !request.includes(sentinel)), 'entered text never appears in a network request');
  assert.deepEqual(errors, []);
  await page.close();
});

test('Library format/department filters and keyboard search discover the SOPs after client navigation', async () => {
  const page = await context.newPage();
  await page.goto(origin + '/library/');
  await page.locator('select[name="kind"]').selectOption('SOP');
  assert.equal(await page.locator('[data-library-item]:visible').count(), 6);
  await page.locator('select[name="topic"]').selectOption('Recruiting');
  assert.equal(await page.locator('[data-library-item]:visible').count(), 1);
  await page.locator('[data-library-item]:visible a').click();
  await page.waitForURL(origin + '/sops/recruiting-interview-scorecard/');
  await page.keyboard.press('Meta+k');
  await page.locator('input[role="combobox"]').fill('Sales quality checks');
  await page.getByRole('option').first().waitFor();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForURL(origin + '/sops/sales-call-to-crm/#quality-checks');
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.locator('.sop-layout details summary').click();
  await page.locator('.sop-layout details a[href="#acceptance-tests"]').click();
  assert.equal(await page.locator('.sop-layout details').getAttribute('open'), null);
  assert.equal(new URL(page.url()).hash, '#acceptance-tests');
  assert.deepEqual(errors, []);
  await page.close();
});
