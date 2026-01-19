"use client";

import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { useGameStore } from "@/store/gameStore";
import { SEASON_ORDER, SEASONS, getSeedYield } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

export default function SeasonPanel() {
  const season = useGameStore((state) => state.season);
  const photosynthesis = useGameStore((state) => state.photosynthesis);
  const sap = useGameStore((state) => state.sap);
  const fruit = useGameStore((state) => state.fruit);
  const advanceSeason = useGameStore((state) => state.advanceSeason);
  const harvest = useGameStore((state) => state.harvest);

  const seasonData = SEASONS[season];
  const currentIndex = SEASON_ORDER.indexOf(season);
  const nextSeason = SEASON_ORDER[(currentIndex + 1) % SEASON_ORDER.length] ?? season;
  const seedPreview = getSeedYield(photosynthesis, sap, fruit);

  return (
    <CollapsiblePanel title="Season Cycle" subtitle={seasonData.description} className="season-panel">
      <div className="grid grid-cols-4 gap-2 mb-4">
        {SEASON_ORDER.map((entry) => (
          <div
            key={entry}
            className={cn(
              "p-2 py-3 text-center rounded-xl bg-background/40 border border-primary/5 text-xs flex flex-col items-center justify-center transition-colors",
              entry === season ? "bg-accent/10 border-accent/60 shadow-sm" : "opacity-70"
            )}
          >
            <div className="font-semibold">{SEASONS[entry].name}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{SEASONS[entry].tagline}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        <Button onClick={advanceSeason} variant="outline" className="w-full">
          Advance to {SEASONS[nextSeason].name}
        </Button>
        {season === "winter" && (
          <Button onClick={harvest} className="w-full" variant="default">
            Harvest for {formatNumber(seedPreview)} Seeds
          </Button>
        )}
      </div>
    </CollapsiblePanel>
  );
}
