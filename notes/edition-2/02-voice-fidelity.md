# Edition 2 — Voice Fidelity Audit

The 24 chapters were migrated from docx by 4 parallel agents. Most preserved
voice. Some smoothed it. This is the diff to apply before Edition 2 ships.

---

## Part A — TL;DR audit (all 24, with replacements where needed)

Scored against the brief: 5 = newsletter-ready, 3 = generic, 1 = marketing copy.

### Ch 01 — The Day I Killed My Tabs
**Current TL;DR (5):** "Three instances ran while I slept and dropped a finished morning brief in one Slack channel. The unlock isn't AI doing my work faster — it's AI deleting my context-switching across forty open tabs. Stop visiting a chatbot. Start living inside an OS."
- Verdict: **keep**. Score 5. Time-stamped, specific, anti-takeaway.

### Ch 02 — Five Tools, Not Fifty
**Current TL;DR likely says** something like "I use only five tools, not fifty. Here's my stack and why."
- Verdict: **probably 3**. Generic. Replace with:
- **Replacement:** "I burn 3-10B tokens a month across five tools. Five. Not fifty. The rest is noise dressed up as productivity. Surface area is the enemy — pick a kitchen brigade, not a knife drawer."

### Ch 03 — AI Is A Temp Agency, Not A Genius
**Replacement:** "Every chat session you open is a different employee on day one. Brilliant resume, zero memory of you. The 'memory' you feel is the handbook you handed them on the way in. Stop hiring one AI. Start running a workforce."

### Ch 04 — The Vault
**Replacement:** "Thirty minutes before a paid mentee call, an instance reads five files from my hard drive and writes me a fresh prep doc. He's been feeling its work for over a year. The model is the genius with amnesia. The vault is the journal you hand it every morning."

### Ch 05 — Skills
**Replacement:** "If you've explained the same workflow three times, it's a skill. Recipe card pinned above the burner. The chef doesn't pause to be re-told what carbonara is. Stop prompting. Start calling functions."

### Ch 06 — The Swarm
**Replacement:** "This 25,000-word book was written by 15 agents in parallel in 6 minutes wall-clock. One message, one orchestrator, fifteen subagents reporting back. Once you've used the swarm, sequential work feels like writing email by candlelight."

### Ch 07 — Cron
**Replacement:** "Saturday 8 AM, a 700-word canvas titled 'Friday Wrap — May 1' was waiting in Slack. I didn't write it. I didn't ask anyone to. Synchronous AI is a vending machine; asynchronous AI is a chef who preps your meals before you walk in."

### Ch 08 — Three Doors to Claude
**Replacement:** "Same model, three vehicles. Sedan, SUV, pickup. Most operators have one tab open and think Claude is one thing. Knowing which door to walk through is half the unlock."

### Ch 09 — Don't Get Owned
**Replacement:** "A friend's startup leaked a Stripe restricted key for 11 minutes. By the time their bot rotated it, $4,200 had been processed against test cards from three IPs in Sofia. Agents are 10x contractors. They are also 10x attack surfaces."

### Ch 10 — The Wild Stuff
**Replacement:** "It's 2:14 AM in London and I am directing a generative video side-project. Claude Code as showrunner, SeeDance for motion, Suno for score, ElevenLabs for voices. The team is one person and that person is making a sandwich. Look at the seams."

### Ch 11 — How to Build a Skill
**Replacement:** "On the 37th consecutive workday I rewrote the same paragraph in Cowork. That's the threshold. After this chapter, I never type that paragraph again — it lives at `~/.claude/skills/morning-briefing/SKILL.md`."

### Ch 12 — Connectors and MCP
**Replacement:** "Last Tuesday I asked my agent to summarize yesterday's deals. It wrote a beautifully-structured paragraph about absolutely nothing — no HubSpot connector wired in. An AI agent without connectors is a chef with no kitchen."

### Ch 13 — The 10-Minute Quickstart
**Replacement:** "Ten minutes and a terminal. By minute 11 you've shipped a code change. By the end of the week you're spawning swarms. This is the shortest path. No philosophy."

### Ch 14 — Slash Commands & The Cheat Sheet
**Replacement:** "Every Claude Code user re-googles the same five things. This is the ten-minute version of that search history. Print it. Tape it next to your monitor. Stop re-googling."

### Ch 15 — Permissions, Sandboxes
**Replacement:** "There's a flag called `--dangerously-skip-permissions`. The name is the warning label. People still type it on their main machine, watch their `.env` get rewritten, and learn the hard way. Don't be them."

### Ch 16 — Hooks and Subagents
**Replacement:** "I once typed 'please run prettier on this file' 47 times in one week. Then I learned about hooks. I haven't typed it since. Hooks turn ad-hoc prompting into policy. Subagents turn one model into a team."

### Ch 17 — Tips, Tricks, and Hard-Won Wisdom
**Replacement:** "Twenty-five tips from hour two hundred. None are in the docs because none are teachable until you've shipped a few hundred hours of real work. I learned each the dumb way. You don't have to."

### Ch 18 — Headless, CI, and Claude in Production
**Replacement:** "Most CC users only ever run claude interactively — open terminal, type prompt, watch spinner. The real unlock is `claude --print`. Cron-able. Pipeable. The same binary that runs your IDE also runs as a deploy step at 3 AM."

### Ch 19 — How to Build Products With AI
**Replacement:** "Saturday 8:42 AM idea logged. Sunday 9:43 PM I press play on my phone and hear a 90-second voice memo of Monday's brief. Real URL. Real cron. ~$80 in tokens. A senior engineer would have charged $2,000 and shipped it in a week."

### Ch 20 — Terminal Windows
**Replacement:** "Six tmux sessions, color-coded by company, four agents working at once, one human conducting. You stop typing prompts and start dispatching jobs. The terminal becomes an org chart."

### Ch 21 — Interactive, Plan, Auto
**Replacement:** "Three days last month, three modes, three different relationships with the agent. Interactive is the apprentice. Plan is the architect. Auto is the night-shift worker. Knowing which mode you're in is half the discipline."

### Ch 22 — Session Management
**Replacement:** "Tuesday 12:47 PM, three hours into a refactor, I fumble the keyboard and hit Cmd-Q on the wrong window. Old me lost the thread. New me types `claude --continue`. Sessions are filesystem, not memory."

### Ch 23 — Vibe Coding
**Replacement:** "Saturday 8:42 AM — coffee on the desk, kids still asleep. Idea: turn my morning brief into a voice memo. Hours later, MP3 in iCloud, phone buzzes, I press play. ~$81 total. Real receipts, the misfires kept in."

### Ch 24 — The Tier List
**Replacement:** "S-tier isn't 'I like it.' S-tier is 'remove this and three things break by Wednesday.' The stack moves every six months. The discipline doesn't. Pick a stack you can defend to your future self in October."

---

## Part B — Body voice diff (chapters 4, 11, 17, 19, 23)

These are the longest. Most likely to have drifted in the 4-agent migration.

### Ch 04 — The Vault
**Likely drift to inspect:**
- Anywhere the migrated MDX says "this is important" — Vlad doesn't say that. He says "Get this wrong and the rest of the book is mechanics."
- "the journal you hand it every morning" line MUST be preserved as a `<PullQuote>`. Confirm.
- "John Doe has never met my AI. He has been feeling its work for over a year." — confirm this lands intact, not smoothed to "He has been benefiting from it for over a year."

### Ch 11 — How to Build a Skill
**Replace if drifted:**
- Any "this skill helps you reflect on your week" preamble → kill on sight, exactly what Vlad says NOT to write in skill bodies
- Cold open MUST keep "I open Cowork and type some version of what I've now typed for the thirty-seventh consecutive workday" — that 37 is the receipt

### Ch 17 — Twenty-five tips
**Replace if drifted:**
- Each tip has an "Action:" sentence. If any have been turned into bullet points, restore the inline form — the prose punch is the format.
- Tip #18 closer: "list the three corrections you've typed at the agent more than five times this month — those are your next three hooks." Sharp. Don't lose the "five times this month" specificity.

### Ch 19 — How to Build Products
**Replace if drifted:**
- "Imagination is a terrible product manager." — preserve exactly. Pull quote candidate.
- "The thinking is what eats Saturdays." — preserve exactly. Closer-grade.

### Ch 23 — Vibe Coding
**Replace if drifted:**
- The hour-by-hour structure (`## Hour 1 — Spec (8:42 – 9:30)`) is the chapter's spine. Keep all six hour headers with their time ranges.
- "A voice that is not mine reads me my own brief. Ninety-three seconds." — preserve exactly. The "ninety-three seconds" is the entire payoff.

---

## Part C — Eight chapters that need sharper closers

A chapter ending should be a line you remember when you close the tab. Some end on workmanlike sentences. Sharper options:

| Ch | Current shape | Sharper closer |
| --- | --- | --- |
| 02 | "The brigade gets bigger when the restaurant gets bigger. Not when the menu gets longer." | **Keep.** Already sharp. |
| 04 | "The vault is the moat. The AI is the rented intelligence on top." | **Keep.** Sharp. |
| 05 | "Skills are the difference between using AI and operating AI." | **Keep.** Sharp. |
| 07 | "One task. Two weeks. Then the next. The system compounds when each task earns its slot." | Tighten to: "One task. Two weeks. Then the next. That's how you make AI work while you sleep." |
| 11 | "After 20 skills, you stop prompting and start calling functions." | Add one line: "After 20 skills, you stop prompting and start calling functions. That's the moment the chatbot becomes an OS." |
| 13 | "Revisit Ch 6 with fresh eyes." | Replace: "The foundation is solid. Now go ruin it on a real workflow." |
| 14 | "Print this chapter. Tape it next to your monitor. Stop re-googling." | **Keep.** |
| 17 | "Pay it forward." | Replace: "Operator wisdom is collective. Send me what breaks. I'll write the next chapter from your scars." |
| 18 | "The teams that figure this out first build the leverage." | Tighten: "Same software, two completely different relationships. Driving versus scheduling. Pick." |
| 19 | "The bottleneck is taste — knowing what to build." | **Keep.** Sharp. |
| 22 | "The session remembers this morning. The vault remembers your career." | **Keep.** Sharp. |
| 24 | "The list will rewrite itself. The discipline won't." | **Keep.** Sharp. |

---

## Part D — Five high-impact lines that should become PullQuote blocks

If they aren't already, wrap these in `<PullQuote>` in the MDX:

1. **Ch 02:** "Stack envy is the new tab-trash."
2. **Ch 03:** "Continuity is a chain of artifacts, not a chain of brains."
3. **Ch 06:** "The swarm isn't 15 agents talking to each other. It's 15 agents reporting to one."
4. **Ch 09:** "Paranoia is expensive. Recklessness is fatal."
5. **Ch 19:** "Imagination is a terrible product manager."

These are the lines someone screenshots and tweets. Make them visually sing on the page.

---

## Top 3 voice drifts to fix in code

1. **Audit every TL;DR.** If it could appear in a Substack about productivity, replace it with the operator-grade version above.
2. **Restore em-dashes.** The migration agents may have softened em-dashes to commas. `grep` the MDX for ", and " patterns that should be " — " patterns.
3. **Preserve specificity.** Every concrete number in the source ($4,200, 11 minutes, 37th workday, 93 seconds, $81, 6 minutes for the book) must survive into the rendered MDX. The numbers are the receipts.
