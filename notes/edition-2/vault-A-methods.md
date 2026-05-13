# Methods Compared — Vault Organization Frameworks

## TL;DR

most pkm methods were designed for one human reading one folder tree. they were not designed for an operator running five companies, a paid mentee, a 10k-subscriber newsletter, and three agents reading the vault at the same time. so the question isn't "which method is best" — it's "which method survives when ai agents are first-class readers and your life has actual state in it."

para wins on shipping speed and onboarding. zettelkasten wins on long-horizon thinking and almost nothing else. johnny decimal wins on physical-brain analogues, breaks the second you go past two levels. latch is information-architecture theory, not a vault method, but it explains why your folders feel wrong. gtd is a task system someone bolted onto notes, and you can feel the bolts. the hybrids — access, ppv, augmented latch — are mostly content marketing with one good idea each. bullet journal is a discipline, not a structure, and most of it doesn't translate to digital.

the only method that actually fits a multi-company operator is project-as-entity — treat anything with state and a lifecycle as a project, regardless of whether forte would call it one. a person is a project. a deal is a project. a song is a project. a relationship is a project. this is what vlad runs and what this section will defend.

## The methods, one per section

### PARA — Projects / Areas / Resources / Archive

tiago forte's framework. four top-level buckets, every note lives in exactly one. projects have outcomes and deadlines. areas have standards but no end date (health, finances, a company you own). resources are reference material on topics you care about. archive is dead projects and outdated reference. the logic is that information should be filed by how actionable it is, not by what topic it's about — so a stripe integration doc lives under the project that needs it, not under "stripe" or "payments." when the project ends, the doc moves to archive or gets promoted to a resource.

**the four pillars, sharp:**
- **projects** — finite. outcome. deadline. "ship v2 by june 1."
- **areas** — infinite. standard. "keep belkins ebitda above x."
- **resources** — topical reference. no obligation to act. "ai pricing benchmarks."
- **archive** — frozen. dead projects, retired areas, stale resources.

**where it shines:** solo knowledge workers with 3-7 active projects. consultants. writers shipping one book. designers running 4 client gigs. the framework is opinionated enough to onboard in a weekend and flexible enough to survive a year. para is the best method for someone whose job is "produce deliverables."

**where it breaks at scale:** five companies, twelve quarterly initiatives, two mentees, a newsletter, and an investor pipeline does not fit "projects vs areas." everything you touch is both — a company is an area (ongoing standard) and a constant stream of projects (q2 hire, fundraise, ship product). forte tells you to split: company-as-area-folder, with project-folders nested. but nesting projects inside areas defeats the para premise that everything is one click from "what am i working on." also: relationships, deals, mentees, songs, and physical assets are not projects, areas, resources, or archive — they're entities with state, and para has no slot for them.

**operator verdict:** para is a single-founder method. it onboards in 48 hours, ships notes by friday, and falls apart by month 8 once you have more than 15 things in projects/. if you run one company or one product line, use it. if you run a portfolio, use it as a sub-method inside something larger. b-tier overall, s-tier for the first 90 days of any new operator.

### Zettelkasten

niklas luhmann's method, late 1960s, a wooden cabinet with 90,000 index cards, each with a unique id and links to others. the modern digital version (obsidian, roam, logseq) is: atomic notes (one idea per note), unique identifiers, mandatory linking, and three intake stages — fleeting (capture), literature (your synthesis of someone else's work), permanent (your own claims, evergreen). the value proposition is that you stop organizing by folder and start organizing by connection — every note is a node, every link is an edge, and the structure emerges from the graph rather than being imposed by hierarchy.

**where it shines:** academic research, long-form writers building a body of work over 10+ years, anyone whose output is "ideas connecting in unexpected ways." luhmann published 70 books and 400 papers off the back of his slip-box. for someone doing genuine intellectual synthesis — historians, theorists, essayists — there's nothing better.

**where it breaks:** it breaks below 500 notes (the graph is too sparse to give serendipity, the overhead of linking discipline outweighs the payoff), and it breaks above ~5,000 notes (the graph becomes a hairball that nobody can navigate without external tooling). it breaks for operators because zettelkasten has no concept of state. "ship v2" is not a zettelkasten note. "meeting with chris next tuesday" is not a zettelkasten note. it's a method for thinking, not for running things. people who try to make their entire vault a zettelkasten end up either abandoning it within a year or rebuilding para inside it under different names.

**operator verdict:** keep a zettelkasten subfolder for ideas that compound — frameworks, mental models, claims you want to defend in writing. don't run your whole vault on it. c-tier as a primary method for operators, a-tier as a sidecar for anyone who writes publicly. the discipline cost is real and it's worth paying only for ideas you'll cite ten times.

### Johnny Decimal

a system invented by jonathan otto-smith for physical-and-digital filing. you get 10 areas (10-19, 20-29, etc.), each area gets 10 categories (11, 12, 13...), each category gets up to 100 items (11.01, 11.02...). no nesting beyond that. every file gets a number, the number never changes, you find anything by reciting the path: "i need the q2 board deck — that's 30 finance, 32 board, 32.04." it's a filing-cabinet brain forced onto a filesystem.

**where it shines:** ops teams. legal departments. anyone who has to find the same document at 11pm on a deadline. the constraint of "max 10 categories per area" forces real thinking about what your top-level structure actually is. it complements para nicely — para tells you *what* to file, johnny decimal tells you *where* to put it on disk.

**where it breaks:** the moment you have an 11th category in an area, the whole system needs renumbering. it fights zettelkasten because zk wants meaningful filenames and dense linking; johnny decimal wants ids and folders. it doesn't handle entities-with-lifecycles — a person, a deal, a company doesn't naturally get a johnny decimal number. and ai agents reading your vault don't care about your numbers; they read filenames and content, so the cognitive overhead of maintaining ids is paid by you, not by the machine.

**operator verdict:** great for the 10% of your vault that's static reference (contracts, financial docs, legal, identity docs). terrible as a whole-vault method for anyone doing knowledge work. b-tier as a sub-system, d-tier as a primary method.

### LATCH / CABO

richard saul wurman's claim from *information anxiety* (1989): there are only five ways to organize anything — location, alphabet, time, category, hierarchy. cabo is the same idea reshuffled. this isn't a vault method, it's the underlying theory. every folder structure you've ever built is a mix of latch axes, usually badly chosen.

**where it matters:** vault design. when you're sketching your top level, latch tells you which axis you're committing to. para is "category" with a sprinkle of "time" (active vs archive). johnny decimal is "hierarchy" with numbers. zettelkasten rejects all five and runs on connection. if your vault feels wrong, it's almost always because you mixed axes at the same level — you have "clients/" (category), "2025/" (time), and "important/" (priority, which isn't even latch) as siblings, and your brain rejects the inconsistency.

**operator verdict:** read the chapter, internalize the five axes, don't try to "implement latch." it's a diagnostic tool, not a system. a-tier as theory, n/a as a method.

### GTD-based vault

david allen's getting things done, adapted to obsidian/notion/etc. top level is inbox, next actions, waiting for, someday/maybe, projects, reference. every input gets processed in 2 minutes or less, either done, deferred, delegated, or filed. projects are anything requiring more than one action. the genius of gtd was a complete capture-process-organize-review-do loop for *tasks* — it was never designed for knowledge.

**where it shines:** people drowning in commitments who haven't gotten the basics of capture-and-process working. if you can't find what you owe people by friday, gtd will save your life. the weekly review ritual is the single most valuable habit in personal productivity.

**where it breaks for knowledge work:** gtd treats every note as a potential action. but most knowledge isn't actionable — it's reference, claims, frameworks, evidence. forcing notes into the gtd shape means everything becomes a to-do, and your vault turns into a guilt machine. it also has no concept of compound value — a permanent note in zettelkasten gets richer every year, a gtd project gets archived the day it ships.

**operator verdict:** run gtd in a tasks tool (things, todoist, linear, whatever) and let your vault be a vault. trying to make obsidian both your task manager and your knowledge base is a known anti-pattern that fails within six months. d-tier as a vault method, s-tier as a sidecar task discipline.

### ACCESS / PPV / Augmented LATCH

three hybrids that show up in pkm blogs.

**access** (nick milo) — atlas, calendar, cards, efforts, sources, spaces. six top-level folders, an explicit "i don't like para's four buckets" remix. atlas is your maps-of-content (mocs), calendar is daily notes, cards is atomic ideas, efforts is projects, sources is literature, spaces is shared workspaces. the one good idea here is mocs — manually-curated index notes that act as table-of-contents for a topic. mocs are real and useful. the rest of access is "para with rebranded folders." verdict: borrow mocs, skip the framework.

**pillars-pipelines-vaults** (the sweet setup, august bradley) — pillars are life areas, pipelines are recurring workflows (publish-content pipeline, hire pipeline), vaults are databases of reference. it's notion-native and assumes you'll build out dashboards. for operators running repeatable processes (hiring loops, content production, sales follow-up), the pipeline concept is real. verdict: good for notion users running ops, vibes for everyone else.

**augmented latch** — using ai to dynamically reorganize content along latch axes ("show me everything by time," "show me everything by category"). more a thesis than a method. it bets on agents being good enough to do the organizing, so you just dump content. is it real? not yet for most people, but it's where this is going. verdict: directionally correct, currently mostly vibes.

most operators don't need to learn these by name. learn mocs from access, learn pipelines from ppv, ignore the rest.

### Bullet Journal applied to digital

ryder carroll's analog method. rapid logging with bullet symbols (• task, ○ event, – note), monthly migration ritual (decide what's still alive), index-driven retrieval, the "future log" for anything more than a month out. the discipline is daily — you write the date, you log everything, you migrate forward, you cross things off.

**where it adapts to digital:** the daily-note pattern in obsidian is downstream of bujo. the migration ritual maps onto weekly reviews. the bullet symbols can become callout types or task statuses. the "index" concept maps onto mocs.

**where it doesn't adapt:** the whole point of bujo is the friction. having to rewrite a task tomorrow makes you ask "is this still worth doing." in digital, that friction is gone — tasks roll forward automatically, nothing forces a review. so digital bullet journal is bullet journal with the brakes off, which means it's just journaling. the analog discipline doesn't survive the conversion.

**operator verdict:** the daily-note rhythm and the weekly migration ritual are worth stealing. the symbols and the index are a distraction. c-tier as a vault method, a-tier as a daily-note discipline.

### Project-as-entity (Vlad's twist)

forte defines a project as "an active outcome with a deadline." this is too narrow for anyone running more than one thing. for an operator at portfolio scale, the right primitive is broader: **a project is anything with state and a lifecycle.** if it changes over time, if you make decisions about it, if it has a history worth remembering, it's a project.

under that definition:

- **a company** is a project. belkins has state (mrr, headcount, runway), it has a lifecycle (founded, growth phases, eventual exit or wind-down), it has decisions and a history. it's not just an "area" — it's an entity you actively shape.
- **a person** is a project. chris laverdure has state (mentoring phase, current homework, last session date), a lifecycle (intake, growth, eventual graduation or churn), and a history of decisions. treating chris as a "resource" or as folders inside "mentoring" loses the entity-ness.
- **a deal** is a project. it has stages, decisions, a clock, and a history. crm tools know this. vaults usually don't.
- **a quarterly initiative** is a project even when it spans multiple teams — "ship folderly emailgen v2" has state, lifecycle, decisions.
- **a song** is a project. so is a book, a talk, a piece of furniture you're making, a workout program you're running.
- **a relationship** is a project. controversial framing but accurate — it has state, it has decisions, it has history, it deserves the same structural respect as a company.

the operator move is to give each of these its own folder with a consistent shape — a hub note (overview, current state, next actions), a decisions log, a meeting/session log, supporting docs — and to stop forcing them into para's four buckets. you end up with a top-level structure like `Companies/`, `People/`, `Deals/`, `Initiatives/`, `Creative/`, `Health/`, `Inbox/`, `Archive/` — entity-typed, not action-typed. inside each entity, the para logic still applies (active vs reference vs archived) but it's now nested correctly.

**why this works for ai agents:** when an agent reads your vault, the most useful question is "what's the current state of x?" — entity-typed folders make that one path lookup. para forces the agent to guess whether x is currently a project or an area, and the answer depends on time. project-as-entity is a stable mapping. an agent reading `People/Chris Laverdure/` finds the hub note, the action tracker, the session log, the patterns file — and can answer any question about chris without crawling six folders.

**why it scales past para's ceiling:** para breaks at ~15 active projects because the projects folder becomes a list you can't visually scan. entity-typed folders break at ~50 entities per type, which for most operators is years away. and when an entity goes dormant (a deal dies, a relationship fades), it migrates to that entity's archive subfolder, not to a global archive that mixes everything.

**the catch:** project-as-entity requires you to commit to entity types up front. add a new top-level type and you're moving folders around, which is friction. so pick 6-8 types and stick with them. for an operator portfolio, the durable list is roughly: companies, people, deals, initiatives, creative, health, inbox, archive. eight folders, every active thing you touch has a home, agents can navigate it, and the four-pillar para logic survives one level down.

## Comparison table

| Method | Best for | Worst for | Time-to-learn | AI-readiness | Vlad's verdict |
|---|---|---|---|---|---|
| PARA | solo founders, consultants, one-product operators | portfolio operators, 5+ companies, multi-mentee work | 1 weekend | medium — agents need to guess project vs area | B — ships fast, breaks at scale |
| Zettelkasten | researchers, essayists, long-horizon thinkers | anyone with active deliverables and state | 3-6 months for discipline | high — graph structure is agent-friendly | C as primary, A as sidecar — only for ideas you'll cite ten times |
| Johnny Decimal | ops teams, legal, static reference | knowledge workers, anyone with entities | 1 week | medium — ids are noise to agents | B as sub-system, D as whole-vault |
| LATCH / CABO | diagnosing why your folders feel wrong | "implementing" a method (it isn't one) | one chapter | n/a — it's theory | A as theory, n/a as method |
| GTD-based vault | task overload, capture broken | knowledge work, compound notes | 2 weeks | low — tasks aren't notes | D in vault, S in a separate task tool |
| ACCESS / PPV / Augmented LATCH | borrowing mocs and pipelines | adopting wholesale | 1-2 weeks | medium | C — steal the good ideas, skip the framework |
| Bullet Journal (digital) | daily-note rhythm, weekly review ritual | structural vault organization | 1 week | low — symbols don't help agents | C as method, A as daily discipline |
| Project-as-entity | portfolio operators, 5+ companies, agent-readable vaults | solo writers, single-product founders | 2-3 weeks | high — entity-typed paths are stable | S for operator portfolios, A for everyone past the first product |

## When each method wins

if you're a **solo founder** shipping one product, use para. ship by friday, refactor in six months. don't overthink it.

if you're a **multi-company ceo** running 3+ portfolio companies, use project-as-entity with para nested inside each entity folder. para alone will collapse by month 8. johnny decimal can handle your static reference (contracts, identity, legal) as a sub-tree.

if you're a **paid mentor**, give each mentee their own entity folder under `People/` with a hub note, action tracker, session log, and patterns file. this is the only structure that survives reschedules, async messages, and multi-quarter relationships. para's "projects/mentoring/chris" loses the entity-ness.

if you're a **newsletter operator** with a recurring publishing rhythm, run para for active issues and a small zettelkasten subfolder for evergreen claims you'll cite repeatedly. add ppv-style pipelines for content production if your workflow is repeatable. don't run pure zettelkasten unless your newsletter is genuinely about ideas connecting — most aren't.

if you're a **content creator** (video, podcast, social), use project-as-entity with `Episodes/` or `Videos/` as a type, each episode as its own entity. the lifecycle (idea → script → record → edit → publish → analytics) is the project. para alone makes you lose the post-publish data.

if you're a **researcher**, zettelkasten as primary, para as a thin top layer for active deliverables (papers, talks, courses). this is the one place zettelkasten was actually designed for.

if you're a **freelancer** with rotating client work, para wins. clients are projects, your skill areas are areas, your reference library is resources, dead clients are archive. don't overcomplicate.

## What to avoid

1. **starting with 12 top-level folders.** if your root is wider than 8, you don't have a structure, you have a pile. cut to 6-8 or you'll never trust your own vault.

2. **using tags and folders for the same hierarchy.** pick one axis per question. if "client" is a folder, don't also tag #client/acme. if you tag by status, don't also fold by status. doubling-up means you'll update one and forget the other, and the vault will lie to you within three weeks.

3. **trying to make obsidian your task manager.** it isn't one. the moment you put real deadlines in markdown checkboxes and rely on them, you'll miss something that matters. keep tasks in a tool that pings you and notes in a tool that doesn't.

4. **adopting a method because the youtube video looked clean.** the demo vault has 40 notes. yours will have 4,000. methods that look beautiful at demo scale (zettelkasten graphs, johnny decimal numbering, ppv dashboards) often degrade ugly at real scale. ask "what does this look like in year 3" before committing.

5. **refactoring your vault more than twice a year.** every refactor breaks links, breaks muscle memory, breaks the agents reading the vault, and breaks any external references you've shared. the cost is invisible and compound. pick a structure, live with its weaknesses, refactor at most every 6 months and only with a written reason.

## Hybrid recommendations

**PARA + Zettelkasten for newsletter operators.** top level is para. inside resources/, you keep a `zettel/` subfolder running pure atomic-notes discipline for claims and frameworks you cite across issues. the newsletter draft lives in projects/. once a claim shows up in three issues, promote it to a permanent zettel. this works because the zettelkasten is small (200-800 notes), focused (only ideas you'll reuse), and isolated (its discipline cost doesn't leak into your project folders). it breaks if you try to make every note atomic — most notes shouldn't be.

**Project-as-entity + Johnny Decimal for portfolio operators.** entity-typed top level (companies, people, deals, initiatives, creative, inbox, archive). inside each entity, johnny decimal numbering for sub-areas that are stable and worth quick recall — `Companies/Belkins/10-finance/`, `11-legal/`, `12-product/`, etc. this gives you entity-ness at the top (which is what your brain and your agents need) and filing-cabinet discipline inside each entity (which is what your ops needs). the catch: you have to commit to the johnny decimal numbering at entity creation time and stick with it. when belkins gets its 11th sub-area, you renumber for that entity only, not across the vault.

**PARA + MOCs (from ACCESS) for solo founders past 200 notes.** pure para starts to feel sparse around 200 notes — the projects folder is small enough to scan, but the resources folder gets unnavigable. add manually-curated mocs at the top of resources/ as index notes for each topic cluster (e.g., `MOC - Pricing.md`, `MOC - Hiring.md`). a moc isn't a folder, it's a note that links to the 10-30 notes worth pulling together on a topic. mocs are the one ai-readable structure that scales without forcing renumbering or refactoring — agents can read a moc and immediately understand the topic graph. don't make mocs for everything; make them for the topics you find yourself searching for repeatedly.

**GTD (separate tool) + Project-as-entity (vault).** the cleanest operator setup. tasks live in a tool that pings you (things, linear, todoist, height). knowledge lives in a vault organized by entity. they connect via task-content links — a task in the tasks tool references a vault note for context, the vault note references the task for status. this is two systems, not one, and the seam is intentional. trying to unify them into a single tool always degrades both. the discipline cost is keeping the seam clean — when a task is done, the vault note records the outcome; when a decision is made in the vault, the task tool gets the next action. two muscles, one workflow.
