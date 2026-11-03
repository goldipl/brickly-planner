import type { Metadata } from 'next';
import Link from 'next/link';
import { Article } from '@/components/Article';
import { Faq } from '@/components/Seo';
import { pageMetadata } from '@/lib/site';

const PATH = '/poradnik/ile-kosztuje-budowa-domu/';
const TITLE = 'Ile kosztuje budowa domu w 2026 roku? Ceny za m² i przykłady';
const DESCRIPTION =
  'Koszt budowy domu w 2026: stan surowy otwarty, zamknięty, deweloperski i pod klucz. Ceny za m², przykłady dla domów 100, 120 i 150 m², różnice regionalne i sposoby na oszczędności.';

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' });

const FAQ = [
  { q: 'Ile kosztuje budowa domu 100 m² w 2026 roku?', a: 'Dom parterowy 100 m² budowany przez generalnego wykonawcę kosztuje ok. 380 tys. zł w stanie surowym zamkniętym, ok. 630 tys. zł w stanie deweloperskim i ok. 800 tys. zł pod klucz (bez działki, projektu i przyłączy, średnio drogi region).' },
  { q: 'Czy za 500 tys. zł da się zbudować dom?', a: 'Tak, ale zwykle do stanu surowego zamkniętego lub małego domu (ok. 80–90 m²) w stanie deweloperskim, najlepiej w tańszym regionie i z częścią prac wykonanych samodzielnie. Na dom 120 m² pod klucz budżet 500 tys. zł w 2026 roku nie wystarczy.' },
  { q: 'Co jest najdroższe przy budowie domu?', a: 'W stanie deweloperskim najwięcej kosztują instalacje z ogrzewaniem (ok. 20% budżetu), ściany i stropy (ok. 25%) oraz dach (ok. 14%). Przy wykończeniu pod klucz dużą pozycją są kuchnia i łazienki.' },
];

export default function Page() {
  return (
    <>
      <Article
        path={PATH}
        title={TITLE}
        description={DESCRIPTION}
        crumb="Ile kosztuje budowa domu"
        readMinutes={7}
        toc={[
          ['ceny-za-m2', 'Ceny za m² w 2026'],
          ['przyklady', 'Przykłady: 100, 120 i 150 m²'],
          ['regiony', 'Różnice między województwami'],
          ['czynniki', 'Co podnosi i obniża koszt'],
          ['dodatkowe', 'Koszty, o których się zapomina'],
          ['oszczednosci', 'Jak oszczędzić'],
        ]}
        cta={{ title: 'Policz swój dom', text: 'Wpisz metraż, technologię i województwo — kosztorys i harmonogram w minutę.', href: '/kalkulator-budowy-domu/', label: 'Kalkulator budowy domu' }}
      >
        <p>
          Budowa domu w 2026 roku jest wyraźnie droższa niż jeszcze dwa lata temu. Ceny materiałów rosną umiarkowanie — o kilka procent
          rocznie — ale znacznie szybciej drożeje robocizna. Poniżej znajdziesz aktualne koszty za metr kwadratowy dla każdego etapu
          budowy, przykładowe budżety i listę wydatków, które najczęściej umykają w planowaniu.
        </p>

        <h2 id="ceny-za-m2">Koszt budowy domu za m² w 2026 roku</h2>
        <p>
          Dla domu 120 m² z poddaszem użytkowym, w technologii murowanej, budowanego przez generalnego wykonawcę w regionie o średnich
          cenach, kalkulator Brickly wylicza:
        </p>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Etap budowy</th><th>Za m²</th><th>Dom 120 m²</th></tr></thead>
            <tbody>
              <tr><td>Stan surowy otwarty (SSO)</td><td>ok. 3 050 zł</td><td>ok. 366 tys. zł</td></tr>
              <tr><td>Stan surowy zamknięty (SSZ)</td><td>ok. 3 460 zł</td><td>ok. 415 tys. zł</td></tr>
              <tr><td>Stan deweloperski</td><td>ok. 5 920 zł</td><td>ok. 710 tys. zł</td></tr>
              <tr><td>Pod klucz</td><td>ok. 7 580 zł</td><td>ok. 910 tys. zł</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Kwoty to ceny brutto z materiałami i robocizną, bez działki, projektu, przyłączy i rezerwy. Najbardziej kosztowny jest skok
          ze stanu surowego zamkniętego do deweloperskiego: dochodzą instalacje, źródło ciepła, wentylacja, tynki, wylewki i elewacja,
          czyli prawie 300 tys. zł dla domu 120 m².
        </p>

        <h2 id="przyklady">Przykładowe koszty budowy domu 100, 120 i 150 m²</h2>
        <p>Koszt metra kwadratowego maleje wraz z powierzchnią — fundamenty, dach, kominy i formalności rozkładają się na więcej metrów.</p>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Dom</th><th>SSZ</th><th>Deweloperski</th><th>Pod klucz</th></tr></thead>
            <tbody>
              <tr><td>100 m², parterowy</td><td>ok. 379 tys. zł</td><td>ok. 630 tys. zł</td><td>ok. 800 tys. zł</td></tr>
              <tr><td>120 m², z poddaszem</td><td>ok. 415 tys. zł</td><td>ok. 710 tys. zł</td><td>ok. 910 tys. zł</td></tr>
              <tr><td>150 m², piętrowy</td><td>ok. 439 tys. zł</td><td>ok. 777 tys. zł</td><td>ok. 998 tys. zł</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Dom parterowy jest najdroższy w przeliczeniu na metr (ok. 6 300 zł/m² w stanie deweloperskim), bo ma duży dach i fundamenty
          w stosunku do powierzchni. Dom piętrowy 150 m² to ok. 5 180 zł/m² — najtańszy metr, ale wyższy budżet całkowity.
        </p>

        <h2 id="regiony">Ceny budowy domu w województwach</h2>
        <p>Różnice regionalne dotyczą głównie stawek ekip. Stan deweloperski domu 120 m² za m²:</p>
        <ul>
          <li><strong>mazowieckie, duże miasto:</strong> ok. 6 720 zł</li>
          <li><strong>małopolskie i pomorskie, duże miasto:</strong> ok. 6 520–6 560 zł</li>
          <li><strong>wielkopolskie i śląskie:</strong> ok. 5 960–6 030 zł</li>
          <li><strong>łódzkie:</strong> ok. 5 760 zł</li>
          <li><strong>podkarpackie i lubelskie, tereny wiejskie:</strong> ok. 5 400–5 430 zł</li>
        </ul>

        <h2 id="czynniki">Co najbardziej wpływa na koszt budowy domu</h2>
        <h3>Sposób realizacji</h3>
        <p>
          Generalny wykonawca to jedna umowa, jedna gwarancja i najkrótszy czas — dla domu 120 m² do stanu deweloperskiego ok. 710 tys. zł
          i ok. 9 miesięcy pracy. Osobne ekipy na etapy to ok. 627 tys. zł, a system gospodarczy (część prac samodzielnie) ok. 551 tys. zł,
          ale budowa wydłuża się do ok. 11 miesięcy i wymaga Twojego czasu na koordynację.
        </p>
        <h3>Technologia ścian</h3>
        <p>
          Wybór między pustakiem ceramicznym, betonem komórkowym i silikatem zmienia budżet o mniej niż 1% — materiał na 1 m² muru kosztuje
          podobnie, różnice wynikają z robocizny. Szkielet drewniany jest o ok. 5% droższy w stanie deweloperskim, ale skraca czas stawiania
          ścian.
        </p>
        <h3>Ogrzewanie i standard</h3>
        <p>
          Pompa ciepła powietrze-woda podnosi koszt inwestycji o ok. 30 tys. zł względem kotła gazowego, ale nie wymaga przyłącza gazu
          i komina. Standard wykończenia ma ogromne znaczenie przy domu pod klucz: od ok. 6 970 zł/m² w wariancie ekonomicznym do
          ok. 9 100 zł/m² w premium.
        </p>

        <h2 id="dodatkowe">Koszty, o których inwestorzy zapominają</h2>
        <ul>
          <li><strong>Projekt, mapa, badania gruntu i kierownik budowy</strong> — ok. 35 tys. zł.</li>
          <li><strong>Przyłącza</strong> prądu, wody i kanalizacji — ok. 25 tys. zł (oczyszczalnia przydomowa jest droższa).</li>
          <li><strong>Odbiory i inwentaryzacja</strong> geodezyjna — ok. 5–6 tys. zł.</li>
          <li><strong>Zagospodarowanie działki</strong>: ogrodzenie, podjazd, taras, trawnik — często 80–120 tys. zł.</li>
          <li><strong>Rezerwa</strong> 10–15% budżetu na zmiany cen i niespodzianki.</li>
        </ul>
        <p>
          Dom 120 m² pod klucz z formalnościami i przyłączami to w praktyce ok. 970 tys. zł, a z 10% rezerwą — ponad 1 mln zł.
        </p>

        <h2 id="oszczednosci">Jak obniżyć koszt budowy domu</h2>
        <ol>
          <li>Wybierz <strong>prostą bryłę</strong> z dachem dwuspadowym, bez lukarn i wykuszy.</li>
          <li>Zbuduj <strong>dom piętrowy</strong> zamiast parterowego o tej samej powierzchni.</li>
          <li>Zamawiaj materiały z wyprzedzeniem i negocjuj ceny w hurtowni dla całej budowy.</li>
          <li>Prace wykończeniowe (malowanie, panele) wykonaj samodzielnie.</li>
          <li>Rozplanuj harmonogram tak, by uniknąć przestojów zimowych i opłacania ekip za czekanie.</li>
        </ol>
        <div className="callout">
          Wszystkie liczby w tym artykule pochodzą z <Link href="/kalkulator-budowy-domu/">kalkulatora Brickly</Link> (ceny: listopad 2026).
          Zmień parametry, aby zobaczyć wycenę dla swojego projektu.
        </div>
      </Article>
      <Faq items={FAQ} title={<h2>Najczęstsze pytania o koszt budowy</h2>} />
    </>
  );
}
