/**
 * Unit tests for Cosmic Event resolution logic.
 * Verifies random selection, eligibility checks, and outcome generation.
 */

import { describe, expect, it } from "vitest";

import { COSMIC_EVENTS, resolveCosmicEvent } from "@/app/pages/cosmicEvents";

const baseSnapshot = {
  depth: 0,
  resonance: 0,
  anomalies: 0,
  ascensionLevel: 0,
  dimensionalPoints: 0,
};

describe("resolveCosmicEvent", () => {
  it("selects the base event when the roll starts the weight range", () => {
    const { event } = resolveCosmicEvent(baseSnapshot, () => 0);
    expect(event.id).toBe(COSMIC_EVENTS[0]?.id);
  });

  it("selects eligible higher tier events when requirements are satisfied", () => {
    const snapshot = {
      depth: 7,
      resonance: 8,
      anomalies: 2,
      ascensionLevel: 2,
      dimensionalPoints: 5,
    };
    const { event } = resolveCosmicEvent(snapshot, () => 0.95);
    expect((event.minDepth ?? -Infinity) <= snapshot.depth).toBe(true);
    expect((event.minResonance ?? -Infinity) <= snapshot.resonance).toBe(true);
  });

  it("produces an outcome with descriptive log text", () => {
    const snapshot = {
      depth: 5,
      resonance: 4,
      anomalies: 1,
      ascensionLevel: 1,
      dimensionalPoints: 3,
    };
    const result = resolveCosmicEvent(snapshot, () => 0.4);
    expect(result.outcome.log.length).toBeGreaterThan(0);
    expect(result.event.name).toBeTypeOf("string");
  });
});
