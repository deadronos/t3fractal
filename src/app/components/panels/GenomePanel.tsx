"use client";

import { useEffect, useMemo, useState } from "react";
import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { RULE_LIBRARY, getAxiomCost } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";
import { useGameStore } from "@/store/gameStore";
import { RuleCard } from "./genome/RuleCard";

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
    return RULE_LIBRARY.find((rule) => rule.id === lastRuleChanged)?.symbol ?? null;
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
      <div className="axiom-editor">
        <label htmlFor="axiom" className="axiom-editor__label">
          Axiom (omega)
        </label>
        <div className="axiom-editor__controls">
          <input
            id="axiom"
            value={draftAxiom}
            onChange={(event) => setDraftAxiom(event.target.value.toUpperCase())}
            className="input"
          />
          <button
            className="btn btn--primary"
            onClick={() => applyAxiom(draftAxiom, axiomCost)}
            disabled={!canAffordAxiom}
          >
            Mutate ({formatNumber(axiomCost)})
          </button>
        </div>
      </div>

      <div className="rule-section">
        <div className="rule-section__title">Growth Rules</div>
        <div className="rule-grid">
          <div>
            <div className="rule-section__label">Symbol X</div>
            {renderRules("X")}
          </div>
          <div>
            <div className="rule-section__label">Symbol F</div>
            {renderRules("F")}
          </div>
        </div>
      </div>

      <div className="string-viewer">
        <div className="string-viewer__label">String Viewer</div>
        <div className="string-viewer__text">
          {preview.split("").map((char, index) => (
            <span
              key={`${char}-${index}`}
              className={highlightSymbol && char === highlightSymbol ? "string-viewer__highlight" : undefined}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </CollapsiblePanel>
  );
}
