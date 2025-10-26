import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Type definitions
export type UpgradeKey = "probe" | "processor" | "stabilizer";

export type ComplexParameter = {
  real: number;
  imaginary: number;
};

export type UpgradeState = Record<UpgradeKey, number>;

export interface GameState {
  // Core resources
  fractalData: number;
  dimensionalPoints: number;
  
  // Exploration state
  depth: number;
  complexParameter: ComplexParameter;
  
  // Progression state
  ascensionLevel: number;
  amplifiers: number;
  resonance: number;
  anomalies: number;
  expeditionRank: number;
  
  // Upgrades
  upgrades: UpgradeState;
  
  // UI state
  eventCountdown: number;
  activityLog: string[];
  lastZone: string;
  
  // Actions - Resources
  addFractalData: (amount: number) => void;
  spendFractalData: (amount: number) => boolean;
  setFractalData: (amount: number) => void;
  
  addDimensionalPoints: (amount: number) => void;
  spendDimensionalPoints: (amount: number) => boolean;
  setDimensionalPoints: (amount: number) => void;
  
  // Actions - Exploration
  setDepth: (depth: number) => void;
  incrementDepth: (amount: number) => void;
  setComplexParameter: (params: Partial<ComplexParameter>) => void;
  
  // Actions - Progression
  setAscensionLevel: (level: number) => void;
  incrementAscensionLevel: () => void;
  
  setAmplifiers: (count: number) => void;
  incrementAmplifiers: () => void;
  
  setResonance: (amount: number) => void;
  addResonance: (amount: number) => void;
  
  setAnomalies: (count: number) => void;
  addAnomalies: (count: number) => void;
  removeAnomaly: () => void;
  
  setExpeditionRank: (rank: number) => void;
  incrementExpeditionRank: () => void;
  
  // Actions - Upgrades
  setUpgradeLevel: (key: UpgradeKey, level: number) => void;
  incrementUpgrade: (key: UpgradeKey) => void;
  resetUpgrades: () => void;
  
  // Actions - UI
  setEventCountdown: (seconds: number) => void;
  decrementEventCountdown: () => number;
  
  pushActivityLog: (message: string) => void;
  clearActivityLog: () => void;
  
  setLastZone: (zoneName: string) => void;
  
  // Actions - Game Management
  resetGame: () => void;
  performAscension: (yieldPoints: number) => void;
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
  
  // Upgrades
  upgrades: {
    probe: 0,
    processor: 0,
    stabilizer: 0,
  } as UpgradeState,
  
  // UI state
  eventCountdown: 18,
  activityLog: ["Begin exploration: calibrating renderers…"],
  lastZone: "Mandelbrot Core",
};

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
        upgrades: state.upgrades,
        lastZone: state.lastZone,
      }),
    }
  )
);
