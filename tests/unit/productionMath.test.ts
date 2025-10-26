import { describe, it, expect } from "vitest";
import {
  calculateProductionMultiplier,
  calculateParameterEfficiency,
  calculateBaseProduction,
  calculatePassiveDepthGain,
  calculateZoneBonus,
} from "@/lib/gameplay/productionMath";

describe("productionMath", () => {
  describe("calculateProductionMultiplier", () => {
    it("calculates multiplier with no bonuses", () => {
      const result = calculateProductionMultiplier({
        ascensionLevel: 0,
        amplifiers: 0,
        depth: 0,
        dimensionalPoints: 0,
        resonance: 0,
        anomalies: 0,
      });
      expect(result).toBe(1); // All bonuses are 1.0, multiplied together = 1
    });

    it("includes ascension and amplifier bonuses", () => {
      const result = calculateProductionMultiplier({
        ascensionLevel: 2,
        amplifiers: 3,
        depth: 0,
        dimensionalPoints: 0,
        resonance: 0,
        anomalies: 0,
      });
      // ascensionBonus = 1 + 2*0.25 + 3*0.35 = 2.55
      expect(result).toBeCloseTo(2.55, 2);
    });

    it("applies depth bonus", () => {
      const result = calculateProductionMultiplier({
        ascensionLevel: 0,
        amplifiers: 0,
        depth: 10,
        dimensionalPoints: 0,
        resonance: 0,
        anomalies: 0,
      });
      // depthBonus = 1 + floor(10)*0.05 = 1.5
      expect(result).toBeCloseTo(1.5, 2);
    });

    it("applies anomaly penalty", () => {
      const result = calculateProductionMultiplier({
        ascensionLevel: 0,
        amplifiers: 0,
        depth: 0,
        dimensionalPoints: 0,
        resonance: 0,
        anomalies: 5,
      });
      // anomalyPenalty = max(0.6, 1 - 5*0.03) = max(0.6, 0.85) = 0.85
      expect(result).toBeCloseTo(0.85, 2);
    });

    it("limits anomaly penalty to minimum 0.6", () => {
      const result = calculateProductionMultiplier({
        ascensionLevel: 0,
        amplifiers: 0,
        depth: 0,
        dimensionalPoints: 0,
        resonance: 0,
        anomalies: 20,
      });
      // anomalyPenalty = max(0.6, 1 - 20*0.03) = 0.6
      expect(result).toBeCloseTo(0.6, 2);
    });
  });

  describe("calculateParameterEfficiency", () => {
    it("returns high efficiency when at target", () => {
      const result = calculateParameterEfficiency(
        { real: -0.75, imaginary: 0.11 },
        { real: -0.75, imaginary: 0.11 }
      );
      expect(result).toBeCloseTo(1.45, 2);
    });

    it("returns lower efficiency when far from target", () => {
      const result = calculateParameterEfficiency(
        { real: 0, imaginary: 0 },
        { real: -0.75, imaginary: 0.11 }
      );
      // distance = sqrt(0.75^2 + 0.11^2) ≈ 0.758
      // efficiency = max(0.65, 1.45 - 0.758*1.1) = max(0.65, 0.616) = 0.65
      expect(result).toBeCloseTo(0.65, 2);
    });

    it("limits minimum efficiency to 0.65", () => {
      const result = calculateParameterEfficiency(
        { real: 10, imaginary: 10 },
        { real: -0.75, imaginary: 0.11 }
      );
      expect(result).toBe(0.65);
    });
  });

  describe("calculateBaseProduction", () => {
    it("calculates zero production with no upgrades", () => {
      const result = calculateBaseProduction({
        probe: 0,
        processor: 0,
        stabilizer: 0,
      });
      expect(result).toBe(0);
    });

    it("calculates production from probes", () => {
      const result = calculateBaseProduction({
        probe: 10,
        processor: 0,
        stabilizer: 0,
      });
      expect(result).toBeCloseTo(9.0, 1); // 10 * 0.9
    });

    it("calculates combined production from all upgrades", () => {
      const result = calculateBaseProduction({
        probe: 5,
        processor: 3,
        stabilizer: 2,
      });
      // 5*0.9 + 3*3.5 + 2*1.6 = 4.5 + 10.5 + 3.2 = 18.2
      expect(result).toBeCloseTo(18.2, 1);
    });
  });

  describe("calculatePassiveDepthGain", () => {
    it("returns zero with no stabilizers", () => {
      const result = calculatePassiveDepthGain({
        stabilizerCount: 0,
        resonance: 10,
        parameterEfficiency: 1.0,
      });
      expect(result).toBe(0);
    });

    it("calculates depth gain with stabilizers", () => {
      const result = calculatePassiveDepthGain({
        stabilizerCount: 4,
        resonance: 0,
        parameterEfficiency: 1.0,
      });
      // resonanceAssist = 1 + min(0*0.02, 0.6) = 1
      // (0.06 + 4*0.025) * 1.0 * 1 = 0.16
      expect(result).toBeCloseTo(0.16, 3);
    });

    it("includes resonance assist bonus", () => {
      const result = calculatePassiveDepthGain({
        stabilizerCount: 4,
        resonance: 20,
        parameterEfficiency: 1.0,
      });
      // resonanceAssist = 1 + min(20*0.02, 0.6) = 1 + 0.4 = 1.4
      // (0.06 + 4*0.025) * 1.0 * 1.4 = 0.16 * 1.4 = 0.224
      expect(result).toBeCloseTo(0.224, 3);
    });

    it("limits resonance assist to 0.6", () => {
      const result = calculatePassiveDepthGain({
        stabilizerCount: 4,
        resonance: 100,
        parameterEfficiency: 1.0,
      });
      // resonanceAssist = 1 + min(100*0.02, 0.6) = 1 + 0.6 = 1.6
      // (0.06 + 4*0.025) * 1.0 * 1.6 = 0.16 * 1.6 = 0.256
      expect(result).toBeCloseTo(0.256, 3);
    });
  });

  describe("calculateZoneBonus", () => {
    it("returns 1 + bonus value", () => {
      expect(calculateZoneBonus(0)).toBe(1);
      expect(calculateZoneBonus(0.08)).toBe(1.08);
      expect(calculateZoneBonus(0.45)).toBe(1.45);
    });
  });
});
