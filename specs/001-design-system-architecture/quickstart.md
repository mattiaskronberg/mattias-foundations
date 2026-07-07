# Quickstart / Validation Guide: Foundations v1

Runnable scenarios that prove User Story 1 ("single source of truth for design
foundations") works end-to-end. Details live in [data-model.md](./data-model.md),
[contracts/](./contracts/), and [plan.md](./plan.md) — this file is the run guide.

## Prerequisites

- Node.js ≥ 18 (already present — matches the figma-cli toolchain).
- The Mattias-Foundations repo scaffolded per `plan.md` "Source Code" layout.
- `figma-cli` connected to Figma Desktop (`figma-cli connect`) with the shared Figma
  library open, for the authoring scenario.
- Dev deps in Foundations: `ajv`, `ajv-formats`.

## Scenario 1 — Author in Figma → extract → validate (authoring round-trip, R3)

1. In the shared Figma library, define/adjust a variable (e.g. `color.action.primary`).
2. Extract to the artifact:
   ```bash
   figma-cli extract --sections variables --save tokens.json
   ```
3. Validate the artifact against the schema:
   ```bash
   node scripts/validate.mjs
   ```
**Expected**: `tokens.json` validates against `schemas/tokens.schema.json`; the changed
value is present. The committed JSON — not Figma — is now the source of truth.

## Scenario 2 — Single token change propagates (Acceptance Scenario 1, SC-002)

1. Change one primitive value referenced by a semantic token in `tokens.json`.
2. Run validation + drift check:
   ```bash
   node scripts/validate.mjs && node scripts/drift-check.mjs
   ```
3. Cut a release (tag + asset) — see Scenario 4.
**Expected**: the published `tokens.json` reflects the new value under a stable version id;
no manual re-translation is needed for a consumer to read it.

## Scenario 3 — No Silent Drift is enforced (Acceptance Scenario 3, Constitution IV)

1. Rename or delete a token key that existed in the previous release.
2. Run:
   ```bash
   node scripts/drift-check.mjs
   ```
**Expected**: **non-zero exit** — the rename/removal is reported as a detectable failure
(not a silent fallback) unless an explicit migration note accompanies it. Also verify that a
semantic token missing a `(theme, brand)` resolution, or an alias pointing at a
non-existent primitive, fails the same check.

## Scenario 4 — Publish exactly one artifact per release (Constitution V, FR-003)

1. Tag a semver release:
   ```bash
   git tag v0.1.0 && git push origin v0.1.0
   ```
2. CI (`.github/workflows/release.yml`) attaches `tokens.json` as the release asset.
**Expected**: the release page carries exactly one canonical `tokens.json` at
`releases/download/v0.1.0/tokens.json`; no npm/SPM/Maven package is produced.

## Scenario 5 — Empty exception registry validates (Constitution III, FR-009)

1. Confirm `exceptions.json` is `[]`.
2. Validate:
   ```bash
   node scripts/validate.mjs
   ```
3. Add one sample entry (e.g. the iOS Liquid Glass `TabBar`) and re-validate.
**Expected**: empty array validates; a well-formed entry (component, platforms, type,
rationale, acceptedDate) validates; a malformed entry (missing rationale / bad date / unknown
platform) fails.

## Scenario 6 — Consumer pins and reads a version (consumption-contract.md)

1. From a mock consumer, fetch the pinned release asset URL for `v0.1.0`.
2. Validate the fetched file against `tokens.schema.json`.
3. Resolve `color.action.primary` for `(light, Mattias)`.
**Expected**: the pinned version is reproducibly fetchable and resolves to the expected
primitive; upgrading the pin to a later version surfaces the new value with no manual
re-translation.

## Done when

- [ ] Scenarios 1–6 pass.
- [ ] `validate.mjs` and `drift-check.mjs` are wired into CI (`validate.yml`).
- [ ] A `v0.1.0` release exists with a single `tokens.json` asset.
- [ ] `exceptions.json` ships as `[]`; the Figma naming convention and platform-onboarding
      process docs exist.
