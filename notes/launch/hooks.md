# Launch Hooks — 10 One-Liners, Ranked

Audited the 36 chapters + research notes + cfo-case + tier-list + weekend-builds + vault-starter. Hooks 1–7 are already in the artifact. Hooks 8–10 are new, synthesized from existing receipts.

---

### Hook 1: "A skill without an eval is a Slack canvas waiting to gaslight your COO."
- Source: Ch 25 — line 82 (existing PullQuote)
- Platform: Twitter / HN title / chapter pull-quote (already in chapter)
- Argument it starts: forces operators to admit they have no instrumentation between the model and the inbox of the person who can fire them; pulls the eval conversation out of the research-team ghetto and into the operator's lap.
- Risk: "gaslight" reads dramatic to readers who haven't had the COO Slack DM yet — they bounce thinking it's hype, not receipts.

### Hook 2: "Sessions are filesystem. Vault is brain. The session remembers this morning. The vault remembers your career."
- Source: Ch 22 — line 137 (existing PullQuote)
- Platform: LinkedIn long-form opener / chapter pull-quote
- Argument it starts: the entire "AI doesn't remember me" complaint is a category error — you don't need memory, you need a vault and a `--resume` habit. Reframes the most common new-user gripe as an operator skill issue.
- Risk: requires two minutes of setup to land — out of context it sounds like a koan, not a tactic.

### Hook 3: "Skipping stages is faster. Skipping stages is also how Saturdays die."
- Source: Ch 31 — line 59 (existing PullQuote)
- Platform: Twitter / newsletter subject line
- Argument it starts: the polishing trap is universal — every weekend builder has chosen voice tone before data contract. Names the most common self-sabotage pattern in one line.
- Risk: weekend-builder framing skews indie; enterprise readers might dismiss as hobbyist content and miss that friday-wrapup hit the same trap.

### Hook 4: "Most operators don't have a token problem. They have a cache problem they haven't named yet."
- Source: Ch 29 — line 39 (existing PullQuote)
- Platform: HN title / CFO-forwarded Slack
- Argument it starts: makes CFOs forward to engineering — "are we even caching?" The $1,108 → $4,312 → $1,108 receipt under it does the work. Reframes the AI-bill panic from "the model is too expensive" to "your CLAUDE.md edit voided the contract."
- Risk: needs the 38-line CLAUDE.md story attached or it reads like a vague consultant tweet; standalone, it's just clever.

### Hook 5: "Stop using AI like a chatbot. Start using it like an OS."
- Source: Ch 01 — line 73 (existing PullQuote)
- Platform: Twitter / newsletter subject line / LinkedIn opener
- Argument it starts: the elevator pitch for the whole book. Cleanest frame for someone whose only AI surface is ChatGPT. Pulls the conversation from "which model is smartest" to "which surface runs on cron."
- Risk: the most "tweetable" of the bunch, which means it can also read as marketing-speak if the reader doesn't see the three scheduled tasks story behind it.

### Hook 6: "Eleven minutes. That's all it takes."
- Source: Ch 09 — line 21 (chapter cold open)
- Platform: Reddit r/devops title / Twitter thread opener
- Argument it starts: the security chapter most operators skim becomes the one they read. $4,200 in 11 minutes from a leaked Stripe key is the kind of receipt that pulls a startup founder into a key-rotation tab the same afternoon.
- Risk: number is from a friend's company, not Vlad's directly — if anyone asks for the post-mortem link, there isn't a public one. Anchored to a story Vlad can tell on a podcast but not link to.

### Hook 7: "Every operator running AI seriously has a billing alert with a story behind it. If you don't have that alert yet, you don't have a stack — you have a demo."
- Source: Ch 28 — line 96 (existing PullQuote)
- Platform: LinkedIn long-form opener / HN comment
- Argument it starts: separates the people running production AI from the people running demos. Generates a comment thread of operators sharing their own billing-alert stories — the receipts community moment.
- Risk: gatekeep-y read for newcomers; could read as "you're not real until you've been burned," which is true but unfriendly.

### Hook 8 (NEW): "Unreliability is 26.7%. That's the number 80,508 humans agree on. Three lines of Python is the fix."
- Source: NEW — synthesized from `research-notes.ts` Anthropic 81k-interviews + Ch 25 three-line eval
- Platform: HN title / Twitter
- Argument it starts: collapses the world's largest qualitative AI study into a single operator move — write the smoke eval today. The asymmetry between "n = 80,508 study" and "three lines of code" is the hook. Makes operators argue about evals with a citation behind them.
- Risk: 26.7% needs the Anthropic citation visible; without it, the number sounds invented. Strip the source and it dies.

### Hook 9 (NEW): "AI flows to operators, not to spreadsheets. 50% vs 14%, n = 80,508. The book's thesis just got externally validated."
- Source: NEW — synthesized from `research-notes.ts` 3.5× empowerment gap + /cfo-case framing
- Platform: LinkedIn long-form opener / newsletter subject line
- Argument it starts: solo operators and freelancers forward to their network with "told you so" energy; enterprise readers forward to leadership as a wedge for AI budget. Two audiences, one citation.
- Risk: "spreadsheets" is a glancing dig at finance — CFO readers may feel attacked instead of converted. Cuts against the cfo-case page's tone.

### Hook 10 (NEW): "Frontier models lose 25% of your document after 20 edits. Top 3 models. Average is 50%. Tools make it worse, not better."
- Source: NEW — synthesized from `research-notes.ts` DELEGATE-52 + Ch 28 nine-day silent failure
- Platform: HN title / Reddit r/MachineLearning / Twitter
- Argument it starts: kills the "let the agent edit my doc for 50 turns" workflow on contact. The "tools make it worse" detail is the screenshot-worthy beat — counter-intuitive, paper-backed, immediately actionable.
- Risk: HN crowd will demand the arXiv link in the same breath; if the URL isn't right there, the hook gets debunked in the first comment. Must travel with citation.

---

## Launch-day three — lead with these

**1. Hook 8 — "Unreliability is 26.7%. That's the number 80,508 humans agree on. Three lines of Python is the fix."**
The Anthropic citation gives the launch a news peg the book otherwise lacks. Operators love a research-backed number paired with a three-line code receipt. This is the hook that gets the book into AI Twitter and the eval discourse on the same day — and it leads naturally into Ch 25, which is the chapter most likely to convert a skimmer into a reader.

**2. Hook 5 — "Stop using AI like a chatbot. Start using it like an OS."**
The widest funnel. Every reader who has only touched ChatGPT understands this line in two seconds. It's the LinkedIn opener that gets shared by non-technical operators who'd never click an HN title. The book's whole pitch in nine words. Pair it with the cold-open scene from Ch 01 — three scheduled tasks, one channel, coffee not cold yet — and it converts.

**3. Hook 3 — "Skipping stages is faster. Skipping stages is also how Saturdays die."**
The voice signature. If a reader sees only one hook, this is the one that tells them which book this is — not LinkedIn-influencer, not consultant, not benchmark blogger. Comma splice, real verb, no takeaway. It's the line that distinguishes Vlad's book from the eight other AI-operator books shipping this quarter, and it lands the weekend-builder cohort that becomes the loudest evangelist segment.

The other seven are amplification ammo — pull them out across week one as the launch needs different angles (security for r/devops, cost for CFO Slack channels, sessions for the "I forget my conversations" crowd, failure receipts for the post-mortem nerds).
