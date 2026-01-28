import { type RULE_LIBRARY } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";

type RuleCardProps = {
  rule: (typeof RULE_LIBRARY)[0];
  symbol: string;
};

export function RuleCard({ rule, symbol }: RuleCardProps) {
  const photosynthesis = useGameStore((state) => state.photosynthesis);
  const sap = useGameStore((state) => state.sap);
  const seeds = useGameStore((state) => state.seeds);
  const unlockedRules = useGameStore((state) => state.unlockedRules);
  const activeRules = useGameStore((state) => state.activeRules);
  const unlocks = useGameStore((state) => state.unlocks);
  const unlockRule = useGameStore((state) => state.unlockRule);
  const setActiveRule = useGameStore((state) => state.setActiveRule);

  const unlocked = unlockedRules.includes(rule.id);
  const active = activeRules[symbol] === rule.id;
  const requiresPitch = rule.requires?.pitch ?? false;
  const requiresRoll = rule.requires?.roll ?? false;
  const lockReason =
    (requiresPitch && !unlocks.pitch) || (requiresRoll && !unlocks.roll);

  const costLabel = rule.cost.photosynthesis
    ? `P ${formatNumber(rule.cost.photosynthesis)}`
    : rule.cost.sap
      ? `S ${formatNumber(rule.cost.sap)}`
      : rule.cost.seeds
        ? `Seed ${formatNumber(rule.cost.seeds)}`
        : "";

  const canUnlock =
    !lockReason &&
    (rule.cost.photosynthesis ?? 0) <= photosynthesis &&
    (rule.cost.sap ?? 0) <= sap &&
    (rule.cost.seeds ?? 0) <= seeds;

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-3 transition-all",
        active
          ? "border-accent bg-accent/15 shadow-md"
          : "border-primary/20 bg-background/60 hover:bg-primary/5 hover:border-primary/30",
      )}
    >
      <div className="mb-2 flex justify-between gap-2">
        <div>
          <div
            className={cn(
              "text-sm font-bold",
              active ? "text-accent" : "text-foreground",
            )}
          >
            {rule.name}
          </div>
          <div className="text-muted-foreground text-xs">
            {rule.description}
          </div>
        </div>
        {(requiresPitch || requiresRoll) && (
          <Badge
            variant="outline"
            className="border-chart-4 text-chart-4 h-5 px-1.5 text-[10px] font-bold uppercase"
          >
            3D
          </Badge>
        )}
      </div>
      <div
        className={cn(
          "mb-3 rounded border p-2 font-mono text-xs break-all",
          active
            ? "bg-accent/10 border-accent/30 text-accent font-semibold"
            : "bg-primary/5 border-primary/20",
        )}
      >
        {rule.symbol} {"->"} {rule.replacement}
      </div>
      <div className="flex justify-end">
        {unlocked ? (
          <Button
            size="sm"
            variant={active ? "ghost" : "accent"}
            className={cn(
              "h-7 text-xs font-semibold",
              active && "text-muted-foreground",
            )}
            onClick={() => setActiveRule(symbol, rule.id)}
            disabled={active}
          >
            {active ? "✓ Active" : "Activate"}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs font-semibold"
            onClick={() => unlockRule(rule.id)}
            disabled={!canUnlock}
            title={lockReason ? "Requires dimensionality unlock" : undefined}
          >
            🔒 Unlock {costLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
