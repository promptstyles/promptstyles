import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadRubric } from '../taxonomy/index.mjs';
import { scoreSession } from '../taxonomy/score.mjs';

const rubric = loadRubric();
const ids = rubric.dimensions.map((d) => d.id);
const all = (n) => Object.fromEntries(ids.map((id) => [id, n]));
const by = (side, n, rest) =>
  Object.fromEntries(rubric.dimensions.map((d) => [d.id, d.side === side ? n : rest]));

test('returns null until every dimension has a valid score', () => {
  assert.equal(scoreSession(rubric, {}), null);
  assert.equal(scoreSession(rubric, { ...all(3), framing: undefined }), null);
  assert.equal(scoreSession(rubric, { ...all(3), framing: 9 }), null);
});

test('balanced scores land on Product Engineer in the middle', () => {
  const r = scoreSession(rubric, all(3));
  assert.equal(r.level.name.en, 'AI-Native');
  assert.equal(r.position, 50);
  assert.equal(r.focus.id, 'product-engineer');
});

test('the ends of the axis', () => {
  assert.equal(scoreSession(rubric, by('business', 4, 1)).focus.id, 'business-operator');
  assert.equal(scoreSession(rubric, by('tech', 4, 1)).focus.id, 'architect');
});

test('a moderate lean picks the inner positions', () => {
  // business 3, tech 2 -> gap -1 -> position ~33
  const builder = scoreSession(rubric, { ...by('business', 3, 2), style: 3 });
  assert.equal(builder.focus.id, 'business-builder');
  // tech 3, business 2 -> gap +1 -> position ~67
  const software = scoreSession(rubric, { ...by('tech', 3, 2), style: 3 });
  assert.equal(software.focus.id, 'software-engineer');
});

test('level rounds to the nearest level and halves round down', () => {
  const half = Object.fromEntries(ids.map((id, i) => [id, i % 2 ? 3 : 2])); // average 2.5
  assert.equal(scoreSession(rubric, half).level.level, 2);
  assert.equal(scoreSession(rubric, all(1)).level.name.en, 'AI User');
  assert.equal(scoreSession(rubric, all(4)).level.name.en, 'AI Leader');
});

test('the focus bands cover the whole axis', () => {
  const p = rubric.focus.positions;
  assert.equal(p[0].from, 0);
  assert.equal(p.at(-1).to, 100);
  assert.equal(p.find((x) => x.id === 'product-engineer').from <= 50, true);
  assert.equal(p.find((x) => x.id === 'product-engineer').to > 50, true);
});
