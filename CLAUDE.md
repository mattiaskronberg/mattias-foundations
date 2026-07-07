<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
`specs/001-design-system-architecture/plan.md`
<!-- SPECKIT END -->

## figma-cli

The design system's tokens round-trip through Figma via **figma-cli**
(installed at `~/figma-cli`, controls Figma Desktop directly — no API key, no plugin).

Start it:

1. Open **Figma Desktop** (have a design file open, not just the file browser).
2. Connect (Yolo mode, reversible patch):
   ```bash
   node ~/figma-cli/src/index.js connect
   ```
   Safe mode (no app patch, plugin-based): add `--safe`, then run
   **Plugins → Development → FigCli** in Figma.
3. Verify: `node ~/figma-cli/src/index.js daemon status`

Extract tokens to the Foundations artifact:
`node ~/figma-cli/src/index.js extract --sections variables --save tokens.json`
