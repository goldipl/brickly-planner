/**
 * Baza cen budowlanych (Polska).
 * Ceny brutto w zł, poziom: średnia krajowa, ekipy wynajmowane osobno.
 * m = materiał za jednostkę, l = robocizna / usługa za jednostkę,
 * s = wrażliwość na standard wykończenia.
 * Kalibracja: raporty rynkowe 2026 (GUS, Grupa PSB, Sekocenbud, portale branżowe).
 */

export const PRICE_DATE = '2026-11';
export const PRICE_LABEL = 'listopad 2026';

// Indeks korygujący ceny bazowe do bieżącego poziomu rynku —
// przy aktualizacji cennika wystarczy zmienić te dwie wartości.
export const INDEX = { mat: 1.06, lab: 1.12 };

export type Option = { id: string; name: string; f: number };
export type StandardId = 'eko' | 'std' | 'prem';
export type Sensitivity = 'struct' | 'mid' | 'fin' | 'fixed';
export type GroupId = 'formal' | 'zero' | 'mury' | 'dach' | 'stolarka' | 'instal' | 'tynki' | 'wyk' | 'remont' | 'media';
export type PriceItem = { n: string; u: string; m: number; l: number; s: Sensitivity; g: GroupId };

export const REGIONS: Option[] = [
  { id: 'dolnoslaskie', name: 'dolnośląskie', f: 1.06 },
  { id: 'kujawsko-pomorskie', name: 'kujawsko-pomorskie', f: 0.95 },
  { id: 'lubelskie', name: 'lubelskie', f: 0.92 },
  { id: 'lubuskie', name: 'lubuskie', f: 0.93 },
  { id: 'lodzkie', name: 'łódzkie', f: 0.96 },
  { id: 'malopolskie', name: 'małopolskie', f: 1.08 },
  { id: 'mazowieckie', name: 'mazowieckie', f: 1.12 },
  { id: 'opolskie', name: 'opolskie', f: 0.94 },
  { id: 'podkarpackie', name: 'podkarpackie', f: 0.91 },
  { id: 'podlaskie', name: 'podlaskie', f: 0.92 },
  { id: 'pomorskie', name: 'pomorskie', f: 1.07 },
  { id: 'slaskie', name: 'śląskie', f: 1.01 },
  { id: 'swietokrzyskie', name: 'świętokrzyskie', f: 0.91 },
  { id: 'warminsko-mazurskie', name: 'warmińsko-mazurskie', f: 0.92 },
  { id: 'wielkopolskie', name: 'wielkopolskie', f: 1.03 },
  { id: 'zachodniopomorskie', name: 'zachodniopomorskie', f: 1.0 },
];

export const LOCATIONS: Option[] = [
  { id: 'metro', name: 'Duże miasto (pow. 300 tys.)', f: 1.08 },
  { id: 'city', name: 'Średnie lub małe miasto', f: 1.0 },
  { id: 'rural', name: 'Wieś / gmina podmiejska', f: 0.95 },
];

export const STANDARDS: { id: StandardId; name: string }[] = [
  { id: 'eko', name: 'Ekonomiczny' },
  { id: 'std', name: 'Standard' },
  { id: 'prem', name: 'Premium' },
];

// mnożnik ceny materiału wg standardu
export const STD_SENS: Record<Sensitivity, Record<StandardId, number>> = {
  struct: { eko: 0.95, std: 1, prem: 1.07 },
  mid: { eko: 0.9, std: 1, prem: 1.25 },
  fin: { eko: 0.78, std: 1, prem: 1.6 },
  fixed: { eko: 1, std: 1, prem: 1 },
};

export const GROUPS: Record<GroupId, string> = {
  formal: 'Projekt, formalności i odbiory',
  zero: 'Roboty ziemne i fundamenty',
  mury: 'Ściany, stropy i schody',
  dach: 'Dach',
  stolarka: 'Okna i drzwi',
  instal: 'Instalacje i ogrzewanie',
  tynki: 'Tynki, wylewki, ocieplenie i elewacja',
  wyk: 'Wykończenie wnętrz',
  remont: 'Prace remontowe',
  media: 'Przyłącza i zagospodarowanie działki',
};

export const PRICES = {
  // formalności
  projekt: { n: 'Projekt gotowy z adaptacją do działki', u: 'kpl', m: 0, l: 11500, s: 'fin', g: 'formal' },
  mapa: { n: 'Mapa do celów projektowych i badania geotechniczne', u: 'kpl', m: 0, l: 4900, s: 'fixed', g: 'formal' },
  kierownik: { n: 'Kierownik budowy (nadzór całej budowy)', u: 'kpl', m: 0, l: 9500, s: 'fixed', g: 'formal' },
  geod_wyt: { n: 'Geodezyjne wytyczenie budynku', u: 'kpl', m: 0, l: 1900, s: 'fixed', g: 'formal' },
  geod_inw: { n: 'Inwentaryzacja powykonawcza i odbiory (kominiarz, świadectwo energetyczne)', u: 'kpl', m: 0, l: 4200, s: 'fixed', g: 'formal' },
  zaplecze: { n: 'Zaplecze budowy: prąd i woda budowlana, WC, kontener', u: 'kpl', m: 3800, l: 1800, s: 'fixed', g: 'formal' },
  rusztowania: { n: 'Rusztowania, sprzęt, transport i media na budowie', u: 'm²', m: 25, l: 70, s: 'fixed', g: 'formal' },

  // stan zero
  wykopy: { n: 'Zdjęcie humusu i wykopy pod fundamenty', u: 'm³', m: 0, l: 65, s: 'fixed', g: 'zero' },
  lawy: { n: 'Ławy fundamentowe żelbetowe (beton C20/25 + stal)', u: 'm³', m: 780, l: 330, s: 'struct', g: 'zero' },
  scianyfund: { n: 'Ściany fundamentowe z bloczków betonowych', u: 'm²', m: 110, l: 105, s: 'struct', g: 'zero' },
  izolfund: { n: 'Izolacja przeciwwilgociowa i termiczna fundamentów (XPS)', u: 'm²', m: 115, l: 50, s: 'struct', g: 'zero' },
  posadzkagrunt: { n: 'Podsypka, chudziak i izolacja podłogi na gruncie', u: 'm²', m: 135, l: 70, s: 'struct', g: 'zero' },
  plyta: { n: 'Płyta fundamentowa z izolacją XPS (kompletna)', u: 'm²', m: 470, l: 190, s: 'struct', g: 'zero' },

  // mury i stropy
  sciana_cer: { n: 'Ściany zewnętrzne – pustak ceramiczny 25 cm', u: 'm²', m: 112, l: 120, s: 'struct', g: 'mury' },
  sciana_bk: { n: 'Ściany zewnętrzne – beton komórkowy 24 cm', u: 'm²', m: 108, l: 105, s: 'struct', g: 'mury' },
  sciana_sil: { n: 'Ściany zewnętrzne – bloczek silikatowy 24 cm', u: 'm²', m: 125, l: 120, s: 'struct', g: 'mury' },
  sciana_szk: { n: 'Ściany zewnętrzne – szkielet drewniany z izolacją', u: 'm²', m: 255, l: 160, s: 'struct', g: 'mury' },
  sciany_wew: { n: 'Ściany wewnętrzne nośne i działowe', u: 'm²', m: 95, l: 100, s: 'struct', g: 'mury' },
  wience: { n: 'Wieńce, nadproża i słupy żelbetowe', u: 'mb', m: 130, l: 135, s: 'struct', g: 'mury' },
  strop: { n: 'Strop żelbetowy / gęstożebrowy', u: 'm²', m: 275, l: 175, s: 'struct', g: 'mury' },
  strop_lekki: { n: 'Strop drewniany nad parterem', u: 'm²', m: 125, l: 85, s: 'struct', g: 'mury' },
  schody_konstr: { n: 'Schody żelbetowe (konstrukcja)', u: 'kpl', m: 5800, l: 5200, s: 'struct', g: 'mury' },
  komin: { n: 'System kominowy i kanały wentylacyjne', u: 'kpl', m: 7800, l: 3200, s: 'mid', g: 'mury' },

  // dach
  wiezba: { n: 'Więźba dachowa (drewno C24 impregnowane)', u: 'm²', m: 125, l: 110, s: 'struct', g: 'dach' },
  membrana: { n: 'Membrana, łaty i kontrłaty', u: 'm²', m: 38, l: 28, s: 'struct', g: 'dach' },
  pokrycie_blacha: { n: 'Pokrycie – blachodachówka', u: 'm²', m: 72, l: 58, s: 'mid', g: 'dach' },
  pokrycie_beton: { n: 'Pokrycie – dachówka betonowa', u: 'm²', m: 92, l: 82, s: 'mid', g: 'dach' },
  pokrycie_cer: { n: 'Pokrycie – dachówka ceramiczna', u: 'm²', m: 138, l: 92, s: 'mid', g: 'dach' },
  obrobki: { n: 'Obróbki blacharskie, rynny i rury spustowe', u: 'mb', m: 135, l: 68, s: 'mid', g: 'dach' },
  okno_dach: { n: 'Okno dachowe z kołnierzem i montażem', u: 'szt.', m: 2800, l: 700, s: 'mid', g: 'dach' },

  // stolarka
  okna: { n: 'Okna PCV 3-szybowe z ciepłym montażem', u: 'm²', m: 1180, l: 360, s: 'fin', g: 'stolarka' },
  drzwi_zew: { n: 'Drzwi zewnętrzne wejściowe', u: 'szt.', m: 6400, l: 950, s: 'fin', g: 'stolarka' },
  brama: { n: 'Brama garażowa segmentowa z napędem', u: 'szt.', m: 7400, l: 1300, s: 'fin', g: 'stolarka' },

  // instalacje
  elektryka: { n: 'Instalacja elektryczna z rozdzielnicą', u: 'm²', m: 85, l: 100, s: 'mid', g: 'instal' },
  wodkan: { n: 'Instalacja wodno-kanalizacyjna', u: 'm²', m: 60, l: 75, s: 'mid', g: 'instal' },
  podlogowka: { n: 'Ogrzewanie podłogowe (rury, rozdzielacze)', u: 'm²', m: 90, l: 60, s: 'mid', g: 'instal' },
  pompa: { n: 'Pompa ciepła powietrze-woda z montażem', u: 'kpl', m: 38000, l: 7500, s: 'mid', g: 'instal' },
  gaz_kociol: { n: 'Kocioł gazowy kondensacyjny z zasobnikiem CWU', u: 'kpl', m: 14000, l: 4800, s: 'mid', g: 'instal' },
  pellet: { n: 'Kocioł na pellet z zasobnikiem i montażem', u: 'kpl', m: 25000, l: 5800, s: 'mid', g: 'instal' },
  rekuperacja: { n: 'Wentylacja mechaniczna z rekuperacją', u: 'm²', m: 160, l: 65, s: 'mid', g: 'instal' },
  pv: { n: 'Fotowoltaika ok. 6 kWp z montażem', u: 'kpl', m: 21000, l: 5000, s: 'mid', g: 'instal' },

  // tynki, wylewki, elewacja
  tynki: { n: 'Tynki wewnętrzne gipsowe maszynowe', u: 'm²', m: 22, l: 40, s: 'struct', g: 'tynki' },
  wylewki: { n: 'Wylewki z izolacją (styropian + jastrych)', u: 'm²', m: 78, l: 50, s: 'struct', g: 'tynki' },
  ocieplenie_dach: { n: 'Ocieplenie poddasza wełną 30 cm + zabudowa GK', u: 'm²', m: 115, l: 95, s: 'mid', g: 'tynki' },
  ocieplenie_strop: { n: 'Ocieplenie stropu i sufity GK', u: 'm²', m: 88, l: 68, s: 'mid', g: 'tynki' },
  elewacja: { n: 'Elewacja – styropian grafitowy 20 cm + tynk cienkowarstwowy', u: 'm²', m: 160, l: 125, s: 'mid', g: 'tynki' },

  // wykończenie
  gladz_mal: { n: 'Gładzie i malowanie ścian i sufitów', u: 'm²', m: 15, l: 52, s: 'fin', g: 'wyk' },
  podlogi: { n: 'Podłogi – panele / deska warstwowa z montażem', u: 'm²', m: 125, l: 48, s: 'fin', g: 'wyk' },
  plytki: { n: 'Płytki ceramiczne z ułożeniem i hydroizolacją', u: 'm²', m: 120, l: 165, s: 'fin', g: 'wyk' },
  lazienka_wyp: { n: 'Wyposażenie łazienki (ceramika, armatura, kabina)', u: 'kpl', m: 13500, l: 3300, s: 'fin', g: 'wyk' },
  drzwi_wew: { n: 'Drzwi wewnętrzne z ościeżnicą i montażem', u: 'szt.', m: 1150, l: 360, s: 'fin', g: 'wyk' },
  kuchnia: { n: 'Zabudowa kuchenna z blatem i AGD', u: 'kpl', m: 32000, l: 3200, s: 'fin', g: 'wyk' },
  schody_wyk: { n: 'Wykończenie schodów (okładzina, balustrada)', u: 'kpl', m: 9500, l: 3800, s: 'fin', g: 'wyk' },
  osprzet: { n: 'Osprzęt elektryczny i oświetlenie', u: 'm²', m: 48, l: 14, s: 'fin', g: 'wyk' },
  drobne: { n: 'Listwy, parapety wewnętrzne, silikony, drobne prace', u: 'm²', m: 26, l: 20, s: 'fin', g: 'wyk' },

  // remont
  r_projekt: { n: 'Projekt wnętrz', u: 'm²', m: 0, l: 120, s: 'fin', g: 'remont' },
  r_skuwanie: { n: 'Skuwanie płytek i starych okładzin', u: 'm²', m: 0, l: 85, s: 'fixed', g: 'remont' },
  r_zrywanie: { n: 'Demontaż podłóg, drzwi i starej zabudowy', u: 'm²', m: 0, l: 30, s: 'fixed', g: 'remont' },
  r_gruz: { n: 'Kontener i wywóz gruzu (7 m³)', u: 'szt.', m: 0, l: 1500, s: 'fixed', g: 'remont' },
  r_scianki: { n: 'Nowe ścianki działowe (GK lub bloczek)', u: 'm²', m: 72, l: 88, s: 'mid', g: 'remont' },
  r_elektryka: { n: 'Wymiana instalacji elektrycznej z rozdzielnicą', u: 'm²', m: 78, l: 120, s: 'mid', g: 'remont' },
  r_wodkan: { n: 'Wymiana instalacji wod-kan (łazienka / kuchnia)', u: 'pom.', m: 2400, l: 3500, s: 'mid', g: 'remont' },
  r_grzejniki: { n: 'Wymiana grzejników z podłączeniem', u: 'szt.', m: 880, l: 460, s: 'mid', g: 'remont' },
  r_tynki: { n: 'Naprawa i wyrównanie tynków', u: 'm²', m: 20, l: 52, s: 'struct', g: 'remont' },
  r_przyg: { n: 'Szpachlowanie ubytków i przygotowanie ścian', u: 'm²', m: 4, l: 15, s: 'struct', g: 'remont' },
  r_gladz: { n: 'Gładzie gipsowe (2 warstwy + szlifowanie)', u: 'm²', m: 12, l: 48, s: 'struct', g: 'remont' },
  r_malowanie: { n: 'Gruntowanie i malowanie 2×', u: 'm²', m: 10, l: 30, s: 'fin', g: 'remont' },
  r_sufity: { n: 'Sufity podwieszane i zabudowy GK', u: 'm²', m: 62, l: 92, s: 'mid', g: 'remont' },
  r_wylewka: { n: 'Wylewka samopoziomująca', u: 'm²', m: 34, l: 40, s: 'struct', g: 'remont' },
  r_kuchnia: { n: 'Kuchnia: zabudowa, blat, AGD i montaż', u: 'kpl', m: 24000, l: 2900, s: 'fin', g: 'remont' },
  r_okna: { n: 'Wymiana okien PCV z montażem i obróbką', u: 'm²', m: 1080, l: 390, s: 'fin', g: 'remont' },
  r_drzwi_wej: { n: 'Drzwi wejściowe do mieszkania (antywłamaniowe)', u: 'szt.', m: 3700, l: 650, s: 'fin', g: 'remont' },
  r_ochrona: { n: 'Zabezpieczenie lokalu i sprzątanie poremontowe', u: 'm²', m: 6, l: 15, s: 'fixed', g: 'remont' },

  // przyłącza i otoczenie
  przyl_prad: { n: 'Przyłącze energetyczne (opłata + złącze)', u: 'kpl', m: 1600, l: 2600, s: 'fixed', g: 'media' },
  przyl_woda: { n: 'Przyłącze wodociągowe', u: 'kpl', m: 3600, l: 4200, s: 'fixed', g: 'media' },
  przyl_kan: { n: 'Przyłącze kanalizacyjne', u: 'kpl', m: 3600, l: 4200, s: 'fixed', g: 'media' },
  oczyszczalnia: { n: 'Przydomowa oczyszczalnia ścieków', u: 'kpl', m: 13500, l: 4800, s: 'mid', g: 'media' },
  szambo: { n: 'Szambo betonowe 10 m³ z montażem', u: 'kpl', m: 6800, l: 2700, s: 'fixed', g: 'media' },
  przyl_gaz: { n: 'Przyłącze gazowe', u: 'kpl', m: 2900, l: 3300, s: 'fixed', g: 'media' },
  ogrodzenie: { n: 'Ogrodzenie z bramą wjazdową i furtką', u: 'mb', m: 220, l: 125, s: 'fin', g: 'media' },
  podjazd: { n: 'Podjazd i chodniki z kostki brukowej', u: 'm²', m: 98, l: 90, s: 'mid', g: 'media' },
  taras: { n: 'Taras (płytki lub deska kompozytowa)', u: 'm²', m: 270, l: 170, s: 'fin', g: 'media' },
  zielen: { n: 'Niwelacja terenu, trawnik i nasadzenia', u: 'm²', m: 18, l: 15, s: 'mid', g: 'media' },
} satisfies Record<string, PriceItem>;

export type PriceId = keyof typeof PRICES;
