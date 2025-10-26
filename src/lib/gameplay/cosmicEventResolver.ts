/**
 * Cosmic Event Resolution System
 * 
 * Handles the logic for selecting and applying cosmic events based on game state.
 * Provides testable utility functions for event eligibility and weighted selection.
 */

import { COSMIC_EVENTS, type CosmicEvent, type CosmicSnapshot, type CosmicEventOutcome } from "@/data/cosmicEvents";

/**
 * Clamp event weight to a minimum value to prevent division by zero
 * and ensure reasonable probability distribution.
 */
export const clampWeight = (value: number): number => (value > 0 ? value : 0.5);

/**
 * Check if an event meets its depth and resonance requirements
 * given the current game state.
 */
export const meetsRequirement = (
  snapshot: CosmicSnapshot,
  event: CosmicEvent,
): boolean => {
  if (typeof event.minDepth === "number" && snapshot.depth < event.minDepth) {
    return false;
  }
  if (
    typeof event.minResonance === "number" &&
    snapshot.resonance < event.minResonance
  ) {
    return false;
  }
  return true;
};

/**
 * Resolve a cosmic event using weighted random selection.
 * 
 * @param snapshot - Current game state
 * @param random - Random number generator (injectable for testing)
 * @returns Selected event and its outcome
 * @throws Error if no events are defined in the catalog
 */
export const resolveCosmicEvent = (
  snapshot: CosmicSnapshot,
  random: () => number = Math.random,
): { event: CosmicEvent; outcome: CosmicEventOutcome } => {
  const eligible = COSMIC_EVENTS.filter((event) =>
    meetsRequirement(snapshot, event),
  );
  const fallbackEvent = COSMIC_EVENTS[0];
  if (!fallbackEvent) {
    throw new Error("No cosmic events defined");
  }

  const pool = eligible.length > 0 ? eligible : [fallbackEvent];
  let totalWeight = 0;
  for (const event of pool) {
    totalWeight += clampWeight(event.weight);
  }

  const safeTotal = totalWeight > 0 ? totalWeight : pool.length;
  const target = random() * safeTotal;

  let cumulative = 0;
  let selected: CosmicEvent | null = null;
  for (const event of pool) {
    cumulative += clampWeight(event.weight);
    if (target <= cumulative) {
      selected = event;
      break;
    }
  }

  const resolvedEvent = selected ?? fallbackEvent;
  return { event: resolvedEvent, outcome: resolvedEvent.apply(snapshot) };
};
