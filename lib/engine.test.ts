import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateHouse, estimateReno, RENO_PRESETS } from './engine.ts';
import { endAfterWorkdays, parseISO, toISO, winterAdjust } from './dates.ts';

const base = { formal: false, utilities: false, reserve: 0, start: '2027-03-01', winter: false };

test('koszt domu 120 m² mieści się w widełkach rynkowych 2026', () => {
  const perM2 = (scope: number) => estimateHouse({ ...base, scope }).totals.total / 120;
  assert.ok(perM2(2) > 3000 && perM2(2) < 4500, `SSZ ${perM2(2)}`);
  assert.ok(perM2(3) > 5000 && perM2(3) < 7200, `deweloperski ${perM2(3)}`);
  assert.ok(perM2(4) > perM2(3));
});

test('Warszawa jest droższa niż wieś na Podkarpaciu', () => {
  const waw = estimateHouse({ ...base, region: 'mazowieckie', location: 'metro' }).totals.total;
  const pod = estimateHouse({ ...base, region: 'podkarpackie', location: 'rural' }).totals.total;
  assert.ok(waw > pod * 1.15);
});

test('etapy następują po sobie, a wylewki mają czas schnięcia', () => {
  const est = estimateHouse({ ...base, scope: 4 });
  const byId = Object.fromEntries(est.stages.map((s) => [s.id, s]));
  assert.ok(byId.dach.start > byId.stropy.end);
  const gap = (parseISO(byId.wykonczenie.start).getTime() - parseISO(byId.wylewki.end).getTime()) / 864e5;
  assert.ok(gap >= 28, `przerwa ${gap}`);
});

test('przerwa zimowa przesuwa prace zewnętrzne na marzec', () => {
  const s = winterAdjust(parseISO('2027-12-01'), 20);
  assert.equal(toISO(s), '2028-03-01');
  assert.equal(toISO(endAfterWorkdays(parseISO('2027-03-05'), 2)), '2027-03-08');
});

test('remont: zakres generalny droższy niż standardowy i odświeżenie', () => {
  const cost = (id: string) =>
    estimateReno({ area: 55, reserve: 0, works: RENO_PRESETS.find((p) => p.id === id)!.works }).totals.total;
  assert.ok(cost('generalny') > cost('standard'));
  assert.ok(cost('standard') > cost('odswiezenie'));
  const perM2 = cost('generalny') / 55;
  assert.ok(perM2 > 2500 && perM2 < 4500, `generalny ${perM2}`);
});
