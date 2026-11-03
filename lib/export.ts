import { PRICE_LABEL } from './data.ts';
import type { Estimate, ProjectType, StageKind } from './engine.ts';

export type Task = {
  id: string; name: string; start: string; days: number; deps: string[]; lagAfter: number;
  planned: number; actual: number; progress: number; kind: StageKind; notes: string;
};

export type Project = {
  id: string; name: string; type: ProjectType | 'custom'; created: string;
  params?: unknown; tasks: Task[];
};

function cell(v: unknown): string {
  const s = v === undefined || v === null ? '' : String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV ze średnikiem i BOM — otwiera się poprawnie w polskim Excelu. */
export function toCSV(rows: unknown[][]): string {
  return '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n');
}

const dec = (v: number) => (Math.round(v * 100) / 100).toFixed(2).replace('.', ',');

export function estimateToCSV(est: Estimate): string {
  const rows: unknown[][] = [
    ['Etap', 'Pozycja', 'Ilość', 'J.m.', 'Cena mat./j.m.', 'Cena rob./j.m.', 'Materiały', 'Robocizna', 'Razem', 'Start', 'Koniec'],
  ];
  for (const s of est.stages) {
    for (const i of s.items) {
      rows.push([s.name, i.name, String(i.qty).replace('.', ','), i.unit, dec(i.unitMat), dec(i.unitLab), dec(i.mat), dec(i.lab), dec(i.total), s.start, s.end]);
    }
    if (!s.items.length) rows.push([s.name, '(prace organizacyjne)', '', '', '', '', '', '', '0,00', s.start, s.end]);
  }
  rows.push([]);
  rows.push(['', 'Suma prac', '', '', '', '', dec(est.totals.mat), dec(est.totals.lab), dec(est.totals.total)]);
  rows.push(['', `Rezerwa ${est.params.reserve}%`, '', '', '', '', '', '', dec(est.totals.reserve)]);
  rows.push(['', 'RAZEM (brutto)', '', '', '', '', '', '', dec(est.totals.grand)]);
  rows.push(['', `Ceny: ${PRICE_LABEL} – Brickly Planner`]);
  return toCSV(rows);
}

export function estimateToProject(est: Estimate, name: string): Project {
  const ids = new Set(est.stages.map((s) => s.id));
  return {
    id: 'p' + Date.now().toString(36),
    name,
    type: est.type,
    created: new Date().toISOString(),
    params: est.params,
    tasks: est.stages.map((s) => ({
      id: s.id, name: s.name, start: s.start, days: s.days,
      deps: s.deps.filter((d) => ids.has(d)), lagAfter: s.lagAfter,
      planned: Math.round(s.total), actual: 0, progress: 0, kind: s.kind, notes: s.tip,
    })),
  };
}
