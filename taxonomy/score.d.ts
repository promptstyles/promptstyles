import type { FocusPosition, Rubric, RubricLevel } from './index';

export interface SessionResult {
  /** Average of every dimension. */
  average: number;
  level: RubricLevel;
  /** Average of the business-side dimensions. */
  business: number;
  /** Average of the tech-side dimensions. */
  tech: number;
  /** 0 = business, 100 = tech. */
  position: number;
  focus: FocusPosition;
}

/** Returns null while any dimension is missing a score. */
export function scoreSession(rubric: Pick<Rubric, 'dimensions' | 'levels' | 'focus'>, scores: Record<string, number>): SessionResult | null;
