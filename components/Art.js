// Original SVG art (CF LLC, no third-party assets). Rendered inline; tiny and resolution-independent.
const g = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
export const ART = {
  spidercrab: `<svg viewBox="0 0 240 140">${g('sc','#e8834f','#a8432a')}<g fill="none" stroke="url(#sc)" stroke-width="5" stroke-linecap="round">
    <path d="M100 70 L60 40 L18 60"/><path d="M100 74 L52 70 L8 104"/><path d="M104 78 L70 100 L40 136"/><path d="M98 66 L70 22 L40 6"/>
    <path d="M140 70 L180 40 L222 60"/><path d="M140 74 L188 70 L232 104"/><path d="M136 78 L170 100 L200 136"/><path d="M142 66 L170 22 L200 6"/></g>
    <ellipse cx="120" cy="72" rx="26" ry="20" fill="url(#sc)"/><circle cx="112" cy="58" r="3" fill="#111"/><circle cx="128" cy="58" r="3" fill="#111"/>
    <path d="M104 80 q16 8 32 0" stroke="#fff6" stroke-width="2" fill="none"/></svg>`,
  barreleye: `<svg viewBox="0 0 220 120">${g('be','#3a4352','#141a24')}
    <path d="M70 62 C 100 40 170 44 200 60 C 170 76 100 82 70 62 Z" fill="url(#be)"/><path d="M200 60 l18 -14 v28 z" fill="#2a3240"/>
    <path d="M120 74 q10 16 24 18 l-6 -16 z" fill="#2a3240"/><path d="M110 46 q12 -14 26 -12 l-10 14 z" fill="#2a3240"/>
    <ellipse cx="66" cy="50" rx="42" ry="30" fill="rgba(180,240,255,.13)" stroke="rgba(190,245,255,.7)" stroke-width="1.6"/>
    <rect x="48" y="30" width="12" height="26" rx="6" fill="#4dff9a" transform="rotate(-8 54 43)"/><rect x="64" y="30" width="12" height="26" rx="6" fill="#3be08a" transform="rotate(-8 70 43)"/>
    <circle cx="40" cy="66" r="3.2" fill="#1d2430"/><circle cx="52" cy="70" r="3.2" fill="#1d2430"/><path d="M28 72 q6 4 12 2" stroke="#9bb" fill="none" stroke-width="2"/></svg>`,
  siphonophore: `<svg viewBox="0 0 1000 80" preserveAspectRatio="none"><path d="M0 40 C 120 10 220 70 340 40 S 560 10 680 40 S 880 70 1000 36" stroke="rgba(160,210,255,.55)" stroke-width="2" fill="none"/>
    ${Array.from({ length: 40 }, (_, i) => { const x = 10 + i * 24.5; const y = 40 + Math.sin(i * 0.55) * 18; return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="5" fill="rgba(140,200,255,.35)" stroke="rgba(200,235,255,.7)" stroke-width="1"/>`; }).join('')}</svg>`,
  vampire: `<svg viewBox="0 0 200 200">${g('vs','#8a1a2a','#3a0610')}
    <path d="M100 20 C 70 20 60 60 64 90 L 20 170 Q 60 150 70 182 Q 90 150 100 192 Q 110 150 130 182 Q 140 150 180 170 L 136 90 C 140 60 130 20 100 20 Z" fill="url(#vs)"/>
    <path d="M70 50 q-26 -6 -30 -26 q22 4 32 14z M130 50 q26 -6 30 -26 q-22 4 -32 14z" fill="#6a1220"/>
    <circle cx="84" cy="80" r="11" fill="#0b2a5a"/><circle cx="116" cy="80" r="11" fill="#0b2a5a"/><circle cx="86" cy="78" r="4" fill="#9fd4ff"/><circle cx="118" cy="78" r="4" fill="#9fd4ff"/>
    <g stroke="#f3d2d6" stroke-width="2">${[44, 64, 84, 116, 136, 156].map((x) => `<path d="M${x} ${120 + Math.abs(100 - x) / 3} l${(x - 100) / 12} 10"/>`).join('')}</g></svg>`,
  angler: `<svg viewBox="0 0 200 170">${g('an','#3a2f2a','#120d0b')}
    <path d="M140 20 C 130 0 100 4 96 30" stroke="#5a4a3e" stroke-width="3" fill="none"/>
    <path d="M40 90 C 40 40 120 30 160 70 C 175 86 175 110 160 120 C 120 150 40 140 40 90 Z" fill="url(#an)"/>
    <path d="M160 70 l30 -14 l-8 38 z" fill="#2a211d" transform="translate(-200 0) scale(-1 1) translate(-200 0)"/><path d="M160 96 l34 -18 v40z" fill="#241c18"/>
    <path d="M44 100 Q 80 130 120 104 L 116 124 Q 80 140 50 118 Z" fill="#0a0605"/>
    <g fill="#f4efe0">${[54, 64, 74, 84, 94, 104, 112].map((x, i) => `<path d="M${x} ${104 + i * 0.5} l4 ${i % 2 ? 12 : 9} l4 -${i % 2 ? 12 : 9}z"/>`).join('')}</g>
    <circle cx="88" cy="70" r="6" fill="#d8d0a8"/><circle cx="88" cy="70" r="2.4" fill="#000"/></svg>`,
  gulper: `<svg viewBox="0 0 300 120">
    <path d="M40 40 Q 10 60 40 90 Q 70 70 76 60 Q 70 44 40 40 Z" fill="#191a22" stroke="#33364a" stroke-width="2"/>
    <path d="M70 58 C 120 50 160 80 200 70 S 260 60 292 90" stroke="#24252f" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M200 70 S 260 60 292 90" stroke="#1d1e27" stroke-width="3" fill="none"/>
    <circle cx="64" cy="54" r="3" fill="#8fb"/><path d="M40 42 Q 30 64 40 88" stroke="#55597a" fill="none" stroke-width="1.5"/></svg>`,
  spermwhale: `<svg viewBox="0 0 420 180">${g('sw','#5c6470','#2c323b')}
    <path d="M10 60 C 10 30 40 22 150 26 C 250 30 320 70 360 96 L 410 70 L 396 108 L 410 150 L 356 118 C 300 140 200 150 120 140 C 60 134 30 126 20 110 C 12 98 10 80 10 60 Z" fill="url(#sw)"/>
    <path d="M20 110 C 40 118 70 118 96 112" stroke="#22272e" stroke-width="3" fill="none"/>
    <g fill="#e9e6da">${Array.from({ length: 7 }, (_, i) => `<path d="M${30 + i * 10} 112 l3 6 l3 -6z"/>`).join('')}</g>
    <path d="M170 130 q20 26 50 26 q-14 -20 -16 -30z" fill="#3a414b"/><circle cx="118" cy="84" r="3.2" fill="#111"/>
    <g fill="none" stroke="#7a838f" stroke-width="1.4" opacity=".7"><circle cx="200" cy="60" r="5"/><circle cx="214" cy="70" r="4"/><circle cx="190" cy="78" r="5"/><circle cx="240" cy="52" r="4"/></g></svg>`,
  squid: `<svg viewBox="0 0 320 200">${g('gs','#c25a3c','#7a2c1c')}
    <path d="M320 90 L 250 60 C 210 56 190 76 180 96 C 190 116 210 136 250 132 Z" fill="url(#gs)"/><path d="M320 90 l-30 -30 l0 60z" fill="#a8452e"/>
    <g fill="none" stroke="#b44b33" stroke-linecap="round"><path d="M182 92 C 140 70 90 40 40 60 C 20 70 18 90 34 96" stroke-width="7"/><path d="M182 100 C 140 120 80 150 30 140 C 10 136 6 120 20 112" stroke-width="7"/>
    <path d="M182 96 C 120 96 80 80 10 90" stroke-width="5"/><path d="M182 98 C 130 110 90 118 50 112" stroke-width="5"/><path d="M182 94 C 130 84 100 66 70 50" stroke-width="5"/></g>
    <circle cx="200" cy="96" r="12" fill="#f3efe2"/><circle cx="202" cy="96" r="6" fill="#111"/></svg>`,
  isopod: `<svg viewBox="0 0 200 120">${g('ip','#d8c7b4','#9a8673')}<ellipse cx="100" cy="64" rx="80" ry="42" fill="url(#ip)"/>
    ${Array.from({ length: 7 }, (_, i) => `<path d="M${40 + i * 20} 26 q-6 38 0 76" stroke="#7d6a58" stroke-width="2" fill="none"/>`).join('')}
    <path d="M24 50 q-20 -20 -22 -40 M26 56 q-24 -8 -26 -22" stroke="#bfae9a" stroke-width="2.5" fill="none"/><ellipse cx="30" cy="60" rx="5" ry="8" fill="#222"/></svg>`,
  fangtooth: `<svg viewBox="0 0 200 130">${g('ft','#2c2424','#0d0909')}
    <path d="M30 70 C 30 30 90 24 130 50 C 150 62 170 64 190 56 L 186 88 C 170 80 150 82 130 92 C 90 116 30 110 30 70 Z" fill="url(#ft)"/>
    <path d="M30 78 L 84 82 L 80 104 Q 50 104 34 94 Z" fill="#050303"/>
    <g fill="#f0ece0"><path d="M42 78 l3 24 l4 -24z"/><path d="M62 80 l3 22 l4 -22z"/><path d="M50 98 l3 -18 l3 18z"/><path d="M72 100 l2 -16 l3 16z"/></g>
    <circle cx="70" cy="58" r="5" fill="#6a6252"/><circle cx="70" cy="58" r="2" fill="#000"/></svg>`,
  dumbo: `<svg viewBox="0 0 200 180">${g('du','#ffd2c4','#e08f86')}
    <path d="M60 70 C 60 20 140 20 140 70 C 140 96 120 110 100 110 C 80 110 60 96 60 70 Z" fill="url(#du)"/>
    <path d="M62 58 q-36 -18 -46 6 q24 10 46 4z M138 58 q36 -18 46 6 q-24 10 -46 4z" fill="#f3a99c"/>
    <path d="M64 100 Q 40 150 30 170 Q 70 150 100 172 Q 130 150 170 170 Q 160 150 136 100 Z" fill="#f0b1a5" opacity=".9"/>
    <circle cx="84" cy="78" r="6" fill="#2a1010"/><circle cx="116" cy="78" r="6" fill="#2a1010"/></svg>`,
  tripod: `<svg viewBox="0 0 220 200">${g('tp','#5e4a3c','#2e231c')}
    <path d="M40 80 C 60 66 150 64 190 78 C 150 90 60 92 40 80 Z" fill="url(#tp)"/><path d="M190 78 l22 -10 v22z" fill="#3a2c22"/>
    <g stroke="#a8927e" stroke-width="2.5" fill="none"><path d="M90 88 L 70 196"/><path d="M110 88 L 130 196"/><path d="M190 84 L 200 196"/>
    <path d="M60 70 q-20 -40 -10 -64 M66 70 q-10 -40 10 -60" stroke-width="1.5"/></g><circle cx="52" cy="78" r="2.4" fill="#000"/></svg>`,
  seapig: `<svg viewBox="0 0 200 130">${g('sp','rgba(255,190,200,.9)','rgba(220,120,150,.8)')}
    <path d="M20 90 C 20 50 170 40 184 84 C 190 104 170 110 100 110 C 40 110 20 106 20 90 Z" fill="url(#sp)"/>
    <g stroke="rgba(255,200,210,.9)" stroke-width="5" stroke-linecap="round">${[40, 62, 84, 106, 128, 150].map((x) => `<path d="M${x} 108 l-4 14"/>`).join('')}</g>
    <path d="M60 56 q-6 -30 6 -40 M78 52 q2 -30 16 -36" stroke="rgba(255,200,210,.9)" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
  snailfish: `<svg viewBox="0 0 220 110">${g('sf','rgba(255,220,225,.85)','rgba(230,170,185,.6)')}
    <path d="M20 56 C 20 26 80 22 110 44 C 140 60 180 54 214 60 C 180 72 140 70 110 76 C 80 92 20 86 20 56 Z" fill="url(#sf)"/>
    <path d="M110 44 C 140 52 180 54 214 60" stroke="rgba(255,240,245,.7)" fill="none"/><circle cx="44" cy="50" r="4" fill="#1a1012"/>
    <path d="M40 74 q20 6 40 0" stroke="rgba(200,120,140,.6)" stroke-width="2" fill="none"/></svg>`,
  amphipod: `<svg viewBox="0 0 200 120">${g('am','#fbf5ea','#d7c9b0')}
    <path d="M30 70 C 40 30 150 26 180 60 C 160 80 60 96 30 70 Z" fill="url(#am)"/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M${50 + i * 15} 38 q-4 22 0 44" stroke="#c8b796" stroke-width="1.5" fill="none"/>`).join('')}
    <g stroke="#e4d8c2" stroke-width="2" fill="none"><path d="M36 64 q-26 -30 -34 -50"/><path d="M70 86 l-6 20"/><path d="M100 88 l0 22"/><path d="M130 82 l6 20"/></g><circle cx="44" cy="58" r="3" fill="#333"/></svg>`,
  xeno: `<svg viewBox="0 0 160 120"><g fill="#b9a98a" stroke="#7f7258" stroke-width="2">
    <path d="M20 110 C 10 80 30 60 50 70 C 50 40 80 30 92 56 C 110 30 140 50 130 80 C 150 90 146 110 140 112 Z"/>
    <path d="M50 70 q10 20 0 40 M92 56 q-6 30 4 54 M130 80 q-16 10 -10 30" fill="none"/></g>
    <g fill="#5a4f3c">${[[40, 90], [70, 80], [100, 92], [116, 70], [60, 100], [126, 98]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g></svg>`,
  titanic: `<svg viewBox="0 0 600 220"><path d="M0 200 Q 300 170 600 200 V220 H0Z" fill="#3a3428"/>
    <path d="M40 190 L 80 120 L 420 120 L 470 170 L 480 196 Z" fill="#3a2a22" stroke="#6a5240" stroke-width="2"/>
    <path d="M80 120 L 420 120 L 430 130 L 74 130 Z" fill="#5c4434"/>
    <rect x="150" y="96" width="160" height="24" fill="#4a382c"/><rect x="200" y="56" width="26" height="40" fill="#5a3a20" transform="rotate(8 213 76)"/>
    ${Array.from({ length: 14 }, (_, i) => `<circle cx="${110 + i * 22}" cy="146" r="3.2" fill="#1a120e"/>`).join('')}
    <path d="M300 120 l30 -60 M330 60 l6 4" stroke="#6a5240" stroke-width="3"/><g fill="#8a4f2a" opacity=".7"><path d="M120 190 q4 -20 10 0z"/><path d="M260 192 q6 -26 12 0z"/><path d="M380 186 q4 -18 8 0z"/></g></svg>`,
  eye: `<svg viewBox="0 0 400 260"><defs><radialGradient id="ir" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000"/><stop offset=".42" stop-color="#000"/><stop offset=".46" stop-color="#d7a24a"/><stop offset=".8" stop-color="#7a3a10"/><stop offset="1" stop-color="#2a0e04"/></radialGradient></defs>
    <path d="M10 130 Q 200 -40 390 130 Q 200 300 10 130 Z" fill="#3b0f0a"/><path d="M40 130 Q 200 10 360 130 Q 200 250 40 130 Z" fill="#e9dcc4"/>
    <circle cx="200" cy="130" r="98" fill="url(#ir)"/><circle cx="170" cy="100" r="16" fill="#fff" opacity=".85"/></svg>`,
  frilled: `<svg viewBox="0 0 320 90">${g('fr','#6b5a4c','#3a2e26')}<path d="M10 40 C 30 22 80 24 140 34 C 220 46 270 40 316 30 C 290 54 220 62 140 58 C 80 56 30 60 10 40 Z" fill="url(#fr)"/>
    ${[40, 50, 60, 70, 80, 90].map((x) => `<path d="M${x} 30 q6 14 0 28" stroke="#c08a7a" stroke-width="3" fill="none"/>`).join('')}<path d="M10 40 l22 6" stroke="#111" stroke-width="2"/><circle cx="24" cy="34" r="3" fill="#cfe"/></svg>`,
  blobfish: `<svg viewBox="0 0 220 120">${g('bf','#f2c3bc','#c98a84')}<path d="M20 64 C 20 20 120 14 150 50 C 170 56 200 50 214 44 L 210 84 C 190 78 170 76 150 80 C 120 110 20 108 20 64 Z" fill="url(#bf)"/>
    <circle cx="62" cy="52" r="5" fill="#222"/><path d="M30 78 q20 8 40 2" stroke="#9a5f5a" stroke-width="3" fill="none"/></svg>`,
  greenland: `<svg viewBox="0 0 400 140">${g('gr','#5e6670','#2f343a')}<path d="M10 70 C 20 40 120 30 230 40 C 300 46 340 56 360 60 L 396 30 L 384 70 L 396 112 L 358 82 C 300 96 200 104 110 98 C 50 94 14 90 10 70 Z" fill="url(#gr)"/>
    <path d="M180 40 l20 -18 l10 20z M210 98 l14 20 l6 -22z" fill="#3a4048"/><circle cx="50" cy="62" r="4" fill="#aab4bc"/><path d="M50 62 l10 -6" stroke="#d8e" stroke-width="1"/></svg>`,
  yeti: `<svg viewBox="0 0 200 130">${g('ye','#f4eee2','#cbbfa8')}<ellipse cx="100" cy="74" rx="38" ry="26" fill="url(#ye)"/>
    <g stroke="#e9e0cc" stroke-width="9" stroke-linecap="round" fill="none"><path d="M66 64 L 30 30 L 10 40"/><path d="M134 64 L 170 30 L 190 40"/></g>
    <g stroke="#fffaf0" stroke-width="1.2">${Array.from({ length: 18 }, (_, i) => `<path d="M${14 + i * 10} ${i < 9 ? 34 + i * 2 : 34 + (17 - i) * 2} l${i % 2 ? 4 : -4} 12"/>`).join('')}</g>
    <g stroke="#d8ccb4" stroke-width="4">${[74, 90, 110, 126].map((x) => `<path d="M${x} 96 l${(x - 100) / 3} 26"/>`).join('')}</g></svg>`,
  cookiecutter: `<svg viewBox="0 0 220 80">${g('cc','#7a6650','#3c3226')}<path d="M10 40 C 20 24 90 22 150 30 L 210 20 L 200 40 L 210 60 L 150 50 C 90 58 20 56 10 40 Z" fill="url(#cc)"/>
    <path d="M30 46 C 50 54 70 54 90 48" stroke="#211a12" stroke-width="6"/><circle cx="26" cy="36" r="4" fill="#6fe8c4"/></svg>`,
  firefly: `<svg viewBox="0 0 160 220">${g('fs','#6a4a8a','#2c1a40')}<path d="M80 6 C 110 30 112 90 100 130 L 60 130 C 48 90 50 30 80 6 Z" fill="url(#fs)"/>
    <g stroke="#7a5a9a" stroke-width="4" fill="none" stroke-linecap="round"><path d="M64 130 q-20 40 -30 80"/><path d="M74 130 q-6 40 -10 84"/><path d="M86 130 q6 40 10 84"/><path d="M96 130 q20 40 30 80"/></g>
    <circle cx="68" cy="118" r="6" fill="#111"/><circle cx="92" cy="118" r="6" fill="#111"/></svg>`,
};
