/** Znak Brickly: dach + trzy „cegły” ułożone schodkowo jak paski wykresu Gantta. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path className="roof" d="M6 20 24 6l18 14" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect className="bar-1" x="9" y="24" width="17" height="6" rx="2" />
      <rect className="bar-2" x="17" y="32" width="18" height="6" rx="2" />
      <rect className="bar-3" x="25" y="40" width="14" height="6" rx="2" />
    </svg>
  );
}

export function LogoWord() {
  return (
    <span className="logo-word">
      Brickly<span>Planner</span>
    </span>
  );
}
