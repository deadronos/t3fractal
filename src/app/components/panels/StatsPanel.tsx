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
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        <div className="bg-primary/5 border-primary/20 hover:bg-primary/10 rounded-lg border p-2 transition-all">
          <div className="text-primary text-[10px] font-semibold tracking-wider uppercase">
            Segments
          </div>
          <div className="text-primary text-sm font-bold tabular-nums">
            {formatNumber(stats.segmentCount)}
          </div>
        </div>
        <div className="bg-chart-1/10 border-chart-1/30 hover:bg-chart-1/15 rounded-lg border p-2 transition-all">
          <div className="text-chart-1 text-[10px] font-semibold tracking-wider uppercase">
            Leaves
          </div>
          <div className="text-chart-1 text-sm font-bold tabular-nums">
            {formatNumber(stats.leafCount)}
          </div>
        </div>
        <div className="bg-chart-3/10 border-chart-3/30 hover:bg-chart-3/15 rounded-lg border p-2 transition-all">
          <div className="text-chart-3 text-[10px] font-semibold tracking-wider uppercase">
            Exposure
          </div>
          <div className="text-chart-3 text-sm font-bold tabular-nums">
            {(stats.avgExposure * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-accent/5 border-accent/20 hover:bg-accent/10 rounded-lg border p-2 transition-all">
          <div className="text-accent text-[10px] font-semibold tracking-wider uppercase">
            Volume
          </div>
          <div className="text-accent text-sm font-bold tabular-nums">
            {formatNumber(stats.totalVolume)}
          </div>
        </div>
        <div className="bg-chart-4/10 border-chart-4/30 hover:bg-chart-4/15 rounded-lg border p-2 transition-all">
          <div className="text-chart-4 text-[10px] font-semibold tracking-wider uppercase">
            Sentence
          </div>
          <div className="text-chart-4 text-sm font-bold tabular-nums">
            {formatNumber(stats.sentenceLength)}
          </div>
        </div>
        <div className="bg-chart-2/10 border-chart-2/30 hover:bg-chart-2/15 rounded-lg border p-2 transition-all">
          <div className="text-chart-2 text-[10px] font-semibold tracking-wider uppercase">
            Height
          </div>
          <div className="text-chart-2 text-sm font-bold tabular-nums">
            {formatNumber(stats.maxHeight)}
          </div>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
