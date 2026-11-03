import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nie znaleziono strony',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 640 }}>
        <span className="eyebrow">Błąd 404</span>
        <h1>Tej cegły tu brakuje</h1>
        <p className="lead" style={{ margin: '0 auto 28px' }}>
          Strona, której szukasz, nie istnieje lub została przeniesiona. Wróć do jednego z naszych narzędzi.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" href="/kalkulator-budowy-domu/">Kalkulator budowy domu</Link>
          <Link className="btn btn-ghost" href="/kalkulator-remontu-mieszkania/">Kalkulator remontu</Link>
          <Link className="btn btn-ghost" href="/">Strona główna</Link>
        </div>
      </div>
    </section>
  );
}
