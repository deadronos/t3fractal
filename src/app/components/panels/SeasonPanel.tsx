"use client";

import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { useGameStore } from "@/store/gameStore";
import { SEASON_ORDER, SEASONS, getSeedYield } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";

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
      <div className="season-grid">
        {SEASON_ORDER.map((entry) => (
          <div
            key={entry}
            className={`season-card ${entry === season ? "season-card--active" : ""}`}
          >
            <div className="season-card__name">{SEASONS[entry].name}</div>
            <div className="season-card__tag">{SEASONS[entry].tagline}</div>
          </div>
        ))}
      </div>
      <div className="season-actions">
        <button className="btn" onClick={advanceSeason}>
          Advance to {SEASONS[nextSeason].name}
        </button>
        {season === "winter" ? (
          <button className="btn btn--primary" onClick={harvest}>
            Harvest for {formatNumber(seedPreview)} Seeds
          </button>
        ) : null}
      </div>
    </CollapsiblePanel>
  );
}
