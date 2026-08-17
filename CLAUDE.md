
## Working agreement

Most code here is written by AI and reviewed by humans. Optimise every change for reviewability.

- **Never commit to the main branch.** Branch first: `<type>/<issue>-<short-description>`, e.g.
  `feat/31-leads-import`; omit the number only for work that never becomes a pull request.
- **The PR title is the commit message** — squash-merge. A
  [Conventional Commit](https://www.conventionalcommits.org) subject, the body as the commit body,
  and `Closes #n` to record the issue.
- **Commit freely on the branch.** They are squashed away; do not curate them.
- **One concern per PR.** Split unrelated work rather than growing a branch.
- **No drive-by changes.** Reformatting or renaming outside the stated scope makes review harder —
  a small fix a review finding asked for is not one.
- **State what you verified** in the pull request; never claim a check passed without running it.
- **Flag uncertainty.** A guess about existing behaviour is labelled as one.

## Issues, the board and reviews

Work is filed from [.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/) and tracked on a GitHub
Project. The rules are in [docs/workflow/](docs/workflow/); the configuration every command reads
is [.claude/workflow-kit.json](.claude/workflow-kit.json).

- **One issue is one pull request is one concern.** Anything larger is a parent with sub-issues.
- **The kind of work is the native issue type** — `Task`, `Bug`, `Feature` — never a `type/*`
  label; there are none.
- **Run `.github/scripts/board.sh show <n>` alongside `gh issue view`, never one without the
  other.** Status, priority and the blocking graph are on the board, which `gh issue view` does
  not read.
- **A change to the shared contracts package is its own issue that merges first.**
- **Update a branch by rebasing, never by merging the main branch in.** Force-push only with
  `--force-with-lease`.
- **The review fleet runs before the pull request is opened** — `/review`, or step 6 of `/pick`.
  No agent blocks anything; CI is the only gate. What binds is that every finding is fixed, or
  dismissed with a stated reason, in "Reviewer notes".
- **`risk/high` — auth, tenant isolation, money, data migrations — is designed by a human before
  an agent writes it**, and gets a security review before merge.
