'use client';

import { useEffect, useRef, useState } from 'react';

/** Liczba, która „nabija się” od zera, gdy pojawi się na ekranie. Na serwerze renderuje wartość końcową (SEO). */
export function CountUp({ to, suffix = '', ms = 1200 }: { to: number; suffix?: string; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || to === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setValue(0);
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        setValue(Math.round(to * (1 - Math.pow(1 - t, 4))));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, ms]);

  return <span ref={ref}>{value}{suffix}</span>;
}
