import type { Lang } from './i18n/lang';

/** Fecha en formato `AAAA-MM` (mes 1-12). */
export type YearMonth = `${number}-${number}`;

function toDate(value: YearMonth): Date {
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/** "ene 2024" / "Jan 2024". */
export function formatMonth(value: YearMonth, lang: Lang): string {
  const text = new Intl.DateTimeFormat(lang === 'es' ? 'es-DO' : 'en-US', { month: 'short', year: 'numeric' }).format(
    toDate(value),
  );
  return text.replace('.', '').replace(/^\w/, (c) => c.toUpperCase());
}

/** Meses completos entre dos fechas, contando ambos extremos (ene–mar = 3). */
export function monthsBetween(start: YearMonth, end: YearMonth | null, now = new Date()): number {
  const from = toDate(start);
  const to = end ? toDate(end) : now;
  return Math.max(1, (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1);
}

/** "2 años 9 meses" / "2 yrs 9 mos". */
export function formatDuration(
  totalMonths: number,
  words: { year: string; years: string; month: string; months: string },
): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? words.year : words.years}`);
  if (months) parts.push(`${months} ${months === 1 ? words.month : words.months}`);
  return parts.join(' ');
}
