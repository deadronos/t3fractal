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
      <div className="upgrade-list">
        <div className="upgrade">
          <div>
            <div className="upgrade__title">Iterations</div>
            <div className="upgrade__desc">Depth of recursion ({iterations}/{MAX_ITERATIONS}).</div>
          </div>
          <button
            className="btn btn--primary"
            onClick={buyIteration}
            disabled={photosynthesis < iterationCost || iterations >= MAX_ITERATIONS}
          >
            {iterations >= MAX_ITERATIONS ? "Maxed" : `Grow (${formatNumber(iterationCost)})`}
          </button>
        </div>
        <div className="upgrade">
          <div>
            <div className="upgrade__title">Girth</div>
            <div className="upgrade__desc">Branch radius ({getWidth(widthLevel).toFixed(2)}).</div>
          </div>
          <button
            className="btn btn--primary"
            onClick={buyWidth}
            disabled={sap < widthCost}
          >
            Thicken ({formatNumber(widthCost)})
          </button>
        </div>
        <div className="upgrade">
          <div>
            <div className="upgrade__title">Tick Rate</div>
            <div className="upgrade__desc">Resource pulse speed (Lv {tickLevel}).</div>
          </div>
          <button className="btn btn--primary" onClick={buyTickRate} disabled={sap < tickCost}>
            Accelerate ({formatNumber(tickCost)})
          </button>
        </div>
        <div className="upgrade">
          <div>
            <div className="upgrade__title">Fruit Spawns</div>
            <div className="upgrade__desc">Prestige boosters (Autumn only).</div>
          </div>
          <button
            className="btn"
            onClick={buyFruit}
            disabled={sap < fruitCost || season !== "autumn"}
          >
            {season !== "autumn" ? "Await Autumn" : `Cultivate (${formatNumber(fruitCost)})`}
          </button>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
