'use client';

import { useEffect, useRef, useState } from 'react';

export function ToastHost() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onToast = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setShow(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), 2600);
    };
    window.addEventListener('brickly-toast', onToast);
    return () => window.removeEventListener('brickly-toast', onToast);
  }, []);

  return (
    <div className={'toast' + (show ? ' show' : '')} role="status" aria-live="polite">
      {msg}
    </div>
  );
}
