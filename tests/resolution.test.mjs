import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolutionErrors } from '../scripts/drift-check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));

test('every semantic token resolves to an existing primitive for every (theme, brand)', () => {
  const errors = resolutionErrors(tokens);
  assert.deepEqual(errors, [], errors.join('\n'));
});

test('a dangling alias is reported as a resolution error', () => {
  const broken = structuredClone(tokens);
  // Point some semantic token's light/Mattias at a non-existent primitive.
  const firstGroup = Object.keys(broken.semantic)[0];
  const node = broken.semantic[firstGroup];
  const leaf = findFirstLeaf(node);
  leaf.$value.light.Mattias = '{primitives.does.not.exist}';
  const errors = resolutionErrors(broken);
  assert.ok(errors.length > 0, 'expected at least one resolution error');
});

test('a missing (theme, brand) resolution is reported', () => {
  const broken = structuredClone(tokens);
  const firstGroup = Object.keys(broken.semantic)[0];
  const leaf = findFirstLeaf(broken.semantic[firstGroup]);
  delete leaf.$value.dark;
  const errors = resolutionErrors(broken);
  assert.ok(errors.length > 0, 'expected a missing-theme resolution error');
});

function findFirstLeaf(node) {
  if (node && typeof node === 'object' && '$value' in node) return node;
  for (const key of Object.keys(node)) {
    const found = findFirstLeaf(node[key]);
    if (found) return found;
  }
  return null;
}
