export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export type GeometryType = "cylinder" | "cone" | "box" | "tetra";

export const SEASONS: Record<
  SeasonId,
  {
    name: string;
    tagline: string;
    description: string;
    rateMultiplier: number;
    costMultiplier: number;
    palette: {
      sky: string;
      bark: string;
      leaf: string;
      accent: string;
    };
  }
> = {
  spring: {
    name: "Spring",
    tagline: "Expansion",
    description: "Low cost for iterations. Rapid vertical growth.",
    rateMultiplier: 1.15,
    costMultiplier: 0.75,
    palette: {
      sky: "#f6f4ea",
      bark: "#7a5a38",
      leaf: "#7fd08b",
      accent: "#6fbf9d",
    },
  },
  summer: {
    name: "Summer",
    tagline: "Optimization",
    description: "Resource costs spike. Tune angles for light.",
    rateMultiplier: 1,
    costMultiplier: 1.25,
    palette: {
      sky: "#f3efe6",
      bark: "#6b4b2d",
      leaf: "#3fa866",
      accent: "#2d8c63",
    },
  },
  autumn: {
    name: "Autumn",
    tagline: "Fruiting",
    description: "Growth slows. Funnel sap into fruit spawns.",
    rateMultiplier: 0.7,
    costMultiplier: 1.1,
    palette: {
      sky: "#f4efe3",
      bark: "#7a4d2f",
      leaf: "#d96c4f",
      accent: "#c45736",
    },
  },
  winter: {
    name: "Winter",
    tagline: "Reset",
    description: "Harvest the tree for seeds.",
    rateMultiplier: 0.1,
    costMultiplier: 1.6,
    palette: {
      sky: "#edf0f4",
      bark: "#7a7f89",
      leaf: "#c9d0d8",
      accent: "#9aa6b3",
    },
  },
};

export const SEASON_ORDER: SeasonId[] = ["spring", "summer", "autumn", "winter"];

export const MAX_ITERATIONS = 7;
export const BASE_WIDTH = 0.08;
export const WIDTH_STEP = 0.02;

export const BASE_STEP = 0.9;

export const GEOMETRY_OPTIONS: {
  id: GeometryType;
  name: string;
  description: string;
  seedCost: number;
}[] = [
  {
    id: "cylinder",
    name: "Cylinder",
    description: "Classic branch profile.",
    seedCost: 0,
  },
  {
    id: "cone",
    name: "Cone",
    description: "Tapered growth.",
    seedCost: 10,
  },
  {
    id: "box",
    name: "Cube",
    description: "Crystalline bark.",
    seedCost: 14,
  },
  {
    id: "tetra",
    name: "Tetra",
    description: "Facet fractal.",
    seedCost: 18,
  },
];

export type RuleDefinition = {
  id: string;
  name: string;
  symbol: string;
  replacement: string;
  description: string;
  cost: { photosynthesis?: number; sap?: number; seeds?: number };
  requires?: { pitch?: boolean; roll?: boolean };
};

export const RULE_LIBRARY: RuleDefinition[] = [
  {
    id: "stem",
    name: "Stem",
    symbol: "F",
    replacement: "F",
    description: "Stable trunk segments.",
    cost: {},
  },
  {
    id: "sprout",
    name: "Sprout Split",
    symbol: "X",
    replacement: "F[+X][-X]",
    description: "Simple bifurcation for early growth.",
    cost: {},
  },
  {
    id: "stretch",
    name: "Stretch",
    symbol: "F",
    replacement: "FF",
    description: "Longer fibers per step.",
    cost: { sap: 60 },
  },
  {
    id: "thicket",
    name: "Thicket",
    symbol: "F",
    replacement: "F[+F]F[-F]F",
    description: "Dense wood lattice.",
    cost: { sap: 140 },
  },
  {
    id: "crown",
    name: "Crown",
    symbol: "X",
    replacement: "F[+X]F[-X]+X",
    description: "Layered canopy spread.",
    cost: { photosynthesis: 80 },
  },
  {
    id: "fern",
    name: "Fern",
    symbol: "X",
    replacement: "F-[[X]+X]+F[+FX]-X",
    description: "Complex fern-like recursion.",
    cost: { photosynthesis: 140 },
  },
  {
    id: "whorl",
    name: "Whorl",
    symbol: "X",
    replacement: "F[+X][-X]&X",
    description: "Pitch-based branching (3D).",
    cost: { photosynthesis: 180 },
    requires: { pitch: true },
  },
  {
    id: "spiral",
    name: "Spiral Drift",
    symbol: "X",
    replacement: "F[+X][-X]/X",
    description: "Roll-based drift (3D).",
    cost: { photosynthesis: 220 },
    requires: { roll: true },
  },
];

export type SeedUpgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
};

export const SEED_UPGRADES: SeedUpgrade[] = [
  {
    id: "pitch",
    name: "Dimensionality: Pitch",
    description: "Unlock & and ^ turtle rotations.",
    cost: 12,
  },
  {
    id: "roll",
    name: "Dimensionality: Roll",
    description: "Unlock / and \\ turtle rotations.",
    cost: 14,
  },
  {
    id: "autoTuner",
    name: "Automation: Auto-Tuner",
    description: "Slowly optimizes branch angles.",
    cost: 16,
  },
  {
    id: "geometry_cone",
    name: "Geometry: Cone",
    description: "Unlock cone branch instances.",
    cost: 10,
  },
  {
    id: "geometry_box",
    name: "Geometry: Cube",
    description: "Unlock cube branch instances.",
    cost: 14,
  },
  {
    id: "geometry_tetra",
    name: "Geometry: Tetra",
    description: "Unlock tetra branch instances.",
    cost: 18,
  },
];

export function getWidth(level: number): number {
  return BASE_WIDTH + level * WIDTH_STEP;
}

export function getTickMultiplier(level: number): number {
  return 1 + level * 0.15;
}

export function getIterationCost(iterations: number, season: SeasonId): number {
  const base = 24 * Math.pow(1.85, iterations);
  return Math.round(base * SEASONS[season].costMultiplier);
}

export function getWidthCost(level: number, season: SeasonId): number {
  const base = 20 * Math.pow(1.55, level + 1);
  return Math.round(base * SEASONS[season].costMultiplier);
}

export function getTickCost(level: number, season: SeasonId): number {
  const base = 26 * Math.pow(1.7, level + 1);
  return Math.round(base * SEASONS[season].costMultiplier);
}

export function getFruitCost(fruit: number, season: SeasonId): number {
  const base = 35 * Math.pow(1.35, fruit + 1);
  return Math.round(base * SEASONS[season].costMultiplier);
}

export function getAxiomCost(nextAxiom: string): number {
  return Math.max(8, Math.round(nextAxiom.length * 6));
}

export function getSeedYield(photosynthesis: number, sap: number, fruit: number): number {
  const core = Math.floor((photosynthesis + sap) / 180);
  const fruitBonus = Math.floor(fruit * 2.5);
  return Math.max(1, core + fruitBonus);
}
