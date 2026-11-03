import type { Metadata } from 'next';
import Link from 'next/link';
import { RenoCalculator } from '@/components/calculator/RenoCalculator';
import { Breadcrumbs, Faq, WebAppSchema } from '@/components/Seo';
import { PRICE_LABEL } from '@/lib/data';
import { pageMetadata } from '@/lib/site';

const PATH = '/kalkulator-remontu-mieszkania/';
const DESCRIPTION =
  'Ile kosztuje remont mieszkania? Policz koszt remontu łazienki, kuchni, wymiany instalacji i wykończenia pod klucz. Aktualne stawki robocizny i ceny materiałów, harmonogram prac.';

export const metadata: Metadata = pageMetadata({
  title: 'Kalkulator remontu mieszkania 2026 – koszt i plan prac',
  description: DESCRIPTION,
  path: PATH,
});

const FAQ = [
  { q: 'Ile kosztuje remont mieszkania 50 m² w 2026 roku?', a: 'Według kalkulatora Brickly odświeżenie mieszkania ok. 55 m² (malowanie, podłogi, osprzęt) to ok. 29 tys. zł, remont standardowy z łazienką i kuchnią ok. 114 tys. zł, a remont generalny z wymianą instalacji i okien ok. 180 tys. zł — w średnio drogim regionie, z materiałami i robocizną.' },
  { q: 'Ile trwa remont mieszkania?', a: 'Odświeżenie zajmuje zwykle 3–5 tygodni, remont standardowy 2–2,5 miesiąca, a generalny ok. 3 miesięcy. Najdłużej czeka się na okna (4–6 tygodni produkcji) i kuchnię na wymiar (ok. 6 tygodni), dlatego warto zamówić je na samym początku.' },
  { q: 'W jakiej kolejności robić remont?', a: 'Rozbiórki → instalacje elektryczne i wod-kan → okna → tynki, ścianki i wylewki → gładzie i sufity → łazienka → malowanie → podłogi → kuchnia, drzwi i osprzęt. Kalkulator układa harmonogram dokładnie w tej kolejności.' },
  { q: 'Czy remont w kamienicy jest droższy?', a: 'Tak, zwykle o 10–20%. Wyższe pomieszczenia oznaczają więcej metrów ścian, a krzywe tynki i stare instalacje wymagają dodatkowej pracy. Kalkulator uwzględnia to po wyborze typu budynku i wysokości pomieszczeń.' },
  { q: 'Jaką stawkę VAT mają usługi remontowe?', a: 'Remont lokalu mieszkalnego do 150 m² wykonywany przez firmę jest objęty 8% VAT (dotyczy robocizny i materiałów wliczonych w usługę). Materiały kupowane samodzielnie mają 23% VAT. Kwoty w kalkulatorze są cenami brutto.' },
];

export default function RenoCalculatorPage() {
  return (
    <>
      <WebAppSchema name="Kalkulator kosztów remontu mieszkania" description={DESCRIPTION} path={PATH} />
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: 'Kalkulator remontu mieszkania' }]} />
          <h1>Kalkulator remontu mieszkania 2026</h1>
          <p className="lead">
            Wybierz zakres prac, a otrzymasz kosztorys z podziałem na materiały i robociznę, kolejność prac i realny termin zakończenia
            remontu. Stawki: <strong>{PRICE_LABEL}</strong>.
          </p>
        </div>
      </section>

      <RenoCalculator />

      <section className="section section-alt">
        <div className="wrap article-layout">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Jak policzyć koszt remontu mieszkania?</h2>
            <p>
              Koszt remontu to suma konkretnych prac, a nie jedna stawka za metr. Kalkulator wylicza z powierzchni i wysokości mieszkania{' '}
              <strong>powierzchnię ścian i sufitów do gładzi i malowania</strong>, metraż płytek w łazience, liczbę drzwi i grzejników,
              a następnie wycenia każdą pozycję według aktualnych stawek w Twoim regionie.
            </p>
            <h3>Cztery typowe zakresy remontu</h3>
            <ul>
              <li><strong>Odświeżenie</strong> — szpachlowanie ubytków, malowanie, nowe podłogi i osprzęt. Ok. 500 zł/m².</li>
              <li><strong>Remont standardowy</strong> — gładzie, wylewki, podłogi, łazienka pod klucz, kuchnia i drzwi. Ok. 1 800–2 500 zł/m².</li>
              <li><strong>Remont generalny</strong> — dodatkowo wymiana instalacji, okien, grzejników i zmiana układu. Ok. 2 900–3 800 zł/m².</li>
              <li><strong>Wykończenie od dewelopera</strong> — gładzie, sufity, łazienka, kuchnia i podłogi w nowym mieszkaniu. Ok. 1 600–2 300 zł/m².</li>
            </ul>
            <h3>Najdroższe pozycje remontu</h3>
            <p>
              Największą część budżetu pochłaniają zwykle <strong>kuchnia z AGD</strong>, <strong>łazienka</strong> (płytki z hydroizolacją
              i biały montaż) oraz <strong>wymiana instalacji elektrycznej</strong>. Szczegółowe stawki za m² znajdziesz w{' '}
              <Link href="/cennik-budowlany/">cenniku budowlanym 2026</Link>, a omówienie kosztów w artykule{' '}
              <Link href="/poradnik/ile-kosztuje-remont-mieszkania/">ile kosztuje remont mieszkania</Link>.
            </p>
          </div>
          <aside className="aside-sticky">
            <div className="card">
              <h3>Prowadź remont w planerze</h3>
              <p className="muted">Przenieś harmonogram do planera i notuj faktyczne wydatki — od razu zobaczysz, czy mieścisz się w budżecie.</p>
              <Link className="btn btn-dark btn-sm" href="/harmonogram-budowy/">Otwórz planer</Link>
            </div>
            <div className="callout brick">
              W blokach i kamienicach zgłoś remont administracji, a wymianę grzejników lub pionów uzgodnij ze spółdzielnią lub wspólnotą.
            </div>
          </aside>
        </div>
      </section>

      <Faq items={FAQ} title={<h2>Pytania o koszt remontu</h2>} />
    </>
  );
}
