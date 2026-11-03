'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addDays, defaultStart, endAfterWorkdays, nextWorkday, parseISO, toISO, todayISO } from '@/lib/dates';
import { toCSV } from '@/lib/export';
import type { Project, Task } from '@/lib/export';
import * as fmt from '@/lib/format';
import { ACTIVE_KEY, PROJECTS_KEY, download, load, save, toast } from '@/lib/storage';
import { Gantt } from '../Gantt';
import { Icon } from '../Icon';

const taskEnd = (t: Task) => toISO(endAfterWorkdays(parseISO(t.start), t.days));
const uid = (prefix: string) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

/** Przesuwa zadania tak, by nie zaczynały się przed końcem poprzedników (+ przerwa technologiczna). */
function cascade(tasks: Task[]): Task[] {
  const out = tasks.map((t) => ({ ...t }));
  const byId = new Map(out.map((t) => [t.id, t]));
  for (const t of out) {
    for (const d of t.deps) {
      const dep = byId.get(d);
      if (!dep) continue;
      const ready = nextWorkday(addDays(parseISO(taskEnd(dep)), 1 + dep.lagAfter));
      if (parseISO(t.start) < ready) t.start = toISO(ready);
    }
  }
  return out;
}

function sanitize(data: Partial<Project>): Project {
  if (!data || !Array.isArray(data.tasks)) throw new Error('format');
  const kinds = ['formal', 'outdoor', 'indoor'];
  return {
    id: uid('p'),
    name: String(data.name || 'Zaimportowany projekt').slice(0, 120),
    type: data.type ?? 'custom',
    created: new Date().toISOString(),
    params: data.params,
    tasks: data.tasks
      .filter((t) => t && /^\d{4}-\d{2}-\d{2}$/.test(String(t.start)))
      .map((t, i) => ({
        id: String(t.id || 't' + i),
        name: String(t.name || 'Zadanie').slice(0, 200),
        start: t.start,
        days: Math.max(1, Math.min(999, Math.round(Number(t.days) || 1))),
        deps: Array.isArray(t.deps) ? t.deps.map(String) : [],
        lagAfter: Math.max(0, Number(t.lagAfter) || 0),
        planned: Math.max(0, Number(t.planned) || 0),
        actual: Math.max(0, Number(t.actual) || 0),
        progress: Math.max(0, Math.min(100, Number(t.progress) || 0)),
        kind: (kinds.includes(t.kind) ? t.kind : 'indoor') as Task['kind'],
        notes: String(t.notes || '').slice(0, 1000),
      })),
  };
}

export function Planner() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [autoShift, setAutoShift] = useState(true);
  const [ready, setReady] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProjects(load<Project[]>(PROJECTS_KEY, []));
    setActiveId(load<string | null>(ACTIVE_KEY, null));
    setAutoShift(load('brickly.autoShift', true));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!save(PROJECTS_KEY, projects)) toast('Nie udało się zapisać — pamięć przeglądarki jest niedostępna');
    save(ACTIVE_KEY, activeId);
    save('brickly.autoShift', autoShift);
  }, [projects, activeId, autoShift, ready]);

  const project = projects.find((p) => p.id === activeId) ?? projects[0] ?? null;

  const updateTasks = (fn: (tasks: Task[]) => Task[], shift = false) => {
    if (!project) return;
    setProjects((list) =>
      list.map((p) => {
        if (p.id !== project.id) return p;
        const tasks = fn(p.tasks);
        return { ...p, tasks: shift && autoShift ? cascade(tasks) : tasks };
      }),
    );
  };

  const editTask = (i: number, patch: Partial<Task>) => {
    const shift = 'start' in patch || 'days' in patch;
    updateTasks((tasks) => tasks.map((t, j) => (j === i ? { ...t, ...patch } : t)), shift);
  };

  const addProjectNew = () => {
    const name = window.prompt('Nazwa projektu', 'Mój projekt');
    if (name === null) return;
    const p: Project = {
      id: uid('p'), name: name.trim() || 'Mój projekt', type: 'custom', created: new Date().toISOString(),
      tasks: [{ id: uid('t'), name: 'Pierwsze zadanie', start: defaultStart(0), days: 5, deps: [], lagAfter: 0, planned: 0, actual: 0, progress: 0, kind: 'indoor', notes: '' }],
    };
    setProjects((l) => [p, ...l]);
    setActiveId(p.id);
  };

  const importFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = sanitize(JSON.parse(String(reader.result)));
        setProjects((l) => [p, ...l]);
        setActiveId(p.id);
        toast(`Zaimportowano projekt „${p.name}”`);
      } catch {
        toast('To nie jest poprawny plik projektu Brickly');
      }
    };
    reader.readAsText(file);
  };

  const stats = useMemo(() => {
    if (!project) return null;
    const today = todayISO();
    let planned = 0, actual = 0, weighted = 0, base = 0, overdue = 0;
    let start = '', end = '';
    for (const t of project.tasks) {
      planned += t.planned;
      actual += t.actual;
      const w = t.planned || 1;
      base += w;
      weighted += (w * t.progress) / 100;
      const e = taskEnd(t);
      if (!end || e > end) end = e;
      if (!start || t.start < start) start = t.start;
      if (e < today && t.progress < 100) overdue++;
    }
    return { planned, actual, progress: base ? (weighted / base) * 100 : 0, overdue, start, end, today };
  }, [project]);

  const fileInput = (
    <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { importFile(e.target.files?.[0]); e.target.value = ''; }} />
  );

  if (!ready) return <div className="panel"><p className="muted">Wczytuję projekty…</p></div>;

  if (!project || !stats) {
    return (
      <div className="panel empty-state">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M6 20 24 6l18 14" fill="none" stroke="var(--brick)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="9" y="24" width="17" height="6" rx="2" fill="var(--ink)" />
          <rect x="17" y="32" width="18" height="6" rx="2" fill="var(--brick)" />
          <rect x="25" y="40" width="14" height="6" rx="2" fill="var(--amber)" />
        </svg>
        <h2>Nie masz jeszcze projektu</h2>
        <p className="muted" style={{ maxWidth: 520, margin: '0 auto 22px' }}>
          Wygeneruj gotowy harmonogram z kalkulatora — wszystkie etapy, terminy i budżety trafią tu automatycznie. Możesz też zacząć od pustego planu.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" href="/kalkulator-budowy-domu/">Plan budowy domu</Link>
          <Link className="btn btn-dark" href="/kalkulator-remontu-mieszkania/">Plan remontu mieszkania</Link>
          <button type="button" className="btn btn-ghost" onClick={addProjectNew}>Pusty projekt</button>
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>Import JSON</button>
        </div>
        {fileInput}
      </div>
    );
  }

  const diff = stats.planned - stats.actual;

  return (
    <>
      <div className="planner-bar">
        <label className="sr-only" htmlFor="proj-select">Wybierz projekt</label>
        <select className="input" id="proj-select" value={project.id} onChange={(e) => setActiveId(e.target.value)}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
          const n = window.prompt('Nowa nazwa projektu', project.name);
          if (n?.trim()) setProjects((l) => l.map((p) => (p.id === project.id ? { ...p, name: n.trim() } : p)));
        }}>Zmień nazwę</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={addProjectNew}>+ Pusty projekt</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => download(`${fmt.slug(project.name)}.brickly.json`, JSON.stringify(project, null, 2), 'application/json')}>Eksport JSON</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>Import JSON</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
          const rows: unknown[][] = [['Zadanie', 'Start', 'Koniec', 'Dni robocze', 'Plan (zł)', 'Wydano (zł)', 'Postęp %']];
          project.tasks.forEach((t) => rows.push([t.name, t.start, taskEnd(t), t.days, t.planned, t.actual, t.progress]));
          download(`harmonogram-${fmt.slug(project.name)}.csv`, toCSV(rows), 'text/csv;charset=utf-8');
        }}>CSV</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>PDF</button>
        <button type="button" className="btn btn-ghost btn-sm btn-danger" onClick={() => {
          if (!window.confirm(`Usunąć projekt „${project.name}”? Tej operacji nie można cofnąć.`)) return;
          const rest = projects.filter((p) => p.id !== project.id);
          setProjects(rest);
          setActiveId(rest[0]?.id ?? null);
          toast('Projekt usunięty');
        }}>Usuń projekt</button>
        {fileInput}
      </div>

      <div className="kpi-row">
        <div className="kpi"><span>Budżet planowany</span><strong>{fmt.pln(stats.planned)}</strong></div>
        <div className="kpi">
          <span>Wydano</span><strong>{fmt.pln(stats.actual)}</strong>
          <div className={'note' + (diff < 0 ? ' bad' : '')}>{diff >= 0 ? `Pozostało ${fmt.pln(diff)}` : `Przekroczenie ${fmt.pln(-diff)}`}</div>
        </div>
        <div className="kpi">
          <span>Postęp prac</span><strong>{fmt.num(stats.progress, 0)}%</strong>
          <div className="progress"><i style={{ width: `${stats.progress}%` }} /></div>
        </div>
        <div className="kpi">
          <span>Zakończenie</span><strong>{fmt.date(stats.end)}</strong>
          <div className="note">{stats.overdue ? <span className="bad">{stats.overdue} zad. po terminie</span> : `Start: ${fmt.date(stats.start)}`}</div>
        </div>
      </div>

      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head"><h2>Wykres Gantta</h2><span className="note">{project.name}</span></div>
        <Gantt
          rows={project.tasks.map((t) => ({
            id: t.id, name: t.name, start: t.start, end: taskEnd(t), kind: t.kind,
            progress: t.progress, lagDays: t.lagAfter, sub: `${fmt.date(t.start)} – ${fmt.date(taskEnd(t))}`,
          }))}
        />
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Zadania i budżet</h2>
          <label className="toggle" style={{ gap: 10 }}>
            <span className="note">Przesuwaj zadania zależne</span>
            <input type="checkbox" checked={autoShift} onChange={(e) => {
              setAutoShift(e.target.checked);
              if (e.target.checked) updateTasks((t) => cascade(t));
            }} />
            <span className="switch" />
          </label>
        </div>
        <div className="table-scroll">
          <table className="task-table">
            <thead>
              <tr>
                <th>Zadanie</th><th>Start</th><th>Dni rob.</th><th>Koniec</th>
                <th>Plan (zł)</th><th>Wydano (zł)</th><th>Postęp %</th><th><span className="sr-only">Akcje</span></th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((t, i) => {
                const e = taskEnd(t);
                const cls = t.progress >= 100 ? 'done' : e < stats.today ? 'overdue' : '';
                return (
                  <tr key={t.id} className={cls}>
                    <td className="w-name">
                      <input className="input" defaultValue={t.name} aria-label="Nazwa zadania" title={t.notes || undefined}
                        onBlur={(ev) => ev.target.value.trim() !== t.name && editTask(i, { name: ev.target.value.trim() || 'Zadanie' })} />
                    </td>
                    <td className="w-date">
                      <input className="input" type="date" value={t.start} aria-label="Data startu"
                        onChange={(ev) => ev.target.value && editTask(i, { start: toISO(nextWorkday(parseISO(ev.target.value))) })} />
                    </td>
                    <td className="w-num">
                      <input className="input" type="number" min={1} max={999} value={t.days} aria-label="Czas trwania w dniach roboczych"
                        onChange={(ev) => ev.target.value !== '' && editTask(i, { days: Math.max(1, Math.min(999, Math.round(Number(ev.target.value)))) })} />
                    </td>
                    <td className="task-end">{fmt.date(e)}</td>
                    <td className="w-money">
                      <input className="input" type="number" min={0} step={100} value={t.planned} aria-label="Koszt planowany"
                        onChange={(ev) => editTask(i, { planned: Math.max(0, Number(ev.target.value) || 0) })} />
                    </td>
                    <td className="w-money">
                      <input className="input" type="number" min={0} step={100} value={t.actual} aria-label="Koszt rzeczywisty"
                        onChange={(ev) => editTask(i, { actual: Math.max(0, Number(ev.target.value) || 0) })} />
                    </td>
                    <td className="w-num">
                      <input className="input" type="number" min={0} max={100} step={5} value={t.progress} aria-label="Postęp w procentach"
                        onChange={(ev) => editTask(i, { progress: Math.max(0, Math.min(100, Number(ev.target.value) || 0)) })} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" title="Przesuń wyżej" aria-label="Przesuń wyżej" disabled={i === 0}
                          onClick={() => updateTasks((ts) => { const c = [...ts]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; return c; })}>
                          <Icon name="up" />
                        </button>
                        <button type="button" className="del" title="Usuń zadanie" aria-label="Usuń zadanie" onClick={() => {
                          if (!window.confirm(`Usunąć zadanie „${t.name}”?`)) return;
                          // następcy przejmują poprzedników usuniętego zadania, by zachować ciągłość
                          updateTasks((ts) => ts.filter((x) => x.id !== t.id).map((x) =>
                            x.deps.includes(t.id) ? { ...x, deps: [...x.deps.filter((d) => d !== t.id), ...t.deps] } : x));
                        }}>
                          <Icon name="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button type="button" className="btn btn-dark btn-sm" onClick={() => updateTasks((ts) => {
            const last = ts[ts.length - 1];
            const start = last ? toISO(nextWorkday(addDays(parseISO(taskEnd(last)), 1))) : defaultStart(0);
            return [...ts, { id: uid('t'), name: 'Nowe zadanie', start, days: 5, deps: last ? [last.id] : [], lagAfter: 0, planned: 0, actual: 0, progress: 0, kind: 'indoor', notes: '' }];
          })}>+ Dodaj zadanie</button>
        </div>
        <p className="note" style={{ marginTop: 14 }}>
          Zmiany zapisują się automatycznie w tej przeglądarce. Najedź na nazwę zadania, aby zobaczyć wskazówki wykonawcze.
          Aby przenieść projekt na inny komputer, użyj eksportu JSON.
        </p>
      </section>
    </>
  );
}
