import { describe, it, expect } from "vitest";
import {
  calculateMaxIterations,
  calculateZoom,
  calculatePaletteShift,
  calculateSaturation,
  calculateFractalParameters,
} from "@/lib/fractal/fractalMath";

describe("fractalMath", () => {
  describe("calculateMaxIterations", () => {
    it("should calculate correct iterations for depth 0 and amplifiers 0", () => {
      expect(calculateMaxIterations(0, 0)).toBe(40);
    });

    it("should calculate correct iterations for depth 5 and amplifiers 2", () => {
      expect(calculateMaxIterations(5, 2)).toBe(134);
    });

    it("should cap iterations at 1000", () => {
      expect(calculateMaxIterations(100, 100)).toBe(1000);
    });

    it("should increase iterations with depth", () => {
      const iter1 = calculateMaxIterations(5, 0);
      const iter2 = calculateMaxIterations(10, 0);
      expect(iter2).toBeGreaterThan(iter1);
    });

    it("should increase iterations with amplifiers", () => {
      const iter1 = calculateMaxIterations(5, 0);
      const iter2 = calculateMaxIterations(5, 5);
      expect(iter2).toBeGreaterThan(iter1);
    });
  });

  describe("calculateZoom", () => {
    it("should return 1 for depth 0 and amplifiers 0", () => {
      expect(calculateZoom(0, 0)).toBe(1);
    });

    it("should calculate zoom for depth 5 and amplifiers 2", () => {
      const zoom = calculateZoom(5, 2);
      expect(zoom).toBeCloseTo(Math.pow(1.3, 6), 5);
    });

    it("should increase zoom with depth", () => {
      const zoom1 = calculateZoom(5, 0);
      const zoom2 = calculateZoom(10, 0);
      expect(zoom2).toBeGreaterThan(zoom1);
    });

    it("should increase zoom with amplifiers", () => {
      const zoom1 = calculateZoom(5, 0);
      const zoom2 = calculateZoom(5, 4);
      expect(zoom2).toBeGreaterThan(zoom1);
    });
  });

  describe("calculatePaletteShift", () => {
    it("should return 0 for depth 0 and amplifiers 0", () => {
      expect(calculatePaletteShift(0, 0)).toBe(0);
    });

    it("should calculate palette shift within 0-360 range", () => {
      const shift = calculatePaletteShift(5, 2);
      expect(shift).toBeGreaterThanOrEqual(0);
      expect(shift).toBeLessThan(360);
    });

    it("should wrap around after 360 degrees", () => {
      const shift = calculatePaletteShift(100, 100);
      expect(shift).toBeGreaterThanOrEqual(0);
      expect(shift).toBeLessThan(360);
    });

    it("should produce different shifts for different inputs", () => {
      const shift1 = calculatePaletteShift(5, 2);
      const shift2 = calculatePaletteShift(10, 3);
      expect(shift1).not.toBe(shift2);
    });
  });

  describe("calculateSaturation", () => {
    it("should return value in 0-1 range", () => {
      const sat = calculateSaturation(5);
      expect(sat).toBeGreaterThanOrEqual(0);
      expect(sat).toBeLessThanOrEqual(1);
    });

    it("should produce different values for different depths", () => {
      const sat1 = calculateSaturation(0);
      const sat2 = calculateSaturation(10);
      // Values should be different due to sine function
      expect(Math.abs(sat1 - sat2)).toBeGreaterThan(0);
    });

    it("should clamp values between 0 and 1", () => {
      // Test extreme values
      for (let depth = 0; depth < 100; depth += 10) {
        const sat = calculateSaturation(depth);
        expect(sat).toBeGreaterThanOrEqual(0);
        expect(sat).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("calculateFractalParameters", () => {
    it("should return all parameters", () => {
      const params = calculateFractalParameters(5, 2);
      expect(params).toHaveProperty("maxIterations");
      expect(params).toHaveProperty("zoom");
      expect(params).toHaveProperty("paletteShift");
      expect(params).toHaveProperty("saturation");
    });

    it("should return correct values for depth 0 and amplifiers 0", () => {
      const params = calculateFractalParameters(0, 0);
      expect(params.maxIterations).toBe(40);
      expect(params.zoom).toBe(1);
      expect(params.paletteShift).toBe(0);
      expect(params.saturation).toBeCloseTo(0.7, 1);
    });

    it("should return consistent values with individual functions", () => {
      const depth = 7;
      const amplifiers = 3;
      const params = calculateFractalParameters(depth, amplifiers);

      expect(params.maxIterations).toBe(calculateMaxIterations(depth, amplifiers));
      expect(params.zoom).toBe(calculateZoom(depth, amplifiers));
      expect(params.paletteShift).toBe(calculatePaletteShift(depth, amplifiers));
      expect(params.saturation).toBe(calculateSaturation(depth));
    });
  });
});
