'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RENO_PRESETS, SCOPES, estimateHouse, estimateReno } from '@/lib/engine';
import * as fmt from '@/lib/format';

// stała data startu: wynik jest deterministyczny, więc SSR i przeglądarka renderują to samo
const START = '2027-03-01';
const PRESETS = RENO_PRESETS.filter((p) => p.id !== 'deweloperski');

/** Animowane przejście między dwiema liczbami (licznik), z poszanowaniem prefers-reduced-motion. */
function useTween(target: number, ms = 650) {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const v = a + (target - a) * (1 - Math.pow(1 - t, 3));
      from.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}

export function QuickEstimate() {
  const [mode, setMode] = useState<'dom' | 'remont'>('dom');
  const [houseArea, setHouseArea] = useState(120);
  const [scope, setScope] = useState(3);
  const [flatArea, setFlatArea] = useState(55);
  const [preset, setPreset] = useState('standard');

  const isHouse = mode === 'dom';
  const area = isHouse ? houseArea : flatArea;
  const works = PRESETS.find((p) => p.id === preset)?.works ?? PRESETS[1].works;

  const est = useMemo(
    () =>
      isHouse
        ? estimateHouse({ area: houseArea, scope, formal: false, utilities: false, reserve: 0, start: START })
        : estimateReno({ area: flatArea, works, reserve: 0, start: START }),
    [isHouse, houseArea, scope, flatArea, works],
  );

  const shown = useTween(Math.round(est.totals.total / 1000) * 1000);
  const href = isHouse
    ? `/kalkulator-budowy-domu/#area=${houseArea}&scope=${scope}`
    : `/kalkulator-remontu-mieszkania/#area=${flatArea}&works=${works.join(',')}`;
  const [min, max] = isHouse ? [60, 300] : [20, 150];

  return (
    <div className="quick">
      <div className="quick-tabs" role="tablist" aria-label="Rodzaj inwestycji">
        <button type="button" role="tab" aria-selected={isHouse} onClick={() => setMode('dom')}>Budowa domu</button>
        <button type="button" role="tab" aria-selected={!isHouse} onClick={() => setMode('remont')}>Remont mieszkania</button>
      </div>

      <div className="quick-body">
        <div className="quick-inputs">
          <label className="quick-area">
            <span>Powierzchnia</span>
            <output>{area}<small> m²</small></output>
            <input
              type="range"
              className="ruler"
              min={min}
              max={max}
              step={isHouse ? 5 : 1}
              value={area}
              style={{ ['--fill' as string]: `${((area - min) / (max - min)) * 100}%` }}
              onChange={(e) => (isHouse ? setHouseArea : setFlatArea)(Number(e.target.value))}
              aria-label="Powierzchnia w metrach kwadratowych"
            />
          </label>

          <div className="quick-chips" role="radiogroup" aria-label={isHouse ? 'Zakres budowy' : 'Zakres remontu'}>
            {isHouse
              ? SCOPES.map((s) => (
                  <button key={s.v} type="button" role="radio" aria-checked={scope === s.v} onClick={() => setScope(s.v)}>
                    {s.short}
                  </button>
                ))
              : PRESETS.map((p) => (
                  <button key={p.id} type="button" role="radio" aria-checked={preset === p.id} onClick={() => setPreset(p.id)}>
                    {p.name.replace('Remont ', '')}
                  </button>
                ))}
          </div>
        </div>

        <div className="quick-out">
          <div className="quick-result" aria-live="polite">
            <span className="quick-caption">Szacunkowy koszt</span>
            <strong>{fmt.pln(shown)}</strong>
            <span className="quick-meta">
              {fmt.pln(est.totals.total / area, 10)}/m² · {isHouse ? `${fmt.num(est.schedule.months)} mies. pracy` : `${est.schedule.workdays} dni roboczych`}
            </span>
          </div>

          <Link className="btn btn-primary quick-cta" href={href}>
            Pełny kosztorys
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
