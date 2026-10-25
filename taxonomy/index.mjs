// Loader for the Prompt Styles taxonomy.
// Reads the YAML files in this folder and returns plain objects.
// Pass `dir` explicitly when this file is bundled (its own location is then unreliable).

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const TAXONOMY_DIR = dirname(fileURLToPath(import.meta.url));

export const LANGS = ['en', 'pt'];

export function readYaml(file) {
  return parse(readFileSync(file, 'utf8'));
}

/** File names of every style, skipping drafts that start with "_". */
export function styleFiles(dir = TAXONOMY_DIR) {
  return readdirSync(join(dir, 'styles'))
    .filter((f) => f.endsWith('.yaml') && !f.startsWith('_'))
    .sort();
}

export function loadStyles(dir = TAXONOMY_DIR) {
  return styleFiles(dir)
    .map((f) => readYaml(join(dir, 'styles', f)))
    .sort((a, b) => a.order - b.order);
}

export function loadRubric(dir = TAXONOMY_DIR) {
  return readYaml(join(dir, 'rubric.yaml'));
}

export function loadMeta(dir = TAXONOMY_DIR) {
  return readYaml(join(dir, 'taxonomy.yaml'));
}

/** Everything in one object: metadata, styles (sorted) and rubric. */
export function loadTaxonomy(dir = TAXONOMY_DIR) {
  return { ...loadMeta(dir), styles: loadStyles(dir), rubric: loadRubric(dir) };
}
