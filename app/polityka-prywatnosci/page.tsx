import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Seo';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Polityka prywatności',
  description: 'Jak Brickly Planner przetwarza dane: projekty i wyceny zapisywane są wyłącznie lokalnie w Twojej przeglądarce.',
  path: '/polityka-prywatnosci/',
});

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: 'Polityka prywatności' }]} />
          <h1>Polityka prywatności</h1>
        </div>
      </section>
      <div className="wrap prose" style={{ paddingBottom: 40 }}>
        <h2>Jakie dane przetwarzamy</h2>
        <p>
          Brickly Planner nie wymaga zakładania konta i nie zbiera danych osobowych. Parametry wycen, projekty w planerze oraz wybrany
          motyw kolorystyczny zapisywane są <strong>wyłącznie w pamięci Twojej przeglądarki</strong> (localStorage) na Twoim urządzeniu.
          Nie są przesyłane na nasz serwer.
        </p>
        <h2>Usuwanie danych</h2>
        <p>
          Możesz w każdej chwili usunąć projekt w planerze albo wyczyścić dane witryny w ustawieniach przeglądarki. Aby przenieść projekt
          na inne urządzenie, skorzystaj z eksportu do pliku JSON.
        </p>
        <h2>Linki do wycen</h2>
        <p>
          Funkcja „Link” zapisuje parametry wyceny w adresie strony (po znaku #). Fragment ten nie jest wysyłany do serwera — trafia
          tylko do osób, którym sam przekażesz link.
        </p>
        <h2>Czcionki i hosting</h2>
        <p>
          Czcionki są serwowane z naszej domeny. Dostawca hostingu może prowadzić standardowe logi serwera (adres IP, data żądania)
          w celach bezpieczeństwa.
        </p>
        <h2>Charakter wycen</h2>
        <p>
          Wyceny i harmonogramy mają charakter orientacyjny i nie stanowią oferty handlowej w rozumieniu Kodeksu cywilnego ani
          kosztorysu inwestorskiego.
        </p>
      </div>
    </>
  );
}
