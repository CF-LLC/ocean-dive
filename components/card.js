// Draws the personal result share card (1200x630) on a canvas. Returns a PNG Blob.
export function fmtM(m) { return Math.round(m).toLocaleString('en-US'); }
export async function drawCard({ depth, found, total, time, zone }) {
  const W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, H);
  [[0, '#4fb6dd'], [0.25, '#0e4a72'], [0.55, '#03182c'], [1, '#000206']].forEach(([o, col]) => g.addColorStop(o, col));
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // bioluminescent specks (deterministic)
  let s = 7; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 90; i++) { x.fillStyle = ['#2bf5c6', '#4ea8ff', '#b47cff'][i % 3]; x.globalAlpha = 0.25 + r() * 0.6; x.beginPath(); x.arc(r() * W, 200 + r() * (H - 200), 1 + r() * 2.5, 0, 7); x.fill(); }
  x.globalAlpha = 1;
  // depth bar
  const frac = Math.min(1, depth / 10935);
  x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(1080, 70, 10, 490);
  x.fillStyle = '#7fe3ff'; x.fillRect(1080, 70, 10, 490 * frac);
  x.beginPath(); x.arc(1085, 70 + 490 * frac, 14, 0, 7); x.fill();
  x.font = '600 20px system-ui, sans-serif'; x.fillStyle = '#cfeaff'; x.textAlign = 'right';
  x.fillText('0 m', 1060, 78); x.fillText('10,935 m', 1060, 566);
  x.textAlign = 'left'; x.fillStyle = '#eaf6ff';
  x.font = '600 30px system-ui, sans-serif'; x.fillText('OCEAN DIVE', 70, 100);
  x.font = '800 150px system-ui, sans-serif'; x.fillText(`${fmtM(depth)} m`, 62, 270);
  x.font = '500 44px system-ui, sans-serif'; x.fillText(`I dove to the ${zone} and found`, 70, 350);
  x.font = '800 92px system-ui, sans-serif'; x.fillStyle = '#7fe3ff'; x.fillText(`${found}/${total}`, 70, 450); const fw = x.measureText(`${found}/${total}`).width;
  x.font = '500 44px system-ui, sans-serif'; x.fillStyle = '#eaf6ff'; x.fillText('creatures' + (time ? ` in ${time}` : ''), 70 + fw + 22, 445);
  x.font = '500 28px system-ui, sans-serif'; x.fillStyle = '#9fdcff'; x.fillText('How deep can you go?  cf-llc.github.io/ocean-dive', 70, 560);
  // CF LLC mark
  x.fillStyle = '#eaf6ff'; x.beginPath(); x.roundRect ? x.roundRect(900, 520, 62, 62, 14) : x.rect(900, 520, 62, 62); x.fill();
  x.fillStyle = '#03182c'; x.font = '800 30px system-ui, sans-serif'; x.textAlign = 'center'; x.fillText('CF', 931, 562);
  x.textAlign = 'left'; x.fillStyle = '#eaf6ff'; x.font = '600 22px system-ui, sans-serif'; x.fillText('CF LLC', 972, 560);
  return new Promise((res) => c.toBlob(res, 'image/png'));
}
