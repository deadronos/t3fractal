/**
 * Unit tests for number formatting utilities.
 * Verifies compact notation (K, M, B) for various magnitudes.
 */

import { describe, it, expect } from "vitest";
import { formatNumber } from "@/lib/gameplay/formatters";

describe("formatters", () => {
  describe("formatNumber", () => {
    it("formats small numbers without suffix", () => {
      expect(formatNumber(42)).toBe("42");
      expect(formatNumber(999)).toBe("999");
    });

    it("formats thousands with K suffix", () => {
      expect(formatNumber(1000)).toBe("1.00K");
      expect(formatNumber(1234)).toBe("1.23K");
      expect(formatNumber(999999)).toBe("1000.00K");
    });

    it("formats millions with M suffix", () => {
      expect(formatNumber(1000000)).toBe("1.00M");
      expect(formatNumber(1234567)).toBe("1.23M");
      expect(formatNumber(999999999)).toBe("1000.00M");
    });

    it("formats billions with B suffix", () => {
      expect(formatNumber(1000000000)).toBe("1.00B");
      expect(formatNumber(1234567890)).toBe("1.23B");
      expect(formatNumber(9999999999)).toBe("10.00B");
    });
  });
});
