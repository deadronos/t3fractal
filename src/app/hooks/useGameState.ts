import { useGameStore } from "@/store/gameStore";

/**
 * Hook to access all game state from the store
 */
export function useGameState() {
  const fractalData = useGameStore((state) => state.fractalData);
  const depth = useGameStore((state) => state.depth);
  const upgrades = useGameStore((state) => state.upgrades);
  const dimensionalPoints = useGameStore((state) => state.dimensionalPoints);
  const ascensionLevel = useGameStore((state) => state.ascensionLevel);
  const amplifiers = useGameStore((state) => state.amplifiers);
  const resonance = useGameStore((state) => state.resonance);
  const anomalies = useGameStore((state) => state.anomalies);
  const expeditionRank = useGameStore((state) => state.expeditionRank);
  const eventCountdown = useGameStore((state) => state.eventCountdown);
  const complexParameter = useGameStore((state) => state.complexParameter);
  const activityLog = useGameStore((state) => state.activityLog);
  const lastZone = useGameStore((state) => state.lastZone);

  return {
    fractalData,
    depth,
    upgrades,
    dimensionalPoints,
    ascensionLevel,
    amplifiers,
    resonance,
    anomalies,
    expeditionRank,
    eventCountdown,
    complexParameter,
    activityLog,
    lastZone,
  };
}

/**
 * Hook to access all game actions from the store
 */
export function useGameActions() {
  const spendFractalData = useGameStore((state) => state.spendFractalData);
  const addFractalData = useGameStore((state) => state.addFractalData);
  const incrementDepth = useGameStore((state) => state.incrementDepth);
  const spendDimensionalPoints = useGameStore((state) => state.spendDimensionalPoints);
  const incrementAmplifiers = useGameStore((state) => state.incrementAmplifiers);
  const addResonance = useGameStore((state) => state.addResonance);
  const addAnomalies = useGameStore((state) => state.addAnomalies);
  const incrementExpeditionRank = useGameStore((state) => state.incrementExpeditionRank);
  const setEventCountdown = useGameStore((state) => state.setEventCountdown);
  const decrementEventCountdown = useGameStore((state) => state.decrementEventCountdown);
  const incrementUpgrade = useGameStore((state) => state.incrementUpgrade);
  const pushActivityLog = useGameStore((state) => state.pushActivityLog);
  const setLastZone = useGameStore((state) => state.setLastZone);
  const setComplexParameter = useGameStore((state) => state.setComplexParameter);
  const performAscension = useGameStore((state) => state.performAscension);

  return {
    spendFractalData,
    addFractalData,
    incrementDepth,
    spendDimensionalPoints,
    incrementAmplifiers,
    addResonance,
    addAnomalies,
    incrementExpeditionRank,
    setEventCountdown,
    decrementEventCountdown,
    incrementUpgrade,
    pushActivityLog,
    setLastZone,
    setComplexParameter,
    performAscension,
  };
}
