# Phase 0 Research: Foundations v1

All Technical Context items were supplied as explicit decisions (no open
NEEDS CLARIFICATION). This document records each decision, its rationale, and the
alternatives considered, so the design in Phase 1 is traceable.

## R1. Token schema standard

- **Decision**: DTCG / W3C Design Tokens format (`$value` / `$type`, alias references
  like `{blue.500}`), with a project-authored, versioned JSON Schema (Draft 2020-12)
  that validates the artifact.
- **Rationale**: Vendor-neutral, widely supported, and `figma-cli` imports **and**
  exports it — so the Figma → `tokens.json` round-trip (R3) works without a custom
  converter. Alias syntax expresses the primitive→semantic reference cleanly.
- **Alternatives considered**:
  - *Style Dictionary format* — powerful platform codegen, but couples us to one tool
    and pulls per-platform build concerns toward Foundations, violating Separation of
    Concerns (Constitution V). Rejected.
  - *Custom schema* — maximum control over the `theme × brand` shape, but loses figma-cli
    round-trip and broad tooling, and must be documented/validated entirely by us.
    Rejected in favor of expressing the two-tier + `theme × brand` model *within* DTCG.

## R2. Modeling `theme × brand` in DTCG

- **Decision**: Primitives are a flat, un-themed group (`$type`-typed raw values).
  Semantic tokens reference primitives, and the two resolution dimensions are expressed
  as an explicit `theme` and `brand` structure so that every semantic token resolves to a
  primitive for every supported `(theme, brand)` pair. The JSON Schema requires `light`
  and `dark` themes and at least the `Mattias` brand in v1, while allowing additional
  brands to be added **without a breaking schema change** (open-ended `brand` keys, spec
  FR-014b/FR-014c).
- **Rationale**: DTCG itself has no first-class "modes" primitive; encoding theme/brand as
  named groups of aliases keeps it standard-compliant and lets contract tests assert total
  resolution (No Silent Drift, Constitution IV). Exact key layout is fixed in `data-model.md`.
- **Alternatives considered**: DTCG `$extensions` mode blocks (less portable, weaker tool
  support) — deferred; a flat "one file per (theme,brand)" split (multiplies artifacts,
  fights the "exactly one artifact" rule, Constitution V) — rejected.

## R3. Authoring flow (Figma ⇄ JSON)

- **Decision**: Designers author variables in the shared Figma library; `figma-cli extract`
  generates `tokens.json`. Once committed, the JSON is the single source of truth;
  `figma-cli import` can push JSON back to Figma to reconcile. Figma is the authoring
  surface, **not** a second source of truth (Constitution I).
- **Rationale**: Keeps designers in their native tool while the committed, versioned JSON
  stays authoritative and diffable. figma-cli drives Figma Desktop directly (no API key, no
  rate limits, no plugin) — the sanctioned tooling recorded in the constitution.
- **Alternatives considered**: JSON → Figma only (designers can't edit values in Figma) and
  hand-authored JSON with Figma detached (highest drift risk) — both rejected; the chosen
  direction is captured in `docs/figma-workflow.md`.

## R4. Distribution

- **Decision**: Publish via GitHub Releases — a semver git tag (`vX.Y.Z`) with `tokens.json`
  attached as a release asset, fetchable at a stable URL
  (`releases/download/vX.Y.Z/tokens.json`). No npm/SPM/Maven packages.
- **Rationale**: Exactly one canonical artifact per release (spec FR-003, Constitution V),
  reproducibly fetchable by a pinned version (FR-003a/FR-004), zero package-registry
  overhead. Each platform owns its own fetch+codegen pipeline (FR-004a).
- **Alternatives considered**: Versioned CDN URL (needs trust that URLs are immutable) and
  raw git-tag reads (artifact less clearly "published") — both viable, kept as documented
  fallbacks in `docs/consumption.md`, but Releases is the primary mechanism.

## R5. Exception registry format

- **Decision**: A versioned JSON file `exceptions.json` (starts as `[]`) beside `tokens.json`,
  governed by its own JSON Schema. Each entry: `component`, `platforms[]`, `type`
  (`visual|behavioral|naming|native-first`), `rationale`, `acceptedDate`, optional
  `approvedBy` and (later) per-platform implementation links.
- **Rationale**: Consistent with the JSON token artifact, machine-validatable in the same CI
  step, and travels with Foundations releases so the engineering trail is git-tracked
  (spec FR-009/FR-011, Constitution III).
- **Alternatives considered**: YAML (more hand-editable, but a second format/validator) and
  a Markdown table (readable in PRs but not machine-validatable, easy to desync) — rejected
  for weaker enforcement of the governance gate.

## R6. Repo tooling & No-Silent-Drift enforcement

- **Decision**: Minimal Node.js tooling: `scripts/validate.mjs` (ajv schema validation of
  both artifacts) and `scripts/drift-check.mjs` (fails when a token present in the previous
  release is renamed/removed without an explicit migration marker, and when any semantic
  token fails to resolve for a declared `(theme, brand)` or points at a missing alias). Wired
  into `.github/workflows/validate.yml` (PR gate) and `release.yml` (tag → asset).
- **Rationale**: Turns Constitution IV ("mismatches MUST surface as detectable failures")
  into an executable CI gate at near-zero cost, without introducing platform codegen
  (Constitution V).
- **Alternatives considered**: Relying on human review for drift (rejected — that is exactly
  the silent-drift failure mode); full DTCG resolver library (heavier than needed for v1 —
  a targeted resolution check suffices).
