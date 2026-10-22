import { ZONES } from './zones';
import Scene from '../components/SceneLoader';
export default function Page() {
  return (
    <main>
      <Scene />
      <header className="hero">
        <h1>Ocean Dive</h1>
        <p>Scroll to descend from the sunlit surface into the midnight deep.</p>
        <span className="cue" aria-hidden="true">↓</span>
      </header>
      {ZONES.map((z) => (
        <section key={z.id} id={z.id} className="zone">
          <div className="card">
            <span className="depth">{z.depth}</span>
            <h2>{z.name}</h2>
            <p>{z.text}</p>
          </div>
        </section>
      ))}
      <footer className="foot">
        <p>Made by <a href="https://cf-llc.github.io/?utm_source=oceandive&utm_medium=site">CF LLC</a> — fast, immersive web experiences.</p>
        <p className="small">Facts: NOAA Fisheries, NOAA Ocean Service, Oceana, MBARI.</p>
      </footer>
    </main>
  );
}
