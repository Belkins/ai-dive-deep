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
