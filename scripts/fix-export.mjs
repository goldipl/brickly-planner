#!/usr/bin/env node
/*
 * Poprawka statycznego eksportu Next.js 16: pliki prefetchu segmentów zapisywane są jako
 *   trasa/__next.trasa/__PAGE__.txt
 * a router w przeglądarce pyta o
 *   trasa/__next.trasa.__PAGE__.txt
 * Bez kopii pod płaską nazwą prefetch kończy się 404 (nawigacja działa, ale wolniej).
 * Uruchamiane automatycznie jako `postbuild`.
 */
import { copyFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const full = path.join(dir, name);
    if ((await stat(full)).isDirectory()) {
      if (name !== '_next') yield* walk(full);
    } else {
      yield full;
    }
  }
}

let copied = 0;
for await (const file of walk(out)) {
  const rel = path.relative(out, file).split(path.sep).join('/');
  const at = rel.indexOf('__next.');
  // tylko pliki leżące w podkatalogu __next.* (płaskie __next._tree.txt itp. są w porządku)
  if (at === -1 || !rel.slice(at).includes('/')) continue;
  const routeDir = rel.slice(0, at);
  const flat = rel.slice(at).split('/').join('.');
  await copyFile(file, path.join(out, routeDir, flat));
  copied++;
}

console.log(`fix-export: utworzono ${copied} plików prefetchu`);
