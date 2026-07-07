# Phase 1 Data Model: Foundations v1

Derives the concrete data shapes from the spec's Key Entities and the Phase 0 decisions.
Two artifacts are modeled: **`tokens.json`** (DTCG) and **`exceptions.json`** (registry).
Their authoritative validation lives in `contracts/tokens.schema.json` and
`contracts/exceptions.schema.json`; this file explains the shape and the rules.

## Entity: Primitive Token

A named raw value, shared across all themes and brands (spec FR-014c).

- **Fields**: `$value` (raw color/dimension/number/fontFamily/…), `$type` (DTCG type).
- **Rules**:
  - MUST NOT be themed or branded (no `(theme, brand)` dimension).
  - Namespaced under a top-level `primitives` group.
  - `$type` MUST be a valid DTCG type; `$value` MUST match it.
- **Example**:
  ```json
  "primitives": {
    "blue": { "500": { "$value": "#3B82F6", "$type": "color" } },
    "space": { "4": { "$value": "16", "$type": "dimension" } }
  }
  ```

## Entity: Semantic Token

A named-by-purpose token that resolves to a primitive per `(theme, brand)` (spec FR-014/014b).

- **Fields**: `$type`, and a resolution structure keyed by `theme` → `brand` → alias
  reference (`{primitives.blue.500}`).
- **Rules**:
  - MUST reference a primitive (alias), not inline a raw value, by default.
  - MUST resolve for **every** declared `(theme, brand)` combination — no gaps
    (Constitution IV; enforced by `drift-check.mjs`).
  - Every alias target MUST exist in `primitives`.
  - Namespaced under a top-level `semantic` group.
- **Example**:
  ```json
  "semantic": {
    "color": {
      "action": {
        "primary": {
          "$type": "color",
          "$value": {
            "light": { "Mattias": "{primitives.blue.500}" },
            "dark":  { "Mattias": "{primitives.blue.400}" }
          }
        }
      }
    }
  }
  ```

## Entity: Theme

- A resolution dimension. v1 MUST include `light` and `dark` (spec FR-014b).
- The schema requires these two keys to be present on every semantic token; additional
  themes MAY be added later without a breaking change.

## Entity: Brand Variant

- The second resolution dimension. v1 MUST populate the default `Mattias` brand for both
  themes. Brand keys are **open-ended** in the schema — adding a brand is a non-breaking
  change (spec FR-014b, Constitution VII).

## Entity: Foundations Release

- **Fields**: `version` (semver), `schemaVersion`, the token set, produced as the
  `tokens.json` asset on a `vX.Y.Z` GitHub Release.
- **Rules**: exactly one canonical artifact per release (Constitution V); a `$schemaVersion`
  (or top-level `meta.schemaVersion`) field records which schema the artifact targets.

## Entity: Exception Entry (`exceptions.json`)

An intentional, governed deviation from parity or native-first (spec FR-009).

- **Fields**:
  - `component` (string, required) — canonical component name.
  - `platforms` (array of `ios` | `android` | `web`, required, non-empty).
  - `type` (`visual` | `behavioral` | `naming` | `native-first`, required).
  - `rationale` (string, required, non-empty).
  - `acceptedDate` (string, `YYYY-MM-DD`, required).
  - `approvedBy` (string, optional).
  - `implementations` (object, optional) — per-platform links, populated when components
    ship in later releases.
- **Rules**:
  - The file is an array; v1 ships `[]`.
  - No deviation may merge into a platform's main branch without a matching entry
    (Constitution III; the merge gate is documented in `docs/platform-onboarding.md`).
- **Example**:
  ```json
  [{
    "component": "TabBar",
    "platforms": ["ios"],
    "type": "visual",
    "rationale": "iOS Liquid Glass tab bar — platform-idiomatic material.",
    "acceptedDate": "2026-07-06"
  }]
  ```

## Entity: Figma Library (canonical component registry)

- Design-side authoritative component list (spec FR-011). Not a file in this repo.
- Platform-specific components are marked by a **prefix/suffix** naming convention owned by
  the design team, documented in `docs/naming-convention.md`. Any component the Figma entry
  marks platform-specific MUST have a corresponding `exceptions.json` entry.

## Cross-artifact invariants (enforced in CI)

1. Every semantic alias target exists in `primitives`.
2. Every semantic token resolves for every declared `(theme, brand)`.
3. `light` + `dark` present; `Mattias` brand populated (v1).
4. A token key present in the previous release that disappears/renames in the new one fails
   `drift-check.mjs` unless an explicit migration note accompanies it.
5. Both `tokens.json` and `exceptions.json` validate against their schemas.
