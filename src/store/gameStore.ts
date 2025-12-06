import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Valid keys for purchasable upgrades.
 */
export type UpgradeKey = "probe" | "processor" | "stabilizer";

/**
 * Represents a complex number parameter (real and imaginary parts).
 */
export type ComplexParameter = {
  /** The real component of the complex number. */
  real: number;
  /** The imaginary component of the complex number. */
  imaginary: number;
};

/**
 * State object tracking the level of each upgrade.
 */
export type UpgradeState = Record<UpgradeKey, number>;

/**
 * The main interface for the Game State.
 *
 * This interface defines all reactive state and actions available in the global store.
 */
export interface GameState {
  // Core resources
  /** Current amount of Fractal Data currency. */
  fractalData: number;
  /** Current amount of Dimensional Points (prestige currency). */
  dimensionalPoints: number;
  
  // Exploration state
  /** Current exploration depth (zoom level). */
  depth: number;
  /** Current center coordinates in the complex plane. */
  complexParameter: ComplexParameter;
  
  // Progression state
  /** Current ascension level (first prestige tier). */
  ascensionLevel: number;
  /** Number of amplifiers owned. */
  amplifiers: number;
  /** Current resonance value affecting production. */
  resonance: number;
  /** Number of active anomalies. */
  anomalies: number;
  /** Current rank in the expedition. */
  expeditionRank: number;
  /** Current transcension level (second prestige tier). */
  transcensionLevel: number;
  /** Amount of harmonic cores owned. */
  harmonicCores: number;

  // Upgrades
  /** Current levels for all upgrades. */
  upgrades: UpgradeState;

  // Julia research
  /** Current flux resource for Julia sets. */
  juliaFlux: number;
  /** Current exploration depth in Julia set. */
  juliaDepth: number;
  /** Constant parameter defining the current Julia set. */
  juliaConstant: ComplexParameter;

  // UI state
  /** Countdown timer for the next random event. */
  eventCountdown: number;
  /** Log of recent game activities and events. */
  activityLog: string[];
  /** Name of the last visited fractal zone. */
  lastZone: string;
  
  // Actions - Resources
  /**
   * Adds fractal data to the player's balance.
   * @param amount - The amount to add.
   */
  addFractalData: (amount: number) => void;
  /**
   * Attempts to spend fractal data.
   * @param amount - The amount to spend.
   * @returns True if the transaction was successful, false if insufficient funds.
   */
  spendFractalData: (amount: number) => boolean;
  /**
   * Sets the fractal data balance directly.
   * @param amount - The new balance.
   */
  setFractalData: (amount: number) => void;
  
  /**
   * Adds dimensional points to the player's balance.
   * @param amount - The amount to add.
   */
  addDimensionalPoints: (amount: number) => void;
  /**
   * Attempts to spend dimensional points.
   * @param amount - The amount to spend.
   * @returns True if successful, false otherwise.
   */
  spendDimensionalPoints: (amount: number) => boolean;
  /**
   * Sets the dimensional points balance directly.
   * @param amount - The new balance.
   */
  setDimensionalPoints: (amount: number) => void;
  
  // Actions - Exploration
  /**
   * Sets the current zoom depth.
   * @param depth - The new depth value.
   */
  setDepth: (depth: number) => void;
  /**
   * Increments the zoom depth by a given amount.
   * @param amount - The amount to increase depth by.
   */
  incrementDepth: (amount: number) => void;
  /**
   * Updates the complex plane coordinates.
   * @param params - Partial complex parameter to update (real or imaginary or both).
   */
  setComplexParameter: (params: Partial<ComplexParameter>) => void;
  
  // Actions - Progression
  /**
   * Sets the ascension level.
   * @param level - The new level.
   */
  setAscensionLevel: (level: number) => void;
  /**
   * Increments the ascension level by 1.
   */
  incrementAscensionLevel: () => void;
  
  /**
   * Sets the number of amplifiers.
   * @param count - The new count.
   */
  setAmplifiers: (count: number) => void;
  /**
   * Increments the number of amplifiers by 1.
   */
  incrementAmplifiers: () => void;
  
  /**
   * Sets the resonance value.
   * @param amount - The new value.
   */
  setResonance: (amount: number) => void;
  /**
   * Adds to the current resonance value.
   * @param amount - The amount to add.
   */
  addResonance: (amount: number) => void;

  /**
   * Sets the number of anomalies.
   * @param count - The new count.
   */
  setAnomalies: (count: number) => void;
  /**
   * Adds to the anomaly count.
   * @param count - The amount to add.
   */
  addAnomalies: (count: number) => void;
  /**
   * Removes one anomaly.
   */
  removeAnomaly: () => void;

  /**
   * Sets the expedition rank.
   * @param rank - The new rank.
   */
  setExpeditionRank: (rank: number) => void;
  /**
   * Increments the expedition rank by 1.
   */
  incrementExpeditionRank: () => void;

  // Actions - Second Prestige / Julia Lab
  /**
   * Sets the transcension level.
   * @param level - The new level.
   */
  setTranscensionLevel: (level: number) => void;
  /**
   * Increments the transcension level by 1.
   */
  incrementTranscensionLevel: () => void;
  /**
   * Sets the number of harmonic cores.
   * @param amount - The new amount.
   */
  setHarmonicCores: (amount: number) => void;
  /**
   * Adds harmonic cores.
   * @param amount - The amount to add.
   */
  addHarmonicCores: (amount: number) => void;

  /**
   * Sets the Julia flux amount.
   * @param amount - The new amount.
   */
  setJuliaFlux: (amount: number) => void;
  /**
   * Adds Julia flux.
   * @param amount - The amount to add.
   */
  addJuliaFlux: (amount: number) => void;
  /**
   * Attempts to spend Julia flux.
   * @param amount - The amount to spend.
   * @returns True if successful, false otherwise.
   */
  spendJuliaFlux: (amount: number) => boolean;
  /**
   * Sets the Julia set exploration depth.
   * @param depth - The new depth.
   */
  setJuliaDepth: (depth: number) => void;
  /**
   * Increments the Julia set depth.
   * @param amount - The amount to add.
   */
  incrementJuliaDepth: (amount: number) => void;
  /**
   * Updates the Julia constant parameter.
   * @param params - Partial complex parameter to update.
   */
  setJuliaConstant: (params: Partial<ComplexParameter>) => void;

  // Actions - Upgrades
  /**
   * Sets the level of a specific upgrade.
   * @param key - The upgrade key.
   * @param level - The new level.
   */
  setUpgradeLevel: (key: UpgradeKey, level: number) => void;
  /**
   * Increments an upgrade level by 1.
   * @param key - The upgrade key.
   */
  incrementUpgrade: (key: UpgradeKey) => void;
  /**
   * Resets all upgrades to level 0.
   */
  resetUpgrades: () => void;
  
  // Actions - UI
  /**
   * Sets the event countdown timer.
   * @param seconds - Seconds remaining.
   */
  setEventCountdown: (seconds: number) => void;
  /**
   * Decrements the event countdown by 1.
   * @returns The new countdown value.
   */
  decrementEventCountdown: () => number;
  
  /**
   * Adds a message to the activity log.
   * @param message - The message to log.
   */
  pushActivityLog: (message: string) => void;
  /**
   * Clears the activity log.
   */
  clearActivityLog: () => void;
  
  /**
   * Sets the name of the last visited zone.
   * @param zoneName - The zone name.
   */
  setLastZone: (zoneName: string) => void;
  
  // Actions - Game Management
  /**
   * Resets the entire game to initial state.
   */
  resetGame: () => void;
  /**
   * Performs the Ascension prestige reset.
   *
   * Resets exploration and basic resources, grants dimensional points.
   * @param yieldPoints - The amount of Dimensional Points to grant.
   */
  performAscension: (yieldPoints: number) => void;
  /**
   * Performs the Transcendence prestige reset.
   *
   * Resets Ascension progress, grants Harmonic Cores.
   * @param yieldCores - The amount of Harmonic Cores to grant.
   */
  performTranscendence: (yieldCores: number) => void;
}

const DIMENSIONAL_TARGET: ComplexParameter = { real: -0.75, imaginary: 0.11 };

const initialState = {
  // Core resources
  fractalData: 42,
  dimensionalPoints: 0,
  
  // Exploration state
  depth: 0,
  complexParameter: { ...DIMENSIONAL_TARGET },
  
  // Progression state
  ascensionLevel: 0,
  amplifiers: 0,
  resonance: 4,
  anomalies: 0,
  expeditionRank: 0,
  transcensionLevel: 0,
  harmonicCores: 0,

  // Upgrades
  upgrades: {
    probe: 0,
    processor: 0,
    stabilizer: 0,
  } as UpgradeState,

  // Julia research
  juliaFlux: 0,
  juliaDepth: 0,
  juliaConstant: { real: -0.122, imaginary: 0.744 },

  // UI state
  eventCountdown: 18,
  activityLog: ["Begin exploration: calibrating renderers…"],
  lastZone: "Mandelbrot Core",
};

/**
 * Zustand store hook for managing global game state.
 *
 * Persists data to localStorage using 'fractal-frontier-game-state' key.
 */
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Resource actions
      addFractalData: (amount: number) =>
        set((state) => ({ fractalData: state.fractalData + amount })),
      
      spendFractalData: (amount: number) => {
        const state = get();
        if (state.fractalData < amount) {
          return false;
        }
        set({ fractalData: state.fractalData - amount });
        return true;
      },
      
      setFractalData: (amount: number) =>
        set({ fractalData: Math.max(0, amount) }),
      
      addDimensionalPoints: (amount: number) =>
        set((state) => ({ dimensionalPoints: state.dimensionalPoints + amount })),
      
      spendDimensionalPoints: (amount: number) => {
        const state = get();
        if (state.dimensionalPoints < amount) {
          return false;
        }
        set({ dimensionalPoints: state.dimensionalPoints - amount });
        return true;
      },
      
      setDimensionalPoints: (amount: number) =>
        set({ dimensionalPoints: Math.max(0, amount) }),
      
      // Exploration actions
      setDepth: (depth: number) =>
        set({ depth: Math.max(0, depth) }),
      
      incrementDepth: (amount: number) =>
        set((state) => ({ depth: Math.max(0, state.depth + amount) })),
      
      setComplexParameter: (params: Partial<ComplexParameter>) =>
        set((state) => ({
          complexParameter: { ...state.complexParameter, ...params },
        })),
      
      // Progression actions
      setAscensionLevel: (level: number) =>
        set({ ascensionLevel: Math.max(0, level) }),
      
      incrementAscensionLevel: () =>
        set((state) => ({ ascensionLevel: state.ascensionLevel + 1 })),
      
      setAmplifiers: (count: number) =>
        set({ amplifiers: Math.max(0, count) }),
      
      incrementAmplifiers: () =>
        set((state) => ({ amplifiers: state.amplifiers + 1 })),
      
      setResonance: (amount: number) =>
        set({ resonance: Math.max(0, amount) }),
      
      addResonance: (amount: number) =>
        set((state) => ({ resonance: Math.max(0, state.resonance + amount) })),
      
      setAnomalies: (count: number) =>
        set({ anomalies: Math.max(0, count) }),
      
      addAnomalies: (count: number) =>
        set((state) => ({ anomalies: Math.max(0, state.anomalies + count) })),
      
      removeAnomaly: () =>
        set((state) => ({ anomalies: Math.max(0, state.anomalies - 1) })),
      
      setExpeditionRank: (rank: number) =>
        set({ expeditionRank: Math.max(0, rank) }),

      incrementExpeditionRank: () =>
        set((state) => ({ expeditionRank: state.expeditionRank + 1 })),

      // Second prestige / Julia lab actions
      setTranscensionLevel: (level: number) =>
        set({ transcensionLevel: Math.max(0, level) }),

      incrementTranscensionLevel: () =>
        set((state) => ({ transcensionLevel: state.transcensionLevel + 1 })),

      setHarmonicCores: (amount: number) =>
        set({ harmonicCores: Math.max(0, amount) }),

      addHarmonicCores: (amount: number) =>
        set((state) => ({ harmonicCores: Math.max(0, state.harmonicCores + amount) })),

      setJuliaFlux: (amount: number) =>
        set({ juliaFlux: Math.max(0, amount) }),

      addJuliaFlux: (amount: number) =>
        set((state) => ({ juliaFlux: Math.max(0, state.juliaFlux + amount) })),

      spendJuliaFlux: (amount: number) => {
        const state = get();
        if (state.juliaFlux < amount) {
          return false;
        }
        set({ juliaFlux: state.juliaFlux - amount });
        return true;
      },

      setJuliaDepth: (depth: number) =>
        set({ juliaDepth: Math.max(0, depth) }),

      incrementJuliaDepth: (amount: number) =>
        set((state) => ({ juliaDepth: Math.max(0, state.juliaDepth + amount) })),

      setJuliaConstant: (params: Partial<ComplexParameter>) =>
        set((state) => ({
          juliaConstant: { ...state.juliaConstant, ...params },
        })),

      // Upgrade actions
      setUpgradeLevel: (key: UpgradeKey, level: number) =>
        set((state) => ({
          upgrades: { ...state.upgrades, [key]: Math.max(0, level) },
        })),
      
      incrementUpgrade: (key: UpgradeKey) =>
        set((state) => ({
          upgrades: { ...state.upgrades, [key]: state.upgrades[key] + 1 },
        })),
      
      resetUpgrades: () =>
        set({
          upgrades: {
            probe: 0,
            processor: 0,
            stabilizer: 0,
          },
        }),
      
      // UI actions
      setEventCountdown: (seconds: number) =>
        set({ eventCountdown: Math.max(0, seconds) }),
      
      decrementEventCountdown: () => {
        const state = get();
        const newValue = Math.max(0, state.eventCountdown - 1);
        set({ eventCountdown: newValue });
        return newValue;
      },
      
      pushActivityLog: (message: string) =>
        set((state) => ({
          activityLog: [message, ...state.activityLog].slice(0, 6),
        })),
      
      clearActivityLog: () =>
        set({ activityLog: [] }),
      
      setLastZone: (zoneName: string) =>
        set({ lastZone: zoneName }),
      
      // Game management actions
      resetGame: () =>
        set(initialState),

      performAscension: (yieldPoints: number) =>
        set((state) => ({
          dimensionalPoints: state.dimensionalPoints + yieldPoints,
          ascensionLevel: state.ascensionLevel + 1,
          fractalData: 40 + yieldPoints * 15,
          depth: 0,
          upgrades: {
            probe: 0,
            processor: 0,
            stabilizer: 0,
          },
          amplifiers: 0,
          resonance: Math.max(3, Math.floor(state.resonance * 0.35) + yieldPoints),
          anomalies: 0,
          eventCountdown: 18,
          expeditionRank: 0,
        })),

      performTranscendence: (yieldCores: number) =>
        set((state) => ({
          harmonicCores: state.harmonicCores + yieldCores,
          transcensionLevel: state.transcensionLevel + 1,
          dimensionalPoints: 0,
          ascensionLevel: 0,
          fractalData: 60 + yieldCores * 20,
          depth: 0,
          upgrades: {
            probe: 0,
            processor: 0,
            stabilizer: 0,
          },
          amplifiers: 0,
          resonance: Math.max(
            5,
            Math.floor(state.resonance * 0.45) + yieldCores * 2,
          ),
          anomalies: 0,
          eventCountdown: 18,
          expeditionRank: 0,
          juliaFlux: 0,
          juliaDepth: 0,
          complexParameter: { ...DIMENSIONAL_TARGET },
          juliaConstant: { ...initialState.juliaConstant },
          lastZone: "Mandelbrot Core",
        })),
    }),
    {
      name: "fractal-frontier-game-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist game state, not UI state
        fractalData: state.fractalData,
        dimensionalPoints: state.dimensionalPoints,
        depth: state.depth,
        complexParameter: state.complexParameter,
        ascensionLevel: state.ascensionLevel,
        amplifiers: state.amplifiers,
        resonance: state.resonance,
        anomalies: state.anomalies,
        expeditionRank: state.expeditionRank,
        transcensionLevel: state.transcensionLevel,
        harmonicCores: state.harmonicCores,
        juliaFlux: state.juliaFlux,
        juliaDepth: state.juliaDepth,
        juliaConstant: state.juliaConstant,
        upgrades: state.upgrades,
        lastZone: state.lastZone,
      }),
    }
  )
);
