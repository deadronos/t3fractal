import { useCallback, useRef } from "react";

import { useGameStore, type UpgradeKey, type ComplexParameter } from "@/store/gameStore";
import { resolveCosmicEvent } from "@/app/pages/cosmicEvents";

type GameHandlerDeps = {
  depth: number;
  resonance: number;
  anomalies: number;
  ascensionLevel: number;
  dimensionalPoints: number;
  fractalData: number;
  zoomCost: number;
  expeditionCost: number;
  expeditionPreview: number;
  stabiliseCost: number;
  upgradeCost: (key: UpgradeKey) => number;
  ascendReady: boolean;
  ascensionYield: number;
  amplifierCost: number;
  transcensionReady: boolean;
  transcensionYield: number;
  harmonicCores: number;
  juliaStudyCost: number;
  juliaFluxGain: number;
  juliaDepth: number;
};

type GameActions = {
  spendFractalData: (amount: number) => boolean;
  addFractalData: (amount: number) => void;
  incrementDepth: (amount: number) => void;
  spendDimensionalPoints: (amount: number) => boolean;
  incrementAmplifiers: () => void;
  addResonance: (amount: number) => void;
  addAnomalies: (amount: number) => void;
  incrementExpeditionRank: () => void;
  incrementUpgrade: (key: UpgradeKey) => void;
  pushActivityLog: (message: string) => void;
  setComplexParameter: (changes: Partial<ComplexParameter>) => void;
  performAscension: (yieldAmount: number) => void;
  performTranscendence: (yieldAmount: number) => void;
  addJuliaFlux: (amount: number) => void;
  incrementJuliaDepth: (amount: number) => void;
  setJuliaConstant: (changes: Partial<ComplexParameter>) => void;
};

/**
 * Hook for all game event handlers
 */
export function useGameHandlers(deps: GameHandlerDeps, actions: GameActions) {
  const latestSnapshotRef = useRef({
    depth: deps.depth,
    resonance: deps.resonance,
    anomalies: deps.anomalies,
    ascensionLevel: deps.ascensionLevel,
    dimensionalPoints: deps.dimensionalPoints,
    fractalData: deps.fractalData,
    harmonicCores: deps.harmonicCores,
  });

  // Update the ref whenever deps change
  latestSnapshotRef.current = {
    depth: deps.depth,
    resonance: deps.resonance,
    anomalies: deps.anomalies,
    ascensionLevel: deps.ascensionLevel,
    dimensionalPoints: deps.dimensionalPoints,
    fractalData: deps.fractalData,
    harmonicCores: deps.harmonicCores,
  };

  const pushLog = useCallback(
    (message: string) => {
      actions.pushActivityLog(message);
    },
    [actions],
  );

  const handleZoomDeeper = useCallback(() => {
    const success = actions.spendFractalData(deps.zoomCost);
    if (success) {
      actions.incrementDepth(1);
      pushLog(`Zoomed to depth ${Math.floor(deps.depth + 1)}. Details blossom.`);
    } else {
      pushLog("Insufficient Fractal Data to penetrate deeper.");
    }
  }, [actions, deps.depth, deps.zoomCost, pushLog]);

  const handleZoomOut = useCallback(() => {
    actions.incrementDepth(-1);
    pushLog("Stabilised view at a safer zoom.");
  }, [actions, pushLog]);

  const handleExpedition = useCallback(() => {
    const success = actions.spendFractalData(deps.expeditionCost);
    if (!success) {
      pushLog("Expedition denied: insufficient Fractal Data for launch.");
      return;
    }
    const variableReward = deps.expeditionPreview + Math.floor(Math.random() * 4);
    actions.addResonance(variableReward);
    actions.incrementDepth(0.25);
    actions.incrementExpeditionRank();
    if (Math.random() > 0.72) {
      actions.addAnomalies(1);
      pushLog(
        `Expedition reports ${variableReward} resonance shards and an excitable anomaly hitchhiker.`,
      );
      return;
    }
    pushLog(
      `Expedition returns triumphantly with ${variableReward} resonance shards.`,
    );
  }, [actions, deps.expeditionCost, deps.expeditionPreview, pushLog]);

  const handleStabiliseAnomaly = useCallback(() => {
    if (deps.anomalies <= 0) {
      pushLog("Calibration steady: no anomalies demand stabilisation.");
      return;
    }
    const success = actions.spendFractalData(deps.stabiliseCost);
    if (!success) {
      pushLog(
        "Stabilisation cancelled: gather more Fractal Data for the ritual.",
      );
      return;
    }
    useGameStore.getState().removeAnomaly();
    actions.addResonance(2);
    pushLog("Quantum botanists prune an anomaly garden into calm symmetry.");
  }, [actions, deps.anomalies, deps.stabiliseCost, pushLog]);

  const handleUpgradePurchase = useCallback(
    (key: UpgradeKey) => {
      const cost = deps.upgradeCost(key);
      const success = actions.spendFractalData(cost);
      if (!success) {
        pushLog("The frontier demands more data before that upgrade.");
        return;
      }
      actions.incrementUpgrade(key);
      pushLog(`Upgrade secured: ${key}.`);
    },
    [actions, deps, pushLog],
  );

  const handleAscend = useCallback(() => {
    if (!deps.ascendReady) {
      pushLog("The fractal resists ascension – reach deeper detail first.");
      return;
    }
    actions.performAscension(deps.ascensionYield);
    pushLog(
      `Dimensional Ascension complete. Gained ${deps.ascensionYield} Dimensional Points.`,
    );
  }, [actions, deps.ascendReady, deps.ascensionYield, pushLog]);

  const handleAmplifierPurchase = useCallback(() => {
    const success = actions.spendDimensionalPoints(deps.amplifierCost);
    if (!success) {
      pushLog("Need more Dimensional Points to stabilise an amplifier.");
      return;
    }
    actions.incrementAmplifiers();
    pushLog("Dimensional Amplifier anchors permanent insight.");
  }, [actions, deps.amplifierCost, pushLog]);

  const handleParameterChange = useCallback(
    (changes: Partial<ComplexParameter>) => {
      actions.setComplexParameter(changes);
    },
    [actions],
  );

  const handleJuliaConstantChange = useCallback(
    (changes: Partial<ComplexParameter>) => {
      actions.setJuliaConstant(changes);
    },
    [actions],
  );

  const handleTranscend = useCallback(() => {
    if (!deps.transcensionReady) {
      pushLog("Transcendence requires a second ascension-grade run and calibration.");
      return;
    }
    actions.performTranscendence(deps.transcensionYield);
    pushLog(
      `Harmonic Transcendence achieved. Banked ${deps.transcensionYield} Harmonic Cores and unlocked the Julia Lab.`,
    );
  }, [actions, deps.transcensionReady, deps.transcensionYield, pushLog]);

  const handleJuliaStudy = useCallback(() => {
    const success = actions.spendFractalData(deps.juliaStudyCost);
    if (!success) {
      pushLog("Julia study aborted: gather more Fractal Data for the probes.");
      return;
    }
    actions.addJuliaFlux(deps.juliaFluxGain);
    actions.incrementJuliaDepth(0.65);
    pushLog(
      `Julia filaments mapped: +${deps.juliaFluxGain} flux and lab depth now ${(
        deps.juliaDepth + 0.65
      ).toFixed(2)}.`,
    );
  }, [actions, deps.juliaDepth, deps.juliaFluxGain, deps.juliaStudyCost, pushLog]);

  const triggerCosmicEvent = useCallback(() => {
    const { event, outcome } = resolveCosmicEvent(latestSnapshotRef.current);
    const {
      dataDelta = 0,
      resonanceDelta = 0,
      anomaliesDelta = 0,
      depthDelta = 0,
      dimensionalPointsDelta = 0,
    } = outcome;

    if (dataDelta !== 0) {
      if (dataDelta > 0) {
        actions.addFractalData(dataDelta);
      } else {
        actions.spendFractalData(-dataDelta);
      }
    }
    if (resonanceDelta !== 0) {
      actions.addResonance(resonanceDelta);
    }
    if (anomaliesDelta !== 0) {
      actions.addAnomalies(anomaliesDelta);
    }
    if (depthDelta !== 0) {
      actions.incrementDepth(depthDelta);
    }
    if (dimensionalPointsDelta !== 0) {
      useGameStore.getState().addDimensionalPoints(dimensionalPointsDelta);
    }
    pushLog(`[Event] ${event.name}: ${outcome.log}`);
  }, [actions, pushLog]);

  return {
    handleZoomDeeper,
    handleZoomOut,
    handleExpedition,
    handleStabiliseAnomaly,
    handleUpgradePurchase,
    handleAscend,
    handleAmplifierPurchase,
    handleParameterChange,
    handleJuliaConstantChange,
    handleTranscend,
    handleJuliaStudy,
    triggerCosmicEvent,
  };
}
