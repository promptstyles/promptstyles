#!/usr/bin/env node
// Validates the taxonomy, the rubric and every signatory file.
// Runs in CI on every pull request. Exit code 1 means something is wrong.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TAX = join(ROOT, 'taxonomy');
const SIGS = join(ROOT, 'manifesto', 'signatories');
const LANGS = ['en', 'pt'];

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
function readYaml(p, label) {
  try {
    return parse(readFileSync(p, 'utf8'));
  } catch (e) {
    fail(label, `invalid YAML: ${e.message}`);
    return undefined;
  }
}

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema(readJson(join(TAX, 'schemas', 'common.schema.json')));
const validators = {
  taxonomy: ajv.compile(readJson(join(TAX, 'schemas', 'taxonomy.schema.json'))),
  style: ajv.compile(readJson(join(TAX, 'schemas', 'style.schema.json'))),
  rubric: ajv.compile(readJson(join(TAX, 'schemas', 'rubric.schema.json'))),
  signatory: ajv.compile(readJson(join(ROOT, 'manifesto', 'signatory.schema.json'))),
};

function check(kind, data, label) {
  if (data === undefined) return false;
  const validate = validators[kind];
  if (validate(data)) return true;
  for (const e of validate.errors) fail(label, `${e.instancePath || '/'} ${e.message}`);
  return false;
}

// Every { en: [...], pt: [...] } list must have the same number of items in each language,
// so translations do not silently drift apart.
function checkListParity(node, label, path = '') {
  if (!node || typeof node !== 'object') return;
  if (LANGS.every((l) => Array.isArray(node[l]))) {
    const counts = LANGS.map((l) => node[l].length);
    if (new Set(counts).size > 1) fail(label, `${path || '/'} has ${LANGS.map((l, i) => `${counts[i]} ${l}`).join(' vs ')} items`);
    return;
  }
  for (const [k, v] of Object.entries(node)) checkListParity(v, label, `${path}/${k}`);
}

// --- Taxonomy metadata ---
const meta = readYaml(join(TAX, 'taxonomy.yaml'), 'taxonomy/taxonomy.yaml');
check('taxonomy', meta, 'taxonomy/taxonomy.yaml');

// --- Styles ---
const styleFiles = readdirSync(join(TAX, 'styles')).filter((f) => f.endsWith('.yaml') && !f.startsWith('_'));
const styles = [];
for (const f of styleFiles) {
  const label = `taxonomy/styles/${f}`;
  const s = readYaml(join(TAX, 'styles', f), label);
  if (!check('style', s, label)) continue;
  if (`${s.id}.yaml` !== f) fail(label, `file name must be "${s.id}.yaml"`);
  checkListParity(s, label);
  styles.push(s);
}
const ids = new Set(styles.map((s) => s.id));
const orders = new Map();
for (const s of styles) {
  const label = `taxonomy/styles/${s.id}.yaml`;
  if (orders.has(s.order)) fail(label, `order ${s.order} is also used by "${orders.get(s.order)}"`);
  orders.set(s.order, s.id);
  for (const r of s.related) {
    if (r === s.id) fail(label, 'a style cannot be related to itself');
    else if (!ids.has(r)) fail(label, `related style "${r}" does not exist`);
  }
}

// --- Rubric ---
const rubric = readYaml(join(TAX, 'rubric.yaml'), 'taxonomy/rubric.yaml');
if (check('rubric', rubric, 'taxonomy/rubric.yaml')) {
  checkListParity(rubric, 'taxonomy/rubric.yaml');
  rubric.levels.forEach((l, i) => {
    if (l.level !== i + 1) fail('taxonomy/rubric.yaml', `levels must be numbered 1..n in order (found ${l.level} at position ${i + 1})`);
  });
  for (const d of rubric.dimensions) {
    if (d.descriptors.length !== rubric.levels.length) {
      fail('taxonomy/rubric.yaml', `dimension "${d.id}" has ${d.descriptors.length} descriptors, expected ${rubric.levels.length} (one per level)`);
    }
  }
}

// --- Signatories ---
let signatories = 0;
if (existsSync(SIGS)) {
  const seen = new Map();
  for (const f of readdirSync(SIGS).filter((f) => f.endsWith('.yaml') && !f.startsWith('_'))) {
    const label = `manifesto/signatories/${f}`;
    const s = readYaml(join(SIGS, f), label);
    if (!check('signatory', s, label)) continue;
    const expected = `${s.github.toLowerCase()}.yaml`;
    if (f !== expected) fail(label, `file name must be "${expected}"`);
    const key = s.github.toLowerCase();
    if (seen.has(key)) fail(label, `duplicate signature for "${s.github}" (also in ${seen.get(key)})`);
    seen.set(key, f);
    signatories++;
  }
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s) found:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}
console.log(`✓ taxonomy v${meta.version}: ${styles.length} styles, rubric with ${rubric.dimensions.length} dimensions, ${signatories} ${signatories === 1 ? 'signatory' : 'signatories'}`);
