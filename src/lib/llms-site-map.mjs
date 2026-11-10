// Helpers for the llms.txt completion step in astro.config.mjs.
//
// Plain JavaScript on purpose. Node loads astro.config.mjs directly (Astro tries that
// first, and tests/search-sections.test.mjs imports it), and Node 20, which the deploy
// workflow runs, cannot import a .ts file. Keep this file free of TypeScript imports.

// Astro escapes these five characters when it writes a <title> or an attribute value.
const BUILT_HTML_ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

/** @param {string} value */
function unescapeBuiltHtml(value) {
  return value.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => BUILT_HTML_ENTITIES[entity]);
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * A page counts as listed in llms.txt when its absolute URL appears as a link
 * target or as a bare URL, ending where a URL ends (so /opus-5/use-cases/ does
 * not count for /opus-5/).
 * @param {string} llmsText
 * @param {string[]} urls
 * @returns {string[]}
 */
export function llmsMissingUrls(llmsText, urls) {
  return urls.filter((url) => !new RegExp(`${escapeRegExp(url)}(?=$|[\\s),.;:#\\]])`, 'm').test(llmsText));
}

/**
 * Adds one "- [title](url) — description" line per page to the end of the
 * llms.txt site map, in the format of the hand-written lines above it.
 * @param {string} llmsText
 * @param {{ url: string, title: string, description?: string }[]} pages
 * @param {string} [nextHeading]
 * @returns {string}
 */
export function addMissingLlmsPages(llmsText, pages, nextHeading = '## Chapters') {
  if (pages.length === 0) return llmsText;
  const marker = `\n\n${nextHeading}\n`;
  const at = llmsText.indexOf(marker);
  if (at === -1) throw new Error(`llms.txt has no "${nextHeading}" heading to insert the site map lines before`);
  const lines = pages.map((page) => `- [${page.title}](${page.url})${page.description ? ` — ${page.description}` : ''}`);
  return `${llmsText.slice(0, at)}\n${lines.join('\n')}${llmsText.slice(at)}`;
}

/**
 * The site name a built page declares in og:site_name. Its <title> ends with the
 * same name, so this is the brand suffix readPageHead removes.
 * @param {string} html
 * @returns {string}
 */
export function readSiteName(html) {
  return unescapeBuiltHtml(html.match(/<meta property="og:site_name" content="([^"]*)"/)?.[1] ?? '').trim();
}

/**
 * Reads a built page's own title (without the brand suffix) and meta description.
 * @param {string} html
 * @param {string} brand
 * @returns {{ title: string, description?: string }}
 */
export function readPageHead(html, brand) {
  const rawTitle = unescapeBuiltHtml(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '').trim();
  const suffix = ` — ${brand}`;
  const title = rawTitle.endsWith(suffix) ? rawTitle.slice(0, -suffix.length) : rawTitle;
  const rawDescription = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const description = rawDescription === undefined ? undefined : unescapeBuiltHtml(rawDescription).trim() || undefined;
  return { title, description };
}
