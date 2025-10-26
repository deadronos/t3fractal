/**
 * Cost Formula Utilities
 * 
 * Provides calculations for various game costs (upgrades, zoom, expeditions, etc.)
 */

import type { UpgradeKey } from "@/store/gameStore";
import { UPGRADE_CONFIG } from "@/data/gameConfig";

/**
 * Calculate the cost of the next upgrade level.
 * 
 * @param key - The upgrade key
 * @param owned - Number of upgrades already owned
 * @returns Cost for the next upgrade
 */
export const calculateUpgradeCost = (key: UpgradeKey, owned: number): number => {
  const config = UPGRADE_CONFIG[key];
  return Math.floor(config.baseCost * Math.pow(config.growth, owned));
};

/**
 * Calculate the cost to zoom to the next depth level.
 * 
 * @param nextDepthLevel - The target depth level (floor(depth) + 1)
 * @returns Cost to reach that depth
 */
export const calculateZoomCost = (nextDepthLevel: number): number => {
  return Math.floor(18 * Math.pow(1.55, nextDepthLevel));
};

/**
 * Calculate the cost of an expedition based on current game state.
 * 
 * @param depth - Current depth
 * @param ascensionLevel - Current ascension level
 * @param expeditionRank - Current expedition rank
 * @returns Expedition cost
 */
export const calculateExpeditionCost = (
  depth: number,
  ascensionLevel: number,
  expeditionRank: number,
): number => {
  return Math.floor(90 + depth * 25 + ascensionLevel * 35 + expeditionRank * 20);
};

/**
 * Calculate the dimensional points preview from an expedition.
 * 
 * @param depth - Current depth
 * @param resonance - Current resonance
 * @param ascensionLevel - Current ascension level
 * @returns Expected dimensional points from expedition
 */
export const calculateExpeditionPreview = (
  depth: number,
  resonance: number,
  ascensionLevel: number,
): number => {
  return Math.floor(6 + depth * 0.6 + resonance * 0.3 + ascensionLevel * 1.5);
};

/**
 * Calculate the cost to stabilize (remove anomalies).
 * 
 * @param anomalies - Current anomaly count
 * @param ascensionLevel - Current ascension level
 * @returns Stabilization cost
 */
export const calculateStabiliseCost = (
  anomalies: number,
  ascensionLevel: number,
): number => {
  return Math.floor(24 + anomalies * 9 + ascensionLevel * 6);
};
