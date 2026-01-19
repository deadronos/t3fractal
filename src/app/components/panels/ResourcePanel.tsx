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
        <span className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium uppercase tracking-wider" style={{ background: seasonData.palette.accent }}>
          {seasonData.name}
        </span>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center bg-background/50 rounded-lg p-3 border border-primary/5">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Photosynthesis</div>
            <div className="text-lg font-semibold tabular-nums">{formatNumber(photosynthesis)}</div>
          </div>
          <div className="text-xs text-muted-foreground/80">{formatRate(rates.photosynthesis)}</div>
        </div>
        <div className="flex justify-between items-center bg-background/50 rounded-lg p-3 border border-primary/5">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Sap</div>
            <div className="text-lg font-semibold tabular-nums">{formatNumber(sap)}</div>
          </div>
          <div className="text-xs text-muted-foreground/80">{formatRate(rates.sap)}</div>
        </div>
        <div className="flex justify-between items-center bg-background/50 rounded-lg p-3 border border-primary/5">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Seeds</div>
            <div className="text-lg font-semibold tabular-nums text-accent-strong">{formatNumber(seeds)}</div>
          </div>
          <div className="text-xs text-muted-foreground/80">Prestige</div>
        </div>
        <div className="flex justify-between items-center bg-background/50 rounded-lg p-3 border border-primary/5">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Fruit</div>
            <div className="text-lg font-semibold tabular-nums">{formatNumber(fruit)}</div>
          </div>
          <div className="text-xs text-muted-foreground/80">Autumn harvest</div>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
