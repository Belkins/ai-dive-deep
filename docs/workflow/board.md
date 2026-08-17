# Issues and the board

How work is filed, typed, prioritised and scheduled.

Work is tracked on a GitHub Project; which one is `board` in
[.claude/workflow-kit.json](../../.claude/workflow-kit.json). Issues are filed from the forms in
[.github/ISSUE_TEMPLATE/](../../.github/ISSUE_TEMPLATE/), and blank issues are off.

## Rules

- **One issue is one pull request is one concern.** Anything larger is a parent issue with
  sub-issues, each of which is a single pull request.
- **One pull request means `Task`**, however new the behaviour is. A `Feature` that closes with
  one pull request has stopped carrying information.
- **Split contract-first.** A change to the shared contracts package is its own issue that merges
  before the issues that depend on it.
- **Ration branch age, not branch count.** A queue conflicts with itself because its branches are
  old, not because they are many.
- **`risk/high` — auth, tenant isolation, money, data migrations — is designed by a human before
  an agent writes it**, and gets a security review before merge.
- **A diff is on that list if it *decides* one of those four, not only if it executes one** — a
  shape, once published, is what every handler is then written to.
- **Run `board.sh show <n>` alongside `gh issue view`, never one without the other.**

## The three issue types

There are no `type/*` labels; the native type is read over the API, which every `gh` supports:
`gh api repos/<repo>/issues/<n> --jq .type.name`.

| Type | Is |
| --- | --- |
| `Task` | one pull request — nearly everything, documentation included |
| `Bug` | a defect in code we wrote |
| `Feature` | a container of `Task` sub-issues, never implemented directly |

Used properly the split lands on vertical slices:

```
Feature  Leads: list with filters
  └ Task  contracts: filter schema for the leads list   ← merges first
  └ Task  api: list endpoint honouring the filters      ← then these two,
  └ Task  web: list UI and filter controls                in parallel
```

`board.sh ready` looks past the `Feature` and lists only the children that can be started.

## Statuses

| Status | Means |
| --- | --- |
| `Inbox` | an idea; no specification yet |
| `Refining` | the specification is being written or is under question |
| `Ready` | passes the Definition of Ready — it can be started |
| `In progress` | a branch exists |
| `In review` | a pull request is open |
| `Blocked` | waiting on a decision or another issue |
| `Done` | merged |

The names come from `board.statuses` in the configuration. Renaming one there renames it
everywhere the kit reads it; renaming it only on the board breaks `board.sh ready`.

## Definition of Ready

An agent with no memory of any conversation can read the issue and open a mergeable pull request
without asking a question. Concretely: entry points name real paths and an explicit "must not
touch" list; scope names what is *out*; every acceptance criterion is checkable by someone who did
not write the code; the contract-change answer is correct; open questions is `none`. A task
failing any of these goes back to `Refining`.

## Where a fact lives

| Place | Holds | Why there |
| --- | --- | --- |
| On the issue | native type, `area/*` and `risk/*` labels | travels with the issue everywhere; `area/*` is a label because one task can touch two areas and GitHub's fields are single-valued |
| On the board | `Status`, `Priority`, `Iteration` | scheduling state, reorderable without editing issues |
| Between issues | blocking relationships, parent/sub-issue | GitHub issue dependencies |

| Command | Lists |
| --- | --- |
| `board.sh ready` | this repository's tasks that are `Ready` *and* have no open blocker |
| `board.sh ready --all` | the same across every repository sharing the board, prefixed `owner/repo#n` |
| `board.sh queue` | this repository's items, grouped by status (`--all` for the whole board) |
| `board.sh show <n>` | one issue's fields, what blocks it, and what it blocks |

## Setup

`/task` drafts and files an issue, `/pick` takes one to an open pull request. Both need the
`project` OAuth scope once per machine, and the labels to exist:

```sh
gh auth refresh -s project
.github/scripts/sync-labels.sh
```

Where a repository's plan does not have issue dependencies, `board.sh` reports every `Ready` item
as unblocked rather than failing — the blocking graph is then whatever the issue bodies say.
