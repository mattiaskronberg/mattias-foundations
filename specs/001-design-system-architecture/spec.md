# Feature Specification: Multi-Platform Design System Architecture

**Feature Branch**: `001-design-system-architecture`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "We're implementing a design system. It will contain components for React, iOS (SwiftUI), and Jetpack Compose. These are separate repositories. The foundational level is shared and is also a separate repository. It's called Mattias-Foundations and will publish a JSON with all the foundational things (color, font, etc.) that is then consumed by the SwiftUI, React, and Jetpack Compose project. An important principle is that we're building as much as possible on re-styled native technology. Platforms are 99% synced, but we allow explicit exceptions, such as the Liquid Glass tab bar on iOS etc. But every exception must be explicit. Naming is as close as possible to synced, but platform conventions are allowed."

## Clarifications

### Session 2026-06-15

- Q: Token taxonomy — should Mattias-Foundations expose only primitive tokens, primitives + semantic tokens, or a full three-tier model (primitives + semantic + component tokens)? → A: Primitives + semantic tokens. Foundations owns both the raw values and their named meaning; platform components reference semantic tokens. Component-level tokens are explicitly out of scope for v1.
- Q: v1 scope — does v1 ship Foundations + architecture only, Foundations + a starter component set on all three platforms, or Foundations + a broader set including platform-specific exceptions? → A: Foundations + architecture only. v1 delivers Mattias-Foundations (JSON artifact + schema) and the architectural/process foundation (distribution, component registry, exception registry) for the three platform repositories. Component implementations on React, SwiftUI, and Jetpack Compose are deferred to subsequent releases. User Stories 2, 3, and 4 in this spec describe the full design system vision and become deliverables in later releases.
- Q: How does each platform repository consume Foundations — raw JSON artifact, auto-generated per-platform wrapper packages, git submodule, or a hybrid? → A: Raw JSON artifact only (separation of concerns). Mattias-Foundations publishes exactly one canonical artifact per release: the versioned JSON. Each platform repository is solely responsible for fetching that JSON and locally producing whatever platform-idiomatic representation it needs (e.g., Swift values, Kotlin objects, TypeScript constants). Mattias-Foundations does NOT publish npm, SPM, or Maven packages.
- Q: Does Foundations v1 need to support theming — no themes, light + dark, or light + dark + brand variants? → A: Full multidimensional theming in v1 (theme × brand). Semantic tokens resolve to primitives along two independent dimensions: theme (light, dark) and brand variant. The JSON schema MUST express both dimensions from day one. At least one brand variant (the default "Mattias" brand) MUST be populated in v1; the schema MUST permit additional brand variants without a breaking schema change.
- Q: Where do the cross-platform component registry and the exception registry live? → A: The **component registry is Figma**. Components are designed in a shared Figma library; platform-specific components are identified there by a name prefix or suffix (the design team owns the exact convention). The **engineering-side exception registry** (rationale, accepted-on date, affected platforms) lives in Mattias-Foundations as a versioned file alongside the token JSON, so that the engineering trail is git-tracked and travels with the Foundations releases.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Single source of truth for design foundations (Priority: P1)

A design system maintainer updates a foundational design value (e.g., a brand color, a type ramp step, a spacing scale, a corner radius) in **Mattias-Foundations**. After a published release, that change is consumable — without manual re-entry — by the React, SwiftUI, and Jetpack Compose component libraries, and downstream by any app that uses them.

**Why this priority**: Without a single, authoritative source for design tokens, the three platform implementations will drift over time, defeating the whole purpose of a design system. This is the foundational contract everything else builds on; nothing downstream is trustworthy if this leg is broken.

**Independent Test**: Publish a new version of Mattias-Foundations with a single token value changed. Verify that the resulting JSON artifact contains the new value, and that each of the three platform repositories can pull the new version and observe the changed value at the consumer-API level. Delivers value as an MVP because even a tokens-only design system (no components yet) gives product teams a shared, versioned vocabulary for color, typography, spacing, etc.

**Acceptance Scenarios**:

1. **Given** Mattias-Foundations defines a token (e.g., `color.brand.primary`), **When** a maintainer changes its value and cuts a new release, **Then** the published JSON artifact reflects the new value and is identifiable by a stable version identifier.
2. **Given** a new version of Mattias-Foundations is published, **When** the React, SwiftUI, or Jetpack Compose repository upgrades its Foundations dependency, **Then** the platform's token-access API returns the new value with no additional manual translation.
3. **Given** a token is renamed or removed in Foundations, **When** a platform repository attempts to consume the new version, **Then** the change surfaces as a clearly detectable difference (build error, type error, or explicit deprecation) rather than a silent drift.

---

### User Story 2 - Re-styled native components on every platform (Priority: P2)

An app developer on React, iOS, or Android imports a design system component (e.g., Button, TextField, Switch, Tab Bar) and gets the design system's visual styling on top of the platform's native UI primitive. Accessibility behavior, focus and gesture handling, motion, input methods, and assistive-technology integration all behave the way users of that platform expect — because under the hood it *is* the native widget, just re-styled.

**Why this priority**: This is the "value layer" — without components, the design system is just tokens. The native-first principle is what makes the design system actually feel right on each platform; building components from scratch would re-introduce all the accessibility, input, and platform-feel work that the underlying frameworks already solve.

**Independent Test**: For each platform, pick one representative component, build it on top of the native primitive (e.g., SwiftUI `Button`, Compose `Button`, React-native HTML `<button>`), and verify (a) it applies Foundations tokens for color/typography/spacing/etc., (b) it preserves native accessibility traits, focus, gesture, and motion behavior, (c) a sample app can use it without bespoke per-app glue code. Delivers value independently because even a single shared, re-styled component proves the model.

**Acceptance Scenarios**:

1. **Given** a platform component exists in the design system, **When** an app developer drops it into a sample app, **Then** it inherits native accessibility behavior (e.g., VoiceOver/TalkBack labels, focus order, keyboard navigation) without any extra wiring.
2. **Given** a Foundations token used by a component changes value, **When** the component is rebuilt against the new Foundations version, **Then** the component's appearance reflects the new value without code changes inside the component.
3. **Given** a component implementation re-implements a native primitive from scratch (not re-styling the native widget), **When** review is performed, **Then** the implementation is flagged and must either be reworked or registered as an explicit exception with rationale.

---

### User Story 3 - Cross-platform parity with explicit exceptions (Priority: P3)

A design system maintainer (or curious consumer) can see, at any time, which components are 100% synced across React, SwiftUI, and Jetpack Compose, and which have intentional platform-specific deviations (e.g., the iOS Liquid Glass tab bar). For every deviation, a documented rationale exists. Nothing is allowed to silently diverge; the question "is this on purpose?" always has a clear answer.

**Why this priority**: Parity-by-default with explicit, governed exceptions is the principle that keeps the system trustworthy at scale. Without it, exceptions multiply quietly and the "design system" becomes three loosely related component libraries. This is enabling rather than blocking for v1, so P3.

**Independent Test**: In the Figma library, add one component with the prefix/suffix marking it as iOS-specific (e.g., a Liquid Glass tab bar) and one without (e.g., a `Button` intended for all platforms). Add a matching entry in the engineering-side exception registry (the versioned file in Mattias-Foundations) for the iOS-specific component including rationale and platform. Verify that (a) the Figma library distinguishes platform-specific from synced components purely via the naming convention, and (b) the engineering exception file records the rationale for the platform-specific one.

**Acceptance Scenarios**:

1. **Given** a component exists on all three platforms with synced behavior, **When** a maintainer inspects the parity registry, **Then** the component is shown as fully synced.
2. **Given** a platform maintainer wishes to introduce a platform-specific deviation (e.g., iOS Liquid Glass tab bar), **When** the change is proposed, **Then** acceptance requires an explicit exception entry with rationale before the change can be merged.
3. **Given** a component silently diverges between platforms without an exception entry, **When** review or audit is performed, **Then** the drift is detected and either reconciled or registered as an exception with rationale.

---

### User Story 4 - Consistent cross-platform naming with platform-idiomatic adaptations (Priority: P4)

A developer who has worked with the React version of a component (e.g., `Button`, `TextField`, `Switch`) can intuit the SwiftUI and Jetpack Compose equivalents because the names match wherever possible. Where a platform convention demands otherwise (e.g., Swift's `Toggle` instead of `Switch`, or Compose's `OutlinedTextField`), the deviation is intentional and documented in the same registry as parity exceptions.

**Why this priority**: Naming consistency dramatically lowers cognitive load for designers and developers who cross between platforms, but it can be addressed incrementally. P4 because the system can deliver real value even if naming alignment lags slightly behind.

**Independent Test**: Pick three components and define their canonical cross-platform names. Verify that all three platform repositories use the canonical name, or, if a platform deviates, that the deviation is recorded in the registry alongside parity exceptions.

**Acceptance Scenarios**:

1. **Given** a component has a canonical cross-platform name (e.g., `Button`), **When** a developer searches each platform's component library, **Then** the same name appears in each library.
2. **Given** a platform's idiomatic convention demands a different name (e.g., SwiftUI `Toggle` vs. cross-platform `Switch`), **When** the deviation is introduced, **Then** the registry records the canonical name, the platform-specific name, and the convention being honored.
3. **Given** a developer browses a cross-reference between platforms, **When** they look up a component by either its canonical or platform-specific name, **Then** they can navigate to the equivalent on the other two platforms.

---

### Edge Cases

- **Foundations adds a new token, but a platform release hasn't picked it up yet.** Platform consumers should see no behavior change until they upgrade Foundations; the token should not leak in as `undefined` or a fallback that masks the gap.
- **Foundations removes or renames a token still referenced by a platform component.** The mismatch must surface clearly (build break, deprecation warning, or contract test failure) rather than silently rendering with a default.
- **A platform team merges a styling change that drifts from parity without filing an exception.** The drift must be detectable through review or audit, not only after a designer notices visually.
- **A component is requested that has no clean native primitive on one platform (e.g., a desktop-style menubar on iOS).** The platform must either implement it as an explicit exception (with rationale), or formally not ship the component on that platform (with the gap recorded in the registry).
- **Foundations introduces a breaking JSON schema change (e.g., reorganizes token structure).** A migration path must exist for each platform repo; consumers shouldn't be forced to upgrade in lockstep with no plan.
- **A team needs an experimental component before it stabilizes across platforms.** The experimental status should be visible at the registry level so consumers can opt in knowingly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Mattias-Foundations MUST publish a versioned JSON artifact containing all foundational design values, at minimum: colors, typography (font families, sizes, weights, line heights), spacing, and corner radii. Additional foundation categories may be added over time.
- **FR-002**: The Foundations JSON MUST conform to a documented, versioned schema so that platform consumers can validate and parse it deterministically.
- **FR-003**: Mattias-Foundations MUST be a separately versioned repository, independent of the three platform repositories. For each release, Mattias-Foundations MUST publish exactly one canonical artifact: the versioned, schema-conformant JSON file. Mattias-Foundations MUST NOT publish platform-language wrapper packages (no npm package, no SPM package, no Maven artifact).
- **FR-003a**: The published Foundations JSON artifact MUST be retrievable by each platform repository through a stable, versioned reference (e.g., a release tag, a versioned URL, or equivalent) such that a given Foundations version is reproducibly fetchable.
- **FR-004**: Each platform repository (React, SwiftUI, Jetpack Compose) MUST consume a specific, pinned version of the Mattias-Foundations JSON artifact; upgrades MUST be deliberate.
- **FR-004a**: Each platform repository is solely responsible for fetching the Foundations JSON and producing the platform-idiomatic representation it needs (e.g., TypeScript constants for React, Swift values/types for SwiftUI, Kotlin objects for Jetpack Compose). The mechanism (build-time codegen, runtime parse, checked-in generated files, etc.) is a per-platform implementation decision.
- **FR-005**: Each platform repository MUST expose Foundations values through a platform-idiomatic API (e.g., theme/object/struct lookup) and MUST NOT permit components to hardcode foundational values that exist in Foundations.
- **FR-006**: Every platform component implementation MUST build on top of the platform's native UI technology — re-styled rather than re-implemented. SwiftUI components MUST use SwiftUI primitives; Jetpack Compose components MUST use Compose primitives; React components MUST use standard React DOM elements (not React Native).
- **FR-007**: Any component implementation that deviates from the native-first principle MUST be registered as an explicit exception with documented rationale.
- **FR-008**: The system MUST default to behavioral and visual parity across all three platforms for every component.
- **FR-009**: Any deviation from cross-platform parity (e.g., iOS Liquid Glass tab bar) MUST be recorded in a discoverable engineering-side exception registry that lives in Mattias-Foundations as a versioned file alongside the token JSON. Each entry MUST capture: the affected platform(s), the type of deviation (visual, behavioral, naming, native-first), the rationale, and the date the exception was accepted.
- **FR-010**: Component naming MUST be consistent across platforms by default. Platform-specific components are identified in the Figma library by a name prefix or suffix that designates the target platform; the exact convention (prefix vs suffix, casing, allowed platform labels) is owned by the design team and documented as part of the Figma library setup. Platform-idiomatic name adaptations on engineering side (e.g., SwiftUI `Toggle` for the `Switch` canonical component) MUST be recorded in the engineering-side exception registry.
- **FR-011**: The **canonical component registry is the Figma library**. The Figma library is the authoritative list of components and identifies platform-specific entries via the prefix/suffix naming convention defined in FR-010. The engineering-side exception registry in Mattias-Foundations carries the engineering trail for any component whose Figma entry indicates platform-specificity (rationale, accepted-on date, affected platforms) and, when components ship in later releases, links to each platform's implementation.
- **FR-012**: The four repositories (Mattias-Foundations + the three platform repos) MUST be independently versionable and releasable; no repository's release SHOULD require lockstep release of the others.
- **FR-013**: Each platform repository MUST treat accessibility, gesture, motion, focus, and assistive-technology behavior inherited from native primitives as required by default; any change that breaks those defaults MUST be registered as an exception.
- **FR-014**: Mattias-Foundations MUST expose foundational design values as a two-tier token model: a **primitive** layer (raw values such as `blue-500`, `space-4`, `font-size-md`) and a **semantic** layer (named-by-purpose tokens such as `color.action.primary`, `space.inset.md`) that reference primitives. Platform components MUST consume semantic tokens by default and MAY reference primitives only when no appropriate semantic token exists.
- **FR-014a**: Component-level tokens (e.g., `button.background.default`) are explicitly out of scope for v1; component styling MUST be expressed in terms of semantic tokens inside each platform's component implementation.
- **FR-014b**: Mattias-Foundations MUST express semantic tokens along two independent dimensions: **theme** (at minimum `light` and `dark`) and **brand variant**. Every semantic token MUST resolve to a primitive for every (theme, brand) combination supported in a given release. v1 MUST ship at least the default "Mattias" brand variant populated for both `light` and `dark` themes; the schema MUST permit additional brand variants to be added in later releases without a breaking schema change.
- **FR-014c**: Primitive tokens are NOT themed or branded — they are raw atomic values shared across all (theme, brand) combinations. Only semantic tokens carry the (theme, brand) dimensions.
- **FR-014d**: Each platform repository MUST expose Foundations values in a way that lets a consumer app select the active (theme, brand) combination at runtime or build time; the selection mechanism is a per-platform implementation decision.
- **FR-015**: v1 of the design system MUST ship the following and ONLY the following: (1) Mattias-Foundations with its versioned, schema-conformant JSON artifact and primitive + semantic token sets covering light/dark themes for the default "Mattias" brand variant, (2) the agreed distribution mechanism by which each platform repository consumes Foundations (raw JSON artifact, fetched and locally processed by each platform), (3) the engineering-side exception registry in Mattias-Foundations as a defined versioned file (initially empty), (4) the Figma library set up with the agreed prefix/suffix naming convention for platform-specific components (initially empty of shipped components), and (5) the documented process by which platform repositories will later add components, naming deviations, and exceptions. Component implementations on React, SwiftUI, and Jetpack Compose are explicitly deferred to releases after v1.
- **FR-015a**: User Stories 2, 3, and 4 in this spec describe the full multi-release design system vision; only User Story 1 (Single source of truth for design foundations) is in scope as a deliverable for v1.

### Key Entities

- **Foundation Token**: A named foundational design value living in Mattias-Foundations. Exists in two tiers: (1) **Primitive Token** — a named raw value (e.g., `blue-500`, `space-4`, `font-size-md`), shared across all themes and brand variants; and (2) **Semantic Token** — a named-by-purpose token (e.g., `color.action.primary`, `space.inset.md`) whose value is a primitive reference resolved per (theme, brand) combination. Semantic tokens are themed and branded; primitives are not. Platform components consume semantic tokens by default.
- **Theme**: A dimension of semantic-token resolution. v1 supports at minimum `light` and `dark`. Each platform passes a selected theme at runtime/build time.
- **Brand Variant**: A second dimension of semantic-token resolution. v1 ships the default `Mattias` brand variant; additional brand variants may be added in later releases without a breaking schema change.
- **Foundations Release**: A published, versioned JSON artifact emitted by Mattias-Foundations. Carries a version identifier, the token set, and the schema version.
- **Platform Component**: A re-styled native UI element on one of the three platforms. References Foundation Tokens for all foundational values; preserves the underlying native primitive's accessibility, gesture, motion, and input behavior.
- **Figma Library**: The canonical, design-side registry of components. Components designed there are the authoritative cross-platform list. Platform-specific components are identified by a name prefix or suffix following the convention owned by the design team.
- **Engineering Exception Entry**: A documented, intentional deviation from parity or from the native-first principle. Lives in Mattias-Foundations as a versioned file alongside the token JSON. Carries the affected platform(s), the type of exception (visual, behavioral, naming, native-first), a rationale, the date accepted, and (optionally) the maintainer who approved it. Once components ship in later releases, also carries links to each platform's implementation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of foundational design values (color, typography, spacing, radii, etc.) used by any platform component originate from Mattias-Foundations; zero foundational values are hardcoded inside platform component implementations.
- **SC-002**: A change to a single Foundation Token in Mattias-Foundations can propagate through to a consumer app on any of the three platforms within one platform release cycle, with no manual re-translation of the value.
- **SC-003**: At least 95% of components are fully synced across all three platforms; the remaining ≤5% are recorded as explicit exceptions, each with a documented rationale.
- **SC-004**: 100% of cross-platform deviations (visual, behavioral, naming, or native-first) have a corresponding entry in the exception registry before being merged into a platform repository's main branch.
- **SC-005**: A developer who knows a component on one platform can locate the equivalent on either of the other two platforms in under 2 minutes using the component registry, without needing to read source code.
- **SC-006**: 100% of platform component implementations are built on the platform's native UI primitive (SwiftUI for iOS, Jetpack Compose for Android, React DOM for web); any deviation is registered as a native-first exception.
- **SC-007**: 100% of components inherit native platform accessibility behavior (assistive technology labels, focus order, keyboard/switch control, dynamic type) by default; any deviation is registered as an exception.
- **SC-008**: Foundations JSON releases are versioned such that any consumer can determine, in under 1 minute, which Foundations version a given platform release is built against.

## Assumptions

- **"Native" means platform-native UI frameworks**, not cross-platform abstractions. SwiftUI is the iOS target (not UIKit, React Native, or Flutter). Jetpack Compose is the Android target (not Views, React Native, or Flutter). React is the web target (browser DOM via React, not React Native for web).
- **Mattias-Foundations is the single source of truth** for foundational design values. No platform repository defines its own primary foundational values; platforms only consume Foundations.
- **Distribution mechanism is raw JSON only.** Mattias-Foundations publishes exactly the JSON artifact per release; no per-platform wrapper packages (npm, SPM, Maven) are produced by Mattias-Foundations. Each platform repository fetches the JSON via a stable versioned reference and locally produces its platform-idiomatic representation. This honors separation of concerns: Foundations owns design values; each platform owns its consumption pipeline.
- **Repositories are independently maintained but coordinated** through the Figma component library (design-side) and the engineering-side exception registry in Mattias-Foundations. Release cadence is per-repo; parity is preserved through review and the registries rather than lockstep releases.
- **The exception registry is authoritative**: if a deviation is not in the registry, it is treated as accidental drift, not as an accepted exception.
- **The Liquid Glass iOS tab bar is illustrative**, not the only accepted exception. Other intentional platform-specific elements (e.g., Material-3-specific Android affordances) are equally welcome as long as each is registered.
- **Accessibility behavior is treated as a non-negotiable default** inherited from native primitives; the bar to break it is the same as the bar to break parity (explicit registered exception with rationale).
- **The four repositories already exist or will be created** as part of v1; this spec does not prescribe initial repository setup steps, which belong in the implementation plan.
- **JSON is the only emitted artifact from Foundations.** Mattias-Foundations does not emit Swift packages, npm packages, Gradle artifacts, or any other platform-language wrapper. If a platform repository wants generated language bindings, it owns that generation locally.
- **The product surface that consumes these components** (apps using React, SwiftUI, Jetpack Compose) is out of scope for this spec; this spec is about the design system itself.
