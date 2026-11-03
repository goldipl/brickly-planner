import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CountUp } from '@/components/home/CountUp';
import { HeroAnnotations } from '@/components/home/HeroAnnotations';
import type { Annotation } from '@/components/home/HeroAnnotations';
import { PriceTicker } from '@/components/home/PriceTicker';
import { QuickEstimate } from '@/components/home/QuickEstimate';
import { Reveal } from '@/components/home/Reveal';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';
import { Faq, JsonLd } from '@/components/Seo';
import { PRICE_LABEL, PRICES } from '@/lib/data';
import { estimateHouse, unitPrice } from '@/lib/engine';
import * as fmt from '@/lib/format';
import { SITE_NAME, SITE_URL, asset, pageMetadata } from '@/lib/site';

const DESCRIPTION =
  'Darmowy kalkulator kosztów budowy domu i remontu mieszkania z harmonogramem prac. Aktualne ceny materiałów i robocizny w Polsce (2026), 16 województw, eksport do Excela i PDF.';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Brickly Planner – kosztorys i harmonogram budowy domu oraz remontu mieszkania',
    description: DESCRIPTION,
    path: '/',
  }),
  title: { absolute: 'Brickly Planner – kosztorys i harmonogram budowy domu oraz remontu mieszkania' },
};

// zdjęcie: Phil Hearing / Unsplash (licencja Unsplash) — wymiary oryginału do pozycjonowania adnotacji
const PHOTO = { w: 2400, h: 1601, credit: 'Phil Hearing', href: 'https://unsplash.com/photos/house-construction-with-scaffolding-and-brickwork-6lvui3Ak-eA' };

// liczby na zdjęciu pochodzą z tego samego silnika co kalkulator (dom 120 m², stan deweloperski)
const reference = estimateHouse({ scope: 3, formal: false, utilities: false, reserve: 0, start: '2027-03-01' });
const stageTotal = (...ids: string[]) =>
  reference.stages.filter((s) => ids.includes(s.id)).reduce((sum, s) => sum + s.total, 0);
const stageDays = (...ids: string[]) =>
  reference.stages.filter((s) => ids.includes(s.id)).reduce((sum, s) => sum + s.days, 0);
const wall = unitPrice('sciana_cer', { region: 'zachodniopomorskie', location: 'city', standard: 'std' });

const ANNOTATIONS: Annotation[] = [
  { x: 1560, y: 505, dx: 150, dy: -110, label: 'Więźba i pokrycie dachu', value: fmt.pln(stageTotal('dach'), 100), note: 'dom 120 m² · dachówka betonowa' },
  { x: 1385, y: 865, dx: 220, dy: -6, label: '1 m² muru z pustaka 25 cm', value: fmt.pln(wall.mat + wall.lab), note: 'materiał + robocizna' },
  { x: 1640, y: 1170, dx: 170, dy: -70, label: 'Ściany, wieńce i stropy', value: fmt.pln(stageTotal('sciany', 'stropy'), 100), note: `${stageDays('sciany', 'stropy')} dni rob. + 3 tyg. wiązania` },
];

const FEATURES: { icon: IconName; tone: string; title: string; text: string }[] = [
  { icon: 'list', tone: '', title: 'Kosztorys pozycja po pozycji', text: 'Ilości wyliczane z geometrii budynku: obwód, powierzchnia ścian, dachu i stropów. Widzisz, skąd bierze się każda złotówka.' },
  { icon: 'sun', tone: 'amber', title: 'Realny czas budowy', text: 'Uwzględniamy dojrzewanie betonu, schnięcie wylewek, przerwę zimową dla prac mokrych i czas produkcji okien czy kuchni.' },
  { icon: 'chart', tone: 'sage', title: 'Plan wydatków', text: 'Wykres miesięcznych kosztów pomaga zaplanować transze kredytu hipotecznego i wkład własny.' },
  { icon: 'pin', tone: 'ink', title: 'Ceny regionalne', text: 'Inne stawki w Warszawie, inne na Podkarpaciu. Korygujemy robociznę i materiały dla województwa i wielkości miejscowości.' },
  { icon: 'download', tone: '', title: 'Eksport i udostępnianie', text: 'Pobierz kosztorys do Excela (CSV), wydrukuj do PDF albo wyślij link do wyceny wykonawcy lub doradcy kredytowemu.' },
  { icon: 'lock', tone: 'amber', title: 'Prywatność', text: 'Bez konta i bez wysyłania danych na serwer. Projekty zapisują się lokalnie w Twojej przeglądarce.' },
];

const FAQ = [
  { q: 'Czy Brickly Planner jest darmowy?', a: 'Tak. Kalkulator budowy domu, kalkulator remontu, planer harmonogramu i cennik są bezpłatne i nie wymagają zakładania konta.' },
  { q: 'Skąd pochodzą ceny materiałów i robocizny?', a: 'Ceny bazowe opracowujemy na podstawie publicznych raportów rynkowych z 2026 roku (m.in. GUS, Grupa PSB, Sekocenbud oraz portali branżowych) i korygujemy je o region, wielkość miejscowości, standard wykończenia oraz sposób realizacji inwestycji.' },
  { q: 'Jak dokładna jest wycena?', a: 'To szacunek orientacyjny, dlatego podajemy realny przedział (od −10% do +15%) i domyślną rezerwę 10%. Wycena sprawdza się na etapie planowania budżetu i rozmów z bankiem, ale nie zastępuje kosztorysu inwestorskiego ani ofert wykonawców.' },
  { q: 'Czy harmonogram uwzględnia zimę i przerwy technologiczne?', a: 'Tak. Prace zewnętrzne zależne od pogody nie są planowane między 15 grudnia a końcem lutego (opcję można wyłączyć), a po betonowaniu stropów i wykonaniu wylewek kalkulator dodaje czas na dojrzewanie i schnięcie.' },
  { q: 'Gdzie zapisują się moje projekty?', a: 'Wyłącznie w pamięci Twojej przeglądarki (localStorage). Nie wysyłamy ich na serwer. Aby przenieść projekt na inny komputer, użyj eksportu do pliku JSON w planerze.' },
  { q: 'Czy mogę wydrukować kosztorys dla banku?', a: 'Tak. Kosztorys i harmonogram możesz wydrukować do PDF lub pobrać jako plik CSV, który otworzysz w Excelu albo Arkuszach Google i uzupełnisz o własne pozycje.' },
];

const MOCK_ROWS: [string, number, number, string][] = [
  ['Formalności', 0, 22, 'var(--bar-formal)'],
  ['Fundamenty', 23, 9, 'var(--bar-outdoor)'],
  ['Ściany i stropy', 33, 17, 'var(--bar-outdoor)'],
  ['Dach', 52, 9, 'var(--bar-outdoor)'],
  ['Instalacje', 62, 12, 'var(--bar-indoor)'],
  ['Elewacja', 63, 11, 'var(--bar-outdoor)'],
  ['Tynki i wylewki', 74, 14, 'var(--bar-indoor)'],
];

const STEPS = [
  ['Opisz inwestycję', 'Powierzchnia, kondygnacje, technologia, zakres prac i województwo — suwakami i przełącznikami.'],
  ['Sprawdź kosztorys', 'Silnik wylicza ilości (m², m³, mb) i wycenia każdą pozycję osobno — materiał i robociznę.'],
  ['Zobacz harmonogram', 'Etapy we właściwej kolejności, z dniami roboczymi, przerwami technologicznymi i zimą.'],
  ['Prowadź budowę', 'Przenieś plan do planera, aktualizuj postęp i wydatki, eksportuj do Excela lub PDF dla banku.'],
];

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          '@graph': [
            { '@type': 'WebSite', '@id': SITE_URL + '/#website', name: SITE_NAME, url: SITE_URL + '/', inLanguage: 'pl-PL', publisher: { '@id': SITE_URL + '/#org' } },
            {
              '@type': 'WebApplication', name: SITE_NAME, url: SITE_URL + '/', applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web', inLanguage: 'pl-PL', description: DESCRIPTION,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
            },
          ],
        }}
      />
      <Reveal />

      {/* ---------- HERO ---------- */}
      <section className="hero-photo">
        <div className="hero-media">
          <div className="hero-zoom">
            <picture>
              <source
                type="image/webp"
                srcSet={[1280, 1920, 2400].map((w) => `${asset(`/hero/budowa-${w}.webp`)} ${w}w`).join(', ')}
                sizes="100vw"
              />
              <img
                src={asset('/hero/budowa-1600.jpg')}
                alt="Dom w budowie: ceglane ściany parteru, rusztowania i drewniana więźba dachowa"
                width={PHOTO.w}
                height={PHOTO.h}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <div className="hero-shade" />
            <HeroAnnotations width={PHOTO.w} height={PHOTO.h} items={ANNOTATIONS} />
          </div>
        </div>

        <div className="wrap hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="hero-kicker">Kosztorys i harmonogram budowy domu i remontu</span>
              <span className="line"><span>Każda cegła</span></span>
              <span className="line"><span style={v({ '--d': '.12s' })}>ma swoją cenę.</span></span>
              <span className="line accent"><span style={v({ '--d': '.24s' })}>I swój termin.</span></span>
            </h1>
            <p className="hero-lead">
              Brickly Planner liczy koszt budowy domu lub remontu mieszkania pozycja po pozycji i układa harmonogram prac —
              z aktualnymi cenami materiałów i robocizny w Twoim województwie.
            </p>
            <QuickEstimate />
            <p className="hero-alt">
              Masz już plan?<Link href="/harmonogram-budowy/">Otwórz planer harmonogramu →</Link>
            </p>
          </div>
        </div>

        <a className="photo-credit" href={PHOTO.href} target="_blank" rel="noopener noreferrer">
          Fot. {PHOTO.credit} / Unsplash
        </a>
      </section>

      <PriceTicker />

      {/* ---------- LICZBY ---------- */}
      <section className="section-sm">
        <div className="wrap grid grid-4">
          {[
            { to: Object.keys(PRICES).length, text: 'pozycji cennika materiałów i robocizny' },
            { to: 16, text: 'województw z korektą cen regionalnych' },
            { to: 4, text: 'zakresy budowy: od SSO do „pod klucz”' },
            { to: 0, suffix: ' zł', text: 'bez konta — dane zostają na Twoim urządzeniu' },
          ].map((s, i) => (
            <div className="stat" key={s.text} data-reveal style={v({ '--i': i })}>
              <strong><CountUp to={s.to} suffix={s.suffix} /></strong>
              <span className="stat-bar" />
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- NARZĘDZIA ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Narzędzia</span>
            <h2>Jedno miejsce na budżet i terminy Twojej inwestycji</h2>
            <p className="lead">Wybierz, co planujesz. Kalkulator wyliczy ilości, koszty i kolejność prac, a planer pozwoli prowadzić budowę dzień po dniu.</p>
          </div>
          <div className="grid grid-2">
            <Link className="card card-link product-card" href="/kalkulator-budowy-domu/" data-reveal>
              <div className="card-icon"><Icon name="house" /></div>
              <h3>Kalkulator budowy domu</h3>
              <p className="muted">Kosztorys i harmonogram dla domu parterowego, z poddaszem lub piętrowego.</p>
              <ul>
                <li>Stan surowy otwarty, zamknięty, deweloperski lub pod klucz</li>
                <li>Technologia ścian, dach, fundamenty, ogrzewanie, rekuperacja, PV</li>
                <li>Formalności, przyłącza, przerwa zimowa i schnięcie wylewek</li>
              </ul>
              <span className="btn btn-primary btn-sm">Oblicz koszt budowy</span>
            </Link>
            <Link className="card card-link product-card" href="/kalkulator-remontu-mieszkania/" data-reveal style={v({ '--i': 1 })}>
              <div className="card-icon amber"><Icon name="wrench" /></div>
              <h3>Kalkulator remontu mieszkania</h3>
              <p className="muted">Od odświeżenia po remont generalny i wykończenie mieszkania od dewelopera.</p>
              <ul>
                <li>18 rodzajów prac: od instalacji po łazienkę i kuchnię</li>
                <li>Blok, kamienica lub nowe budownictwo</li>
                <li>Kolejność prac i czas oczekiwania na okna czy kuchnię</li>
              </ul>
              <span className="btn btn-dark btn-sm">Oblicz koszt remontu</span>
            </Link>
          </div>
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            <Link className="card card-link" href="/harmonogram-budowy/" data-reveal>
              <div className="card-icon ink"><Icon name="calendar" /></div>
              <h3>Planer harmonogramu</h3>
              <p className="muted">Wykres Gantta, postęp prac i budżet: plan kontra rzeczywiste wydatki. Zadania zależne przesuwają się same.</p>
            </Link>
            <Link className="card card-link" href="/cennik-budowlany/" data-reveal style={v({ '--i': 1 })}>
              <div className="card-icon sage"><Icon name="tag" /></div>
              <h3>Cennik budowlany 2026</h3>
              <p className="muted">Ceny materiałów i stawki robocizny za m², mb i komplet — przeliczone dla Twojego regionu i standardu.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- PODGLĄD PLANU ---------- */}
      <section className="section section-alt">
        <div className="wrap preview">
          <div data-reveal>
            <span className="eyebrow">Co dostajesz</span>
            <h2>Plan, który da się położyć na stole u kierownika budowy</h2>
            <p className="lead">Nie jedną kwotę „z sufitu”, tylko komplet dokumentów do rozmowy z wykonawcą i bankiem.</p>
            <ol className="preview-list">
              <li><div><strong>Kosztorys etapami</strong><span>Każda pozycja z ilością, ceną materiału i robocizny.</span></div></li>
              <li><div><strong>Harmonogram z datami</strong><span>Wykres Gantta z przerwami technologicznymi i zimą.</span></div></li>
              <li><div><strong>Wydatki miesiąc po miesiącu</strong><span>Gotowe pod transze kredytu i wkład własny.</span></div></li>
            </ol>
          </div>

          <div className="mock build" role="img" aria-label="Przykładowa wycena domu 120 m² w Brickly Planner" data-reveal>
            <div className="float-card float-b"><span className="muted">Przerwa technologiczna</span><strong>+28 dni schnięcia</strong></div>
            <div className="mock-head">
              <div>
                <div className="mock-title">Dom 120 m² z poddaszem</div>
                <div className="mock-sub">Stan deweloperski · standard · pompa ciepła</div>
              </div>
              <div className="mock-total"><strong>{Math.round(reference.totals.total / 1000)} tys. zł</strong><span>ok. {fmt.pln(reference.totals.total / 120, 10)}/m²</span></div>
            </div>
            <div className="mock-gantt">
              {MOCK_ROWS.map(([name, left, width, color], i) => (
                <div className="mock-row" key={name}>
                  <span>{name}</span>
                  <span className="mock-track"><i style={v({ left: `${left}%`, width: `${width}%`, background: color, '--i': i })} /></span>
                </div>
              ))}
            </div>
            <div className="mock-foot">
              <span className="chip">Materiały <b>{Math.round((reference.totals.mat / reference.totals.total) * 100)}%</b></span>
              <span className="chip">Robocizna <b>{Math.round((reference.totals.lab / reference.totals.total) * 100)}%</b></span>
              <span className="chip">Budowa <b>ok. {fmt.num(reference.schedule.months, 0)} mies.</b></span>
            </div>
            <div className="float-card float-a"><span className="muted">Plan wydatków</span><strong>miesiąc po miesiącu</strong></div>
          </div>
        </div>
      </section>

      {/* ---------- JAK TO DZIAŁA ---------- */}
      <section className="section" id="jak-to-dziala">
        <div className="wrap">
          <div className="section-head center" data-reveal>
            <span className="eyebrow">Jak to działa</span>
            <h2>Od pomysłu do harmonogramu w 4 krokach</h2>
          </div>
          <div className="steps-rail" data-reveal />
          <div className="steps">
            {STEPS.map(([title, text], i) => (
              <div className="step" key={title} data-reveal style={v({ '--i': i + 1 })}>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FUNKCJE ---------- */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Dlaczego Brickly</span>
            <h2>Więcej niż kalkulator „cena × metry”</h2>
          </div>
          <div className="grid grid-3">
            {FEATURES.map((f, i) => (
              <div className="card" key={f.title} data-reveal style={v({ '--i': i % 3 })}>
                <div className={'card-icon ' + f.tone}><Icon name={f.icon} /></div>
                <h3>{f.title}</h3>
                <p className="muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TREŚĆ SEO ---------- */}
      <section className="section">
        <div className="wrap article-layout">
          <div className="prose" data-reveal>
            <span className="eyebrow">Koszty w 2026 roku</span>
            <h2 style={{ marginTop: 0 }}>Ile kosztuje budowa domu i remont mieszkania w 2026?</h2>
            <p>
              Koszt budowy domu w Polsce w 2026 roku zależy przede wszystkim od <strong>zakresu prac</strong>, <strong>regionu</strong> i{' '}
              <strong>sposobu realizacji</strong>. Dom o powierzchni 120 m² z poddaszem użytkowym, budowany przez generalnego wykonawcę
              w standardowej technologii murowanej, kosztuje według kalkulatora Brickly średnio:
            </p>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Etap (dom 120 m²)</th><th>Koszt łączny</th><th>Za m²</th></tr></thead>
                <tbody>
                  <tr><td>Stan surowy otwarty (SSO)</td><td>ok. 366 tys. zł</td><td>ok. 3 050 zł</td></tr>
                  <tr><td>Stan surowy zamknięty (SSZ)</td><td>ok. 415 tys. zł</td><td>ok. 3 460 zł</td></tr>
                  <tr><td>Stan deweloperski</td><td>ok. 710 tys. zł</td><td>ok. 5 920 zł</td></tr>
                  <tr><td>Pod klucz</td><td>ok. 910 tys. zł</td><td>ok. 7 580 zł</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Kwoty nie obejmują działki, projektu, przyłączy ani rezerwy — te pozycje możesz włączyć w kalkulatorze. W województwie
              mazowieckim i dużych miastach stan deweloperski to nawet <strong>6 700 zł/m²</strong>, a na terenach wiejskich Podkarpacia czy
              Lubelszczyzny około <strong>5 400 zł/m²</strong>.
            </p>
            <p>
              Remont mieszkania w 2026 roku kosztuje od ok. <strong>500 zł/m²</strong> za odświeżenie (malowanie, nowe podłogi), przez{' '}
              <strong>1 800–2 500 zł/m²</strong> za remont standardowy z łazienką i kuchnią, do <strong>2 900–3 800 zł/m²</strong> za remont
              generalny z wymianą instalacji i okien. Szczegóły znajdziesz w poradnikach{' '}
              <Link href="/poradnik/ile-kosztuje-budowa-domu/">ile kosztuje budowa domu</Link> oraz{' '}
              <Link href="/poradnik/ile-kosztuje-remont-mieszkania/">ile kosztuje remont mieszkania</Link>.
            </p>
          </div>
          <aside className="aside-sticky">
            <div className="card">
              <h3>Sprawdź swój wariant</h3>
              <p className="muted">Zmień metraż, technologię i województwo — wynik i harmonogram przeliczą się na żywo.</p>
              <Link className="btn btn-primary btn-sm" href="/kalkulator-budowy-domu/">Kalkulator budowy domu</Link>
            </div>
            <div className="callout">
              Ceny bazowe aktualizujemy na podstawie raportów rynkowych (GUS, Grupa PSB, Sekocenbud). Stan cen: <strong>{PRICE_LABEL}</strong>.
            </div>
          </aside>
        </div>
      </section>

      <Faq id="faq" items={FAQ} title={<><span className="eyebrow">FAQ</span><h2>Najczęstsze pytania</h2></>} />

      <section className="section-sm">
        <div className="wrap">
          <div className="cta-band" data-reveal>
            <div>
              <h2>Gotowy, żeby położyć pierwszą cegłę?</h2>
              <p>Kosztorys, harmonogram i plan wydatków w minutę. Bez rejestracji.</p>
            </div>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/kalkulator-budowy-domu/">Zacznij planować</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
