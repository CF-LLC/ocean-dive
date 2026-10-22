import photos from '../../data/photos.json';
import { CREATURES } from '../../data/creatures';
import { MODELS, AUDIO } from '../../data/models';
import { BASE, CF_URL } from '../../data/site';
export const metadata = { title: 'Attributions · Ocean Dive' };
const name = Object.fromEntries(CREATURES.map((c) => [c.id, c.name]));
export default function Attributions() {
  return (
    <main className="attr">
      <p><a href={`${BASE}/`}>← Back to the dive</a></p>
      <h1>Attributions &amp; licenses</h1>
      <p>Ocean Dive uses only CC0 / public-domain and CC BY assets. Thank you to every creator below.</p>
      <h2>3D models</h2>
      <ul>{MODELS.map((m) => <li key={m.file}><b>{m.name}</b> by {m.author}, <a href={m.source}>Poly Pizza</a>, {m.license}. Optimised (Draco, WebP textures); otherwise unmodified.</li>)}</ul>
      <h2>Photos</h2>
      <ul>{Object.entries(photos).map(([id, p]) => <li key={id}><b>{name[id]}</b>: &ldquo;{p.title}&rdquo; by {p.artist || 'unknown'}, <a href={p.source}>Wikimedia Commons</a>, {p.licenseUrl ? <a href={p.licenseUrl}>{p.license}</a> : p.license}. Resized to 640 px WebP.</li>)}</ul>
      <h2>Audio</h2>
      <ul>{AUDIO.map((a) => <li key={a.file}><b>{a.name}</b> by {a.author}, <a href={a.source}>Wikimedia Commons</a>, {a.license}.</li>)}</ul>
      <h2>Facts</h2>
      <p>Creature facts summarised from NOAA Fisheries, NOAA Ocean Service, Oceana, MBARI and the Smithsonian Ocean portal.</p>
      <h2>Code</h2>
      <p>Built with Next.js, three.js, React Three Fiber and drei (MIT). Made by <a href={CF_URL}>CF LLC</a>.</p>
    </main>
  );
}
