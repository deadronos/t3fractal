import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import AngleDial from "@/app/components/AngleDial";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/app/components/ui/button";

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
    <CollapsiblePanel
      title="Angle Dial"
      subtitle="Adjust delta for optimal light."
      className="control-panel"
    >
      <div className="flex gap-4 items-center">
        <AngleDial value={angle} onChange={setAngle} />
        <div className="flex flex-col gap-2 flex-1">
          <Button 
            variant={analysisMode ? "default" : "secondary"} 
            onClick={toggleAnalysis}
            className="w-full text-xs"
            size="sm"
          >
            {analysisMode ? "Analysis: ON" : "Analysis: OFF"}
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            Auto-tuner {autoTuner ? "engaged" : "locked"}.
          </div>
          {autoTuner && (
            <div className="text-xs font-mono bg-accent/10 text-accent-strong rounded px-2 py-1 text-center">
              Target: {Math.round(suggestedAngle)}°
            </div>
          )}
        </div>
      </div>
    </CollapsiblePanel>
  );
}
