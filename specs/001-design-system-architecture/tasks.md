---
description: "Task list for Multi-Platform Design System Architecture (Foundations v1)"
---

# Tasks: Multi-Platform Design System Architecture (Foundations v1)

**Input**: Design documents from `/specs/001-design-system-architecture/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: INCLUDED. plan.md "Testing" explicitly requires schema-validation tests plus
No-Silent-Drift contract tests run via `node --test`. Test tasks are therefore generated.

**Organization**: Tasks are grouped by user story. Per spec FR-015 / FR-015a, **only User
Story 1 (P1) is an in-scope deliverable for v1**. Phases 4–5 scaffold the v1 FR-015
architectural deliverables (exception registry, Figma naming convention, onboarding process)
that enable the deferred stories US3/US4; **US2 has no v1 implementation tasks** (component
implementations are deferred to later releases).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US3, US4)
- File paths are relative to the **Mattias-Foundations repository root** (per plan.md "Source Code" layout)

## Path Conventions

Mattias-Foundations is a single-repo, data-artifact project. Paths below are repo-root-relative:
`tokens.json`, `exceptions.json`, `schemas/`, `scripts/`, `tests/`, `docs/`, `.github/workflows/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository initialization and toolchain

- [ ] T001 Create the Mattias-Foundations directory structure per plan.md (`schemas/`, `scripts/`, `tests/`, `docs/`, `.github/workflows/`) at the repository root
- [ ] T002 Initialize the Node.js project: create `package.json` with `"type": "module"`, `"engines": { "node": ">=18" }`, and a `"test": "node --test"` script at the repository root
- [ ] T003 [P] Add dev dependencies `ajv` and `ajv-formats` to `package.json` and install them
- [ ] T004 [P] Add `.gitignore` (node_modules, OS/editor cruft) at the repository root
- [ ] T004a Initialize the git repository (`git init`) and add the GitHub remote at the repository root — prerequisite for the release workflow and tag-based publishing (T016, T023)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The versioned JSON Schemas that every artifact and every validation/test depends on

**⚠️ CRITICAL**: No user story work can begin until the schemas exist in the repo

- [ ] T005 Author `schemas/tokens.schema.json` (DTCG Draft 2020-12) from `specs/001-design-system-architecture/contracts/tokens.schema.json` — enforces two-tier `primitives` + `semantic`, `theme` (`light`+`dark` required) × open-ended `brand` dimensions, and a `meta.schemaVersion` field
- [ ] T006 [P] Author `schemas/exceptions.schema.json` from `specs/001-design-system-architecture/contracts/exceptions.schema.json` — array of entries with required `component`, non-empty `platforms[]` (`ios|android|web`), `type` (`visual|behavioral|naming|native-first`), `rationale`, `acceptedDate` (`YYYY-MM-DD`), optional `approvedBy`/`implementations`

**Checkpoint**: Schemas in place — user story implementation can begin

---

## Phase 3: User Story 1 - Single source of truth for design foundations (Priority: P1) 🎯 MVP

**Goal**: Ship the versioned, schema-conformant `tokens.json` (primitives + semantic tokens
covering `light`/`dark` for the `Mattias` brand), plus the validation, No-Silent-Drift, and
distribution wiring that make a single token change reproducibly consumable by any platform.

**Independent Test**: Change one primitive value referenced by a semantic token, run
`node scripts/validate.mjs && node scripts/drift-check.mjs && node --test`, cut a `v0.1.0`
release, and confirm the published `tokens.json` asset carries the new value under a stable
version id with no manual re-translation (quickstart Scenarios 1, 2, 6).

### Tests for User Story 1 (write first, ensure they FAIL before implementation) ⚠️

- [ ] T007 [P] [US1] Schema-validation test: `tokens.json` validates against `schemas/tokens.schema.json` in `tests/tokens.schema.test.mjs`
- [ ] T008 [P] [US1] Resolution contract test: every semantic token resolves to an existing primitive for every declared `(theme, brand)` — no gaps, no dangling aliases — in `tests/resolution.test.mjs`
- [ ] T009 [P] [US1] Drift contract test: a token key present in the previous release that is renamed/removed in the new one surfaces as a non-zero failure (absent an explicit migration marker) in `tests/drift.test.mjs`

### Implementation for User Story 1

- [ ] T010 [US1] Author `tokens.json` at the repository root: `primitives` group (color, spacing, font-size, line-height, radius as raw `$type`-typed values) and `semantic` group (e.g. `color.action.primary`) resolved per `theme` (`light`/`dark`) × `brand` (`Mattias`) via `{primitives.*}` aliases, plus `meta.version` + `meta.schemaVersion`
- [ ] T011 [US1] Implement `scripts/validate.mjs`: ajv (+ ajv-formats) validation of `tokens.json` against `schemas/tokens.schema.json` (and `exceptions.json` against its schema), non-zero exit on failure
- [ ] T012 [US1] Implement `scripts/drift-check.mjs`: assert total `(theme, brand)` resolution + alias existence, and diff against the previous release to flag renamed/removed keys as failures unless a migration marker is present
- [ ] T013 [P] [US1] Author `docs/figma-workflow.md`: author variables in Figma → `figma-cli extract --sections variables --save tokens.json` → commit; committed JSON is the single source of truth (research R3)
- [ ] T014 [P] [US1] Author `docs/consumption.md` from `specs/001-design-system-architecture/contracts/consumption-contract.md`: how a platform pins a version, fetches `releases/download/vX.Y.Z/tokens.json`, and validates it (FR-003a/FR-004)
- [ ] T015 [US1] Add `.github/workflows/validate.yml`: PR gate running `node scripts/validate.mjs`, `node scripts/drift-check.mjs`, and `node --test`
- [ ] T016 [US1] Add `.github/workflows/release.yml`: on `vX.Y.Z` tag, attach `tokens.json` as the single GitHub Release asset (no npm/SPM/Maven). Requires the git repo + GitHub remote from T004a

**Checkpoint**: User Story 1 fully functional — tokens are a versioned, validated, drift-guarded single source of truth. **This is the shippable MVP.**

---

## Phase 4: User Story 3 groundwork - Parity with explicit exceptions (Priority: P3)

**Goal**: Stand up the engineering-side exception registry (FR-009/FR-011) and the governance
process, initially empty, so future platform deviations are recorded and gated. Note: US3 as a
full story is deferred; only its v1 registry/process scaffolding is built here.

**Independent Test**: Confirm `exceptions.json` is `[]` and validates; add one sample entry
(iOS Liquid Glass `TabBar`) and confirm it validates while a malformed entry fails
(quickstart Scenario 5).

- [ ] T017 [P] [US3] Create `exceptions.json` at the repository root, initialized to `[]`
- [ ] T018 [P] [US3] Exceptions schema-validation test: `[]` validates, a well-formed entry validates, and a malformed entry (missing `rationale` / bad `acceptedDate` / unknown platform) fails, in `tests/exceptions.schema.test.mjs`
- [ ] T019 [US3] Author `docs/platform-onboarding.md`: the process for platforms to later add components / naming deviations / exceptions, including the merge gate requiring an exception entry before any deviation lands on a platform main branch

**Checkpoint**: Exception registry ships as `[]`, validates, and its governance process is documented

---

## Phase 5: User Story 4 groundwork - Cross-platform naming convention (Priority: P4)

**Goal**: Document the design-team-owned Figma prefix/suffix naming convention (FR-010) that
identifies platform-specific components. US4 as a full story is deferred; only the convention
doc is a v1 deliverable.

**Independent Test**: A reader can determine, from `docs/naming-convention.md` alone, how a
platform-specific component (e.g. an iOS-only entry) is distinguished from a synced one purely
by its Figma name.

- [ ] T020 [P] [US4] Author `docs/naming-convention.md`: the Figma prefix/suffix convention (prefix vs suffix, casing, allowed platform labels) owned by the design team

---

> **User Story 2 (P2, re-styled native components)**: intentionally has **no v1 tasks** —
> component implementations on React/SwiftUI/Jetpack Compose are deferred to releases after v1
> (spec FR-015/FR-015a). The onboarding doc (T019) records how those components arrive later.
>
> **End-state repo topology (FR-012 / Constitution VII)**: the design system spans **four
> independently versioned git repos** — Mattias-Foundations (created here via T004a) plus one
> each for React (web), SwiftUI (iOS), and Jetpack Compose (Android). v1 scaffolds **only
> Foundations**; the three platform repos are created in later releases and each pins a
> Foundations version — no lockstep releases.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Repo-level docs and end-to-end validation

- [ ] T021 [P] Author `README.md` at the repository root: project overview, repo layout, how to validate (`node scripts/validate.mjs`), and how to cut a release
- [ ] T022 Run all quickstart.md scenarios (1–6) end-to-end and confirm each passes
- [ ] T023 Cut the `v0.1.0` release (`git tag v0.1.0 && git push origin v0.1.0`) and confirm exactly one `tokens.json` asset is attached at `releases/download/v0.1.0/tokens.json` (quickstart Scenario 4). Requires the git repo + GitHub remote from T004a

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS all user stories** (schemas gate every validation/test)
- **User Story 1 (Phase 3)**: Depends on Foundational — the MVP; no dependency on other stories
- **US3 groundwork (Phase 4)**: Depends on Foundational (needs `schemas/exceptions.schema.json`); independent of US1
- **US4 groundwork (Phase 5)**: Depends only on Setup (docs-only); independent of US1/US3
- **Polish (Phase 6)**: T022/T023 depend on Phases 3–5 being complete; T021 (README) can start earlier

### Within User Story 1

- Tests (T007–T009) written first and FAIL before implementation
- Artifact (T010) before validation/drift scripts (T011, T012) can pass
- T011 before T012 (drift-check reuses resolution logic; keep validation green first)
- Scripts before CI wiring (T015, T016)

### Parallel Opportunities

- Setup: T003, T004 in parallel after T001/T002
- Foundational: T006 in parallel with T005
- US1 tests: T007, T008, T009 all in parallel (different files)
- US1 docs: T013, T014 in parallel with each other and with script work
- After Foundational, Phases 3, 4, and 5 can proceed in parallel (different files, no cross-story dependencies)

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tests together (write first, expect FAIL):
Task: "Schema-validation test in tests/tokens.schema.test.mjs"
Task: "Resolution contract test in tests/resolution.test.mjs"
Task: "Drift contract test in tests/drift.test.mjs"

# Author the two consumer/authoring docs in parallel:
Task: "docs/figma-workflow.md"
Task: "docs/consumption.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (schemas — blocks everything)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run the US1 Independent Test (validate + drift-check + `node --test`, cut a release)
5. Ship v0.1.0 — a versioned, single-source-of-truth tokens artifact is real value even before components exist

### Incremental Delivery

1. Setup + Foundational → schemas ready
2. US1 (Phase 3) → validate independently → **v0.1.0 MVP**
3. US3 groundwork (Phase 4) → exception registry `[]` + governance doc
4. US4 groundwork (Phase 5) → naming-convention doc
5. Polish (Phase 6) → README + full quickstart run + tagged release

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps each task to the user story it serves (US1 = v1 deliverable; US3/US4 = v1 architectural scaffolding for deferred stories)
- Verify US1 tests fail before implementing
- Commit after each task or logical group
- Foundations emits JSON + docs only — no platform-language codegen in this repo (Constitution V)
