import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { getRadarArchiveDates, isRadarEditionIndexable } from './src/lib/radar-config.mjs';

// Build a date → freeze-timestamp map from the radar archives so the sitemap can carry
// truthful per-archive lastmod (review-swarm: build-time new Date() lies on immutable pages).
const radarLastmod = {};
const radarArchives = [];
let radarCurrent;
let radarCurrentLastmod;
try {
  const dir = 'src/data/radar/archive';
  if (existsSync(dir)) {
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.json')) {
        const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
        radarArchives.push(j);
        if (j.date && j.generated) radarLastmod[j.date] = j.generated;
      }
    }
  }
  radarCurrent = JSON.parse(readFileSync('src/data/radar/today.json', 'utf8'));
  if (radarCurrent.generated) radarCurrentLastmod = radarCurrent.generated;
} catch { /* archives optional */ }
const radarArchiveDates = new Set(getRadarArchiveDates(radarArchives, radarCurrent?.date ?? ''));

// Choose deploy target via env: DEPLOY_TARGET=vercel | gh-pages (default)
// gh-pages now serves from custom domain dive.vladyslavpodoliako.com (root path).
const target = process.env.DEPLOY_TARGET || 'gh-pages';
const isVercel = target === 'vercel';

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
      // Radar uses the same eligibility as page robots and archive navigation.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        if (path === '/radar') return isRadarEditionIndexable(radarCurrent);
        if (path.startsWith('/radar/')) return radarArchiveDates.has(path.slice('/radar/'.length));
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
          return { ...withoutLastmod, changefreq: 'weekly', priority: 0.9 };
        }
        // /radar: hourly-changing live board; dated archives carry their true freeze time.
        if (path === '/radar') {
          return {
            ...withoutLastmod,
            changefreq: 'hourly',
            priority: 0.8,
            ...(radarCurrentLastmod ? { lastmod: radarCurrentLastmod } : {}),
          };
        }
        const radarDate = path.startsWith('/radar/') ? path.slice('/radar/'.length) : null;
        if (radarDate && radarLastmod[radarDate]) {
          return { ...withoutLastmod, changefreq: 'never', priority: 0.6, lastmod: radarLastmod[radarDate] };
        }
        return { ...withoutLastmod, changefreq: 'monthly', priority: 0.7 };
      },
    }),
    tailwind({ applyBaseStyles: false }),
  ],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'], 'aria-label': 'Anchor link' },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
  vite: {
    ssr: { noExternal: ['lucide-react'] },
  },
});
