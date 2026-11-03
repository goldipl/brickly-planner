import type { MetadataRoute } from 'next';
import { ARTICLES, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'monthly') => ({
    url: SITE_URL + path, lastModified: now, changeFrequency, priority,
  });
  return [
    page('/', 1, 'weekly'),
    page('/kalkulator-budowy-domu/', 0.9, 'monthly'),
    page('/kalkulator-remontu-mieszkania/', 0.9, 'monthly'),
    page('/harmonogram-budowy/', 0.8),
    page('/cennik-budowlany/', 0.8, 'monthly'),
    page('/poradnik/', 0.7),
    ...ARTICLES.map((a) => page(a.href, 0.8)),
    page('/polityka-prywatnosci/', 0.2, 'yearly'),
  ];
}
