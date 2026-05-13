# 10 connector deep-dives for /cowork-setup

The Cowork stack lives or dies on its connector list. Ten categories in my actual `cowork.ts` — fifteen services wired across them. Here are the ten that carry the load, written for an operator who is about to wire their own and wants the failure mode in advance.

Reference voice: chapter 12. Pattern: one CRM, one inbox, one calendar, one knowledge store per company — no duplicates. Read-only first, expand when a workflow demands it.

---

### filesystem

**Mode:** read-write
**Risk tier:** S (load-bearing)

**What Vlad wires through it:** The agent's hands. Every vault read, every skill write, every plan file lives here. End-of-day vault sync (7 PM) reads what shipped today and writes back so tomorrow's instance starts smart. Process-mining scan (Monday 9 AM) writes candidate-skill files. Without filesystem, none of the other connectors compose — Slack output has nowhere to land, Gong transcripts have nowhere to cache.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/vlad/Vlad-Brain",
        "/Users/vlad/Desktop/AI Products"
      ]
    }
  }
}
```

**The security gotcha:** Filesystem scope is the entire blast radius of the agent. Point it at `/` and an agent that goes wrong can rm-rf your laptop — point it at one vault and one project root and the worst-case is a noisy git diff. Two explicit paths, never the home directory.

**When NOT to wire this:** Never not. But never wire it at `~/` — always at the narrowest folder the workflow actually needs.

**Cross-link:** Ch 12 (transport: stdio), Ch 9 (don't get owned — filesystem is the most-abused vector in compromised agents).

---

### slack

**Mode:** read-write
**Risk tier:** S (load-bearing)

**What Vlad wires through it:** Output channel for everything. Morning briefing (7:30 AM weekdays) lands as DM. Deal-advancement alerts (5 PM ET) post to leadership canvas. Friday wrap-up cross-system synthesis lands Saturday-morning canvas. Reads everything — channels, threads, DMs — for context. Writes go through a confirmation step, because an agent that posts to #general without a gate is one bad cron away from a Monday-morning HR conversation.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-***",
        "SLACK_TEAM_ID": "T***",
        "SLACK_CHANNEL_IDS": "C0123,C0456"
      }
    }
  }
}
```

**The security gotcha:** `chat:write` lets the agent post as the bot user in any channel it has been invited to. Restrict the bot's channel membership at the Slack-admin layer, not at the prompt layer — prompts are advisory, channel ACLs are enforced.

**When NOT to wire write mode:** Agencies and shared workspaces where one wrong message blows up client trust. Stay read-only and use a separate webhook for outbound.

**Cross-link:** Ch 12 (Communication category), Ch 7 (scheduled tasks all terminate at Slack).

---

### gmail

**Mode:** read
**Risk tier:** A (high-value)

**What Vlad wires through it:** Inbox = highest-ROI connector after filesystem. Morning briefing pulls overnight thread context. Pre-meeting prep (30 min before each meeting) pulls last interaction with the attendees. Cross-references HubSpot contact email to build deal summaries — the inbox-CRM join is where most "what's going on with this account" questions actually get answered.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gmail"],
      "env": {
        "GMAIL_OAUTH_CLIENT_ID": "***.apps.googleusercontent.com",
        "GMAIL_OAUTH_CLIENT_SECRET": "***",
        "GMAIL_OAUTH_SCOPES": "gmail.readonly,gmail.labels"
      }
    }
  }
}
```

**The security gotcha:** `gmail.send` means the agent can email anyone in your contact graph as you — including your investors, your bank, and your in-laws. Gate sends with a hook that requires explicit human confirmation per message, or stay on `gmail.readonly` and draft-only via the Drafts API. Never grant full mailbox scope on a fresh setup.

**When NOT to wire write mode:** Until you have a confirmation hook tested in a sandbox account. Sent emails do not unsend.

**Cross-link:** Ch 12 (OAuth scopes section), Ch 9 (impersonation risk).

---

### hubspot

**Mode:** read-write
**Risk tier:** A (high-value)

**What Vlad wires through it:** Sales pipeline ticker (9 AM weekdays) pulls overnight deal motion — what advanced, what stalled, what went dark. Deal-advancement alerts (5 PM) read stage changes since 5 PM yesterday and write one paragraph each, "why this matters," back to a leadership Slack canvas. Writes are scoped to notes and tasks — never deal-stage changes, never close-won, never amount edits.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "pat-na1-***",
        "HUBSPOT_ALLOWED_OPERATIONS": "deals.read,contacts.read,notes.write,tasks.write"
      }
    }
  }
}
```

**The security gotcha:** `deals.write` means the agent can shift a deal to Closed-Won, which fires commission calculations, attribution reports, and downstream notifications. No autoclose without human-in-the-loop. Whitelist write operations explicitly — notes and tasks are safe, stage and amount are not.

**When NOT to wire write mode:** Anywhere commission or forecasting depends on stage accuracy. Read-only until you have a smoke-eval suite for every write path.

**Cross-link:** Ch 12 (Sales and CRM), Ch 7 (pipeline ticker).

---

### stripe

**Mode:** read
**Risk tier:** A (high-value)

**What Vlad wires through it:** Folderly's MRR motion, dispute trends, churn signals. "What was MRR last week" returns a real number, not a vibe. Friday wrap-up pulls week-over-week revenue delta for the Saturday-morning canvas. Read-only, full stop — billing is the one place where a hallucinated tool call has direct cash-impact downside.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server"],
      "env": {
        "STRIPE_API_KEY": "rk_live_***",
        "STRIPE_MODE": "read-only"
      }
    }
  }
}
```

**The security gotcha:** Use a restricted key (`rk_live_*`) with read-only resource scopes — never a secret key (`sk_live_*`). Stripe MCP blocks webhook and event endpoints by default, but a full secret key gives the agent refund + payout authority. One bad agent call against a `sk_live_*` key is a real-money incident.

**When NOT to wire write mode:** Always. Charges, refunds, payouts — keep them in a separate human-only surface. The agent reads; humans transact.

**Cross-link:** Ch 12 (Billing and finance), `feedback_stripe_mcp_capability_matrix.md` for what MCP exposes vs. blocks.

---

### github

**Mode:** read-write
**Risk tier:** S (load-bearing)

**What Vlad wires through it:** Hourly Sentry watcher fires Codex-style auto-PRs for non-trivial bugs — reviewed like junior-engineer work, never auto-merged. Friday wrap-up pulls repo health (open PRs, stale branches, failing builds) across every codebase. Reads issues for triage context, writes commits and PR descriptions through scoped fine-grained tokens.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "github_pat_***",
        "GITHUB_ALLOWED_REPOS": "Belkins/linkagent,Belkins/folderly"
      }
    }
  }
}
```

**The security gotcha:** A classic `ghp_*` token has org-wide blast radius — any repo you can see, the agent can touch. Use a fine-grained PAT scoped to specific repos + specific permissions (contents:write, pull-requests:write, issues:write). Never give an agent `admin:org` or `delete_repo`. Branch protection on `main` is non-negotiable.

**When NOT to wire write mode:** Repos with auto-deploy on push and no human review gate. The combination of agent-writes + auto-deploy is how production goes down on a Sunday.

**Cross-link:** Ch 12 (Engineering), Ch 7 (Sentry watcher cron).

---

### google calendar

**Mode:** read
**Risk tier:** A (high-value)

**What Vlad wires through it:** Half the questions an agent gets need calendar context — "when am I free Thursday," "who am I meeting with at 2," "what's on the day shape." Morning briefing pulls today + tomorrow. Pre-meeting prep (30 min before each meeting) joins the attendee list against HubSpot contacts and Gmail thread history. Read-only is enough for 95% of workflows — time-block suggestions get drafted, not booked.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "gcal": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-calendar"],
      "env": {
        "GOOGLE_OAUTH_CLIENT_ID": "***.apps.googleusercontent.com",
        "GOOGLE_OAUTH_CLIENT_SECRET": "***",
        "GOOGLE_OAUTH_SCOPES": "calendar.readonly,calendar.events.readonly"
      }
    }
  }
}
```

**The security gotcha:** `calendar.events` write scope lets the agent create, modify, and delete events — including dialing into other people's meetings as a guest. An agent that misparses a reschedule and deletes a board meeting is a real story. Stay on `calendar.readonly` until you have a confirmed write workflow.

**When NOT to wire write mode:** Calendars that include external attendees. Internal-only calendars are a safer first write target.

**Cross-link:** Ch 12 (Calendar and scheduling), Ch 7 (pre-meeting prep event trigger).

---

### notion

**Mode:** read
**Risk tier:** A (high-value)

**What Vlad wires through it:** Newsletter canonical store — everything else is a mirror. Vault sync (7 PM) doesn't write to Notion directly; it writes to the Obsidian vault, and Notion stays the human-curated surface. Reads page content, database queries, and comments to ground responses in the team's actual docs. For Belkins, Notion is read-only context; for the Newsletter, it's the source of truth.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server"],
      "env": {
        "NOTION_INTEGRATION_TOKEN": "ntn_***",
        "NOTION_ALLOWED_DATABASES": "db-id-1,db-id-2"
      }
    }
  }
}
```

**The security gotcha:** A Notion integration token grants access to every page the integration is connected to — and "connected to" is set page-by-page in the Notion UI, not in your `.mcp.json`. Audit which pages the integration sees inside Notion itself; a misconfigured share extends the agent's read scope to every child page, including HR docs and legal templates.

**When NOT to wire write mode:** Teams where doc structure has political meaning. An agent that reorganizes a wiki without consent loses trust fast.

**Cross-link:** Ch 12 (Vault and knowledge), `obsidian_vault_reference.md` for the mirror pattern.

---

### gong

**Mode:** read
**Risk tier:** B (situational)

**What Vlad wires through it:** Call transcript ingestion for deal summaries and follow-up drafts. Sales pipeline ticker joins Gong transcripts to HubSpot deal state — "deal advanced, here's the moment in the call that moved it." Pre-meeting prep pulls the last call transcript with the same buyer so the next conversation doesn't repeat ground. Pick ONE transcriber — Gong, Fireflies, or Granola — not three. The agent gets confused when the same call appears in two systems with two summaries.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "gong": {
      "command": "npx",
      "args": ["-y", "@gong/mcp-server"],
      "env": {
        "GONG_ACCESS_KEY": "***",
        "GONG_ACCESS_KEY_SECRET": "***",
        "GONG_ALLOWED_OPERATIONS": "calls.read,transcripts.read"
      }
    }
  }
}
```

**The security gotcha:** Gong transcripts contain customer PII, pricing discussions, and competitive intel. The MCP server returns full transcript text — anything that hits the agent's context window is now in your AI vendor's logs. Confirm your AI vendor's data retention policy before wiring Gong, and never pipe transcripts through a third-party model proxy.

**When NOT to wire this:** Regulated industries (healthcare, finance) where call recordings have explicit retention rules. The compliance overhead outweighs the agent uplift.

**Cross-link:** Ch 12 (Meeting transcripts — pick ONE), Ch 7 (deal-advancement alerts).

---

### ahrefs

**Mode:** read
**Risk tier:** B (situational)

**What Vlad wires through it:** Newsletter SEO motion. Keyword volume checks inline ("does this title have search demand"), backlink data for outreach targeting, competitor organic-keyword overlap for editorial planning. Friday wrap-up pulls week-over-week SEO movement across vladsnewsletter.com. Read-only by definition — Ahrefs doesn't expose write endpoints.

**.mcp.json snippet:**
```json
{
  "mcpServers": {
    "ahrefs": {
      "command": "npx",
      "args": ["-y", "@ahrefs/mcp-server"],
      "env": {
        "AHREFS_API_TOKEN": "***",
        "AHREFS_DEFAULT_TARGET": "vladsnewsletter.com"
      }
    }
  }
}
```

**The security gotcha:** API units burn fast. A single `keywords-explorer-overview` call costs ~50 units minimum; a `serp-overview` is variable; `site-explorer-organic-keywords` starts at 25 and scales. An agent in a loop hits the monthly quota before you notice. Preflight every batch with a `subscription-info-limits-and-usage` check — the `ahrefs-budget-check` skill exists for exactly this.

**When NOT to wire this:** Companies without organic SEO motion. The unit cost isn't worth the marginal value if no one acts on the data.

**Cross-link:** Ch 12 (Data and analytics), `ahrefs-budget-check` skill.

---

## Wiring order

If you're starting fresh, wire in this order: filesystem, slack, gmail, calendar, hubspot, github, stripe, notion, gong, ahrefs. The first four cover 80% of daily-driver use. The next three add operating context. The last three are situational — wire them only when a real workflow demands it. One source of truth per category. No duplicates.

---

## Summary

**10 connectors covered:**
1. Filesystem
2. Slack
3. Gmail
4. HubSpot
5. Stripe
6. GitHub
7. Google Calendar
8. Notion
9. Gong
10. Ahrefs

**Word count:** ~2,150 words (within 2000-3000 target).

**Read-only (7):** Gmail, Stripe, Google Calendar, Notion, Gong, Ahrefs — plus HubSpot writes are scoped to notes/tasks only (effective read-only for stage/amount). Stripe enforced via `rk_live_*` restricted key.

**Read-write (4):** Filesystem (full r/w on scoped paths), Slack (writes via confirmation hook), HubSpot (writes whitelisted to notes/tasks), GitHub (writes via fine-grained PAT, branch-protected main).

**Tier breakdown:**
- **S (load-bearing):** Filesystem, Slack, GitHub
- **A (high-value):** Gmail, HubSpot, Stripe, Google Calendar, Notion
- **B (situational):** Gong, Ahrefs
