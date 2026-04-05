"use client";

import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { useGameStore } from "@/store/gameStore";
import { GEOMETRY_OPTIONS, SEED_UPGRADES } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";

export default function SeedShopPanel() {
  const seeds = useGameStore((state) => state.seeds);
  const purchasedSeedUpgrades = useGameStore((state) => state.purchasedSeedUpgrades);
  const selectedGeometry = useGameStore((state) => state.selectedGeometry);
  const buySeedUpgrade = useGameStore((state) => state.buySeedUpgrade);
  const selectGeometry = useGameStore((state) => state.selectGeometry);



  return (
    <CollapsiblePanel
      title="Seed Shop"
      subtitle="Meta-progression unlocks."
      className="seed-panel"
      badge={<div className="seed-balance">{formatNumber(seeds)} Seeds</div>}
    >
      <div className="seed-grid">
        {SEED_UPGRADES.map((upgrade) => {
          const owned = purchasedSeedUpgrades.includes(upgrade.id);
          const canAfford = seeds >= upgrade.cost;
          return (
            <div key={upgrade.id} className={`seed-card ${owned ? "seed-card--owned" : ""}`}>
              <div className="seed-card__title">{upgrade.name}</div>
              <div className="seed-card__desc">{upgrade.description}</div>
              <button
                className={`btn ${owned ? "btn--ghost" : "btn--primary"}`}
                onClick={() => buySeedUpgrade(upgrade.id)}
                disabled={owned || !canAfford}
              >
                {owned ? "Unlocked" : `Buy (${formatNumber(upgrade.cost)})`}
              </button>
            </div>
          );
        })}
      </div>
      <div className="panel__divider" />
      <div className="panel__subtitle">Branch Geometry</div>
      <div className="geometry-grid">
        {GEOMETRY_OPTIONS.map((option) => {
          const unlocked = option.id === "cylinder" || purchasedSeedUpgrades.includes(`geometry_${option.id}`);
          const selected = selectedGeometry === option.id;
          return (
            <button
              key={option.id}
              className={`geometry-card ${selected ? "geometry-card--active" : ""}`}
              onClick={() => selectGeometry(option.id)}
              disabled={!unlocked}
            >
              <div className="geometry-card__title">{option.name}</div>
              <div className="geometry-card__desc">
                {unlocked ? option.description : "Locked"}
              </div>
            </button>
          );
        })}
      </div>
    </CollapsiblePanel>
  );
}
