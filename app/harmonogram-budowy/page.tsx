import type { Metadata } from 'next';
import Link from 'next/link';
import { Planner } from '@/components/planner/Planner';
import { Breadcrumbs, Faq, WebAppSchema } from '@/components/Seo';
import { pageMetadata } from '@/lib/site';

const PATH = '/harmonogram-budowy/';
const DESCRIPTION =
  'Darmowy planer harmonogramu budowy domu i remontu. Wykres Gantta, zależności między etapami, budżet planowany i wydany, postęp prac. Eksport do CSV i PDF, bez zakładania konta.';

export const metadata: Metadata = pageMetadata({
  title: 'Planer harmonogramu budowy i remontu – wykres Gantta online',
  description: DESCRIPTION,
  path: PATH,
});

const FAQ = [
  { q: 'Jak zrobić harmonogram budowy domu?', a: 'Najprościej wygenerować go w kalkulatorze budowy domu i kliknąć „Otwórz w planerze”. Otrzymasz wszystkie etapy we właściwej kolejności z czasem trwania, przerwami technologicznymi i budżetem, które możesz dowolnie edytować.' },
  { q: 'Co się stanie, gdy etap się opóźni?', a: 'Po zmianie daty startu lub czasu trwania zadania planer automatycznie przesuwa zadania zależne, z zachowaniem przerw technologicznych (np. schnięcia wylewek). Funkcję można wyłączyć przełącznikiem.' },
  { q: 'Czy mogę udostępnić harmonogram wykonawcy?', a: 'Tak — wyeksportuj go do CSV (Excel, Arkusze Google) lub wydrukuj do PDF. Plik JSON pozwala przenieść cały projekt na inny komputer i wczytać go z powrotem w planerze.' },
];

export default function PlannerPage() {
  return (
    <>
      <WebAppSchema name="Planer harmonogramu budowy" description={DESCRIPTION} path={PATH} />
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: 'Planer harmonogramu' }]} />
          <h1>Planer harmonogramu budowy i remontu</h1>
          <p className="lead">
            Prowadź inwestycję na wykresie Gantta: aktualizuj postęp, wpisuj faktyczne wydatki i od razu sprawdzaj, czy mieścisz się
            w budżecie i terminie. Gotowy plan wygenerujesz w{' '}
            <Link href="/kalkulator-budowy-domu/">kalkulatorze budowy</Link> lub <Link href="/kalkulator-remontu-mieszkania/">remontu</Link>.
          </p>
        </div>
      </section>

      <div className="wrap">
        <Planner />
      </div>

      <Faq items={FAQ} title={<h2>Jak korzystać z planera</h2>} />
    </>
  );
}
