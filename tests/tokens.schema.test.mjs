import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadJson(rel) {
  return JSON.parse(readFileSync(join(root, rel), 'utf8'));
}

const schema = loadJson('schemas/tokens.schema.json');
const tokens = loadJson('tokens.json');

function makeValidator() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(schema);
}

test('tokens.json validates against schemas/tokens.schema.json', () => {
  const validate = makeValidator();
  const ok = validate(tokens);
  assert.equal(ok, true, JSON.stringify(validate.errors, null, 2));
});

test('tokens.json carries meta.version and meta.schemaVersion', () => {
  assert.match(tokens.meta.version, /^\d+\.\d+\.\d+$/);
  assert.match(tokens.meta.schemaVersion, /^\d+\.\d+\.\d+$/);
});

test('a malformed tokens artifact (missing primitives) fails validation', () => {
  const validate = makeValidator();
  const broken = { meta: tokens.meta, semantic: tokens.semantic };
  assert.equal(validate(broken), false);
});
