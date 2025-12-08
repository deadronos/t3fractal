import { useMemo } from "react";

import type { UpgradeKey, ComplexParameter } from "@/store/gameStore";
import { FRACTAL_ZONES, DIMENSIONAL_TARGET } from "@/data/gameConfig";
import {
  calculateUpgradeCost,
  calculateZoomCost,
  calculateExpeditionCost,
  calculateExpeditionPreview,
  calculateStabiliseCost,
} from "@/lib/gameplay/costFormulas";
import {
  calculateProductionMultiplier,
  calculateParameterEfficiency,
  calculateBaseProduction,
  calculatePassiveDepthGain,
  calculateZoneBonus,
} from "@/lib/gameplay/productionMath";

type GameState = {
  depth: number;
  upgrades: Record<UpgradeKey, number>;
  ascensionLevel: number;
  amplifiers: number;
  dimensionalPoints: number;
  resonance: number;
  anomalies: number;
  complexParameter: ComplexParameter;
  expeditionRank: number;
  fractalData: number;
  transcensionLevel: number;
  harmonicCores: number;
  juliaFlux: number;
  juliaDepth: number;
};

/**
 * Hook to calculate all derived game values.
 * Computes costs, production rates, yields, and other dependent values.
 *
 * @param state - The current game state.
 * @returns An object containing calculated values.
 */
export function useGameCalculations(state: GameState) {
  const nextDepthLevel = Math.floor(state.depth) + 1;
  
  const zoomCost = useMemo(
    () => calculateZoomCost(nextDepthLevel),
    [nextDepthLevel],
  );

  const productionMultiplier = useMemo(
    () =>
      calculateProductionMultiplier({
        ascensionLevel: state.ascensionLevel,
        amplifiers: state.amplifiers,
        depth: state.depth,
        dimensionalPoints: state.dimensionalPoints,
        resonance: state.resonance,
        anomalies: state.anomalies,
        transcensionLevel: state.transcensionLevel,
        harmonicCores: state.harmonicCores,
        juliaFlux: state.juliaFlux,
      }),
    [
      state.ascensionLevel,
      state.amplifiers,
      state.anomalies,
      state.depth,
      state.dimensionalPoints,
      state.harmonicCores,
      state.juliaFlux,
      state.resonance,
      state.transcensionLevel,
    ],
  );

  const parameterEfficiency = useMemo(
    () => calculateParameterEfficiency(state.complexParameter, DIMENSIONAL_TARGET),
    [state.complexParameter],
  );

  const baseProduction = useMemo(
    () => calculateBaseProduction(state.upgrades),
    [state.upgrades],
  );

  const dataPerSecond = useMemo(() => {
    if (baseProduction <= 0) {
      return 0;
    }
    return baseProduction * productionMultiplier * parameterEfficiency;
  }, [baseProduction, productionMultiplier, parameterEfficiency]);

  const unlockedZones = useMemo(
    () => FRACTAL_ZONES.filter((zone) => state.depth >= zone.requirement),
    [state.depth],
  );

  const currentZone = unlockedZones[unlockedZones.length - 1] ?? FRACTAL_ZONES[0];
  const zoneBonus = currentZone ? calculateZoneBonus(currentZone.bonus) : 1;
  const effectiveDataPerSecond = dataPerSecond * zoneBonus;

  const passiveDepthGain = useMemo(
    () =>
      calculatePassiveDepthGain({
        stabilizerCount: state.upgrades.stabilizer,
        resonance: state.resonance,
        parameterEfficiency,
      }),
    [parameterEfficiency, state.resonance, state.upgrades.stabilizer],
  );

  const expeditionCost = useMemo(
    () => calculateExpeditionCost(state.depth, state.ascensionLevel, state.expeditionRank),
    [state.ascensionLevel, state.depth, state.expeditionRank],
  );

  const expeditionPreview = useMemo(
    () => calculateExpeditionPreview(state.depth, state.resonance, state.ascensionLevel),
    [state.ascensionLevel, state.depth, state.resonance],
  );

  const stabiliseCost = useMemo(
    () => calculateStabiliseCost(state.anomalies, state.ascensionLevel),
    [state.anomalies, state.ascensionLevel],
  );

  const upgradeCost = (key: UpgradeKey) => calculateUpgradeCost(key, state.upgrades[key]);

  const ascendReady = state.depth >= 6 && state.fractalData >= 1200;
  
  const ascensionYield = useMemo(() => {
    const depthContribution = Math.floor(Math.max(state.depth, 0));
    const dataContribution = Math.floor(state.fractalData / 400);
    const total = depthContribution + dataContribution + state.upgrades.processor;
    return Math.max(1, Math.floor(total * 0.75));
  }, [state.depth, state.fractalData, state.upgrades.processor]);

  const transcensionReady = state.dimensionalPoints >= 25 && ascendReady;

  const transcensionYield = useMemo(() => {
    const combined = state.ascensionLevel + ascensionYield + state.depth * 0.25;
    return Math.max(1, Math.floor(combined * 0.6));
  }, [ascensionYield, state.ascensionLevel, state.depth]);

  const amplifierCost = useMemo(
    () => Math.floor(3 * Math.pow(2.4, state.amplifiers)),
    [state.amplifiers],
  );

  const dimensionalEfficiency = (parameterEfficiency * 100).toFixed(0);

  const juliaStudyCost = useMemo(
    () => Math.floor(420 + state.juliaDepth * 140 + state.harmonicCores * 120),
    [state.harmonicCores, state.juliaDepth],
  );

  const juliaFluxGain = useMemo(
    () =>
      Math.max(
        1,
        Math.floor(
          state.harmonicCores * 2 + state.juliaDepth * 1.25 + state.resonance * 0.6,
        ),
      ),
    [state.harmonicCores, state.juliaDepth, state.resonance],
  );

  const juliaBonusMultiplier =
    1 + state.harmonicCores * 0.25 + state.juliaFlux * 0.04 + state.transcensionLevel * 0.15;

  const omenMessage = useMemo(() => {
    if (state.anomalies >= 4) {
      return "Council warning: anomaly gardens are blooming; stabilise soon.";
    }
    if (state.resonance >= 18) {
      return "The Cosmic Choir hums in harmony. Expect generous events.";
    }
    if (currentZone && currentZone.requirement >= 10) {
      return "Frontier scouts taste complexity in the air; brace for dazzling storms.";
    }
    return "Sensors idle with a gentle purr. Perfect time to chart expeditions.";
  }, [state.anomalies, currentZone, state.resonance]);

  return {
    zoomCost,
    productionMultiplier,
    parameterEfficiency,
    baseProduction,
    dataPerSecond,
    effectiveDataPerSecond,
    unlockedZones,
    currentZone,
    zoneBonus,
    passiveDepthGain,
    expeditionCost,
    expeditionPreview,
    stabiliseCost,
    upgradeCost,
    ascendReady,
    ascensionYield,
    transcensionReady,
    transcensionYield,
    amplifierCost,
    dimensionalEfficiency,
    juliaStudyCost,
    juliaFluxGain,
    juliaBonusMultiplier,
    omenMessage,
  };
}
