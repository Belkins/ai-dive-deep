// Single source of truth for the Radar dark→public flip. Imported by both radar pages
// AND astro.config.mjs so noindex, the eyebrow, sitemap inclusion, and IndexNow flip
// together atomically — no two-file drift (review-swarm MINOR finding).
//   false → dark: noindex, "private preview" eyebrow, excluded from sitemap (so IndexNow skips it)
//   true  → public: indexable, "live" eyebrow, in sitemap with truthful lastmod, pinged
export const RADAR_PUBLIC = true;

// A day with too few items is genuinely thin — fail closed: that archive ships noindex
// and out of the sitemap regardless of RADAR_PUBLIC (the visible methodology keeps normal
// days well above the unique-text floor; this guards a broken/degenerate ingest day).
export const RADAR_MIN_ITEMS = 12;

/** @typedef {{ date: string, items?: unknown[] }} RadarEdition */

/**
 * Supplying liveDate restricts eligibility to frozen editions. The live board
 * uses the same public/content threshold without that date restriction.
 * @param {RadarEdition | undefined} edition
 * @param {{ liveDate?: string, isPublic?: boolean }} options
 */
export function isRadarEditionIndexable(edition, { liveDate, isPublic = RADAR_PUBLIC } = {}) {
  return isPublic && Array.isArray(edition?.items)
    && edition.items.length >= RADAR_MIN_ITEMS
    && (liveDate === undefined || edition.date < liveDate);
}

/**
 * @param {RadarEdition[]} archives
 * @param {string} liveDate
 * @param {boolean} isPublic
 */
export function getRadarArchiveDates(archives, liveDate, isPublic = RADAR_PUBLIC) {
  return [...new Set(archives
    .filter(edition => isRadarEditionIndexable(edition, { liveDate, isPublic }))
    .map(edition => edition.date))].sort().reverse();
}

/**
 * Neighbors are relative to the displayed edition, not the newest seven.
 * @param {string[]} archiveDates Eligible frozen dates only.
 * @param {string} currentDate
 */
export function getRadarArchiveNavigation(archiveDates, currentDate) {
  const dates = [...new Set(archiveDates)].sort().reverse();
  return {
    recent: dates.filter(date => date !== currentDate).slice(0, 7),
    older: dates.find(date => date < currentDate),
    newer: dates.filter(date => date > currentDate).at(-1),
  };
}
