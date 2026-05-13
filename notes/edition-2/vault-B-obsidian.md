# vault B — obsidian, the operator build

this is the mechanics half. chapter A made the case for a vault. this one tells you exactly how to stand one up, what to install, what templates to paste, what queries to run, and the five ways it falls apart if you don't pay attention. i run ~964 files across belkins, folderly, lingualive, nocancer, 404 model agency, the newsletter, and paid mentoring. the graph looks like a neuron firing — dense inner cluster, radial outer ring of stubs and references. that didn't happen by accident, and it didn't take a weekend. it took roughly a year of small disciplines stacking. here's the build.

---

## 1. why obsidian wins for AI-native operators

i've used notion (5 years), roam (1), reflect (3 months), mem (2 months), logseq (a brief flirtation). i kept going back to obsidian. four reasons, in order of how much they matter for someone running on AI rails in 2026.

**local-first.** your vault is a folder of `.md` files on your machine. not in someone else's basement. not behind a startup's auth layer that might pivot to enterprise in q3. you can `ls` it, you can `grep` it, you can rsync it to a backup drive. notion can't say that. reflect can't say that. mem definitely can't. if obsidian the company disappears tomorrow, your vault still opens in any text editor for the next 40 years.

**markdown native.** every model on the planet — claude, gpt, gemini, llama, the open-source ones nobody's heard of yet — reads markdown fluently. there is no parsing layer between your notes and an LLM. you point a filesystem MCP at the folder and the model just *reads*. compare that to notion, which requires an API token, scoped permissions, page-by-page sync, and rate limits that bite at the worst time. or reflect, which has an API but nothing as clean as "give me the bytes of this file." obsidian gives the bytes directly.

**bidirectional links.** `[[chris laverdure]]` in a note creates a link, and the chris laverdure note shows the backlink automatically. this is the neuron — one node activates the network. notion has page links, but they're not symmetric. roam had this and got it right, then ran out of runway. obsidian has it and the company is profitable.

**plugin ecosystem.** ~1,500 community plugins as of 2026, open source, install in two clicks. when you need a thing, someone's already built it. when nobody's built it, the API is documented and the templater plugin lets you script in plain javascript. you don't wait for a roadmap.

free. optional sync at $8/mo (obsidian sync), or use icloud / dropbox / syncthing for $0. mobile apps are decent, not great. that's fine — phone is for capture, desktop is for synthesis.

specifically against the alternatives:
- **notion** — closed garden, API-gated, performance dies at ~5,000 pages, AI integration is via their AI, not yours
- **roam** — bidirectional links + outliner brain, but block-based not file-based, and the company is in slow decay
- **reflect** — beautiful, but cloud-only and the AI is theirs, not yours
- **mem** — AI-first marketing, but you can't run your own model against it
- **logseq** — local-first like obsidian, but outliner-default and the community is 1/10 the size

obsidian is the one with the local files, the symmetric links, the plugin firehose, and the operator-friendly defaults. that's why.

---

## 2. the 15-minute install

literally 15 minutes. do this now if you're reading on a laptop.

1. **download.** obsidian.md → big purple button. mac, windows, linux. installer is ~80MB.
2. **create a vault folder.** on mac i do `~/Desktop/Obsidian/Main-Vlad/`. on the desktop, not in documents, because you want it visible and you want it on a path that doesn't have a space in it (some scripts choke on spaces). pick a brain name. mine is "Vlad-Brain". it sounds dumb. it works.
3. **point obsidian at the folder.** open obsidian → "open folder as vault" → select the folder you just made.
4. **sync setup.** three options:
   - **icloud (free, mac+ipad)** — put the vault inside `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/`. encrypted at rest by apple. works seamlessly on mac and ipad. doesn't work on android.
   - **dropbox (free, all platforms)** — put the vault inside `~/Dropbox/`. cross-platform. *not* end-to-end encrypted by default — dropbox can read it. acceptable for most operators, dealbreaker if your vault contains client PII.
   - **obsidian sync ($8/mo)** — end-to-end encrypted, native, instant. if your vault has sensitive data, this is the path. i pay for it.
5. **mobile.** install obsidian on ios/android, open the same vault folder (icloud or dropbox path on phone), and you're synced.

**first 5 minutes of use.** create a note called `00-home.md` in the root. type a sentence. cmd+e to toggle preview. notice the markdown is plain text. close obsidian, open the same file in textedit — same content. that's the point. nothing is locked inside the app.

---

## 3. the core 8 plugins

settings → community plugins → turn on community plugins (obsidian asks once) → browse → install each.

1. **templater.** dynamic templates with javascript. the `<% %>` tags get evaluated when you create a note from the template. without templater, your daily note is a static skeleton; with it, it auto-fills today's date, yesterday's link, this week's open tasks. critical. no operator vault survives without this.

2. **dataview.** queries your vault like a database. `LIST FROM "02-Projects/Active" WHERE status = "active"`. SQL-ish syntax, returns live tables. this is what turns your vault from a pile of markdown into a system that answers questions. critical.

3. **tag wrangler.** lets you rename tags safely across the entire vault. you *will* misname a tag at some point. you *will* want to merge `#client` and `#clients`. tag wrangler does it without leaving 30 broken references.

4. **tasks.** checkbox tasks with metadata — due dates, priorities, recurrence. tasks live inside notes (because tasks have context), but tasks plugin lets you query across all notes: "show me everything due this week." paired with dataview, it's the closest thing to a real GTD layer.

5. **calendar.** sidebar calendar that shows which days have daily notes (colored) and which don't (greyed). click a day, opens or creates that day's note. minor plugin, massive ergonomics win.

6. **periodic notes.** scaffolds daily, weekly, monthly, quarterly, yearly notes with consistent templates. handles the file paths and the templater wiring. you'll forget it's there, which is the goal.

7. **excalidraw.** draw diagrams inline. when you're sketching a system architecture during a call and you want it in the meeting note, this beats opening figma. the drawings are stored as `.excalidraw.md` files — still markdown, still local.

8. **advanced tables.** keyboard-friendly markdown tables. tab to move cells, auto-align columns, no more counting pipes. trivial-sounding, you'll use it daily.

install path: settings → community plugins → browse → search by name → install → enable.

### three plugins to avoid

- **kanban.** looks cool, becomes tech debt. you end up with 4 kanban boards you forget to update. use linear for kanban, or notion if you must. obsidian is for notes, not project boards.
- **mind maps.** the implementations are all clunky. use a real whiteboard app (whimsical, figjam, excalidraw on a full canvas) and link to it from the note.
- **sliding panes.** the macos-style "pile up panes horizontally" plugin. looks cool at 3 panes, becomes visual chaos at 7. obsidian's built-in tab system is better at scale.

the principle: install plugins that disappear into the workflow. avoid plugins that *are* the workflow.

---

## 4. folder structure that survives 5 years

here's what i actually run. yours doesn't have to match exactly, but the *principles* — numeric prefixes, active/archive separation, one zone per type — those generalize.

```
Vlad-Brain/
├── 00-Inbox/                    # dump zone, anything goes
├── 01-Daily/
│   └── YYYY-MM-DD.md            # one file per day
├── 02-Projects/
│   ├── Active/
│   │   ├── Belkins/
│   │   ├── Folderly/
│   │   ├── LinguaLive/
│   │   ├── Mentoring/
│   │   │   └── Chris Laverdure - Mentoring.md
│   │   └── Newsletter/
│   └── Archive/                 # finished projects move here
├── 03-People/
│   ├── Chris Laverdure.md
│   ├── DJ Christofferson.md
│   └── ...
├── 04-Companies/
│   ├── Belkins.md
│   ├── Folderly.md
│   └── ...
├── 05-Newsletter/
│   ├── Drafts/
│   ├── Published/
│   └── Ideas/
├── 06-References/               # articles, papers, external links
└── 99-Templates/
    ├── daily.md
    ├── person.md
    ├── company.md
    ├── project.md
    ├── meeting.md
    ├── weekly.md
    └── newsletter-draft.md
```

**why numeric prefixes.** filesystems sort alphabetically. on every device, in every search tool, in every CLI listing — `00-` comes before `01-` comes before `99-`. without prefixes, "Daily" and "Drafts" and "People" get interleaved by accident. with prefixes, the structure is the order. you don't think about it.

**why 00-Inbox at the top.** when you have an idea on the phone at 11pm, you don't want to think about where it goes. you dump it in inbox. one file: `00-Inbox/2026-05-13 random thought.md`. you sort it later. inbox is the relief valve. without it, you don't capture; with it, you capture everything.

**why active vs archive separation.** projects end. when a project ends, you move the folder from `02-Projects/Active/` to `02-Projects/Archive/`. the active folder stays small (10-20 items). dataview queries scoped to `Active/` stay fast and meaningful. without this separation, active becomes a graveyard and your "what am i working on?" query returns 80 items, most of them dead.

**why people and companies are flat.** no nested hierarchy. `03-People/Chris Laverdure.md`, not `03-People/Canada/Mortgage/Chris Laverdure.md`. nesting breaks links the moment you reorganize. flat survives 5 years.

---

## 5. the 7 templates every vault needs

these go in `99-Templates/`. set templater's "template folder location" to `99-Templates`. then in periodic notes, set the daily-note template to `99-Templates/daily.md`. now every new daily note auto-fires this template.

### 5.1 daily note (`daily.md`)

```markdown
---
date: <% tp.date.now("YYYY-MM-DD") %>
type: daily
---

# <% tp.date.now("dddd, MMMM Do YYYY") %>

← [[<% tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD") %>]] | [[<% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD") %>]] →

## focus today
- [ ] 

## calls
- 

## did
- 

## captured
- 

## tomorrow seed
- 
```

the `tp.date.now` calls auto-fill today's date, the prev/next day links wire navigation without you typing anything. you open today's note, you see yesterday and tomorrow one click away.

### 5.2 weekly review (`weekly.md`)

```markdown
---
week: <% tp.date.now("YYYY-[W]WW") %>
type: weekly
---

# week of <% tp.date.now("MMMM Do") %>

## numbers
- belkins MRR: 
- folderly MRR: 
- lingualive: 
- newsletter subs: 

## wins
- 

## fires
- 

## people i touched
- 

## projects moved
- 

## next week — 3 priorities
1. 
2. 
3. 

## stale (no update in 7+ days)
```dataview
LIST file.mtime
FROM "02-Projects/Active"
WHERE file.mtime < date(today) - dur(7 days)
SORT file.mtime ASC
```
```

### 5.3 person note (`person.md`)

```markdown
---
type: person
name: <% tp.file.title %>
company: 
role: 
relationship: 
last_contact: <% tp.date.now("YYYY-MM-DD") %>
tags: [person]
---

# <% tp.file.title %>

## context
- 

## history
- <% tp.date.now("YYYY-MM-DD") %> — created note

## open threads
- [ ] 

## links
- 
```

`last_contact` is the field your dataview "who haven't i talked to" query reads.

### 5.4 company note (`company.md`)

```markdown
---
type: company
name: <% tp.file.title %>
status: active
stage: 
revenue_model: 
tags: [company]
---

# <% tp.file.title %>

## what they do


## why they matter to me


## key people


## current state
- 

## history
- <% tp.date.now("YYYY-MM-DD") %> — note created
```

### 5.5 project note (`project.md`)

```markdown
---
type: project
status: active
created: <% tp.date.now("YYYY-MM-DD") %>
owner: 
priority: 
tags: [project]
---

# <% tp.file.title %>

## goal


## current state
- 

## next 3 moves
1. 
2. 
3. 

## decisions log
- <% tp.date.now("YYYY-MM-DD") %> — 

## open questions
- [ ] 

## related
- 
```

### 5.6 meeting note (`meeting.md`)

```markdown
---
type: meeting
date: <% tp.date.now("YYYY-MM-DD") %>
with: 
topic: 
---

# <% tp.file.title %>

with: 
date: <% tp.date.now("YYYY-MM-DD HH:mm") %>

## agenda
- 

## notes
- 

## decisions
- 

## action items
- [ ] 

## follow up
- 
```

### 5.7 newsletter draft (`newsletter-draft.md`)

```markdown
---
type: newsletter
status: draft
issue_number: 
target_send: 
hook: 
tags: [newsletter, draft]
---

# <% tp.file.title %>

## hook (1 line)


## body — 3 beats
1. 
2. 
3. 

## one ask


## subject line options
- 
- 
- 

## status
- [ ] drafted
- [ ] edited
- [ ] approved
- [ ] scheduled
- [ ] sent
```

these 7 cover ~95% of what gets created in an operator vault. add more later if you need them, but resist. every new template is a maintenance burden.

---

## 6. the 5 dataview queries every operator should have

these go in a note called `00-Home.md` or `00-Dashboard.md` at the root. open it every morning.

### 6.1 open action items across all projects

```dataview
TASK
FROM "02-Projects/Active" OR "03-People" OR "01-Daily"
WHERE !completed
SORT due ASC
```

every unchecked `- [ ]` across active projects, people notes, and daily notes — surfaced and sorted by due date. if you tag tasks with `📅 2026-05-15`, dataview reads that as the due date and sorts accordingly.

### 6.2 this week's daily notes index

```dataview
LIST
FROM "01-Daily"
WHERE file.day >= date(today) - dur(7 days)
SORT file.day DESC
```

the last 7 daily notes, newest first. one click to any of them.

### 6.3 people i haven't touched in 14+ days

```dataview
TABLE last_contact, file.mtime
FROM "03-People"
WHERE last_contact AND date(last_contact) < date(today) - dur(14 days)
SORT last_contact ASC
```

the relationship-decay query. anyone i haven't logged contact with in 2 weeks shows up here. if you don't run this, half your relationships go silent and you don't notice until they're cold.

### 6.4 stale projects (no edit in 7+ days)

```dataview
TABLE file.mtime as "last touched"
FROM "02-Projects/Active"
WHERE file.mtime < date(today) - dur(7 days)
SORT file.mtime ASC
```

any active project i haven't edited in a week. either you do something on it this week, or you move it to archive. no third option. this query is what keeps Active actually active.

### 6.5 newsletter drafts in flight

```dataview
TABLE status, target_send
FROM "05-Newsletter/Drafts"
WHERE status != "sent"
SORT target_send ASC
```

every newsletter draft that hasn't shipped, with its target send date and current status.

these 5 queries are the operator dashboard. run them every monday morning. 15 minutes. you'll catch every stale project, every cold relationship, every undone task before they catch you.

---

## 7. backlink discipline — the neuron logic

bidirectional links are the difference between a vault and a folder of text files. used right, the graph becomes a thinking aid. used wrong, it becomes spaghetti.

**why they matter.** when you write `[[chris laverdure]]` in a meeting note, the chris laverdure note now shows that meeting in its backlinks pane. you didn't have to update both. one node, both directions. now imagine that across 964 files — every person knows every conversation they were in, every project knows every person involved, every company knows every initiative under it. that's the neuron.

**naming conventions.** pick one, stick with it.
- people: `First Last.md` (title case, real name). do *not* use slugs or kebab case for people — they break the visual reading flow.
- companies: `Company Name.md` (title case as the brand uses it)
- projects: `Project Name.md` (title case, descriptive)
- daily notes: `YYYY-MM-DD.md` (ISO date, sortable)
- meeting notes: `YYYY-MM-DD Topic with Person.md`
- references: `kebab-case-slug.md` is fine here, since these are rarely linked by hand

the rule: anything you'll write inline (`[[chris laverdure]]`) should match how you'd type it casually. anything indexed by search alone can be a slug.

**link vs embed.** `[[note]]` creates a link. `![[note]]` *embeds* the note's content inline. use embed sparingly — for a section header you want to mirror, or a canonical definition. overuse and your notes become reference manuals instead of records.

**graph view as diagnostic.** open the graph (cmd+g). zoom out. you'll see:
- **dense clusters** = themes that are well-developed. these are your strengths.
- **isolated nodes** = orphans. notes nothing else points to. these are either dead ideas or under-connected. weekly review: re-link or delete.
- **hub nodes** (very high link count) = key entities. these are your power people, anchor companies, recurring projects. they should be hub-shaped. if they're not, something's wrong with how you're capturing.

i check the graph every 2 weeks. the shape tells me where my attention has been.

---

## 8. tags vs folders — the eternal fight

operators get this wrong, and it costs them. the rule:

**folders = type. tags = state.**

a person is a person. they live in `03-People/`. that's their type, it doesn't change. but a person might *currently* be `#onboarding`, or `#cold`, or `#active-deal`. that's state, it changes. that's a tag.

a project is a project. lives in `02-Projects/Active/`. might be `#blocked` this week, `#shipping` next week. tags change. folder doesn't.

**don't duplicate hierarchy.** if you have a folder `02-Projects/Active/Belkins/`, you don't *also* need `#belkins` on every note inside. the folder *is* the hierarchy. tagging again creates two sources of truth.

**the tag-explosion failure mode.** here's how vaults die. month 1, you have 8 tags. month 6, you have 40. month 12, you have 200 — `#important`, `#urgent`, `#critical`, `#priority`, `#prio`, `#p0`, `#p1`, `#now`. none of them mean anything because they all mean "this thing i was excited about for 30 seconds." the query `tag:#important` returns 400 results.

**fix.** keep tags to ≤ 20 across the whole vault. use tag wrangler to merge duplicates monthly. tags should answer "what state is this in?" — if the answer is "it's just kind of important," delete the tag.

my current tag set, roughly: `#person`, `#project`, `#company`, `#newsletter`, `#draft`, `#sent`, `#active`, `#blocked`, `#onboarding`, `#mentee`, `#review-needed`, `#follow-up`, `#meeting`. that's it. 13 tags across 964 files.

---

## 9. mobile workflow

phone is for **capture**. desktop is for **synthesis**. don't try to write essays on a phone. don't try to capture brilliant 11pm ideas on a desktop you're not near.

**the 30-second capture pattern.**
1. ios share sheet → "obsidian" → "append to daily note" (configured in mobile settings)
2. paste / type / dictate
3. close

the idea is in `01-Daily/2026-05-13.md` before you put the phone down. it might be one line: "follow up with chris re: attorney." doesn't matter. it's captured. it'll get sorted in the next weekly review.

**voice memo → transcript.** ios voice memos has transcription built in (2025+). speak the idea, transcribe, paste into the daily note. for longer thoughts, use whisper.cpp locally or a transcription service — but for ≤30 second captures, the built-in is good enough.

**why the split matters.** mobile editing is uncomfortable. tiny keyboards, no real cursor control, awkward link insertion. trying to "do work" on a phone in obsidian is a tax. but as a dump zone, it's perfect — you don't need to organize, you just need to not lose the thought.

every monday morning, the desktop weekly review pulls all those mobile captures from `01-Daily/` and the inbox, and routes them to their permanent homes.

---

## 10. AI integration — connecting claude code + cowork

this is what makes the vault more than a notebook. you point an AI at the folder and it reads everything.

**filesystem MCP.** in claude code (or cowork, or claude desktop), configure the filesystem MCP to point at your vault root. example config snippet:

```json
{
  "mcpServers": {
    "vault": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/Desktop/Obsidian/Your-Brain"]
    }
  }
}
```

now claude can `list_directory`, `read_file`, and (if you allow it) `write_file` against the vault. the model becomes vault-aware. you can ask "what's the latest on the chris mentoring project?" and it reads the actual file, not its training data.

**CLAUDE.md at the vault root.** create `Your-Brain/CLAUDE.md`. this is the operator's instructions to the model. mine includes:
- who i am, what i run
- the folder structure (so the model knows where to look)
- the active people and projects (so the model can ground references)
- preferences (lowercase tone, no marketing copy, real numbers)
- which files to verify before responding (the mentoring source-of-truth files)

every time claude opens the vault, it reads CLAUDE.md first. that's how you get context-grounded responses instead of generic ones.

**read-only by default.** for the first month, configure the MCP read-only. let the model read, summarize, query. don't let it write yet. you want to trust the loop before you give it write access. after a month, if it's behaving, enable writes for specific scoped paths (`01-Daily/` first, then maybe `00-Inbox/`). never give it write access to `99-Templates/` or `02-Projects/Active/` until you've watched it for months.

**sample queries that work the moment you wire this up:**
- "what's open across my projects?" → runs against `02-Projects/Active/`, extracts `- [ ]` items
- "draft friday wrap-up from this week's daily notes" → reads the last 5 daily notes, synthesizes
- "who haven't i contacted in 14+ days?" → queries `03-People/` by `last_contact`
- "summarize my last 3 sessions with chris" → reads the chris mentoring folder
- "what did i ship this week?" → daily-note "did" sections, last 7 days

**skills that read the vault automatically.** if you're on claude code with the skill system, you can write small skills that wrap these queries: `/morning-briefing`, `/mentee-prep`, `/friday-wrapup`. each skill is ~50 lines, reads a specific subset of the vault, and produces a standard output. once written, they compound — you stop manually asking the same questions, the skill answers them on demand.

---

## 11. maintenance — the loop that keeps it alive

vaults die when the maintenance loop breaks. here's the cadence:

**daily — 5 minutes.** capture into `00-Inbox/` or `01-Daily/`. don't organize. don't link. don't worry. just capture. the friction has to stay near zero.

**weekly — 20 minutes (sundays or monday mornings).**
- open `00-Inbox/`, sort each item into its permanent home
- run the 5 dataview queries on the dashboard
- check stale projects — move dead ones to archive, push live ones one step forward
- write the weekly review note from the `weekly.md` template
- look at the graph, spot orphans

**monthly — 30 minutes (last sunday of the month).**
- consolidate memory: merge duplicate notes (you'll have some)
- prune dead reference notes
- fix broken links (obsidian → settings → files → "files & links" → check the broken links plugin if you've installed it)
- audit tags — anything down to <3 uses gets merged or deleted

**quarterly — 1 hour.**
- does the folder structure still match how you actually work?
- are there new patterns that need a new folder? (i added `06-References/Papers/` in q3 last year)
- are there folders nobody touches? (consolidate or delete)
- back up the entire vault to a separate drive

the loop doesn't have to be perfect. it has to be *consistent*. 5 min daily + 20 min weekly is the floor. miss a day, fine. miss a month of weekly reviews, the vault starts rotting.

---

## 12. common failure modes

these are the 5 ways operator vaults die. avoid all of them.

**1. building structure for 100 notes when you have 10.** you don't know what you need yet. start with the basic folders (00-06 + 99). don't add 14 sub-folders for theoretical content. the vault tells you what folders it needs by where your notes naturally pile up. premature structure is wasted work and creates the wrong scaffolding.

**2. tagging everything `#important`.** the universal-tag problem. if everything is important, nothing is. tags must discriminate. if a tag returns >50 notes, it's not pulling its weight. delete or split.

**3. letting inbox grow past 50 items.** inbox is for items in transit, not items in storage. if your inbox has 200 items, you're capturing but not processing. set a hard limit — when inbox hits 30, do a 10-minute sort. when it hits 50, stop everything and clear it.

**4. renaming people notes to their new title.** chris becomes "chris laverdure (CEO)" and now every `[[Chris Laverdure]]` link in your vault is broken. *never* rename a person note based on their current state. their name is their name. titles, roles, companies — those go in frontmatter, not in the filename. same for companies that rebrand.

**5. never archiving — active becomes a graveyard.** the most common one. you finish a project, you don't move it. six months later, `02-Projects/Active/` has 47 folders, half of them dead. archive ruthlessly. if a project hasn't been touched in 30 days and isn't blocked on someone external, it's done. move it. the active folder should hurt to look at — small, present, every item alive.

---

## 13. privacy & security

your vault contains client data, financial numbers, sensitive personal context, mentoring notes, possibly NDA-covered material. treat it like the sensitive thing it is.

**local-first matters.** the entire vault sits on your machine. that's the security model. you control the disk, the encryption, the backups. you do *not* outsource it to a vendor whose breach you'll read about in a year.

**don't park it in a cloud you don't control.** dropbox is fine for non-sensitive vaults. it's not fine if your vault has client PII, mentee financial data, or anything covered by an NDA — dropbox has read access. icloud is encrypted at rest and in transit; apple's E2E "advanced data protection" gives full key-on-device encryption for icloud drive (turn it on if you haven't). obsidian sync is end-to-end encrypted with your password. for sensitive vaults: obsidian sync or icloud with ADP on. for non-sensitive: dropbox is acceptable.

**backup discipline.** sync is not backup. sync replicates *deletions* too — if you nuke a file, the cloud nukes it everywhere. backup is a separate copy in a separate place.
- **weekly local backup.** automate it. `rsync -av ~/Desktop/Obsidian/Your-Brain/ /Volumes/BackupDrive/Obsidian-Backups/$(date +%Y-%m-%d)/`. cron it. takes 30 seconds.
- **monthly off-site.** one copy on a drive you keep somewhere other than your home (office, parents' house, safe deposit box). encrypted with a disk password (filevault or veracrypt). if your house burns down, your vault survives.

**git as a side-benefit.** you can `git init` your vault folder and commit weekly. gives you a versioned history with no extra software. don't push to a public remote (private github repo is fine, with the obvious caveats). i do this. it's saved me twice — once when i deleted a file by accident, once when obsidian's sync glitched.

paranoid setup: vault on filevault-encrypted disk, sync via obsidian sync (E2E), weekly local backup to filevault-encrypted external drive, monthly off-site copy in a banker's box at a relative's house. if you handle a portfolio's worth of sensitive data, this is the floor.

---

the operator vault is not a notes app. it's an exoskeleton. it's the thing that lets one person hold five companies, a newsletter, a portfolio of mentees, and a personal life in working memory — because none of it is actually in working memory. it's in the vault, queryable, linked, durable.

the install takes 15 minutes. the templates take 30. the discipline takes a year. you start now.
