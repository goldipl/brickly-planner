import type { NextConfig } from 'next';

// Statyczny eksport: gotowa strona trafia do katalogu out/ i działa na dowolnym hostingu.
// Na GitHub Pages workflow ustawia NEXT_PUBLIC_BASE_PATH=/brickly-planner (strona w podkatalogu);
// lokalnie i na własnej domenie zostaje pusty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
