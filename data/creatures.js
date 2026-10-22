// y = world depth (camera travels 0 → -104). side: which side of screen it swims on.
export const ZONES = [
  { id: 'sunlight', name: 'Sunlight Zone', range: '0 – 200 m', blurb: 'Warm, bright water where most ocean life lives. Sunlight powers kelp forests and plankton, the base of the food web.' },
  { id: 'twilight', name: 'Twilight Zone', range: '200 – 1,000 m', blurb: 'Light fades to a dim blue. Many animals here glow, and billions migrate up to feed every night.' },
  { id: 'deep', name: 'Deep (Midnight) Zone', range: '1,000 m +', blurb: 'No sunlight at all. Cold, crushing pressure, and the only light comes from living things.' },
];
export const BANDS = [
  { id: 'surface', zone: 'sunlight', label: 'Surface', depth: '0 – 20 m', y: -8, text: 'Sunbeams ripple through the shallows. Dolphins hunt in pods and ocean sunfish bask near the top.' },
  { id: 'kelp', zone: 'sunlight', label: 'Kelp forest', depth: '5 – 40 m', y: -24, text: 'Giant kelp towers up from the rocks, sheltering fish and grazing turtles. Moon jellies drift on the swell.' },
  { id: 'open', zone: 'twilight', label: 'Upper twilight', depth: '200 – 500 m', y: -46, text: 'The blue dims. Swordfish dive down here to hunt by day, and lanternfish wait for nightfall.' },
  { id: 'dim', zone: 'twilight', label: 'Lower twilight', depth: '500 – 1,000 m', y: -66, text: 'Barely any light. Sharks like the goblin shark cruise slowly, and crown jellies flash blue when threatened.' },
  { id: 'midnight', zone: 'deep', label: 'Midnight zone', depth: '1,000 – 4,000 m', y: -88, text: 'Pitch black. Anglerfish dangle glowing lures and giant squid hunt with the largest eyes in the animal kingdom.' },
];
export const FLOOR_Y = -106;
export const CREATURES = [
  { id: 'dolphin', name: 'Common bottlenose dolphin', sci: 'Tursiops truncatus', band: 'surface', depth: 'Surface – 50 m (dives to ~300 m)', model: 'dolphin', size: 2.6, x: 3.2, dy: 1.2, speed: 1.4, color: '#7d93a6',
    facts: ['Each dolphin develops its own "signature whistle" that works a bit like a name.', 'They find prey with echolocation, clicking and listening for the echoes.', 'Bottlenose dolphins can live for 40 – 60 years.'] },
  { id: 'sunfish', name: 'Ocean sunfish (mola)', sci: 'Mola mola', band: 'surface', depth: 'Surface – 600 m', model: 'sunfish', size: 2.4, yaw: Math.PI / 2, x: -3, dy: -2, speed: 0.4, color: '#9aa7b0',
    facts: ['One of the heaviest bony fish on Earth: adults can top 1,000 kg.', 'They "sunbathe" on their side at the surface to warm up after deep dives.', 'A single female can carry around 300 million eggs.'] },
  { id: 'turtle', name: 'Green sea turtle', sci: 'Chelonia mydas', band: 'kelp', depth: 'Surface – 40 m', model: 'turtle', size: 2.0, x: 3, dy: 0.8, speed: 0.6, color: '#5f7f3a',
    facts: ['Named for the green colour of their fat, which comes from their plant-based diet.', 'Adults graze on seagrass and algae, keeping seagrass beds healthy.', 'Females return to the beach where they hatched to lay their own eggs.'] },
  { id: 'kelp', name: 'Giant kelp', sci: 'Macrocystis pyrifera', band: 'kelp', depth: '5 – 40 m', model: 'kelp', size: 7, x: -4, dy: -3, speed: 0, color: '#5a8a2a',
    facts: ['Giant kelp can grow up to 60 cm in a single day.', 'Gas-filled bulbs called pneumatocysts float the fronds up toward the light.', 'Kelp forests shelter hundreds of species, from fish to sea otters.'] },
  { id: 'moonjelly', name: 'Moon jellyfish', sci: 'Aurelia aurita', band: 'kelp', depth: 'Surface – 30 m', model: 'jelly', size: 1.1, x: -1.5, dy: 3, speed: 0.25, color: '#d9c8ff', jelly: true,
    facts: ['Moon jellies have no brain, heart, or bones.', 'Their four pale rings are actually their reproductive organs.', 'They are about 95% water.'] },
  { id: 'swordfish', name: 'Swordfish', sci: 'Xiphias gladius', band: 'open', depth: 'Surface – 600 m+', model: 'swordfish', size: 3.2, x: 3, dy: 0.5, speed: 2.2, color: '#6b6f80',
    facts: ['They dive into the cold twilight zone by day to hunt squid.', 'A special organ heats their eyes and brain so they work in cold water.', 'The "sword" is used to slash at prey, not to spear it.'] },
  { id: 'lantern', name: 'Lanternfish', sci: 'Myctophidae (e.g. Benthosema glaciale)', band: 'open', depth: '300 – 1,500 m (rises at night)', model: 'fish', size: 0.5, x: -2.5, dy: -1.5, speed: 1, color: '#2bf5c6', glow: true, school: 9,
    facts: ['Rows of light organs called photophores line their bodies.', 'They make one of the biggest daily migrations on Earth, rising hundreds of metres every night.', 'Lanternfish may make up over half of all deep-sea fish by weight.'] },
  { id: 'goblin', name: 'Goblin shark', sci: 'Mitsukurina owstoni', band: 'dim', depth: '270 – 1,300 m', model: 'goblin', size: 3.4, x: 2.8, dy: 0, speed: 0.7, color: '#c9a1a1',
    facts: ['Its jaws can shoot forward like a slingshot to snatch prey.', 'Its pink colour comes from blood vessels showing through translucent skin.', 'Sometimes called a "living fossil": its lineage goes back about 125 million years.'] },
  { id: 'atolla', name: 'Crown jellyfish (Atolla)', sci: 'Atolla wyvillei', band: 'dim', depth: '500 – 4,000 m', model: 'jelly', size: 1.2, x: -2.6, dy: -2.5, speed: 0.2, color: '#ff3355', jelly: true, glow: true,
    facts: ['When attacked it sets off a spinning ring of blue light, the "alarm jelly" display.', 'The flashing may attract bigger predators that eat its attacker.', 'Its deep red body is almost invisible in water where red light never reaches.'] },
  { id: 'angler', name: 'Deep-sea anglerfish', sci: 'Ceratioidei', band: 'midnight', depth: '1,000 – 4,000 m', model: 'angler', size: 2.2, x: 2.6, dy: 0.5, speed: 0.35, color: '#4a3b35', lure: true,
    facts: ['The glowing lure is filled with light-making bacteria.', 'In some species the tiny male fuses to the female for life.', 'They can swallow prey up to twice their own size.'] },
  { id: 'squid', name: 'Giant squid', sci: 'Architeuthis dux', band: 'midnight', depth: '300 – 1,000 m+', model: 'squid', size: 6, x: -3.2, dy: -2.5, speed: 0.4, color: '#a2452e',
    facts: ['Its eyes are about the size of dinner plates, the largest of any animal except the colossal squid.', 'Adults can reach 12 – 13 m long, tentacles included.', 'It was first filmed alive in its deep habitat only in 2012.'] },
];
