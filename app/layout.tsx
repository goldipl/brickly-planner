import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { JsonLd } from '@/components/Seo';
import { ToastHost } from '@/components/ToastHost';
import { OG_IMAGE, SITE_NAME, SITE_URL, asset } from '@/lib/site';
import '@/styles/globals.scss';

const head = Bricolage_Grotesque({ subsets: ['latin', 'latin-ext'], variable: '--ff-head', display: 'swap' });
const body = Inter({ subsets: ['latin', 'latin-ext'], variable: '--ff-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--ff-mono', display: 'swap', weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + '/'),
  title: {
    default: 'Brickly Planner – kosztorys i harmonogram budowy domu oraz remontu mieszkania',
    template: '%s | Brickly Planner',
  },
  description:
    'Darmowy kalkulator kosztów budowy domu i remontu mieszkania z harmonogramem prac. Aktualne ceny materiałów i robocizny w Polsce, 16 województw, eksport do Excela i PDF.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    'kalkulator budowy domu', 'koszt budowy domu 2026', 'kosztorys budowy domu', 'harmonogram budowy domu',
    'kalkulator remontu mieszkania', 'koszt remontu mieszkania', 'ceny materiałów budowlanych', 'cennik robocizny',
  ],
  formatDetection: { telephone: false },
  openGraph: { siteName: SITE_NAME, locale: 'pl_PL', type: 'website', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', images: [OG_IMAGE.url] },
  icons: {
    icon: [
      { url: asset('/favicon.ico'), sizes: '16x16 32x32 48x48' },
      { url: asset('/icon.svg'), type: 'image/svg+xml' },
      { url: asset('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
    ],
    apple: [120, 152, 167, 180].map((s) => ({ url: asset(`/icons/apple-touch-icon-${s}.png`), sizes: `${s}x${s}`, type: 'image/png' })),
  },
  // dodanie do ekranu początkowego iOS: krótka nazwa pod ikoną i pasek statusu nad ciemnym tłem
  appleWebApp: { capable: true, title: 'Brickly', statusBarStyle: 'black-translucent' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F2' },
    { media: '(prefers-color-scheme: dark)', color: '#11141B' },
  ],
};

// ustawia motyw przed pierwszym malowaniem (bez mignięcia jasnego tła) i oznacza, że JS działa —
// animacje odsłaniania ukrywają treść tylko pod html.js
const themeScript = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('brickly-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className={`${head.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <JsonLd
          data={{
            '@type': 'Organization',
            '@id': SITE_URL + '/#org',
            name: SITE_NAME,
            url: SITE_URL + '/',
            logo: SITE_URL + '/logo.svg',
          }}
        />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ToastHost />
      </body>
    </html>
  );
}
