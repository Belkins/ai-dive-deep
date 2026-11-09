import type { APIRoute, GetStaticPaths } from 'astro';
import { SOP_LIBRARY, renderSopMarkdown, type Sop } from '@/lib/sops';

export const getStaticPaths = (() => SOP_LIBRARY.map(sop => ({
  params: { slug: sop.slug }, props: { sop },
}))) satisfies GetStaticPaths;

// Prerendered to dist/sops/<slug>.md: GitHub Pages serves it with its own MIME type and ignores these headers;
// the page link's download attribute is what names the saved file.
export const GET: APIRoute = ({ props }) => {
  const sop = props.sop as Sop;
  return new Response(renderSopMarkdown(sop), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${sop.slug}.md"`,
    },
  });
};
