/** Daty w UTC, format YYYY-MM-DD. Dni robocze = pon.–pt. */

export const MONTHS_SHORT = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

export function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d.getTime());
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

export function isWorkday(d: Date): boolean {
  const w = d.getUTCDay();
  return w !== 0 && w !== 6;
}

export function nextWorkday(d: Date): Date {
  let r = d;
  while (!isWorkday(r)) r = addDays(r, 1);
  return r;
}

/** Koniec zadania trwającego n dni roboczych, licząc dzień startu jako pierwszy. */
export function endAfterWorkdays(start: Date, n: number): Date {
  let r = nextWorkday(start);
  let left = Math.max(1, Math.round(n)) - 1;
  while (left > 0) {
    r = addDays(r, 1);
    if (isWorkday(r)) left--;
  }
  return r;
}

export function workdaysBetween(a: Date, b: Date): number {
  let n = 0;
  for (let d = a; d <= b; d = addDays(d, 1)) if (isWorkday(d)) n++;
  return n;
}

export function todayISO(): string {
  const t = new Date();
  return toISO(new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())));
}

export function defaultStart(offsetDays = 14): string {
  return toISO(nextWorkday(addDays(parseISO(todayISO()), offsetDays)));
}

/** Przerwa zimowa dla mokrych robót zewnętrznych: 15 grudnia – koniec lutego. */
export function winterAdjust(start: Date, days: number): Date {
  let s = start;
  for (let guard = 0; guard < 4; guard++) {
    const y = s.getUTCFullYear();
    const m = s.getUTCMonth();
    const winterFrom = m <= 1 ? new Date(Date.UTC(y - 1, 11, 15)) : new Date(Date.UTC(y, 11, 15));
    const spring = m <= 1 ? new Date(Date.UTC(y, 2, 1)) : new Date(Date.UTC(y + 1, 2, 1));
    const end = endAfterWorkdays(s, days);
    if ((s >= winterFrom && s < spring) || (s < winterFrom && end >= winterFrom)) {
      s = nextWorkday(spring);
      continue;
    }
    return s;
  }
  return s;
}
