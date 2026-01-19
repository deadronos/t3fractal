"use client";

import { useMemo } from "react";
import TreeScene from "@/app/components/TreeScene";
import { useLSystem } from "@/app/hooks/useLSystem";
import { useGameLoop } from "@/app/hooks/useGameLoop";
import ResourcePanel from "@/app/components/panels/ResourcePanel";
import GenomePanel from "@/app/components/panels/GenomePanel";
import UpgradePanel from "@/app/components/panels/UpgradePanel";
import SeasonPanel from "@/app/components/panels/SeasonPanel";
import SeedShopPanel from "@/app/components/panels/SeedShopPanel";
import ControlPanel from "@/app/components/panels/ControlPanel";
import StatsPanel from "@/app/components/panels/StatsPanel";
import { getActiveRuleMap, useGameStore } from "@/store/gameStore";
import { getTickMultiplier, getWidth, SEASONS } from "@/lib/gameData";

export default function Game() {
  const season = useGameStore((state) => state.season);
  const iterations = useGameStore((state) => state.iterations);
  const widthLevel = useGameStore((state) => state.widthLevel);
  const tickLevel = useGameStore((state) => state.tickLevel);
  const angle = useGameStore((state) => state.angle);
  const step = useGameStore((state) => state.step);
  const axiom = useGameStore((state) => state.axiom);
  const activeRules = useGameStore((state) => state.activeRules);
  const analysisMode = useGameStore((state) => state.analysisMode);
  const unlocks = useGameStore((state) => state.unlocks);
  const fruit = useGameStore((state) => state.fruit);
  const geometry = useGameStore((state) => state.selectedGeometry);

  const rules = useMemo(() => getActiveRuleMap(activeRules), [activeRules]);
  const width = getWidth(widthLevel);
  const tickMultiplier = getTickMultiplier(tickLevel);
  const seasonData = SEASONS[season];

  const { sentence, segments, leaves, stats } = useLSystem({
    axiom,
    rules,
    iterations,
    angle,
    step,
    width,
    enablePitch: unlocks.pitch,
    enableRoll: unlocks.roll,
  });

  const rates = useMemo(() => {
    const leafArea = stats.leafCount * (0.35 + width * 3.2);
    const photosynthesis =
      leafArea * stats.avgExposure * 0.6 * seasonData.rateMultiplier * tickMultiplier;
    const sap =
      stats.totalVolume * stats.rootDepth * 0.08 * seasonData.rateMultiplier * tickMultiplier;
    return {
      photosynthesis,
      sap,
      suggestedAngle: stats.suggestedAngle,
    };
  }, [stats, width, seasonData, tickMultiplier]);

  useGameLoop(rates);

  return (
    <main className="game-root relative w-full h-full overflow-hidden bg-background text-foreground">
      <div className="canvas-wrap absolute inset-0 z-0">
        <TreeScene
          segments={segments}
          leaves={leaves}
          season={season}
          analysisMode={analysisMode}
          geometry={geometry}
          fruitCount={fruit}
          growthKey={iterations}
          center={stats.center}
        />
      </div>
      
      {/* HUD Container */}
      <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-6 flex flex-col gap-4 overflow-hidden">
        
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 pointer-events-none">
          <div className="pointer-events-auto w-full md:w-96">
            <ResourcePanel rates={rates} />
          </div>
          <div className="pointer-events-auto w-full md:w-96">
            <SeasonPanel />
          </div>
        </div>

        {/* Middle Section - Columns */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row justify-between gap-4 pointer-events-none">
          {/* Left Column */}
          <div className="pointer-events-auto w-full md:w-80 lg:w-96 flex flex-col gap-4 overflow-y-auto max-h-full scrollbar-none">
            <GenomePanel sentence={sentence} />
          </div>

          {/* Right Column */}
          <div className="pointer-events-auto w-full md:w-80 lg:w-96 flex flex-col gap-4 overflow-y-auto max-h-full scrollbar-none">
            <UpgradePanel />
            <SeedShopPanel />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 pointer-events-none">
          <div className="pointer-events-auto w-full md:w-96">
            <ControlPanel suggestedAngle={stats.suggestedAngle} />
          </div>
          <div className="pointer-events-auto w-full md:w-96">
            <StatsPanel stats={stats} />
          </div>
        </div>

      </div>
    </main>
  );
}

