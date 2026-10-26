// Turns rubric scores into the two readings: level and focus.
// No dependencies, so it runs in Node and in the browser.

/**
 * @param {object} rubric  The rubric (taxonomy/rubric.yaml).
 * @param {Record<string, number>} scores  One score per dimension id, from 1 to the number of levels.
 * @returns {null | { average: number, level: object, business: number, tech: number, position: number, focus: object }}
 *   null while any dimension is missing a score.
 */
export function scoreSession(rubric, scores) {
  const dims = rubric.dimensions;
  const max = rubric.levels.length;
  const values = dims.map((d) => Number(scores[d.id]));
  if (values.some((v) => !Number.isFinite(v) || v < 1 || v > max)) return null;

  const mean = (list) => list.reduce((a, b) => a + b, 0) / list.length;
  const average = mean(values);
  // Nearest level; exact halves round down (2.5 -> 2).
  const levelNumber = Math.min(max, Math.max(1, Math.ceil(average - 0.5)));

  const side = (name) => mean(dims.filter((d) => d.side === name).map((d) => Number(scores[d.id])));
  const business = side('business');
  const tech = side('tech');

  // 0 = all business, 100 = all tech. The widest possible gap is (max - 1).
  const position = Math.min(100, Math.max(0, 50 + ((tech - business) / (max - 1)) * 50));
  const positions = rubric.focus.positions;
  const focus = positions.find((p) => position < p.to) ?? positions[positions.length - 1];

  return {
    average,
    level: rubric.levels.find((l) => l.level === levelNumber),
    business,
    tech,
    position,
    focus,
  };
}
