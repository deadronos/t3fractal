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
    <main className="game-root">
      <div className="canvas-wrap">
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
      <div className="hud">
        <div className="hud-top">
          <ResourcePanel rates={rates} />
          <SeasonPanel />
        </div>
        <div className="hud-columns">
          <GenomePanel sentence={sentence} />
          <div className="hud-right">
            <UpgradePanel />
            <SeedShopPanel />
          </div>
        </div>
        <div className="hud-bottom">
          <ControlPanel suggestedAngle={stats.suggestedAngle} />
          <StatsPanel stats={stats} />
        </div>
      </div>
    </main>
  );
}
