export const PROGRESS_STORAGE_KEY = 'cc-progress';
export const LAST_READ_STORAGE_KEY = 'cc-last-read';
export const PROGRESS_CHANGED_EVENT = 'cc-progress-changed';
export const PROGRESS_RESET_EVENT = 'cc-progress-reset';
export const READ_THRESHOLD = 85;
export const PROGRESS_WRITE_INTERVAL = 1000;

export type ReadingProgress = Record<string, number>;
export type LastRead = { slug: string; pct: number; anchor: string | null; visitedAt: number };
type ProgressStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isChapterSlug(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function clampProgress(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 0;
}

function parseStored(raw: string | null): unknown {
  try { return raw === null ? null : JSON.parse(raw); } catch { return null; }
}

export function parseReadingProgress(raw: string | null): ReadingProgress {
  const value = parseStored(raw);
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .filter(([slug, pct]) => isChapterSlug(slug) && typeof pct === 'number' && Number.isFinite(pct))
    .map(([slug, pct]) => [slug, clampProgress(pct)]));
}

export function normalizeAnchor(value: unknown): string | null {
  if (typeof value !== 'string' || !value || value.length > 512 || /[\s\u0000-\u001f\u007f#]/u.test(value)) return null;
  try { encodeURIComponent(value); return value; } catch { return null; }
}

function normalizeLastRead(value: unknown): LastRead | null {
  if (!isRecord(value) || !isChapterSlug(value.slug)
    || typeof value.pct !== 'number' || !Number.isFinite(value.pct)
    || typeof value.visitedAt !== 'number' || !Number.isSafeInteger(value.visitedAt)
    || value.visitedAt <= 0 || value.visitedAt > 8.64e15) return null;
  return { slug: value.slug, pct: clampProgress(value.pct), anchor: normalizeAnchor(value.anchor), visitedAt: value.visitedAt };
}

export function parseLastRead(raw: string | null): LastRead | null {
  return normalizeLastRead(parseStored(raw));
}

export function calculateReadingProgress(top: number, height: number, viewportHeight: number): number {
  if (![top, height, viewportHeight].every(Number.isFinite) || height <= 0 || viewportHeight <= 0) return 0;
  const distance = height - viewportHeight;
  if (distance <= 0) return top + height <= viewportHeight ? 100 : 0;
  return clampProgress((-top / distance) * 100);
}

export function findReadingAnchor(sections: readonly { id: string; top: number }[], readingLine = 96): string | null {
  let anchor: string | null = null;
  for (const section of sections) {
    const id = normalizeAnchor(section.id);
    // Fragment scrolling can land a fraction of a CSS pixel past scroll-margin-top.
    if (id && Number.isFinite(section.top) && Math.round(section.top) <= readingLine) anchor = id;
  }
  return anchor;
}

export function updateReadingProgress(progress: ReadingProgress, lastRead: LastRead | null, visit: LastRead, furthestPct = visit.pct) {
  const next = normalizeLastRead(visit);
  if (!next) return { progress, lastRead };
  return {
    progress: { ...progress, [next.slug]: Math.max(clampProgress(progress[next.slug]), next.pct, clampProgress(furthestPct)) },
    // A delayed flush from a background tab must not replace a newer visit.
    lastRead: lastRead && lastRead.visitedAt > next.visitedAt ? lastRead : next,
  };
}

export function getResumeTarget<T extends { slug: string }>(progress: ReadingProgress, lastRead: LastRead | null, chapters: readonly T[]) {
  const recent = lastRead && chapters.find((chapter) => chapter.slug === lastRead.slug);
  if (recent && lastRead && Object.hasOwn(progress, recent.slug)) return { ...recent, ...lastRead };
  // Legacy percentages carry no visit order; offer the first unfinished chapter without inventing recency.
  const unfinished = chapters.find(({ slug }) => clampProgress(progress[slug]) >= 5 && clampProgress(progress[slug]) < 95);
  return unfinished ? { ...unfinished, pct: clampProgress(progress[unfinished.slug]), anchor: null, visitedAt: null } : null;
}

export function readingHref(slug: string, anchor: string | null, baseUrl = '/'): string {
  const base = baseUrl.replace(/\/+$/, '');
  const section = normalizeAnchor(anchor);
  return `${base}/chapters/${encodeURIComponent(slug)}/${section ? `#${encodeURIComponent(section)}` : ''}`;
}

function browserStorage(): ProgressStorage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

function readStored(key: string, storage: ProgressStorage | null): string | null {
  try { return storage?.getItem(key) ?? null; } catch { return null; }
}

export function readReadingProgress(storage = browserStorage()): ReadingProgress {
  return parseReadingProgress(readStored(PROGRESS_STORAGE_KEY, storage));
}

export function readLastRead(storage = browserStorage()): LastRead | null {
  return parseLastRead(readStored(LAST_READ_STORAGE_KEY, storage));
}

function notify(event: string) {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(event));
}

export function writeReadingProgress(visit: LastRead, furthestPct = visit.pct, storage = browserStorage()): boolean {
  if (!storage || !normalizeLastRead(visit)) return false;
  const next = updateReadingProgress(readReadingProgress(storage), readLastRead(storage), visit, furthestPct);
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next.progress));
    storage.setItem(LAST_READ_STORAGE_KEY, JSON.stringify(next.lastRead));
    notify(PROGRESS_CHANGED_EVENT);
    return true;
  } catch { return false; }
}

export function resetReadingProgress(storage = browserStorage()): boolean {
  let cleared = storage !== null;
  for (const key of [PROGRESS_STORAGE_KEY, LAST_READ_STORAGE_KEY]) {
    try { storage?.removeItem(key); } catch { cleared = false; }
  }
  // Cancel pending page writes before consumers read the cleared state.
  notify(PROGRESS_RESET_EVENT);
  notify(PROGRESS_CHANGED_EVENT);
  return cleared;
}
