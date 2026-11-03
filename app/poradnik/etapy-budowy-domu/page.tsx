import type { Metadata } from 'next';
import Link from 'next/link';
import { Article } from '@/components/Article';
import { Faq } from '@/components/Seo';
import { pageMetadata } from '@/lib/site';

const PATH = '/poradnik/etapy-budowy-domu/';
const TITLE = 'Etapy budowy domu krok po kroku: harmonogram, czas trwania i kolejność prac';
const DESCRIPTION =
  'Etapy budowy domu od formalności do odbioru: ile trwa każdy etap, jaka jest prawidłowa kolejność prac, przerwy technologiczne i jak zaplanować budowę z przerwą zimową.';

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' });

const STAGES: [string, string, string][] = [
  ['Projekt, formalności i pozwolenie', '3 miesiące', 'Wybór projektu i adaptacja, mapa do celów projektowych, badania gruntu, warunki przyłączy, pozwolenie na budowę (urząd ma 65 dni), dziennik budowy.'],
  ['Organizacja placu budowy', '1 tydzień', 'Prąd i woda budowlana, kontener, WC, ogrodzenie tymczasowe. Geodeta wytycza budynek.'],
  ['Roboty ziemne i fundamenty', '3–4 tygodnie + 7 dni', 'Wykopy, ławy i ściany fundamentowe, izolacje, podsypka i chudziak. Beton musi dojrzewać ok. tygodnia.'],
  ['Ściany konstrukcyjne', '5–6 tygodni', 'Ściany zewnętrzne i wewnętrzne nośne, kominy, nadproża. Prace zależne od pogody.'],
  ['Wieńce, stropy i schody', '3 tygodnie + 3 tygodnie', 'Strop żelbetowy lub gęstożebrowy wymaga pielęgnacji i ok. 3–4 tygodni dojrzewania przed obciążeniem więźbą.'],
  ['Dach', '4 tygodnie', 'Więźba, membrana, łaty i pokrycie, obróbki blacharskie i rynny. Koniec stanu surowego otwartego.'],
  ['Okna i drzwi zewnętrzne', '1–2 tygodnie', 'Montaż stolarki w ciepłym montażu. Koniec stanu surowego zamkniętego.'],
  ['Instalacje', '5 tygodni', 'Elektryka, wod-kan, ogrzewanie podłogowe, źródło ciepła, rekuperacja. Równolegle: przyłącza i elewacja.'],
  ['Tynki i zabudowy GK', '3–4 tygodnie', 'Tynki gipsowe, ocieplenie poddasza i sufity podwieszane.'],
  ['Wylewki', '1–2 tygodnie + 4 tygodnie', 'Jastrych na izolacji. Przed podłogami wylewka musi wyschnąć — ok. 4 tygodni.'],
  ['Wykończenie wnętrz', '2–3 miesiące', 'Gładzie, malowanie, płytki, podłogi, schody, a na końcu łazienki, kuchnia, drzwi i osprzęt.'],
  ['Odbiory i zakończenie budowy', '2 tygodnie', 'Inwentaryzacja geodezyjna, protokoły, świadectwo energetyczne, zawiadomienie o zakończeniu budowy.'],
];

const FAQ = [
  { q: 'Ile trwa budowa domu od pozwolenia do zamieszkania?', a: 'Z generalnym wykonawcą budowa domu 120 m² do stanu deweloperskiego trwa ok. 9 miesięcy, a pod klucz ok. 11–12 miesięcy. Doliczając formalności i ewentualną przerwę zimową, od rozpoczęcia projektu do przeprowadzki mija zwykle 14–16 miesięcy.' },
  { q: 'Czy można budować dom zimą?', a: 'Prace mokre na zewnątrz (betonowanie, murowanie, elewacja) przy temperaturach poniżej +5°C wymagają dodatków i ochrony, dlatego zwykle robi się przerwę od połowy grudnia do końca lutego. Zimą dobrze prowadzić prace wewnątrz zamkniętego budynku: instalacje, tynki z ogrzewaniem tymczasowym.' },
  { q: 'Kiedy najlepiej rozpocząć budowę domu?', a: 'Wczesną wiosną (marzec–kwiecień). Stan surowy zamknięty powstaje wtedy przed jesienią, a instalacje i tynki można wykonać zimą wewnątrz budynku.' },
];

export default function Page() {
  return (
    <>
      <Article
        path={PATH}
        title={TITLE}
        description={DESCRIPTION}
        crumb="Etapy budowy domu"
        readMinutes={6}
        toc={[
          ['etapy', '12 etapów budowy domu'],
          ['przykladowy-harmonogram', 'Przykładowy harmonogram'],
          ['przerwy', 'Przerwy technologiczne'],
          ['zima', 'Budowa a zima'],
          ['planowanie', 'Jak zaplanować budowę'],
        ]}
        cta={{ title: 'Twój harmonogram', text: 'Wygeneruj wykres Gantta dla swojego domu z datami każdego etapu.', href: '/kalkulator-budowy-domu/', label: 'Ułóż harmonogram' }}
      >
        <p>
          Budowa domu to kilkanaście etapów, które muszą następować w ściśle określonej kolejności. Część z nich może przebiegać
          równolegle, inne wymagają przerw technologicznych. Dobrze ułożony harmonogram budowy domu oszczędza miesiące i pieniądze —
          ekipy nie czekają, a materiały przyjeżdżają na czas.
        </p>

        <h2 id="etapy">12 etapów budowy domu</h2>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Etap</th><th>Czas trwania</th></tr></thead>
            <tbody>
              {STAGES.map(([name, time]) => <tr key={name}><td>{name}</td><td>{time}</td></tr>)}
            </tbody>
          </table>
        </div>
        {STAGES.map(([name, , text], i) => (
          <div key={name}>
            <h3>{i + 1}. {name}</h3>
            <p>{text}</p>
          </div>
        ))}

        <h2 id="przykladowy-harmonogram">Przykładowy harmonogram budowy domu 120 m²</h2>
        <p>
          Dom z poddaszem użytkowym, generalny wykonawca, start formalności 1 marca. Kalkulator Brickly ułożył harmonogram tak:
        </p>
        <ul>
          <li><strong>marzec – maj:</strong> projekt, formalności i pozwolenie na budowę,</li>
          <li><strong>czerwiec:</strong> plac budowy i fundamenty,</li>
          <li><strong>lipiec – sierpień:</strong> ściany, wieńce i strop,</li>
          <li><strong>wrzesień – październik:</strong> dach i okna (stan surowy zamknięty),</li>
          <li><strong>listopad – grudzień:</strong> instalacje, elewacja, przyłącza, tynki,</li>
          <li><strong>styczeń:</strong> wylewki i ich schnięcie,</li>
          <li><strong>luty – kwiecień:</strong> wykończenie wnętrz, łazienki i kuchnia,</li>
          <li><strong>maj następnego roku:</strong> odbiory i przeprowadzka.</li>
        </ul>
        <p>Łącznie ok. 14 miesięcy od pierwszej wizyty u architekta do odbioru domu pod klucz.</p>

        <h2 id="przerwy">Przerwy technologiczne, których nie da się skrócić</h2>
        <ul>
          <li><strong>Fundamenty</strong> — ok. 7 dni dojrzewania betonu przed murowaniem.</li>
          <li><strong>Strop żelbetowy</strong> — ok. 3–4 tygodni przed obciążeniem i rozszalowaniem.</li>
          <li><strong>Wylewki</strong> — ok. 4 tygodni schnięcia przed podłogami (zmierz wilgotność metodą CM).</li>
          <li><strong>Tynki</strong> — wilgoć technologiczna musi odparować przed gładziami i malowaniem.</li>
        </ul>

        <h2 id="zima">Budowa domu a zima</h2>
        <p>
          Prace mokre na zewnątrz wykonuje się w temperaturze powyżej +5°C. Najbezpieczniej zaplanować przerwę zimową od 15 grudnia do końca
          lutego dla fundamentów, murów, stropów, dachu i elewacji. Jeśli budynek jest zamknięty przed zimą, wewnątrz można prowadzić
          instalacje i tynki. Kalkulator Brickly automatycznie przesuwa prace zewnętrzne, które nie zmieszczą się przed zimą, na marzec.
        </p>

        <h2 id="planowanie">Jak zaplanować budowę domu</h2>
        <ol>
          <li>Wnioski o warunki przyłączy złóż jeszcze na etapie projektu.</li>
          <li>Okna, więźbę i kuchnię zamawiaj z 6–8 tygodniowym wyprzedzeniem.</li>
          <li>Prace niezależne prowadź równolegle: elewację i przyłącza razem z instalacjami.</li>
          <li>Aktualizuj harmonogram co tydzień — w <Link href="/harmonogram-budowy/">planerze Brickly</Link> opóźnienie jednego etapu automatycznie przesuwa kolejne.</li>
        </ol>
      </Article>
      <Faq items={FAQ} title={<h2>Pytania o harmonogram budowy</h2>} />
    </>
  );
}
