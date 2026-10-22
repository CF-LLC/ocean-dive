'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CREATURES, TOTAL, HIDDEN } from '../data/creatures';
import { ZONES, LANDMARKS, BADGES, MAX_DEPTH, DIVE_SCREENS, screensAt, depthAt, pressureAtm, tempAt, zoneAt } from '../data/dive';
import photos from '../data/photos.json';
import { ART } from './Art';
import { BASE, CF_URL, SITE_URL } from '../data/site';
import { drawCard, fmtM } from './card';

const Ocean = dynamic(() => import('./Ocean'), { ssr: false });
const byId = Object.fromEntries(CREATURES.map((c) => [c.id, c]));
const SORTED = [...CREATURES].sort((a, b) => a.depth - b.depth);
const DEEP = CREATURES.filter((c) => c.art);
const SHALLOW3D = CREATURES.filter((c) => c.model);
const LOG_KEY = 'od-log-v2';
const emptyLog = () => ({ found: {}, badges: {}, max: 0, torch: 0, best: null });
const SEA = [[0, [79, 182, 221]], [60, [43, 143, 191]], [200, [14, 74, 114]], [600, [7, 42, 71]], [1000, [2, 10, 22]], [4000, [1, 4, 9]], [MAX_DEPTH, [0, 1, 3]]];
function seaColor(d) {
  for (let i = 1; i < SEA.length; i++) {
    const [d0, a] = SEA[i - 1], [d1, b] = SEA[i];
    if (d <= d1) { const t = (d - d0) / (d1 - d0); return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')})`; }
  }
  return 'rgb(0,1,3)';
}
const fmtTime = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}s`; };
const top = (d) => `calc(${screensAt(d).toFixed(4)} * 100svh)`;

function useStoredBool(key, init) {
  const [v, setV] = useState(init);
  useEffect(() => { const s = localStorage.getItem(key); if (s !== null) setV(s === '1'); }, [key]);
  const set = (x) => { setV(x); localStorage.setItem(key, x ? '1' : '0'); };
  return [v, set];
}

export default function App() {
  const [lite, setLite] = useStoredBool('od-lite', false);
  const [reduced, setReduced] = useStoredBool('od-reduced', false);
  const [show3d, setShow3d] = useState(true); // false only while deep below the 3D layer
  const [started, setStarted] = useState(false); // 3D boots on the first user interaction
  const [ready3d, setReady3d] = useState(false); // first 3D frame painted → poster fades out
  const [posterGone, setPosterGone] = useState(false);
  const [sound, setSound] = useState(false);
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState('');
  const [log, setLog] = useState(emptyLog);
  const [showLog, setShowLog] = useState(false);
  const [scare, setScare] = useState(false);
  const [card, setCard] = useState(null);
  const [lit, setLit] = useState({});
  const [finish, setFinish] = useState(null);
  const heroRef = useRef(null), hud = useRef({}), snd = useRef(null), closeBtn = useRef(null);
  const st = useRef({ d: 0, start: 0, deep3d: true, scared: false, acc: {}, torch: [0, 0], reduced: false });
  const logRef = useRef(log);
  logRef.current = log;
  st.current.reduced = reduced;

  const say = useCallback((t, ms = 2600) => { setToast(t); clearTimeout(st.current.tt); st.current.tt = setTimeout(() => setToast(''), ms); }, []);
  const saveLog = useCallback((fn) => {
    setLog((prev) => {
      const next = fn(JSON.parse(JSON.stringify(prev)));
      const n = Object.keys(next.found).length;
      const award = (id) => { if (!next.badges[id]) next.badges[id] = Date.now(); };
      if (next.torch >= 5) award('torch');
      if (HIDDEN.every((h) => next.found[h])) award('hidden');
      if (n >= TOTAL) award('all');
      try { localStorage.setItem(LOG_KEY, JSON.stringify(next)); } catch {}
      const newB = BADGES.filter((b) => next.badges[b.id] && !prev.badges[b.id]);
      if (newB.length) setTimeout(() => say(`${newB[0].icon} Badge unlocked: ${newB[0].name}`), 0);
      return next;
    });
  }, [say]);
  const markFound = useCallback((id, how) => {
    if (logRef.current.found[id]) return;
    logRef.current = { ...logRef.current, found: { ...logRef.current.found, [id]: 1 } };
    saveLog((l) => { l.found[id] = Date.now(); if (how === 'torch') l.torch = (l.torch || 0) + 1; return l; });
    const c = byId[id];
    if (how === 'torch') { setLit((x) => ({ ...x, [id]: 1 })); say(`🔦 Found: ${c.name}${c.hidden ? ' (hidden!)' : ''}`); }
  }, [saveLog, say]);
  const open = useCallback((id) => { setSel(id); markFound(id, 'tap'); }, [markFound]);

  // initial settings + saved log
  useEffect(() => {
    if (localStorage.getItem('od-lite') === null) setLite(matchMedia('(pointer:coarse)').matches || (navigator.deviceMemory || 8) <= 4);
    if (localStorage.getItem('od-reduced') === null && matchMedia('(prefers-reduced-motion: reduce)').matches) setReduced(true);
    try { const s = JSON.parse(localStorage.getItem(LOG_KEY)); if (s && s.found) setLog({ ...emptyLog(), ...s }); } catch {}
    st.current.scared = sessionStorage.getItem('od-scared') === '1';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lazy 3D: the poster + HTML hero stand in until the visitor first interacts
  useEffect(() => {
    const evs = ['scroll', 'pointerdown', 'touchstart', 'keydown', 'wheel'];
    const go = () => { evs.forEach((e) => removeEventListener(e, go)); setStarted(true); };
    evs.forEach((e) => addEventListener(e, go, { passive: true }));
    if (scrollY > 0) go(); // restored scroll position (reload mid-dive)
    return () => evs.forEach((e) => removeEventListener(e, go));
  }, []);
  useEffect(() => {
    if (!ready3d || posterGone) return;
    const t = setTimeout(() => setPosterGone(true), reduced ? 0 : 900);
    return () => clearTimeout(t);
  }, [ready3d, posterGone, reduced]);
  const on3dReady = useCallback(() => setReady3d(true), []);
  useEffect(() => { document.documentElement.classList.toggle('reduced', reduced); }, [reduced]);

  // scroll → depth, HUD, darkness, events
  useEffect(() => {
    let raf = 0;
    const root = document.documentElement;
    const update = () => {
      raf = 0;
      const U = heroRef.current ? heroRef.current.offsetHeight : innerHeight;
      const S = (scrollY + innerHeight / 2 - U) / U;
      window.__odS = S;
      const d = Math.max(0, Math.min(MAX_DEPTH, depthAt(S)));
      const s = st.current; s.d = d;
      const h = hud.current;
      if (h.depth) {
        h.depth.textContent = `${fmtM(d)} m`;
        h.ft.textContent = `${fmtM(d * 3.28084)} ft`;
        h.p.textContent = `${pressureAtm(d) < 10 ? pressureAtm(d).toFixed(1) : fmtM(pressureAtm(d))} atm`;
        h.t.textContent = `${tempAt(d).toFixed(1)} °C`;
        h.z.textContent = zoneAt(d).name;
        h.bar.style.transform = `scaleY(${d / MAX_DEPTH})`;
      }
      root.style.setProperty('--sea', seaColor(d));
      const dark = Math.max(0, Math.min(1, (d - 850) / 250));
      root.style.setProperty('--dark', dark.toFixed(3));
      root.classList.toggle('isdeep', dark > 0.5);
      if (s.deep3d && d > 1250) { s.deep3d = false; setShow3d(false); }
      else if (!s.deep3d && d < 1150) { s.deep3d = true; setShow3d(true); }
      if (!s.start && d > 5) s.start = performance.now();
      const L = logRef.current;
      if (d > L.max + 25 || (d >= MAX_DEPTH && L.max < MAX_DEPTH)) {
        saveLog((l) => {
          l.max = Math.max(l.max, Math.round(d));
          [['twilight', 200], ['midnight', 1000], ['titanic', 3800], ['abyss', 4000], ['hadal', 6000], ['challenger', MAX_DEPTH]].forEach(([id, m]) => { if (l.max >= m && !l.badges[id]) l.badges[id] = Date.now(); });
          return l;
        });
        logRef.current = { ...L, max: Math.max(L.max, Math.round(d)) };
      }
      if (d >= MAX_DEPTH && s.start && !s.done) {
        s.done = true; const ms = performance.now() - s.start; setFinish(ms);
        saveLog((l) => { if (!l.best || ms < l.best) l.best = Math.round(ms); return l; });
      }
      if (!s.scared && !s.reduced && d > 1160 && d < 1400) {
        s.scared = true; sessionStorage.setItem('od-scared', '1');
        setScare(true); snd.current?.thud();
        setTimeout(() => { setScare(false); say('👁️ That was a giant squid eye. They grow up to ~27 cm across.', 4200); saveLog((l) => { l.badges.brave = l.badges.brave || Date.now(); return l; }); }, 1700);
      }
      snd.current?.setDepth(d);
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(update); };
    addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
    update();
    return () => { removeEventListener('scroll', req); removeEventListener('resize', req); cancelAnimationFrame(raf); };
  }, [saveLog, say]);

  // torch follows pointer / finger
  useEffect(() => {
    const root = document.documentElement; let raf = 0, px = innerWidth / 2, py = innerHeight * 0.55;
    const apply = () => { raf = 0; root.style.setProperty('--tx', `${px}px`); root.style.setProperty('--ty', `${py}px`); st.current.torch = [px, py]; };
    const mv = (e) => { const p = e.touches ? e.touches[0] : e; if (!p) return; px = p.clientX; py = p.clientY; if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    addEventListener('pointermove', mv, { passive: true }); addEventListener('pointerdown', mv, { passive: true }); addEventListener('touchmove', mv, { passive: true });
    return () => { removeEventListener('pointermove', mv); removeEventListener('pointerdown', mv); removeEventListener('touchmove', mv); };
  }, []);

  // discovery loop: light a deep creature with the torch (or, in reduced motion, let it pass the centre line)
  useEffect(() => {
    const id = setInterval(() => {
      const s = st.current; if (s.d < 600) return;
      const [tx, ty] = s.torch, R = Math.min(innerWidth, innerHeight) * 0.17 + 40;
      document.querySelectorAll('.cr[data-id]').forEach((el) => {
        const cid = el.dataset.id; if (logRef.current.found[cid]) return;
        const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const hit = s.reduced ? Math.abs(cy - innerHeight / 2) < innerHeight * 0.18 : Math.hypot(Math.max(0, Math.abs(cx - tx) - r.width * 0.35), Math.max(0, Math.abs(cy - ty) - r.height * 0.35)) < R;
        s.acc[cid] = hit ? (s.acc[cid] || 0) + 150 : 0;
        if (s.acc[cid] >= (s.reduced ? 700 : 450)) markFound(cid, 'torch');
      });
    }, 150);
    return () => clearInterval(id);
  }, [markFound]);

  useEffect(() => {
    if (!sel && !showLog) return;
    closeBtn.current?.focus();
    const k = (e) => { if (e.key === 'Escape') { setSel(null); setShowLog(false); } };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [sel, showLog]);

  const toggleSound = async () => {
    if (!snd.current) { const { createSound } = await import('./sound'); snd.current = createSound(); snd.current.setDepth(st.current.d); }
    if (sound) snd.current.off(); else { snd.current.on(); say('🎧 Best with headphones. The sound changes as you sink.', 3200); }
    setSound(!sound);
  };

  const nFound = Object.keys(log.found).length;
  const maxD = Math.max(log.max, Math.round(st.current.d));
  const timeStr = finish ? fmtTime(finish) : null;
  const shareText = `🌊 I dove ${fmtM(maxD)} m in Ocean Dive and found ${nFound}/${TOTAL} creatures${timeStr ? ` in ${timeStr}` : ''}. 🔦 How deep can you go?`;
  const makeCard = useCallback(async () => {
    const blob = await drawCard({ depth: maxD, found: nFound, total: TOTAL, time: timeStr, zone: zoneAt(Math.max(0, maxD - 1)).name, badges: BADGES.filter((b) => log.badges[b.id]) });
    setCard((old) => { if (old) URL.revokeObjectURL(old.url); return { blob, url: URL.createObjectURL(blob) }; });
    return blob;
  }, [maxD, nFound, timeStr, log.badges]);
  const resultRef = useRef(null);
  useEffect(() => {
    const el = resultRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) makeCard(); }, { rootMargin: '200px' });
    io.observe(el); return () => io.disconnect();
  }, [makeCard]);
  const copy = async (t, msg) => { try { await navigator.clipboard.writeText(t); say(msg); } catch { say(t, 6000); } };
  const share = async () => {
    const blob = card?.blob || await makeCard();
    const file = new File([blob], 'ocean-dive-result.png', { type: 'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: shareText, url: SITE_URL }); return; }
      if (navigator.share) { await navigator.share({ text: shareText, url: SITE_URL }); return; }
      await copy(`${shareText} ${SITE_URL}`, 'Result copied! Paste it anywhere.');
    } catch (e) { if (e && e.name !== 'AbortError') copy(`${shareText} ${SITE_URL}`, 'Result copied! Paste it anywhere.'); }
  };
  const download = async () => {
    const blob = card?.blob || await makeCard();
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ocean-dive-result.png'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL)}`;

  const ticks = useMemo(() => {
    const t = []; for (let m = 100; m < MAX_DEPTH; m += m < 1000 ? 100 : 500) t.push(m); return t;
  }, []);
  const c = sel && byId[sel], ph = sel && photos[sel];

  return (
    <main>
      <div className="sea" aria-hidden="true" />
      <div className="bg" aria-hidden="true">
        {started && show3d && <Ocean lite={lite} reduced={reduced} onPick={open} onReady={on3dReady} />}
        {!posterGone && (
          <picture className={`poster ${ready3d ? 'off' : ''}`}>
            <source media="(max-aspect-ratio: 3/4)" srcSet={`${BASE}/poster-m.webp`} />
            <img src={`${BASE}/poster-d.webp`} alt="" width="1600" height="1000" fetchPriority="high" decoding="async" />
          </picture>
        )}
      </div>
      <div className="dark" aria-hidden="true" />

      <aside className="hud" aria-label="Dive computer">
        <div className="hud-bar"><i ref={(e) => (hud.current.bar = e)} /></div>
        <div>
          <div className="hud-depth" ref={(e) => (hud.current.depth = e)} aria-live="off">0 m</div>
          <div className="hud-row"><span ref={(e) => (hud.current.ft = e)}>0 ft</span> · <span ref={(e) => (hud.current.p = e)}>1.0 atm</span> · <span ref={(e) => (hud.current.t = e)}>20.0 °C</span></div>
          <div className="hud-zone" ref={(e) => (hud.current.z = e)}>Sunlight Zone</div>
        </div>
      </aside>

      <div className="controls" role="toolbar" aria-label="Dive settings">
        <button onClick={() => setShowLog(true)} className="logbtn">📖 Dive log <b>{nFound}/{TOTAL}</b></button>
        <button onClick={toggleSound} aria-pressed={sound} title="Best with headphones">{sound ? '🔊 Sound on' : '🎧 Sound off'}</button>
        <button onClick={() => setLite(!lite)} aria-pressed={lite} title="Lighter 3D for phones and older devices">{lite ? '⚡ Lite' : '✨ Full'}</button>
        <button onClick={() => setReduced(!reduced)} aria-pressed={reduced}>{reduced ? '🐢 Reduced motion' : '🌊 Motion on'}</button>
      </div>
      <a className="badge" href={CF_URL} target="_blank" rel="noopener">Built by <b>CF LLC</b></a>

      <header className="hero" ref={heroRef}>
        <div className="sun" aria-hidden="true" />
        <p className="kicker">A real-scale dive · 0 → 10,935 m</p>
        <h1>Ocean Dive</h1>
        <p>Scroll down to sink to the deepest point on Earth. Below 1,000 m the lights go out: your cursor or finger becomes a torch. Find all {TOTAL} creatures.</p>
        <p className="hp">🎧 Best with headphones · sound is off until you turn it on</p>
        <span className="cue" aria-hidden="true">↓</span>
      </header>

      <div className="dive" style={{ height: `calc(${DIVE_SCREENS} * 100svh)` }}>
        {ticks.map((m) => <div key={m} className="tick" style={{ top: top(m) }}><span>{fmtM(m)} m</span></div>)}
        {ZONES.map((z) => (
          <section key={z.id} className="zonehead lbl" style={{ top: top(z.top + (z.top ? 0 : 6)) }} aria-labelledby={`z-${z.id}`}>
            <span className="depth">{fmtM(z.top)} – {fmtM(z.bottom)} m · {z.sub}</span>
            <h2 id={`z-${z.id}`}>{z.name}</h2>
            <p>{z.blurb}</p>
          </section>
        ))}
        {LANDMARKS.map((l) => (
          <div key={l.id} className={`mark ${l.art ? 'hasart' : ''}`} style={{ top: top(l.depth) }}>
            {l.art && <div className="markart" dangerouslySetInnerHTML={{ __html: ART[l.art] }} />}
            <div className="marktext lbl"><b>{fmtM(l.depth)} m · {l.title}</b><span>{l.text}</span></div>
          </div>
        ))}
        {SHALLOW3D.map((c3, i) => (
          <button key={c3.id} className={`chip ${c3.x > 0 ? 'l' : 'r'} ${log.found[c3.id] ? 'got' : ''}`} style={{ top: top(c3.depth) }} onClick={() => open(c3.id)}>
            {c3.name} <small>{fmtM(c3.depth)} m</small>
          </button>
        ))}
        {DEEP.map((d) => {
          const style = { top: top(d.depth), left: `${d.x}%`, width: d.id === 'siphonophore' ? '100%' : `clamp(90px, ${d.w}vw, ${d.wmax}px)` };
          return (
            <div key={d.id} className={`crwrap ${d.hidden ? 'hidden' : ''} ${lit[d.id] ? 'lit' : ''} ${log.found[d.id] ? 'got' : ''} ${d.depth > 900 ? 'deep' : ''}`} style={style}>
              <button className={`cr cr-${d.id}`} data-id={d.id} onClick={() => open(d.id)} aria-label={`${d.hidden && !log.found[d.id] ? 'Something hidden' : d.name}, ${fmtM(d.depth)} m`}>
                <span className="art" dangerouslySetInnerHTML={{ __html: ART[d.art] }} />
                <span className="nm">{d.hidden && !log.found[d.id] ? '???' : d.name} · {fmtM(d.depth)} m</span>
              </button>
              {d.glowSpots && (
                <span className="lum" aria-hidden="true">
                  {(d.glowSpots === 'chain' ? Array.from({ length: 14 }, (_, i) => [4 + i * 7, 50 + Math.sin(i * 1.3) * 22]) : d.glowSpots).map(([x, y], i) => (
                    <i key={i} style={{ left: `${x}%`, top: `${y}%`, '--c': d.glowColor || '#7fd8ff', animationDelay: `${(i * 0.37 + d.depth / 300) % 3}s` }} />
                  ))}
                </span>
              )}
            </div>
          );
        })}
        <div className="trench" style={{ top: `calc(${DIVE_SCREENS - 0.55} * 100svh)` }} aria-hidden="true" />
      </div>

      <section className="result" ref={resultRef} aria-labelledby="res-h">
        <div className="card final">
          <span className="depth">Challenger Deep · 10,935 m · ~{fmtM(pressureAtm(MAX_DEPTH))} atm</span>
          <h2 id="res-h">You dove {fmtM(maxD)} m and found {nFound}/{TOTAL} creatures{timeStr ? ` in ${timeStr}` : ''}.</h2>
          {nFound < TOTAL && <p>{TOTAL - nFound} still out there{HIDDEN.some((h) => !log.found[h]) ? ', some hiding in the dark' : ''}. Scroll back up with your light.</p>}
          {card ? <img className="cardimg" src={card.url} alt={`Share card: ${shareText}`} width="1200" height="630" /> : <div className="cardimg ph" />}
          <div className="row">
            <button className="cta" onClick={share}>Share my dive</button>
            <button className="ghost" onClick={download}>Download image</button>
            <button className="ghost" onClick={() => copy(SITE_URL, 'Link copied!')}>Copy link</button>
            <a className="ghost" href={xUrl} target="_blank" rel="noopener">Post on X</a>
          </div>
          <div className="row" style={{ marginTop: '.8rem' }}>
            <button className="ghost" onClick={() => setShowLog(true)}>📖 Open dive log</button>
            <a className="ghost" href={CF_URL}>Want a site like this? CF LLC →</a>
          </div>
          <p className="small"><a href={`${BASE}/attributions/`}>Sources, attributions &amp; licenses</a></p>
        </div>
      </section>

      <div className={`eye ${scare ? 'on' : ''}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: scare ? ART.eye : '' }} />
      {toast && <div className="toast" role="status">{toast}</div>}

      {c && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ctitle" onClick={() => setSel(null)}>
          <article className="sheet" onClick={(e) => e.stopPropagation()}>
            <button ref={closeBtn} className="x" onClick={() => setSel(null)} aria-label="Close">×</button>
            {ph ? (
              <figure>
                <img src={`${BASE}/photos/${ph.file}`} alt={`${c.name}`} width="640" height="400" loading="lazy" />
                <figcaption>Image: {ph.artist || 'Unknown'} · <a href={ph.source} target="_blank" rel="noopener">{ph.license}</a></figcaption>
              </figure>
            ) : <div className="sheetart" dangerouslySetInnerHTML={{ __html: ART[c.art] }} />}
            <h2 id="ctitle">{c.name}</h2>
            <p className="sci">{c.sci}</p>
            <p className="depth">Shown at {fmtM(c.depth)} m · range {c.range}</p>
            <ul>{c.facts.map((f) => <li key={f}>{f}</li>)}</ul>
          </article>
        </div>
      )}

      {showLog && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ltitle" onClick={() => setShowLog(false)}>
          <article className="sheet logsheet" onClick={(e) => e.stopPropagation()}>
            <button ref={closeBtn} className="x" onClick={() => setShowLog(false)} aria-label="Close">×</button>
            <h2 id="ltitle">Dive log</h2>
            <p className="logsum"><b>{nFound}/{TOTAL}</b> creatures found · deepest {fmtM(log.max)} m{log.best ? ` · fastest full dive ${fmtTime(log.best)}` : ''}</p>
            <ul className="loggrid">
              {SORTED.map((x) => {
                const got = !!log.found[x.id];
                return (
                  <li key={x.id} className={got ? 'got' : x.hidden ? 'secret' : 'miss'}>
                    <button onClick={() => got && (setShowLog(false), setSel(x.id))} disabled={!got} aria-label={got ? x.name : x.hidden ? 'Hidden creature, not found yet' : `${x.name}, not found yet`}>
                      <span className="thumb">{x.art ? <span dangerouslySetInnerHTML={{ __html: ART[x.art] }} /> : <img src={`${BASE}/photos/${photos[x.id].file}`} alt="" loading="lazy" />}</span>
                      <span className="ln">{got || !x.hidden ? x.name : '??? hidden'}</span>
                      <small>{fmtM(x.depth)} m</small>
                    </button>
                  </li>
                );
              })}
            </ul>
            <h3>Badges</h3>
            <ul className="badges">
              {BADGES.map((b) => {
                const got = !!log.badges[b.id];
                return <li key={b.id} className={got ? 'got' : ''}><span>{got || !b.secret ? b.icon : '❔'}</span><b>{got || !b.secret ? b.name : 'Secret badge'}</b><small>{got || !b.secret ? b.how : 'Keep diving…'}</small></li>;
              })}
            </ul>
            <p className="small">Saved on this device only (localStorage). <button className="linkbtn" onClick={() => { if (confirm('Reset your dive log on this device?')) { localStorage.removeItem(LOG_KEY); logRef.current = emptyLog(); setLog(emptyLog()); setLit({}); } }}>Reset log</button></p>
          </article>
        </div>
      )}
    </main>
  );
}
