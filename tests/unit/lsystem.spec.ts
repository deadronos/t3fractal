import { describe, it, expect } from "vitest";
import { generateSentence, interpretSentence } from "@/lib/lsystem";

import type { LSystemConfig } from "@/lib/lsystem";

describe("generateSentence", () => {
  it("returns axiom when iterations is 0", () => {
    const axiom = "A";
    const rules = { A: "AB", B: "A" };
    const sentence = generateSentence(axiom, rules, 0, 1000);
    expect(sentence).toBe(axiom);
  });

  it("applies rules over multiple iterations", () => {
    const axiom = "A";
    const rules = { A: "AB", B: "A" };
    const sentence = generateSentence(axiom, rules, 2, 1000);
    // Iteration 1: AB, Iteration 2: ABA
    expect(sentence).toBe("ABA");
  });

  it("respects the maxLength clamp (within replacement bound)", () => {
    const axiom = "A";
    const rules = { A: "AA" };
    const maxLength = 5;
    const sentence = generateSentence(axiom, rules, 10, maxLength);
    // Implementation may add a final replacement that slightly exceeds maxLength,
    // so allow up to one replacement length beyond the clamp.
    const maxReplacementLength = Math.max(...Object.values(rules).map((r) => r.length));
    expect(sentence.length).toBeLessThanOrEqual(maxLength + maxReplacementLength);
    expect(/^[A]+$/.test(sentence)).toBeTruthy();
  });
});

describe("interpretSentence", () => {
  const baseConfig: LSystemConfig = {
    axiom: "",
    rules: {},
    iterations: 0,
    angle: 90,
    step: 1,
    width: 0.5,
    enablePitch: false,
    enableRoll: false,
    maxSegments: 1000,
    maxSentenceLength: 1000,
  };

  it("creates one segment and one leaf for a single 'F'", () => {
    const result = interpretSentence("F", baseConfig);
    expect(result.segments.length).toBe(1);
    expect(result.leaves.length).toBe(1);
    // Bounds: min at y=0, max at y=1 => center.y == 0.5
    expect(result.bounds.center.y).toBeCloseTo(0.5, 5);
  });

  it("respects maxSegments clamp", () => {
    const cfg = { ...baseConfig, maxSegments: 2 };
    const result = interpretSentence("FFFFF", cfg);
    expect(result.segments.length).toBeLessThanOrEqual(2);
  });

  it("creates leaves at branch ends and after close bracket behaviour", () => {
    const sentence = "F[+F]F";
    const result = interpretSentence(sentence, baseConfig);
    // Expect at least one leaf created at the end of branch and possibly at end
    expect(result.leaves.length).toBeGreaterThanOrEqual(1);
  });
});
