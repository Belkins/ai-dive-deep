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
    title: "Anthropic's 81k interviews — what 80,508 Claude users in 159 countries actually want from AI",
    source: 'Anthropic · 80,508-respondent qualitative study · Dec 2024 fieldwork · Huang et al., 2026',
    date: '2026-05-13',
    tagline: "Trust is the chokepoint. The leverage flows to operators, not to spreadsheets. \"People are afraid they're the horses.\"",
    takeaway:
      "Anthropic ran 80,508 conversational interviews across 159 countries and 70 languages — the largest multilingual qualitative AI study ever conducted. Claude-as-interviewer, Claude-as-classifier, de-identified before analysis. Three signals matter for operators. First: unreliability tops every concern at 26.7% — the highest single number in the whole study, and the only benefit/harm tension where the negative (37%) overshadows the positive (22%). Second: independent workers report economic empowerment at 50% vs 14% for institutional employees — a 3.5× gap that validates the solo-operator framing of this entire book at n = 80,508. Third: the productivity / \"acceleration treadmill\" tension cuts cleanly — 50% report time gains, 18% feel they're now running faster to stay in the same place, freelancers most affected. The most-quotable line from the dataset, from a US respondent: \"In the third industrial revolution, horses disappeared from city streets, replaced by automobiles. Now people are afraid they're the horses.\" 67% global net positive, but the geographic split is sharp — sub-Saharan Africa, Latin America, Southeast Asia most optimistic (24-28% strong positive); Western Europe, North America, Oceania most skeptical (~35% concerned).",
    implications: [
      "Unreliability is the #1 concern at 26.7% — the same chokepoint OPS-204 identifies from the technical side. Two independent studies, two methods, one answer. The case for content-checksum evals (Ch 25) just gained an n = 80,508 citation. If your prospects/teammates are pushing back on AI adoption, this is the wedge their hesitation is sitting on, not the cost.",
      "Independent workers report 50% economic empowerment vs 14% for institutional employees — a 3.5× asymmetry. The leverage of AI flows to operators, not to spreadsheets. This is the whole thesis of the book, validated externally. /cfo-case now has an n = 80,508 citation: AI doesn't replace your team, it widens the gap between operators who run it themselves and orgs that watch it from a distance.",
      "The acceleration treadmill is real and asymmetric — 50% report time gains, 18% feel the treadmill sped up, freelancers worst affected. Operator move: schedule the gain (Ch 7), but also defend the reclaimed time. Most operators auto-fill the gain with more meetings, which is how 'AI saved me 10 hours' becomes 'I'm working the same hours, just on different things.'",
      "Cognitive atrophy is being witnessed at 2.5-3× baseline by educators. Skills as policy (Ch 26) — your team's CLAUDE.md needs to name \"we don't outsource thinking, we outsource gathering\" explicitly, or you'll grow a quietly-atrophied org. The vault discipline (Ch 4) is the counter: forcing synthesis through the operator's own hands is what stops the atrophy.",
      "Sycophancy ranks in the top-10 concerns (10.8%). Reinforces the Ch 2 framing: \"Claude pushes back when I'm wrong; GPT will helpfully ship the bad idea you asked for.\" Operators get more value from disagreement than from agreement at scale — choose tools and prompts that earn the disagreement.",
      "Geographic split: emerging markets most optimistic, developed markets most skeptical. The book is written for a Western-operator audience that the data flags as the most-cautious cohort. If you're operating with customers or teams in sub-Saharan Africa, Latin America, or Southeast Asia, expect them to pull harder for AI than your domestic peers — calibrate.",
    ],
    receipts: [
      { label: 'Sample size', value: '80,508' },
      { label: 'Countries / languages', value: '159 / 70' },
      { label: '#1 concern (unreliability)', value: '26.7%' },
      { label: 'Independent vs institutional empowerment', value: '50% vs 14% (3.5×)' },
      { label: 'AI took steps toward stated vision', value: '81%' },
      { label: 'Global net positive sentiment', value: '67%' },
    ],
    chapters: [
      { slug: '25-evals-or-hope', ref: 'Ch 25', why: 'unreliability tops every concern at 26.7% — second independent study after OPS-204 pointing at the same eval gap' },
      { slug: '02-five-tools', ref: 'Ch 2', why: "sycophancy in the top-10 concerns (10.8%) validates the 'Claude pushes back when I'm wrong' framing" },
      { slug: '26-team-adoption', ref: 'Ch 26', why: "cognitive atrophy witnessed at 2.5-3× baseline by educators — skills as policy must name 'we don't outsource thinking' explicitly" },
      { slug: '19-build-products', ref: 'Ch 19', why: '50% economic empowerment for independent workers vs 14% for institutional employees — the operator path has 3.5× more leverage at n = 80,508' },
      { slug: '17-tips-tricks', ref: 'Ch 17', why: 'the time-vs-treadmill tension is a tip in itself — schedule the gain (Ch 7) AND defend the reclaimed time' },
      { slug: '04-the-vault', ref: 'Ch 4', why: 'the vault is the counter to cognitive atrophy — forced synthesis through the operator\'s own hands' },
    ],
    links: [
      { label: 'Anthropic feature page', href: 'https://www.anthropic.com/features/81k-interviews' },
    ],
  },
  {
    title: 'OPS-204 — frontier models corrupt ~25% of a document after 20 edits',
    source: 'Microsoft Research preprint · arXiv · MIT license',
    date: '2026-05-12',
    tagline: "Don't delegate long doc-editing chains. Break them up. Add an eval.",
    takeaway:
      "Microsoft Research built a benchmark called OPS-204 — 310 work scenarios across 52 domains, from Python and crystallography to recipes and music notation. Methodology: give a model an edit, then the reverse edit; measure how far the file drifts from the original. Across 19 frontier models on documents of 3-5K tokens, the top three (GPT-5.4, Claude 4.6 Opus, Gemini 3.1 Pro) lose ~25% of content after 20 sequential edits. The average across all 19 is ~50%. The best model — Gemini 3.1 Pro — is rated 'ready for delegation' (≥98% preservation) in only 11 of 52 domains. Plugging in agentic tools (search, code-exec, direct file edit) makes it ~6% worse on average, not better. Losses are bursty: ~80% of total corruption comes from rare single-iteration drops of 10-30%. Weak models delete chunks wholesale; top models corrupt the survivors. The one domain where models behave: Python. The worst: prose, recipes, music, financial reports.",
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
      { label: 'arXiv preprint', href: 'https://arxiv.org/abs/2511.OPS-204' },
      { label: 'Dataset', href: 'https://github.com/microsoft/DELEGATE52' },
      { label: 'GitHub repo', href: 'https://github.com/microsoft/DELEGATE52' },
    ],
  },
];
