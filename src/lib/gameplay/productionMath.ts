/**
 * Production Math Utilities
 * 
 * Provides calculations for resource production rates and multipliers.
 */

import type { ComplexParameter } from "@/store/gameStore";

/**
 * Calculate the production multiplier based on various game state factors.
 * 
 * @param params - Production calculation parameters
 * @returns Combined production multiplier
 */
export const calculateProductionMultiplier = (params: {
  ascensionLevel: number;
  amplifiers: number;
  depth: number;
  dimensionalPoints: number;
  resonance: number;
  anomalies: number;
  transcensionLevel: number;
  harmonicCores: number;
  juliaFlux: number;
}): number => {
  const ascensionBonus = 1 + params.ascensionLevel * 0.25 + params.amplifiers * 0.35;
  const depthBonus = 1 + Math.floor(params.depth) * 0.05;
  const dimensionalBonus = 1 + params.dimensionalPoints * 0.02;
  const resonanceBonus = 1 + params.resonance * 0.015;
  const anomalyPenalty = Math.max(0.6, 1 - params.anomalies * 0.03);
  const transcendenceBonus =
    1 + params.transcensionLevel * 0.5 + params.harmonicCores * 0.25;
  const juliaFluxBonus = 1 + params.juliaFlux * 0.04;

  return (
    ascensionBonus *
    depthBonus *
    dimensionalBonus *
    resonanceBonus *
    anomalyPenalty *
    transcendenceBonus *
    juliaFluxBonus
  );
};

/**
 * Calculate parameter efficiency based on distance from target.
 * 
 * @param current - Current complex parameter
 * @param target - Target complex parameter
 * @returns Efficiency multiplier (0.65 to ~1.45)
 */
export const calculateParameterEfficiency = (
  current: ComplexParameter,
  target: ComplexParameter,
): number => {
  const distance = Math.hypot(
    current.real - target.real,
    current.imaginary - target.imaginary,
  );
  return Math.max(0.65, 1.45 - distance * 1.1);
};

/**
 * Calculate base production from upgrade levels.
 * 
 * @param upgrades - Current upgrade counts
 * @returns Base production value
 */
export const calculateBaseProduction = (upgrades: {
  probe: number;
  processor: number;
  stabilizer: number;
}): number => {
  const probeYield = upgrades.probe * 0.9;
  const processorYield = upgrades.processor * 3.5;
  const stabilizerYield = upgrades.stabilizer * 1.6;
  return probeYield + processorYield + stabilizerYield;
};

/**
 * Calculate passive depth gain rate.
 * 
 * @param params - Depth gain calculation parameters
 * @returns Depth gain per interval
 */
export const calculatePassiveDepthGain = (params: {
  stabilizerCount: number;
  resonance: number;
  parameterEfficiency: number;
}): number => {
  if (params.stabilizerCount <= 0) {
    return 0;
  }
  const resonanceAssist = 1 + Math.min(params.resonance * 0.02, 0.6);
  return (
    (0.06 + params.stabilizerCount * 0.025) *
    params.parameterEfficiency *
    resonanceAssist
  );
};

/**
 * Calculate zone bonus multiplier.
 * 
 * @param zoneBonus - The zone's bonus value
 * @returns Multiplier (1 + bonus)
 */
export const calculateZoneBonus = (zoneBonus: number): number => {
  return 1 + zoneBonus;
};
