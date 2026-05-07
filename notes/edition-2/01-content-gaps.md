# Edition 2 — Content Gaps + New Chapter Outlines

Audit of the 24-chapter Edition 1. Two parts: (A) ruthless gap list, (B) six new
chapter outlines in Vlad's voice for the highest-leverage gaps.

---

## Part A — Content gaps in Edition 1

Each row: problem → adjacent existing chapter → priority. P0 = ships in Ed 2, P1
= ships if room, P2 = doesn't deserve a chapter, push to glossary or sidebar.

### A1. Evals — "if you don't have evals, you have a hope"
The glossary defines `Eval` and Ch 18 mentions CI, but no chapter teaches an
operator how to write the first eval, run it on a schedule, and watch a
regression hit before a customer does. Without evals, every chapter that says
"I built a skill" is unfalsifiable.
- Adjacent: Ch 18 (Headless, CI, Production)
- **Priority: P0**

### A2. RAG — the term used like everyone knows it
Glossary says "pull chunks from a vector DB, stuff into context, generate." Ch 4
covers the Vault as the AI's memory but never connects it to retrieval at scale.
A reader who works at a 200-person company with 40,000 Confluence pages finishes
the book without a chapter that says "here's when Obsidian breaks and what
replaces it."
- Adjacent: Ch 4 (The Vault)
- **Priority: P1** (real, but the book's audience is operator-first; this can
  ride as a sidebar in Ch 4 if Ed 2 is full)

### A3. Webhooks — referenced in Ch 7, never explained
Ch 7 covers cron. Webhooks get a glossary entry and one passing mention. Most
real automations are event-driven, not time-driven. The Stripe-webhook story
in Ch 2 is exactly the muscle the book never teaches.
- Adjacent: Ch 7 (Cron)
- **Priority: P2** — fold into Ch 7 as a "the other half" section, not a new
  chapter. Cron + webhooks = one mental model.

### A4. Quantization & Multimodal — glossary terms, no chapter
Ch 10 covers local models in two paragraphs and quantization gets a sentence.
Multimodal is named but not taught — when do you reach for vision vs. text vs.
audio? When does Q4 vs Q8 actually matter for an operator?
- Adjacent: Ch 10 (Wild Stuff)
- **Priority: P2** — leave in glossary. Operators don't need a chapter; if they
  do, they're already past this book.

### A5. Team adoption / change management — the elephant
The book is single-operator gospel. Vlad runs Belkins, Folderly, LinguaLive — he
has teams. How does a CEO get a 12-person sales team to use Cowork? What breaks
on day 3? Who owns the skills? This is the question most readers hit on Monday
morning after finishing the book.
- Adjacent: Ch 17 (Tips & Tricks) or new chapter slot
- **Priority: P0**

### A6. Voice agent architecture — promised in Ch 10, never delivered
Ch 10 says "voice agents for product experiments at Company C and Company A"
and moves on. ElevenLabs gets one line. There's no chapter on the actual stack:
STT → LLM → TTS, latency budgets, why Twilio still matters, how voice agents
fail differently from chat agents.
- Adjacent: Ch 10 (Wild Stuff)
- **Priority: P0**

### A7. Failure stories with receipts — the book is too clean
Every chapter has a win. Ch 9 (Don't Get Owned) is the closest thing to a
disaster, and it's hypothetical. Where's the time the swarm corrupted the prod
DB? Where's the $4K token bill that taught Vlad to set spend caps? The book is
missing its scar tissue.
- Adjacent: Ch 9 (Don't Get Owned) or new chapter
- **Priority: P0**

### A8. Cost economics deep dive — Ch 2 hints, never expands
Ch 2 has the napkin math: $120K employee = 24B tokens. Great line. But there's
no chapter on prompt caching (which can drop a bill 90%), batch API (50% off),
when to use Haiku vs Sonnet vs Opus, model routing for cost, the actual unit
economics of running an agent in production. Operators read Ch 2 and want page 2.
- Adjacent: Ch 2 (Five Tools)
- **Priority: P0**

### A9. Memory consolidation patterns — one paragraph, infinite leverage
Ch 4 mentions auto-memory. The actual system (MEMORY.md indexes, biweekly
hygiene, the consolidation pattern that takes 60 fragmented notes and produces
8 consolidated ones) gets buried. This is one of the highest-leverage moves in
Vlad's whole stack and the book underweights it.
- Adjacent: Ch 4 (The Vault)
- **Priority: P1**

### A10. Vendor/model migration — the silent tax
4.5 → 4.6 → 4.7 happens every quarter now. Skills break. CLAUDE.md needs
re-tuning. Some prompts that worked in 4.5 hallucinate in 4.7 and vice versa.
The book treats Claude as a static thing. It isn't.
- Adjacent: Ch 8 (Three Doors) or Ch 17
- **Priority: P1**

### A11. Building with the Anthropic SDK directly
Ch 11 builds a skill. Ch 19 builds a product. Both lean on Cowork/Claude Code as
the runtime. Nothing in the book teaches a reader how to write 30 lines of
Python that hits the API directly — which is what they need the moment they
build something for a customer, not themselves.
- Adjacent: Ch 19 (Build Products) or Ch 11 (Build a Skill)
- **Priority: P0**

### A12. The anti-stack — what to NOT build
Ch 17 has tips. Ch 24 is a tier list. But there's no chapter that names the
stuff Vlad explicitly chose not to build. No vector DB. No fine-tuned model. No
custom orchestration framework. The negative space is as valuable as the stack.
- Adjacent: Ch 24 (Tier List) or new chapter
- **Priority: P1**

### A13. Subagent design contracts — Ch 16 is shallow
Hooks and subagents share Ch 16, which means subagents get half a chapter. The
actual hard part — designing the prompt, the tool surface, the return contract,
how three subagents coordinate without colliding on the filesystem — gets
glossed.
- Adjacent: Ch 16 (Hooks & Subagents)
- **Priority: P2** — fold a longer subagent section into Ch 16, don't break it
  out.

### A14. Observability — when the swarm is wrong, how do you know?
Hooks (Ch 16) can fire alerts. CI (Ch 18) can run evals. But there's no chapter
on logging, tracing, or post-hoc replay. If you're running 15 subagents and one
silently no-ops, how do you find it?
- Adjacent: Ch 18 (Headless, CI, Production)
- **Priority: P1**

### A15. Prompt injection in the wild
Glossary names it "the new XSS." Ch 9 covers blast radius generally. No chapter
walks through a real injection attempt — agent reads a poisoned email, calls
the wrong tool, what triggered it, what stopped it.
- Adjacent: Ch 9 (Don't Get Owned)
- **Priority: P1** — could fold into Ch 9 as a longer section.

### Gap summary table

| # | Gap | Priority | Verdict |
|---|---|---|---|
| A1 | Evals | P0 | New chapter |
| A2 | RAG | P1 | Sidebar in Ch 4 unless Ed 2 has room |
| A3 | Webhooks | P2 | Fold into Ch 7 |
| A4 | Quantization/Multimodal | P2 | Stay in glossary |
| A5 | Team adoption | P0 | New chapter |
| A6 | Voice agents | P0 | New chapter |
| A7 | Failure stories | P0 | New chapter |
| A8 | Cost economics | P0 | New chapter |
| A9 | Memory consolidation | P1 | Sidebar in Ch 4 |
| A10 | Model migration | P1 | New chapter if room |
| A11 | Anthropic SDK | P0 | New chapter |
| A12 | Anti-stack | P1 | New chapter if room |
| A13 | Subagent contracts | P2 | Expand Ch 16 |
| A14 | Observability | P1 | Fold into Ch 18 |
| A15 | Prompt injection | P1 | Expand Ch 9 |

**Six P0s. Six outlines below.**

---

## Part B — Six new Edition 2 chapter outlines

Numbering is proposed slot, not final. All six are P0. Voice rules from BRIEF.md
applied. No "this guide will help you." No "in conclusion." No five-bullet
takeaway closer.

---

### Chapter 25 (proposed) — Evals or Hope, Pick One

**Subtitle:** If you don't have evals, you don't have a workflow — you have a
prayer with a Slack channel.

**Cold open (4–6 sentences, time-stamped):**
It's 11:42 PM Thursday. The friday-wrapup skill that has run flawlessly for
six weeks just shipped a leadership canvas with $0 in pipeline because someone
renamed a HubSpot stage and the skill silently filtered everything out. My COO
read it first. I found out from her Slack DM at 7:14 AM Friday — "Vlad, did we
have a bad week or is the skill broken?" Both answers are bad. The skill was
broken for nine days. I had no eval.

**Section headers:**
1. The 9-day silent failure (the receipt)
2. What an eval actually is — three lines of code, not a framework
3. The four eval types every operator needs (smoke, regression, golden-set,
   adversarial)
4. Running evals on cron — the second cron job nobody talks about
5. The eval failure budget — when to page yourself, when to ignore
6. The 30-minute starter eval (full code, swipeable)

**Pull quote:**
> "A skill without an eval is a Slack canvas waiting to gaslight your COO."

**Anti-takeaway closer:**
The skill is back. The eval is named friday-wrapup-eval and runs at 4:30 PM,
thirty minutes before the real one fires. It checks for $0 pipeline, missing
sections, and stage-name drift. It has fired twice. Both times, on a Friday
afternoon, in time. The COO doesn't read the eval. She reads the canvas. That's
how you know it's working.

---

### Chapter 26 (proposed) — Getting Twelve People to Use This

**Subtitle:** Single-operator AI is easy. Team AI is a change-management
problem dressed up as a tooling problem.

**Cold open:**
It's 9:03 AM Monday at Belkins. I just shipped a Cowork briefing skill to
twelve people on the sales floor. By 9:47, four of them are using it, three are
asking the four for help, two are pretending it doesn't exist, two emailed me
"can you just send me the briefing instead," and one already broke their own
CLAUDE.md by pasting in 800 lines of prospect notes. The tool works. The
adoption is what's broken. Tools don't adopt themselves. Neither do teams.

**Section headers:**
1. The 4-3-2-2-1 distribution — what twelve people actually look like on day 1
2. Why the early adopter is your worst onboarding partner (the curse of the
   power user)
3. The team CLAUDE.md, the personal CLAUDE.md, and the rule that prevents
   collisions
4. Skills as policy, not productivity — how we encoded "no outbound to a closed-lost"
   into a skill instead of a Slack rant
5. The 30-day adoption metric that isn't usage — it's the tab count
6. When you fire the tool vs when you fire the person (rare, but real)

**Pull quote:**
> "Adoption isn't a training problem. It's a gravity problem. Make the AI path
> the path of least resistance, or the team will route around it."

**Anti-takeaway closer:**
Six months in, eleven of the twelve use it daily. The twelfth left for a
competitor. He told his exit interviewer the AI was "too much." It wasn't. He
was the one who couldn't be observed. The skill fired me a clean signal four
months before HR did.

---

### Chapter 27 (proposed) — Voice Agents, From Phone Number to Production

**Subtitle:** Why every voice agent demo is a lie about latency and what a real
stack costs.

**Cold open:**
It's 3:18 PM Tuesday and the LinguaLive prototype voice agent picks up the test
call on the third ring. There's a 1.4-second silence before it speaks. The
silence isn't the model. It's the Twilio handoff plus the STT round-trip plus
the LLM first-token plus the TTS warmup. Each one is fine alone. Stacked, they
cost me a deal in the demo I gave the same morning to an investor. He called
the silence "uncomfortable." He was right. The chapter most people skip is the
one about the seams.

**Section headers:**
1. The four-component stack: STT, LLM, TTS, telephony — and the latency budget
   for each
2. Why ElevenLabs wins TTS and Deepgram wins STT (today; check next quarter)
3. Twilio is not optional — the PSTN problem nobody mentions in the demo videos
4. The interruption problem — and why most voice agents feel "robotic" 12
   seconds in
5. Cost shape: $0.06 to $0.40 per minute depending on what you cheap out on
6. The single design rule that makes voice agents tolerable: never let the
   model think while the user is listening

**Pull quote:**
> "Chat agents fail loudly — the screen goes blank. Voice agents fail
> politely — the silence is just slightly too long, and the human hangs up."

**Anti-takeaway closer:**
The LinguaLive prototype is on its fourth rebuild. Every rebuild is a different
seam I didn't respect the first time. The voice agent that closes deals doesn't
sound like AI. It sounds like a tired junior on a Tuesday. That's not a feature
list. That's a latency budget.

---

### Chapter 28 (proposed) — The Receipts I'd Rather Not Show You

**Subtitle:** Six failures, six bills, six things the demo videos won't tell
you.

**Cold open:**
It's 2:51 AM on a Saturday in March and my phone vibrates with an Anthropic
billing alert. $1,847 in eleven hours. A subagent in a swarm I left running
caught itself in a recursion — call a tool, get a result, decide the result is
ambiguous, call the tool again with a longer prompt, repeat until the credit
card screams. I killed the process. I paid the bill. I added a spend cap the
next morning. This chapter is six of those. None of them are in the demo
videos. All of them are in my AmEx statement.

**Section headers:**
1. The $1,847 recursion (and the spend cap that should've existed)
2. The skill that wrote to the wrong vault for nine days before anyone noticed
3. The Cowork connector that exfiltrated a customer email to a test workspace
4. The hook that fired on every keystroke and DDoS'd my own laptop
5. The 4.6 → 4.7 migration that broke a skill I'd shipped to twelve people
6. The "subagent returned OK with no commit" silent failure (and the verifier
   I now run between waves)

**Pull quote:**
> "Every operator running AI seriously has a billing alert with a story behind
> it. If you don't have that alert yet, you don't have a stack — you have a
> demo."

**Anti-takeaway closer:**
None of these failures showed up in a tier list. None made a Twitter thread.
All six changed how I run things. The polished version of this chapter would
sand them off. The polished version would be a lie. So here they are, with the
dollar amounts.

---

### Chapter 29 (proposed) — The Bill, Demystified

**Subtitle:** Token math, prompt caching, batch API, model routing — what
actually moves your invoice.

**Cold open:**
It's 8:11 AM Wednesday and I'm staring at a $4,312 Anthropic bill for the
prior week. Same workload as the week before, when the bill was $1,108. Nothing
in my code changed. The thing that changed was a 38-line CLAUDE.md update that
broke prompt caching on roughly 60% of my morning briefings. Prompt caching
isn't a feature you turn on. It's a contract about what changes between calls,
and one paragraph of edits voided the contract. The fix took 12 minutes.
Knowing the fix existed took six months.

**Section headers:**
1. The four costs — input, output, cached input, cache write — and the 10x
   between them
2. Prompt caching is not magic, it's stable prefixes (and what voids them)
3. Batch API: 50% off if you can wait 24 hours (and which workloads can)
4. Haiku for triage, Sonnet for default, Opus when you actually need it — the
   $/quality curve nobody plots honestly
5. The token budget per skill — how I track which skill costs what
6. The annual math: 3-10B tokens/month, the actual line item, the actual
   replacement value

**Pull quote:**
> "Most operators don't have a token problem. They have a cache problem they
> haven't named yet."

**Anti-takeaway closer:**
The bill went back to $1,108. I didn't optimize harder. I just stopped breaking
the thing that was already optimized. Most cost wins look like that. You're not
pulling levers. You're putting the levers back where they were before you
fiddled.

---

### Chapter 30 (proposed) — Building With the Anthropic SDK Directly

**Subtitle:** When Claude Code and Cowork stop being the answer and you have to
write 30 lines of Python.

**Cold open:**
It's 4:09 PM Thursday and a customer is asking me if the AI feature in their
trial dashboard can run without me opening Claude Code. The honest answer is
no — what they saw was a skill running in my session, not a feature in their
product. The dishonest answer would've been to build them a thin wrapper that
shells out to `claude --print` from a Vercel function and pray it scales. I
wrote 34 lines of Python against the Anthropic SDK instead. Shipped that
afternoon. Has been serving customers for nine months. This is the chapter
about that 34 lines.

**Section headers:**
1. The line where the book stops working — Claude Code and Cowork are tools,
   not runtimes
2. Hello world: 12 lines, one API key, your first programmatic Claude
3. Tool use in the SDK — the same MCP shape, no Cowork wrapping it
4. Prompt caching in code — the explicit `cache_control` block and why you
   want it on day one
5. Streaming, retries, backoff — the three things `claude --print` hides from
   you
6. The deploy: Vercel function, secret in env, rate limit, done

**Pull quote:**
> "Cowork is the kitchen you eat in. The SDK is the kitchen you cook for
> strangers in. Different building codes."

**Anti-takeaway closer:**
The 34-line Python file is still the 34-line Python file. It got prompt caching
added in month two and a retry block in month four. That's it. Most of the
"AI startup architecture" diagrams on Twitter are a wrapper around something
this small, dressed up to justify a Series A. The wrapper is fine. Knowing
what's inside the wrapper is the whole job.

---

## Notes for the editor

- Six P0 chapters, plus expansions to Ch 4, Ch 7, Ch 9, Ch 16, Ch 18 covered by
  the P1/P2 gaps. Ed 2 ships at 30 chapters if all six new ones land — under
  the 35-chapter ceiling in BRIEF.md.
- "Needs Vlad's number" flags inside each outline: the $1,847 recursion bill,
  the $4,312 vs $1,108 weekly bills, the 1.4-second voice latency, the 4-3-2-2-1
  team distribution, the 9-day silent failure window, the 34-line Python file.
  All are realistic shapes; Vlad to confirm exact figures before publication.
- All six outlines pass the voice-fidelity test: each cold open is
  time-stamped, each closer rejects the bullet-list takeaway, each pull quote
  is operator-grade not motivational. None of them could appear in a generic
  productivity Substack without the byline.
