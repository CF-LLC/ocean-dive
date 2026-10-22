// Depth-adaptive soundscape, 100% synthesized with WebAudio (no audio files, no licenses needed).
// waves (0–200 m) → low drone + deep rumble (200 m+) → sonar pings (1,000 m+) and distant whale song (300–4,000 m).
export function createSound() {
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = new AC();
  const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
  const noiseBuf = (secs, brown) => {
    const b = ctx.createBuffer(1, ctx.sampleRate * secs, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; }
    return b;
  };
  const loop = (buf) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(); return s; };
  const brown = noiseBuf(4, true);
  // waves: brown noise, low-passed, swelling with a slow LFO
  const wavesLP = ctx.createBiquadFilter(); wavesLP.type = 'lowpass'; wavesLP.frequency.value = 700;
  const swell = ctx.createGain(); swell.gain.value = 0.5;
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.11; const lfoG = ctx.createGain(); lfoG.gain.value = 0.45; lfo.connect(lfoG).connect(swell.gain); lfo.start();
  const wavesG = ctx.createGain(); wavesG.gain.value = 0;
  loop(brown).connect(wavesLP).connect(swell).connect(wavesG).connect(master);
  // drone: detuned low sines
  const droneG = ctx.createGain(); droneG.gain.value = 0;
  const droneLP = ctx.createBiquadFilter(); droneLP.type = 'lowpass'; droneLP.frequency.value = 260; droneLP.connect(droneG).connect(master);
  [55, 55.35, 82.4, 41.2].forEach((f, i) => { const o = ctx.createOscillator(); o.type = i === 2 ? 'triangle' : 'sine'; o.frequency.value = f; const g = ctx.createGain(); g.gain.value = i === 2 ? 0.08 : 0.22; o.connect(g).connect(droneLP); o.start(); });
  // deep rumble: very low-passed brown noise
  const rumbleLP = ctx.createBiquadFilter(); rumbleLP.type = 'lowpass'; rumbleLP.frequency.value = 90;
  const rumbleG = ctx.createGain(); rumbleG.gain.value = 0;
  loop(brown).connect(rumbleLP).connect(rumbleG).connect(master);
  // echo bus for pings and song
  const delay = ctx.createDelay(2); delay.delayTime.value = 0.42; const fb = ctx.createGain(); fb.gain.value = 0.38;
  const echo = ctx.createGain(); echo.gain.value = 1; echo.connect(master); echo.connect(delay); delay.connect(fb).connect(delay); delay.connect(master);
  let depth = 0, timers = [];
  const ping = () => {
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 1180; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g).connect(echo); o.start(t); o.stop(t + 1.5);
  };
  const song = () => {
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(), v = ctx.createOscillator(), vg = ctx.createGain();
    o.type = 'triangle'; lp.type = 'lowpass'; lp.frequency.value = 800;
    const f0 = 160 + Math.random() * 80;
    o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * 2.3, t + 1.4); o.frequency.linearRampToValueAtTime(f0 * 1.2, t + 3.2);
    v.frequency.value = 5; vg.gain.value = 7; v.connect(vg).connect(o.frequency);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + 0.8); g.gain.linearRampToValueAtTime(0, t + 3.4);
    o.connect(lp).connect(g).connect(echo); o.start(t); v.start(t); o.stop(t + 3.5); v.stop(t + 3.5);
  };
  const schedule = () => {
    timers.push(setInterval(() => { if (depth > 1000) ping(); }, 5200));
    timers.push(setInterval(() => { if (depth > 300 && depth < 4000 && Math.random() < 0.6) song(); }, 11000));
  };
  const api = {
    setDepth(d) {
      depth = d; const t = ctx.currentTime, k = 0.6;
      wavesG.gain.setTargetAtTime(Math.max(0, 1 - d / 200) * 0.7, t, k);
      wavesLP.frequency.setTargetAtTime(700 - Math.min(d, 200) * 2.5, t, k);
      droneG.gain.setTargetAtTime(Math.min(1, Math.max(0, (d - 60) / 500)) * 0.5, t, k);
      rumbleG.gain.setTargetAtTime(Math.min(1, Math.max(0, (d - 800) / 3000)) * 0.9, t, k);
    },
    thud() { const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.8); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 1.2); o.connect(g).connect(master); o.start(t); o.stop(t + 1.3); },
    on() { ctx.resume(); master.gain.setTargetAtTime(0.8, ctx.currentTime, 0.4); if (!timers.length) schedule(); },
    off() { master.gain.setTargetAtTime(0, ctx.currentTime, 0.2); timers.forEach(clearInterval); timers = []; },
  };
  return api;
}
