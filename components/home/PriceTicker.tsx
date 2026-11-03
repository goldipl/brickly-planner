import { PRICES, PRICE_LABEL } from '@/lib/data';
import type { PriceId } from '@/lib/data';
import { unitPrice } from '@/lib/engine';
import * as fmt from '@/lib/format';

const ITEMS: [PriceId, string][] = [
  ['sciana_cer', 'Mur z pustaka 25 cm'],
  ['plyta', 'Płyta fundamentowa'],
  ['wiezba', 'Więźba dachowa'],
  ['pokrycie_cer', 'Dachówka ceramiczna'],
  ['okna', 'Okna 3-szybowe'],
  ['elewacja', 'Elewacja 20 cm'],
  ['tynki', 'Tynk gipsowy'],
  ['wylewki', 'Wylewka z izolacją'],
  ['r_gladz', 'Gładź gipsowa'],
  ['r_malowanie', 'Malowanie 2×'],
  ['plytki', 'Płytki z ułożeniem'],
  ['podlogi', 'Panele z montażem'],
  ['r_elektryka', 'Nowa elektryka'],
  ['rekuperacja', 'Rekuperacja'],
];

/** Taśma z cenami jednostkowymi przewijana jak notowania. Pozycje są w HTML, więc widzi je też wyszukiwarka. */
export function PriceTicker() {
  const p = { region: 'zachodniopomorskie', location: 'city', standard: 'std' as const };
  const row = ITEMS.map(([id, label]) => {
    const u = unitPrice(id, p);
    return { id, label, price: `${fmt.pln(u.mat + u.lab)}/${PRICES[id].u}` };
  });

  return (
    <section className="ticker" aria-label={`Przykładowe ceny budowlane, ${PRICE_LABEL}`}>
      <div className="ticker-badge">
        <span className="live-dot" aria-hidden="true" />
        Ceny · {PRICE_LABEL}
      </div>
      <div className="ticker-viewport">
        <ul className="ticker-track">
          {[0, 1].map((copy) =>
            row.map((r) => (
              <li key={`${copy}-${r.id}`} aria-hidden={copy === 1 || undefined}>
                <span>{r.label}</span>
                <b>{r.price}</b>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
