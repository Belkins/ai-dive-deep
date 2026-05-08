# Security

This is a private repository for an internal field manual. If you have access,
please follow the rules below.

## Reporting a vulnerability

If you find a security issue (exposed token, leaked secret, vulnerability in
dependencies that affects shipped output), do not open an issue. Email Vlad at
vladislav@belkins.io directly.

## What's in this repo

- 36 chapters of prose (MDX)
- 14 React widgets
- 12 Astro components
- A static-site build pipeline (Astro → static HTML)
- No backend, no API keys, no customer data, no PII
- Newsletter integration is a public Substack iframe in the footer

## What is **not** in this repo (and never should be)

- API keys, OAuth tokens, customer data
- `.env` files, secrets manager exports, AWS/GCP credentials
- Vault content (Obsidian markdown with mentee names, deal names, customer info)
- Real screenshots showing channel IDs, contact lists, or workspace content

If you commit any of the above accidentally:
1. **Do not push.** Run `git reset HEAD~1` or `git rm --cached <file>`.
2. If already pushed, rotate the leaked secret immediately, then run
   `git filter-repo` to remove from history (and force-push).
3. Email Vlad.

## Hardening applied (2026-05-08)

- Repo visibility: **private**
- Issues, Wiki, Projects, Discussions: disabled (reduced attack surface)
- `.gitignore` covers `.env*`, `*.pem`, `*.key`, `secrets/`, `.aws/`, `.kube/`, etc.
- Vercel deploy headers: `X-Content-Type-Options`, `X-Frame-Options: DENY`,
  `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`
- No runtime backend → zero attack surface for SSRF, injection, auth bypass
- Static output is read-only; widgets persist state in `localStorage` only

## Dependency management

- Run `npm audit` before each major release. Moderate-severity issues in
  dev-only deps (e.g., `@astrojs/check` → `volar-service-yaml`) are
  acceptable as they don't ship to runtime.
- Pin `node` to `>= 20` in `package.json`.
- Re-run `python3 scripts/build-setup-data.py` only on a trusted machine —
  it reads from `~/.claude/`.

## Operational rules

- Never `git push --force` to `main`.
- Never commit from a session where any external agent has read access to
  this repo path.
- Verify visibility every time you `gh repo edit` — flipping public ↔ private
  is one keystroke and does not warn beyond the CLI prompt.
- Review `notes/edition-2/` content periodically; if going public again,
  consider moving to a private fork.
