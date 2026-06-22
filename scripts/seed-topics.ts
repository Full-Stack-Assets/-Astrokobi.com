/**
 * Curated evergreen space & astronomy topics for the seed/backfill runner
 * (scripts/seed.ts). Unlike the hourly pipeline — which writes about whatever is
 * trending right now — these are timeless explainers that stand up a real back
 * catalog on demand. Edit freely: add, remove, or reorder. Order matters only
 * for date spreading (earlier = more recent publish date by default).
 *
 * The LLM assigns each post a category from siteConfig.categories
 * (news · missions · astronomy · astrophysics · spaceflight · explainers).
 */
export const SEED_TOPICS: string[] = [
  // ── The solar system ─────────────────────────────────────────────
  'What is the Sun made of and how does it produce energy',
  'The solar cycle and how sunspots and solar flares work',
  'Mercury: the smallest planet and its extreme temperature swings',
  'Why Venus is the hottest planet in the solar system',
  'How the Moon formed and why it always shows Earth the same face',
  'Mars: the search for past water and life on the red planet',
  'Jupiter: the largest planet and its Great Red Spot',
  "Jupiter's moons: Io, Europa, Ganymede, and Callisto",
  "Saturn's rings: what they are made of and how they formed",
  'Titan: Saturn’s moon with lakes of liquid methane',
  'Why Uranus rotates on its side',
  'Neptune: the windiest planet in the solar system',
  'Pluto and why it was reclassified as a dwarf planet',
  'The asteroid belt between Mars and Jupiter',
  'The Kuiper Belt and the icy worlds beyond Neptune',
  'The Oort Cloud and the origin of long-period comets',
  'What comets are and why they grow tails',
  'How meteor showers happen and the best ones to watch',
  'The difference between meteoroids, meteors, and meteorites',
  'Could there be a Planet Nine in the outer solar system',

  // ── Stars and stellar evolution ──────────────────────────────────
  'How stars form inside giant molecular clouds',
  'The life cycle of a star from birth to death',
  'What happens when a massive star explodes as a supernova',
  'Neutron stars: the densest objects we can observe',
  'Pulsars: the cosmic lighthouses of the universe',
  'White dwarfs and the fate of Sun-like stars',
  'Red giants: what happens when a star runs out of fuel',
  'Brown dwarfs: the failed stars between planets and stars',
  'Binary star systems and how they interact',
  "What determines a star's color and temperature",
  'The Hertzsprung-Russell diagram explained',
  'Globular clusters: ancient swarms of stars',
  'Variable stars and why their brightness changes',
  'Betelgeuse and the question of when it will go supernova',

  // ── Black holes and extreme physics ──────────────────────────────
  'What is a black hole and how do they form',
  'Supermassive black holes at the centers of galaxies',
  'The first image of a black hole from the Event Horizon Telescope',
  'Hawking radiation and whether black holes evaporate',
  'What would happen if you fell into a black hole',
  'Gravitational waves and how LIGO detects them',
  'Quasars: the brightest objects in the universe',
  'Gamma-ray bursts: the most energetic explosions known',
  'The event horizon and the point of no return',

  // ── Galaxies and cosmology ───────────────────────────────────────
  'The Milky Way: our home galaxy explained',
  'The Andromeda galaxy and its collision course with the Milky Way',
  'Types of galaxies: spiral, elliptical, and irregular',
  'What is dark matter and why do we think it exists',
  'Dark energy and the accelerating expansion of the universe',
  'The Big Bang theory and the origin of the universe',
  'The cosmic microwave background: the afterglow of the Big Bang',
  'How big is the observable universe',
  'Redshift and how we know the universe is expanding',
  'The age of the universe and how we measure it',
  'The fate of the universe: heat death, big rip, or big crunch',
  'Cosmic inflation in the first moments of the universe',
  'The cosmic web: the largest structures in the universe',
  "Hubble's law and the expanding universe",

  // ── Exoplanets and astrobiology ──────────────────────────────────
  'What are exoplanets and how do we find them',
  'The transit method for detecting exoplanets',
  'The habitable zone and the search for Earth-like worlds',
  'The search for extraterrestrial life in the solar system',
  'Europa and Enceladus: ocean worlds that could host life',
  'The Drake equation and estimating alien civilizations',
  'The Fermi paradox: where is everybody',
  'Biosignatures: how we would detect life on another planet',
  'Extremophiles and what they tell us about life elsewhere',
  'TRAPPIST-1 and its seven Earth-sized planets',

  // ── Telescopes and instruments ───────────────────────────────────
  'How the James Webb Space Telescope sees the early universe',
  'The Hubble Space Telescope and its greatest discoveries',
  'How telescopes work: refractors versus reflectors',
  'Radio astronomy and what it reveals about the universe',
  'Spectroscopy: how astronomers read starlight',
  'Adaptive optics and how telescopes beat the atmosphere',
  'The Extremely Large Telescope and the future of ground astronomy',
  'Why we put telescopes in space',
  'Interferometry: combining many telescopes into one',
  'Seeing the invisible universe in infrared, X-ray, and radio',

  // ── Spaceflight and missions ─────────────────────────────────────
  "How rockets work and Newton's third law of motion",
  'The tyranny of the rocket equation explained',
  'Orbital mechanics: how satellites stay in orbit',
  'What Lagrange points are and why missions use them',
  'Gravity assists: how spacecraft slingshot around planets',
  'How SpaceX lands and reuses Falcon 9 rockets',
  'Starship and the goal of fully reusable spaceflight',
  "NASA's Artemis program and the return to the Moon",
  'The Apollo program and how we first landed on the Moon',
  "Voyager 1 and 2: humanity's farthest spacecraft",
  'The International Space Station and life in microgravity',
  'The Perseverance rover and the search for life on Mars',
  'Ion propulsion and the future of deep-space travel',
  'How spacecraft survive the heat of atmospheric reentry',
  'Low Earth orbit, geostationary orbit, and how satellites are placed',

  // ── Amateur astronomy and the history of the field ───────────────
  'How to start stargazing without a telescope',
  'Light pollution and why it is erasing the night sky',
  'How to choose your first telescope',
  "Kepler's laws of planetary motion explained",
  'How parallax measures the distance to nearby stars',
  'What a light-year actually measures',
  'The constellations and how to find them in the night sky',
  'Astrophotography basics for beginners',
  'How Galileo changed astronomy with the first telescope',
  'The Copernican revolution and the Sun-centered solar system',
];
