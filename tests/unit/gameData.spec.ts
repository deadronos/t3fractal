import { describe, it, expect } from "vitest";
import {
  getIterationCost,
  getSeedYield,
  getAxiomCost,
  SEASONS,
} from "@/lib/gameData";

describe("gameData helpers", () => {
  it("calculates iteration cost and respects season multiplier", () => {
    const springCost = getIterationCost(0, "spring");
    const winterCost = getIterationCost(0, "winter");
    // Base = 24, spring multiplier 0.75 -> 18, winter 1.6 -> 38.4 -> 38
    expect(springCost).toBe(Math.round(24 * SEASONS.spring.costMultiplier));
    expect(winterCost).toBe(Math.round(24 * SEASONS.winter.costMultiplier));
  });

  it("computes seed yield with photosynthesis, sap and fruit bonuses", () => {
    // photosynthesis + sap = 180 -> core = 1
    expect(getSeedYield(100, 80, 0)).toBe(1);

    // photosynthesis 360 -> core 2, fruit 2 -> fruitBonus floor(2*2.5)=5
    expect(getSeedYield(360, 0, 2)).toBe(7);
  });

  it("getAxiomCost returns at least the minimum", () => {
    expect(getAxiomCost("A")).toBeGreaterThanOrEqual(8);
    expect(getAxiomCost("ABC")).toBe(Math.max(8, Math.round(3 * 6)));
  });
});
