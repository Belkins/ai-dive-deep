import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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
      filter: (page) => !page.includes('/the-bill'),
      // Reader-invisible crawl signals only. Default daily/0.7; the homepage and
      // chapter pages are the primary content surfaces, so bump their priority.
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        const lastmod = new Date().toISOString();
        if (path === '') {
          return { ...item, changefreq: 'daily', priority: 1.0, lastmod };
        }
        if (path.startsWith('/chapters/')) {
          return { ...item, changefreq: 'weekly', priority: 0.9, lastmod };
        }
        return { ...item, changefreq: 'monthly', priority: 0.7, lastmod };
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
