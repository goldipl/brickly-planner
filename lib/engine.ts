/**
 * Silnik kosztorysu i harmonogramu Brickly Planner.
 * Czysty TypeScript bez zależności — działa w przeglądarce, na serwerze i w testach (node --test).
 */
import { INDEX, LOCATIONS, PRICES, PRICE_LABEL, REGIONS, STD_SENS } from './data.ts';
import type { PriceId, StandardId } from './data.ts';
import {
  addDays, defaultStart, endAfterWorkdays, isWorkday, nextWorkday, parseISO, toISO, winterAdjust, workdaysBetween,
} from './dates.ts';

/* ---------- typy ---------- */

export type ProjectType = 'dom' | 'remont';
export type ModeId = 'gw' | 'ekipy' | 'gosp';
export type StageKind = 'formal' | 'outdoor' | 'indoor';

export type HouseParams = {
  area: number;
  floors: 'parterowy' | 'poddasze' | 'pietrowy';
  garage: boolean;
  bathrooms: number;
  walls: 'ceramika' | 'bk' | 'silikat' | 'szkielet';
  foundation: 'lawy' | 'plyta';
  roof: 'blacha' | 'betonowa' | 'ceramiczna';
  heating: 'pompa' | 'gaz' | 'pellet';
  recup: boolean;
  pv: boolean;
  sewage: 'kanalizacja' | 'oczyszczalnia' | 'szambo';
  scope: number;
  formal: boolean;
  utilities: boolean;
  landscape: boolean;
  region: string;
  location: string;
  standard: StandardId;
  mode: ModeId;
  start: string;
  winter: boolean;
  reserve: number;
};

export type WorkId =
  | 'projekt' | 'rozbiorki' | 'scianki' | 'elektryka' | 'wodkan' | 'grzejniki' | 'okna' | 'drzwiwej' | 'tynki'
  | 'gladzie' | 'sufity' | 'wylewki' | 'malowanie' | 'podlogi' | 'lazienka' | 'kuchnia' | 'drzwiwew' | 'oswietlenie';

export type RenoParams = {
  area: number;
  rooms: number;
  bathrooms: number;
  height: number;
  building: 'blok' | 'kamienica' | 'nowe';
  works: WorkId[];
  region: string;
  location: string;
  standard: StandardId;
  mode: ModeId;
  start: string;
  reserve: number;
};

export type LineItem = {
  id: PriceId; name: string; unit: string; qty: number;
  unitMat: number; unitLab: number; mat: number; lab: number; total: number;
};

export type Stage = {
  id: string; name: string; tip: string; kind: StageKind; outdoor: boolean;
  deps: string[]; lagAfter: number; days: number;
  items: LineItem[]; mat: number; lab: number; total: number;
  start: string; end: string;
};

export type Estimate = {
  type: ProjectType;
  params: HouseParams | RenoParams;
  area: number;
  stages: Stage[];
  totals: { mat: number; lab: number; total: number; reserve: number; grand: number; perM2: number; low: number; high: number };
  schedule: { start: string; end: string; months: number; workdays: number };
  cashflow: { month: string; amount: number; cumulative: number }[];
  priceLabel: string;
};

type Mode = { name: string; mat: number; lab: number; time: number };

/* ---------- ceny ---------- */

export const MODES: Record<ModeId, Mode> = {
  gw: { name: 'Generalny wykonawca', mat: 1.08, lab: 1.2, time: 1 },
  ekipy: { name: 'Osobne ekipy na etapy', mat: 1, lab: 1, time: 1.12 },
  gosp: { name: 'System gospodarczy (część prac samemu)', mat: 1, lab: 0.72, time: 1.4 },
};

export const RENO_MODES: Record<ModeId, Mode> = {
  gw: { name: 'Firma remontowa kompleksowo', mat: 1.04, lab: 1.12, time: 0.9 },
  ekipy: { name: 'Fachowcy zatrudniani osobno', mat: 1, lab: 1, time: 1.05 },
  gosp: { name: 'Część prac samodzielnie', mat: 1, lab: 0.6, time: 1.5 },
};

const NEUTRAL_MODE: Mode = { name: '', mat: 1, lab: 1, time: 1 };

function factor(list: { id: string; f: number }[], id: string): number {
  return (list.find((o) => o.id === id) ?? list[0]).f;
}

/** Cena jednostkowa po uwzględnieniu regionu, lokalizacji, standardu i trybu realizacji. */
export function unitPrice(
  id: PriceId,
  p: { region: string; location: string; standard: StandardId },
  mode: Mode = NEUTRAL_MODE,
  labExtra = 1,
): { mat: number; lab: number } {
  const pr = PRICES[id];
  const rf = factor(REGIONS, p.region) * factor(LOCATIONS, p.location);
  const sf = STD_SENS[pr.s][p.standard] ?? 1;
  return {
    mat: pr.m * INDEX.mat * sf * (1 + (rf - 1) * 0.35) * mode.mat,
    lab: pr.l * INDEX.lab * (1 + (sf - 1) * 0.35) * rf * mode.lab * labExtra,
  };
}

/* ---------- szablony etapów ---------- */

type ItemRule<G, P> = [PriceId, (g: G, p: P) => number, ((p: P, g: G) => boolean)?];

type StageTemplate<G, P> = {
  id: string; name: string; tip: string; days: number;
  scope?: number; fixed?: boolean; outdoor?: boolean; kind?: StageKind; always?: boolean;
  deps?: string[]; lagAfter?: number;
  /** minimalny odstęp od STARTU wskazanego etapu (np. czas produkcji okien od zamówienia) */
  leadTime?: { from: string; days: number; ifWork?: WorkId };
  when?: (p: P) => boolean;
  items: ItemRule<G, P>[];
};

/* ---------- budowa domu ---------- */

export const HOUSE_DEFAULTS: Omit<HouseParams, 'start'> = {
  area: 120, floors: 'poddasze', garage: false, bathrooms: 2,
  walls: 'ceramika', foundation: 'lawy', roof: 'betonowa',
  heating: 'pompa', recup: true, pv: false, sewage: 'kanalizacja',
  scope: 3, formal: true, utilities: true, landscape: false,
  region: 'zachodniopomorskie', location: 'city', standard: 'std', mode: 'gw',
  winter: true, reserve: 10,
};

export const SCOPES = [
  { v: 1, short: 'SSO', name: 'Stan surowy otwarty' },
  { v: 2, short: 'SSZ', name: 'Stan surowy zamknięty' },
  { v: 3, short: 'Deweloperski', name: 'Stan deweloperski' },
  { v: 4, short: 'Pod klucz', name: 'Pod klucz' },
];

type HouseGeo = {
  A: number; Ag: number; F: number; P: number; Wext: number; Wnet: number;
  win: number; roofWin: number; doors: number; R: number; levels: number; baths: number;
};

function houseGeometry(p: HouseParams): HouseGeo {
  const A = Math.max(40, Number(p.area) || 120);
  const Ag = A + (p.garage ? 20 : 0);
  const shapes = {
    parterowy: { fp: 1.22, wallH: 3.0, gable: 0.08, roof: 1.45, levels: 1 },
    poddasze: { fp: 1.22 / 1.65, wallH: 4.1, gable: 0.18, roof: 1.7, levels: 2 },
    pietrowy: { fp: 1.22 / 2, wallH: 6.0, gable: 0.05, roof: 1.35, levels: 2 },
  };
  const s = shapes[p.floors] ?? shapes.poddasze;
  const F = Ag * s.fp; // powierzchnia zabudowy
  const P = 4.3 * Math.sqrt(F); // obwód budynku
  const Wext = P * s.wallH + s.gable * F;
  const win = A * 0.15;
  const roofWin = p.floors === 'poddasze' ? Math.max(2, Math.round(A / 30)) : 0;
  const winFacade = p.floors === 'poddasze' ? win * 0.7 : win;
  const doors = A > 130 ? 2 : 1;
  return {
    A, Ag, F, P, Wext, Wnet: Wext - winFacade - doors * 2.4, win: winFacade, roofWin, doors,
    R: F * s.roof, levels: s.levels, baths: Math.max(1, Number(p.bathrooms) || 1),
  };
}

const one = () => 1;
const notPlyta = (p: HouseParams) => p.foundation !== 'plyta';
const multiStorey = (p: HouseParams) => p.floors !== 'parterowy';

// scope: 0 = formalności, 1 = SSO, 2 = SSZ, 3 = deweloperski, 4 = pod klucz
const HOUSE_STAGES: StageTemplate<HouseGeo, HouseParams>[] = [
  {
    id: 'prep', name: 'Projekt, formalności i pozwolenie na budowę', scope: 0, days: 65, fixed: true, kind: 'formal',
    when: (p) => p.formal,
    items: [['projekt', one], ['mapa', one], ['kierownik', one]],
    tip: 'Wybierz projekt i zleć adaptację, uzyskaj mapę do celów projektowych, warunki przyłączy i pozwolenie na budowę (urząd ma 65 dni). Załóż dziennik budowy i zgłoś rozpoczęcie robót.',
  },
  {
    id: 'plac', name: 'Organizacja placu budowy i wytyczenie', scope: 1, days: 5, fixed: true, outdoor: true, deps: ['prep'],
    items: [['zaplecze', one], ['geod_wyt', one]],
    tip: 'Podłącz prąd i wodę budowlaną, ustaw kontener i WC, zabezpiecz teren. Geodeta wytycza budynek i wpisuje to do dziennika budowy.',
  },
  {
    id: 'fund', name: 'Roboty ziemne i fundamenty', scope: 1, days: 18, outdoor: true, deps: ['plac'], lagAfter: 7,
    items: [
      ['wykopy', (g) => g.F * 0.3 + g.P * 0.9],
      ['lawy', (g) => g.P * 1.35 * 0.6 * 0.4, notPlyta],
      ['scianyfund', (g) => g.P * 1.35 * 1.1, notPlyta],
      ['izolfund', (g) => g.P * 1.3, notPlyta],
      ['posadzkagrunt', (g) => g.F * 0.9, notPlyta],
      ['plyta', (g) => g.F * 1.05, (p) => p.foundation === 'plyta'],
    ],
    tip: 'Odbierz wykop z kierownikiem budowy przed betonowaniem. Beton musi dojrzewać min. 7 dni — w tym czasie nie obciążaj fundamentów.',
  },
  {
    id: 'sciany', name: 'Ściany konstrukcyjne i kominy', scope: 1, days: 26, outdoor: true, deps: ['fund'],
    items: [
      ['sciana_cer', (g) => g.Wnet, (p) => p.walls === 'ceramika'],
      ['sciana_bk', (g) => g.Wnet, (p) => p.walls === 'bk'],
      ['sciana_sil', (g) => g.Wnet, (p) => p.walls === 'silikat'],
      ['sciana_szk', (g) => g.Wnet, (p) => p.walls === 'szkielet'],
      ['sciany_wew', (g) => g.A * 0.9],
      ['komin', one],
      ['rusztowania', (g) => g.Ag],
    ],
    tip: 'Kupuj materiał ścienny z jednej partii produkcyjnej. Pilnuj pionów, przewiązań i zbrojenia nadproży; wizyta kierownika budowy przed zalaniem wieńców.',
  },
  {
    id: 'stropy', name: 'Wieńce, stropy i schody', scope: 1, days: 14, outdoor: true, deps: ['sciany'], lagAfter: 21,
    items: [
      ['wience', (g) => g.P * g.levels],
      ['strop', (g) => g.F * 0.9, multiStorey],
      ['strop_lekki', (g) => g.F * 0.9, (p) => p.floors === 'parterowy'],
      ['schody_konstr', one, multiStorey],
    ],
    tip: 'Strop betonowy pielęgnuj (polewanie wodą) i nie rozszalowuj przed upływem ok. 3–4 tygodni. Zaplanuj w tym czasie zamówienie więźby i okien.',
  },
  {
    id: 'dach', name: 'Więźba i pokrycie dachu', scope: 1, days: 20, outdoor: true, deps: ['stropy'],
    items: [
      ['wiezba', (g) => g.R],
      ['membrana', (g) => g.R],
      ['pokrycie_blacha', (g) => g.R, (p) => p.roof === 'blacha'],
      ['pokrycie_beton', (g) => g.R, (p) => p.roof === 'betonowa'],
      ['pokrycie_cer', (g) => g.R, (p) => p.roof === 'ceramiczna'],
      ['obrobki', (g) => g.P * 1.2],
    ],
    tip: 'Więźbę zamów z drewna suszonego (C24). Pokrycie montuj wg wytycznych producenta — tylko wtedy obowiązuje gwarancja systemowa.',
  },
  {
    id: 'stolarka', name: 'Okna, drzwi zewnętrzne i brama', scope: 2, days: 6, deps: ['dach'],
    items: [
      ['okna', (g) => g.win],
      ['okno_dach', (g) => g.roofWin, (p) => p.floors === 'poddasze'],
      ['drzwi_zew', (g) => g.doors],
      ['brama', one, (p) => p.garage],
    ],
    tip: 'Okna zamów 6–8 tygodni wcześniej. Wybierz ciepły montaż (taśmy paroszczelne i paroprzepuszczalne) — oszczędza ciepło przez lata.',
  },
  {
    id: 'przylacza', name: 'Przyłącza mediów', scope: 3, days: 15, outdoor: true, deps: ['dach'],
    when: (p) => p.utilities,
    items: [
      ['przyl_prad', one],
      ['przyl_woda', one],
      ['przyl_kan', one, (p) => p.sewage === 'kanalizacja'],
      ['oczyszczalnia', one, (p) => p.sewage === 'oczyszczalnia'],
      ['szambo', one, (p) => p.sewage === 'szambo'],
      ['przyl_gaz', one, (p) => p.heating === 'gaz'],
    ],
    tip: 'Wnioski o warunki przyłączenia złóż jeszcze na etapie projektu — operatorzy mają nawet kilka miesięcy na realizację.',
  },
  {
    id: 'instalacje', name: 'Instalacje: elektryka, wod-kan, ogrzewanie, wentylacja', scope: 3, days: 25, deps: ['stolarka'],
    items: [
      ['elektryka', (g) => g.A],
      ['wodkan', (g) => g.A],
      ['podlogowka', (g) => g.A * 0.9],
      ['pompa', one, (p) => p.heating === 'pompa'],
      ['gaz_kociol', one, (p) => p.heating === 'gaz'],
      ['pellet', one, (p) => p.heating === 'pellet'],
      ['rekuperacja', (g) => g.A, (p) => p.recup],
      ['pv', one, (p) => p.pv],
    ],
    tip: 'Zrób zdjęcia i szkic przebiegu wszystkich instalacji przed tynkowaniem. Próba ciśnieniowa ogrzewania podłogowego musi odbyć się przed wylewkami.',
  },
  {
    id: 'tynki', name: 'Tynki wewnętrzne i zabudowy GK', scope: 3, days: 18, deps: ['instalacje'],
    items: [
      ['tynki', (g) => g.A * 3],
      ['ocieplenie_dach', (g) => g.R * 0.75, (p) => p.floors === 'poddasze'],
      ['ocieplenie_strop', (g) => g.F * 0.9, (p) => p.floors !== 'poddasze'],
    ],
    tip: 'Tynkuj w temperaturze powyżej +5°C i zapewnij wentylację — wilgoć technologiczna musi odparować przed wylewkami.',
  },
  {
    id: 'wylewki', name: 'Wylewki podłogowe', scope: 3, days: 6, deps: ['tynki'], lagAfter: 28,
    items: [['wylewki', (g) => g.A]],
    tip: 'Wylewka anhydrytowa lub cementowa schnie ok. 4 tygodni. Zmierz wilgotność (metoda CM) przed układaniem podłóg.',
  },
  {
    id: 'elewacja', name: 'Ocieplenie i elewacja', scope: 3, days: 22, outdoor: true, deps: ['stolarka'],
    items: [['elewacja', (g) => g.Wnet]],
    tip: 'Elewację wykonuj przy temperaturze 5–25°C, bez deszczu i pełnego słońca. Najlepiej po zakończeniu mokrych prac wewnątrz.',
  },
  {
    id: 'wykonczenie', name: 'Wykończenie: gładzie, malowanie, płytki, podłogi', scope: 4, days: 45, deps: ['wylewki'],
    items: [
      ['gladz_mal', (g) => g.A * 3],
      ['plytki', (g) => g.baths * 25 + g.A * 0.08],
      ['podlogi', (g) => Math.max(0, g.A * 0.82 - g.baths * 5)],
      ['schody_wyk', one, multiStorey],
      ['drobne', (g) => g.A],
    ],
    tip: 'Kolejność: gładzie → płytki → pierwsze malowanie → podłogi → ostatnie malowanie. Zamów kuchnię z 6–8 tygodniowym wyprzedzeniem.',
  },
  {
    id: 'montaz', name: 'Łazienki, kuchnia, drzwi i osprzęt', scope: 4, days: 12, deps: ['wykonczenie'],
    items: [
      ['lazienka_wyp', (g) => g.baths],
      ['kuchnia', one],
      ['drzwi_wew', (g) => Math.ceil(g.A / 14)],
      ['osprzet', (g) => g.A],
    ],
    tip: 'Drzwi wewnętrzne montuj na końcu, po podłogach. Sprawdź działanie wszystkich obwodów i spisz numery seryjne urządzeń do gwarancji.',
  },
  {
    id: 'otoczenie', name: 'Zagospodarowanie działki', scope: 4, days: 20, outdoor: true, deps: ['elewacja'],
    when: (p) => p.landscape,
    items: [
      ['ogrodzenie', () => 90],
      ['podjazd', (g) => 45 + (g.Ag - g.A)],
      ['taras', (g) => Math.round(g.A / 6)],
      ['zielen', () => 400],
    ],
    tip: 'Podjazd wykonuj po zakończeniu ciężkich dostaw. Ogrodzenie od strony drogi może wymagać zgłoszenia w starostwie.',
  },
  {
    id: 'odbior', name: 'Odbiory i zakończenie budowy', scope: 3, days: 10, fixed: true,
    deps: ['wylewki', 'elewacja', 'przylacza', 'montaz', 'otoczenie'],
    items: [['geod_inw', one]],
    tip: 'Inwentaryzacja geodezyjna, protokoły kominiarskie i elektryczne, świadectwo charakterystyki energetycznej, zawiadomienie o zakończeniu budowy w PINB.',
  },
];

/* ---------- remont mieszkania ---------- */

export const RENO_DEFAULTS: Omit<RenoParams, 'start' | 'works'> = {
  area: 55, rooms: 3, bathrooms: 1, height: 2.6, building: 'blok',
  region: 'zachodniopomorskie', location: 'city', standard: 'std', mode: 'gw', reserve: 10,
};

export const RENO_WORKS: { id: WorkId; label: string }[] = [
  { id: 'projekt', label: 'Projekt wnętrz' },
  { id: 'rozbiorki', label: 'Rozbiórki i wywóz gruzu' },
  { id: 'scianki', label: 'Zmiana układu (nowe ścianki)' },
  { id: 'elektryka', label: 'Wymiana instalacji elektrycznej' },
  { id: 'wodkan', label: 'Wymiana instalacji wod-kan' },
  { id: 'grzejniki', label: 'Wymiana grzejników' },
  { id: 'okna', label: 'Wymiana okien' },
  { id: 'drzwiwej', label: 'Nowe drzwi wejściowe' },
  { id: 'tynki', label: 'Naprawa tynków' },
  { id: 'gladzie', label: 'Gładzie gipsowe' },
  { id: 'sufity', label: 'Sufity i zabudowy GK' },
  { id: 'wylewki', label: 'Wylewki samopoziomujące' },
  { id: 'malowanie', label: 'Malowanie ścian i sufitów' },
  { id: 'podlogi', label: 'Nowe podłogi' },
  { id: 'lazienka', label: 'Łazienka pod klucz' },
  { id: 'kuchnia', label: 'Kuchnia z AGD' },
  { id: 'drzwiwew', label: 'Drzwi wewnętrzne' },
  { id: 'oswietlenie', label: 'Osprzęt i oświetlenie' },
];

export const RENO_PRESETS: { id: string; name: string; desc: string; works: WorkId[] }[] = [
  {
    id: 'odswiezenie', name: 'Odświeżenie', desc: 'Malowanie, drobne naprawy, nowe podłogi',
    works: ['malowanie', 'podlogi', 'oswietlenie'],
  },
  {
    id: 'standard', name: 'Remont standardowy', desc: 'Gładzie, podłogi, łazienka, kuchnia, drzwi',
    works: ['rozbiorki', 'gladzie', 'malowanie', 'wylewki', 'podlogi', 'lazienka', 'kuchnia', 'drzwiwew', 'oswietlenie'],
  },
  {
    id: 'generalny', name: 'Remont generalny', desc: 'Wszystko od instalacji po wykończenie',
    works: ['rozbiorki', 'scianki', 'elektryka', 'wodkan', 'grzejniki', 'okna', 'drzwiwej', 'tynki', 'gladzie', 'sufity', 'wylewki', 'malowanie', 'podlogi', 'lazienka', 'kuchnia', 'drzwiwew', 'oswietlenie'],
  },
  {
    id: 'deweloperski', name: 'Wykończenie od dewelopera', desc: 'Mieszkanie w stanie deweloperskim',
    works: ['gladzie', 'sufity', 'malowanie', 'podlogi', 'lazienka', 'kuchnia', 'drzwiwew', 'oswietlenie'],
  },
];

export const BUILDINGS: Record<RenoParams['building'], { name: string; lab: number }> = {
  blok: { name: 'Blok', lab: 1 },
  kamienica: { name: 'Kamienica', lab: 1.15 },
  nowe: { name: 'Nowe budownictwo', lab: 0.95 },
};

type RenoGeo = {
  A: number; h: number; baths: number; rooms: number; w: Partial<Record<WorkId, boolean>>;
  walls: number; ceil: number; paint: number; tiles: number; win: number;
};

function renoGeometry(p: RenoParams): RenoGeo {
  const A = Math.max(15, Number(p.area) || 50);
  const h = Math.min(4, Math.max(2.3, Number(p.height) || 2.6));
  const baths = Math.max(1, Number(p.bathrooms) || 1);
  const rooms = Math.max(1, Number(p.rooms) || 2);
  const bathWalls = baths * 18 * (h / 2.6);
  const walls = A * 1.05 * h;
  const ceil = A * 0.95;
  const w: Partial<Record<WorkId, boolean>> = {};
  (p.works || []).forEach((k) => { w[k] = true; });
  return {
    A, h, baths, rooms, w, walls, ceil,
    paint: Math.max(0, walls + ceil - (w.lazienka ? bathWalls : 0)),
    tiles: bathWalls + baths * 4.5,
    win: A * 0.16,
  };
}

const has = (k: WorkId) => (_p: RenoParams, g: RenoGeo) => !!g.w[k];

const RENO_STAGES: StageTemplate<RenoGeo, RenoParams>[] = [
  {
    id: 'przygotowanie', name: 'Projekt, wyceny i zamówienia', days: 8, fixed: true, kind: 'formal', always: true,
    items: [['r_projekt', (g) => g.A, has('projekt')]],
    tip: 'Zbierz min. 3 wyceny, podpisz umowę z harmonogramem i karami umownymi. Zamów okna, drzwi i kuchnię — mają najdłuższy czas realizacji. W bloku zgłoś remont administracji.',
  },
  {
    id: 'rozbiorki', name: 'Rozbiórki i wywóz gruzu', days: 4, deps: ['przygotowanie'],
    items: [
      ['r_skuwanie', (g) => g.tiles + 4, has('rozbiorki')],
      ['r_zrywanie', (g) => g.A * 0.85, has('rozbiorki')],
      ['r_gruz', (g) => Math.max(1, Math.ceil(g.A / 35)), has('rozbiorki')],
    ],
    tip: 'Zabezpiecz klatkę schodową i windę. Prace głośne wykonuj w godzinach dopuszczonych regulaminem wspólnoty (zwykle 8–20).',
  },
  {
    id: 'instalacje', name: 'Instalacje: elektryka, wod-kan, grzejniki', days: 8, deps: ['rozbiorki'],
    items: [
      ['r_elektryka', (g) => g.A, has('elektryka')],
      ['r_wodkan', (g) => g.baths + 1, has('wodkan')],
      ['r_grzejniki', (g) => g.rooms + g.baths + 1, has('grzejniki')],
    ],
    tip: 'Zaplanuj gniazda pod meble i AGD na podstawie projektu kuchni. Wymiana grzejników w bloku wymaga zgody spółdzielni i spuszczenia pionu.',
  },
  {
    id: 'okna', name: 'Wymiana okien i drzwi wejściowych', days: 3, deps: ['rozbiorki'],
    leadTime: { from: 'przygotowanie', days: 28, ifWork: 'okna' },
    items: [
      ['r_okna', (g) => g.win, has('okna')],
      ['r_drzwi_wej', one, has('drzwiwej')],
    ],
    tip: 'Okna wymieniaj przed gładziami — obróbka ościeży brudzi. Czas produkcji okien to zwykle 4–6 tygodni.',
  },
  {
    id: 'murarskie', name: 'Ścianki, tynki i wylewki', days: 7, deps: ['instalacje'], lagAfter: 10,
    items: [
      ['r_scianki', (g) => g.A * 0.12, has('scianki')],
      ['r_tynki', (g) => g.walls * 0.6, has('tynki')],
      ['r_wylewka', (g) => g.A * 0.85, has('wylewki')],
    ],
    tip: 'Wylewka samopoziomująca potrzebuje ok. 7–14 dni na wyschnięcie zanim położysz panele lub płytki.',
  },
  {
    id: 'gladzie', name: 'Gładzie, sufity i zabudowy GK', days: 8, deps: ['murarskie', 'okna'],
    items: [
      ['r_sufity', (g) => g.A * 0.25, has('sufity')],
      ['r_gladz', (g) => g.paint, has('gladzie')],
      ['r_przyg', (g) => g.paint, (_p, g) => !g.w.gladzie && !!g.w.malowanie],
    ],
    tip: 'Gładź szlifuj z odkurzaczem przemysłowym. Sprawdzaj równość ścian pod światło lampy — błędy wyjdą po malowaniu.',
  },
  {
    id: 'lazienka', name: 'Łazienka: hydroizolacja, płytki, biały montaż', days: 10, deps: ['murarskie'],
    items: [
      ['plytki', (g) => g.tiles + (g.w.kuchnia ? 4 : 0), has('lazienka')],
      ['lazienka_wyp', (g) => g.baths, has('lazienka')],
    ],
    tip: 'Hydroizolację nakładaj na całą podłogę i ściany w strefie prysznica. Zostaw rewizje do zaworów i syfonów.',
  },
  {
    id: 'malowanie', name: 'Malowanie ścian i sufitów', days: 5, deps: ['gladzie'],
    items: [['r_malowanie', (g) => g.paint, has('malowanie')]],
    tip: 'Pierwsza warstwa przed podłogami, ostatnia poprawka po montażu drzwi i listew.',
  },
  {
    id: 'podlogi', name: 'Podłogi', days: 3, deps: ['malowanie', 'lazienka'],
    items: [['podlogi', (g) => Math.max(0, g.A * 0.82 - (g.w.lazienka ? g.baths * 4.5 : 0)), has('podlogi')]],
    tip: 'Panele aklimatyzuj 48 h w mieszkaniu. Zostaw szczelinę dylatacyjną przy ścianach.',
  },
  {
    id: 'montaz', name: 'Kuchnia, drzwi wewnętrzne i osprzęt', days: 5, deps: ['podlogi'],
    leadTime: { from: 'przygotowanie', days: 42, ifWork: 'kuchnia' },
    items: [
      ['r_kuchnia', one, has('kuchnia')],
      ['drzwi_wew', (g) => g.rooms + g.baths, has('drzwiwew')],
      ['osprzet', (g) => g.A, has('oswietlenie')],
    ],
    tip: 'Kuchnię montuj na gotowej podłodze. Po montażu sprawdź szczelność podłączeń wody i działanie AGD.',
  },
  {
    id: 'odbior', name: 'Sprzątanie, poprawki i odbiór', days: 2, fixed: true, always: true,
    deps: ['montaz', 'podlogi', 'malowanie', 'lazienka', 'okna'],
    items: [['r_ochrona', (g) => g.A]],
    tip: 'Zrób protokół odbioru z listą usterek i terminem ich usunięcia. Zachowaj faktury — przydadzą się przy rękojmi.',
  },
];

/* ---------- parametry ---------- */

function clean<T extends object>(params: Partial<T>): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(params) as (keyof T)[]).forEach((k) => {
    const v = params[k];
    if (v !== undefined && v !== null && (v as unknown) !== '') out[k] = v;
  });
  return out;
}

export function normalizeHouse(params: Partial<HouseParams> = {}): HouseParams {
  const p = { ...HOUSE_DEFAULTS, start: defaultStart(14), ...clean(params) } as HouseParams;
  p.area = Number(p.area);
  p.scope = Number(p.scope);
  p.bathrooms = Number(p.bathrooms);
  p.reserve = Math.max(0, Math.min(30, Number(p.reserve) || 0));
  return p;
}

export function normalizeReno(params: Partial<RenoParams> = {}): RenoParams {
  const p = { ...RENO_DEFAULTS, start: defaultStart(14), works: RENO_PRESETS[1].works, ...clean(params) } as RenoParams;
  p.works = [...p.works];
  p.area = Number(p.area);
  p.reserve = Math.max(0, Math.min(30, Number(p.reserve) || 0));
  return p;
}

/* ---------- obliczenia ---------- */

type Working = Stage & { active: boolean; leadTime?: StageTemplate<unknown, unknown>['leadTime']; ready?: Date; startDate?: Date };

function build<G, P extends { region: string; location: string; standard: StandardId }>(
  templates: StageTemplate<G, P>[], p: P, g: G, mode: Mode, labExtra: number,
  isActive: (t: StageTemplate<G, P>) => boolean,
  durationOf: (t: StageTemplate<G, P>) => number,
): Working[] {
  return templates.map((t) => {
    let active = isActive(t);
    const items: LineItem[] = [];
    if (active) {
      for (const [id, qtyFn, cond] of t.items) {
        if (cond && !cond(p, g)) continue;
        const qty = qtyFn(g, p);
        if (!(qty > 0)) continue;
        const up = unitPrice(id, p, mode, labExtra);
        const q = qty < 10 ? Math.round(qty * 10) / 10 : Math.round(qty);
        items.push({
          id, name: PRICES[id].n, unit: PRICES[id].u, qty: q,
          unitMat: up.mat, unitLab: up.lab, mat: up.mat * q, lab: up.lab * q, total: (up.mat + up.lab) * q,
        });
      }
      if (t.always === false || (t.always === undefined && t.scope === undefined && items.length === 0)) active = false;
    }
    const mat = items.reduce((s, i) => s + i.mat, 0);
    const lab = items.reduce((s, i) => s + i.lab, 0);
    return {
      id: t.id, name: t.name, tip: t.tip,
      kind: t.kind ?? (t.outdoor ? 'outdoor' : 'indoor'), outdoor: !!t.outdoor,
      deps: t.deps ?? [], lagAfter: t.lagAfter ?? 0, leadTime: t.leadTime,
      days: active ? Math.max(1, Math.round(durationOf(t))) : 0,
      items, mat, lab, total: mat + lab, start: '', end: '', active,
    };
  });
}

function schedule(stages: Working[], start: string, winter: boolean, works?: Partial<Record<WorkId, boolean>>) {
  const byId = new Map(stages.map((s) => [s.id, s]));
  const projectStart = nextWorkday(parseISO(start));

  for (const s of stages) {
    let earliest = projectStart;
    for (const d of s.deps) {
      const dep = byId.get(d);
      if (dep?.ready && dep.ready > earliest) earliest = dep.ready;
    }
    const lt = s.leadTime;
    if (lt && (!lt.ifWork || works?.[lt.ifWork])) {
      const from = byId.get(lt.from);
      if (from?.active && from.startDate) {
        const t = addDays(from.startDate, lt.days);
        if (t > earliest) earliest = t;
      }
    }
    if (!s.active) {
      // etap pominięty przekazuje gotowość swoich poprzedników
      s.ready = earliest;
      s.startDate = earliest;
      continue;
    }
    let st = nextWorkday(earliest);
    if (winter && s.outdoor) st = winterAdjust(st, s.days);
    const end = endAfterWorkdays(st, s.days);
    s.start = toISO(st);
    s.end = toISO(end);
    s.startDate = st;
    s.ready = addDays(end, 1 + s.lagAfter);
  }
}

function cashflow(stages: Stage[]) {
  const months: Record<string, number> = {};
  for (const s of stages) {
    if (!s.total) continue;
    const a = parseISO(s.start);
    const b = parseISO(s.end);
    const perDay = s.total / (workdaysBetween(a, b) || 1);
    for (let d = a; d <= b; d = addDays(d, 1)) {
      if (!isWorkday(d)) continue;
      const key = toISO(d).slice(0, 7);
      months[key] = (months[key] || 0) + perDay;
    }
  }
  const keys = Object.keys(months).sort();
  if (!keys.length) return [];
  // uzupełnij miesiące bez wydatków (np. przerwa zimowa)
  const out: Estimate['cashflow'] = [];
  let cur = parseISO(keys[0] + '-01');
  let cum = 0;
  for (let guard = 0; guard < 120; guard++) {
    const k = toISO(cur).slice(0, 7);
    cum += months[k] || 0;
    out.push({ month: k, amount: months[k] || 0, cumulative: cum });
    if (k === keys[keys.length - 1]) break;
    cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 1));
  }
  return out;
}

function finish(type: ProjectType, params: HouseParams | RenoParams, area: number, working: Working[]): Estimate {
  const stages: Stage[] = working
    .filter((s) => s.active)
    .map(({ active: _a, leadTime: _l, ready: _r, startDate: _s, ...rest }) => rest);
  const mat = stages.reduce((s, x) => s + x.mat, 0);
  const lab = stages.reduce((s, x) => s + x.lab, 0);
  const total = mat + lab;
  const reserve = (total * params.reserve) / 100;
  const grand = total + reserve;
  const first = stages[0]?.start ?? params.start;
  const last = stages.reduce((m, s) => (s.end > m ? s.end : m), first);
  return {
    type, params, area, stages,
    totals: { mat, lab, total, reserve, grand, perM2: grand / area, low: grand * 0.9, high: grand * 1.15 },
    schedule: {
      start: first, end: last,
      months: (parseISO(last).getTime() - parseISO(first).getTime()) / (1000 * 3600 * 24 * 30.44),
      workdays: workdaysBetween(parseISO(first), parseISO(last)),
    },
    cashflow: cashflow(stages),
    priceLabel: PRICE_LABEL,
  };
}

export function estimateHouse(input: Partial<HouseParams> = {}): Estimate {
  const p = normalizeHouse(input);
  const g = houseGeometry(p);
  const mode = MODES[p.mode] ?? MODES.gw;
  const working = build(
    HOUSE_STAGES, p, g, mode, 1,
    (t) => (t.id === 'prep' ? p.formal : t.id === 'odbior' ? p.scope >= 3 : (t.scope ?? 0) <= p.scope && (!t.when || t.when(p))),
    (t) => {
      let d = t.fixed ? t.days : t.days * Math.pow(g.Ag / 120, 0.55) * mode.time;
      if (p.walls === 'szkielet' && (t.id === 'sciany' || t.id === 'stropy')) d *= 0.6;
      return d;
    },
  );
  schedule(working, p.start, p.winter);
  return finish('dom', p, g.A, working);
}

export function estimateReno(input: Partial<RenoParams> = {}): Estimate {
  const p = normalizeReno(input);
  const g = renoGeometry(p);
  const mode = RENO_MODES[p.mode] ?? RENO_MODES.gw;
  const labExtra = (BUILDINGS[p.building] ?? BUILDINGS.blok).lab;
  const working = build(
    RENO_STAGES, p, g, mode, labExtra,
    () => true,
    (t) => {
      let d = t.fixed ? t.days : t.days * Math.pow(g.A / 50, 0.6) * mode.time;
      if (t.id === 'lazienka') d *= 1 + 0.7 * (g.baths - 1);
      if (t.id === 'przygotowanie' && g.w.projekt) d += 15;
      return d;
    },
  );
  // bez wylewek ścianki i tynki potrzebują tylko krótkiej przerwy
  const mur = working.find((s) => s.id === 'murarskie');
  if (mur && !g.w.wylewki) mur.lagAfter = 2;
  schedule(working, p.start, false, g.w);
  return finish('remont', p, g.A, working);
}
