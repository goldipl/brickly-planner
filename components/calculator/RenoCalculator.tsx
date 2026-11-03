'use client';

import { useMemo } from 'react';
import { LOCATIONS, REGIONS } from '@/lib/data';
import { RENO_DEFAULTS, RENO_PRESETS, RENO_WORKS, estimateReno } from '@/lib/engine';
import type { RenoParams, WorkId } from '@/lib/engine';
import { DateField, Group, Range, Seg, Select } from './Fields';
import { Results } from './Results';
import { toQuery, useCalcState } from './useCalcState';

const DEFAULTS = { ...RENO_DEFAULTS, works: RENO_PRESETS[1].works };

export function RenoCalculator() {
  const { params: p, set, ready } = useCalcState<RenoParams>('brickly.calc.remont', DEFAULTS);
  const est = useMemo(() => (ready ? estimateReno(p) : null), [p, ready]);
  const preset = RENO_PRESETS.find((pr) => pr.works.length === p.works.length && pr.works.every((w) => p.works.includes(w)));

  const toggleWork = (id: WorkId, on: boolean) =>
    set('works', on ? [...p.works, id] : p.works.filter((w) => w !== id));

  return (
    <div className="wrap calc">
      <form className="calc-form" aria-label="Parametry mieszkania" onSubmit={(e) => e.preventDefault()}>
        <Group title="Lokalizacja">
          <Select label="Województwo" value={p.region} options={REGIONS} onChange={(v) => set('region', v)} />
          <Select label="Wielkość miejscowości" value={p.location} options={LOCATIONS} onChange={(v) => set('location', v)} />
        </Group>

        <Group title="Mieszkanie">
          <Range
            label="Powierzchnia" value={p.area} min={20} max={200} step={1} suffix=" m²"
            onChange={(v) => set('area', v)} withInput hint="powierzchnia użytkowa"
          />
          <Seg
            label="Liczba pokoi" value={p.rooms} onChange={(v) => set('rooms', v)}
            options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: n === 5 ? '5+' : String(n) }))}
          />
          <Seg
            label="Łazienki" value={p.bathrooms} onChange={(v) => set('bathrooms', v)}
            options={[{ value: 1, label: '1' }, { value: 2, label: '2' }]}
          />
          <Select
            label="Wysokość pomieszczeń" value={String(p.height)} onChange={(v) => set('height', Number(v))}
            options={['2.5', '2.6', '2.7', '2.8', '3', '3.3'].map((h) => ({ id: h, name: `${h.replace('.', ',')} m` }))}
          />
          <Seg
            label="Budynek" value={p.building} onChange={(v) => set('building', v)}
            options={[
              { value: 'blok', label: 'Blok' },
              { value: 'kamienica', label: 'Kamienica' },
              { value: 'nowe', label: 'Nowe' },
            ]}
          />
        </Group>

        <Group title="Zakres prac">
          <div className="preset-grid" style={{ marginBottom: 14 }}>
            {RENO_PRESETS.map((pr) => (
              <button
                key={pr.id}
                type="button"
                className="preset"
                aria-pressed={preset?.id === pr.id}
                onClick={() => set('works', [...pr.works])}
              >
                <strong>{pr.name}</strong>
                <span>{pr.desc}</span>
              </button>
            ))}
          </div>
          <div className="checks">
            {RENO_WORKS.map((w) => (
              <label className="check" key={w.id}>
                <input type="checkbox" checked={p.works.includes(w.id)} onChange={(e) => toggleWork(w.id, e.target.checked)} />
                {w.label}
              </label>
            ))}
          </div>
        </Group>

        <Group title="Standard i wykonawca">
          <Seg
            label="Standard materiałów" value={p.standard} onChange={(v) => set('standard', v)}
            options={[
              { value: 'eko', label: 'Ekonomiczny' },
              { value: 'std', label: 'Standard' },
              { value: 'prem', label: 'Premium' },
            ]}
          />
          <Select
            label="Kto wykonuje prace?" value={p.mode} onChange={(v) => set('mode', v as RenoParams['mode'])}
            options={[
              { id: 'gw', name: 'Firma remontowa kompleksowo' },
              { id: 'ekipy', name: 'Fachowcy zatrudniani osobno' },
              { id: 'gosp', name: 'Część prac samodzielnie' },
            ]}
          />
        </Group>

        <Group title="Termin i rezerwa">
          <DateField label="Planowany start" value={p.start} onChange={(v) => set('start', v)} />
          <Range
            label="Rezerwa budżetowa" value={p.reserve} min={0} max={25} suffix="%"
            onChange={(v) => set('reserve', v)} hint="W starszych budynkach zalecamy 15% — niespodzianki pod tynkiem to norma."
          />
        </Group>
      </form>

      <Results
        est={est}
        projectName={`Remont ${p.area} m² – ${preset ? preset.name.toLowerCase() : 'zakres własny'}`}
        shareQuery={toQuery(p)}
        excludes="mebli ruchomych, dekoracji i sprzętu RTV"
        ganttNote="Czas liczony w dniach roboczych (pon.–pt.). Uwzględniamy czas produkcji okien (ok. 4 tyg.) i kuchni (ok. 6 tyg.) od zamówienia oraz schnięcie wylewek."
      />
    </div>
  );
}
