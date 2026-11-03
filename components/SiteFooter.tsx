import Link from 'next/link';
import { PRICE_LABEL } from '@/lib/data';
import { ARTICLES } from '@/lib/site';
import { LogoMark, LogoWord } from './Logo';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="logo" href="/" aria-label="Brickly Planner">
              <LogoMark />
              <LogoWord />
            </Link>
            <p className="muted" style={{ marginTop: 14, maxWidth: '34ch' }}>
              Darmowy kosztorys i harmonogram budowy domu oraz remontu mieszkania. Ceny rynkowe: {PRICE_LABEL}.
            </p>
          </div>
          <div>
            <h4>Narzędzia</h4>
            <ul>
              <li><Link href="/kalkulator-budowy-domu/">Kalkulator budowy domu</Link></li>
              <li><Link href="/kalkulator-remontu-mieszkania/">Kalkulator remontu mieszkania</Link></li>
              <li><Link href="/harmonogram-budowy/">Planer harmonogramu</Link></li>
              <li><Link href="/cennik-budowlany/">Cennik budowlany 2026</Link></li>
            </ul>
          </div>
          <div>
            <h4>Poradnik</h4>
            <ul>
              {ARTICLES.map((a) => (
                <li key={a.href}><Link href={a.href}>{a.title.replace(/ w 2026 roku\?$/, '').replace(/\?$/, '')}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Brickly</h4>
            <ul>
              <li><Link href="/#jak-to-dziala">Jak to działa</Link></li>
              <li><Link href="/#faq">Najczęstsze pytania</Link></li>
              <li><Link href="/polityka-prywatnosci/">Polityka prywatności</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Brickly Planner. Wyceny mają charakter orientacyjny i nie stanowią oferty handlowej.</span>
          <span>Projektowane z myślą o inwestorach w Polsce</span>
        </div>
      </div>
    </footer>
  );
}
