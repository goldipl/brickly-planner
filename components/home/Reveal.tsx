'use client';

import { useEffect } from 'react';

/**
 * Odsłania elementy z atrybutem [data-reveal], gdy wjadą w widok (klasa .in).
 * Bez JS i przy prefers-reduced-motion treść jest widoczna od razu — ukrywanie działa tylko pod html.js.
 */
export function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
