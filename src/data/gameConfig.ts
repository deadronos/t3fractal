/**
 * Game Configuration Data
 * 
 * Static configuration for game mechanics including upgrade definitions,
 * fractal zones, and dimensional targets.
 */

import type { UpgradeKey, ComplexParameter } from "@/store/gameStore";

/**
 * Configuration for a single upgrade type
 */
export type UpgradeConfig = {
  title: string;
  description: string;
  baseCost: number;
  growth: number;
  flavor: string;
};

/**
 * Configuration for all available upgrades
 */
export const UPGRADE_CONFIG: Record<UpgradeKey, UpgradeConfig> = {
  probe: {
    title: "Fractal Probes",
    description:
      "Deploy autonomous explorers that map detail while you plan the next zoom.",
    baseCost: 35,
    growth: 1.45,
    flavor: "Their quantum lenses never blink.",
  },
  processor: {
    title: "Quantum Processors",
    description:
      "Accelerate every calculation, multiplying the insight gathered by your probes.",
    baseCost: 120,
    growth: 1.6,
    flavor: "The algorithms hum in complex harmony.",
  },
  stabilizer: {
    title: "Dimensional Stabilizers",
    description:
      "Anchor deeper zoom levels so the structure holds while automation continues.",
    baseCost: 220,
    growth: 1.55,
    flavor: "Reality threads itself tighter around the frontier.",
  },
};

/**
 * Fractal zone definition
 */
export type FractalZone = {
  name: string;
  requirement: number;
  bonus: number;
  description: string;
};

/**
 * Available fractal zones with unlock requirements and bonuses
 */
export const FRACTAL_ZONES: FractalZone[] = [
  {
    name: "Mandelbrot Core",
    requirement: 0,
    bonus: 0.0,
    description: "The familiar heart of the set, steady and welcoming.",
  },
  {
    name: "Seahorse Valley",
    requirement: 4,
    bonus: 0.08,
    description:
      "Filigree spirals curl like cosmic seahorses, enriching every data packet.",
  },
  {
    name: "Spiral Nebula",
    requirement: 7,
    bonus: 0.18,
    description:
      "Twin galaxies of recursion feed each other, boosting production dramatically.",
  },
  {
    name: "Mini-Brot Frontier",
    requirement: 11,
    bonus: 0.3,
    description:
      "Self-similarity upon self-similarity. You glimpse new universes in each pixel.",
  },
  {
    name: "Hyperbolic Bloom",
    requirement: 15,
    bonus: 0.45,
    description:
      "Geometries bloom beyond Euclid. Ascension-grade knowledge saturates every line.",
  },
];

/**
 * Target coordinates for dimensional exploration
 */
export const DIMENSIONAL_TARGET: ComplexParameter = { real: -0.75, imaginary: 0.11 };
