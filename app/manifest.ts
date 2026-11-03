import type { MetadataRoute } from 'next';
import { asset } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Brickly Planner – kosztorys i harmonogram budowy',
    short_name: 'Brickly',
    description: 'Kosztorys i harmonogram budowy domu oraz remontu mieszkania z aktualnymi cenami w Polsce.',
    start_url: asset('/'),
    scope: asset('/'),
    display: 'standalone',
    background_color: '#FAF7F2',
    theme_color: '#C8553D',
    lang: 'pl',
    icons: [
      { src: asset('/icon.svg'), sizes: 'any', type: 'image/svg+xml' },
      { src: asset('/icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: asset('/icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: asset('/icons/maskable-192.png'), sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: asset('/icons/maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
