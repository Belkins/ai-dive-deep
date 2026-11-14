// Colours of highlighted code (Shiki). Dark pages keep github-dark-dimmed, written inline as before.
// In the light site theme Shiki's github-light-high-contrast paints the code: each token carries its
// light colour in --shiki-light, and global.css applies it on the page colour (--bg), where its lowest
// token, the comment grey, is 4.8:1. astro.config.mjs reads shikiConfig(); nothing else does.
export const DARK_THEME = 'github-dark-dimmed';
export const LIGHT_THEME = 'github-light-high-contrast';

export function shikiConfig() {
  return { themes: { light: LIGHT_THEME, dark: DARK_THEME }, defaultColor: 'dark', wrap: true };
}
