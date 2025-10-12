export type CosmicSnapshot = {
  depth: number;
  resonance: number;
  anomalies: number;
  ascensionLevel: number;
  dimensionalPoints: number;
};

export type CosmicEventOutcome = {
  log: string;
  dataDelta?: number;
  resonanceDelta?: number;
  anomaliesDelta?: number;
  depthDelta?: number;
  dimensionalPointsDelta?: number;
};

export type CosmicEvent = {
  id: string;
  name: string;
  description: string;
  minDepth?: number;
  minResonance?: number;
  weight: number;
  apply: (snapshot: CosmicSnapshot) => CosmicEventOutcome;
};

const clampWeight = (value: number): number => (value > 0 ? value : 0.5);

export const COSMIC_EVENTS: CosmicEvent[] = [
  {
    id: "cantor-caravan",
    name: "Cantor Caravan",
    description: "Nomadic archivists deliver annotated caches of fractal lore.",
    weight: 3.2,
    apply: (snapshot) => {
      const dataGain = Math.round(
        60 + snapshot.depth * 12 + snapshot.resonance * 4,
      );
      return {
        dataDelta: dataGain,
        resonanceDelta: 1,
        log: `Nomadic archivists deposit ${dataGain} units of annotated detail.`,
      };
    },
  },
  {
    id: "sierpinski-storm",
    name: "Sierpinski Storm",
    description:
      "Triangular lightning scrambles collectors but energises the air.",
    weight: 2.1,
    apply: (snapshot) => {
      const lost = Math.round(30 + snapshot.depth * 8);
      const resonanceGain = 3 + Math.round(snapshot.anomalies * 0.5);
      return {
        dataDelta: -lost,
        resonanceDelta: resonanceGain,
        anomaliesDelta: 1,
        log: `Triangular lightning scatters ${lost} data but leaves ${resonanceGain} resonance crackling.`,
      };
    },
  },
  {
    id: "hilbert-scouts",
    name: "Hilbert Scout Fleet",
    description:
      "Space-filling drones weave shortcuts between zoom coordinates.",
    minDepth: 4,
    weight: 2,
    apply: (snapshot) => {
      const depthGain = 0.4 + snapshot.ascensionLevel * 0.1;
      const anomalyDrop = snapshot.anomalies > 0 ? -1 : 0;
      return {
        depthDelta: depthGain,
        anomaliesDelta: anomalyDrop,
        log: `Scouts weave Hilbert paths, mapping +${depthGain.toFixed(2)} depth${
          anomalyDrop ? " and calming an anomaly" : ""
        }.`,
      };
    },
  },
  {
    id: "lighthouse-of-julia",
    name: "Lighthouse of Julia",
    description: "A coherent beacon aligns the expedition across dimensions.",
    minDepth: 6,
    minResonance: 6,
    weight: 1.4,
    apply: (snapshot) => {
      const resonanceGain = 4 + Math.round(snapshot.ascensionLevel * 1.5);
      const dataGain = Math.round(85 + snapshot.resonance * 2);
      return {
        dataDelta: dataGain,
        resonanceDelta: resonanceGain,
        log: `The Julia lighthouse flares, granting ${resonanceGain} resonance and ${dataGain} data.`,
      };
    },
  },
  {
    id: "paradox-auditors",
    name: "Paradox Auditors",
    description: "The Bureau of Recursive Integrity pays a surprise visit.",
    minDepth: 2,
    weight: 1.1,
    apply: (snapshot) => {
      const removedAnomalies = Math.min(snapshot.anomalies, 2);
      const dpGain = removedAnomalies > 0 ? removedAnomalies : 0;
      return {
        anomaliesDelta: -removedAnomalies,
        dimensionalPointsDelta: dpGain,
        log:
          removedAnomalies > 0
            ? `Auditors resolve ${removedAnomalies} anomaly${removedAnomalies > 1 ? "ies" : ""}, refunding ${dpGain} Dimensional Points.`
            : "Auditors find nothing amiss but leave amused by your paperwork.",
      };
    },
  },
  {
    id: "temporal-tea-time",
    name: "Temporal Tea Time",
    description: "Chrono-sommeliers trade tea steeped in infinite loops.",
    minResonance: 3,
    weight: 1.6,
    apply: (snapshot) => {
      const resonanceSpend = Math.min(snapshot.resonance, 2);
      const dataGain = resonanceSpend > 0 ? 40 + resonanceSpend * 30 : 22;
      return {
        resonanceDelta: -resonanceSpend,
        dataDelta: dataGain,
        log: `Temporal tea steeps for ${resonanceSpend} resonance and condenses ${dataGain} data crystals.`,
      };
    },
  },
];

const meetsRequirement = (
  snapshot: CosmicSnapshot,
  event: CosmicEvent,
): boolean => {
  if (typeof event.minDepth === "number" && snapshot.depth < event.minDepth) {
    return false;
  }
  if (
    typeof event.minResonance === "number" &&
    snapshot.resonance < event.minResonance
  ) {
    return false;
  }
  return true;
};

export const resolveCosmicEvent = (
  snapshot: CosmicSnapshot,
  random: () => number = Math.random,
): { event: CosmicEvent; outcome: CosmicEventOutcome } => {
  const eligible = COSMIC_EVENTS.filter((event) =>
    meetsRequirement(snapshot, event),
  );
  const pool = eligible.length > 0 ? eligible : [COSMIC_EVENTS[0]];
  const totalWeight = pool.reduce(
    (sum, event) => sum + clampWeight(event.weight),
    0,
  );
  const target = random() * (totalWeight > 0 ? totalWeight : pool.length);

  let cumulative = 0;
  let selected = pool[0];
  for (const event of pool) {
    cumulative += clampWeight(event.weight);
    if (target <= cumulative) {
      selected = event;
      break;
    }
  }

  return { event: selected, outcome: selected.apply(snapshot) };
};
