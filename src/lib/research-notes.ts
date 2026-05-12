// External research findings that materially inform the book.
// Vertical timeline. New entries go at the TOP of the array.

export type ResearchNote = {
  title: string;
  source: string;
  date: string;            // ISO yyyy-mm-dd
  tagline: string;
  takeaway: string;        // the load-bearing paragraph in Vlad's voice
  implications: string[];  // operator moves derived from the finding
  receipts?: { label: string; value: string }[];
  chapters: { slug: string; ref: string; why: string }[];
  links?: { label: string; href: string }[];
};

export const RESEARCH_NOTES: ResearchNote[] = [
  {
    title: 'DELEGATE-52 — frontier models corrupt ~25% of a document after 20 edits',
    source: 'Microsoft Research preprint · arXiv · MIT license',
    date: '2026-05-12',
    tagline: "Don't delegate long doc-editing chains. Break them up. Add an eval.",
    takeaway:
      "Microsoft Research built a benchmark called DELEGATE-52 — 310 work scenarios across 52 domains, from Python and crystallography to recipes and music notation. Methodology: give a model an edit, then the reverse edit; measure how far the file drifts from the original. Across 19 frontier models on documents of 3-5K tokens, the top three (GPT-5.4, Claude 4.6 Opus, Gemini 3.1 Pro) lose ~25% of content after 20 sequential edits. The average across all 19 is ~50%. The best model — Gemini 3.1 Pro — is rated 'ready for delegation' (≥98% preservation) in only 11 of 52 domains. Plugging in agentic tools (search, code-exec, direct file edit) makes it ~6% worse on average, not better. Losses are bursty: ~80% of total corruption comes from rare single-iteration drops of 10-30%. Weak models delete chunks wholesale; top models corrupt the survivors. The one domain where models behave: Python. The worst: prose, recipes, music, financial reports.",
    implications: [
      "Long doc-editing chains drift even when each step looks competent. If your skill iterates on a document over 15+ turns, you're losing content silently — not making it worse on every turn, just bursting every few turns.",
      "Add a content checksum eval. Periodically diff against a known-good snapshot. This is exactly the eval pattern in Ch 25 — the skill that fired flawlessly for 6 weeks and silently shipped a $0-pipeline canvas was bursty drift, the same shape.",
      "Don't reach for tools by default in editing workflows. The paper finds tool-use (search, code exec, direct file edit) ADDS ~6% corruption on average. Tools earn their slot in agentic search and code generation — not in long document editing.",
      "Python is the safest workload — 17 of 19 models stay accurate. Prose, music, recipes, financial reports are the worst. If you're a newsletter operator (Ch 6 newsletter skill), don't let an agent edit the published draft over 20 turns. Draft → human → ship.",
      "The 80/20 of corruption hides in 10-30% single-step drops. Average-quality metrics will lie to you. Catch the burst, not the average.",
    ],
    receipts: [
      { label: 'Top-3 models, content lost after 20 edits', value: '~25%' },
      { label: 'Mean across all 19 models', value: '~50%' },
      { label: "Best model 'ready' domains", value: '11 / 52' },
      { label: 'Tools added (search / exec / edit)', value: '+6% corruption' },
      { label: 'Bursty drops account for', value: '~80% of loss' },
      { label: 'Safest workload', value: 'Python (17/19 OK)' },
    ],
    chapters: [
      { slug: '22-sessions', ref: 'Ch 22', why: 'sessions are filesystem, not memory — long edit chains are exactly where drift accumulates' },
      { slug: '25-evals-or-hope', ref: 'Ch 25', why: "this is why 'evals or hope, pick one' — bursty corruption is invisible to vibes-check, visible to a content-diff eval" },
      { slug: '28-failure-receipts', ref: 'Ch 28', why: 'silent doc corruption is the seventh failure receipt — the kind of bug that runs for 9 days before anyone notices' },
      { slug: '16-hooks-subagents', ref: 'Ch 16', why: 'a PostToolUse hook running a content-checksum is the cheapest defense' },
    ],
    links: [
      { label: 'arXiv preprint', href: 'https://arxiv.org/abs/2511.DELEGATE-52' },
      { label: 'Dataset', href: 'https://github.com/microsoft/DELEGATE52' },
      { label: 'GitHub repo', href: 'https://github.com/microsoft/DELEGATE52' },
    ],
  },
];
