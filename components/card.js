// Draws the personal result share card (1200x630) on a canvas. Returns a PNG Blob.
export function fmtM(m) { return Math.round(m).toLocaleString('en-US'); }
export async function drawCard({ depth, found, total, time, zone, badges }) {
  const W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, H);
  [[0, '#4fb6dd'], [0.25, '#0e4a72'], [0.55, '#03182c'], [1, '#000206']].forEach(([o, col]) => g.addColorStop(o, col));
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // bioluminescent specks (deterministic)
  let s = 7; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 90; i++) { x.fillStyle = ['#2bf5c6', '#4ea8ff', '#b47cff'][i % 3]; x.globalAlpha = 0.25 + r() * 0.6; x.beginPath(); x.arc(r() * W, 200 + r() * (H - 200), 1 + r() * 2.5, 0, 7); x.fill(); }
  x.globalAlpha = 1;
  // depth gauge (right column, labels kept clear of the footer)
  const frac = Math.min(1, depth / 10935), GX = 1120, GT = 60, GH = 420;
  x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(GX, GT, 10, GH);
  x.fillStyle = '#7fe3ff'; x.fillRect(GX, GT, 10, GH * frac);
  x.beginPath(); x.arc(GX + 5, GT + GH * frac, 13, 0, 7); x.fill();
  x.font = '600 20px system-ui, sans-serif'; x.fillStyle = '#cfeaff'; x.textAlign = 'right';
  x.fillText('0 m', GX - 16, GT + 8); x.fillText('10,935 m', GX - 16, GT + GH + 6);
  x.textAlign = 'left'; x.fillStyle = '#eaf6ff';
  x.font = '600 28px system-ui, sans-serif'; x.fillText('OCEAN DIVE', 70, 92);
  x.font = '800 132px system-ui, sans-serif'; x.fillText(`${fmtM(depth)} m`, 62, 228);
  x.font = '500 38px system-ui, sans-serif'; x.fillText(`I dove to the ${zone} and found`, 70, 296);
  x.font = '800 80px system-ui, sans-serif'; x.fillStyle = '#7fe3ff'; x.fillText(`${found}/${total}`, 70, 384); const fw = x.measureText(`${found}/${total}`).width;
  x.font = '500 38px system-ui, sans-serif'; x.fillStyle = '#eaf6ff'; x.fillText('creatures' + (time ? ` in ${time}` : ''), 70 + fw + 20, 380);
  // badges row (y 418-482, x 70-1000)
  const bs = badges || [], BY = 418, BH = 56, maxX = 1000;
  const pill = (px, w) => { x.fillStyle = 'rgba(127,227,255,.14)'; x.strokeStyle = 'rgba(127,227,255,.45)'; x.lineWidth = 2; x.beginPath(); x.roundRect ? x.roundRect(px, BY, w, BH, BH / 2) : x.rect(px, BY, w, BH); x.fill(); x.stroke(); };
  x.textBaseline = 'middle';
  if (!bs.length) {
    x.font = '500 24px system-ui, sans-serif'; x.fillStyle = '#9fdcff'; x.fillText('No badges yet. Dive deeper to earn some.', 70, BY + BH / 2);
  } else {
    x.font = '600 24px system-ui, sans-serif'; x.fillStyle = '#cfeaff'; const lbl = `${bs.length} badge${bs.length > 1 ? 's' : ''}`; x.fillText(lbl, 70, BY + BH / 2);
    let px = 70 + x.measureText(lbl).width + 20;
    const fullW = bs.reduce((t, b) => { x.font = '600 22px system-ui, sans-serif'; return t + 64 + x.measureText(b.name).width + 12; }, 0);
    if (px + fullW <= maxX) {
      for (const b of bs) { x.font = '600 22px system-ui, sans-serif'; const w = 64 + x.measureText(b.name).width; pill(px, w);
        x.font = '28px system-ui, "Noto Color Emoji", sans-serif'; x.fillStyle = '#fff'; x.fillText(b.icon, px + 14, BY + BH / 2 + 2);
        x.font = '600 22px system-ui, sans-serif'; x.fillStyle = '#eaf6ff'; x.fillText(b.name, px + 52, BY + BH / 2 + 1); px += w + 12; }
    } else {
      const fit = Math.floor((maxX - px + 10) / (BH + 10)), shown = bs.length > fit ? bs.slice(0, fit - 1) : bs;
      for (const b of shown) { pill(px, BH); x.font = '30px system-ui, "Noto Color Emoji", sans-serif'; x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(b.icon, px + BH / 2, BY + BH / 2 + 2); x.textAlign = 'left'; px += BH + 10; }
      if (shown.length < bs.length) { pill(px, BH); x.font = '700 22px system-ui, sans-serif'; x.fillStyle = '#eaf6ff'; x.textAlign = 'center'; x.fillText(`+${bs.length - shown.length}`, px + BH / 2, BY + BH / 2 + 1); x.textAlign = 'left'; }
    }
  }
  x.textBaseline = 'alphabetic';
  // footer: divider, URL left, CF LLC mark right (well below the gauge)
  x.fillStyle = 'rgba(255,255,255,.14)'; x.fillRect(70, 520, 1060, 2);
  x.font = '500 26px system-ui, sans-serif'; x.fillStyle = '#9fdcff'; x.fillText('How deep can you go?  cf-llc.github.io/ocean-dive', 70, 578);
  x.fillStyle = '#eaf6ff'; x.beginPath(); x.roundRect ? x.roundRect(1000, 543, 50, 50, 12) : x.rect(1000, 543, 50, 50); x.fill();
  x.fillStyle = '#03182c'; x.font = '800 24px system-ui, sans-serif'; x.textAlign = 'center'; x.fillText('CF', 1025, 577);
  x.textAlign = 'left'; x.fillStyle = '#eaf6ff'; x.font = '600 22px system-ui, sans-serif'; x.fillText('CF LLC', 1060, 576);
  return new Promise((res) => c.toBlob(res, 'image/png'));
}
