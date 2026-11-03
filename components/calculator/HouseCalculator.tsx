'use client';

import { useMemo } from 'react';
import { LOCATIONS, REGIONS } from '@/lib/data';
import { HOUSE_DEFAULTS, SCOPES, estimateHouse } from '@/lib/engine';
import type { HouseParams } from '@/lib/engine';
import { DateField, Group, Range, Seg, Select, Toggle } from './Fields';
import { Results } from './Results';
import { toQuery, useCalcState } from './useCalcState';

export function HouseCalculator() {
  const { params: p, set, ready } = useCalcState<HouseParams>('brickly.calc.dom', HOUSE_DEFAULTS);
  const est = useMemo(() => (ready ? estimateHouse(p) : null), [p, ready]);
  const scope = SCOPES.find((s) => s.v === p.scope);

  return (
    <div className="wrap calc">
      <form className="calc-form" aria-label="Parametry domu" onSubmit={(e) => e.preventDefault()}>
        <Group title="Lokalizacja">
          <Select label="Województwo" value={p.region} options={REGIONS} onChange={(v) => set('region', v)} />
          <Select label="Wielkość miejscowości" value={p.location} options={LOCATIONS} onChange={(v) => set('location', v)} />
        </Group>

        <Group title="Budynek">
          <Range
            label="Powierzchnia użytkowa" value={p.area} min={60} max={300} step={5} suffix=" m²"
            onChange={(v) => set('area', v)} withInput hint="bez garażu i strychu"
          />
          <Seg
            label="Bryła" value={p.floors} onChange={(v) => set('floors', v)}
            options={[
              { value: 'parterowy', label: 'Parterowy' },
              { value: 'poddasze', label: 'Z poddaszem' },
              { value: 'pietrowy', label: 'Piętrowy' },
            ]}
          />
          <Seg
            label="Łazienki" value={p.bathrooms} onChange={(v) => set('bathrooms', v)}
            options={[1, 2, 3].map((n) => ({ value: n, label: String(n) }))}
          />
          <Toggle label="Garaż w bryle budynku" checked={p.garage} onChange={(v) => set('garage', v)} />
        </Group>

        <Group title="Technologia">
          <Select
            label="Ściany zewnętrzne" value={p.walls} onChange={(v) => set('walls', v as HouseParams['walls'])}
            options={[
              { id: 'ceramika', name: 'Pustak ceramiczny' },
              { id: 'bk', name: 'Beton komórkowy' },
              { id: 'silikat', name: 'Bloczek silikatowy' },
              { id: 'szkielet', name: 'Szkielet drewniany' },
            ]}
          />
          <Seg
            label="Fundamenty" value={p.foundation} onChange={(v) => set('foundation', v)}
            options={[{ value: 'lawy', label: 'Ławy' }, { value: 'plyta', label: 'Płyta' }]}
          />
          <Select
            label="Pokrycie dachu" value={p.roof} onChange={(v) => set('roof', v as HouseParams['roof'])}
            options={[
              { id: 'blacha', name: 'Blachodachówka' },
              { id: 'betonowa', name: 'Dachówka betonowa' },
              { id: 'ceramiczna', name: 'Dachówka ceramiczna' },
            ]}
          />
        </Group>

        <Group title="Instalacje">
          <Seg
            label="Ogrzewanie" value={p.heating} onChange={(v) => set('heating', v)}
            options={[
              { value: 'pompa', label: 'Pompa ciepła' },
              { value: 'gaz', label: 'Gaz' },
              { value: 'pellet', label: 'Pellet' },
            ]}
          />
          <Toggle label="Rekuperacja" checked={p.recup} onChange={(v) => set('recup', v)} />
          <Toggle label="Fotowoltaika ok. 6 kWp" checked={p.pv} onChange={(v) => set('pv', v)} />
          <Select
            label="Odprowadzanie ścieków" value={p.sewage} onChange={(v) => set('sewage', v as HouseParams['sewage'])}
            options={[
              { id: 'kanalizacja', name: 'Kanalizacja gminna' },
              { id: 'oczyszczalnia', name: 'Przydomowa oczyszczalnia' },
              { id: 'szambo', name: 'Szambo' },
            ]}
          />
        </Group>

        <Group title="Zakres i standard">
          <Seg
            label="Do jakiego stanu budujesz?" value={p.scope} onChange={(v) => set('scope', v)} wrap
            options={[
              { value: 1, label: 'Surowy otwarty', sub: 'fundamenty, ściany, dach' },
              { value: 2, label: 'Surowy zamknięty', sub: '+ okna i drzwi' },
              { value: 3, label: 'Deweloperski', sub: '+ instalacje, tynki, elewacja' },
              { value: 4, label: 'Pod klucz', sub: '+ wykończenie, kuchnia' },
            ]}
          />
          <Seg
            label="Standard materiałów" value={p.standard} onChange={(v) => set('standard', v)}
            options={[
              { value: 'eko', label: 'Ekonomiczny' },
              { value: 'std', label: 'Standard' },
              { value: 'prem', label: 'Premium' },
            ]}
          />
          <Select
            label="Sposób realizacji" value={p.mode} onChange={(v) => set('mode', v as HouseParams['mode'])}
            options={[
              { id: 'gw', name: 'Generalny wykonawca' },
              { id: 'ekipy', name: 'Osobne ekipy na etapy' },
              { id: 'gosp', name: 'System gospodarczy (część prac samemu)' },
            ]}
          />
          <Toggle label="Projekt, formalności, kierownik budowy" checked={p.formal} onChange={(v) => set('formal', v)} />
          <Toggle label="Przyłącza mediów" checked={p.utilities} onChange={(v) => set('utilities', v)} />
          <Toggle label="Zagospodarowanie działki" checked={p.landscape} onChange={(v) => set('landscape', v)} />
        </Group>

        <Group title="Termin i rezerwa">
          <DateField label="Planowany start" value={p.start} onChange={(v) => set('start', v)} />
          <Toggle label="Przerwa zimowa dla prac zewnętrznych" checked={p.winter} onChange={(v) => set('winter', v)} />
          <Range
            label="Rezerwa budżetowa" value={p.reserve} min={0} max={25} suffix="%"
            onChange={(v) => set('reserve', v)} hint="Zalecamy 10–15% na nieprzewidziane wydatki i wzrost cen."
          />
        </Group>
      </form>

      <Results
        est={est}
        projectName={`Dom ${p.area} m² – ${scope ? scope.short.toLowerCase() : ''}`}
        shareQuery={toQuery(p)}
        excludes="ceny działki, mebli ruchomych i kosztów kredytu"
        ganttNote={
          'Czas liczony w dniach roboczych (pon.–pt.).' +
          (p.winter ? ' Prace zewnętrzne nie są planowane między 15 grudnia a końcem lutego.' : '') +
          ' Paski kreskowane to przerwy technologiczne: dojrzewanie betonu i schnięcie wylewek.'
        }
      />
    </div>
  );
}
