import type { SearchItem } from './search';

// Chapter H2 and H3 headings as search entries. The build writes them to /search-sections.json
// (src/pages/search-sections.json.ts) and the palette fetches that file when it first opens, so the
// headings never add to the JavaScript that loads with the palette.

export type AstroHeading = { depth: number; slug: string; text: string };
export type ChapterSections = { id: string; number: number; title: string; headings: { slug: string; text: string }[] };

export const SECTIONS_PATH = '/search-sections.json';

// rehype-autolink-headings appends a "#" link inside every heading, and Astro's heading text includes it.
const withoutAnchor = (text: string) => text.replace(/\s*#$/, '');

// Build-time shape: the slug is Astro's own heading id, the one the rendered page carries.
export function chapterSections(
  chapter: { id: string; number: number; title: string },
  headings: readonly AstroHeading[],
): ChapterSections {
  return {
    id: chapter.id,
    number: chapter.number,
    title: chapter.title,
    headings: headings.filter(({ depth }) => depth === 2 || depth === 3)
      .map(({ slug, text }) => ({ slug, text: withoutAnchor(text) })),
  };
}

export function chapterSectionItems(chapters: unknown, base = ''): SearchItem[] {
  if (!Array.isArray(chapters)) return [];
  return chapters.flatMap((chapter) => {
    if (typeof chapter?.id !== 'string' || typeof chapter.title !== 'string' || !Array.isArray(chapter.headings)) return [];
    return chapter.headings.flatMap((heading: unknown) => {
      const { slug, text } = (heading ?? {}) as { slug?: unknown; text?: unknown };
      if (typeof slug !== 'string' || !slug || typeof text !== 'string' || !text.trim()) return [];
      return [{
        type: 'section' as const,
        heading: true,
        title: text,
        subtitle: `Ch ${chapter.number} · ${chapter.title}`,
        href: `${base}/chapters/${chapter.id}/#${slug}`,
      }];
    });
  });
}

let request: Promise<SearchItem[]> | null = null;

// One request per page session. A failed fetch resolves to no entries (the palette works without them)
// and is tried again the next time the palette opens.
export function loadChapterSectionItems(base = ''): Promise<SearchItem[]> {
  request ??= fetch(`${base}${SECTIONS_PATH}`)
    .then((response) => {
      if (!response.ok) throw new Error(`search sections: HTTP ${response.status}`);
      return response.json();
    })
    .then((chapters) => {
      if (!Array.isArray(chapters)) throw new Error('search sections: not a list');
      return chapterSectionItems(chapters, base);
    })
    .catch(() => {
      request = null;
      return [];
    });
  return request;
}
