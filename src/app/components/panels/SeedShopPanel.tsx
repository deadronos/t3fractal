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
      badge={<div className="font-mono text-accent-strong font-bold">{formatNumber(seeds)} Seeds</div>}
    >
      <div className="flex flex-col gap-2">
        {SEED_UPGRADES.map((upgrade) => {
          const owned = isUpgradePurchased(upgrade.id);
          const canAfford = seeds >= upgrade.cost;
          return (
            <div key={upgrade.id} className={cn("rounded-lg p-3 border transition-colors flex justify-between items-center", owned ? "bg-accent/5 border-accent/20" : "bg-background/40 border-primary/5")}>
              <div>
                <div className="font-semibold text-sm">{upgrade.name}</div>
                <div className="text-xs text-muted-foreground">{upgrade.description}</div>
              </div>
              <Button
                size="sm"
                variant={owned ? "ghost" : "default"}
                onClick={() => buySeedUpgrade(upgrade.id)}
                disabled={owned || !canAfford}
                className={cn("h-8 text-xs", owned && "text-muted-foreground")}
              >
                {owned ? "Unlocked" : `Buy (${formatNumber(upgrade.cost)})`}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="h-px bg-border my-4" />
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Branch Geometry</div>
      <div className="grid grid-cols-2 gap-2">
        {GEOMETRY_OPTIONS.map((option) => {
          const unlocked = geometryUnlocks[option.id];
          const selected = selectedGeometry === option.id;
          return (
            <button
              key={option.id}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                selected ? "border-accent bg-accent/10 shadow-sm" : "border-primary/10 bg-background/40 hover:bg-background/60",
                !unlocked && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => selectGeometry(option.id)}
              disabled={!unlocked}
            >
              <div className="font-semibold text-sm">{option.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {unlocked ? option.description : "Locked"}
              </div>
            </button>
          );
        })}
      </div>
    </CollapsiblePanel>
  );
}
