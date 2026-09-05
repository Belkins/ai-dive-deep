export type SearchItem = {
  type: 'chapter' | 'page' | 'section' | 'glossary' | 'note';
  title: string;
  subtitle?: string;
  href: string;
  keywords?: string;
};

export type SearchResult = SearchItem & { id: string; fuzzy: boolean };

type SearchDocument = {
  item: SearchResult;
  title: string;
  subtitle: string;
  keywords: string;
  words: string[];
};

export const MAX_SEARCH_QUERY_LENGTH = 160;
export const POPULAR_PATHS = [
  '/learn/', '/dynamic-workflows/', '/dreaming/', '/day-zero/', '/cheat-sheet/',
  '/tier-list/', '/sovereign-stack/', '/html-first/', '/showcase/',
] as const;

const TYPE_BONUS: Record<SearchItem['type'], number> = {
  page: 5, chapter: 4, section: 3, glossary: 2, note: 1,
};

export function normalizeSearchHref(href: string): string {
  const url = new URL(href, 'https://search.invalid');
  return `${url.origin}${url.pathname.replace(/\/+$/, '') || '/'}${url.search}${url.hash}`;
}

export function normalizeSearchText(text: string): string {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function createSearchIndex(items: readonly SearchItem[]): SearchDocument[] {
  const documents = new Map<string, SearchDocument>();
  for (const item of items) {
    // Same-destination entries can represent different notes or result types.
    const id = JSON.stringify([item.type, normalizeSearchHref(item.href), item.title]);
    const existing = documents.get(id);
    const title = normalizeSearchText(item.title);
    const subtitle = normalizeSearchText(item.subtitle || '');
    const keywords = normalizeSearchText(item.keywords || '');
    if (existing) {
      existing.subtitle += ` ${subtitle}`;
      existing.keywords += ` ${keywords}`;
      continue;
    }
    documents.set(id, {
      item: { ...item, id, fuzzy: false }, title, subtitle, keywords,
      words: [...new Set(title.split(' '))],
    });
  }
  return [...documents.values()];
}

function tokenScore(document: SearchDocument, token: string): number {
  if (document.title.includes(token)) return 12;
  if (document.subtitle.includes(token)) return 6;
  if (document.keywords.includes(token)) return 3;
  return 0;
}

function editDistance(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const row = [i + 1];
    let minimum = row[0];
    for (let j = 0; j < b.length; j++) {
      row[j + 1] = Math.min(row[j] + 1, previous[j + 1] + 1, previous[j] + (a[i] === b[j] ? 0 : 1));
      minimum = Math.min(minimum, row[j + 1]);
    }
    if (minimum > limit) return limit + 1;
    previous = row;
  }
  return previous[b.length];
}

export function searchItems(
  index: readonly SearchDocument[],
  query: string,
  popularHrefs: readonly string[] = POPULAR_PATHS,
): SearchResult[] {
  if (!query.trim()) {
    const pages = new Map(index.filter(({ item }) => item.type === 'page')
      .map(({ item }) => [normalizeSearchHref(item.href), item]));
    return [...new Set(popularHrefs.map(normalizeSearchHref))]
      .flatMap((href) => pages.has(href) ? [pages.get(href)!] : []);
  }
  if (query.length > MAX_SEARCH_QUERY_LENGTH) return [];
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const tokens = [...new Set(normalized.split(' '))];
  const needle = tokens.join(' ');
  const scored = index.flatMap((document) => {
    const scores = tokens.map((token) => tokenScore(document, token));
    if (scores.some((score) => score === 0)) return [];
    const phraseBonus = document.title === needle ? 200
      : document.title.startsWith(needle) ? 100 : document.title.includes(needle) ? 50 : 0;
    return [{
      item: document.item,
      score: phraseBonus + scores.reduce((sum, score) => sum + score, 0) + TYPE_BONUS[document.item.type],
    }];
  });
  const exact = scored.sort((a, b) => b.score - a.score).slice(0, 24).map(({ item }) => item);
  if (exact.length >= 3 || needle.length < 3 || needle.length > 64) return exact;

  // Only missing tokens use bounded fuzzy matching against title words.
  const exactIds = new Set(exact.map(({ id }) => id));
  const fuzzy = index.filter(({ item }) => !exactIds.has(item.id)).flatMap((document) => {
    let distance = 0;
    for (const token of tokens) {
      if (tokenScore(document, token)) continue;
      if (token.length < 4) return [];
      const limit = token.length <= 5 ? 1 : 2;
      const closest = Math.min(limit + 1, ...document.words.map((word) => editDistance(token, word, limit)));
      if (closest > limit) return [];
      distance += closest;
      if (distance > 2) return [];
    }
    return distance > 0 ? [{ item: document.item, distance }] : [];
  });
  return [...exact, ...fuzzy.sort((a, b) => a.distance - b.distance).slice(0, 5)
    .map(({ item }) => ({ ...item, fuzzy: true }))];
}

export function moveSearchSelection(current: number, count: number, delta: -1 | 1): number {
  if (count === 0) return -1;
  if (current < 0) return delta === 1 ? 0 : count - 1;
  return Math.max(0, Math.min(count - 1, current + delta));
}
