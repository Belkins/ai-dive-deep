import type { APIRoute, GetStaticPaths } from 'astro';
import { SOP_LIBRARY, renderSopMarkdown, type Sop } from '@/lib/sops';

export const getStaticPaths = (() => SOP_LIBRARY.map(sop => ({
  params: { slug: sop.slug }, props: { sop },
}))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const sop = props.sop as Sop;
  return new Response(renderSopMarkdown(sop), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${sop.slug}.md"`,
    },
  });
};
