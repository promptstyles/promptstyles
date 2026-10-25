import { HTML_LANG, type Lang } from './i18n';

/** Formats "2025", "2025-06" or "2025-06-19" for display. */
export function formatDate(value: string, lang: Lang): string {
  const [y, m, d] = value.split('-').map(Number);
  if (!m) return String(y);
  const date = new Date(Date.UTC(y, m - 1, d || 1));
  const opts: Intl.DateTimeFormatOptions = d
    ? { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }
    : { year: 'numeric', month: 'long', timeZone: 'UTC' };
  return new Intl.DateTimeFormat(HTML_LANG[lang], opts).format(date);
}

export const pad = (n: number) => String(n).padStart(2, '0');
