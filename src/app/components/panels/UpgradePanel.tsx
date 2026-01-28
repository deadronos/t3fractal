"use client";

import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { useGameStore } from "@/store/gameStore";
import {
  MAX_ITERATIONS,
  getIterationCost,
  getTickCost,
  getWidth,
  getWidthCost,
  getFruitCost,
} from "@/lib/gameData";
import { formatNumber } from "@/lib/format";

import { Button } from "@/app/components/ui/button";

export default function UpgradePanel() {
  const season = useGameStore((state) => state.season);
  const photosynthesis = useGameStore((state) => state.photosynthesis);
  const sap = useGameStore((state) => state.sap);
  const iterations = useGameStore((state) => state.iterations);
  const widthLevel = useGameStore((state) => state.widthLevel);
  const tickLevel = useGameStore((state) => state.tickLevel);
  const fruit = useGameStore((state) => state.fruit);

  const buyIteration = useGameStore((state) => state.buyIteration);
  const buyWidth = useGameStore((state) => state.buyWidth);
  const buyTickRate = useGameStore((state) => state.buyTickRate);
  const buyFruit = useGameStore((state) => state.buyFruit);

  const iterationCost = getIterationCost(iterations, season);
  const widthCost = getWidthCost(widthLevel, season);
  const tickCost = getTickCost(tickLevel, season);
  const fruitCost = getFruitCost(fruit, season);

  return (
    <CollapsiblePanel
      title="Growth Upgrades"
      subtitle="Balance structure and yield."
      className="upgrade-panel"
    >
      <div className="flex flex-col gap-2">
        <div className="bg-primary/5 border-primary/20 hover:bg-primary/10 flex items-center justify-between rounded-lg border p-3 transition-all">
          <div>
            <div className="text-primary text-sm font-semibold">Iterations</div>
            <div className="text-primary/70 text-xs">
              Depth of recursion ({iterations}/{MAX_ITERATIONS}).
            </div>
          </div>
          <Button
            size="sm"
            onClick={buyIteration}
            disabled={
              photosynthesis < iterationCost || iterations >= MAX_ITERATIONS
            }
          >
            {iterations >= MAX_ITERATIONS
              ? "Maxed"
              : `Grow (${formatNumber(iterationCost)})`}
          </Button>
        </div>
        <div className="bg-accent/5 border-accent/20 hover:bg-accent/10 flex items-center justify-between rounded-lg border p-3 transition-all">
          <div>
            <div className="text-accent text-sm font-semibold">Girth</div>
            <div className="text-accent/70 text-xs">
              Branch radius ({getWidth(widthLevel).toFixed(2)}).
            </div>
          </div>
          <Button size="sm" onClick={buyWidth} disabled={sap < widthCost}>
            Thicken ({formatNumber(widthCost)})
          </Button>
        </div>
        <div className="bg-chart-1/10 border-chart-1/30 hover:bg-chart-1/15 flex items-center justify-between rounded-lg border p-3 transition-all">
          <div>
            <div className="text-chart-1 text-sm font-semibold">Tick Rate</div>
            <div className="text-chart-1/80 text-xs">
              Resource pulse speed (Lv {tickLevel}).
            </div>
          </div>
          <Button size="sm" onClick={buyTickRate} disabled={sap < tickCost}>
            Accelerate ({formatNumber(tickCost)})
          </Button>
        </div>
        <div className="bg-chart-3/10 border-chart-3/30 hover:bg-chart-3/15 flex items-center justify-between rounded-lg border p-3 transition-all">
          <div>
            <div className="text-chart-3 text-sm font-semibold">
              Fruit Spawns
            </div>
            <div className="text-chart-3/80 text-xs">
              Prestige boosters (Autumn only).
            </div>
          </div>
          <Button
            size="sm"
            variant={season !== "autumn" ? "ghost" : "accent"}
            onClick={buyFruit}
            disabled={sap < fruitCost || season !== "autumn"}
          >
            {season !== "autumn"
              ? "Await Autumn"
              : `Cultivate (${formatNumber(fruitCost)})`}
          </Button>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
