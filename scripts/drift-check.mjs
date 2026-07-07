#!/usr/bin/env node
// No-Silent-Drift enforcement (Constitution IV):
//   1. Every semantic token resolves to an existing primitive for every declared
//      (theme, brand) — light + dark + Mattias are mandatory in v1.
//   2. A token key present in the previous release that is removed/renamed in the
//      current artifact fails the check unless an explicit migration marker covers it.
// This module exports pure helpers (unit-tested) plus a main() that wires them to
// tokens.json, migrations.json and the previous git-tagged release.

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ALIAS_RE = /^\{primitives(\.[A-Za-z0-9_-]+)+\}$/;
const REQUIRED_THEMES = ['light', 'dark'];
const REQUIRED_BRAND = 'Mattias';

function isTokenLeaf(node) {
  return node && typeof node === 'object' && '$value' in node;
}

// Enumerate every leaf token path (dotted, including the top-level tier name).
export function tokenPaths(tokens) {
  const out = [];
  for (const tier of ['primitives', 'semantic']) {
    walk(tokens[tier], tier, out);
  }
  return out.sort();
}

function walk(node, prefix, out) {
  if (!node || typeof node !== 'object') return;
  if (isTokenLeaf(node)) {
    out.push(prefix);
    return;
  }
  for (const key of Object.keys(node)) {
    walk(node[key], prefix ? `${prefix}.${key}` : key, out);
  }
}

// The set of primitive token paths, e.g. "primitives.color.blue.600".
function primitivePathSet(tokens) {
  const out = [];
  walk(tokens.primitives, 'primitives', out);
  return new Set(out);
}

// Collect every semantic leaf together with its dotted path.
function semanticLeaves(tokens, prefix = 'semantic', node = tokens.semantic, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (isTokenLeaf(node)) {
    acc.push({ path: prefix, token: node });
    return acc;
  }
  for (const key of Object.keys(node)) {
    semanticLeaves(tokens, `${prefix}.${key}`, node[key], acc);
  }
  return acc;
}

// Resolution + alias-existence errors. Returns [] when the artifact is fully resolved.
export function resolutionErrors(tokens) {
  const errors = [];
  const primitives = primitivePathSet(tokens);
  for (const { path, token } of semanticLeaves(tokens)) {
    const themes = token.$value ?? {};
    for (const theme of REQUIRED_THEMES) {
      if (!(theme in themes)) {
        errors.push(`${path}: missing required theme "${theme}"`);
      }
    }
    for (const theme of Object.keys(themes)) {
      const brands = themes[theme] ?? {};
      if (!(REQUIRED_BRAND in brands)) {
        errors.push(`${path}: theme "${theme}" missing required brand "${REQUIRED_BRAND}"`);
      }
      for (const brand of Object.keys(brands)) {
        const alias = brands[brand];
        if (typeof alias !== 'string' || !ALIAS_RE.test(alias)) {
          errors.push(`${path}: (${theme}, ${brand}) is not a valid primitive alias: ${JSON.stringify(alias)}`);
          continue;
        }
        const target = alias.slice(1, -1); // strip { }
        if (!primitives.has(target)) {
          errors.push(`${path}: (${theme}, ${brand}) alias ${alias} points at a non-existent primitive`);
        }
      }
    }
  }
  return errors;
}

// Keys present in prev but absent in curr, excluding those covered by a migration marker.
export function droppedKeys(prev, curr, migrations = []) {
  const currSet = new Set(tokenPaths(curr));
  const migrated = new Set((migrations ?? []).map((m) => m.removed));
  return tokenPaths(prev)
    .filter((p) => !currSet.has(p) && !migrated.has(p))
    .sort();
}

// --- I/O helpers (used only by main) --------------------------------------

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function loadMigrations() {
  const path = join(ROOT, 'migrations.json');
  return existsSync(path) ? loadJson(path) : [];
}

// The tokens.json from the most recent vX.Y.Z git tag, or null if none exists.
function previousReleaseTokens() {
  let latestTag;
  try {
    const tags = execSync('git tag --list "v*.*.*"', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length === 0) return null;
    latestTag = tags
      .map((t) => ({ t, v: t.replace(/^v/, '').split('.').map(Number) }))
      .sort((a, b) => a.v[0] - b.v[0] || a.v[1] - b.v[1] || a.v[2] - b.v[2])
      .at(-1).t;
    const raw = execSync(`git show ${latestTag}:tokens.json`, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return { tag: latestTag, tokens: JSON.parse(raw) };
  } catch {
    return null; // no git, no tag, or no tokens.json at that tag — nothing to diff
  }
}

function main() {
  const tokens = loadJson(join(ROOT, 'tokens.json'));
  const problems = [];

  const resErrors = resolutionErrors(tokens);
  problems.push(...resErrors);

  const prev = previousReleaseTokens();
  if (prev) {
    const dropped = droppedKeys(prev.tokens, tokens, loadMigrations());
    for (const key of dropped) {
      problems.push(`drift vs ${prev.tag}: token "${key}" was removed/renamed without a migration marker in migrations.json`);
    }
  } else {
    console.log('drift-check: no previous release tag found — skipping release diff (resolution checks still ran).');
  }

  if (problems.length > 0) {
    console.error(`drift-check FAILED with ${problems.length} problem(s):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log('drift-check OK: all semantic tokens resolve; no un-migrated removals.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
