import { MONTHS_SHORT, addDays, parseISO, todayISO } from '@/lib/dates';
import * as fmt from '@/lib/format';
import type { StageKind } from '@/lib/engine';

export type GanttRow = {
  id: string; name: string; sub?: string; start: string; end: string;
  kind: StageKind; progress?: number; lagDays?: number;
};

const monthStart = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
const nextMonth = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));

/** Wykres Gantta z siatką miesięcy, linią „dziś” i przerwami technologicznymi. Renderuj tylko po stronie klienta (zależy od daty). */
export function Gantt({ rows, legend = true }: { rows: GanttRow[]; legend?: boolean }) {
  if (!rows.length) return <p className="muted">Brak zadań do wyświetlenia.</p>;

  let min = parseISO(rows[0].start);
  let max = min;
  for (const r of rows) {
    const s = parseISO(r.start);
    const e = addDays(parseISO(r.end), 1 + (r.lagDays ?? 0));
    if (s < min) min = s;
    if (e > max) max = e;
  }
  min = monthStart(min);
  max = nextMonth(max);
  const span = max.getTime() - min.getTime();
  const pct = (d: Date) => ((d.getTime() - min.getTime()) / span) * 100;

  const months: Date[] = [];
  for (let m = min; m < max; m = nextMonth(m)) months.push(m);
  const step = months.length > 30 ? 3 : months.length > 16 ? 2 : 1;
  const today = parseISO(todayISO());

  const grid = months.map((m) => <span key={m.getTime()} style={{ left: `${pct(m)}%` }} />);

  return (
    <>
      <div className="gantt-scroll">
        <div className="gantt">
          {today >= min && today <= max && (
            <div className="gantt-overlay">
              <div className="gantt-today" style={{ left: `${pct(today)}%` }} />
            </div>
          )}
          <div className="gantt-head">
            <div />
            <div className="gantt-months">
              {months.map((m, i) =>
                i % step ? null : (
                  <span key={m.getTime()} style={{ left: `${pct(m)}%` }}>
                    {MONTHS_SHORT[m.getUTCMonth()]}
                    {m.getUTCMonth() === 0 || i === 0 ? ' ' + String(m.getUTCFullYear()).slice(2) : ''}
                  </span>
                ),
              )}
            </div>
          </div>
          {rows.map((r) => {
            const s = parseISO(r.start);
            const e = addDays(parseISO(r.end), 1);
            const left = pct(s);
            const width = Math.max(0.4, pct(e) - left);
            return (
              <div className="gantt-row" key={r.id}>
                <div className="gantt-label">
                  {r.name}
                  {r.sub && <small>{r.sub}</small>}
                </div>
                <div className="gantt-track">
                  <div className="gantt-grid">{grid}</div>
                  <div
                    className={'gantt-bar ' + r.kind}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${r.name}: ${fmt.date(r.start)} – ${fmt.date(r.end)}`}
                  >
                    {!!r.progress && <span className="done" style={{ width: `${Math.min(100, r.progress)}%` }} />}
                  </div>
                  {!!r.lagDays && (
                    <div
                      className="gantt-bar lag"
                      style={{ left: `${pct(e)}%`, width: `${pct(addDays(e, r.lagDays)) - pct(e)}%` }}
                      title={`Przerwa technologiczna: ${r.lagDays} dni`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {legend && (
        <div className="legend" style={{ marginTop: 14 }}>
          <span><i style={{ background: 'var(--bar-formal)' }} />Formalności i przygotowanie</span>
          <span><i style={{ background: 'var(--bar-outdoor)' }} />Prace zewnętrzne (zależne od pogody)</span>
          <span><i style={{ background: 'var(--bar-indoor)' }} />Prace wewnętrzne</span>
          <span><i style={{ background: 'repeating-linear-gradient(45deg,var(--border-strong) 0 3px,transparent 3px 6px)' }} />Przerwa technologiczna</span>
        </div>
      )}
    </>
  );
}
