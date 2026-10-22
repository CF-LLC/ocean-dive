import photos from '../../data/photos.json';
import { CREATURES } from '../../data/creatures';
import { MODELS } from '../../data/models';
import { BASE, CF_URL } from '../../data/site';
export const metadata = { title: 'Attributions · Ocean Dive' };
const name = Object.fromEntries(CREATURES.map((c) => [c.id, c.name]));
export default function Attributions() {
  return (
    <main className="attr">
      <p><a href={`${BASE}/`}>← Back to the dive</a></p>
      <h1>Attributions &amp; licenses</h1>
      <p>Ocean Dive uses only CC0 / public-domain and CC BY assets, plus original art. Thank you to every creator below.</p>
      <h2>3D models</h2>
      <ul>{MODELS.map((m) => <li key={m.file}><b>{m.name}</b> by {m.author}, <a href={m.source}>Poly Pizza</a>, {m.license}. Optimised (Draco, WebP textures); otherwise unmodified.</li>)}</ul>
      <h2>Photos</h2>
      <ul>{Object.entries(photos).map(([id, p]) => <li key={id}><b>{name[id]}</b>: &ldquo;{p.title}&rdquo; by {p.artist || 'unknown'}, <a href={p.source}>Wikimedia Commons</a>, {p.licenseUrl ? <a href={p.licenseUrl}>{p.license}</a> : p.license}. Resized to 640 px WebP.</li>)}</ul>
      <h2>Illustrations</h2>
      <p>The 2D creature drawings, the Titanic wreck and the giant eye are original SVG art made for Ocean Dive by CF LLC.</p>
      <h2>Audio</h2>
      <p>All sound (waves, drone, deep rumble, sonar pings, whale song) is synthesized live in your browser with the Web Audio API. No recordings are used.</p>
      <h2>Facts &amp; depths</h2>
      <p>Depths and facts come from NOAA (Ocean Exploration, Ocean Service, Fisheries, Sanctuaries), MBARI, WHOI, Scripps, Guinness World Records and peer-reviewed papers. Ranges marked &ldquo;approx.&rdquo; are approximate. Pressure is estimated at 1 atm per 10.06 m plus 1 atm of air; temperature shows a typical open-ocean profile. Full list: <a href="https://github.com/CF-LLC/ocean-dive/blob/main/SOURCES.md">SOURCES.md</a>.</p>
      <h2>Code</h2>
      <p>Built with Next.js, three.js, React Three Fiber and drei (MIT). Made by <a href={CF_URL}>CF LLC</a>.</p>
    </main>
  );
}
