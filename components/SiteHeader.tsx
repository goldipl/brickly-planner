'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV } from '@/lib/site';
import { Icon } from './Icon';
import { LogoMark, LogoWord } from './Logo';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('brickly-theme', next);
    } catch {
      /* tryb prywatny */
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">Przejdź do treści</a>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="logo" href="/" aria-label="Brickly Planner – strona główna">
            <LogoMark />
            <LogoWord />
          </Link>
          <nav className={'nav' + (open ? ' open' : '')} id="site-nav" aria-label="Główna nawigacja">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname?.startsWith(item.href.replace(/\/$/, '')) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="icon-btn theme-toggle" type="button" aria-label="Przełącz jasny / ciemny motyw" onClick={toggleTheme}>
              <Icon name="sunny" className="sun" />
              <Icon name="moon" className="moon" />
            </button>
            <button
              className="icon-btn nav-toggle"
              type="button"
              aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={open}
              aria-controls="site-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name="menu" />
            </button>
            <Link className="btn btn-primary btn-sm header-cta" href="/kalkulator-budowy-domu/">
              Oblicz koszt
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
