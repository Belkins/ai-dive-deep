
## Working agreement

Most code here is written by AI and reviewed by humans. Optimise every change for reviewability and zero wasted CI quota.

- **Run verification locally and push directly to `main`.** Do not open pull requests just to run GitHub Actions CI. Before pushing to `main`, run `npm run check`, `node --test tests/*.test.mjs`, and `npm run build` locally. Only use a feature branch (`<type>/<issue>-<short-description>`) when explicitly running `/pick` or when a preview branch is requested.
- **Run those checks on the Node major the workflows pin** (`node-version` in `.github/workflows/deploy.yml`). When your local Node differs, run them through `npx -y -p node@<major> -c "npm run check && node --test tests/*.test.mjs && npm run build"`, because on 10 Nov 2026 they passed on a newer local Node and the deploy failed on the workflow's Node.
- **Use Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`) and include `Closes #n` when resolving a tracked GitHub issue.
- **One concern per commit.** Split unrelated work rather than bundling unrelated changes.
- **No drive-by changes.** Reformatting or renaming outside the stated scope makes review harder —
  a small fix a review finding asked for is not one.
- **State what you verified** in your report; never claim a check passed without running it locally.
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
