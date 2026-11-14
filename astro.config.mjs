import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isRadarEditionIndexable } from './src/lib/radar-config.mjs';
import { shikiConfig } from './src/lib/code-colours.mjs';
import { addMissingLlmsPages, llmsMissingUrls, readPageHead, readSiteName } from './src/lib/llms-site-map.mjs';

// The live Radar edition decides whether /radar is in the sitemap and gives its truthful
// lastmod (review-swarm: build-time new Date() lies). Dated archives are not in the sitemap.
let radarCurrent;
let radarCurrentLastmod;
try {
  radarCurrent = JSON.parse(readFileSync('src/data/radar/today.json', 'utf8'));
  if (radarCurrent.generated) radarCurrentLastmod = radarCurrent.generated;
} catch { /* radar optional */ }

// Chapter lastmod comes from the git-derived modified date that prebuild writes
// (scripts/gen-chapter-dates.py). Hub pages get none: their content comes from data
// files, so a page-file date would be wrong. Build time is never a date source.
let chapterDates = {};
try {
  chapterDates = JSON.parse(readFileSync('src/data/chapter-dates.json', 'utf8'));
} catch { /* dates optional */ }

// Choose deploy target via env: DEPLOY_TARGET=vercel | gh-pages (default)
// gh-pages now serves from custom domain dive.vladyslavpodoliako.com (root path).
const target = process.env.DEPLOY_TARGET || 'gh-pages';
const isVercel = target === 'vercel';

// llms.txt lists every non-radar page the sitemap lists. Runs after @astrojs/sitemap
// has written dist/sitemap-0.xml, so both read the same page set; a page missing from
// the hand-written site map is appended with its own built title and meta description.
function llmsSiteMap() {
  return {
    name: 'llms-site-map',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const llmsPath = join(root, 'llms.txt');
        // Test fixtures build a reduced page set with no llms.txt or sitemap: nothing to complete.
        if (!existsSync(llmsPath) || !existsSync(join(root, 'sitemap-0.xml'))) return;
        const urls = [...readFileSync(join(root, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
          .map((m) => m[1])
          .filter((url) => {
            const path = new URL(url).pathname;
            return path !== '/radar' && !path.startsWith('/radar/');
          });
        const text = readFileSync(llmsPath, 'utf8');
        const pages = llmsMissingUrls(text, urls).map((url) => {
          const html = readFileSync(join(root, new URL(url).pathname, 'index.html'), 'utf8');
          return { url, ...readPageHead(html, readSiteName(html)) };
        });
        const next = addMissingLlmsPages(text, pages);
        const stillMissing = llmsMissingUrls(next, urls);
        if (stillMissing.length > 0) throw new Error(`llms.txt is missing sitemap pages: ${stillMissing.join(', ')}`);
        writeFileSync(llmsPath, next);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // SEO guardrail: the canonical host is the custom domain on EVERY target.
  // Even on Vercel we default `site` to the custom domain so an accidental
  // preview/production deploy can't emit ~75 canonical tags + JSON-LD @id URLs
  // pointing at the Vercel host and split the domains index. The explicit
  // override (set SITE_URL on Vercel) is preserved for if it ever goes primary.
  site: isVercel ? (process.env.SITE_URL || 'https://dive.vladyslavpodoliako.com') : 'https://dive.vladyslavpodoliako.com',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    react(),
    sitemap({
      // The live Radar board uses the same eligibility as its page robots. The dated
      // archive pages stay built, linked and indexable for readers but are left out of
      // the sitemap (Vlad's decision, 10 Nov 2026), so IndexNow skips them too.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        if (path === '/radar') return isRadarEditionIndexable(radarCurrent);
        if (path.startsWith('/radar/')) return false;
        return !page.includes('/the-bill');
      },
      // Reader-invisible crawl signals only. Default daily/0.7; the homepage and
      // chapter pages are the primary content surfaces, so bump their priority.
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        const { lastmod: _lastmod, ...withoutLastmod } = item;
        if (path === '') {
          return { ...withoutLastmod, changefreq: 'daily', priority: 1.0 };
        }
        if (path.startsWith('/chapters/')) {
          const modified = chapterDates[path.slice('/chapters/'.length)]?.modified;
          return { ...withoutLastmod, changefreq: 'weekly', priority: 0.9, ...(modified ? { lastmod: modified } : {}) };
        }
        // /radar: hourly-changing live board.
        if (path === '/radar') {
          return {
            ...withoutLastmod,
            changefreq: 'hourly',
            priority: 0.8,
            ...(radarCurrentLastmod ? { lastmod: radarCurrentLastmod } : {}),
          };
        }
        return { ...withoutLastmod, changefreq: 'monthly', priority: 0.7 };
      },
    }),
    tailwind({ applyBaseStyles: false }),
    llmsSiteMap(),
  ],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'], ariaHidden: 'true', tabIndex: -1 },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
    // Code colours in both site themes: src/lib/code-colours.mjs.
    shikiConfig: shikiConfig(),
  },
  vite: {
    ssr: { noExternal: ['lucide-react'] },
  },
});
