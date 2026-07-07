# Recap

Mattias-Foundations is the single source of truth for the Mattias Design System — a
versioned, DTCG-conformant `tokens.json` (primitives + semantic tokens resolving per
theme × brand) plus a governed `exceptions.json` registry, shipped via GitHub Releases at
`github.com/mattiaskronberg/mattias-foundations` with no platform code in-repo. Foundations
v1 is fully done and released (`v0.1.0` asset published and verified); an **Input**
component set was also authored in Figma (Md size; Default/Focus/Filled/Error/Disabled
states, fully bound to semantic tokens). Most recently, CI was bumped to
`actions/checkout@v5` / `setup-node@v5` on Node 22 (validate green), and the superseded
`figma-plugin/` seed was removed to keep the repo aligned with the figma-cli + JSON-as-SoT
workflow (`.specify/` was kept for future Spec Kit work). Next possible work: start a
platform repo pinning v0.1.0, or extend the token set / add a second brand.
