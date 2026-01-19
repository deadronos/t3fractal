import { type RULE_LIBRARY } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";

type RuleCardProps = {
  rule: typeof RULE_LIBRARY[0];
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
        "bg-background/40 rounded-lg p-3 border transition-colors",
        active ? "border-accent/50 bg-accent/5" : "border-primary/5 hover:bg-background/60"
      )}
    >
      <div className="flex justify-between gap-2 mb-2">
        <div>
          <div className="font-semibold text-sm">{rule.name}</div>
          <div className="text-xs text-muted-foreground">{rule.description}</div>
        </div>
        {(requiresPitch || requiresRoll) && (
          <Badge variant="outline" className="h-5 text-[10px] px-1.5 uppercase">3D</Badge>
        )}
      </div>
      <div className="font-mono text-xs bg-black/5 dark:bg-black/20 p-2 rounded mb-3 break-all">
        {rule.symbol} {'->'} {rule.replacement}
      </div>
      <div className="flex justify-end">
        {unlocked ? (
          <Button
            size="sm"
            variant={active ? "ghost" : "default"}
            className={cn("h-7 text-xs", active && "text-muted-foreground")}
            onClick={() => setActiveRule(symbol, rule.id)}
            disabled={active}
          >
            {active ? "Active" : "Activate"}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs"
            onClick={() => unlockRule(rule.id)}
            disabled={!canUnlock}
            title={lockReason ? "Requires dimensionality unlock" : undefined}
          >
            Unlock {costLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
