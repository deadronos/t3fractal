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
      <div className="flex items-center gap-4">
        <AngleDial value={angle} onChange={setAngle} />
        <div className="flex flex-1 flex-col gap-2">
          <Button
            variant={analysisMode ? "accent" : "secondary"}
            onClick={toggleAnalysis}
            className="w-full text-xs font-semibold"
            size="sm"
          >
            {analysisMode ? "✓ Analysis: ON" : "Analysis: OFF"}
          </Button>
          <div className="text-muted-foreground text-center text-xs font-medium">
            Auto-tuner {autoTuner ? "✓ engaged" : "🔒 locked"}.
          </div>
          {autoTuner && (
            <div className="bg-primary/10 text-primary border-primary/30 rounded border px-2 py-1 text-center font-mono text-xs font-bold">
              Target: {Math.round(suggestedAngle)}°
            </div>
          )}
        </div>
      </div>
    </CollapsiblePanel>
  );
}
