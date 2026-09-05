import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { getRadarArchiveDates, getRadarArchiveNavigation, isRadarEditionIndexable } from '../src/lib/radar-config.mjs';

const repo = fileURLToPath(new URL('..', import.meta.url));
const checker = join(repo, 'scripts/check-radar-discovery.py');
const defaultOrigin = 'https://dive.vladyslavpodoliako.com';
const liveDate = '2026-09-05';
const date = day => `2026-08-${String(day).padStart(2, '0')}`;
const edition = (date, count = 12) => ({ date, items: Array.from({ length: count }, (_, rank) => ({ rank })) });
const frozen = Array.from({ length: 14 }, (_, index) => edition(date(index + 1), index === 8 ? 11 : 12));
const fixtures = [...frozen, edition(liveDate), edition('2026-09-06')];

function write(root, name, value) {
  const path = join(root, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function runChecker(root, siteUrl = defaultOrigin) {
  return spawnSync('python3', ['-B', checker, join(root, 'dist')], {
    encoding: 'utf8', env: { ...process.env, SITE_URL: siteUrl },
  });
}

test('eligibility shares the 11/12 boundary and excludes live/future dates only for archives', () => {
  assert.equal(isRadarEditionIndexable(edition(date(1), 11)), false);
  assert.equal(isRadarEditionIndexable(edition(date(1), 12)), true);
  assert.equal(isRadarEditionIndexable(undefined), false);
  assert.equal(isRadarEditionIndexable({ date: date(1) }), false);
  assert.equal(isRadarEditionIndexable(edition(liveDate)), true);
  assert.equal(isRadarEditionIndexable(edition(liveDate), { liveDate }), false);
  assert.equal(isRadarEditionIndexable(edition('2026-09-06'), { liveDate }), false);
  assert.equal(isRadarEditionIndexable(edition(date(1)), { liveDate, isPublic: false }), false);
  assert.equal(isRadarEditionIndexable(edition(liveDate), { isPublic: false }), false);
});

test('eligible dates are sorted, deduplicated, non-mutating, and based on the actual live payload', () => {
  const input = [...fixtures].reverse().concat(frozen[0]);
  const before = JSON.stringify(input);
  const expected = frozen.filter(entry => entry.items.length === 12).map(entry => entry.date).reverse();
  assert.deepEqual(getRadarArchiveDates(input, liveDate), expected);
  assert.deepEqual(getRadarArchiveDates(frozen, liveDate), expected, 'latest frozen date stays available without a same-day archive file');
  assert.deepEqual(getRadarArchiveDates(input, liveDate, false), []);
  assert.equal(JSON.stringify(input), before);
});

test('older/newer neighbors bridge thin editions and date gaps while preserving the recent shortlist', () => {
  const dates = getRadarArchiveDates(fixtures, liveDate);
  const nav = getRadarArchiveNavigation(dates, date(10));
  assert.equal(nav.older, date(8));
  assert.equal(nav.newer, date(11));
  assert.deepEqual(nav.recent, dates.filter(value => value !== date(10)).slice(0, 7));
  assert.equal(getRadarArchiveNavigation(dates, date(1)).older, undefined);
  assert.equal(getRadarArchiveNavigation(dates, date(14)).newer, undefined);
  assert.deepEqual(getRadarArchiveNavigation([], liveDate), { recent: [], older: undefined, newer: undefined });
  assert.deepEqual(getRadarArchiveNavigation([date(1)], date(1)), { recent: [], older: undefined, newer: undefined });
  assert.equal(getRadarArchiveNavigation([date(1), date(14)], date(14)).older, date(1));
});

function graphFixture(root, {
  oldNavigation = false, noindexDate, extraLink, sitemapExtra,
  hubRobots = '', hubNoindex = false, nofollowLinks = false, siteUrl = defaultOrigin,
} = {}) {
  const dates = frozen.filter(entry => entry.items.length === 12).map(entry => entry.date).reverse();
  const routes = ['/radar/', ...dates.map(value => `/radar/${value}/`)];
  const origin = new URL(siteUrl).origin;
  write(root, 'src/data/radar/today.json', JSON.stringify({ date: liveDate }));
  for (const route of routes) {
    const current = route === '/radar/' ? liveDate : route.split('/')[2];
    const { recent, older, newer } = getRadarArchiveNavigation(dates, current);
    const rel = nofollowLinks ? 'nofollow' : '';
    let links = recent.map(value => `<a rel="${rel}" href="/radar/${value}/">${value}</a>`).join('');
    if (!oldNavigation && route !== '/radar/') {
      if (older) links += `<a rel="prev ${rel}" href="/radar/${older}/">Older</a>`;
      if (newer) links += `<a rel="next ${rel}" href="/radar/${newer}/">Newer</a>`;
    }
    links = links.replaceAll('href="/radar/', `href="${origin}/radar/`);
    const robots = route === '/radar/' ? hubRobots : current === noindexDate ? '<meta name="robots" content="noindex, nofollow">' : '';
    write(root, `dist${route}index.html`, `<html><head>${robots}</head><body>${links}${extraLink || ''}</body></html>`);
  }
  write(root, 'dist/sitemap-0.xml', `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...routes.filter(route => route !== '/radar/' || !hubNoindex), ...(sitemapExtra ? [sitemapExtra] : [])].map(route => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>`);
}

test('rendered graph regression reproduces the latest-seven orphan bug beyond eight frozen editions', () => {
  const root = mkdtempSync(join(tmpdir(), 'dive-radar-graph-'));
  try {
    graphFixture(root, { oldNavigation: true });
    const broken = runChecker(root);
    assert.equal(broken.status, 1, broken.stderr);
    assert.match(broken.stdout, /13 indexable archives, 8 reachable/);
    assert.match(broken.stdout, /unreachable from \/radar\//);
    graphFixture(root);
    const fixed = runChecker(root);
    assert.equal(fixed.status, 0, fixed.stdout + fixed.stderr);
    assert.match(fixed.stdout, /13 indexable archives, 13 reachable, 0 failures/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('rendered guard rejects noindex destinations, live-day links, and sitemap/robots disagreements', () => {
  const root = mkdtempSync(join(tmpdir(), 'dive-radar-policy-'));
  try {
    graphFixture(root, { noindexDate: date(8), extraLink: `<a href="/radar/${liveDate}/">Live duplicate</a>`, sitemapExtra: `/radar/${liveDate}/` });
    const result = runChecker(root);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stdout, /links to ineligible edition \/radar\/2026-08-08\//);
    assert.match(result.stdout, /links to missing edition \/radar\/2026-09-05\//);
    assert.match(result.stdout, /sitemap includes a missing or noindex page/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('graph traversal respects page and anchor nofollow while allowing a noindex,follow hub', () => {
  const root = mkdtempSync(join(tmpdir(), 'dive-radar-follow-'));
  try {
    for (const hubRobots of [
      '<meta name="robots" content="noindex, nofollow">',
      '<meta name="robots" content="none">',
      '<meta name="robots" content="noindex, follow"><meta name="googlebot" content="nofollow">',
    ]) {
      graphFixture(root, { hubRobots, hubNoindex: true });
      const blocked = runChecker(root);
      assert.equal(blocked.status, 1, blocked.stderr);
      assert.match(blocked.stdout, /13 indexable archives, 0 reachable/);
    }
    graphFixture(root, { nofollowLinks: true });
    const blocked = runChecker(root);
    assert.equal(blocked.status, 1, blocked.stderr);
    assert.match(blocked.stdout, /13 indexable archives, 0 reachable/);
    assert.match(blocked.stdout, /prev links \[\] !=/);

    graphFixture(root, { hubRobots: '<meta name="robots" content="noindex, follow">', hubNoindex: true });
    const followable = runChecker(root);
    assert.equal(followable.status, 0, followable.stdout + followable.stderr);
    assert.match(followable.stdout, /13 indexable archives, 13 reachable, 0 failures/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('graph uses SITE_URL origin for absolute links and sitemap URLs, excluding external links', () => {
  const root = mkdtempSync(join(tmpdir(), 'dive-radar-origin-'));
  const siteUrl = 'https://preview.example.test:8443/nested/config';
  try {
    graphFixture(root, { siteUrl, extraLink: '<a href="https://external.example.test/radar/2026-08-09/">External</a>' });
    const result = runChecker(root, siteUrl);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /13 indexable archives, 13 reachable, 0 failures/);
    assert.equal(runChecker(root).status, 1, 'a mismatched origin must not validate this graph');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

// Build real Radar routes, BaseLayout robots, policy and sitemap configuration.
// Only unrelated navigation, client routing, palette and styling are stubbed.
function buildFixture({ isPublic = true, liveCount = 12, siteUrl = defaultOrigin } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'dive-radar-build-'));
  const copy = name => {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    copyFileSync(join(repo, name), join(root, name));
  };
  try {
    for (const name of [
      'astro.config.mjs', 'tsconfig.json', 'package.json', 'src/lib/radar-config.mjs',
      'src/components/RadarBoard.astro', 'src/pages/radar/index.astro', 'src/pages/radar/[date].astro',
      'src/layouts/BaseLayout.astro', 'src/lib/chapters.ts', 'src/lib/author.ts', 'src/lib/seo.ts',
      'src/data/chapter-dates.json',
    ]) copy(name);
    symlinkSync(join(repo, 'node_modules'), join(root, 'node_modules'), 'dir');
    write(root, 'src/pages/index.astro', '<a href="/radar/">Radar</a>');
    write(root, 'src/pages/private-fixture.astro', '---\nimport BaseLayout from "@/layouts/BaseLayout.astro";\n---\n<BaseLayout title="Private fixture" noindex>Private</BaseLayout>');
    write(root, 'src/styles/global.css', '');
    const layout = readFileSync(join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
    write(root, 'src/layouts/BaseLayout.astro', layout.replace("import { ClientRouter } from 'astro:transitions';", "import ClientRouter from '@/components/ClientRouter.astro';"));
    for (const component of ['Nav', 'AnnouncementBar', 'Footer', 'CommandPaletteMount', 'ClientRouter']) {
      write(root, `src/components/${component}.astro`, '<!-- Unrelated component omitted from Radar fixture. -->');
    }
    if (!isPublic) {
      const policy = readFileSync(join(root, 'src/lib/radar-config.mjs'), 'utf8');
      assert.match(policy, /export const RADAR_PUBLIC = true;/);
      write(root, 'src/lib/radar-config.mjs', policy.replace('export const RADAR_PUBLIC = true;', 'export const RADAR_PUBLIC = false;'));
    }
    const template = JSON.parse(readFileSync(join(repo, 'src/data/radar/today.json'), 'utf8'));
    const payload = ({ date, items }) => ({ ...template, date, generated: `${date}T12:00:00Z`, count: items.length,
      items: items.map((_, index) => ({ ...template.items[0], rank: index + 1, title: `Fixture item ${index + 1}` })),
    });
    write(root, 'src/data/radar/today.json', JSON.stringify(payload(edition(liveDate, liveCount))));
    for (const entry of fixtures) write(root, `src/data/radar/archive/${entry.date}.json`, JSON.stringify(payload(entry)));
    const result = spawnSync(process.execPath, [join(repo, 'node_modules/astro/astro.js'), 'build'], {
      cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, DEPLOY_TARGET: siteUrl === defaultOrigin ? 'gh-pages' : 'vercel', SITE_URL: siteUrl, ASTRO_TELEMETRY_DISABLED: '1' },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return root;
  } catch (error) {
    rmSync(root, { recursive: true, force: true });
    throw error;
  }
}

for (const options of [
  { isPublic: true, liveCount: 12 },
  { isPublic: true, liveCount: 11 },
  { isPublic: false, liveCount: 12 },
  { isPublic: false, liveCount: 11 },
  { isPublic: true, liveCount: 11, siteUrl: 'https://preview.example.test' },
]) {
  test(`real rendered Radar eligibility and navigation: ${JSON.stringify(options)}`, { timeout: 150000 }, () => {
    const root = buildFixture(options);
    try {
      const html = value => readFileSync(join(root, `dist/radar/${value ? value + '/' : ''}index.html`), 'utf8');
      const sitemap = readFileSync(join(root, 'dist/sitemap-0.xml'), 'utf8');
      const noindex = source => /<meta name="robots" content="noindex,/.test(source);
      assert.equal(noindex(html('')), !options.isPublic || options.liveCount < 12);
      if (!options.isPublic || options.liveCount < 12) {
        assert.ok(html('').includes(`content="noindex, ${options.isPublic ? 'follow' : 'nofollow'}"`));
      }
      const privatePage = readFileSync(join(root, 'dist/private-fixture/index.html'), 'utf8');
      assert.match(privatePage, /<meta name="robots" content="noindex, nofollow"/);
      assert.equal(noindex(html(date(9))), true, '11-item frozen edition is noindex');
      assert.equal(noindex(html(date(10))), !options.isPublic, '12-item frozen edition follows public policy');
      assert.equal(sitemap.includes(`/radar/${date(9)}/`), false);
      assert.equal(sitemap.includes(`/radar/${date(10)}/`), options.isPublic);
      for (const excluded of [liveDate, '2026-09-06']) {
        assert.equal(existsSync(join(root, `dist/radar/${excluded}/index.html`)), false);
        assert.equal(sitemap.includes(`/radar/${excluded}/`), false);
      }
      const result = runChecker(root, options.siteUrl);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stdout, options.isPublic ? /13 indexable archives, 13 reachable/ : /0 indexable archives, 0 reachable/);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
}
