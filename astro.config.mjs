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
  site: isVercel ? (process.env.SITE_URL || 'https://ai-dive-deep.vercel.app') : 'https://dive.vladyslavpodoliako.com',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    react(),
    sitemap(),
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
