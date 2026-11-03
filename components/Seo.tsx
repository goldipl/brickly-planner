import Link from 'next/link';
import type { ReactNode } from 'react';
import { absolute } from '@/lib/site';

/** Dane strukturalne schema.org. Znaki „<” są escapowane, by treść nie zamknęła tagu script. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c') }}
    />
  );
}

export type Crumb = { name: string; href?: string };

/** Okruszki widoczne na stronie + BreadcrumbList dla Google. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: 'Strona główna', href: '/' }, ...items];
  return (
    <>
      <nav className="breadcrumbs" aria-label="Okruszki">
        <ol>
          {all.map((c, i) =>
            c.href && i < all.length - 1 ? (
              <li key={i}><Link href={c.href}>{c.name}</Link></li>
            ) : (
              <li key={i} aria-current="page">{c.name}</li>
            ),
          )}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            ...(c.href ? { item: absolute(c.href) } : {}),
          })),
        }}
      />
    </>
  );
}

export type FaqItem = { q: string; a: string };

/** Sekcja FAQ + FAQPage — treść pytań i danych strukturalnych pochodzi z jednego źródła. */
export function Faq({ items, title, id }: { items: FaqItem[]; title?: ReactNode; id?: string }) {
  return (
    <section className="section" id={id}>
      <div className="wrap">
        {title && <div className="section-head">{title}</div>}
        <div className="faq">
          {items.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
    </section>
  );
}

export function WebAppSchema({ name, description, path }: { name: string; description: string; path: string }) {
  return (
    <JsonLd
      data={{
        '@type': 'WebApplication',
        name,
        description,
        url: absolute(path),
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: 'pl-PL',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
      }}
    />
  );
}
