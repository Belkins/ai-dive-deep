const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://dive.vladyslavpodoliako.com/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
`;

export function GET() {
  return new Response(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
