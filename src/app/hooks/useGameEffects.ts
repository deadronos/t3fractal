import { useEffect } from "react";

type Zone = {
  name: string;
  description: string;
  requirement: number;
  bonus: number;
};

type UseGameEffectsProps = {
  effectiveDataPerSecond: number;
  passiveDepthGain: number;
  currentZone: Zone | undefined;
  lastZone: string;
  addFractalData: (amount: number) => void;
  incrementDepth: (amount: number) => void;
  pushLog: (message: string) => void;
  setLastZone: (zone: string) => void;
  triggerCosmicEvent: () => void;
  decrementEventCountdown: () => number;
  setEventCountdown: (value: number) => void;
};

/**
 * Hook for managing game effects (intervals, zone detection).
 * Handles production intervals, zone unlock notifications, and cosmic event countdowns.
 *
 * @param props - Dependencies and actions required for effects.
 */
export function useGameEffects({
  effectiveDataPerSecond,
  passiveDepthGain,
  currentZone,
  lastZone,
  addFractalData,
  incrementDepth,
  pushLog,
  setLastZone,
  triggerCosmicEvent,
  decrementEventCountdown,
  setEventCountdown,
}: UseGameEffectsProps) {
  // Production interval
  useEffect(() => {
    if (effectiveDataPerSecond <= 0 && passiveDepthGain <= 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      if (effectiveDataPerSecond > 0) {
        addFractalData(effectiveDataPerSecond / 2);
      }
      if (passiveDepthGain > 0) {
        incrementDepth(passiveDepthGain / 2);
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [effectiveDataPerSecond, passiveDepthGain, addFractalData, incrementDepth]);

  // Zone unlock detection
  useEffect(() => {
    if (!currentZone || currentZone.name === lastZone) {
      return;
    }
    pushLog(
      `New region unlocked: ${currentZone.name}. ${currentZone.description}`,
    );
    setLastZone(currentZone.name);
  }, [currentZone, lastZone, pushLog, setLastZone]);

  // Cosmic event countdown
  useEffect(() => {
    const interval = window.setInterval(() => {
      const newValue = decrementEventCountdown();
      if (newValue === 0) {
        triggerCosmicEvent();
        setEventCountdown(16 + Math.floor(Math.random() * 9));
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [triggerCosmicEvent, decrementEventCountdown, setEventCountdown]);
}
