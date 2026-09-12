export type Category =
  | 'Command'
  | 'Propulsion'
  | 'Power'
  | 'Habitat'
  | 'Life Support'
  | 'Structure & Defense';

export interface CameraSpot {
  position: [number, number, number];
  target: [number, number, number];
}

export interface ShipSystem {
  id: string;
  name: string;
  category: Category;
  short: string;
  description: string;
  specs: [string, string][];
  label: [number, number, number];
  camera: CameraSpot;
  cutaway?: boolean;
}

export const SHIP = {
  name: 'ISV MERIDIAN ARK',
  registry: 'GSV-07 · Alcubierre-class Generation Ship',
  length: '1,200 m',
  beam: '900 m (nacelle span)',
  mass: '2.4 million tonnes (fuelled)',
  crew: '4,200 colonists · 12 generations rated',
  cruise: '0.08 c (fusion torch) · FTL bursts via warp field',
  scale: '1 scene unit = 15 m',
};

export const SYSTEMS: ShipSystem[] = [
  // ---------------- COMMAND ----------------
  {
    id: 'bridge',
    name: 'Bridge & Flight Deck',
    category: 'Command',
    short: 'Primary flight control, navigation and helm.',
    description:
      'Forward command deck behind a triple-layer aluminium-oxynitride canopy. Two pilots fly the ship through fly-by-light controls; a holographic astrogation table plots trajectories using pulsar timing navigation (X-ray pulsars as galactic GPS). Inertial guidance is provided by ring-laser gyros and cold-atom interferometers.',
    specs: [
      ['Crew stations', '7 (helm, nav, ops, eng, comms, science, captain)'],
      ['Navigation', 'Pulsar timing + star tracker + atom interferometry'],
      ['Canopy', 'ALON transparent ceramic, 40 cm, self-healing coat'],
      ['Backup', 'CIC on Deck 1 mirrors all controls'],
    ],
    label: [32, 4, 0],
    camera: { position: [44, 7, 12], target: [32, 1, 0] },
    cutaway: true,
  },
  {
    id: 'cic',
    name: 'Combat Information Center',
    category: 'Command',
    short: 'Ship-wide situational awareness and ship AI core.',
    description:
      'Redundant command node on Deck 1. Hosts the ship-mind cluster — radiation-hardened photonic processors triple-modular-redundant with majority voting. Crew here manage resource budgets, generational governance records, and the century-long mission plan.',
    specs: [
      ['Compute', '3× photonic clusters, TMR voted'],
      ['Data vault', 'DNA-storage archive, 200 PB, 1,000-yr half-life'],
      ['Governance', 'Council chamber, mission charter archive'],
    ],
    label: [24, 5, 0],
    camera: { position: [34, 10, 14], target: [24, 1.5, 0] },
    cutaway: true,
  },
  {
    id: 'sensors',
    name: 'Sensor Dome & Telescope Array',
    category: 'Command',
    short: 'Long-range optical / IR / LIDAR sensing.',
    description:
      'Segmented 12 m infrared telescope plus forward LIDAR for debris tracking. At 0.08 c the ship must detect gram-sized particles thousands of km ahead; LIDAR returns cue the deflector coil and point-defense lasers.',
    specs: [
      ['Telescope', '12 m segmented IR/visible'],
      ['LIDAR range', '30,000 km (10 g particle)'],
      ['Debris response', 'Deflector charge-up in < 1 s'],
    ],
    label: [21, 6, 0],
    camera: { position: [30, 12, 10], target: [21, 3.5, 0] },
  },
  {
    id: 'comms',
    name: 'Laser Communications Array',
    category: 'Command',
    short: 'Optical uplink to origin system and colony fleet.',
    description:
      'Phased-array laser transmitter with a 4 m gimballed dish for RF backup. Optical comms carry Tbps at short range; across light-years the link degrades to kbps, so the ship carries a full civilization data archive rather than relying on downloads.',
    specs: [
      ['Optical TX', '1.55 µm, 200 kW phased array'],
      ['RF dish', '4 m Ka-band, 20 kW'],
      ['Light-lag', 'Years — used for archival sync only'],
    ],
    label: [-19, 8, 0],
    camera: { position: [-20, 12, 15], target: [-20, 6, 0] },
  },

  // ---------------- PROPULSION ----------------
  {
    id: 'warpring',
    name: 'Alcubierre Warp Ring',
    category: 'Propulsion',
    short: 'Toroidal field generator that contracts space ahead and expands it behind.',
    description:
      'Based on the Alcubierre–White metric: a toroidal distribution of negative energy density warps spacetime so the ship rides a bubble of flat space. The ship never exceeds c locally — space itself moves. The 570 m ring houses 16 Casimir-cavity emitters that generate the required negative vacuum energy. Warp is used in short bursts; interstellar cruise is done on fusion.',
    specs: [
      ['Ring diameter', '570 m, oblate for reduced energy'],
      ['Emitters', '16 Casimir-cavity negative-energy nodes'],
      ['Field geometry', 'Alcubierre–White thick-shell bubble'],
      ['Physics status', 'Theoretical (GR solution, exotic matter required)'],
    ],
    label: [-18, 21, 0],
    camera: { position: [-42, 20, 40], target: [-18, 0, 0] },
  },
  {
    id: 'warpcore',
    name: 'Exotic Energy Core',
    category: 'Propulsion',
    short: 'Generates and stores the negative-energy field feeding the ring.',
    description:
      'Vertical confinement column where dynamic Casimir effect chambers pump the vacuum state. Squeezed-light states are stored in a superconducting resonator stack and released along four waveguides to the ring emitters. The core sits at the ship’s mass center-aft to keep the bubble wall away from the habitat.',
    specs: [
      ['Method', 'Dynamic Casimir / squeezed vacuum'],
      ['Waveguides', '4 × cryogenic niobium'],
      ['Charge time', '18 minutes to bubble threshold'],
    ],
    label: [-17.5, 6, 0],
    camera: { position: [-17.5, 4, 17], target: [-17.6, 0, 0] },
    cutaway: true,
  },
  {
    id: 'nacelles',
    name: 'Field Nacelles',
    category: 'Propulsion',
    short: 'Wing-tip coil stacks that shape and stabilise the warp bubble.',
    description:
      'Each nacelle carries six superconducting field coils that shape the bubble wall and keep it from collapsing onto the habitat rings. Their blue glow is Cherenkov-like radiation from the coil cryostat plasma windows. The coils also double as magnetic-sail elements for deceleration against the interstellar medium.',
    specs: [
      ['Coils per nacelle', '6 × YBCO superconducting'],
      ['Field strength', '22 T peak'],
      ['Secondary role', 'Magnetic sail (braking)'],
    ],
    label: [0, 4, 28],
    camera: { position: [14, 10, 44], target: [0, 0, 28] },
  },
  {
    id: 'torch',
    name: 'Fusion Torch Drive',
    category: 'Propulsion',
    short: 'Magnetic nozzles exhausting fusion plasma at 4% of light speed.',
    description:
      'Three magnetic nozzles expand D-He3 fusion plasma directly into thrust — no heat engine in the loop. Exhaust velocity of ~12,000 km/s gives the ship a specific impulse over one million seconds. Sustained 0.02 g acceleration for 4 years reaches cruise; the same burn decelerates at the target.',
    specs: [
      ['Thrust', '3 × 1.2 MN'],
      ['Exhaust velocity', '12,000 km/s (Isp ≈ 1.2 M s)'],
      ['Acceleration', '0.02 g sustained'],
      ['Δv budget', '0.2 c total'],
    ],
    label: [-34, 5, 0],
    camera: { position: [-52, 10, 22], target: [-33, 0, 0] },
  },
  {
    id: 'rcs',
    name: 'Attitude Control (Hall Thrusters)',
    category: 'Propulsion',
    short: 'Ion thruster clusters for pointing and ring torque trim.',
    description:
      'Krypton Hall-effect thruster quads on the wingtips, nose and stern. They cancel residual torque from the counter-rotating rings and keep the telescope pointed within micro-radians.',
    specs: [
      ['Clusters', '8 quads'],
      ['Propellant', 'Krypton, 60 t'],
      ['Isp', '2,800 s'],
    ],
    label: [42, 2, 6],
    camera: { position: [52, 6, 16], target: [42, 0, 5] },
  },

  // ---------------- POWER ----------------
  {
    id: 'reactor',
    name: 'D-He3 Fusion Reactor',
    category: 'Power',
    short: 'Aneutronic magnetic-confinement reactor — 12 GW thermal.',
    description:
      'A field-reversed-configuration (FRC) toroidal reactor burning deuterium and helium-3. The reaction D + He-3 → He-4 + p releases 18.3 MeV per event with almost no neutrons, so the hull needs far less shielding. Charged products are extracted by direct energy conversion at ~70% efficiency and exhausted through the torch nozzles.',
    specs: [
      ['Fuel', 'Deuterium + Helium-3'],
      ['Output', '12 GW thermal / 8 GW electric'],
      ['Confinement', 'FRC toroid, 12 HTS coils'],
      ['Plasma temp', '~1 billion K'],
    ],
    label: [-22, 6, 0],
    camera: { position: [-24, 3, 21], target: [-22.5, 0, 0] },
    cutaway: true,
  },
  {
    id: 'tanks',
    name: 'Cryogenic Fuel Tanks',
    category: 'Power',
    short: 'Deuterium & helium-3 storage at 20 K.',
    description:
      'Multi-layer-insulated spherical tanks with active cryocoolers holding fuel for a 120-year mission. Helium-3 is scarce, so the ship also carries a lunar-regolith-style extraction plant to mine it from gas-giant atmospheres at the destination.',
    specs: [
      ['Deuterium', '90,000 t'],
      ['Helium-3', '30,000 t'],
      ['Boil-off', '< 0.01% / year'],
    ],
    label: [-28, 6, 0],
    camera: { position: [-31, 4, 19], target: [-27.6, 0, 0] },
    cutaway: true,
  },
  {
    id: 'radiators',
    name: 'Thermal Radiator Fins',
    category: 'Power',
    short: 'Rejects waste heat to space — the only way to cool in vacuum.',
    description:
      'Space has no air to cool with; every watt of waste heat must be radiated. Four 150 m carbon-carbon fins carry liquid-lithium loops at ~1,100 K, radiating via Stefan–Boltzmann (P = εσAT⁴). Their dull red glow is real: hot radiators shine in the infrared and faintly in visible light.',
    specs: [
      ['Area', '4 × 18,000 m² (double-sided)'],
      ['Coolant', 'Liquid lithium loops'],
      ['Rejection', '4 GW at 1,100 K'],
    ],
    label: [-26, 15, 0],
    camera: { position: [-40, 22, 26], target: [-25, 0, 0] },
  },
  {
    id: 'powerbus',
    name: 'Superconducting Power Bus & Storage',
    category: 'Power',
    short: 'Lossless HTS lines and flywheel / battery banks.',
    description:
      'High-temperature superconducting cables carry gigawatts along the spine with zero resistive loss. Flywheel arrays and solid-state batteries buffer the load so the reactor can idle during warp charge cycles.',
    specs: [
      ['Bus', 'REBCO tape, 40 kA'],
      ['Storage', '48 flywheels + 2 GWh solid-state'],
    ],
    label: [-5, 5, 0],
    camera: { position: [-19.5, 5, 16], target: [-19.5, 0, 0] },
  },

  // ---------------- HABITAT ----------------
  {
    id: 'ringA',
    name: 'Habitat Ring A — Residential',
    category: 'Habitat',
    short: 'Rotating ring providing 0.94 g of artificial gravity.',
    description:
      'A 420 m diameter ring spinning at 2 rpm. Centripetal acceleration a = ω²r = (0.209 rad/s)² × 210 m ≈ 9.2 m/s². Residents live on the outer wall — “down” points away from the spine. The ring holds 1,600 apartments, schools, clinics and parks over three internal decks.',
    specs: [
      ['Radius', '210 m'],
      ['Spin', '2.0 rpm → 0.94 g'],
      ['Coriolis', '< 3% gradient head-to-foot'],
      ['Population', '2,100'],
    ],
    label: [-5, 18, 0],
    camera: { position: [12, 14, 32], target: [-5, 0, 0] },
    cutaway: true,
  },
  {
    id: 'ringB',
    name: 'Habitat Ring B — Agriculture & Commons',
    category: 'Habitat',
    short: 'Counter-rotating ring: farms, parks and light industry.',
    description:
      'Spins opposite to Ring A so the net angular momentum is zero — otherwise the ship would be a giant gyroscope and could not turn. Contains 60,000 m² of vertical farms under LED grow light, an orchard park with a 1 km running loop, and the schools and workshops that keep a multi-generation crew skilled.',
    specs: [
      ['Radius', '210 m, counter-rotating'],
      ['Farm area', '60,000 m² aeroponics'],
      ['Diet', '2,600 kcal/person/day closed loop'],
    ],
    label: [-13, 18, 0],
    camera: { position: [-2, 14, 34], target: [-13, 0, 0] },
    cutaway: true,
  },
  {
    id: 'hydroponics',
    name: 'Core Hydroponics Bay',
    category: 'Habitat',
    short: 'Microgravity crop bay and algae bioreactors.',
    description:
      'Deck 2 grows fast-cycle crops (wheat, soy, potatoes, leafy greens) and spirulina bioreactors that produce 40% of ship oxygen. Photosynthesis closes the CO₂ loop; water is recovered from transpiration by condensing heat exchangers.',
    specs: [
      ['Crop area', '4,000 m²'],
      ['O₂ share', '~40% of crew demand'],
      ['Lighting', '660/450 nm LED, 300 µmol/m²/s'],
    ],
    label: [13, 2, 0],
    camera: { position: [22, 6, 14], target: [13, -0.5, 0] },
    cutaway: true,
  },
  {
    id: 'medbay',
    name: 'Medical Bay & Gene Bank',
    category: 'Habitat',
    short: 'Surgery, radiation oncology and frozen genetic diversity.',
    description:
      'Full surgical suite with robotic assistance and a cryogenic gene bank holding 40,000 human embryos plus 2 million plant and animal samples at −196 K. Genetic diversity across 12 generations is managed to avoid founder effects.',
    specs: [
      ['Beds', '24 + 4 surgical bays'],
      ['Gene bank', '−196 °C LN₂ dewars, 2 M samples'],
      ['Radiation clinic', 'Stem-cell therapy'],
    ],
    label: [17, 5, 0],
    camera: { position: [26, 9, 12], target: [17, 1.5, 0] },
    cutaway: true,
  },
  {
    id: 'hangar',
    name: 'Hangar & Shuttle Bay',
    category: 'Habitat',
    short: 'Two landers plus EVA pods and manufacturing.',
    description:
      'Ventral bay with two aerospike-engined landers, four EVA work pods and a swarm of repair drones. Adjacent workshops run metal-powder additive manufacturing so any part can be reprinted from recycled feedstock.',
    specs: [
      ['Landers', '2 × 40 t SSTO'],
      ['Work pods', '4 + 30 drones'],
      ['Fabrication', 'Laser powder-bed, 12 m build volume'],
    ],
    label: [11, -5, 0],
    camera: { position: [20, -14, 18], target: [11, -3, 0] },
    cutaway: true,
  },

  // ---------------- LIFE SUPPORT ----------------
  {
    id: 'eclss',
    name: 'ECLSS — Air & Water Recycling',
    category: 'Life Support',
    short: 'Closed-loop environmental control: 99% water, 100% O₂ recovery.',
    description:
      'Oxygen comes from water electrolysis (2H₂O → 2H₂ + O₂); CO₂ is scrubbed by amine beds and reduced with the hydrogen via the Sabatier reaction (CO₂ + 4H₂ → CH₄ + 2H₂O). Waste water passes through vapour-compression distillation and catalytic oxidation. These are the same principles used aboard the ISS, scaled 1,000×.',
    specs: [
      ['Water recovery', '99.2%'],
      ['O₂ generation', '4.2 t/day electrolysis'],
      ['CO₂ removal', 'Amine swing + Sabatier'],
    ],
    label: [24, -4.5, 0],
    camera: { position: [32, -8, 14], target: [24, -2.5, 0] },
    cutaway: true,
  },
  {
    id: 'water',
    name: 'Water Reserve & Radiation Shield',
    category: 'Life Support',
    short: 'Potable water that doubles as cosmic-ray shielding.',
    description:
      'Hydrogen-rich water is one of the best shields against galactic cosmic rays. 20,000 tonnes of water are stored in tanks wrapping the crew decks, providing 30 g/cm² of shielding equivalent.',
    specs: [
      ['Reserve', '20,000 t'],
      ['Shield', '30 g/cm² water-equivalent'],
    ],
    label: [8, -4.5, 0],
    camera: { position: [16, -8, 14], target: [8, -2.5, 0] },
    cutaway: true,
  },

  // ---------------- STRUCTURE & DEFENSE ----------------
  {
    id: 'deflector',
    name: 'Magnetic Deflector Coil',
    category: 'Structure & Defense',
    short: 'Superconducting loop that sweeps charged particles aside.',
    description:
      'At 0.08 c the interstellar medium hits the bow like a proton beam. A 180 m superconducting coil generates a dipole field that deflects charged particles (Lorentz force F = qv×B) while ionising lasers charge neutral dust ahead of the ship so it too can be deflected.',
    specs: [
      ['Coil', '180 m, 50 T·m dipole'],
      ['Ionising lasers', '4 × 5 MW UV'],
      ['Reduces bow flux', '> 99%'],
    ],
    label: [40, 8, 0],
    camera: { position: [56, 10, 18], target: [40, 0, 0] },
  },
  {
    id: 'shield',
    name: 'Whipple Bumper & Bow Armour',
    category: 'Structure & Defense',
    short: 'Multi-layer sacrificial shielding against dust impacts.',
    description:
      'The forward prongs carry stacked Whipple bumpers: a thin outer plate vaporises incoming particles into a plasma cloud that spreads before hitting the inner armour. Layers of aerogel, Kevlar and boron-carbide ceramics complete the stack.',
    specs: [
      ['Layers', '7 (Al / aerogel / Kevlar / B₄C)'],
      ['Rated', '1 g particle at 0.08 c'],
    ],
    label: [38, -2.5, -6],
    camera: { position: [50, 4, -16], target: [38, -0.5, -5] },
  },
  {
    id: 'spine',
    name: 'Structural Spine & Truss',
    category: 'Structure & Defense',
    short: 'Carbon-nanotube keel that carries thrust loads.',
    description:
      'A hollow CNT-composite keel transmits torch thrust to the whole ship and carries the transit tubes, power bus and coolant lines between sections. Ring bearings on the spine use magnetic levitation so the rotating habitats never touch the hull.',
    specs: [
      ['Material', 'CNT / carbon-carbon composite'],
      ['Bearings', 'Maglev ring bearings'],
      ['Transit', 'Two maglev pods, 60 s end-to-end'],
    ],
    label: [-5, -5, 0],
    camera: { position: [6, -8, 18], target: [-5, 0, 0] },
  },
  {
    id: 'pods',
    name: 'Escape Pods & Lifeboats',
    category: 'Structure & Defense',
    short: 'Ring-mounted pods with 30-day life support.',
    description:
      'Sixteen pods on each habitat ring. They are ejected outward using the ring’s own spin (tangential velocity ~44 m/s) and carry 30 days of consumables and a beacon.',
    specs: [
      ['Count', '32 × 40 seats'],
      ['Endurance', '30 days'],
    ],
    label: [-9, -18, 0],
    camera: { position: [2, -20, 26], target: [-9, -8, 0] },
  },
];

export const CATEGORIES: Category[] = [
  'Command',
  'Propulsion',
  'Power',
  'Habitat',
  'Life Support',
  'Structure & Defense',
];

export const systemById: Record<string, ShipSystem> = Object.fromEntries(
  SYSTEMS.map((s) => [s.id, s]),
);

export const PRESETS: { id: string; name: string; camera: CameraSpot; cutaway?: boolean }[] = [
  { id: 'exterior', name: 'Exterior', camera: { position: [60, 26, 62], target: [0, 0, 0] } },
  { id: 'bow', name: 'Bow', camera: { position: [58, 8, 30], target: [30, 0, 0] } },
  { id: 'habitat', name: 'Habitat Rings', camera: { position: [10, 16, 36], target: [-9, 0, 0] }, cutaway: true },
  { id: 'engineering', name: 'Engineering', camera: { position: [-27, 9, 42], target: [-23, 0, 0] }, cutaway: true },
  { id: 'stern', name: 'Stern', camera: { position: [-60, 18, 40], target: [-20, 0, 0] } },
  { id: 'underside', name: 'Underside', camera: { position: [30, -26, 40], target: [8, -2, 0] } },
];
