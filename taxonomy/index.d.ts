// Types for the Prompt Styles taxonomy. They mirror the JSON Schemas in ./schemas.

export type Lang = 'en' | 'pt';

/** A value in every supported language. */
export type Localized<T = string> = Record<Lang, T>;

export interface Style {
  id: string;
  order: number;
  status: 'draft' | 'stable';
  name: Localized;
  aka?: string[];
  summary: Localized;
  definition: Localized;
  /** 0 to 100 on each axis. */
  map: { how: number; verification: number };
  example: { note?: Localized; prompt: Localized };
  reveals: Localized<string[]>;
  use_when: Localized<string[]>;
  watch_out: Localized<string[]>;
  interview: { look_for: Localized<string[]>; ask: Localized<string[]> };
  origin: {
    summary: Localized;
    people?: string[];
    date?: string;
    sources: { title: string; url: string }[];
  };
  related: string[];
}

export interface Source {
  title: string;
  url: string;
}

export interface RubricLevel {
  level: number;
  name: Localized;
  aka?: string[];
  summary: Localized;
  sources?: Source[];
}

/** A band on the focus axis: 0 = business, 100 = tech. */
export interface FocusPosition {
  id: string;
  from: number;
  to: number;
  name: Localized;
  aka?: string[];
  summary: Localized;
  sources?: Source[];
}

export interface RubricDimension {
  id: string;
  /** Which side of the focus axis it measures. "both" counts for the level only. */
  side: 'business' | 'tech' | 'both';
  name: Localized;
  question: Localized;
  descriptors: Localized[];
}

export interface Rubric {
  intro: Localized;
  result_example: Localized;
  levels: RubricLevel[];
  focus: {
    title: Localized;
    description: Localized;
    axis: { low: Localized; high: Localized };
    positions: FocusPosition[];
  };
  scoring: Localized<string[]>;
  dimensions: RubricDimension[];
  interview: {
    title: Localized;
    steps: { minutes: number; name: Localized; description: Localized }[];
    scoring: Localized<string[]>;
    green_flags: Localized<string[]>;
    red_flags: Localized<string[]>;
  };
  prepare: { title: Localized; items: Localized<string[]> };
}

export interface TaxonomyMeta {
  version: string;
  updated: string;
  intro: Localized;
  note: Localized;
  axes: Record<'how' | 'verification', { low: Localized; high: Localized }>;
  scenario: { title: Localized; description: Localized };
}

export interface Taxonomy extends TaxonomyMeta {
  styles: Style[];
  rubric: Rubric;
}

export const TAXONOMY_DIR: string;
export const LANGS: Lang[];
export function readYaml(file: string): unknown;
export function styleFiles(dir?: string): string[];
export function loadStyles(dir?: string): Style[];
export function loadRubric(dir?: string): Rubric;
export function loadMeta(dir?: string): TaxonomyMeta;
export function loadTaxonomy(dir?: string): Taxonomy;
