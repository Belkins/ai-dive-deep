import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/chapters' }),
  schema: z.object({
    number: z.number().int().min(1).max(50),
    slug: z.string(),
    title: z.string(),
    subtitle: z.string(),
    tldr: z.string(),
    keyConcepts: z.array(z.string()).default([]),
    readingMinutes: z.number().int().min(1).default(8),
    video: z
      .object({
        title: z.string(),
        youtubeId: z.string(),
      })
      .optional(),
    widget: z.string().optional(),
    prevSlug: z.string().nullable().optional(),
    nextSlug: z.string().nullable().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { chapters };
