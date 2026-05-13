export const config = { runtime: 'edge' };

const CANONICAL = 'https://dive.vladyslavpodoliako.com/tier-list/';
// OG_ORIGIN: where the dynamic OG image lives. Currently the Vercel-provided
// alias. When Vlad adds a CNAME for og.vladyslavpodoliako.com → cname.vercel-
// dns.com and the cert is issued, flip this to https://og.vladyslavpodoliako.com.
const OG_ORIGIN = 'https://ai-dive-deep-og.vercel.app';

// Loose base64 validator (URL-safe variants tolerated).
// Allows A-Z, a-z, 0-9, +, /, -, _, = padding. Length >= 4.
const BASE64_RE = /^[A-Za-z0-9+/_-]{4,}={0,2}$/;

function isValidBase64(id: string): boolean {
  if (!BASE64_RE.test(id)) return false;
  try {
    if (typeof atob === 'function') {
      atob(id.replace(/-/g, '+').replace(/_/g, '/'));
    } else {
      Buffer.from(id, 'base64');
    }
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  // The rewrite maps /s/:id → /api/s/[id]; Vercel exposes :id as a query param
  // on edge functions. Fall back to parsing the path for direct hits.
  let id = url.searchParams.get('id');
  if (!id) {
    const parts = url.pathname.split('/').filter(Boolean);
    id = parts[parts.length - 1] ?? '';
  }

  if (!id || !isValidBase64(id)) {
    return Response.redirect(CANONICAL, 302);
  }

  const safeId = encodeURIComponent(id);
  const ogImage = `${OG_ORIGIN}/api/og/tier-list?tl=${safeId}`;
  const target = `${CANONICAL}#tl=${safeId}`;
  const ogImageEsc = escapeHtml(ogImage);
  const targetEsc = escapeHtml(target);
  const idJs = JSON.stringify(id);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>My AI tools tier list — Vlad's Ultimate AI Dive Deep</title>
<meta property="og:type" content="website" />
<meta property="og:title" content="My AI tools tier list — Vlad's Ultimate AI Dive Deep" />
<meta property="og:description" content="Operator-usefulness ranking. Drag your own." />
<meta property="og:image" content="${ogImageEsc}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${targetEsc}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="My AI tools tier list — Vlad's Ultimate AI Dive Deep" />
<meta name="twitter:description" content="Operator-usefulness ranking. Drag your own." />
<meta name="twitter:image" content="${ogImageEsc}" />
<meta http-equiv="refresh" content="0;url=${targetEsc}" />
<link rel="canonical" href="${targetEsc}" />
<style>
  body { background:#0E0F11; color:#E4E4E7; font-family: system-ui, -apple-system, sans-serif; padding:40px; }
  a { color:#FF8E54; }
</style>
</head>
<body>
<p>Redirecting to your tier list… <a href="${targetEsc}">Click here if not redirected.</a></p>
<script>
  (function(){
    try {
      var id = ${idJs};
      window.location.replace(${JSON.stringify(CANONICAL)} + '#tl=' + encodeURIComponent(id));
    } catch (e) {
      window.location.href = ${JSON.stringify(CANONICAL)};
    }
  })();
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Cache the share page briefly — bot scrapes are usually fresh per URL,
      // and the payload is fully encoded in the URL so caching by URL is safe.
      'cache-control': 'public, max-age=60, s-maxage=300',
    },
  });
}
