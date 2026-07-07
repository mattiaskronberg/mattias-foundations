# Consumption Contract: how a platform repo consumes Foundations

This is the interface Mattias-Foundations exposes to the three platform repositories.
It is a **process + artifact** contract (there is no runtime API — the artifact is a file).

## The published artifact

- Exactly one canonical artifact per release: **`tokens.json`** (DTCG,
  `contracts/tokens.schema.json`).
- Published on a **GitHub Release** tagged `vX.Y.Z` (semver), attached as a release asset.
- Stable, versioned fetch URL:
  `https://github.com/<org>/Mattias-Foundations/releases/download/vX.Y.Z/tokens.json`
- `exceptions.json` is versioned in-repo alongside the tokens and travels with the tag.
- **No** npm / SPM / Maven packages are published (Constitution V).

## What a platform MUST do (FR-004 / FR-004a / FR-005)

1. **Pin** a specific Foundations version `vX.Y.Z`. Upgrades are deliberate commits, never
   floating.
2. **Fetch** that version's `tokens.json` via the stable release URL.
3. **Validate** the fetched artifact against `tokens.schema.json` before use.
4. **Generate** its own platform-idiomatic representation locally (TypeScript constants for
   React, Swift values/types for SwiftUI, Kotlin objects for Compose). Mechanism
   (build-time codegen, runtime parse, checked-in generated files) is the platform's choice.
5. **Select** the active `(theme, brand)` at runtime or build time.
6. **Never hardcode** a foundational value that exists in Foundations (Constitution I; SC-001).

## No-Silent-Drift guarantees the consumer can rely on (FR-002 / Constitution IV)

- The artifact validates against a versioned schema (`meta.schemaVersion`).
- A renamed/removed token surfaces as a **detectable** change: it fails the producer's
  `drift-check.mjs` at release time, and (recommended) the consumer runs a contract check
  that fails the build if a referenced token key is absent in the pinned artifact — rather
  than rendering a silent default.
- Adding a new token, theme, or brand is a **non-breaking** change; consumers see no
  behavior change until they upgrade and reference it.

## Versioning (Constitution VII)

- Foundations versions independently; a platform's release names the Foundations version it
  built against so any consumer can determine it in under a minute (SC-008).
- No lockstep: a Foundations release never forces a synchronized platform release.

## Alternate fetch mechanisms (documented fallbacks)

- Versioned CDN URL, or reading `tokens.json` directly from the git tag, are acceptable
  fallbacks where GitHub Releases is unavailable — provided the reference is immutable per
  version. GitHub Releases is the primary, recommended mechanism.
