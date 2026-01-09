"use client";

import { useGameStore } from "@/store/gameStore";
import { GEOMETRY_OPTIONS, SEED_UPGRADES, type GeometryType } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";

export default function SeedShopPanel() {
  const seeds = useGameStore((state) => state.seeds);
  const unlocks = useGameStore((state) => state.unlocks);
  const geometryUnlocks = useGameStore((state) => state.geometryUnlocks);
  const selectedGeometry = useGameStore((state) => state.selectedGeometry);
  const buySeedUpgrade = useGameStore((state) => state.buySeedUpgrade);
  const selectGeometry = useGameStore((state) => state.selectGeometry);

  const isUpgradePurchased = (id: string) => {
    if (id === "pitch") return unlocks.pitch;
    if (id === "roll") return unlocks.roll;
    if (id === "autoTuner") return unlocks.autoTuner;
    if (id === "geometry_cone") return geometryUnlocks.cone;
    if (id === "geometry_box") return geometryUnlocks.box;
    if (id === "geometry_tetra") return geometryUnlocks.tetra;
    return false;
  };

  return (
    <section className="panel seed-panel">
      <div className="panel__header">
        <div>
          <div className="panel__title">Seed Shop</div>
          <div className="panel__subtitle">Meta-progression unlocks.</div>
        </div>
        <div className="seed-balance">{formatNumber(seeds)} Seeds</div>
      </div>
      <div className="seed-grid">
        {SEED_UPGRADES.map((upgrade) => {
          const owned = isUpgradePurchased(upgrade.id);
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
          const unlocked = geometryUnlocks[option.id as GeometryType];
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
    </section>
  );
}
