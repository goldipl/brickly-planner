'use client';

import { Fragment, useState } from 'react';
import { GROUPS, LOCATIONS, PRICES, REGIONS } from '@/lib/data';
import type { GroupId, PriceId, StandardId } from '@/lib/data';
import { unitPrice } from '@/lib/engine';
import * as fmt from '@/lib/format';

const IDS = Object.keys(PRICES) as PriceId[];

/** Tabela cen jednostkowych przeliczana dla regionu, miejscowości i standardu. Treść renderuje się też na serwerze (SEO). */
export function PriceList() {
  const [region, setRegion] = useState('zachodniopomorskie');
  const [location, setLocation] = useState('city');
  const [standard, setStandard] = useState<StandardId>('std');
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const groups = (Object.keys(GROUPS) as GroupId[])
    .map((g) => ({ g, ids: IDS.filter((id) => PRICES[id].g === g && (!query || PRICES[id].n.toLowerCase().includes(query))) }))
    .filter((x) => x.ids.length);

  return (
    <>
      <form className="price-filters panel" onSubmit={(e) => e.preventDefault()} aria-label="Filtry cennika">
        <div className="field">
          <label className="field-label" htmlFor="pf-region">Województwo</label>
          <select className="input" id="pf-region" value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="pf-loc">Miejscowość</label>
          <select className="input" id="pf-loc" value={location} onChange={(e) => setLocation(e.target.value)}>
            {LOCATIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="field">
          <span className="field-label" id="pf-std">Standard</span>
          <div className="seg" role="radiogroup" aria-labelledby="pf-std">
            {(['eko', 'std', 'prem'] as StandardId[]).map((s) => (
              <Fragment key={s}>
                <input type="radio" id={`pf-${s}`} name="pf-std" checked={standard === s} onChange={() => setStandard(s)} />
                <label htmlFor={`pf-${s}`}>{s === 'eko' ? 'Eko' : s === 'std' ? 'Standard' : 'Premium'}</label>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="pf-q">Szukaj</label>
          <input className="input" id="pf-q" type="search" placeholder="np. dachówka, gładź" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </form>

      {groups.length === 0 && <p className="muted">Brak pozycji pasujących do wyszukiwania.</p>}
      {groups.map(({ g, ids }) => (
        <div className="price-group panel" key={g}>
          <div className="table-scroll">
            <table className="price-table">
              <caption>{GROUPS[g]}</caption>
              <thead>
                <tr><th>Pozycja</th><th>J.m.</th><th className="num">Materiał</th><th className="num">Robocizna</th><th className="num">Razem</th></tr>
              </thead>
              <tbody>
                {ids.map((id) => {
                  const u = unitPrice(id, { region, location, standard });
                  return (
                    <tr key={id}>
                      <td>{PRICES[id].n}</td>
                      <td>{PRICES[id].u}</td>
                      <td className="num">{u.mat ? fmt.pln(u.mat) : '–'}</td>
                      <td className="num">{u.lab ? fmt.pln(u.lab) : '–'}</td>
                      <td className="num"><strong>{fmt.pln(u.mat + u.lab)}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
