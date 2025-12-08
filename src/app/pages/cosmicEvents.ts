/**
 * @deprecated This module has been refactored. Import from:
 * - @/data/cosmicEvents for event catalog and types
 * - @/lib/gameplay/cosmicEventResolver for resolution logic
 * 
 * This file now re-exports for backward compatibility.
 */

export type {
  CosmicSnapshot,
  CosmicEventOutcome,
  CosmicEvent,
} from "@/data/cosmicEvents";

export { COSMIC_EVENTS } from "@/data/cosmicEvents";

export {
  resolveCosmicEvent,
  clampWeight,
  meetsRequirement,
} from "@/lib/gameplay/cosmicEventResolver";
