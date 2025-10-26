import { describe, it, expect } from "vitest";
import {
  calculateUpgradeCost,
  calculateZoomCost,
  calculateExpeditionCost,
  calculateExpeditionPreview,
  calculateStabiliseCost,
} from "@/lib/gameplay/costFormulas";

describe("costFormulas", () => {
  describe("calculateUpgradeCost", () => {
    it("calculates probe upgrade cost with exponential growth", () => {
      expect(calculateUpgradeCost("probe", 0)).toBe(35); // base cost
      expect(calculateUpgradeCost("probe", 1)).toBe(50); // 35 * 1.45^1 = 50.75 -> 50
      expect(calculateUpgradeCost("probe", 2)).toBe(73); // 35 * 1.45^2 = 73.58 -> 73
    });

    it("calculates processor upgrade cost", () => {
      expect(calculateUpgradeCost("processor", 0)).toBe(120);
      expect(calculateUpgradeCost("processor", 1)).toBe(192); // 120 * 1.6 = 192
    });

    it("calculates stabilizer upgrade cost", () => {
      expect(calculateUpgradeCost("stabilizer", 0)).toBe(220);
      expect(calculateUpgradeCost("stabilizer", 1)).toBe(341); // 220 * 1.55 = 341
    });
  });

  describe("calculateZoomCost", () => {
    it("calculates zoom cost for different depth levels", () => {
      expect(calculateZoomCost(1)).toBe(27); // 18 * 1.55^1 = 27.9 -> 27
      expect(calculateZoomCost(2)).toBe(43); // 18 * 1.55^2 = 43.245 -> 43
      expect(calculateZoomCost(5)).toBe(161); // 18 * 1.55^5 = 161.3 -> 161
    });
  });

  describe("calculateExpeditionCost", () => {
    it("calculates expedition cost based on game state", () => {
      expect(calculateExpeditionCost(0, 0, 0)).toBe(90); // base cost
      expect(calculateExpeditionCost(5, 2, 1)).toBe(305); // 90 + 5*25 + 2*35 + 1*20 = 305
      expect(calculateExpeditionCost(10, 5, 3)).toBe(575); // 90 + 10*25 + 5*35 + 3*20 = 575
    });
  });

  describe("calculateExpeditionPreview", () => {
    it("calculates expected dimensional points from expedition", () => {
      expect(calculateExpeditionPreview(0, 0, 0)).toBe(6); // base value
      expect(calculateExpeditionPreview(10, 5, 2)).toBe(16); // 6 + 10*0.6 + 5*0.3 + 2*1.5 = 16.5 -> 16
      expect(calculateExpeditionPreview(20, 10, 5)).toBe(28); // 6 + 20*0.6 + 10*0.3 + 5*1.5 = 27.5 -> 27
    });
  });

  describe("calculateStabiliseCost", () => {
    it("calculates stabilization cost based on anomalies", () => {
      expect(calculateStabiliseCost(0, 0)).toBe(24); // base cost
      expect(calculateStabiliseCost(3, 2)).toBe(63); // 24 + 3*9 + 2*6 = 63
      expect(calculateStabiliseCost(5, 5)).toBe(99); // 24 + 5*9 + 5*6 = 99
    });
  });
});
