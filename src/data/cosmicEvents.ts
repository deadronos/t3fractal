/**
 * Cosmic Events Data Catalog
 * 
 * Static event definitions for the cosmic event system.
 * Events are randomly triggered during gameplay based on player state.
 */

/**
 * A snapshot of the player's current game state, used to evaluate event conditions.
 */
export type CosmicSnapshot = {
  /** Current zoom depth. */
  depth: number;
  /** Current resonance level. */
  resonance: number;
  /** Number of active anomalies. */
  anomalies: number;
  /** Current ascension level. */
  ascensionLevel: number;
  /** Current dimensional points. */
  dimensionalPoints: number;
};

/**
 * The outcome of a cosmic event, detailing changes to resources and a log message.
 */
export type CosmicEventOutcome = {
  /** The message to display in the activity log. */
  log: string;
  /** Change in fractal data (positive or negative). */
  dataDelta?: number;
  /** Change in resonance. */
  resonanceDelta?: number;
  /** Change in anomaly count. */
  anomaliesDelta?: number;
  /** Change in depth. */
  depthDelta?: number;
  /** Change in dimensional points. */
  dimensionalPointsDelta?: number;
};

/**
 * Definition of a random cosmic event.
 */
export type CosmicEvent = {
  /** Unique identifier for the event. */
  id: string;
  /** Display name of the event. */
  name: string;
  /** Flavor text description. */
  description: string;
  /** Minimum depth required for this event to trigger. */
  minDepth?: number;
  /** Minimum resonance required for this event to trigger. */
  minResonance?: number;
  /** Relative weight of this event (probability of occurrence). */
  weight: number;
  /**
   * Function to apply the event's effects.
   * @param snapshot - The current game state snapshot.
   * @returns The outcome of the event.
   */
  apply: (snapshot: CosmicSnapshot) => CosmicEventOutcome;
};

/**
 * Complete catalog of cosmic events.
 * Each event has requirements, weights, and outcome functions.
 */
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
