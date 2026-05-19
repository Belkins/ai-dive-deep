# Security

This repository is **public** (flipped 2026-05-20). The repo is the source for
the public site at https://dive.vladyslavpodoliako.com — a static field manual,
no backend, no API keys, no customer data.

## Reporting a vulnerability

If you find a security issue (exposed token, leaked secret, dependency CVE that
affects shipped output, or an XSS/injection in any of the interactive widgets):

- **Preferred:** GitHub's [private vulnerability reporting](https://github.com/Belkins/ai-dive-deep/security/advisories/new).
- **Or:** email Vlad at `vladislav@belkins.io` directly.

Please do **not** open a public Issue with exploit details before disclosure.

## What's in this repo

- 39 chapters (MDX prose) · 25 React/Astro widgets · 25 standalone pages
- A static-site build pipeline (Astro → static HTML, deployed to GitHub Pages)
- Three embedded interactive HTML artifacts under `public/artifacts/` (AFC pitch,
  AFC robot stable, sanitized client deliverability-audit sample)
- No backend, no runtime API, no auth, no customer data, no PII

## What is **not** in this repo (by policy)

- API keys, OAuth tokens, customer data, PII
- `.env` files, secrets exports, cloud credentials
- Real third-party identities (mentees, colleagues, clients, partners). The
  Folderly artifact embedded under `public/artifacts/deliverability-audit-sample.html`
  is a **sanitized** sample: client name, all sending domains, infra
  fingerprints, and WHOIS personal data were deterministically replaced with
  placeholders before publication (see commit `a453ef0`)
- Vault content (Obsidian notes with identifiable third-party info)

## History rewrite (2026-05-20)

Before flipping public, the entire git history was rewritten with
`git filter-repo` to scrub pre-scrub residue (real names, internal ticket IDs,
internal channel names) from all 71 commits, both file contents AND commit
messages. Independent fresh-clone verification confirmed **0 blob leaks and 0
commit-message leaks** across the full history before the visibility flip.

A pre-scrub backup ref is preserved server-side at
`refs/backup/pre-scrub-2026-05-20` for 90 days for verification by anyone with
prior clone access (none, since the repo was private until the scrub).

## Hardening

- Repo visibility: **public** (intentional — this is a published field manual)
- Issues + Discussions: enabled (engagement surface)
- `.gitignore` covers `.env*`, `*.pem`, `*.key`, `secrets/`, `.aws/`, `.kube/`,
  plus `notes/` and `_TODO/` (local-only working dirs)
- Embedded artifacts: sandboxed `<iframe sandbox="allow-scripts">` with
  `referrerpolicy="no-referrer"`, lazy `src` (set only on user click); the
  artifacts themselves are fully self-contained (zero external scripts or
  trackers — verified)
- Deploy headers via GitHub Pages defaults
- Prebuild lint catches escaped-backtick template-literal delimiters
  (`scripts/check-template-literals.sh`)
- No runtime backend → no SSRF, no injection, no auth bypass surface
- Static output is read-only; widgets persist state in `localStorage` only

## Dependency management

- `npm audit` before each major edition; moderate-severity issues in dev-only
  deps are documented and accepted if they don't ship to runtime
- Node pinned to `>= 20`
- `scripts/build-setup-data.py` reads from `~/.claude/` and is run only on a
  trusted machine; the script and its output are intentionally public, the
  source it reads is not

## Operational rules

- Never `git push --force` to `main` without a `refs/backup/` ref pushed first
- Verify visibility via `gh repo view --json visibility` whenever editing repo
  settings (the CLI does not warn on visibility flip beyond the prompt)
- Sanitization for any future case-study artifact follows the
  map → script → `dist/`-grep-gate pipeline used for the 2026-05-19 Folderly
  case (see project memory)
