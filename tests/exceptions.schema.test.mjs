import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(readFileSync(join(root, 'schemas/exceptions.schema.json'), 'utf8'));

function makeValidator() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(schema);
}

const wellFormed = {
  component: 'TabBar',
  platforms: ['ios'],
  type: 'visual',
  rationale: 'iOS Liquid Glass tab bar — platform-idiomatic material.',
  acceptedDate: '2026-07-06'
};

test('the shipped exceptions.json ([]) validates', () => {
  const validate = makeValidator();
  const data = JSON.parse(readFileSync(join(root, 'exceptions.json'), 'utf8'));
  assert.equal(validate(data), true, JSON.stringify(validate.errors, null, 2));
});

test('a well-formed entry validates', () => {
  const validate = makeValidator();
  assert.equal(validate([wellFormed]), true, JSON.stringify(validate.errors, null, 2));
});

test('a missing rationale fails', () => {
  const validate = makeValidator();
  const { rationale, ...noRationale } = wellFormed;
  assert.equal(validate([noRationale]), false);
});

test('a malformed acceptedDate fails', () => {
  const validate = makeValidator();
  assert.equal(validate([{ ...wellFormed, acceptedDate: '07/06/2026' }]), false);
});

test('an unknown platform fails', () => {
  const validate = makeValidator();
  assert.equal(validate([{ ...wellFormed, platforms: ['windows'] }]), false);
});
