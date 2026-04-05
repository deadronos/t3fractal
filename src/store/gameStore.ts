import { create } from "zustand";
import {
  BASE_STEP,
  GEOMETRY_OPTIONS,
  MAX_ITERATIONS,
  SEASON_ORDER,
  SEASONS,
  type GeometryType,
  type SeasonId,
  RULE_LIBRARY,
  SEED_UPGRADES,
  getSeedYield,
  getIterationCost,
  getWidthCost,
  getTickCost,
  getFruitCost,
} from "@/lib/gameData";

export type ResourceRates = {
  photosynthesis: number;
  sap: number;
};

export type GameState = {
  season: SeasonId;
  photosynthesis: number;
  sap: number;
  seeds: number;
  lifetimeSeeds: number;
  fruit: number;
  iterations: number;
  widthLevel: number;
  tickLevel: number;
  angle: number;
  step: number;
  axiom: string;
  activeRules: Record<string, string>;
  unlockedRules: string[];
  analysisMode: boolean;
  selectedGeometry: GeometryType;
  purchasedSeedUpgrades: string[];
  lastMutation: number;
  lastRuleChanged: string | null;
  _performUpgrade: (cost: number, currency: "photosynthesis" | "sap" | "seeds", updater: Partial<GameState>) => boolean;
  addResources: (dt: number, rates: ResourceRates) => void;
  setAngle: (angle: number) => void;
  toggleAnalysis: () => void;
  advanceSeason: () => void;
  buyIteration: () => void;
  buyWidth: () => void;
  buyTickRate: () => void;
  buyFruit: () => void;
  unlockRule: (ruleId: string) => void;
  setActiveRule: (symbol: string, ruleId: string) => void;
  applyAxiom: (axiom: string, cost: number) => boolean;
  selectGeometry: (geometry: GeometryType) => void;
  buySeedUpgrade: (upgradeId: string) => void;
  harvest: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  season: "spring",
  photosynthesis: 0,
  sap: 0,
  seeds: 0,
  lifetimeSeeds: 0,
  fruit: 0,
  iterations: 3,
  widthLevel: 0,
  tickLevel: 0,
  angle: 28,
  step: BASE_STEP,
  axiom: "X",
  activeRules: { X: "sprout", F: "stem" },
  unlockedRules: ["sprout", "stem"],
  analysisMode: false,
  selectedGeometry: "cylinder",
  purchasedSeedUpgrades: [],
  lastMutation: Date.now(),
  lastRuleChanged: null,
  _performUpgrade: (cost: number, currency: "photosynthesis" | "sap" | "seeds", updater: Partial<GameState>) => {
    const state = get();
    if (state[currency] < cost) return false;
    set({ [currency]: state[currency] - cost, ...updater, lastMutation: Date.now() });
    return true;
  },
  addResources: (dt, rates) => {
    if (dt <= 0) return;
    set((state) => ({
      photosynthesis: state.photosynthesis + rates.photosynthesis * dt,
      sap: state.sap + rates.sap * dt,
    }));
  },
  setAngle: (angle) => {
    const clamped = Math.max(0, Math.min(90, angle));
    set({ angle: clamped });
  },
  toggleAnalysis: () => set((state) => ({ analysisMode: !state.analysisMode })),
  advanceSeason: () => {
    const currentIndex = SEASON_ORDER.indexOf(get().season);
    const next = SEASON_ORDER[(currentIndex + 1) % SEASON_ORDER.length];
    set({ season: next });
  },
  buyIteration: () => {
    const state = get();
    if (state.iterations >= MAX_ITERATIONS) return;
    const cost = getIterationCost(state.iterations, state.season);
    get()._performUpgrade(cost, "photosynthesis", { iterations: state.iterations + 1 });
  },
  buyWidth: () => {
    const state = get();
    const cost = getWidthCost(state.widthLevel, state.season);
    get()._performUpgrade(cost, "sap", { widthLevel: state.widthLevel + 1 });
  },
  buyTickRate: () => {
    const state = get();
    const cost = getTickCost(state.tickLevel, state.season);
    get()._performUpgrade(cost, "sap", { tickLevel: state.tickLevel + 1 });
  },
  buyFruit: () => {
    const state = get();
    if (state.season !== "autumn") return;
    const cost = getFruitCost(state.fruit, state.season);
    get()._performUpgrade(cost, "sap", { fruit: state.fruit + 1 });
  },
  unlockRule: (ruleId) => {
    const state = get();
    if (state.unlockedRules.includes(ruleId)) return;
    const rule = RULE_LIBRARY.find((entry) => entry.id === ruleId);
    if (!rule) return;
    if (rule.requires?.pitch && !state.purchasedSeedUpgrades.includes("pitch")) return;
    if (rule.requires?.roll && !state.purchasedSeedUpgrades.includes("roll")) return;
    const photoCost = rule.cost.photosynthesis ?? 0;
    const sapCost = rule.cost.sap ?? 0;
    const seedCost = rule.cost.seeds ?? 0;
    if (
      state.photosynthesis < photoCost ||
      state.sap < sapCost ||
      state.seeds < seedCost
    ) {
      return;
    }
    set({
      photosynthesis: state.photosynthesis - photoCost,
      sap: state.sap - sapCost,
      seeds: state.seeds - seedCost,
      unlockedRules: [...state.unlockedRules, ruleId],
      activeRules: { ...state.activeRules, [rule.symbol]: ruleId },
      lastMutation: Date.now(),
      lastRuleChanged: ruleId,
    });
  },
  setActiveRule: (symbol, ruleId) => {
    const state = get();
    if (!state.unlockedRules.includes(ruleId)) return;
    set({
      activeRules: { ...state.activeRules, [symbol]: ruleId },
      lastMutation: Date.now(),
      lastRuleChanged: ruleId,
    });
  },
  applyAxiom: (axiom, cost) => {
    const state = get();
    if (!axiom.trim()) return false;
    if (state.photosynthesis < cost) return false;
    set({
      photosynthesis: state.photosynthesis - cost,
      axiom: axiom.trim().toUpperCase(),
      lastMutation: Date.now(),
      lastRuleChanged: null,
    });
    return true;
  },
  selectGeometry: (geometry) => {
    const state = get();
    if (geometry !== "cylinder" && !state.purchasedSeedUpgrades.includes(`geometry_${geometry}`)) return;
    set({ selectedGeometry: geometry });
  },
  buySeedUpgrade: (upgradeId) => {
    const state = get();
    if (state.purchasedSeedUpgrades.includes(upgradeId)) return;
    const upgrade = SEED_UPGRADES.find((entry) => entry.id === upgradeId);
    if (!upgrade) return;
    get()._performUpgrade(upgrade.cost, "seeds", { purchasedSeedUpgrades: [...state.purchasedSeedUpgrades, upgradeId] });
  },
  harvest: () => {
    const state = get();
    if (state.season !== "winter") return;
    const seedsEarned = getSeedYield(state.photosynthesis, state.sap, state.fruit);
    set({
      seeds: state.seeds + seedsEarned,
      lifetimeSeeds: state.lifetimeSeeds + seedsEarned,
      photosynthesis: 0,
      sap: 0,
      fruit: 0,
      iterations: 3,
      widthLevel: 0,
      tickLevel: 0,
      angle: 28,
      axiom: "X",
      activeRules: { X: "sprout", F: "stem" },
      unlockedRules: ["sprout", "stem"],
      season: "spring",
      selectedGeometry: "cylinder",
      lastMutation: Date.now(),
      lastRuleChanged: null,
    });
  },
}));

export function getActiveRuleMap(activeRules: Record<string, string>): Record<string, string> {
  const ruleMap: Record<string, string> = {};
  for (const [symbol, ruleId] of Object.entries(activeRules)) {
    const rule = RULE_LIBRARY.find((entry) => entry.id === ruleId);
    if (rule) {
      ruleMap[symbol] = rule.replacement;
    }
  }
  return ruleMap;
}

export function getGeometryLabel(geometry: GeometryType): string {
  const option = GEOMETRY_OPTIONS.find((entry) => entry.id === geometry);
  return option?.name ?? geometry;
}

export function getSeasonLabel(season: SeasonId): string {
  return SEASONS[season]?.name ?? season;
}
