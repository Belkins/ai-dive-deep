// The page <title> rule, used by BaseLayout for <title>, og:title and twitter:title.
//
// Decided by Vlad on 10 Nov 2026: the brand suffix (" — " and the brand) is added only
// where the whole title stays within 60 characters; a longer title is the authored title
// alone, word for word. The home page keeps its own full title.
//
// Plain JavaScript on purpose, so node --test can import it on Node 20 without a build.

export const TITLE_MAX_LENGTH = 60;

/**
 * @param {string} title The page's authored title prop.
 * @param {string} brand The brand suffix text.
 * @param {string} homeTitle The home page's full title.
 * @returns {string}
 */
export function pageTitle(title, brand, homeTitle) {
  if (title === brand || title === homeTitle) return homeTitle;
  const withBrand = `${title} — ${brand}`;
  // Count code points, as a reader counts characters, not UTF-16 units.
  return [...withBrand].length <= TITLE_MAX_LENGTH ? withBrand : title;
}
