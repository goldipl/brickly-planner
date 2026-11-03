#!/usr/bin/env node
/*
 * Generuje favicon i ikony aplikacji (iOS, Android/PWA) z plików SVG w design/icons/.
 * Użycie: npm run icons
 */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => path.join(root, 'design', 'icons', f);
const pub = (f) => path.join(root, 'public', f);

/**
 * Rasteryzuje SVG do PNG w zadanym rozmiarze. Małe favicony renderujemy 1:1 (ostre na siatce pikseli),
 * większe ikony z 2× nadpróbkowaniem dla gładkich krawędzi.
 */
async function png(svgFile, size, { flatten } = {}) {
  const svg = await readFile(src(svgFile));
  const { width } = await sharp(svg).metadata();
  const density = (72 * size * (size <= 48 ? 1 : 2)) / width;
  let img = sharp(svg, { density }).resize(size, size);
  if (flatten) img = img.flatten({ background: '#1D2433' });
  return img.png({ compressionLevel: 9 }).toBuffer();
}

/** Składa plik .ico z obrazów PNG (format obsługiwany przez wszystkie przeglądarki od Windows Vista). */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

await mkdir(pub('icons'), { recursive: true });

// favicon.ico: osobny rysunek dla 16 px, wersja 32 px skalowana też do 48 px
await writeFile(
  pub('favicon.ico'),
  ico([
    { size: 16, data: await png('favicon-16.svg', 16) },
    { size: 32, data: await png('favicon-32.svg', 32) },
    { size: 48, data: await png('favicon-32.svg', 48) },
  ]),
);
await copyFile(src('icon.svg'), pub('icon.svg'));

// Android / PWA: ikona „any” (zaokrąglony kwadrat na przezroczystym tle) i „maskable” (pełne tło)
for (const size of [192, 512]) {
  await writeFile(pub(`icons/icon-${size}.png`), await png('icon.svg', size));
  await writeFile(pub(`icons/maskable-${size}.png`), await png('app-icon.svg', size, { flatten: true }));
}

// iOS: ekran początkowy iPhone (180), iPad Pro (167), iPad (152), starsze iPhone'y (120).
// Pliki bez przezroczystości — iOS zamieniłby ją na czarne tło.
for (const size of [120, 152, 167, 180]) {
  await writeFile(pub(`icons/apple-touch-icon-${size}.png`), await png('app-icon.svg', size, { flatten: true }));
}
// /apple-touch-icon.png w katalogu głównym — iOS i niektóre czytniki pobierają go bez linku w HTML
await copyFile(pub('icons/apple-touch-icon-180.png'), pub('apple-touch-icon.png'));

console.log('Wygenerowano favicon.ico, icon.svg oraz ikony iOS i Android w public/');
