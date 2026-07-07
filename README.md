# Mattias-Foundations

The **single source of truth** for the Mattias Design System's foundational values.
Foundations publishes exactly one canonical artifact per release — a versioned,
DTCG/W3C-conformant [`tokens.json`](./tokens.json) — plus a governed exception registry.
No platform code lives here; the three platform repos (React/web, SwiftUI/iOS,
Jetpack Compose/Android) consume this artifact and generate their own idiomatic code
(Constitution V).

## What's in here

| Path | Purpose |
|------|---------|
| `tokens.json` | Canonical artifact — DTCG primitives (un-themed) + semantic tokens carrying `theme × brand` resolution. |
| `exceptions.json` | Engineering-side registry of governed platform deviations (ships as `[]`). |
| `schemas/` | Versioned JSON Schemas (Draft 2020-12) for both artifacts. |
| `scripts/validate.mjs` | ajv validation of both artifacts against their schemas. |
| `scripts/drift-check.mjs` | No-Silent-Drift: total `(theme, brand)` resolution + release-diff of removed/renamed keys. |
| `tests/` | Schema + contract tests, run via `node --test`. |
| `docs/` | Figma authoring, consumption contract, naming convention, platform onboarding. |
| `.github/workflows/` | `validate.yml` (PR gate) and `release.yml` (tag → single asset). |

## Token model

Two tiers (see [`docs/`](./docs) and `specs/001-design-system-architecture/data-model.md`):

- **primitives** — raw, un-themed values (`{ "$value": "#2563EB", "$type": "color" }`).
- **semantic** — purpose-named tokens that resolve to a primitive **alias** per
  `(theme, brand)`. v1 requires `light` + `dark` themes and the `Mattias` brand;
  additional themes/brands are non-breaking additions.

```json
"color": { "action": { "primary": {
  "$type": "color",
  "$value": {
    "light": { "Mattias": "{primitives.color.blue.600}" },
    "dark":  { "Mattias": "{primitives.color.blue.400}" }
  }
}}}
```

## Validate locally

```bash
npm install                 # ajv + ajv-formats
node scripts/validate.mjs   # both artifacts vs their schemas
node scripts/drift-check.mjs
node --test                 # schema + contract tests
# or all three at once:
npm run check
```

## Authoring (Figma → JSON)

Designers author variables in the shared Figma library; extract with `figma-cli`; the
committed JSON — not Figma — is authoritative. See
[`docs/figma-workflow.md`](./docs/figma-workflow.md).

## Cut a release

Foundations is distributed via **GitHub Releases** only (no npm/SPM/Maven).

```bash
git tag v0.1.0
git push origin v0.1.0
```

The `release.yml` workflow re-validates and attaches `tokens.json` as the **single**
release asset at `releases/download/v0.1.0/tokens.json`. Consumers pin a version and
fetch that URL — see [`docs/consumption.md`](./docs/consumption.md).

## Governance

- **No Silent Drift** (Constitution IV): renamed/removed tokens fail `drift-check.mjs`
  unless an explicit entry in `migrations.json` accompanies them.
- **Parity by default, exceptions by governance** (Constitution III): platform
  deviations require an `exceptions.json` entry before they merge — see
  [`docs/platform-onboarding.md`](./docs/platform-onboarding.md).
- **Independent versioning** (Constitution VII): Foundations versions on its own semver
  tags; platforms pin a version; no lockstep.
