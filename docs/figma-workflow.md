# Authoring workflow: Figma → tokens.json

The design team authors foundational values as **variables in the shared Figma
library**. Figma is the authoring surface; the committed `tokens.json` is the single
source of truth (Constitution I, research R3). Nothing consumes values from Figma
directly.

## Round-trip

1. **Author in Figma.** Add or adjust a variable in the shared library (e.g.
   `color.action.primary`, `space.4`, `line-height.body`). Follow the two-tier model:
   raw values live as **primitives**; purpose-named variables that point at a primitive
   per theme/brand are **semantic**.

2. **Extract to the artifact.** With `figma-cli` connected to Figma Desktop:

   ```bash
   node ~/figma-cli/src/index.js connect          # once per session (Yolo mode)
   node ~/figma-cli/src/index.js extract --sections variables --save tokens.json
   ```

3. **Validate before committing.**

   ```bash
   node scripts/validate.mjs && node scripts/drift-check.mjs && node --test
   ```

4. **Commit.** The committed `tokens.json` is now authoritative. Diffs are reviewable
   in the PR; CI (`.github/workflows/validate.yml`) re-runs the same three checks.

## Rules that keep Figma and JSON in sync

- **JSON wins after commit.** If Figma and the committed JSON disagree, the JSON is
  correct. Use `figma-cli import` to push the committed JSON back into Figma and
  reconcile, never the reverse.
- **line-height variables are stored in px, not ratios**, so Figma can bind them
  directly to text styles.
- **Semantic values are aliases**, `{primitives.…}` — a semantic variable must not
  inline a raw value.
- Every semantic token must resolve for **every** `(theme, brand)` (`light`/`dark` ×
  `Mattias` in v1). `drift-check.mjs` fails the build otherwise.

## Themes and brands

Theme (`light`/`dark`) and brand (`Mattias`, plus any future brands) are the two
resolution dimensions carried by every semantic token. Adding a brand is a
non-breaking change (see `docs/naming-convention.md` and the schema's open-ended
`brand` keys). Free Figma has no modes, so the theme × brand overlay is owned in the
JSON, not in Figma.
