"use client";

import AngleDial from "@/app/components/AngleDial";
import { useGameStore } from "@/store/gameStore";

export type ControlPanelProps = {
  suggestedAngle: number;
};

export default function ControlPanel({ suggestedAngle }: ControlPanelProps) {
  const angle = useGameStore((state) => state.angle);
  const analysisMode = useGameStore((state) => state.analysisMode);
  const autoTuner = useGameStore((state) => state.unlocks.autoTuner);
  const setAngle = useGameStore((state) => state.setAngle);
  const toggleAnalysis = useGameStore((state) => state.toggleAnalysis);

  return (
    <section className="panel control-panel">
      <div className="panel__header">
        <div>
          <div className="panel__title">Angle Dial</div>
          <div className="panel__subtitle">Adjust delta for optimal light.</div>
        </div>
      </div>
      <div className="control-layout">
        <AngleDial value={angle} onChange={setAngle} />
        <div className="control-actions">
          <button className={`btn ${analysisMode ? "btn--primary" : ""}`} onClick={toggleAnalysis}>
            {analysisMode ? "Analysis: ON" : "Analysis: OFF"}
          </button>
          <div className="control-hint">
            Auto-tuner {autoTuner ? "engaged" : "locked"}.
          </div>
          {autoTuner ? (
            <div className="control-hint">Suggested angle: {Math.round(suggestedAngle)} deg</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
