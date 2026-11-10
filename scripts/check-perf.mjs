#!/usr/bin/env node
// check-perf.mjs — local speed and contrast guard (npm run check:perf).
//
// NEVER part of postbuild or the deploy workflow: postbuild runs inside every
// GitHub Actions deploy, and this drives a real browser. Run it by hand after
// npm run build.
//
// It serves dist on a local port, loads each PAGE RUNS times in headless
// Chrome at a phone size with CPU and network throttling, and fails on:
//   - a median largest-contentful-paint over LCP_BUDGET_MS,
//   - a total layout shift (every shift without recent input) over CLS_BUDGET,
//   - a text and background pair under MIN_CONTRAST among CONTRAST_SELECTORS,
//     in the dark and the light theme.
// Chrome is driven over the raw DevTools protocol (no new dependency):
// CHROME_BIN, else Playwright's chrome-headless-shell, else Google Chrome.
//
// Measured on 2026-11-10 on the guards-counts lane build (base b4ba92e plus
// this lane's commits), this Mac with other lanes building, two full runs of
// 3 loads each:
//   /                               LCP median 1144, 1128 ms   CLS 0.062
//   /chapters/16-hooks-subagents/   LCP median 1124, 1128 ms   CLS 0.05
//   /library/                       LCP median 1144, 1112 ms   CLS 0.116
//   lowest contrast: light theme .text-accent 4.58:1 (chapter "Next" link);
//   dark theme lowest 6.3:1. CLS on / and /library/ is over budget today, so
//   the guard is red until the layout-shift fixes land. The main session
//   tightens the budgets after the other lanes land.
//
// Usage: node scripts/check-perf.mjs [distDir]   (default: dist)

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';

// BUDGETS — measured medians on this build (see header) plus headroom.
const LCP_BUDGET_MS = 2000; // measured medians 1112-1144 ms, ~75% headroom
const CLS_BUDGET = 0.05; // fixed by the brief, not measured
const MIN_CONTRAST = 4.5; // WCAG AA body text

const PAGES = ['/', '/chapters/16-hooks-subagents/', '/library/'];
const RUNS = 3;
const VIEWPORT = { width: 390, height: 844 };
const CPU_SLOWDOWN = 4;
// Roughly Lighthouse's mobile preset: 150 ms RTT, 1.6 Mbps down, 750 kbps up.
const NETWORK = { offline: false, latency: 150, downloadThroughput: 1_638_400 / 8, uploadThroughput: 768_000 / 8 };
const THEMES = ['dark', 'light'];
// Text that every reader meets on these pages. Each selector is checked on
// up to 6 visible matches per page and theme; the lowest ratio counts.
const CONTRAST_SELECTORS = [
  'main h1',
  'main p',
  'main li',
  'main a',
  'header a',
  'footer p',
  'footer a',
  '.text-muted',
  '.text-accent',
];

const DIST = process.argv[2] ?? 'dist';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  for (const base of [join(homedir(), 'Library/Caches/ms-playwright'), join(homedir(), '.cache/ms-playwright')]) {
    if (!existsSync(base)) continue;
    const dirs = readdirSync(base).filter((d) => /^chromium_headless_shell-\d+$/.test(d))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
    for (const d of dirs) {
      for (const sub of ['chrome-headless-shell-mac-arm64', 'chrome-headless-shell-mac-x64', 'chrome-headless-shell-linux64']) {
        const p = join(base, d, sub, 'chrome-headless-shell');
        if (existsSync(p)) return p;
      }
    }
  }
  for (const p of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium']) {
    if (existsSync(p)) return p;
  }
  return '';
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };

function serve(root) {
  const server = createServer((req, res) => {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(root, p);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

async function launchChrome(bin) {
  const profile = mkdtempSync(join(tmpdir(), 'check-perf-'));
  const port = 9300 + Math.floor(Math.random() * 600);
  const chrome = spawn(bin, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  const close = () => { try { chrome.kill('SIGKILL'); } catch {} try { rmSync(profile, { recursive: true, force: true }); } catch {} };
  let target;
  for (let i = 0; i < 75 && !target; i += 1) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {}
    if (!target) await sleep(200);
  }
  if (!target) { close(); throw new Error('Chrome did not open a DevTools target'); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.addEventListener('open', ok, { once: true }); ws.addEventListener('error', no, { once: true }); });
  let id = 0;
  const pending = new Map();
  let loaded = false;
  ws.addEventListener('message', (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
    if (d.method === 'Page.loadEventFired') loaded = true;
  });
  const send = (method, params = {}) => new Promise((ok, no) => {
    const n = ++id;
    const t = setTimeout(() => { pending.delete(n); no(new Error(`CDP timeout: ${method}`)); }, 30000);
    pending.set(n, (v) => { clearTimeout(t); if (v.error) no(new Error(`${method}: ${v.error.message}`)); else ok(v.result); });
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  const ev = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(`page eval: ${r.exceptionDetails.text}`);
    return r.result.value;
  };
  const go = async (url) => {
    loaded = false;
    await send('Page.navigate', { url });
    for (let w = 0; w < 600 && !loaded; w += 1) await sleep(100);
    if (!loaded) throw new Error(`load event never fired for ${url}`);
  };
  return { send, ev, go, close };
}

// Collects LCP and layout shifts from the first paint on (buffered observers).
const OBSERVE = `
  window.__lcp = 0; window.__cls = 0;
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
      .observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}
`;

// WCAG 2 contrast for each selector's visible text over its effective
// background (the first ancestor with an opaque-enough background colour,
// alpha-blended). Elements over a background image are reported as skipped.
const CONTRAST = (selectors) => `(() => {
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const over = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const background = (el) => {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; }
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i -= 1) bg = over(stack[i], bg);
    return bg;
  };
  const out = [];
  for (const sel of ${JSON.stringify(selectors)}) {
    const els = [...document.querySelectorAll(sel)].filter((e) => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    }).slice(0, 6);
    if (!els.length) { out.push({ sel, n: 0 }); continue; }
    let worst = null; let skipped = 0;
    for (const e of els) {
      const bg = background(e);
      if (!bg) { skipped += 1; continue; }
      const fg = over(parse(getComputedStyle(e).color), bg);
      const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
      const ratio = (hi + 0.05) / (lo + 0.05);
      if (!worst || ratio < worst.ratio) worst = { ratio: Math.round(ratio * 100) / 100, text: e.textContent.trim().slice(0, 40), fg: getComputedStyle(e).color };
    }
    out.push({ sel, n: els.length, skipped, worst });
  }
  return out;
})()`;

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) throw new Error(`no ${DIST}/index.html; run npm run build first`);
  const bin = findChrome();
  if (!bin) throw new Error('no Chrome found; set CHROME_BIN');
  const server = await serve(DIST);
  const base = `http://127.0.0.1:${server.address().port}`;
  const chrome = await launchChrome(bin);
  const failures = [];
  try {
    const { send, ev, go } = chrome;
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 2, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await send('Page.addScriptToEvaluateOnNewDocument', { source: OBSERVE });

    console.log(`speed: ${RUNS} runs per page at ${VIEWPORT.width}x${VIEWPORT.height}, CPU ${CPU_SLOWDOWN}x, ${NETWORK.latency} ms RTT`);
    await send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });
    await send('Network.emulateNetworkConditions', NETWORK);
    for (const page of PAGES) {
      const lcps = []; const clss = [];
      for (let i = 0; i < RUNS; i += 1) {
        await go('about:blank');
        await send('Network.clearBrowserCache');
        await go(base + page);
        await sleep(3000);
        const m = await ev('({ lcp: window.__lcp, cls: window.__cls })');
        lcps.push(Math.round(m.lcp)); clss.push(Math.round(m.cls * 1000) / 1000);
      }
      const lcp = median(lcps); const cls = Math.max(...clss);
      console.log(`  ${page}  LCP median ${lcp} ms [${lcps.join(', ')}]  CLS max ${cls} [${clss.join(', ')}]`);
      if (!(lcp > 0)) failures.push(`${page}: no LCP entry recorded`);
      if (lcp > LCP_BUDGET_MS) failures.push(`${page}: median LCP ${lcp} ms > ${LCP_BUDGET_MS} ms`);
      if (cls > CLS_BUDGET) failures.push(`${page}: layout shift ${cls} > ${CLS_BUDGET}`);
    }

    await send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    for (const theme of THEMES) {
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] });
      const id = await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('theme', ${JSON.stringify(theme)}); } catch (e) {}` });
      console.log(`contrast (${theme}): minimum ${MIN_CONTRAST}:1`);
      for (const page of PAGES) {
        await go(base + page);
        await sleep(800);
        const applied = await ev('document.documentElement.dataset.theme');
        if (applied !== theme) failures.push(`${page}: asked for the ${theme} theme, page shows ${applied}`);
        for (const r of await ev(CONTRAST(CONTRAST_SELECTORS))) {
          if (!r.n || !r.worst) { console.log(`  ${page}  ${r.sel}: ${r.n ? `all ${r.skipped} over a background image, skipped` : 'no visible match'}`); continue; }
          const ok = r.worst.ratio >= MIN_CONTRAST;
          console.log(`  ${ok ? ' ' : '✗'} ${page}  ${r.sel}: ${r.worst.ratio}:1 ("${r.worst.text}", ${r.worst.fg})${r.skipped ? `, ${r.skipped} skipped` : ''}`);
          if (!ok) failures.push(`${page} [${theme}] ${r.sel}: ${r.worst.ratio}:1 < ${MIN_CONTRAST}:1 ("${r.worst.text}")`);
        }
      }
      await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id.identifier });
    }
  } finally {
    chrome.close();
    server.close();
  }
  if (failures.length) {
    console.error(`\n✗ check:perf: ${failures.length} failure(s)`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log('\n✓ check:perf: speed and contrast within budget');
}

main().catch((err) => { console.error(`✗ check:perf: ${err.message}`); process.exit(1); });
