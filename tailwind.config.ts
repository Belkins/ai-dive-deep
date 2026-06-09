import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#FAFAF7',
          100: '#F2F1EC',
          200: '#E5E3DA',
          300: '#C9C6B8',
          400: '#8C897C',
          500: '#56544B',
          600: '#3A3933',
          700: '#26251F',
          800: '#1A1916',
          900: '#0E0F11',
          950: '#08090B',
        },
        flame: {
          DEFAULT: '#FF6B2C',
          50:  '#FFF1E9',
          100: '#FFD9C4',
          200: '#FFB48C',
          300: '#FF8E54',
          400: '#FF6B2C',
          500: '#E0521A',
          600: '#B33E10',
          700: '#85300C',
          800: '#5C2108',
          900: '#3D1604',
        },
        terminal: {
          DEFAULT: '#22D3A0',
          50:  '#E6FBF3',
          100: '#BFF4DD',
          200: '#7AE9BF',
          300: '#3CDCA8',
          400: '#22D3A0',
          500: '#15B387',
          600: '#0E8E6A',
          700: '#0A684E',
          800: '#064433',
          900: '#03281D',
        },
        // Semantic color utilities → the CSS custom properties in global.css
        // (:root = dark, [data-theme="light"] overrides). These make
        // text-accent / bg-paper / border-line / text-muted / text-fg /
        // bg-bg / text-accent-2 the var-backed, theme-aware alternative to the
        // ~999 inline style="rgb(var(--x))" attrs across the app.
        // Alpha works (e.g. bg-accent/10, border-line/60). See
        // docs/DESIGN-SYSTEM.md §10 (backlog item H1).
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-2': 'rgb(var(--accent-2) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
        article: '760px',
      },
      typography: () => ({}),
      animation: {
        'fade-in': 'fadeIn 600ms ease-out forwards',
        'rise': 'rise 600ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
} satisfies Config;
