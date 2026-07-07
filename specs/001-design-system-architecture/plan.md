# Implementation Plan: Multi-Platform Design System Architecture (Foundations v1)

**Branch**: `001-design-system-architecture` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-design-system-architecture/spec.md`

## Summary

v1 delivers **Mattias-Foundations** and the architectural/process scaffolding for the
three platform repositories — not component implementations (spec FR-015 / FR-015a; only
User Story 1 is in scope). Foundations publishes exactly one canonical artifact per
release: a versioned, DTCG/W3C-conformant `tokens.json` expressing a two-tier token model
(brand/theme-agnostic **primitives** + **semantic** tokens carrying `theme × brand`
dimensions), validated by a versioned JSON Schema. Tokens are authored as variables in the
shared Figma library and extracted to `tokens.json` via `figma-cli`; once committed, the
JSON — not Figma — is the single source of truth. The artifact is distributed via **GitHub
Releases** (semver tag + `tokens.json` release asset); no npm/SPM/Maven wrapper packages
are produced. A versioned, schema-validated **exception registry** (`exceptions.json`,
initially empty) lives alongside the tokens. The Figma library is set up with the design-
team-owned prefix/suffix naming convention, and the process for platforms to later add
components/exceptions is documented.

## Technical Context

**Language/Version**: JSON + JSON Schema (Draft 2020-12) as the deliverables; Node.js ≥ 18
for the validation/CI tooling only (matches the figma-cli toolchain already installed).

**Primary Dependencies**: DTCG / W3C Design Tokens format; `ajv` (+ `ajv-formats`) for
schema validation; `figma-cli` (silships/figma-cli) for Figma ⇄ JSON round-trip
(`figma-cli extract` / `figma-cli import`). No platform-language SDKs in this repo.

**Storage**: Flat files in the Mattias-Foundations git repo — `tokens.json`,
`exceptions.json`, and their `schemas/`. GitHub Releases stores the published artifact.

**Testing**: Schema-validation tests (`tokens.json` and `exceptions.json` each validate
against their schema) + contract tests that enforce No-Silent-Drift rules (every semantic
token resolves for every declared `(theme, brand)`; every alias target exists; a
removed/renamed token vs the previous release surfaces as a detectable diff). Runner:
`node --test` (consistent with figma-cli).

**Target Platform**: Platform-agnostic artifact. Consumers are React (DOM), SwiftUI (iOS),
Jetpack Compose (Android) repos — out of scope for v1 beyond the documented consumption
contract.

**Project Type**: Design-tokens / data-artifact repository (schema-validated JSON), not an
application. Single-repo layout for Mattias-Foundations.

**Performance Goals**: N/A (build-time artifact). Schema validation + drift check complete
in CI in seconds; artifact stays small enough to fetch trivially.

**Constraints**: Exactly one published artifact per release (no wrapper packages);
schema-versioned and backward-compatible additions only (new brand variants MUST NOT be a
breaking schema change, spec FR-014b); token renames/removals MUST surface as detectable
failures, never silent fallbacks (Constitution IV). Repo emits JSON only — no
platform-language codegen lives here (Constitution V).

**Scale/Scope**: v1 = primitives + semantic tokens covering `light`/`dark` for the default
`Mattias` brand (schema open to N brands), one (empty) exception registry, the Figma naming
convention, and the platform-onboarding process doc. Order-of-hundreds of tokens expected.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against Constitution v1.0.0 (Principles I–VII).

| Principle | Gate | Status |
|-----------|------|--------|
| I. Single Source of Truth | Foundations owns all foundational values; JSON is SoT after commit; Figma is authoring surface, not a second source. | ✅ PASS |
| II. Native-First | v1 ships no component implementations; principle applies to later releases. Documented in the platform-onboarding process. | ✅ PASS (deferred scope) |
| III. Parity by Default, Exceptions by Governance | Exception registry defined as a versioned JSON file, initially empty; entry schema captures platform/type/rationale/date; merge gate documented. | ✅ PASS |
| IV. No Silent Drift | Contract tests enforce total `(theme,brand)` resolution + alias existence; release diff flags renames/removals as failures. | ✅ PASS |
| V. Separation of Concerns in Distribution | Exactly one `tokens.json` per GitHub Release; no npm/SPM/Maven; no platform codegen in-repo. | ✅ PASS |
| VI. Accessibility as Non-Negotiable Default | No components in v1; principle recorded in the onboarding process for later releases. | ✅ PASS (deferred scope) |
| VII. Independent Versioning | Foundations versions independently via its own semver tags; platforms pin a version; no lockstep. | ✅ PASS |

**Result**: No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-design-system-architecture/
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── tokens.schema.json        # JSON Schema for the DTCG tokens artifact
│   ├── exceptions.schema.json    # JSON Schema for the exception registry
│   └── consumption-contract.md   # How platforms fetch + validate a pinned release
└── tasks.md             # /speckit-tasks output (NOT created here)
```

### Source Code (Mattias-Foundations repository)

```text
Mattias-Foundations/
├── tokens.json                 # Canonical artifact — DTCG, primitives + semantic (theme × brand)
├── exceptions.json             # Engineering-side exception registry (starts as [])
├── schemas/
│   ├── tokens.schema.json       # Versioned JSON Schema for tokens.json
│   └── exceptions.schema.json   # Versioned JSON Schema for exceptions.json
├── scripts/
│   ├── validate.mjs             # ajv schema validation for both artifacts
│   └── drift-check.mjs          # No-Silent-Drift check vs the previous release
├── docs/
│   ├── consumption.md           # How each platform fetches + pins a release (contract)
│   ├── figma-workflow.md        # Author in Figma → figma-cli extract → commit tokens.json
│   ├── naming-convention.md     # Figma prefix/suffix convention (design-team owned)
│   └── platform-onboarding.md   # Process to later add components / naming deviations / exceptions
├── .github/workflows/
│   ├── validate.yml             # CI: schema validation + drift check on PR
│   └── release.yml              # Tag → attach tokens.json as a GitHub Release asset
└── README.md
```

**Structure Decision**: Single-repo, data-artifact layout for **Mattias-Foundations**. The
three platform repos are intentionally NOT scaffolded in v1 (their implementations are
deferred, spec FR-015a); v1 delivers Foundations plus the documented process (`docs/`) and
distribution wiring (`.github/workflows/`) they will consume. This honors Separation of
Concerns (V) — the repo emits JSON + docs only, no platform-language code.

## Complexity Tracking

> No Constitution violations — section intentionally empty.
