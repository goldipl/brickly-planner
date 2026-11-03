import type { Metadata } from 'next';
import Link from 'next/link';
import { PriceList } from '@/components/PriceList';
import { Breadcrumbs, Faq } from '@/components/Seo';
import { PRICE_LABEL } from '@/lib/data';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Cennik budowlany 2026 – ceny materiałów i robocizny w Polsce',
  description:
    'Aktualne ceny materiałów budowlanych i stawki robocizny 2026: fundamenty, ściany, dach, okna, instalacje, tynki, wykończenie i remont. Przeliczenie dla województwa i standardu.',
  path: '/cennik-budowlany/',
});

const FAQ = [
  { q: 'Ile kosztuje m² ściany z pustaka w 2026 roku?', a: 'Wymurowanie 1 m² ściany zewnętrznej z pustaka ceramicznego 25 cm kosztuje w 2026 roku ok. 250–270 zł brutto (materiał ok. 120 zł, robocizna ok. 135 zł) przy średnich stawkach krajowych. W dużych miastach robocizna jest droższa o 15–25%.' },
  { q: 'Ile kosztuje położenie gładzi i malowanie za m²?', a: 'Gładź gipsowa w dwóch warstwach ze szlifowaniem to ok. 65 zł/m² z materiałem, a gruntowanie z dwukrotnym malowaniem ok. 45 zł/m². W Warszawie i Krakowie stawki są wyższe o ok. 20%.' },
  { q: 'Dlaczego ceny różnią się między województwami?', a: 'Największe różnice dotyczą robocizny — w regionach z dużym popytem na usługi budowlane (mazowieckie, małopolskie, pomorskie, dolnośląskie) ekipy są droższe. Ceny materiałów różnią się mniej, głównie przez koszty transportu.' },
];

export default function PricePage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: 'Cennik budowlany 2026' }]} />
          <h1>Cennik budowlany 2026: materiały i robocizna</h1>
          <p className="lead">
            Ceny jednostkowe brutto, na których opiera się kalkulator Brickly — przeliczone dla wybranego województwa, wielkości
            miejscowości i standardu wykończenia. Stan cen: <strong>{PRICE_LABEL}</strong>.
          </p>
        </div>
      </section>

      <div className="wrap">
        <PriceList />
      </div>

      <section className="section section-alt">
        <div className="wrap prose">
          <h2 style={{ marginTop: 0 }}>Jak czytać cennik?</h2>
          <p>
            Każda pozycja ma osobną cenę <strong>materiału</strong> i <strong>robocizny</strong> za jednostkę (m², m³, mb, sztukę lub komplet).
            Robocizna zależy przede wszystkim od regionu i wielkości miejscowości, materiały — od wybranego standardu. Ceny dotyczą ekip
            zatrudnianych osobno; generalny wykonawca dolicza zwykle 10–20% za koordynację, a w systemie gospodarczym część robocizny
            wykonujesz sam.
          </p>
          <p>
            Ceny materiałów budowlanych w 2026 roku rosną umiarkowanie, najmocniej drożeją wyroby energochłonne (cement, beton,
            ceramika), dachy i drewno. Szybciej rosną stawki ekip. Dlatego w kosztorysie zawsze warto zostawić{' '}
            <strong>rezerwę 10–15%</strong>. Pełną wycenę Twojej inwestycji przygotujesz w{' '}
            <Link href="/kalkulator-budowy-domu/">kalkulatorze budowy domu</Link> lub{' '}
            <Link href="/kalkulator-remontu-mieszkania/">kalkulatorze remontu</Link>.
          </p>
        </div>
      </section>

      <Faq items={FAQ} title={<h2>Pytania o ceny</h2>} />
    </>
  );
}
