import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenPaths, droppedKeys } from '../scripts/drift-check.mjs';

const prev = {
  meta: { version: '0.1.0', schemaVersion: '1.0.0' },
  primitives: { blue: { 500: { $value: '#3B82F6', $type: 'color' } } },
  semantic: {
    color: {
      action: {
        primary: {
          $type: 'color',
          $value: { light: { Mattias: '{primitives.blue.500}' }, dark: { Mattias: '{primitives.blue.500}' } }
        },
        secondary: {
          $type: 'color',
          $value: { light: { Mattias: '{primitives.blue.500}' }, dark: { Mattias: '{primitives.blue.500}' } }
        }
      }
    }
  }
};

test('tokenPaths enumerates every leaf token path in both tiers', () => {
  const paths = tokenPaths(prev);
  assert.ok(paths.includes('primitives.blue.500'));
  assert.ok(paths.includes('semantic.color.action.primary'));
  assert.ok(paths.includes('semantic.color.action.secondary'));
});

test('a removed token key surfaces as a non-zero drift failure', () => {
  const curr = structuredClone(prev);
  delete curr.semantic.color.action.secondary; // removal / rename
  const dropped = droppedKeys(prev, curr, []);
  assert.ok(dropped.includes('semantic.color.action.secondary'));
  assert.ok(dropped.length > 0);
});

test('an explicit migration marker suppresses the drift failure', () => {
  const curr = structuredClone(prev);
  delete curr.semantic.color.action.secondary;
  const migrations = [{ removed: 'semantic.color.action.secondary', reason: 'merged into primary' }];
  const dropped = droppedKeys(prev, curr, migrations);
  assert.deepEqual(dropped, []);
});

test('no false positives when nothing is removed', () => {
  const curr = structuredClone(prev);
  assert.deepEqual(droppedKeys(prev, curr, []), []);
});
