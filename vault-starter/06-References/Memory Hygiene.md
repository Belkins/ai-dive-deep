---
created: 2026-05-13
tags: [reference, ritual]
---

# Memory hygiene — the loop that keeps the vault firing

A vault that doesn't get written to is a vault that rots. Without
maintenance, your "second brain" becomes a graveyard.

## Daily — 5 min capture

- Write today's daily note (Calendar plugin → click → Templater fires)
- Anything that crossed your mind that isn't tied to a project goes in 00-Inbox/
- Don't organize. Don't link. Just capture. Inbox is the dump zone by design.

## Weekly — 20 min review (Friday afternoon or Sunday night)

1. Open 00-Inbox/. For each note:
   - Belongs to an existing project? → move to `02-Projects/Active/<Project>/`
   - About a person? → merge into `03-People/<Name>.md`
   - Reference material? → move to `06-References/`
   - Trash? → delete
2. Open Active projects folder. Anything not updated in 7+ days:
   - Still active? → add one line to push it forward
   - Done? → move to `02-Projects/Archive/`
   - Dead? → move to Archive with an `## Killed because` note
3. Update CLAUDE.md if your week's focus shifted

## Biweekly — graph view scan

- Open the graph (Cmd+G in Obsidian)
- Look for:
  - **Dense cluster** = your themes are firing. Good.
  - **Orphan ring on the outside** = notes no one links to. Either link them or archive them.
  - **Disconnected sub-cluster** = a theme you've stopped engaging with. Decide: revive or archive.
  - **Hub node growing too dense** = the entity has too many threads. Split into sub-notes.

## Monthly — consolidate-memory pass

- Use the `memory-hygiene` skill if you have it installed (or run manually)
- Merge duplicate notes (often happen during the import phase)
- Fix broken links (Obsidian's "broken links" pane catches them)
- Prune notes that haven't been opened in 6+ months — they're not memory, they're noise
- Re-tag — if you've used the same tag in 3 ways, pick one canonical use

## Quarterly — vault audit

- Does the structure still match how you actually work?
- Any folder that's grown past ~50 active notes? → split it
- Any folder that's <5 notes after 3 months? → merge it
- CLAUDE.md still accurate? → rewrite

## The compounding rule

Year 1 feels like overhead. You're writing notes you don't need yet,
structuring folders you barely use, updating files no one's reading.

Year 2 you have an orchard. Every AI instance you spawn benefits from
years of accumulated decisions, conversations, patterns, mistakes. The
AI doesn't just answer — it answers in the context of everything you've
ever decided.

Files that get touched, get loaded. Files that rot, mislead. Stale
memory is worse than no memory because it actively poisons every
instance you spawn.
