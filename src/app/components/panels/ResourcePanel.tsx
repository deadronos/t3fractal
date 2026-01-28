"use client";

import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { useGameStore } from "@/store/gameStore";
import { formatNumber, formatRate } from "@/lib/format";
import { SEASONS } from "@/lib/gameData";
import { cn } from "@/lib/utils";

export type ResourcePanelProps = {
  rates: { photosynthesis: number; sap: number };
};

export default function ResourcePanel({ rates }: ResourcePanelProps) {
  const photosynthesis = useGameStore((state) => state.photosynthesis);
  const sap = useGameStore((state) => state.sap);
  const seeds = useGameStore((state) => state.seeds);
  const fruit = useGameStore((state) => state.fruit);
  const season = useGameStore((state) => state.season);

  const seasonData = SEASONS[season];

  return (
    <CollapsiblePanel
      title="Energy Ledger"
      subtitle={seasonData.tagline}
      className={cn(season === "winter" ? "border-accent/30" : "")}
      badge={
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider text-white uppercase"
          style={{ background: seasonData.palette.accent }}
        >
          {seasonData.name}
        </span>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="bg-primary/5 border-primary/20 hover:bg-primary/10 flex items-center justify-between rounded-lg border p-3 transition-all">
          <div>
            <div className="text-primary/80 text-[10px] font-semibold tracking-widest uppercase">
              Photosynthesis
            </div>
            <div className="text-primary text-lg font-bold tabular-nums">
              {formatNumber(photosynthesis)}
            </div>
          </div>
          <div className="text-primary/70 text-xs font-medium">
            {formatRate(rates.photosynthesis)}
          </div>
        </div>
        <div className="bg-accent/5 border-accent/20 hover:bg-accent/10 flex items-center justify-between rounded-lg border p-3 transition-all">
          <div>
            <div className="text-accent/80 text-[10px] font-semibold tracking-widest uppercase">
              Sap
            </div>
            <div className="text-accent text-lg font-bold tabular-nums">
              {formatNumber(sap)}
            </div>
          </div>
          <div className="text-accent/70 text-xs font-medium">
            {formatRate(rates.sap)}
          </div>
        </div>
        <div className="bg-chart-4/10 border-chart-4/30 hover:bg-chart-4/15 flex items-center justify-between rounded-lg border p-3 transition-all">
          <div>
            <div className="text-chart-4 text-[10px] font-semibold tracking-widest uppercase">
              Seeds
            </div>
            <div className="text-chart-4 text-lg font-bold tabular-nums">
              {formatNumber(seeds)}
            </div>
          </div>
          <div className="text-chart-4/80 text-xs font-medium">Prestige</div>
        </div>
        <div className="bg-chart-3/10 border-chart-3/30 hover:bg-chart-3/15 flex items-center justify-between rounded-lg border p-3 transition-all">
          <div>
            <div className="text-chart-3 text-[10px] font-semibold tracking-widest uppercase">
              Fruit
            </div>
            <div className="text-chart-3 text-lg font-bold tabular-nums">
              {formatNumber(fruit)}
            </div>
          </div>
          <div className="text-chart-3/80 text-xs font-medium">
            Autumn harvest
          </div>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
