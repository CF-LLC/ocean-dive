'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CREATURES, BANDS, ZONES, FLOOR_Y } from '../data/creatures';
import photos from '../data/photos.json';
import { BASE, CF_URL, SITE_URL } from '../data/site';

const Ocean = dynamic(() => import('./Ocean'), { ssr: false });
const byId = Object.fromEntries(CREATURES.map((c) => [c.id, c]));

function useStored(key, init) {
  const [v, setV] = useState(init);
  useEffect(() => { const s = localStorage.getItem(key); if (s !== null) setV(s === '1'); }, [key]);
  const set = (x) => { setV(x); localStorage.setItem(key, x ? '1' : '0'); };
  return [v, set];
}

export default function App() {
  const [go, setGo] = useState(false);
  const [lite, setLite] = useStored('od-lite', false);
  const [reduced, setReduced] = useStored('od-reduced', false);
  const [sound, setSound] = useState(false);
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState('');
  const audio = useRef(null);
  const closeBtn = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('od-lite') === null) setLite(matchMedia('(pointer:coarse)').matches || (navigator.deviceMemory || 8) <= 4);
    if (localStorage.getItem('od-reduced') === null && matchMedia('(prefers-reduced-motion: reduce)').matches) setReduced(true);
    const start = () => setGo(true);
    const t = setTimeout(start, 4500);
    addEventListener('scroll', start, { once: true, passive: true });
    addEventListener('pointerdown', start, { once: true });
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { document.documentElement.classList.toggle('reduced', reduced); }, [reduced]);

  const toggleSound = () => {
    if (!audio.current) { audio.current = new Audio(`${BASE}/audio/ambient.mp3`); audio.current.loop = true; audio.current.volume = 0.5; }
    if (sound) audio.current.pause(); else audio.current.play().catch(() => {});
    setSound(!sound);
  };
  const open = useCallback((id) => setSel(id), []);
  useEffect(() => {
    if (!sel) return;
    closeBtn.current?.focus();
    const k = (e) => e.key === 'Escape' && setSel(null);
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [sel]);

  const share = async () => {
    const data = { title: 'Ocean Dive', text: 'I just dove from the surface to the sea floor 🌊 Take the dive:', url: SITE_URL };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(SITE_URL); setToast('Link copied!');
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      try { await navigator.clipboard.writeText(SITE_URL); setToast('Link copied!'); } catch { setToast(SITE_URL); }
    }
    setTimeout(() => setToast(''), 2500);
  };

  const c = sel && byId[sel], ph = sel && photos[sel];
  return (
    <main>
      <div className="bg" aria-hidden="true">{go && <Ocean lite={lite} reduced={reduced} onPick={open} />}</div>

      <div className="controls" role="toolbar" aria-label="Dive settings">
        <button onClick={toggleSound} aria-pressed={sound}>{sound ? '🔊 Sound on' : '🔈 Sound off'}</button>
        <button onClick={() => setLite(!lite)} aria-pressed={lite} title="Lighter 3D for phones and older devices">{lite ? '⚡ Lite mode' : '✨ Full quality'}</button>
        <button onClick={() => setReduced(!reduced)} aria-pressed={reduced}>{reduced ? '🐢 Reduced motion' : '🌊 Full motion'}</button>
      </div>
      <a className="badge" href={CF_URL} target="_blank" rel="noopener">Built by <b>CF LLC</b></a>

      <header className="hero" data-y="0">
        <p className="kicker">An interactive 3D dive</p>
        <h1>Ocean Dive</h1>
        <p>Scroll to sink from the sunlit surface to the sea floor. Tap the creatures you meet along the way.</p>
        <span className="cue" aria-hidden="true">↓</span>
      </header>

      {ZONES.map((z) => (
        <div key={z.id} className={`zone zone-${z.id}`}>
          <section className="zonehead" aria-labelledby={`z-${z.id}`}>
            <span className="depth">{z.range}</span>
            <h2 id={`z-${z.id}`}>{z.name}</h2>
            <p>{z.blurb}</p>
          </section>
          {BANDS.filter((b) => b.zone === z.id).map((b, i) => (
            <section key={b.id} id={b.id} className={`band ${i % 2 ? 'right' : 'left'}`} data-y={b.y}>
              <div className="card">
                <span className="depth">{z.name} · {b.depth}</span>
                <h3>{b.label}</h3>
                <p>{b.text}</p>
                <div className="chips">
                  {CREATURES.filter((x) => x.band === b.id).map((x) => (
                    <button key={x.id} className="chip" onClick={() => open(x.id)}>{x.name}</button>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      ))}

      <section className="floor" id="floor" data-y={FLOOR_Y + 4}>
        <div className="card final">
          <span className="depth">Sea floor · ~4,000 m</span>
          <h2>You reached the bottom. Want something built like this?</h2>
          <div className="row">
            <a className="cta" href={CF_URL}>Work with CF LLC →</a>
            <button className="ghost" onClick={share}>Share your dive</button>
          </div>
          <p className="small"><a href={`${BASE}/attributions/`}>Attributions &amp; licenses</a></p>
        </div>
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}

      {c && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ctitle" onClick={() => setSel(null)}>
          <article className="sheet" onClick={(e) => e.stopPropagation()}>
            <button ref={closeBtn} className="x" onClick={() => setSel(null)} aria-label="Close">×</button>
            <figure>
              <img src={`${BASE}/photos/${ph.file}`} alt={`Photo of ${c.name}`} width="640" height="400" loading="lazy" />
              <figcaption>Photo: {ph.artist || 'Unknown'} · <a href={ph.source} target="_blank" rel="noopener">{ph.license}</a></figcaption>
            </figure>
            <h2 id="ctitle">{c.name}</h2>
            <p className="sci">{c.sci}</p>
            <p className="depth">Depth: {c.depth}</p>
            <ul>{c.facts.map((f) => <li key={f}>{f}</li>)}</ul>
          </article>
        </div>
      )}
    </main>
  );
}
