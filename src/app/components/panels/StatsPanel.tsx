"use client";

import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import { formatNumber } from "@/lib/format";
import type { LSystemStats } from "@/app/hooks/useLSystem";

export type StatsPanelProps = {
  stats: LSystemStats;
};

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <CollapsiblePanel
      title="Analysis Readout"
      subtitle="Structural telemetry."
      className="stats-panel"
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="bg-background/40 p-2 rounded-lg border border-primary/5">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Segments</div>
          <div className="font-semibold text-sm tabular-nums">{formatNumber(stats.segmentCount)}</div>
        </div>
        <div className="bg-background/40 p-2 rounded-lg border border-primary/5">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Leaves</div>
          <div className="font-semibold text-sm tabular-nums">{formatNumber(stats.leafCount)}</div>
        </div>
        <div className="bg-background/40 p-2 rounded-lg border border-primary/5">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Exposure</div>
          <div className="font-semibold text-sm tabular-nums">{(stats.avgExposure * 100).toFixed(0)}%</div>
        </div>
        <div className="bg-background/40 p-2 rounded-lg border border-primary/5">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Volume</div>
          <div className="font-semibold text-sm tabular-nums">{formatNumber(stats.totalVolume)}</div>
        </div>
        <div className="bg-background/40 p-2 rounded-lg border border-primary/5">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Sentence</div>
          <div className="font-semibold text-sm tabular-nums">{formatNumber(stats.sentenceLength)}</div>
        </div>
        <div className="bg-background/40 p-2 rounded-lg border border-primary/5">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Height</div>
          <div className="font-semibold text-sm tabular-nums">{formatNumber(stats.maxHeight)}</div>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
