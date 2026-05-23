// Single source of truth for the /launch-week live-diary page.
// Append daily during launch week (one-line edits). The page re-renders on deploy.
// Day-7 Numbers newsletter pulls from the same file.

export type LaunchEntry = {
  day: number;            // 0..6
  date: string;           // 'May 20'
  time?: string;          // '9:00 AM ET'
  surface: 'Newsletter' | 'X / Twitter' | 'LinkedIn' | 'Hacker News' | 'Reddit' | 'Site';
  title: string;          // post title or descriptor
  url?: string;           // public link once posted (leave empty until live)
  prep: string;           // what I tried — short
  result?: string;        // what came back — fill in evening-of
};

export type LaunchNumbers = {
  capturedAt: string;     // 'May 20, 11:55 AM ET' — when last updated
  githubStars: number | null;
  newsletterOpenRate: string | null;     // '62%'
  newsletterSubsGained: number | null;   // delta over the week
  launchPageViews: number | null;
  topForwardSurfaces: string[];          // ['X thread tweet 4', 'a Slack DM chain']
  notes: string;                         // honest one-liner
};

// Pre-staged. URLs/results get filled in as posts go live.
export const LAUNCH_TIMELINE: LaunchEntry[] = [
  {
    day: 0,
    date: 'May 20',
    surface: 'Site',
    title: '/launch — the launch artifact is the demo',
    url: '/launch',
    prep: 'Page-as-proof: typewriter hero, animated stat odometer, 3 live embedded artifacts, all 43 chapters as a click-anywhere mosaic, the 13-day timeline, post-credit AFC tease.',
    result: 'Shipped. Live since this morning.',
  },
  {
    day: 0,
    date: 'May 20',
    surface: 'Newsletter',
    title: 'Forwardable.',
    // url: 'https://www.vladsnewsletter.com/p/forwardable',  // fill in once published
    prep: '~1,815-word essay framing every artifact around the does-it-forward test. The book launch is the receipt for the thesis, not the headline.',
  },
  {
    day: 0,
    date: 'May 20',
    surface: 'X / Twitter',
    title: '8-tweet thread',
    prep: 'Each tweet stands alone (screenshottable). Tweet 1 = the dinner hook. Tweet 4 = the Monday test (most likely to screenshot). Tweet 5 = the playbook receipt.',
  },
  {
    day: 0,
    date: 'May 20',
    surface: 'LinkedIn',
    title: 'The operator-grade test for any deliverable',
    prep: '~600-word longform with "founder-realization" arc — AFC dinner → universal principle → Monday instruction. LinkedIn-native framing.',
  },
  {
    day: 0,
    date: 'May 20',
    surface: 'Hacker News',
    title: 'Show HN: Vlad\'s Playbook — open source',
    prep: 'Posted only if newsletter + X land well. Title understated; first-comment is the real post (architecture details, sanitization pipeline, history-scrub mechanics).',
  },
  // Day 1+ entries: append as the week unfolds.
];

// Live numbers — refresh evening-of. The Day-7 Numbers newsletter pulls from this.
export const LAUNCH_NUMBERS: LaunchNumbers = {
  capturedAt: 'May 20 — live',
  githubStars: null,
  newsletterOpenRate: null,
  newsletterSubsGained: null,
  launchPageViews: null,
  topForwardSurfaces: [],
  notes:
    'Numbers come in starting Day 1 evening. Filled in honest, including the embarrassing ones. The Day-7 Numbers newsletter publishes whatever lands.',
};

// "What I'd do differently" — populated Day 5+ from what actually happened.
export const WOULD_DO_DIFFERENTLY: string[] = [
  // append 2-4 items by Day 5; ranked by impact
];

export const LAUNCH_NEWSLETTER_FORWARDABLE_URL: string | null = null;  // fill in once Substack URL is live
export const LAUNCH_NEWSLETTER_NUMBERS_URL: string | null = null;      // Day 7 post URL
