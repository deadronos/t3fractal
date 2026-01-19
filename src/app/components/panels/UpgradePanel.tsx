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
        <div className="flex justify-between items-center bg-background/40 rounded-lg p-3 border border-primary/5">
          <div>
            <div className="font-semibold text-sm">Iterations</div>
            <div className="text-xs text-muted-foreground">Depth of recursion ({iterations}/{MAX_ITERATIONS}).</div>
          </div>
          <Button
            size="sm"
            onClick={buyIteration}
            disabled={photosynthesis < iterationCost || iterations >= MAX_ITERATIONS}
          >
            {iterations >= MAX_ITERATIONS ? "Maxed" : `Grow (${formatNumber(iterationCost)})`}
          </Button>
        </div>
        <div className="flex justify-between items-center bg-background/40 rounded-lg p-3 border border-primary/5">
          <div>
            <div className="font-semibold text-sm">Girth</div>
            <div className="text-xs text-muted-foreground">Branch radius ({getWidth(widthLevel).toFixed(2)}).</div>
          </div>
          <Button
            size="sm"
            onClick={buyWidth}
            disabled={sap < widthCost}
          >
            Thicken ({formatNumber(widthCost)})
          </Button>
        </div>
        <div className="flex justify-between items-center bg-background/40 rounded-lg p-3 border border-primary/5">
          <div>
            <div className="font-semibold text-sm">Tick Rate</div>
            <div className="text-xs text-muted-foreground">Resource pulse speed (Lv {tickLevel}).</div>
          </div>
          <Button size="sm" onClick={buyTickRate} disabled={sap < tickCost}>
            Accelerate ({formatNumber(tickCost)})
          </Button>
        </div>
        <div className="flex justify-between items-center bg-background/40 rounded-lg p-3 border border-primary/5">
          <div>
            <div className="font-semibold text-sm">Fruit Spawns</div>
            <div className="text-xs text-muted-foreground">Prestige boosters (Autumn only).</div>
          </div>
          <Button
            size="sm"
            variant={season !== "autumn" ? "ghost" : "default"}
            onClick={buyFruit}
            disabled={sap < fruitCost || season !== "autumn"}
          >
            {season !== "autumn" ? "Await Autumn" : `Cultivate (${formatNumber(fruitCost)})`}
          </Button>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
