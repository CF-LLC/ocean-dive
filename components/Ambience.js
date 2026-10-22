'use client';
// Lightweight 2D ambience layer (all devices, tuned for phones): parallax marine snow,
// bubbles, surface kelp/coral, distant silhouettes and bioluminescent specks.
// Depth comes from window.__odD (set by App on scroll). Reduced motion → one static frame per depth step.
import { useEffect, useRef } from 'react';

const rnd = (a, b) => a + Math.random() * (b - a);
const GLOW = ['#2bf5c6', '#4ea8ff', '#b47cff', '#ff7ce0', '#7fe3ff'];

export default function Ambience({ reduced }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const x = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, raf = 0, last = 0, prevD = window.__odD || 0, alive = true;
    const coarse = matchMedia('(pointer:coarse)').matches;
    const N = coarse ? 1 : 1.4;
    let snow = [], bub = [], spk = [], sil = [], kelp = [];
    const resize = () => {
      dpr = Math.min(1.5, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      snow = Array.from({ length: Math.round(110 * N) }, () => ({ x: rnd(0, W), y: rnd(0, H), z: [0.35, 0.65, 1][Math.floor(rnd(0, 3))], r: rnd(0.6, 2.2), v: rnd(4, 14) }));
      bub = Array.from({ length: Math.round(22 * N) }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(1.5, 5), v: rnd(25, 60), w: rnd(0, 6) }));
      spk = Array.from({ length: Math.round(46 * N) }, () => ({ x: rnd(0, W), y: rnd(0, H), z: rnd(0.3, 1), r: rnd(1.2, 3.4), c: GLOW[Math.floor(rnd(0, GLOW.length))], p: rnd(0, 6.28), s: rnd(0.6, 2) }));
      sil = Array.from({ length: 5 }, (_, i) => ({ x: rnd(0, W), y: rnd(H * 0.15, H * 0.85), z: rnd(0.25, 0.5), s: rnd(0.6, 1.4), v: rnd(6, 16) * (i % 2 ? 1 : -1), k: i % 3 }));
      kelp = Array.from({ length: coarse ? 7 : 10 }, (_, i) => ({ x: (i + rnd(0.1, 0.9)) * W / (coarse ? 7 : 10), h: rnd(0.25, 0.55) * H, p: rnd(0, 6), c: i % 3 }));
    };
    resize(); addEventListener('resize', resize);
    const wrap = (o, k) => { if (o[k] < -20) o[k] += H + 40; else if (o[k] > H + 20) o[k] -= H + 40; };
    const fish = (px, py, s, dir) => { x.save(); x.translate(px, py); x.scale(s * (dir < 0 ? -1 : 1), s); x.beginPath(); x.ellipse(0, 0, 22, 8, 0, 0, 7); x.moveTo(18, 0); x.lineTo(32, -9); x.lineTo(32, 9); x.closePath(); x.fill(); x.restore(); };
    const whale = (px, py, s, dir) => { x.save(); x.translate(px, py); x.scale(s * (dir < 0 ? -1 : 1), s); x.beginPath(); x.ellipse(0, 0, 90, 22, 0, 0, 7); x.moveTo(80, -4); x.quadraticCurveTo(120, -6, 135, -26); x.lineTo(128, 2); x.lineTo(140, 24); x.quadraticCurveTo(118, 6, 80, 6); x.fill(); x.restore(); };
    const squid = (px, py, s) => { x.save(); x.translate(px, py); x.scale(s, s); x.beginPath(); x.ellipse(0, -30, 12, 32, 0, 0, 7); x.fill(); x.lineWidth = 3; x.strokeStyle = x.fillStyle; for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(i * 3, 0); x.quadraticCurveTo(i * 8, 30, i * 5, 60); x.stroke(); } x.restore(); };
    const frame = (t) => {
      if (!alive) return;
      if (!reduced) raf = requestAnimationFrame(frame);
      if (!reduced && t - last < 32) return; // ~30 fps
      const dt = reduced ? 0 : Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
      const d = window.__odD || 0, dd = (d - prevD); prevD = d;
      const dark = Math.max(0, Math.min(1, (d - 850) / 250));
      const scrollPx = Math.max(-80, Math.min(80, dd * (d < 1000 ? 2.2 : 0.35))); // parallax drift from depth change
      x.clearRect(0, 0, W, H);
      // distant silhouettes (sunlit → twilight)
      const silA = d < 60 ? 0.18 : d < 1000 ? 0.28 * (1 - dark) : 0;
      if (silA > 0.01) {
        x.fillStyle = d < 200 ? `rgba(8,40,70,${silA})` : `rgba(0,8,22,${silA + 0.1})`;
        for (const o of sil) { o.x += o.v * dt; o.y -= scrollPx * o.z; if (o.x < -160) o.x = W + 160; if (o.x > W + 160) o.x = -160; wrap(o, 'y');
          if (d < 200) { for (let j = 0; j < 5; j++) fish(o.x + j * 26 * o.s, o.y + Math.sin(j * 2) * 14, o.s * 0.6, o.v); } else if (o.k === 0) whale(o.x, o.y, o.s * 0.7, o.v); else if (o.k === 1) squid(o.x, o.y, o.s * 0.6); else fish(o.x, o.y, o.s * 1.3, o.v); }
      }
      // kelp + coral rising out of the bottom near the surface (scrolls away with parallax)
      if (d < 140) {
        const off = d * 7; const a = 1 - d / 140; const sway = reduced ? 0 : t / 1000;
        for (const k of kelp) { const base = H + off * 0.9; x.strokeStyle = `rgba(${k.c ? '40,150,90' : '90,170,70'},${0.55 * a})`; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(k.x, base);
          for (let s = 1; s <= 6; s++) x.lineTo(k.x + Math.sin(sway * 1.3 + k.p + s * 0.7) * 10 * s / 3, base - k.h * s / 6); x.stroke();
          x.fillStyle = `rgba(${['255,120,140', '255,170,90', '200,120,255'][k.c]},${0.6 * a})`; x.beginPath(); x.arc(k.x + 18, base - 8, 14 + k.c * 4, Math.PI, 0); x.fill(); }
      }
      // marine snow in three parallax layers
      const snowA = 0.35 + Math.min(0.4, d / 1500);
      x.fillStyle = `rgba(220,240,255,${dark ? snowA * 0.55 : snowA})`;
      for (const o of snow) { o.y += (o.v * o.z * dt) - scrollPx * o.z; o.x += Math.sin((t / 1000) + o.y * 0.02) * 0.15 * o.z; wrap(o, 'y'); x.globalAlpha = 0.4 + o.z * 0.6; x.beginPath(); x.arc(o.x, o.y, o.r * o.z, 0, 7); x.fill(); }
      x.globalAlpha = 1;
      // bubbles near the surface
      if (d < 250) { const a = 1 - d / 250; x.strokeStyle = `rgba(230,250,255,${0.7 * a})`; x.lineWidth = 1.2;
        for (const o of bub) { o.y -= o.v * dt + scrollPx; o.w += dt * 3; wrap(o, 'y'); x.beginPath(); x.arc(o.x + Math.sin(o.w) * 4, o.y, o.r, 0, 7); x.stroke(); } }
      // bioluminescent specks (twilight and deeper; stay visible in the dark zone)
      if (d > 250) { const a = Math.min(1, (d - 250) / 400); x.globalCompositeOperation = 'lighter';
        for (const o of spk) { o.p += dt * o.s; o.y -= scrollPx * o.z * 0.6; o.x += Math.sin(o.p * 0.5) * 0.2; wrap(o, 'y'); const fl = reduced ? 0.8 : 0.45 + 0.55 * Math.sin(o.p) ** 2;
          const R = o.r * (2.5 + o.z * 3); const g = x.createRadialGradient(o.x, o.y, 0, o.x, o.y, R); g.addColorStop(0, o.c); g.addColorStop(1, 'rgba(0,0,0,0)');
          x.globalAlpha = a * fl; x.fillStyle = g; x.beginPath(); x.arc(o.x, o.y, R, 0, 7); x.fill(); }
        x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
    };
    let onScroll = null;
    if (reduced) { onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }; addEventListener('scroll', onScroll, { passive: true }); frame(0); }
    else raf = requestAnimationFrame(frame);
    const vis = () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduced) raf = requestAnimationFrame(frame); };
    document.addEventListener('visibilitychange', vis);
    return () => { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); if (onScroll) removeEventListener('scroll', onScroll); document.removeEventListener('visibilitychange', vis); };
  }, [reduced]);
  return <canvas ref={ref} className="amb" aria-hidden="true" />;
}
