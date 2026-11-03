import Link from 'next/link';
import type { ReactNode } from 'react';
import { PRICE_LABEL } from '@/lib/data';
import { PUBLISHED, SITE_NAME, SITE_URL, absolute } from '@/lib/site';
import { Breadcrumbs, JsonLd } from './Seo';

type Props = {
  path: string;
  title: string;
  description: string;
  crumb: string;
  readMinutes: number;
  toc: [id: string, label: string][];
  cta: { title: string; text: string; href: string; label: string };
  children: ReactNode;
};

/** Szablon artykułu poradnika: okruszki, schema Article, spis treści i CTA do kalkulatora. */
export function Article({ path, title, description, crumb, readMinutes, toc, cta, children }: Props) {
  const org = { '@type': 'Organization', name: SITE_NAME, url: SITE_URL + '/' };
  return (
    <>
      <JsonLd
        data={{
          '@type': 'Article',
          headline: title,
          description,
          inLanguage: 'pl-PL',
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          image: absolute('/og-image.png'),
          author: org,
          publisher: { ...org, logo: { '@type': 'ImageObject', url: absolute('/logo.svg') } },
          mainEntityOfPage: absolute(path),
        }}
      />
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: 'Poradnik', href: '/poradnik/' }, { name: crumb }]} />
          <h1 style={{ maxWidth: '22ch' }}>{title}</h1>
          <p className="lead">{description}</p>
          <div className="meta-line">
            <span>Aktualizacja: {PRICE_LABEL}</span>
            <span>Czas czytania: ok. {readMinutes} min</span>
            <span>Redakcja Brickly Planner</span>
          </div>
        </div>
      </section>
      <div className="wrap article-layout" style={{ paddingBottom: 40 }}>
        <article className="prose">{children}</article>
        <aside className="aside-sticky">
          <nav className="card toc" aria-label="Spis treści">
            <h3>Spis treści</h3>
            <ol>
              {toc.map(([id, label]) => (
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ol>
          </nav>
          <div className="card">
            <h3>{cta.title}</h3>
            <p className="muted">{cta.text}</p>
            <Link className="btn btn-primary btn-sm" href={cta.href}>{cta.label}</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
