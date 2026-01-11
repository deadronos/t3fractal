import { useEffect, useRef } from "react";
import { useGameStore, type ResourceRates } from "@/store/gameStore";

export type GameLoopRates = ResourceRates & { suggestedAngle: number };

export function useGameLoop(rates: GameLoopRates) {
  const addResources = useGameStore((state) => state.addResources);
  const autoTuner = useGameStore((state) => state.unlocks.autoTuner);
  const angle = useGameStore((state) => state.angle);
  const setAngle = useGameStore((state) => state.setAngle);

  const ratesRef = useRef(rates);
  const angleRef = useRef(angle);

  useEffect(() => {
    ratesRef.current = rates;
  }, [rates]);

  useEffect(() => {
    angleRef.current = angle;
  }, [angle]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const activeRates = ratesRef.current;
      addResources(dt, {
        photosynthesis: activeRates.photosynthesis,
        sap: activeRates.sap,
      });

      if (autoTuner) {
        const target = activeRates.suggestedAngle;
        const current = angleRef.current;
        const delta = target - current;
        if (Math.abs(delta) > 0.2) {
          const step = Math.sign(delta) * Math.min(Math.abs(delta), dt * 8);
          const next = current + step;
          angleRef.current = next;
          setAngle(next);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [addResources, autoTuner, setAngle]);
}
