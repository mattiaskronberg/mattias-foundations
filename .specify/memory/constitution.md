<!--
Sync Impact Report
==================
Version change: (template, unratified) → 1.0.0
Bump rationale: First ratified constitution. All template placeholders replaced with
  concrete principles derived from specs/001-design-system-architecture/spec.md. MAJOR
  baseline (1.0.0) because this establishes the initial governing principle set.

Modified principles (placeholder → concrete):
  [PRINCIPLE_1_NAME] → I. Single Source of Truth
  [PRINCIPLE_2_NAME] → II. Native-First (Re-style, Never Re-implement)
  [PRINCIPLE_3_NAME] → III. Parity by Default, Exceptions by Governance
  [PRINCIPLE_4_NAME] → IV. No Silent Drift
  [PRINCIPLE_5_NAME] → V. Separation of Concerns in Distribution
  (added) → VI. Accessibility as a Non-Negotiable Default
  (added) → VII. Independent Versioning

Added sections:
  - Tooling & Design–Engineering Workflow (Figma library as canonical registry;
    figma-cli drives Figma Desktop directly, no plugin, for build/inspect/extract)
  - Development Workflow & Quality Gates

Removed sections: none (all template slots populated)

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gate is generic
     ("[Gates determined based on constitution file]"); no hardcoded principle names,
     no edit needed. Gate will now evaluate against Principles I–VII.
  ✅ .specify/templates/spec-template.md — no constitution-coupled mandatory sections
     changed; no edit needed.
  ✅ .specify/templates/tasks-template.md — no principle-driven task categories removed;
     no edit needed.
  ⚠ .specify/templates/commands/*.md — directory not present in this project; nothing
     to reconcile.

Follow-up TODOs: none. RATIFICATION_DATE set to first-adoption date (2026-07-06).
-->

# Mattias Design System Constitution

## Core Principles

### I. Single Source of Truth

All foundational design values — color, typography, spacing, corner radii, and any
future foundation category — originate from **Mattias-Foundations**. Platform component
implementations (React, SwiftUI, Jetpack Compose) MUST reference Foundations-provided
values and MUST NOT hardcode any foundational value that exists in Foundations. Semantic
tokens are the default consumption surface; primitives MAY be referenced only when no
appropriate semantic token exists.

**Rationale**: Three platforms will inevitably drift if each owns its own values. A
single authoritative source is the contract every downstream guarantee depends on; if
this leg breaks, nothing built on top of it is trustworthy.

### II. Native-First (Re-style, Never Re-implement)

Every platform component MUST be built on top of the platform's native UI primitive —
SwiftUI primitives on iOS, Jetpack Compose primitives on Android, standard React DOM
elements on web (never React Native) — and re-styled, not re-implemented from scratch.
Any implementation that departs from this MUST be registered as an explicit exception
with documented rationale before it can merge.

**Rationale**: The native widget already solves accessibility, input, focus, gesture,
and motion correctly for its platform. Re-implementing re-introduces all of that risk;
re-styling keeps the platform feel for free.

### III. Parity by Default, Exceptions by Governance

The system MUST default to behavioral and visual parity across all three platforms for
every component. Any intentional deviation (e.g., the iOS Liquid Glass tab bar) MUST be
recorded in the git-tracked engineering-side **exception registry** in Mattias-Foundations
*before* it merges into a platform's main branch. Each entry MUST capture: affected
platform(s), deviation type (visual, behavioral, naming, native-first), rationale, and
accepted-on date.

**Rationale**: Parity-by-default with governed, explicit exceptions is what keeps the
system trustworthy at scale. Without governance, exceptions multiply quietly until the
"design system" is three loosely related libraries.

### IV. No Silent Drift

Mismatches MUST surface as detectable failures — a build error, type error, deprecation
warning, or contract-test failure — never a silent fallback or masked default. A renamed
or removed token, an unpinned Foundations upgrade, or an unregistered deviation MUST be
observable mechanically, not only when a designer notices visually. The exception
registry is authoritative: a deviation that is not in the registry is accidental drift,
not an accepted exception.

**Rationale**: Silent degradation is the failure mode that erodes a design system without
anyone deciding to. Making every mismatch loud keeps intent and reality aligned.

### V. Separation of Concerns in Distribution

Mattias-Foundations MUST publish exactly one canonical artifact per release: the
versioned, schema-conformant JSON, retrievable through a stable versioned reference. It
MUST NOT publish platform-language wrapper packages (no npm, no SPM, no Maven). Each
platform repository is solely responsible for fetching the pinned JSON and producing its
own platform-idiomatic representation; upgrades MUST be deliberate.

**Rationale**: Foundations owns design values; each platform owns its consumption
pipeline. One artifact keeps the boundary clean and prevents Foundations from acquiring
per-platform build concerns it should never carry.

### VI. Accessibility as a Non-Negotiable Default

Accessibility, gesture, motion, focus, and assistive-technology behavior inherited from
native primitives are REQUIRED defaults. The bar to break any of them is identical to the
bar to break parity: an explicit, registered exception with rationale. No component ships
having silently regressed native accessibility behavior.

**Rationale**: Accessibility is a property of the native widgets we build on; preserving
it by default costs nothing, and breaking it silently is never acceptable.

### VII. Independent Versioning

The four repositories — Mattias-Foundations plus the three platform repos — MUST be
independently versionable and releasable. No repository's release may require a lockstep
release of the others. Platforms pin a specific Foundations version and coordinate
through the Figma library (design-side) and the exception registry (engineering-side),
not through synchronized releases.

**Rationale**: Lockstep releases couple teams and stall delivery. Independent versioning
with pinned dependencies lets each repo move at its own cadence while staying coordinated.

## Tooling & Design–Engineering Workflow

The **Figma library is the canonical component registry** — the authoritative
cross-platform list of components. Platform-specific components are identified there by a
name prefix/suffix following the convention owned by the design team. The engineering-side
exception registry in Mattias-Foundations carries the engineering trail (rationale,
accepted-on date, affected platforms) for anything the Figma entry marks as
platform-specific.

Figma is now **programmatically drivable via figma-cli**, which controls Figma Desktop
directly (CDP, no cloud API key, no rate limits, no babysat plugin). This is a sanctioned
part of the workflow: use it to build, inspect, verify, and round-trip the design system
against Figma without a plugin. In particular:

- Foundations tokens MAY be created in / synced to Figma variables, and a Figma file's
  variable collections MAY be extracted back to a `DESIGN.md` / token JSON — but
  **Mattias-Foundations remains the single source of truth** (Principle I). Figma-side
  tooling assists the workflow; it does not become a second source of foundational values.
- Component work driven through figma-cli MUST still honor Native-First (Principle II)
  and Parity-by-default (Principle III): a Figma-built artifact does not exempt a real
  platform implementation from being a re-styled native primitive, nor from registering
  any deviation.
- figma-cli MUST NOT delete design work a user may want to keep, and its use is a build
  aid — it does not replace the governance gates in this constitution.

## Development Workflow & Quality Gates

- **Constitution gate**: Every implementation plan MUST pass a Constitution Check against
  Principles I–VII before design work proceeds, and re-check after design. Violations that
  cannot be removed MUST be justified explicitly or reworked.
- **Exception-registry gate**: No deviation from native-first, parity, naming, or
  accessibility defaults may merge into a platform's main branch without a corresponding
  exception-registry entry (Principles II, III, VI). Review MUST verify the entry exists.
- **Foundations contract gate**: Token renames/removals MUST surface as detectable
  failures for consumers (Principle IV); a release that would silently break a consumer is
  blocked until the break is made observable and a migration path documented.
- **Naming gate**: Components use canonical cross-platform names by default; platform-
  idiomatic name adaptations (e.g., SwiftUI `Toggle` for canonical `Switch`) MUST be
  recorded in the exception registry.

## Governance

This constitution supersedes ad-hoc practices for the Mattias Design System. The exception
registry in Mattias-Foundations and this document are jointly authoritative: the
constitution defines the principles, the registry records every sanctioned departure from
them.

- **Amendments** MUST be proposed as a versioned change to this file, with a Sync Impact
  Report describing the change and any dependent templates/docs to update.
- **Versioning policy** (semantic):
  - **MAJOR** — backward-incompatible governance change: a principle removed or redefined.
  - **MINOR** — a new principle or section added, or materially expanded guidance.
  - **PATCH** — clarifications, wording, and non-semantic refinements.
- **Compliance review**: plans, specs, and PRs are reviewed for compliance with the
  principles above. Complexity or deviation MUST be justified; unjustified drift is
  treated as a defect, not a variation.

**Version**: 1.0.0 | **Ratified**: 2026-07-06 | **Last Amended**: 2026-07-06
