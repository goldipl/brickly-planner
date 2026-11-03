import type { Metadata } from 'next';
import Link from 'next/link';
import { HouseCalculator } from '@/components/calculator/HouseCalculator';
import { Breadcrumbs, Faq, WebAppSchema } from '@/components/Seo';
import { PRICE_LABEL } from '@/lib/data';
import { pageMetadata } from '@/lib/site';

const PATH = '/kalkulator-budowy-domu/';
const DESCRIPTION =
  'Oblicz koszt budowy domu w 2026 roku: stan surowy, deweloperski lub pod klucz. Kosztorys etap po etapie, harmonogram prac z wykresem Gantta i plan wydatków. Ceny dla 16 województw.';

export const metadata: Metadata = pageMetadata({
  title: 'Kalkulator kosztów budowy domu 2026 – kosztorys i harmonogram',
  description: DESCRIPTION,
  path: PATH,
});

const FAQ = [
  { q: 'Ile kosztuje budowa domu 120 m² w 2026 roku?', a: 'Według kalkulatora Brickly dom 120 m² z poddaszem użytkowym, budowany przez generalnego wykonawcę w średnio drogim regionie, kosztuje ok. 415 tys. zł w stanie surowym zamkniętym, ok. 710 tys. zł w stanie deweloperskim i ok. 910 tys. zł pod klucz — bez działki, projektu i przyłączy.' },
  { q: 'Co obejmuje stan deweloperski domu?', a: 'Stan deweloperski to budynek z oknami i drzwiami zewnętrznymi, kompletnymi instalacjami (elektryczną, wodno-kanalizacyjną, grzewczą i wentylacją), tynkami, wylewkami oraz ociepleniem i elewacją. Brakuje podłóg, malowania, płytek, białego montażu, drzwi wewnętrznych i kuchni.' },
  { q: 'Czy taniej jest budować systemem gospodarczym?', a: 'Zwykle tak — oszczędność na robociźnie sięga 20–30%, ale budowa trwa dłużej, a Ty odpowiadasz za koordynację ekip, zakupy materiałów i terminy. W kalkulatorze porównasz oba warianty jednym kliknięciem.' },
  { q: 'Czy w kosztorysie jest VAT?', a: 'Tak, wszystkie kwoty są cenami brutto. Przy usługach budowlanych w domach jednorodzinnych do 300 m² obowiązuje 8% VAT na robociznę wraz z materiałami wykonawcy; materiały kupowane samodzielnie mają 23% VAT.' },
  { q: 'Ile pieniędzy potrzebuję na start budowy?', a: 'Na formalności, projekt, zaplecze i fundamenty zarezerwuj ok. 10–15% budżetu. Wykres „Wydatki w czasie” pokazuje, ile pieniędzy potrzebujesz w każdym miesiącu — to dobra podstawa do rozmowy o transzach kredytu.' },
];

export default function HouseCalculatorPage() {
  return (
    <>
      <WebAppSchema name="Kalkulator kosztów budowy domu" description={DESCRIPTION} path={PATH} />
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: 'Kalkulator budowy domu' }]} />
          <h1>Kalkulator kosztów budowy domu 2026</h1>
          <p className="lead">
            Opisz swój dom, a otrzymasz kosztorys etap po etapie, harmonogram prac z wykresem Gantta i plan wydatków. Ceny materiałów
            i robocizny: <strong>{PRICE_LABEL}</strong>.
          </p>
        </div>
      </section>

      <HouseCalculator />

      <section className="section section-alt">
        <div className="wrap article-layout">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Jak liczymy koszt budowy domu?</h2>
            <p>
              Kalkulator Brickly nie mnoży po prostu metrażu przez średnią cenę. Na podstawie powierzchni użytkowej i bryły budynku wyznacza{' '}
              <strong>powierzchnię zabudowy, obwód ścian, powierzchnię dachu, stropów i elewacji</strong>, a następnie wycenia każdą pozycję
              osobno — materiał i robociznę. Dzięki temu wynik reaguje na realne decyzje projektowe: dom parterowy ma większy dach
              i fundamenty, a piętrowy — więcej ścian i droższy strop.
            </p>
            <h3>Co najbardziej wpływa na koszt budowy?</h3>
            <ul>
              <li><strong>Zakres prac</strong> — przejście ze stanu surowego zamkniętego do deweloperskiego zwykle podwaja budżet, bo dochodzą instalacje, ogrzewanie, tynki, wylewki i elewacja.</li>
              <li><strong>Bryła i wielkość domu</strong> — koszt metra kwadratowego maleje wraz z powierzchnią, a prosta bryła z dachem dwuspadowym jest najtańsza.</li>
              <li><strong>Region</strong> — stawki ekip w Warszawie, Krakowie czy Trójmieście są wyraźnie wyższe niż w województwach wschodnich.</li>
              <li><strong>Sposób realizacji</strong> — generalny wykonawca to wygoda i jedna gwarancja, system gospodarczy to oszczędność kosztem czasu i Twojego zaangażowania.</li>
              <li><strong>Źródło ciepła i wentylacja</strong> — pompa ciepła i rekuperacja podnoszą koszt inwestycji, ale obniżają rachunki i są standardem w nowych domach.</li>
            </ul>
            <h3>Harmonogram budowy domu</h3>
            <p>
              Harmonogram powstaje z zależności między etapami: dach nie ruszy przed związaniem stropu, a podłogi — przed wyschnięciem
              wylewek. Prace mokre na zewnątrz kalkulator przesuwa poza okres zimowy. Typowa budowa domu 120 m² do stanu deweloperskiego
              przez generalnego wykonawcę trwa ok. <strong>9 miesięcy</strong>, a z formalnościami i wykończeniem pod klucz —{' '}
              <strong>14–16 miesięcy</strong>. Więcej o kolejności prac przeczytasz w artykule{' '}
              <Link href="/poradnik/etapy-budowy-domu/">etapy budowy domu krok po kroku</Link>.
            </p>
          </div>
          <aside className="aside-sticky">
            <div className="card">
              <h3>Następny krok</h3>
              <p className="muted">Kliknij „Otwórz w planerze”, aby prowadzić budowę: aktualizuj postęp i porównuj wydatki z planem.</p>
              <Link className="btn btn-dark btn-sm" href="/harmonogram-budowy/">Przejdź do planera</Link>
            </div>
            <div className="card">
              <h3>Ceny jednostkowe</h3>
              <p className="muted">Sprawdź, ile kosztuje m² ściany, dachu czy elewacji w Twoim regionie.</p>
              <Link className="btn btn-ghost btn-sm" href="/cennik-budowlany/">Cennik budowlany 2026</Link>
            </div>
          </aside>
        </div>
      </section>

      <Faq items={FAQ} title={<h2>Pytania o koszt budowy domu</h2>} />
    </>
  );
}
