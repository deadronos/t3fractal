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
  const nextSeason =
    SEASON_ORDER[(currentIndex + 1) % SEASON_ORDER.length] ?? season;
  const seedPreview = getSeedYield(photosynthesis, sap, fruit);

  return (
    <CollapsiblePanel
      title="Season Cycle"
      subtitle={seasonData.description}
      className="season-panel"
    >
      <div className="mb-4 grid grid-cols-4 gap-2">
        {SEASON_ORDER.map((entry) => (
          <div
            key={entry}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 p-2 py-3 text-center text-xs transition-all",
              entry === season
                ? "scale-105 shadow-lg"
                : "opacity-60 hover:opacity-80",
            )}
            style={{
              backgroundColor:
                entry === season
                  ? `${SEASONS[entry].palette.accent}20`
                  : `${SEASONS[entry].palette.accent}10`,
              borderColor:
                entry === season
                  ? SEASONS[entry].palette.accent
                  : `${SEASONS[entry].palette.accent}40`,
              color:
                entry === season ? SEASONS[entry].palette.accent : undefined,
            }}
          >
            <div className="font-bold">{SEASONS[entry].name}</div>
            <div className="mt-0.5 text-[10px] opacity-80">
              {SEASONS[entry].tagline}
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        <Button
          onClick={advanceSeason}
          variant="outline"
          className="w-full font-semibold"
        >
          Advance to {SEASONS[nextSeason].name}
        </Button>
        {season === "winter" && (
          <Button
            onClick={harvest}
            className="w-full font-semibold"
            variant="accent"
          >
            🌱 Harvest for {formatNumber(seedPreview)} Seeds
          </Button>
        )}
      </div>
    </CollapsiblePanel>
  );
}
