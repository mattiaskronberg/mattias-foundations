# Figma naming convention (design-team owned)

The cross-platform component registry lives in the shared **Figma library**. A
component's Figma **name** — and nothing else — tells every reader whether it is
cross-platform (synced) or platform-specific. This convention is owned by the design
team (FR-010) and is the counterpart to the engineering-side `exceptions.json`.

## The rule

- **Cross-platform (default):** a plain component name, no platform prefix.
  Example: `Button`, `TabBar`, `Card`. These are expected to reach parity on every
  platform.

- **Platform-specific:** a **suffix** in parentheses naming the platform(s) it is
  scoped to. Example: `TabBar (iOS)`, `DatePicker (Android)`, `Tooltip (Web)`.

We use a **suffix**, not a prefix, so components sort and group by their canonical name
in the Figma layers panel and asset browser — `TabBar` and `TabBar (iOS)` sit together.

## Format

```
<CanonicalName>[ (<Platform>[, <Platform>…])]
```

- **Casing:** canonical name in PascalCase (matches component naming); platform labels
  use the exact casing below.
- **Allowed platform labels:** `iOS`, `Android`, `Web`. (These map to the
  `exceptions.json` platform enum `ios` / `android` / `web`.)
- **Multiple platforms:** comma-separated inside the single suffix, e.g.
  `Sheet (iOS, Android)`.
- **Spacing:** exactly one space before `(`; no space inside the parentheses edges.

## Examples

| Figma name | Meaning |
|------------|---------|
| `Button` | Cross-platform; parity expected everywhere. |
| `TabBar (iOS)` | iOS-only variant/behavior. |
| `DatePicker (Android)` | Android-only. |
| `Tooltip (Web)` | Web-only (no touch equivalent). |
| `Sheet (iOS, Android)` | Shared by the two mobile platforms, not web. |

## Link to engineering governance

Any component whose Figma name marks it platform-specific **MUST** have a corresponding
entry in [`exceptions.json`](../exceptions.json) before that deviation ships on the
platform's main branch (see [`platform-onboarding.md`](./platform-onboarding.md)). The
Figma name is the design-side signal; the `exceptions.json` entry is the engineering-side
record — the two must agree.
