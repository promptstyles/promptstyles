import type { Lang } from './i18n';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Builds an internal link. `path` is language-neutral and starts with "/",
 * for example "/styles/declarative/". Portuguese pages live under /pt.
 */
export function href(lang: Lang, path = '/'): string {
  const prefix = lang === 'pt' ? '/pt' : '';
  return `${BASE}${prefix}${path}`;
}

/** Link to a file in /public, respecting the base path. */
export function asset(path: string): string {
  return `${BASE}${path}`;
}
