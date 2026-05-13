# vault C — vlad's shape: project-as-entity, neuron graph, import workflow

## 1. project-as-entity: the reframe

forte's PARA is clean and i respect it — but the "P" is too narrow for how i actually run my life. his definition: a project is an active outcome with a deadline. ship the launch by sep 30. file the taxes by apr 15. close the round by end of q2. clear, bounded, finishable. great for a knowledge worker with five deliverables on their plate.

i don't have five deliverables. i have a portfolio. companies, people, deals, songs, kids, a newsletter, three side-bets, an investor who needs an update next week, a mentee whose recruiter pipeline is bleeding. none of these have a single deadline. all of them have state. all of them have lifecycle. all of them deserve a folder.

so the reframe i landed on — and this is the one that made the vault actually load-bearing — is: **a project is anything with state and lifecycle.** anything you'd ever ask "what's the status of X?" about, anything that has open threads, anything that changes over time and has a now-version different from its last-month-version. that's the test. not the deadline. the state.

run that test against your life and the list gets long:

- **a company.** belkins has state — MRR, headcount, pipeline, churn, hiring plan. it has lifecycle — founded, scaled, plateaued, re-accelerated. it's a project. it just happens to be a multi-year, multi-thousand-person project.
- **a person.** a mentee has state — last session date, open homework, behavioral patterns, the things they keep dodging, the thing they're proud of. the relationship is the lifecycle. an investor has state — last update, position size, what they care about, when you last asked them for something. a customer, same.
- **a deal.** acme corp $100K has state — discovery, proposal, negotiation, close, churn, expand. it's a state machine with seven nodes and you can map exactly where it is right now. classic project except it lives inside a CRM most of the time and dies the moment you stop tracking it.
- **a quarterly initiative.** this one IS forte's classic definition. q3 launch by sep 30. fine. it lives in 02-Projects/Active alongside everything else.
- **a content piece.** a newsletter issue has state — draft, review, scheduled, shipped, performance-known. lifecycle is short — maybe two weeks — but the state is real. a podcast episode, a youtube short, a tweet thread that's been sitting in your drafts for a month. project.
- **a side project.** the spotify side-bet. the AI anime series. the rewrite of the personal site. no formal deadline. ambiguous lifecycle. but state — definitely. it's either alive, paused, dead, or "thinking about it." project.
- **a relationship.** my wife. my kid. my closest friends. they have state. the relationship has lifecycle — it's not static. the open threads here aren't "ship by friday" — they're "i haven't called dad in three weeks" or "we said we'd do that trip and never planned it." which is exactly the kind of thing a vault is good at surfacing if you let it.

the thing this reframe gets you: a single PARA shape can hold companies AND people AND deals AND initiatives, instead of splitting them into seven top-level folders. you don't need /companies, /people, /deals, /content, /mentees, /relationships. you need 02-Projects/Active and you sort by entity inside. belkins is a project. mentee A is a project. acme deal is a project. q3 launch is a project. all the same shape, all in the same drawer, all firing into the same graph.

honest cost: more notes inside 02-Projects/Active. the top-level folder loses some of its "i can browse this with my eyes" quality. you're not eyeballing a list of 6 projects anymore — you're looking at 40, 80, 200. that's a real tradeoff. counterweight: you stop using the folder tree as your primary navigation anyway. you navigate by graph, by search, by daily note backlinks. the folder is where the file lives; the graph is how you find it.

operator example. belkins is one project node. inside it: belkins/q1 launch (initiative), belkins/sales team (group of people), belkins/jenny (person — VP of sales, has state and lifecycle), belkins/folderly bundle deal (deal — state machine). cross-link: jenny shows up in mentee A's note because mentee A asked about her hiring process. now the graph fires across belkins → jenny → mentee A and back. one click into mentee A surfaces the jenny conversation. one click into belkins surfaces every sub-thread without scrolling. that's leverage.

the pull-quote version, because someone always asks for one:

> treat people like projects. they have state. they have lifecycle. they have open threads. the disrespect isn't in the framing — the disrespect is in losing track.

losing track is the actual disrespect. forgetting your mentee told you about their kid. forgetting an investor's exact ask from three months ago. forgetting that a friend mentioned they were struggling. that's the failure mode the vault is built against. the framing is just the scaffolding that lets you not lose track at scale.

the reframe is the single biggest shift in how this whole system works. once a person is a project, the question "what should i prep for tomorrow's call?" has the same answer-shape as "what's the status of the q3 launch?" — open the project note, read state + open threads + last entry, done. one mental motion across every entity in your life. that's the whole point.

## 2. neuron logic — how the graph becomes a brain

most people open obsidian's graph view, go "ooh pretty," screenshot it, and never look again. fair. as a visualization it's a toy. as a diagnostic, it's the most useful single panel in the vault.

here's what the graph actually tells you, if you know what you're looking at.

**dense central cluster.** that's your daily-driver themes. the entities you touch every week — your active companies, your top mentees, your current quarterly initiatives, the deal that's about to close. if the cluster is dense and tight, your life is coherent and your attention is concentrated. if the cluster is sparse and stringy, you're probably context-switching too much.

**hub nodes.** the big dots in the cluster, the ones with 20+ links radiating out. these are your high-leverage entities. belkins is a hub. mentee A is a hub. your newsletter is a hub. each one has session notes, action items, sub-projects, people tied to it. when you click a hub, the whole local network lights up — that's the firing pattern.

**radial outer ring of orphan nodes.** every vault has them. notes you captured once, didn't link to anything, and forgot. floating in their own gravity well, miles from the cluster. small number = healthy. large growing ring = you're capturing without integrating. red flag. every two weeks you should sweep the orphans and either link them or kill them. don't let them metastasize.

**floating disconnected clusters.** the most interesting signal. you'll see, say, a tight little cluster of 15 notes about a project you started last year and forgot. fully linked among themselves, zero edges to the central cluster. that's a theme you stopped engaging with. decision: revive (link back to central, reactivate the project) or archive (move to 03-Archive and stop pretending it's alive). either way, the graph forced the decision.

**neuron firing.** this is the part that doesn't show in a screenshot, but it's the actual mechanic. you click [[mentee A]]. up comes the project note. inside it: backlinks to every session, every action item, the patterns doc, the strategic map, the legal issue you flagged last month, the WhatsApp thread you transcribed. one click. one read. entire relationship context loaded into your head, no clicking through six tabs, no scrolling a CRM, no "let me check my notes from last time." the graph fired. the neurons connected. the context is hot.

compare this to notion. notion has rows. you can put the same data in. you can even build relations between databases. but clicking a row doesn't fire anything — it opens a row. you still have to manually pull the linked rows from elsewhere. there's no spreading activation. the graph is the spreading activation. that's the entire difference.

**the memory-consolidation cycle.** every two weeks, open the graph view and look at it. it's a 5-minute ritual. you're looking for three things. one: new orphans — capture without linking, fix immediately. two: new hubs — themes deepening, good signal, maybe deserves a proper MOC. three: hubs that are TOO dense — a single project note with 80 backlinks is no longer a project, it's a folder. time to split it into sub-projects.

**why this matters for AI.** when an agent reads a hub node, it gets the whole context in one read. open mentee A → all session notes are visible via backlinks, all action items via dataview, all patterns via direct link. one tool call, full context. contrast: an agent against a notion workspace has to do N queries — fetch row, fetch related rows, fetch related-related rows, stitch it together, hope nothing's missing. the obsidian graph is shaped exactly like an agent's read pattern wants the world to be shaped. that's not a coincidence — it's just what happens when you build for spreading activation. AI inherits the topology you wrote for yourself.

## 3. import workflow — getting from apple notes and email to a working brain

this is the part nobody writes down because they did it once and then forgot. i'll write it down because i literally did it and there are a dozen non-obvious things.

**step 1 — export apple notes.**

apple notes has a built-in File → Export option that dumps to PDF (useless) or, with a little coaxing, to a folder of text. better tool: Exporter on the mac app store, or the notes-to-markdown CLI on github. either gives you a folder of .md files, one per note, with the body, attachments alongside.

what's lossy: tables get mangled, embedded sketches lose fidelity, voice memos come through as audio files you'll never re-listen to. pragmatic move: accept the loss. import the markdown, drop the sketches into an attachments folder, archive the voice memos in a /raw-imports/ subdirectory, move on. if you try to losslessly preserve every apple note artifact you will spend two weeks and never start using the vault.

**step 2 — export key emails.**

mimestream's "save as" is the cleanest for gmail. apple mail can do it too. gmail takeout works but gives you mbox which then needs conversion — usable but annoying.

critical filter: do NOT import everything. importing all your email is the single biggest mistake people make. you'll end up with 50,000 notes, 49,500 of them noise (receipts, marketing, newsletters, calendar invites, two-factor codes), and the vault will be poisoned with garbage forever. the graph will be unusable.

what to import: client emails, mentee threads, investor updates, key decisions, anything where you remember the conversation mattering. 80/20 estimate — probably 200 to 500 emails from the last three years actually matter. save each thread as one .md file, with the subject + participants + date in frontmatter. one thread = one note.

**step 3 — drop everything into 00-Inbox/.**

do not try to organize during import. that's the trap. you'll get 30 notes in and want to build the perfect taxonomy and quit. inbox is the dump zone by design. just get the bytes onto disk inside the vault.

run a quick dataview query to see total volume: `LIST FROM "00-Inbox"` and count. typical post-import: 1,500 to 3,000 notes. it'll feel overwhelming. it's supposed to. this is the raw matter stage.

**step 4 — first pass: bulk-link the obvious entities.**

this is the highest-ROI move in the whole import. for each note, you want one to three `[[Entity]]` links pointing at the main subjects. companies, people, projects. don't try to be exhaustive — just the obvious ones.

you can do this manually for a few hundred notes (slow but you build context). better: a templater script with a regex pass that auto-links known entity names. best: a cowork/claude session with filesystem MCP that reads each file, identifies entities, and inserts `[[brackets]]` around the obvious matches.

this is the step that makes the graph start firing. before this, your 2,000 notes are an unconnected pile. after this, they're a network. even rough, imperfect links create enough structure that the graph view becomes meaningful and you can navigate by clicking.

**step 5 — promote: inbox → permanent home.**

for each inbox item, four-way decision: daily note (move to 01-Daily/YYYY-MM-DD if it's about a specific day), project artifact (move to 02-Projects/Active/<Project>/ if it relates to an entity with state), reference (move to 06-References if it's evergreen knowledge), or trash (delete — receipts, dead context, stale drafts).

most notes find a home in 60-90 seconds. some notes will surprise you — "oh, this entire apple note IS the mentee X project, it shouldn't be a leaf, it should be the project root." those moments are the system rewarding you. let them happen.

don't try to promote all 2,000 in one sitting. budget 30 minutes a day for two weeks. you'll get through it without burning out.

**step 6 — the week-2 audit.**

one week after starting to promote, open the graph view. for real, the whole thing. zoom out.

you'll see:
- a dense cluster forming around your daily-driver themes — good
- an outer ring of orphans — needs linking, queue for next week
- one or two disconnected clusters — probably old themes that auto-revealed themselves as forgotten

pick the top 3 hub candidates from the graph and turn each into a proper project note. add frontmatter: status, last_updated, owner, open_threads. these are now anchors. the rest of the graph will reorganize around them over the following weeks.

**step 7 — daily capture from here forward.**

system is now alive. ongoing pattern:
- 00-Inbox stays the dump zone for new captures (voice memo, quick note from phone, screenshot, link)
- daily note fires from calendar each morning, captures meeting notes inline
- weekly 20-minute review: empty inbox, archive stale projects, check the graph

that's the whole loop. the rest is years of accumulation.

**common failure modes during import:**

- **importing too much.** the receipts and marketing emails one. the "all 12,000 apple notes including every recipe i screenshotted in 2019" one. cuts the signal-to-noise to ribbons. better: import less, capture more going forward.
- **trying to perfectly organize during import.** you will never finish. inbox is fine as a holding zone for weeks. the system tolerates this.
- **skipping the link-everything pass.** the biggest one. without step 4, the graph never fires and the vault is a filing cabinet. you'll abandon it in 30 days because it feels like more work than your old apple notes did.
- **quitting at week 2.** the compounding doesn't happen at week 2. it happens at month 3. at week 2 the vault feels like a slightly-organized pile. at month 3 it starts answering questions you didn't know to ask. keep going.

---

the brain you build in week 1 isn't the brain you'll have in year 1. week 1 is 2,000 lossy markdown files and a graph that looks like a sad cobweb. year 1 is 8,000 nodes, 40+ active projects, every person and company and deal in your life mapped, agents able to load context in one read, daily notes that fire backwards into every project they touched, a graph that genuinely starts to look like a brain because at some point it became one. but year-1 brain is impossible without week-1 import. you do the boring part first or you don't get the leverage at all.
