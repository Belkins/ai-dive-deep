# Edition 2 — Distribution + Reach

The artifact ships at `https://belkins.github.io/ai-dive-deep/`. Today: zero traffic.
Vlad's existing audience: 10K+ newsletter, LinkedIn at chiefdata, vladyslavpodoliako.com,
the portfolio (Belkins, Folderly, LinguaLive, NoCancer AI, 404).

This is the launch shape — not in launch-marketing voice, in operator voice.

---

## Part A — Five launch posts in Vlad's voice

### Post 1 — Twitter/X (the cold open)

> 6:47 AM Tuesday. Coffee hot. Laptop closed. Dog unimpressed.
>
> Three things have already happened without me. Morning brief in Slack. Mentee prep doc finished. Deal-advancement alert at 4 AM ET because someone went quiet too long.
>
> 24 chapters on how this works. Free. Open source. No signup.
>
> belkins.github.io/ai-dive-deep

### Post 2 — LinkedIn (the napkin math)

> 3 to 10 billion tokens a month across my stack.
>
> Sounds insane until you do the math. A senior US engineer fully loaded is ~$120K/year. At Sonnet input pricing, that buys ~24 billion tokens. Even at the high end of my burn — 120B/year — the AI is doing 5-10x the work for the same dollar.
>
> Not a slide-deck flex. Actual ratio.
>
> I wrote a 24-chapter field manual for operators who want to stop juggling tabs and start running AI like an OS. Belkins, Folderly, the Newsletter, a portfolio of others. No course. No paywall. Read it: belkins.github.io/ai-dive-deep
>
> Edition 1, May 2026. The stack moves. The discipline doesn't.

### Post 3 — Newsletter intro (vladsnewsletter.com)

> **Subject:** I shipped a 24-chapter book on Saturday
>
> Saturday morning I had an idea. Sunday night I shipped 24 chapters as an interactive site, deployed on GitHub Pages, with 8 widgets you can poke at while you read. Total cost: a weekend.
>
> The book is everything I wish someone had handed me in 2024 — the temp-agency mental model, the swarm pattern that wrote half this newsletter for me last week, the cron jobs that read my morning while I sleep, the permission rules that saved me from the kind of mistake that ends weekends.
>
> No course. No paywall. Read in any order. Steal anything: belkins.github.io/ai-dive-deep
>
> Edition 1 will have typos. Reply with what breaks and I'll fix it before edition 2. Operator wisdom is collective.
>
> — Vlad

### Post 4 — Substack note / X thread starter

> The most expensive cognitive error in modern business:
>
> Treating AI like a coworker you're slowly training.
>
> It is not. It is a temp agency. Every chat session is a different employee on day one. Brilliant resume. Zero memory of you.
>
> Once you see this, everything changes:
>
> 1/ Parallelism is free
> 2/ State is your job, not the model's
> 3/ Identity is a config, not a fact
>
> Full chapter (and 23 others): belkins.github.io/ai-dive-deep/chapters/03-temp-agency

### Post 5 — README addition (top of repo)

> # Ultimate AI Dive Deep
>
> A field manual for operators who want to stop juggling tabs and start running AI like an OS.
>
> 24 chapters. 8 interactive widgets. One operator. Belkins, Folderly, the Newsletter, and a portfolio of others.
>
> Read: https://belkins.github.io/ai-dive-deep
>
> No paywall. No signup. CC BY-NC-SA on the content. MIT on the code. Steal anything that works.

---

## Part B — SEO / AEO setup (8 concrete improvements)

The site has basic OG meta + sitemap. Missing:

1. **Schema.org Article JSON-LD per chapter.** Add to `src/pages/chapters/[slug].astro` head:
   ```html
   <script type="application/ld+json">
     { "@context": "https://schema.org", "@type": "Article",
       "headline": "{title}", "description": "{tldr}",
       "author": { "@type": "Person", "name": "Vlad Podoliako", "url": "https://vladyslavpodoliako.com" },
       "datePublished": "2026-05-01", "publisher": { "@type": "Person", "name": "Vlad Podoliako" } }
   </script>
   ```
2. **`/llms.txt` file** at `public/llms.txt` listing all 24 chapters as a Claude/GPT-readable
   table of contents. AI crawlers cite from this format.
3. **`robots.txt`** at `public/robots.txt`:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://belkins.github.io/ai-dive-deep/sitemap-index.xml
   ```
4. **Per-chapter Twitter/LinkedIn share buttons** at the chapter footer, with pre-filled text
   pulled from the chapter's TL;DR.
5. **BookSchema.org markup** on the landing page declaring this is a book with 24 chapters
   (ISBN-equivalent: the GitHub commit SHA). Helps AEO.
6. **Internal cross-linking pass.** Many chapters say "see Chapter X" but the migration agents
   converted some but not all. `grep -rn "Chapter [0-9]" src/content/chapters/` and ensure
   every one is a markdown link.
7. **Canonical URL handling.** With `base: '/ai-dive-deep'` and possible custom domain in
   future, set the canonical to the full URL. `src/layouts/BaseLayout.astro` already does
   this — verify it survives a custom-domain switch.
8. **One thing nobody else does:** Publish the **per-chapter MDX source** as a public
   "raw" endpoint via GitHub Pages. Means an AI crawler (or a reader) can fetch
   `belkins.github.io/ai-dive-deep/chapters/01.mdx` and ingest the full source. Citation gold.

---

## Part C — Ten share-worthy moments (the lines they'll screenshot)

Pull these from the migrated MDX. Each is a tweet on its own.

1. **Ch 02:** "Stack envy is the new tab-trash."
2. **Ch 03:** "Stop hiring one AI. Start running a workforce."
3. **Ch 04:** "The model is the genius with amnesia. The vault is the journal you hand it every morning."
4. **Ch 05:** "A skill is the difference between explaining the dish and cooking it."
5. **Ch 06:** "The swarm isn't 15 agents talking to each other. It's 15 agents reporting to one."
6. **Ch 07:** "Stop being a data-fetcher. Start being a decision-maker. The fastest way is to stop showing up to the vending machine."
7. **Ch 09:** "Paranoia is expensive. Recklessness is fatal."
8. **Ch 17:** "A skill that's slightly wrong is worse than no skill."
9. **Ch 19:** "Imagination is a terrible product manager."
10. **Ch 24:** "S-tier isn't 'I like it.' S-tier is 'remove this and three things break by Wednesday.'"

Build a `/quotes` page that grids these as tweetable cards (with screenshot-friendly framing).
~30 min build. The single highest-leverage on-site SEO/AEO/social move.

---

## Part D — Newsletter ↔ artifact cross-pollination (no backend)

1. **Footer CTA on every page:** "Edition 2 lands when this list says it does."
   Link to vladsnewsletter.com with a `?ref=ai-dive-deep` for clicks Vlad can see in
   Substack analytics.
2. **The 30-day plan asks for an email at the end** (optional, no gate). "Want a
   reminder when you finish day 30? Drop your email." That's a Substack subscription form
   embedded on the page. Single-step. No backend, no auth, just a Substack iframe.
3. **Edition 2 announcement mechanic:** when E2 ships, every existing chapter gets a
   small ribbon at the top: "Edition 2 changed this chapter. See the diff." Edition 2 announce
   goes out as a single newsletter email with a link to the diff. Newsletter readers feel
   ownership.

---

## Part E — One contrarian distribution move

**Ship the audio version of Chapter 14 (the cheat sheet) first, on Spotify, under
your existing AI-music artist profile.**

Stay with me.

Vlad already publishes AI-native music to Spotify under his artist profile
(48kwMgLHicP6nqaI8Xc3rN). Spotify allows non-music audio ("podcast episodes")
under a music profile via certain distributors.

The cheat sheet is the most-shared chapter (everyone wants it). Run it through
ElevenLabs in Vlad's voice clone. 12 minutes. Drop it on Spotify.

Now: someone listens to the AI music, follows the artist, then sees a "ULTIMATE
AI DIVE DEEP — Chapter 14: Slash Commands" episode in the same feed. They listen
on a walk. They land on the website. They read the rest.

Spotify's recommendation algorithm doesn't run on operator-blogs. It runs on
artist follows. This is a side door into an audience that doesn't read Substack.

Total cost: 30 minutes of ElevenLabs render, 1 distributor upload. Compounding:
permanent. The chapters can keep landing as Spotify episodes, free, forever.

The book teaches operating AI as infrastructure. The distribution should match.
