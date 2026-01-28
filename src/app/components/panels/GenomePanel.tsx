"use client";

import { useEffect, useMemo, useState } from "react";
import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { RULE_LIBRARY, getAxiomCost } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";
import { useGameStore } from "@/store/gameStore";
import { RuleCard } from "./genome/RuleCard";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export type GenomePanelProps = {
  sentence: string;
};

export default function GenomePanel({ sentence }: GenomePanelProps) {
  const axiom = useGameStore((state) => state.axiom);
  const photosynthesis = useGameStore((state) => state.photosynthesis);
  const lastRuleChanged = useGameStore((state) => state.lastRuleChanged);
  const applyAxiom = useGameStore((state) => state.applyAxiom);

  const [draftAxiom, setDraftAxiom] = useState(axiom);

  useEffect(() => setDraftAxiom(axiom), [axiom]);

  const preview = useMemo(() => {
    if (sentence.length <= 320) return sentence;
    return `${sentence.slice(0, 240)}...${sentence.slice(-80)}`;
  }, [sentence]);

  const highlightSymbol = useMemo(() => {
    if (!lastRuleChanged) return null;
    return (
      RULE_LIBRARY.find((rule) => rule.id === lastRuleChanged)?.symbol ?? null
    );
  }, [lastRuleChanged]);

  const axiomCost = getAxiomCost(draftAxiom);
  const canAffordAxiom = photosynthesis >= axiomCost;

  const renderRules = (symbol: string) =>
    RULE_LIBRARY.filter((rule) => rule.symbol === symbol).map((rule) => (
      <RuleCard key={rule.id} rule={rule} symbol={symbol} />
    ));

  return (
    <CollapsiblePanel
      title="Genome Editor"
      subtitle="Mutate axiom and production rules."
      className="genome-panel"
      defaultCollapsed={false}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="axiom"
            className="text-primary text-xs font-semibold tracking-wider uppercase"
          >
            Axiom (omega)
          </Label>
          <div className="flex gap-2">
            <Input
              id="axiom"
              value={draftAxiom}
              onChange={(event) =>
                setDraftAxiom(event.target.value.toUpperCase())
              }
              className="bg-primary/5 border-primary/30 focus:border-primary/50 border-2 font-mono"
            />
            <Button
              onClick={() => applyAxiom(draftAxiom, axiomCost)}
              disabled={!canAffordAxiom}
              variant="accent"
            >
              Mutate ({formatNumber(axiomCost)})
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-primary text-sm font-bold tracking-wider uppercase">
            Growth Rules
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-accent/5 border-accent/20 space-y-2 rounded-lg border p-3">
              <div className="text-accent text-xs font-bold tracking-wider uppercase">
                Symbol X
              </div>
              <div className="grid gap-2">{renderRules("X")}</div>
            </div>
            <div className="bg-chart-1/10 border-chart-1/30 space-y-2 rounded-lg border p-3">
              <div className="text-chart-1 text-xs font-bold tracking-wider uppercase">
                Symbol F
              </div>
              <div className="grid gap-2">{renderRules("F")}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-primary text-xs font-semibold tracking-wider uppercase">
            String Viewer
          </div>
          <div className="bg-primary/5 border-primary/20 max-h-[110px] overflow-y-auto rounded-lg border p-3 font-mono text-xs leading-relaxed break-all">
            {preview.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className={
                  highlightSymbol && char === highlightSymbol
                    ? "text-accent animate-pulse font-bold"
                    : "text-foreground"
                }
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
