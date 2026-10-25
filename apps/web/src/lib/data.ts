// Build-time data: taxonomy, rubric, manifesto text and signatories.
// Everything is read from the monorepo, so the site is always in sync with the YAML and Markdown.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { marked, type Token, type Tokens } from 'marked';
import { parse } from 'yaml';
import { loadTaxonomy, type Style } from '@promptstyles/taxonomy';
import type { Lang } from './i18n';

export type { Rubric, Style, Taxonomy } from '@promptstyles/taxonomy';

const ROOT = __REPO_ROOT__;

// ---------- Taxonomy ----------

export const taxonomy = loadTaxonomy(join(ROOT, 'taxonomy'));
export const styles = taxonomy.styles;
export const rubric = taxonomy.rubric;
export const interviewMinutes = rubric.interview.steps.reduce((sum, s) => sum + s.minutes, 0);

export function styleById(id: string): Style {
  const s = styles.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown style "${id}"`);
  return s;
}

// ---------- Signatories ----------

export interface Signatory {
  github: string;
  name: string;
  role: 'engineering' | 'people' | 'other';
  title?: string;
  company?: string;
  location?: string;
  link?: string;
  signed_at: string;
  issue?: number;
}

/** Oldest first, so the list order is the signing order. */
export function loadSignatories(): Signatory[] {
  const dir = join(ROOT, 'manifesto', 'signatories');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.yaml') && !f.startsWith('_'))
    .map((f) => parse(readFileSync(join(dir, f), 'utf8')) as Signatory)
    .sort(
      (a, b) =>
        String(a.signed_at).localeCompare(String(b.signed_at)) ||
        (a.issue ?? Infinity) - (b.issue ?? Infinity) ||
        a.github.localeCompare(b.github),
    );
}

export const signatories = loadSignatories();

export function roleCounts(list: Signatory[]) {
  return list.reduce<Record<string, number>>((acc, s) => ((acc[s.role] = (acc[s.role] ?? 0) + 1), acc), {});
}

// ---------- Manifesto ----------

export interface Manifesto {
  title: string;
  intro: string[]; // HTML paragraphs
  valuesTitle: string;
  values: { left: string; connector: string; right: string }[];
  closing: string;
  principlesTitle: string;
  principles: { title: string; body: string }[];
  footnote: string;
}

const MANIFESTO_FILE: Record<Lang, string> = { en: 'MANIFESTO.md', pt: 'MANIFESTO.pt-BR.md' };
const CONNECTORS = ['over', 'mais que'];

const inline = (s: string) => marked.parseInline(s, { async: false }) as string;

/**
 * Parses MANIFESTO*.md into structured parts. The Markdown must keep this shape:
 * H1, intro paragraphs, H2 + bullet list of "**X** over Y", closing paragraph,
 * H2 + numbered list of "**Title.** Body", a horizontal rule and a footnote paragraph.
 */
export function loadManifesto(lang: Lang): Manifesto {
  const file = join(ROOT, 'manifesto', MANIFESTO_FILE[lang]);
  const tokens = marked.lexer(readFileSync(file, 'utf8')).filter((t) => t.type !== 'space');
  const fail = (msg: string): never => {
    throw new Error(`${MANIFESTO_FILE[lang]}: ${msg}`);
  };

  let i = 0;
  const next = () => tokens[i++];
  const peek = (): Token | undefined => tokens[i];

  const h1 = next() as Tokens.Heading;
  if (h1?.type !== 'heading' || h1.depth !== 1) fail('must start with a "# Title"');

  const intro: string[] = [];
  while (peek()?.type === 'paragraph') intro.push(inline((next() as Tokens.Paragraph).text));

  const valuesH = next() as Tokens.Heading;
  if (valuesH?.type !== 'heading' || valuesH.depth !== 2) fail('expected "## We value" after the intro');
  const valuesList = next() as Tokens.List;
  if (valuesList?.type !== 'list' || valuesList.ordered) fail('expected a bullet list of values');
  const values = valuesList.items.map((item) => {
    const m = item.text.trim().match(new RegExp(`^\\*\\*(.+?)\\*\\*\\s+(${CONNECTORS.join('|')})\\s+(.+)$`, 's'));
    if (!m) return fail(`value "${item.text}" must look like "**Left** ${CONNECTORS[0]} right"`);
    return { left: inline(m[1]), connector: m[2], right: inline(m[3]) };
  });
  const closingP = next() as Tokens.Paragraph;
  if (closingP?.type !== 'paragraph') fail('expected a closing paragraph after the values');

  const principlesH = next() as Tokens.Heading;
  if (principlesH?.type !== 'heading' || principlesH.depth !== 2) fail('expected "## Principles"');
  const principlesList = next() as Tokens.List;
  if (principlesList?.type !== 'list' || !principlesList.ordered) fail('expected a numbered list of principles');
  const principles = principlesList.items.map((item) => {
    const m = item.text.trim().match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
    if (!m) return fail(`principle "${item.text}" must start with a bold title`);
    return { title: inline(m[1]), body: inline(m[2].trim()) };
  });

  if (peek()?.type === 'hr') next();
  const foot = next() as Tokens.Paragraph | undefined;

  return {
    title: h1.text,
    intro,
    valuesTitle: valuesH.text,
    values,
    closing: inline(closingP.text),
    principlesTitle: principlesH.text,
    principles,
    footnote: foot?.type === 'paragraph' ? inline(foot.text) : '',
  };
}
