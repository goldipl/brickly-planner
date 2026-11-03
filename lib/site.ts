import type { Metadata } from 'next';

/** Docelowa domena — zmień tutaj lub ustaw zmienną NEXT_PUBLIC_SITE_URL przy buildzie. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://brickly-planner.pl').replace(/\/$/, '');
export const SITE_NAME = 'Brickly Planner';
export const PUBLISHED = '2026-11-03';

export const NAV = [
  { href: '/kalkulator-budowy-domu/', label: 'Budowa domu' },
  { href: '/kalkulator-remontu-mieszkania/', label: 'Remont mieszkania' },
  { href: '/harmonogram-budowy/', label: 'Planer' },
  { href: '/cennik-budowlany/', label: 'Cennik 2026' },
  { href: '/poradnik/', label: 'Poradnik' },
];

export const ARTICLES = [
  {
    href: '/poradnik/ile-kosztuje-budowa-domu/',
    title: 'Ile kosztuje budowa domu w 2026 roku?',
    excerpt: 'Ceny za m² w stanie surowym, deweloperskim i pod klucz, przykłady dla domów 100, 120 i 150 m² oraz różnice między województwami.',
    tag: 'Koszty',
  },
  {
    href: '/poradnik/ile-kosztuje-remont-mieszkania/',
    title: 'Ile kosztuje remont mieszkania w 2026 roku?',
    excerpt: 'Stawki robocizny, koszt remontu łazienki i kuchni, budżety dla mieszkań 40, 55 i 75 m² — od odświeżenia po remont generalny.',
    tag: 'Remont',
  },
  {
    href: '/poradnik/etapy-budowy-domu/',
    title: 'Etapy budowy domu krok po kroku',
    excerpt: 'Kolejność prac, czas trwania każdego etapu, przerwy technologiczne i przykładowy harmonogram budowy domu z przerwą zimową.',
    tag: 'Harmonogram',
  },
];

export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Brickly Planner – kosztorys i harmonogram budowy domu oraz remontu mieszkania',
};

type PageMeta ={ title: string; description: string; path: string; type?: 'website' | 'article'; ogTitle?: string };

/** Spójne meta SEO dla podstrony: canonical, Open Graph, Twitter. */
export function pageMetadata({ title, description, path, type = 'website', ogTitle }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: ogTitle ?? title,
      description,
      siteName: SITE_NAME,
      locale: 'pl_PL',
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: ogTitle ?? title, description, images: [OG_IMAGE.url] },
  };
}

export const absolute = (path: string) => SITE_URL + path;
