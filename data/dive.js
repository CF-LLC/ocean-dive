// Real-scale depth model. All depths in metres. Sources: see SOURCES.md.
export const MAX_DEPTH = 10935; // Challenger Deep, NOAA Ocean Exploration
// depth (m) -> screens of scroll after the hero. Log-ish pacing: shallow water gets more room per metre.
export const SEG = [[0, 0], [200, 4], [1000, 12], [4000, 22], [6000, 27], [MAX_DEPTH, 36]];
export const DIVE_SCREENS = 36;
export function screensAt(d) {
  for (let i = 1; i < SEG.length; i++) {
    const [d0, s0] = SEG[i - 1], [d1, s1] = SEG[i];
    if (d <= d1) return s0 + ((d - d0) / (d1 - d0)) * (s1 - s0);
  }
  return DIVE_SCREENS;
}
export function depthAt(s) {
  if (s <= 0) return 0;
  for (let i = 1; i < SEG.length; i++) {
    const [d0, s0] = SEG[i - 1], [d1, s1] = SEG[i];
    if (s <= s1) return d0 + ((s - s0) / (s1 - s0)) * (d1 - d0);
  }
  return MAX_DEPTH;
}
// Hydrostatic pressure: +1 atm per ~10.06 m of seawater (NOAA Ocean Service) plus 1 atm of air.
export const pressureAtm = (d) => 1 + d / 10.06;
// Typical open-ocean temperature profile (illustrative; varies by region and season).
const T = [[0, 20], [100, 17], [200, 13], [500, 8], [1000, 4.5], [2000, 3], [4000, 1.8], [6000, 1.5], [MAX_DEPTH, 2.4]];
export function tempAt(d) {
  for (let i = 1; i < T.length; i++) {
    const [d0, t0] = T[i - 1], [d1, t1] = T[i];
    if (d <= d1) return t0 + ((d - d0) / (d1 - d0)) * (t1 - t0);
  }
  return T[T.length - 1][1];
}
export const ZONES = [
  { id: 'sunlight', name: 'Sunlight Zone', top: 0, bottom: 200, sub: 'Epipelagic', blurb: 'Bright, warm water where most ocean life lives. Sunlight powers the plankton at the base of the food web.' },
  { id: 'twilight', name: 'Twilight Zone', top: 200, bottom: 1000, sub: 'Mesopelagic', blurb: 'Light fades to a dim blue. Many animals here glow, and billions rise toward the surface every night to feed.' },
  { id: 'midnight', name: 'Midnight Zone', top: 1000, bottom: 4000, sub: 'Bathypelagic', blurb: 'No sunlight reaches this far. The only light is made by living things. Use your light.' },
  { id: 'abyss', name: 'The Abyss', top: 4000, bottom: 6000, sub: 'Abyssopelagic', blurb: 'Near-freezing water and pressure of hundreds of atmospheres, over vast muddy plains.' },
  { id: 'hadal', name: 'Hadal Zone', top: 6000, bottom: MAX_DEPTH, sub: 'The trenches', blurb: 'Named after Hades. Deep ocean trenches, and less of it explored than the surface of the Moon.' },
];
export const zoneAt = (d) => ZONES.find((z) => d < z.bottom) || ZONES[ZONES.length - 1];
export const LANDMARKS = [
  { id: 'scuba', depth: 40, title: 'Recreational scuba limit', text: 'Most recreational divers are trained to go no deeper than 40 m (130 ft).' },
  { id: 'nitsch', depth: 214, title: 'Deepest freedive', text: 'Herbert Nitsch reached 214 m on one breath in 2007 (AIDA No Limits record).' },
  { id: 'spermroutine', depth: 610, title: 'Sperm whale hunting depth', text: 'NOAA: sperm whales routinely dive to about 2,000 ft (~610 m) for up to 45 minutes.' },
  { id: 'gabr', depth: 332, title: 'Deepest scuba dive', text: 'Ahmed Gabr reached 332.35 m in the Red Sea in 2014, the Guinness world record.' },
  { id: 'everest', depth: 2086, title: 'Everest\u2019s summit would be here', text: 'If Mount Everest (8,849 m) stood on the floor of Challenger Deep, its peak would still be about 2,086 m under water.' },
  { id: 'beaked', depth: 2992, title: 'Deepest mammal dive', text: 'A tagged Cuvier\u2019s beaked whale dove to 2,992 m off California (Schorr et al., 2014).' },
  { id: 'avg', depth: 3682, title: 'Average ocean depth', text: 'The average depth of the ocean is 3,682 m (NOAA, 2010 estimate).' },
  { id: 'titanic', depth: 3800, title: 'RMS Titanic', text: 'The wreck of Titanic rests 3,800 m (12,467 ft) down in the North Atlantic. It sank on 15 April 1912.', art: 'titanic' },
  { id: 'fish', depth: 8336, title: 'Deepest fish ever filmed', text: 'A juvenile Pseudoliparis snailfish was filmed here in the Izu-Ogasawara Trench in 2022. Below about 8,400 m, fish seem to disappear.' },
  { id: 'trieste', depth: 10916, title: 'Trieste, 1960', text: 'Jacques Piccard and Don Walsh first reached the bottom of Challenger Deep in the bathyscaphe Trieste.' },
  { id: 'challenger', depth: MAX_DEPTH, title: 'Challenger Deep', text: 'The deepest known point on Earth: about 10,935 m (35,876 ft) in the Mariana Trench (NOAA).' },
];
export const BADGES = [
  { id: 'twilight', icon: '🌒', name: 'Into the Twilight', how: 'Pass 200 m' },
  { id: 'midnight', icon: '🌑', name: 'Lights Out', how: 'Reach the Midnight Zone (1,000 m)' },
  { id: 'brave', icon: '👁️', name: 'Nerves of Steel', how: 'Meet something big in the dark', secret: true },
  { id: 'titanic', icon: '🚢', name: 'Titanic Visitor', how: 'Reach the Titanic (3,800 m)' },
  { id: 'abyss', icon: '🕳️', name: 'Abyssal Diver', how: 'Reach 4,000 m' },
  { id: 'hadal', icon: '🔱', name: 'Hadal Explorer', how: 'Reach 6,000 m' },
  { id: 'challenger', icon: '🏁', name: 'Challenger Deep', how: 'Reach 10,935 m' },
  { id: 'torch', icon: '🔦', name: 'Torchbearer', how: 'Find 5 creatures with your light' },
  { id: 'hidden', icon: '🕵️', name: 'Eagle Eye', how: 'Find every hidden creature' },
  { id: 'all', icon: '🏆', name: 'Completionist', how: 'Find every creature' },
];
