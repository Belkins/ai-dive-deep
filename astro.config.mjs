import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://belkins.github.io',
  base: '/ai-dive-deep',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    react(),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
  vite: {
    ssr: { noExternal: ['lucide-react'] },
  },
});
