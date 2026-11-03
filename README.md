# Brickly Planner

Aplikacja webowa do planowania i harmonogramowania budowy domu oraz remontu mieszkania.
Na podstawie kilku parametrów przygotowuje **kosztorys pozycja po pozycji**, **harmonogram prac (wykres Gantta)**
i **plan wydatków miesiąc po miesiącu**, korzystając z aktualnych cen materiałów i robocizny w Polsce (stan: listopad 2026).

## Funkcje

- **Kalkulator budowy domu**: zakres od SSO do „pod klucz”, bryła, technologia ścian, fundamenty, dach, ogrzewanie, rekuperacja, PV, przyłącza, formalności, 16 województw.
- **Kalkulator remontu mieszkania**: 4 gotowe zakresy i 18 rodzajów prac, blok, kamienica lub nowe budownictwo.
- **Harmonogram** w dniach roboczych, z zależnościami etapów, przerwami technologicznymi (beton, wylewki), przerwą zimową i czasem produkcji okien i kuchni.
- **Planer**: projekty w localStorage, edycja zadań, automatyczne przesuwanie zadań zależnych, budżet planowany kontra wydany, postęp, import i eksport JSON, eksport CSV (Excel), druk do PDF.
- **Cennik budowlany 2026**: ceny jednostkowe przeliczane dla regionu i standardu.
- **SEO**: statyczne HTML, meta i Open Graph, canonical, sitemap.xml, robots.txt, dane strukturalne (Organization, WebSite, WebApplication, Article, BreadcrumbList, FAQPage) oraz poradniki z treścią.

## Stos

Next.js 16 (App Router, statyczny eksport) · React 19 · TypeScript · SCSS (Sass modules: `@use`, mapy tokenów, mixiny)

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # statyczna strona w katalogu out/
npm run preview    # podgląd out/
npm test           # testy silnika wyceny (node --test)
npm run typecheck
```

## Struktura

```
app/                 strony (App Router), sitemap, robots, manifest, ikona
components/          interfejs: nagłówek, stopka, SEO/JSON-LD, Gantt
  calculator/        formularze kalkulatorów i panel wyników
  planner/           planer harmonogramu
lib/
  data.ts            baza cen (materiał + robocizna), regiony, standardy
  engine.ts          silnik: geometria budynku, etapy, wycena, harmonogram
  dates.ts           dni robocze, przerwa zimowa
  export.ts          CSV i konwersja wyceny na projekt planera
  site.ts            domena, nawigacja, meta SEO
styles/              SCSS: _tokens, _mixins, _base, _layout, _components,
                     _calculator, _gantt, _planner, _print
public/              logo, obraz OG, apple-touch-icon
```

## Aktualizacja cen

Ceny bazowe są w `lib/data.ts` (`PRICES`). Żeby szybko skorygować cały cennik do bieżącego rynku,
zmień `INDEX.mat` i `INDEX.lab`, a potem zaktualizuj `PRICE_DATE` i `PRICE_LABEL`.
Test `npm test` sprawdza, czy koszt m² mieści się w rynkowych widełkach.

## Favicon i ikony aplikacji

Źródła są w `design/icons/`:

- `favicon-16.svg` i `favicon-32.svg` to wersje uproszczone pod siatkę pikseli,
- `icon.svg` to zaokrąglony kwadrat (favicon SVG i ikona PWA),
- `app-icon.svg` to pełny kwadrat bez przezroczystości (iOS i Android maskable).

Po zmianie któregoś z nich uruchom `npm run icons`. Skrypt wygeneruje w `public/`: `favicon.ico` (16/32/48),
`icon.svg`, ikony iOS 120/152/167/180 px (+ `apple-touch-icon.png`) oraz ikony Android 192/512 px w wariantach `any` i `maskable`.

## Domena i wdrożenie

Domyślna domena w canonical, sitemap i Open Graph to `https://brickly-planner.pl`.
Zmień ją w `lib/site.ts` albo ustaw `NEXT_PUBLIC_SITE_URL` przy buildzie.
Katalog `out/` możesz wgrać na dowolny hosting statyczny (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
