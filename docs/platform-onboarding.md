# Platform onboarding & the exception governance process

How a platform repo (React/web, SwiftUI/iOS, Jetpack Compose/Android) joins the design
system and how any deviation from parity is governed. v1 ships this **process** plus an
empty exception registry; component implementations arrive in later releases.

## Onboarding a platform repo

1. **Create an independently versioned repo** (e.g. `Mattias-React`,
   `Mattias-SwiftUI`, `Mattias-Compose`). It is not part of Foundations and does not
   release in lockstep (Constitution VII).
2. **Pin a Foundations version** and consume `tokens.json` per
   [`consumption.md`](./consumption.md): fetch the pinned release asset, validate it
   against `tokens.schema.json`, generate a platform-idiomatic representation locally.
3. **Build components against the semantic tokens**, never against raw primitives and
   never against hardcoded values (Constitution I). Meet the accessibility baseline
   (Constitution VI) as a non-negotiable default.
4. **Follow the Figma naming convention** ([`naming-convention.md`](./naming-convention.md))
   to know which components are cross-platform and which are platform-specific.

## Parity by default, exceptions by governance (Constitution III)

Every component is expected to reach **parity** across platforms by default. A platform
may intentionally deviate — visually, behaviorally, in naming, or by being native-first —
**only** when the deviation is recorded in `exceptions.json`.

### The merge gate

> **No deviation may merge into a platform's main branch without a matching
> `exceptions.json` entry in Foundations, merged first.**

Enforcement sequence:

1. Open a PR against **Foundations** adding an entry to `exceptions.json`:

   ```json
   {
     "component": "TabBar",
     "platforms": ["ios"],
     "type": "visual",
     "rationale": "iOS Liquid Glass tab bar — platform-idiomatic material.",
     "acceptedDate": "2026-07-06",
     "approvedBy": "maintainer-handle"
   }
   ```

   CI (`validate.yml`) validates it against `schemas/exceptions.schema.json`. A malformed
   entry (missing `rationale`, bad `acceptedDate`, unknown platform) fails the gate.

2. Once that entry is merged and a Foundations version carrying it is released, the
   platform PR implementing the deviation may merge — its reviewer confirms the pinned
   Foundations version contains the matching entry.

### Entry fields

| Field | Required | Notes |
|-------|----------|-------|
| `component` | yes | Canonical cross-platform component name. |
| `platforms` | yes | Non-empty subset of `ios` / `android` / `web`. |
| `type` | yes | `visual` \| `behavioral` \| `naming` \| `native-first`. |
| `rationale` | yes | Why the deviation is accepted. |
| `acceptedDate` | yes | `YYYY-MM-DD`. |
| `approvedBy` | no | Maintainer who approved it. |
| `implementations` | no | Per-platform links, filled in when the component ships. |

## What is NOT an exception

Adding a new brand or theme, or a new token, is a normal non-breaking Foundations change —
not a deviation. Exceptions are strictly for components departing from cross-platform parity
or the native-first principle.
