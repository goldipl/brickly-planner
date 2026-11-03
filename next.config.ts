import type { NextConfig } from 'next';

// Statyczny eksport: gotowa strona trafia do katalogu out/ i działa na dowolnym hostingu
// (Vercel, Netlify, GitHub Pages, zwykły serwer). Domenę ustawiasz w lib/site.ts.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
