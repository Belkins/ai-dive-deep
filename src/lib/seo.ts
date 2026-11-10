export const SEO_DESCRIPTION_MAX_LENGTH = 160;

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

export function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#(?:x[\da-f]+|\d+)|[a-z]+);/gi, (entity, key: string) => {
    if (key.startsWith('#')) {
      const hex = key[1]?.toLowerCase() === 'x';
      const codePoint = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
      const isUnicodeScalar = Number.isInteger(codePoint)
        && codePoint >= 0
        && codePoint <= 0x10ffff
        && !(codePoint >= 0xd800 && codePoint <= 0xdfff);
      return isUnicodeScalar ? String.fromCodePoint(codePoint) : entity;
    }

    return HTML_ENTITIES[key.toLowerCase()] ?? entity;
  });
}

function protectInlineCode(value: string): { value: string; codeSpans: string[] } {
  const codeSpans: string[] = [];
  const protectedValue = value.replace(/(?<!`)`([^`\r\n]+)`(?!`)/g, (_match, code: string) => {
    const index = codeSpans.push(code.replace(/\s+/g, ' ').trim()) - 1;
    return `\uE000${index}\uE001`;
  });
  return { value: protectedValue, codeSpans };
}

function restoreInlineCode(value: string, codeSpans: string[]): string {
  return value.replace(/\uE000(\d+)\uE001/g, (token, index: string) => codeSpans[Number(index)] ?? token);
}

export function seoTextLength(value: string): number {
  return Array.from(value).length;
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return '';

  const protectedCode = protectInlineCode(decodeHtmlEntities(value));
  const plainText = protectedCode.value
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<(https?:\/\/[^>]+)>/gi, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+[.)])\s+/gm, '')
    .replace(/```(?:\w+)?|```|`/g, '')
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '$1')
    .replace(/__(?=\S)([\s\S]*?\S)__/g, '$1')
    .replace(/~~(?=\S)([\s\S]*?\S)~~/g, '$1')
    .replace(/(^|[\s([{])\*(?=\S)([^*\n]*?\S)\*(?=$|[\s)\]},.!?:;])/g, '$1$2')
    .replace(/(^|[\s([{])_(?=\S)([^_\n]*?\S)_(?=$|[\s)\]},.!?:;])/g, '$1$2')
    .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return restoreInlineCode(plainText, protectedCode.codeSpans);
}

export function truncateSeoDescription(
  value: string,
  maxLength = SEO_DESCRIPTION_MAX_LENGTH,
): string {
  const characters = Array.from(value);
  if (characters.length <= maxLength) return value;
  if (maxLength <= 3) return '.'.repeat(Math.max(0, maxLength));

  const available = maxLength - 3;
  const candidate = characters.slice(0, available + 1);
  const wordBoundary = candidate.lastIndexOf(' ');
  const cutoff = wordBoundary >= Math.floor(available * 0.65) ? wordBoundary : available;
  return `${candidate.slice(0, cutoff).join('').trimEnd()}...`;
}

export function createSeoDescription(
  value: unknown,
  fallback: unknown,
  maxLength = SEO_DESCRIPTION_MAX_LENGTH,
): string {
  const description = toPlainText(value) || toPlainText(fallback);
  return truncateSeoDescription(description, maxLength);
}

interface ChapterSeoDescriptionInput {
  seoDescription?: string;
  tldr: string;
  title: string;
  subtitle: string;
}

export function createChapterSeoDescription({
  seoDescription,
  tldr,
  title,
  subtitle,
}: ChapterSeoDescriptionInput): string {
  if (seoDescription) return createSeoDescription(seoDescription, `${title}. ${subtitle}`);

  const plainTldr = toPlainText(tldr);
  if (plainTldr && seoTextLength(plainTldr) <= SEO_DESCRIPTION_MAX_LENGTH) return plainTldr;

  return createSeoDescription(`${title}. ${subtitle}`, plainTldr);
}

interface DefinedTermInput {
  term: string;
  definition: string;
}

// schema.org DefinedTermSet for the glossary. The visible page renders each
// definition as HTML; machine readers get the same words as plain text.
export function createDefinedTermSet(name: string, url: string, entries: DefinedTermInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name,
    url,
    hasDefinedTerm: entries.map((e) => ({
      '@type': 'DefinedTerm',
      name: e.term,
      description: toPlainText(e.definition),
      inDefinedTermSet: url,
      url: `${url}#${encodeURIComponent(e.term)}`,
    })),
  };
}

export interface LlmsPage {
  url: string;
  title: string;
  description?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A page counts as listed in llms.txt when its absolute URL appears as a link
// target or as a bare URL, ending where a URL ends (so /opus-5/use-cases/ does
// not count for /opus-5/).
export function llmsMissingUrls(llmsText: string, urls: string[]): string[] {
  return urls.filter((url) => !new RegExp(`${escapeRegExp(url)}(?=$|[\\s),.;:#\\]])`, 'm').test(llmsText));
}

// Adds one "- [title](url) — description" line per page to the end of the
// llms.txt site map, in the format of the hand-written lines above it.
export function addMissingLlmsPages(llmsText: string, pages: LlmsPage[], nextHeading = '## Chapters'): string {
  if (pages.length === 0) return llmsText;
  const marker = `\n\n${nextHeading}\n`;
  const at = llmsText.indexOf(marker);
  if (at === -1) throw new Error(`llms.txt has no "${nextHeading}" heading to insert the site map lines before`);
  const lines = pages.map((page) => `- [${page.title}](${page.url})${page.description ? ` — ${page.description}` : ''}`);
  return `${llmsText.slice(0, at)}\n${lines.join('\n')}${llmsText.slice(at)}`;
}

// Reads a built page's own title (without the brand suffix) and meta description.
export function readPageHead(html: string, brand: string): { title: string; description?: string } {
  const rawTitle = decodeHtmlEntities(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '').trim();
  const suffix = ` — ${brand}`;
  const title = rawTitle.endsWith(suffix) ? rawTitle.slice(0, -suffix.length) : rawTitle;
  const rawDescription = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const description = rawDescription === undefined ? undefined : decodeHtmlEntities(rawDescription).trim() || undefined;
  return { title, description };
}
