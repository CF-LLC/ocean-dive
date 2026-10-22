'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const Ocean = dynamic(() => import('./Ocean'), { ssr: false });
export default function SceneLoader() {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const start = () => setGo(true);
    const t = setTimeout(start, 1500);
    window.addEventListener('scroll', start, { once: true, passive: true });
    window.addEventListener('pointerdown', start, { once: true });
    return () => clearTimeout(t);
  }, []);
  return <div className="bg">{go && <Ocean />}</div>;
}
