#!/usr/bin/env node
// Schema validation for both canonical artifacts (FR-002).
//   - tokens.json      against schemas/tokens.schema.json
//   - exceptions.json  against schemas/exceptions.schema.json  (if present)
// Non-zero exit on any validation failure so CI gates on it.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function makeAjv() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv;
}

function validateArtifact(ajv, dataPath, schemaPath, label) {
  const schema = loadJson(schemaPath);
  const data = loadJson(dataPath);
  const validate = ajv.compile(schema);
  if (validate(data)) {
    console.log(`✓ ${label} validates against ${schemaPath.replace(ROOT + '/', '')}`);
    return true;
  }
  console.error(`✗ ${label} FAILED validation:`);
  for (const err of validate.errors ?? []) {
    console.error(`  - ${err.instancePath || '/'} ${err.message}`);
  }
  return false;
}

function main() {
  const ajv = makeAjv();
  let ok = true;

  ok = validateArtifact(ajv, join(ROOT, 'tokens.json'), join(ROOT, 'schemas/tokens.schema.json'), 'tokens.json') && ok;

  const exceptionsPath = join(ROOT, 'exceptions.json');
  if (existsSync(exceptionsPath)) {
    ok = validateArtifact(ajv, exceptionsPath, join(ROOT, 'schemas/exceptions.schema.json'), 'exceptions.json') && ok;
  } else {
    console.log('validate: exceptions.json not present — skipping (it ships in Phase 4).');
  }

  if (!ok) process.exit(1);
  console.log('validate OK: all artifacts conform to their schemas.');
}

main();
