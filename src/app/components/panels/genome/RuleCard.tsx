"use client";

import { type RULE_LIBRARY } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";
import { useGameStore } from "@/store/gameStore";

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
    <div className={`rule-card ${active ? "rule-card--active" : ""}`}>
      <div className="rule-card__header">
        <div>
          <div className="rule-card__title">{rule.name}</div>
          <div className="rule-card__desc">{rule.description}</div>
        </div>
        {requiresPitch || requiresRoll ? (
          <span className="rule-card__badge">3D</span>
        ) : null}
      </div>
      <div className="rule-card__string">
        {rule.symbol} {'->'} {rule.replacement}
      </div>
      <div className="rule-card__actions">
        {unlocked ? (
          <button
            className={`btn ${active ? "btn--ghost" : "btn--primary"}`}
            onClick={() => setActiveRule(symbol, rule.id)}
            disabled={active}
          >
            {active ? "Active" : "Activate"}
          </button>
        ) : (
          <button
            className="btn"
            onClick={() => unlockRule(rule.id)}
            disabled={!canUnlock}
            title={lockReason ? "Requires dimensionality unlock" : undefined}
          >
            Unlock {costLabel}
          </button>
        )}
      </div>
    </div>
  );
}
