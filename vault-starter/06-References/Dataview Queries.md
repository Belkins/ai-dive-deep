---
created: 2026-05-13
tags: [reference, dataview]
---

# Dataview queries — the 5 every operator needs

Drop these into any note. They update live as your vault grows.

## 1. Open action items across all projects

```dataview
TASK
FROM "02-Projects/Active"
WHERE !completed
SORT due ASC
```

## 2. This week's daily notes

```dataview
TABLE WITHOUT ID file.link AS "Day", dow AS "Weekday"
FROM "01-Daily"
WHERE file.cday >= date(today) - dur(7 days)
SORT file.cday DESC
```

## 3. People I haven't interacted with in 14+ days

```dataview
TABLE last_interaction AS "Last", relationship AS "Type"
FROM "03-People"
WHERE last_interaction < date(today) - dur(14 days)
AND status = "active"
SORT last_interaction ASC
```

## 4. Stale projects (no update in 7+ days)

```dataview
TABLE status, last_updated AS "Last update"
FROM "02-Projects/Active"
WHERE last_updated < date(today) - dur(7 days)
SORT last_updated ASC
```

## 5. Newsletter drafts in flight

```dataview
TABLE issue_number AS "Issue", status, target_ship_date AS "Ships"
FROM "05-Newsletter"
WHERE status != "shipped"
SORT target_ship_date ASC
```

## Bonus — recent decisions across companies

```dataview
TABLE WITHOUT ID file.link AS "Company", file.mtime AS "Last update"
FROM "04-Companies"
WHERE status = "active"
SORT file.mtime DESC
```

## How they fire

- Drop the code block (with ` ```dataview` ) into any note
- Make sure the Dataview plugin is installed (Settings → Community plugins)
- Settings → Dataview → Enable JavaScript queries (off by default, leave off)
- Frontmatter fields are the data source — `last_updated`, `status`, `mrr`, `relationship` etc.
- Update frontmatter as the project evolves; queries pick up automatically
