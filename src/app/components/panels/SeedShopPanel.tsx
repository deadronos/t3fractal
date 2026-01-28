"use client";

import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { useGameStore } from "@/store/gameStore";
import { GEOMETRY_OPTIONS, SEED_UPGRADES } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

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
    <CollapsiblePanel
      title="Seed Shop"
      subtitle="Meta-progression unlocks."
      className="seed-panel"
      badge={
        <div className="text-chart-4 font-mono text-lg font-bold">
          🌱 {formatNumber(seeds)}
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        {SEED_UPGRADES.map((upgrade) => {
          const owned = isUpgradePurchased(upgrade.id);
          const canAfford = seeds >= upgrade.cost;
          return (
            <div
              key={upgrade.id}
              className={cn(
                "flex items-center justify-between rounded-lg border-2 p-3 transition-all",
                owned
                  ? "bg-primary/10 border-primary/40 shadow-sm"
                  : "bg-background/60 border-primary/20 hover:bg-primary/5 hover:border-primary/30",
              )}
            >
              <div>
                <div
                  className={cn(
                    "text-sm font-bold",
                    owned ? "text-primary" : "text-foreground",
                  )}
                >
                  {owned ? "✓ " : ""}
                  {upgrade.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  {upgrade.description}
                </div>
              </div>
              <Button
                size="sm"
                variant={owned ? "ghost" : "accent"}
                onClick={() => buySeedUpgrade(upgrade.id)}
                disabled={owned || !canAfford}
                className={cn(
                  "h-8 text-xs font-semibold",
                  owned && "text-muted-foreground",
                )}
              >
                {owned ? "Owned" : `${formatNumber(upgrade.cost)} 🌱`}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="bg-primary/30 my-4 h-px" />
      <div className="text-primary mb-3 text-xs font-bold tracking-wider uppercase">
        Branch Geometry
      </div>
      <div className="grid grid-cols-2 gap-2">
        {GEOMETRY_OPTIONS.map((option) => {
          const unlocked = geometryUnlocks[option.id];
          const selected = selectedGeometry === option.id;
          return (
            <button
              key={option.id}
              className={cn(
                "rounded-xl border-2 p-3 text-left transition-all",
                selected
                  ? "border-accent bg-accent/20 scale-105 shadow-lg"
                  : "border-primary/20 bg-background/60 hover:bg-primary/5 hover:border-primary/30",
                !unlocked && "cursor-not-allowed opacity-40 grayscale",
              )}
              onClick={() => selectGeometry(option.id)}
              disabled={!unlocked}
            >
              <div
                className={cn(
                  "text-sm font-bold",
                  selected ? "text-accent" : "text-foreground",
                )}
              >
                {selected ? "✓ " : ""}
                {option.name}
              </div>
              <div
                className={cn(
                  "mt-0.5 text-[10px]",
                  selected ? "text-accent/80" : "text-muted-foreground",
                )}
              >
                {unlocked ? option.description : "🔒 Locked"}
              </div>
            </button>
          );
        })}
      </div>
    </CollapsiblePanel>
  );
}
