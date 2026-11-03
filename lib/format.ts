import { MONTHS_SHORT, parseISO } from './dates.ts';

export function pln(v: number, round = 1): string {
  const n = Math.round((Number(v) || 0) / round) * round;
  return n.toLocaleString('pl-PL', { maximumFractionDigits: 0 }) + ' zł';
}

export function num(v: number, digits = 1): string {
  return (Number(v) || 0).toLocaleString('pl-PL', { maximumFractionDigits: digits });
}

export function date(iso?: string | null): string {
  if (!iso) return '–';
  const d = parseISO(iso);
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function month(key: string): string {
  const [y, m] = key.split('-');
  return `${MONTHS_SHORT[Number(m) - 1]} ${y.slice(2)}`;
}

export function slug(s: string): string {
  const map: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };
  return (
    s
      .toLowerCase()
      .replace(/[ąćęłńóśźż]/g, (c) => map[c])
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'projekt'
  );
}
