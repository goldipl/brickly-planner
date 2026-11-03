import type { Metadata } from 'next';
import Link from 'next/link';
import { Article } from '@/components/Article';
import { Faq } from '@/components/Seo';
import { pageMetadata } from '@/lib/site';

const PATH = '/poradnik/ile-kosztuje-remont-mieszkania/';
const TITLE = 'Ile kosztuje remont mieszkania w 2026 roku? Cennik prac i przykładowe budżety';
const DESCRIPTION =
  'Koszt remontu mieszkania w 2026: odświeżenie, remont standardowy i generalny. Stawki robocizny za m², koszt łazienki i kuchni, przykłady dla mieszkań 40, 55 i 75 m².';

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' });

const FAQ = [
  { q: 'Ile kosztuje remont łazienki w 2026 roku?', a: 'Kompletny remont łazienki ok. 4–5 m² z rozbiórką, wymianą instalacji, płytkami z hydroizolacją i białym montażem kosztuje zwykle 35–55 tys. zł w standardzie średnim. Same płytki z ułożeniem to ok. 310 zł/m², a wyposażenie łazienki ok. 18 tys. zł.' },
  { q: 'Ile kosztuje remont kawalerki?', a: 'Remont standardowy mieszkania ok. 30–40 m² z łazienką i aneksem kuchennym kosztuje ok. 80–100 tys. zł, a odświeżenie (malowanie, podłogi, osprzęt) ok. 15–21 tys. zł.' },
  { q: 'Co najpierw: podłogi czy malowanie?', a: 'Najpierw gładzie i pierwsze malowanie, potem podłogi, a na końcu montaż drzwi, listew i ostatnia poprawka malarska. Dzięki temu nie zabrudzisz nowych podłóg farbą ani pyłem z gładzi.' },
];

export default function Page() {
  return (
    <>
      <Article
        path={PATH}
        title={TITLE}
        description={DESCRIPTION}
        crumb="Ile kosztuje remont mieszkania"
        readMinutes={6}
        toc={[
          ['zakresy', 'Koszt remontu za m²'],
          ['przyklady', 'Przykłady: 40, 55 i 75 m²'],
          ['stawki', 'Stawki robocizny 2026'],
          ['lazienka-kuchnia', 'Łazienka i kuchnia'],
          ['czas', 'Ile trwa remont'],
          ['budzet', 'Jak nie przekroczyć budżetu'],
        ]}
        cta={{ title: 'Policz swój remont', text: 'Zaznacz zakres prac — dostaniesz kosztorys i kolejność robót.', href: '/kalkulator-remontu-mieszkania/', label: 'Kalkulator remontu' }}
      >
        <p>
          Koszt remontu mieszkania zależy przede wszystkim od zakresu prac. Inaczej wycenia się odświeżenie ścian i nowe panele, a inaczej
          remont generalny w kamienicy z wymianą instalacji. Oto aktualne kwoty na 2026 rok — z materiałami i robocizną.
        </p>

        <h2 id="zakresy">Ile kosztuje remont mieszkania za m²?</h2>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Zakres remontu</th><th>Za m²</th><th>Mieszkanie 55 m²</th></tr></thead>
            <tbody>
              <tr><td>Odświeżenie (malowanie, podłogi, osprzęt)</td><td>ok. 520 zł</td><td>ok. 29 tys. zł</td></tr>
              <tr><td>Wykończenie od dewelopera</td><td>ok. 1 880 zł</td><td>ok. 104 tys. zł</td></tr>
              <tr><td>Remont standardowy z łazienką i kuchnią</td><td>ok. 2 060 zł</td><td>ok. 114 tys. zł</td></tr>
              <tr><td>Remont generalny</td><td>ok. 3 270 zł</td><td>ok. 180 tys. zł</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Wyliczenia dotyczą mieszkania w bloku, w mieście średniej wielkości, z firmą remontową wykonującą prace kompleksowo, bez rezerwy.
          W Warszawie remont generalny to ok. 3 710 zł/m², a w kamienicy — ze względu na wysokie ściany i krzywe tynki — ok. 3 490 zł/m².
        </p>

        <h2 id="przyklady">Przykładowe budżety remontu</h2>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Mieszkanie</th><th>Odświeżenie</th><th>Standardowy</th><th>Generalny</th></tr></thead>
            <tbody>
              <tr><td>40 m², 2 pokoje</td><td>ok. 21 tys. zł</td><td>ok. 99 tys. zł</td><td>ok. 153 tys. zł</td></tr>
              <tr><td>55 m², 3 pokoje</td><td>ok. 29 tys. zł</td><td>ok. 114 tys. zł</td><td>ok. 180 tys. zł</td></tr>
              <tr><td>75 m², 4 pokoje</td><td>ok. 39 tys. zł</td><td>ok. 133 tys. zł</td><td>ok. 215 tys. zł</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          W małych mieszkaniach metr kwadratowy remontu jest najdroższy, bo kuchnia i łazienka kosztują podobnie niezależnie od metrażu.
        </p>

        <h2 id="stawki">Stawki za prace remontowe w 2026 roku</h2>
        <p>Średnie ceny brutto (materiał + robocizna) przy remoncie zleconym ekipie:</p>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Praca</th><th>Materiał</th><th>Robocizna</th></tr></thead>
            <tbody>
              <tr><td>Gładź gipsowa 2× ze szlifowaniem (m²)</td><td>ok. 13 zł</td><td>ok. 54 zł</td></tr>
              <tr><td>Gruntowanie i malowanie 2× (m²)</td><td>ok. 11 zł</td><td>ok. 34 zł</td></tr>
              <tr><td>Płytki z hydroizolacją (m²)</td><td>ok. 127 zł</td><td>ok. 185 zł</td></tr>
              <tr><td>Panele / deska warstwowa (m²)</td><td>ok. 133 zł</td><td>ok. 54 zł</td></tr>
              <tr><td>Wylewka samopoziomująca (m²)</td><td>ok. 36 zł</td><td>ok. 45 zł</td></tr>
              <tr><td>Sufit podwieszany GK (m²)</td><td>ok. 66 zł</td><td>ok. 103 zł</td></tr>
              <tr><td>Wymiana instalacji elektrycznej (m² mieszkania)</td><td>ok. 83 zł</td><td>ok. 134 zł</td></tr>
              <tr><td>Skuwanie płytek (m²)</td><td>–</td><td>ok. 95 zł</td></tr>
              <tr><td>Drzwi wewnętrzne z montażem (szt.)</td><td>ok. 1 220 zł</td><td>ok. 400 zł</td></tr>
            </tbody>
          </table>
        </div>
        <p>Pełną listę znajdziesz w <Link href="/cennik-budowlany/">cenniku budowlanym 2026</Link> — z przeliczeniem dla Twojego województwa.</p>

        <h2 id="lazienka-kuchnia">Ile kosztuje remont łazienki i kuchni?</h2>
        <p>
          <strong>Łazienka</strong> to najdroższe pomieszczenie w przeliczeniu na metr. Kompletny remont małej łazienki (rozbiórka, nowe
          instalacje, hydroizolacja, płytki, ceramika i armatura) kosztuje w 2026 roku zwykle 35–55 tys. zł.{' '}
          <strong>Kuchnia</strong> na wymiar z blatem, AGD i montażem to ok. 27–31 tys. zł w standardzie średnim, a w premium nawet dwa
          razy więcej.
        </p>

        <h2 id="czas">Ile trwa remont mieszkania?</h2>
        <ul>
          <li><strong>Odświeżenie</strong> — ok. 4–6 tygodni (z przygotowaniem i zakupami).</li>
          <li><strong>Wykończenie od dewelopera</strong> — ok. 7–8 tygodni.</li>
          <li><strong>Remont standardowy</strong> — ok. 2–2,5 miesiąca.</li>
          <li><strong>Remont generalny</strong> — ok. 3 miesięcy.</li>
        </ul>
        <p>
          Najczęstszą przyczyną opóźnień jest czas oczekiwania na okna (4–6 tygodni) i kuchnię na wymiar (ok. 6 tygodni). Zamów je od razu
          po podpisaniu umowy z wykonawcą.
        </p>

        <h2 id="budzet">Jak nie przekroczyć budżetu remontu</h2>
        <ol>
          <li>Zbierz co najmniej trzy szczegółowe wyceny i porównuj je pozycja po pozycji.</li>
          <li>W umowie zapisz harmonogram, sposób rozliczenia prac dodatkowych i kary za opóźnienia.</li>
          <li>Zostaw rezerwę 10% w nowym budownictwie i 15–20% w starych blokach i kamienicach.</li>
          <li>Notuj wydatki na bieżąco — w <Link href="/harmonogram-budowy/">planerze Brickly</Link> od razu zobaczysz odchylenie od planu.</li>
        </ol>
      </Article>
      <Faq items={FAQ} title={<h2>Najczęstsze pytania o koszt remontu</h2>} />
    </>
  );
}
