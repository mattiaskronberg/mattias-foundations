# Recap

Mattias-Foundations is the single source of truth for the Mattias Design System — a
versioned, DTCG-conformant `tokens.json` (primitives + semantic tokens resolving per
theme × brand) plus a governed `exceptions.json` registry, distributed via GitHub
Releases with no platform code in-repo. Foundations v1 is implemented: schemas,
`tokens.json`, `validate.mjs`/`drift-check.mjs`, docs, and CI, with 15/15 tests passing,
a local `v0.1.0` tag, and a Stop hook that keeps this file fresh. Most recently we
scoped the final step (T023): the user will create an empty **public** GitHub repo named
`Mattias-Foundations`, then push `main` + the `v0.1.0` tag to trigger `release.yml` and
publish the `tokens.json` asset. Still pending: the repo/remote does not exist yet, and
`CLAUDE.md`, `tasks.md`, `.claude/settings.json`, and `Recap.md` remain uncommitted.
