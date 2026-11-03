'use client';

import { useEffect, useRef, useState } from 'react';
import { defaultStart, todayISO } from '@/lib/dates';
import { load, save } from '@/lib/storage';

function fromQuery(str: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  new URLSearchParams(str).forEach((v, k) => {
    if (k === 'works') out[k] = v ? v.split(',') : [];
    else if (v === 'true' || v === 'false') out[k] = v === 'true';
    else if (/^-?\d+(\.\d+)?$/.test(v)) out[k] = Number(v);
    else out[k] = v;
  });
  return out;
}

export function toQuery(p: Record<string, unknown>): string {
  const q = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => q.set(k, Array.isArray(v) ? v.join(',') : String(v)));
  return q.toString();
}

/**
 * Stan formularza kalkulatora. Po zamontowaniu wczytuje parametry z linku (#…) lub z ostatniej sesji,
 * a każdą zmianę zapisuje lokalnie. `ready` = false podczas renderu na serwerze (data startu zależy od „dziś”).
 */
export function useCalcState<T extends { start: string }>(storageKey: string, defaults: Omit<T, 'start'>) {
  const [params, setParams] = useState<T>({ ...defaults, start: '' } as T);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const saved = hash.length > 2 ? fromQuery(hash) : load<Partial<T> | null>(storageKey, null);
    const next = { ...defaults, ...(saved ?? {}) } as T;
    if (!next.start || next.start < todayISO()) next.start = defaultStart(14);
    setParams(next);
    setReady(true);
    loaded.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (loaded.current) save(storageKey, params);
  }, [storageKey, params]);

  const set = <K extends keyof T>(key: K, value: T[K]) => setParams((p) => ({ ...p, [key]: value }));

  return { params, set, setParams, ready };
}
