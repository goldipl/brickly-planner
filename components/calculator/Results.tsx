'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Estimate, StageKind } from '@/lib/engine';
import { estimateToCSV, estimateToProject } from '@/lib/export';
import * as fmt from '@/lib/format';
import { addProject, download, toast } from '@/lib/storage';
import { Gantt } from '../Gantt';
import { Icon } from '../Icon';

type Tab = 'summary' | 'cost' | 'gantt' | 'plan';
const TABS: [Tab, string][] = [
  ['summary', 'Podsumowanie'],
  ['cost', 'Kosztorys'],
  ['gantt', 'Harmonogram'],
  ['plan', 'Plan krok po kroku'],
];

const KIND_LABEL: Record<StageKind, string> = {
  formal: 'Formalności',
  outdoor: 'Prace zewnętrzne',
  indoor: 'Prace wewnętrzne',
};

type Props = {
  est: Estimate | null;
  projectName: string;
  shareQuery: string;
  ganttNote: string;
  excludes: string;
};

export function Results({ est, projectName, shareQuery, ganttNote, excludes }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('summary');

  if (!est) {
    return (
      <div className="results">
        <section className="result-hero loading" aria-busy="true">
          <div>
            <div className="label">Szacowany koszt całkowity</div>
            <div className="big">— zł</div>
            <div className="range">Przeliczam wycenę…</div>
          </div>
        </section>
      </div>
    );
  }

  const t = est.totals;

  const openPlanner = () => {
    if (addProject(estimateToProject(est, projectName))) router.push('/harmonogram-budowy/');
    else toast('Nie udało się zapisać projektu — pamięć przeglądarki jest niedostępna');
  };
  const exportCsv = () => {
    download(`kosztorys-${fmt.slug(projectName)}.csv`, estimateToCSV(est), 'text/csv;charset=utf-8');
    toast('Pobrano kosztorys CSV');
  };
  const copyLink = () => {
    const url = window.location.href.split('#')[0] + '#' + shareQuery;
    window.history.replaceState(null, '', url);
    navigator.clipboard?.writeText(url).then(
      () => toast('Link do wyceny skopiowany'),
      () => toast('Link jest w pasku adresu'),
    ) ?? toast('Link jest w pasku adresu');
  };

  return (
    <div className="results">
      <section className="result-hero" aria-live="polite">
        <div>
          <div className="label">Szacowany koszt całkowity</div>
          <div className="big">{fmt.pln(t.grand, 100)}</div>
          <div className="range">
            Realny przedział: {fmt.pln(t.low, 1000)} – {fmt.pln(t.high, 1000)}
            <br />
            Ceny brutto · {est.priceLabel}
          </div>
          <div className="result-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={openPlanner}>
              <Icon name="calendar" />Otwórz w planerze
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={exportCsv}>
              <Icon name="download" />CSV / Excel
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>
              <Icon name="print" />PDF
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={copyLink}>
              <Icon name="link" />Link
            </button>
          </div>
        </div>
        <div className="mini">
          <div><strong>{fmt.pln(t.perM2, 10)}</strong><span>za m² powierzchni</span></div>
          <div>
            <strong>{est.schedule.months < 2 ? `${est.schedule.workdays} dni rob.` : `${fmt.num(est.schedule.months)} mies.`}</strong>
            <span>czas realizacji</span>
          </div>
          <div><strong>{fmt.date(est.schedule.end)}</strong><span>planowane zakończenie</span></div>
          <div><strong>{fmt.pln(t.reserve, 100)}</strong><span>rezerwa w kwocie</span></div>
        </div>
      </section>

      <section className="panel">
        <div className="tabs" role="tablist" aria-label="Wyniki">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              aria-selected={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="tab-panel" id="panel-summary" role="tabpanel" aria-labelledby="tab-summary" hidden={tab !== 'summary'}>
          <Summary est={est} excludes={excludes} />
        </div>
        <div className="tab-panel" id="panel-cost" role="tabpanel" aria-labelledby="tab-cost" hidden={tab !== 'cost'}>
          <CostTable est={est} />
        </div>
        <div className="tab-panel" id="panel-gantt" role="tabpanel" aria-labelledby="tab-gantt" hidden={tab !== 'gantt'}>
          <Gantt
            rows={est.stages.map((s) => ({
              id: s.id, name: s.name, start: s.start, end: s.end, kind: s.kind, lagDays: s.lagAfter,
              sub: `${fmt.date(s.start)} – ${fmt.date(s.end)} · ${s.days} dni rob.`,
            }))}
          />
          <p className="note" style={{ marginTop: 12 }}>{ganttNote}</p>
        </div>
        <div className="tab-panel" id="panel-plan" role="tabpanel" aria-labelledby="tab-plan" hidden={tab !== 'plan'}>
          <ol className="timeline">
            {est.stages.map((s, i) => (
              <li key={s.id}>
                <span className={'dot ' + s.kind}>{i + 1}</span>
                <h4>{s.name}</h4>
                <div className="when">
                  {fmt.date(s.start)} – {fmt.date(s.end)} · {s.days} dni rob. · {KIND_LABEL[s.kind]}
                  {s.total > 0 && ` · ${fmt.pln(s.total, 100)}`}
                </div>
                <p>{s.tip}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

function Summary({ est, excludes }: { est: Estimate; excludes: string }) {
  const t = est.totals;
  const max = Math.max(...est.stages.map((s) => s.total), 1);
  const cashMax = Math.max(...est.cashflow.map((c) => c.amount), 1);
  const every = est.cashflow.length > 18 ? 3 : est.cashflow.length > 10 ? 2 : 1;
  const share = (v: number) => `${(v / t.grand) * 100}%`;

  return (
    <>
      <div className="panel-head">
        <h3>Struktura kosztów</h3>
        <span className="note">Materiały / robocizna / rezerwa</span>
      </div>
      <div className="split-bar">
        <i style={{ width: share(t.mat), background: 'var(--brick)' }} />
        <i style={{ width: share(t.lab), background: 'var(--bar-indoor)' }} />
        <i style={{ width: share(t.reserve), background: 'var(--amber)' }} />
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--brick)' }} />Materiały {fmt.pln(t.mat, 100)}</span>
        <span><i style={{ background: 'var(--bar-indoor)' }} />Robocizna i usługi {fmt.pln(t.lab, 100)}</span>
        <span><i style={{ background: 'var(--amber)' }} />Rezerwa {est.params.reserve}%</span>
      </div>

      <div className="panel-head spaced"><h3>Koszt według etapów</h3></div>
      <div className="stage-bars">
        {est.stages.filter((s) => s.total > 0).map((s) => (
          <div className="stage-bar" key={s.id}>
            <span className="name" title={s.name}>{s.name}</span>
            <span className="track"><i style={{ width: `${(s.total / max) * 100}%` }} /></span>
            <span className="val">{fmt.pln(s.total, 100)}</span>
          </div>
        ))}
      </div>

      <div className="panel-head spaced">
        <h3>Wydatki w czasie</h3>
        <span className="note">Ile pieniędzy potrzebujesz w każdym miesiącu (np. transze kredytu)</span>
      </div>
      <div className="cash-chart" role="img" aria-label="Wykres miesięcznych wydatków">
        {est.cashflow.map((c, i) => (
          <div className="cash-col" key={c.month}>
            <span className="tip">{fmt.month(c.month)}: {fmt.pln(c.amount, 100)}</span>
            <i style={{ height: `${Math.max(1, (c.amount / cashMax) * 100)}%` }} />
            <span>{i % every ? ' ' : fmt.month(c.month)}</span>
          </div>
        ))}
      </div>

      <p className="note" style={{ marginTop: 22 }}>
        Wycena orientacyjna na podstawie średnich cen rynkowych ({est.priceLabel}) skorygowanych o region, wielkość miejscowości,
        standard i sposób realizacji. Nie obejmuje {excludes}. Przed podpisaniem umowy porównaj ją z ofertami wykonawców.
      </p>
    </>
  );
}

function CostTable({ est }: { est: Estimate }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const t = est.totals;
  return (
    <>
      <div className="table-scroll">
        <table className="cost-table">
          <thead>
            <tr>
              <th>Pozycja</th>
              <th className="num">Ilość</th>
              <th className="num hide-sm">Materiały</th>
              <th className="num hide-sm">Robocizna</th>
              <th className="num">Razem</th>
            </tr>
          </thead>
          <tbody>
            {est.stages.flatMap((s) => {
              const isCol = !!collapsed[s.id];
              const toggle = () => setCollapsed((c) => ({ ...c, [s.id]: !c[s.id] }));
              const head = (
                <tr
                  key={s.id}
                  className={'stage-row' + (isCol ? ' collapsed' : '')}
                  onClick={toggle}
                  tabIndex={0}
                  aria-expanded={!isCol}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle())}
                >
                  <td colSpan={2}>{s.name}</td>
                  <td className="num hide-sm">{fmt.pln(s.mat)}</td>
                  <td className="num hide-sm">{fmt.pln(s.lab)}</td>
                  <td className="num">{fmt.pln(s.total)}</td>
                </tr>
              );
              if (isCol) return [head];
              if (!s.items.length) {
                return [head, (
                  <tr key={s.id + '-none'} className="item-row">
                    <td colSpan={5} className="muted">Prace organizacyjne – bez kosztów bezpośrednich</td>
                  </tr>
                )];
              }
              return [head, ...s.items.map((i) => (
                <tr key={s.id + i.id} className="item-row">
                  <td>{i.name}</td>
                  <td className="num">{fmt.num(i.qty)} {i.unit}</td>
                  <td className="num hide-sm">{fmt.pln(i.mat)}</td>
                  <td className="num hide-sm">{fmt.pln(i.lab)}</td>
                  <td className="num">{fmt.pln(i.total)}</td>
                </tr>
              ))];
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Suma prac</td>
              <td className="num hide-sm">{fmt.pln(t.mat)}</td>
              <td className="num hide-sm">{fmt.pln(t.lab)}</td>
              <td className="num">{fmt.pln(t.total)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Rezerwa na nieprzewidziane wydatki ({est.params.reserve}%)</td>
              <td className="hide-sm" />
              <td className="hide-sm" />
              <td className="num">{fmt.pln(t.reserve)}</td>
            </tr>
            <tr className="grand">
              <td colSpan={2}>Razem brutto</td>
              <td className="hide-sm" />
              <td className="hide-sm" />
              <td className="num">{fmt.pln(t.grand)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="note" style={{ marginTop: 14 }}>
        Ilości wyliczone z powierzchni i geometrii budynku. Kliknij nazwę etapu, aby zwinąć lub rozwinąć pozycje. Pełny kosztorys
        z cenami jednostkowymi pobierzesz jako plik CSV (Excel, Arkusze Google).
      </p>
    </>
  );
}
