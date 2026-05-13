# 5 NEW hook scripts for /resources

The existing four hook snippets in `resources.astro` (format-on-save, test-on-write, block-push-to-main, slack-notify-long-task) handle inline JSON-only patterns. These five add real shell scripts that live in `~/.claude/hooks/`, are wired in via `~/.claude/settings.json`, and cover the failure modes I keep paying for in cash, time, or embarrassment.

All scripts use Claude Code's exit-code convention: `0` = pass through, `2` = block the tool call. Anything that wants to warn-but-not-block writes to `stderr` and exits `0`. Each script states its failure mode in the header comment — so future-you knows when the hook lies.

---

### secrets-scan
Greps file content for live keys before any Write/Edit lands on disk. PreToolUse on Write|Edit.

**Why it exists:** Caught an Anthropic key in a SKILL.md a subagent helpfully "moved into the example" two weeks ago. GitHub Push Protection flagged it on commit, but only after it had sat in three reflog entries and one Claude turn transcript. A pre-write hook would have stopped it at the source — five seconds of grep is cheaper than rotating a key across four projects.

**Script (`~/.claude/hooks/secrets-scan.sh`):**
```bash
#!/usr/bin/env bash
# secrets-scan: block writes containing live API keys
# PreToolUse on Write|Edit — fires before the file lands on disk
#
# Failure mode: only scans the new content payload from $CLAUDE_TOOL_INPUT.
# If Claude passes content via stdin instead, this hook sees nothing and
# silently allows. Verify with the test command below after any harness update.

set -euo pipefail

payload="${CLAUDE_TOOL_INPUT:-}"
[ -z "$payload" ] && exit 0

# Real-money patterns. Order: most specific first so error message is useful.
patterns=(
  'sk-ant-api03-[A-Za-z0-9_-]{20,}'      # Anthropic
  'sk-proj-[A-Za-z0-9_-]{20,}'           # OpenAI project
  'sk-[A-Za-z0-9]{32,}'                  # OpenAI legacy / generic
  'rk_live_[A-Za-z0-9]{20,}'             # Stripe restricted live
  'sk_live_[A-Za-z0-9]{20,}'             # Stripe secret live
  'AKIA[0-9A-Z]{16}'                     # AWS access key
  'ghp_[A-Za-z0-9]{36}'                  # GitHub PAT
  '(password|passwd|secret)[[:space:]]*=[[:space:]]*["'"'"'][^"'"'"']{8,}'
)

for p in "${patterns[@]}"; do
  if echo "$payload" | grep -Eq "$p"; then
    echo "secrets-scan: blocked write — matched pattern /$p/" >&2
    echo "secrets-scan: move the value to .env.local + add to .gitignore" >&2
    exit 2
  fi
done

exit 0
```

**Wire it up (`~/.claude/settings.json`):**
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/secrets-scan.sh" }] }
    ]
  }
}
```

**Test it:** `CLAUDE_TOOL_INPUT='ANTHROPIC_API_KEY=sk-ant-api03-abc123def456ghi789jklmnop' bash ~/.claude/hooks/secrets-scan.sh; echo "exit=$?"` — should print the block message and `exit=2`.

---

### claude-md-size-guard
Warns at session start when the project CLAUDE.md is bloated. SessionStart hook.

**Why it exists:** A 340-line CLAUDE.md in one project doubled my Claude token bill in a week before I caught it — the file is read on every turn, so every extra 100 lines compounds across thousands of turns. The Anthropic docs say "keep CLAUDE.md under ~100 lines." Chapter 37 (context files) sells the discipline; this hook enforces it. Warn-only, not block — sometimes you genuinely need 250 lines.

**Script (`~/.claude/hooks/claude-md-size-guard.sh`):**
```bash
#!/usr/bin/env bash
# claude-md-size-guard: warn when project CLAUDE.md exceeds 300 lines
# SessionStart — fires once when a new Claude Code session begins
#
# Failure mode: $CLAUDE_PROJECT_DIR is sometimes unset in headless/cron
# invocations. Falls back to PWD. If neither has a CLAUDE.md, hook is a no-op.

set -euo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"
claude_md="$project_dir/CLAUDE.md"

[ -f "$claude_md" ] || exit 0

lines=$(wc -l < "$claude_md" | tr -d ' ')
bytes=$(wc -c < "$claude_md" | tr -d ' ')

if [ "$lines" -gt 300 ]; then
  echo "claude-md-size-guard: CLAUDE.md is $lines lines / $bytes bytes" >&2
  echo "claude-md-size-guard: target <100 lines. Move detail into docs/ and link from CLAUDE.md." >&2
  echo "claude-md-size-guard: every extra 100 lines x every turn = real money." >&2
fi

exit 0
```

**Wire it up (`~/.claude/settings.json`):**
```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/claude-md-size-guard.sh" }] }
    ]
  }
}
```

**Test it:** `CLAUDE_PROJECT_DIR=/path/to/bloated/project bash ~/.claude/hooks/claude-md-size-guard.sh 2>&1` — should print line/byte count and the nudge if over threshold, silent otherwise.

---

### prompt-cache-guard
Warns before edits to CLAUDE.md, MEMORY.md, or any skill SKILL.md — these invalidate the prompt cache. UserPromptSubmit hook.

**Why it exists:** Prompt caching keys on the exact bytes of your context-file payload. Edit one line of CLAUDE.md and the 5-minute cache TTL resets across every active conversation, every scheduled task, every subagent. On a bad day I've burned 3-5x the expected cost because I "just tweaked a memory entry" mid-flight. This hook catches the obvious cases — user typing `edit CLAUDE.md` or `update MEMORY.md` — and reminds me to batch edits into one window instead of three.

**Script (`~/.claude/hooks/prompt-cache-guard.sh`):**
```bash
#!/usr/bin/env bash
# prompt-cache-guard: warn before edits to cache-sensitive files
# UserPromptSubmit — fires when user submits a message
#
# Failure mode: heuristic match on the prompt text, not the actual file path
# (the file isn't selected yet at UserPromptSubmit time). False positives
# possible (e.g., user says "don't edit CLAUDE.md"); warn-only, never block.

set -euo pipefail

prompt="${CLAUDE_USER_PROMPT:-}"
[ -z "$prompt" ] && exit 0

# Lowercase for case-insensitive match.
lower=$(echo "$prompt" | tr '[:upper:]' '[:lower:]')

trigger=""
if echo "$lower" | grep -Eq '(edit|update|modify|change|rewrite)[^.]{0,40}(claude\.md|memory\.md|skill\.md)'; then
  trigger="cache-sensitive file edit"
fi
if echo "$lower" | grep -Eq '\.claude/(settings|hooks|skills)'; then
  trigger="${trigger:-harness config edit}"
fi

if [ -n "$trigger" ]; then
  echo "prompt-cache-guard: detected $trigger" >&2
  echo "prompt-cache-guard: this invalidates the prompt cache for ~5 min across every active session." >&2
  echo "prompt-cache-guard: batch related edits into one window instead of three." >&2
fi

exit 0
```

**Wire it up (`~/.claude/settings.json`):**
```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/prompt-cache-guard.sh" }] }
    ]
  }
}
```

**Test it:** `CLAUDE_USER_PROMPT='edit CLAUDE.md to add a new memory' bash ~/.claude/hooks/prompt-cache-guard.sh 2>&1` — should print three stderr lines and exit 0.

---

### agent-watchdog-stall-detect
Logs every subagent launch with a timestamp so a separate cron task can surface stalls. SessionStart hook (and PreToolUse on Task).

**Why it exists:** Subagents reliably stall around the 600-second wall-clock mark — they die right before writing the deliverable, and from the parent session it looks like "the agent is still working." I've shipped half-finished refactors twice because I trusted a dead subagent. The fix isn't smarter agents — it's an out-of-band log that an external watcher (`/health-pulse` cron, BetterStack uptime check, whatever) reads. The hook just appends a line; the dashboard does the alerting.

**Script (`~/.claude/hooks/agent-watchdog-stall-detect.sh`):**
```bash
#!/usr/bin/env bash
# agent-watchdog-stall-detect: log subagent launches for external stall detection
# PreToolUse on Task — fires every time the parent spawns a subagent
#
# Failure mode: log file lives in ~/.claude/health/. If that dir is missing
# or read-only, hook silently fails (no block — never break the parent agent
# because logging is broken). Verify dir exists weekly.

set -euo pipefail

log_dir="$HOME/.claude/health"
log_file="$log_dir/subagent-launches.jsonl"

mkdir -p "$log_dir" || exit 0
[ -w "$log_dir" ] || exit 0

# Compact JSONL row. External cron task reads this + flags rows with no
# matching "done" event within 600s.
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
session="${CLAUDE_SESSION_ID:-unknown}"
project="${CLAUDE_PROJECT_DIR:-$PWD}"
# Best-effort: extract subagent description from tool input (first 80 chars).
desc=$(echo "${CLAUDE_TOOL_INPUT:-}" | tr -d '\n' | cut -c1-80 | sed 's/"/\\"/g')

printf '{"ts":"%s","session":"%s","project":"%s","desc":"%s"}\n' \
  "$ts" "$session" "$project" "$desc" >> "$log_file"

exit 0
```

**Wire it up (`~/.claude/settings.json`):**
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Task", "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/agent-watchdog-stall-detect.sh" }] }
    ]
  }
}
```

**Test it:** `CLAUDE_TOOL_INPUT='spawn the audit agent on src/' CLAUDE_SESSION_ID=test123 bash ~/.claude/hooks/agent-watchdog-stall-detect.sh && tail -1 ~/.claude/health/subagent-launches.jsonl` — should print one JSON row with current timestamp.

---

### commit-msg-enforcer
Checks the last git commit message against conventional-commits format when a Claude session ends. Stop hook.

**Why it exists:** Half my "chore: fix" commits come from sessions where I forgot to specify a message and Claude defaulted to something useless. Three months later when I'm hunting a regression with `git log --oneline`, I get a wall of "chore: update files" entries and no signal. Conventional commits aren't a religion — but `type(scope): summary` makes git log a usable index. Stop hook so it fires after the session writes the commit, not before. Warn-only because force-blocking a Stop is rude.

**Script (`~/.claude/hooks/commit-msg-enforcer.sh`):**
```bash
#!/usr/bin/env bash
# commit-msg-enforcer: nag if the last commit doesn't match conventional-commits
# Stop — fires when the Claude Code session ends
#
# Failure mode: only inspects HEAD. If the session made multiple commits and
# only the last one is malformed, we still catch it; if all are malformed,
# we still only flag one. Acceptable — the goal is a nudge, not a gate.
# Silent when the working dir isn't a git repo.

set -euo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"
cd "$project_dir" 2>/dev/null || exit 0

git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Last commit message, subject line only.
subject=$(git log -1 --pretty=%s 2>/dev/null || echo "")
[ -z "$subject" ] && exit 0

# Skip if HEAD wasn't touched in the last 10 min — likely not this session.
last_commit_age=$(( $(date +%s) - $(git log -1 --pretty=%ct) ))
[ "$last_commit_age" -gt 600 ] && exit 0

# Conventional commits regex: type(optional-scope)!?: summary
pattern='^(feat|fix|chore|docs|refactor|test|perf|build|ci|style|revert)(\([a-z0-9_/-]+\))?!?: .{3,}'

if ! echo "$subject" | grep -Eq "$pattern"; then
  echo "commit-msg-enforcer: last commit subject doesn't match conventional-commits:" >&2
  echo "  $subject" >&2
  echo "  expected: type(scope): summary  e.g. 'fix(auth): handle expired refresh token'" >&2
  echo "  amend with: git commit --amend -m 'fix(scope): real summary'" >&2
fi

exit 0
```

**Wire it up (`~/.claude/settings.json`):**
```json
{
  "hooks": {
    "Stop": [
      { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/commit-msg-enforcer.sh" }] }
    ]
  }
}
```

**Test it:** From any repo, `git commit --allow-empty -m "fixed stuff" && bash ~/.claude/hooks/commit-msg-enforcer.sh 2>&1` — should print the four nag lines. Then `git commit --amend -m "fix(test): real message"` and re-run — silent.

---

## Wiring all five at once

Merge into your existing `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/claude-md-size-guard.sh" }] }
    ],
    "UserPromptSubmit": [
      { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/prompt-cache-guard.sh" }] }
    ],
    "PreToolUse": [
      { "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/secrets-scan.sh" }] },
      { "matcher": "Task", "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/agent-watchdog-stall-detect.sh" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "/Users/vlad/.claude/hooks/commit-msg-enforcer.sh" }] }
    ]
  }
}
```

Then `chmod +x ~/.claude/hooks/*.sh` and restart Claude Code. Watch stderr for the first few sessions — that's where every warn-only hook prints. If a hook starts crying wolf, tighten the regex or move it to a project-scoped `.claude/settings.json` instead of global.
