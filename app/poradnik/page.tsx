import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Breadcrumbs, JsonLd } from '@/components/Seo';
import { ARTICLES, absolute, pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Poradnik budowy i remontu – koszty, etapy, harmonogram',
  description:
    'Praktyczne poradniki: ile kosztuje budowa domu i remont mieszkania w 2026 roku, jakie są etapy budowy domu i jak ułożyć harmonogram prac.',
  path: '/poradnik/',
});

export default function GuidePage() {
  return (
    <>
      <JsonLd
        data={{
          '@type': 'ItemList',
          itemListElement: ARTICLES.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: absolute(a.href), name: a.title })),
        }}
      />
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: 'Poradnik' }]} />
          <h1>Poradnik budowy i remontu</h1>
          <p className="lead">
            Konkretne liczby i sprawdzona kolejność prac. Każdy artykuł opiera się na tych samych danych cenowych co nasze kalkulatory.
          </p>
        </div>
      </section>
      <section className="section-sm">
        <div className="wrap grid grid-3">
          {ARTICLES.map((a) => (
            <Link className="card card-link" href={a.href} key={a.href}>
              <span className="eyebrow">{a.tag}</span>
              <h2 style={{ fontSize: '1.35rem' }}>{a.title}</h2>
              <p className="muted">{a.excerpt}</p>
              <span className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>Czytaj poradnik</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section-sm">
        <div className="wrap grid grid-2">
          <Link className="card card-link" href="/kalkulator-budowy-domu/">
            <div className="card-icon"><Icon name="house" /></div>
            <h3>Policz koszt swojego domu</h3>
            <p className="muted">Kosztorys, harmonogram i plan wydatków w minutę.</p>
          </Link>
          <Link className="card card-link" href="/kalkulator-remontu-mieszkania/">
            <div className="card-icon amber"><Icon name="wrench" /></div>
            <h3>Policz koszt remontu</h3>
            <p className="muted">Od odświeżenia po remont generalny — z kolejnością prac.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
