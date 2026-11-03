'use client';

import { Fragment, useId } from 'react';
import type { ReactNode } from 'react';
import type { Option } from '@/lib/data';

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="form-group">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

type SegOption<T> = { value: T; label: string; sub?: string };

/** Przełącznik segmentowy oparty na radio — dostępny z klawiatury. */
export function Seg<T extends string | number>({
  label, value, options, onChange, wrap,
}: { label: string; value: T; options: SegOption<T>[]; onChange: (v: T) => void; wrap?: boolean }) {
  const id = useId();
  return (
    <div className="field">
      <span className="field-label" id={id}>{label}</span>
      <div className={'seg' + (wrap ? ' wrap-2' : '')} role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <Fragment key={String(o.value)}>
            <input
              type="radio"
              id={`${id}-${o.value}`}
              name={id}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <label htmlFor={`${id}-${o.value}`}>
              {o.label}
              {o.sub && <small>{o.sub}</small>}
            </label>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch" />
    </label>
  );
}

export function Select({
  label, value, options, onChange,
}: { label: string; value: string; options: { id: string; name: string }[] | Option[]; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <select className="input" id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </div>
  );
}

/** Suwak z podglądem wartości i opcjonalnym polem do wpisania liczby. */
export function Range({
  label, value, min, max, step = 1, suffix = '', onChange, withInput, hint,
}: {
  label: string; value: number; min: number; max: number; step?: number; suffix?: string;
  onChange: (v: number) => void; withInput?: boolean; hint?: string;
}) {
  const id = useId();
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label} <output htmlFor={id}>{value}{suffix}</output>
      </label>
      <input type="range" id={id} min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {withInput && (
        <div className="row-2" style={{ marginTop: 6 }}>
          <input
            className="input"
            type="number"
            min={min}
            max={max}
            value={value}
            aria-label={label}
            onChange={(e) => e.target.value !== '' && onChange(clamp(Number(e.target.value)))}
          />
          {hint && <span className="hint" style={{ alignSelf: 'center', margin: 0 }}>{hint}</span>}
        </div>
      )}
      {!withInput && hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <input className="input" type="date" id={id} value={value} onChange={(e) => e.target.value && onChange(e.target.value)} />
    </div>
  );
}
