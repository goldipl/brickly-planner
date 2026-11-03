'use client';

import { useEffect, useRef, useState } from 'react';

export type Annotation = {
  /** punkt na zdjęciu w pikselach oryginału */
  x: number;
  y: number;
  /** przesunięcie etykiety względem punktu (px ekranu) */
  dx: number;
  dy: number;
  label: string;
  value: string;
  note?: string;
};

type Placed = Annotation & { px: number; py: number; lx: number; ly: number };

// bezpieczne marginesy: etykieta nie wchodzi pod podpis zdjęcia ani za prawą krawędź
const SAFE = { top: 96, bottom: 120, right: 24, labelWidth: 270, gap: 108 };

/** Rozsuwa etykiety w pionie, gdy po dosunięciu do krawędzi zaczynają na siebie nachodzić. */
function separate(list: Placed[], maxY: number): Placed[] {
  const sorted = [...list].sort((a, b) => a.ly - b.ly);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const overlapX = Math.abs(cur.lx - prev.lx) < SAFE.labelWidth;
    if (overlapX && cur.ly - prev.ly < SAFE.gap) cur.ly = prev.ly + SAFE.gap;
  }
  // jeśli ostatnia wyjechała za dół, przesuń całą kolumnę w górę
  const overflow = sorted.length ? sorted[sorted.length - 1].ly - maxY : 0;
  if (overflow > 0) sorted.forEach((p) => { p.ly = Math.max(SAFE.top, p.ly - overflow); });
  return list;
}

/**
 * Adnotacje „jak na rysunku technicznym” przypięte do miejsc na zdjęciu tła.
 * Odtwarza geometrię object-fit: cover + object-position, więc punkty trzymają się
 * więźby czy muru przy każdej szerokości ekranu.
 */
export function HeroAnnotations({ width, height, items }: { width: number; height: number; items: Annotation[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);

  useEffect(() => {
    const box = ref.current;
    const img = box?.parentElement?.querySelector('img');
    if (!box || !img) return;

    const layout = () => {
      const W = box.clientWidth;
      const H = box.clientHeight;
      const scale = Math.max(W / width, H / height);
      const [ox, oy] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
      const offX = (W - width * scale) * (Number.isFinite(ox) ? ox : 0.5);
      const offY = (H - height * scale) * (Number.isFinite(oy) ? oy : 0.5);
      setPlaced(separate(
        items.map((a) => {
          const px = a.x * scale + offX;
          const py = a.y * scale + offY;
          return {
            ...a, px, py,
            lx: Math.min(px + a.dx, W - SAFE.right - SAFE.labelWidth),
            ly: Math.min(Math.max(py + a.dy, SAFE.top), H - SAFE.bottom),
          };
        }),
        H - SAFE.bottom,
      ));
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(box);
    return () => ro.disconnect();
  }, [width, height, items]);

  return (
    <div className="annotations" ref={ref} aria-hidden="true">
      <svg className="annotations-lines">
        {placed.map((a, i) => (
          <g key={a.label} style={{ ['--i' as string]: i }}>
            <circle className="pulse" cx={a.px} cy={a.py} r="16" />
            <circle className="dot" cx={a.px} cy={a.py} r="5" />
            <polyline
              className="leader"
              points={`${a.px},${a.py} ${a.px + (a.lx - a.px) * 0.55},${a.ly} ${a.lx},${a.ly}`}
              pathLength={1}
            />
            <line className="leader-tick" x1={a.lx} y1={a.ly - 6} x2={a.lx} y2={a.ly + 6} />
          </g>
        ))}
      </svg>
      {placed.map((a, i) => (
        <div key={a.label} className="annotation" style={{ left: a.lx + 10, top: a.ly, ['--i' as string]: i }}>
          <span className="annotation-index">{String(i + 1).padStart(2, '0')}</span>
          <span className="annotation-body">
            <span className="annotation-label">{a.label}</span>
            <strong className="annotation-value">{a.value}</strong>
            {a.note && <span className="annotation-note">{a.note}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
