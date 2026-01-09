"use client";

import { formatNumber } from "@/lib/format";
import type { LSystemStats } from "@/app/hooks/useLSystem";

export type StatsPanelProps = {
  stats: LSystemStats;
};

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <section className="panel stats-panel">
      <div className="panel__header">
        <div>
          <div className="panel__title">Analysis Readout</div>
          <div className="panel__subtitle">Structural telemetry.</div>
        </div>
      </div>
      <div className="stats-grid">
        <div>
          <div className="stats-label">Segments</div>
          <div className="stats-value">{formatNumber(stats.segmentCount)}</div>
        </div>
        <div>
          <div className="stats-label">Leaves</div>
          <div className="stats-value">{formatNumber(stats.leafCount)}</div>
        </div>
        <div>
          <div className="stats-label">Exposure</div>
          <div className="stats-value">{(stats.avgExposure * 100).toFixed(0)}%</div>
        </div>
        <div>
          <div className="stats-label">Volume</div>
          <div className="stats-value">{formatNumber(stats.totalVolume)}</div>
        </div>
        <div>
          <div className="stats-label">Sentence</div>
          <div className="stats-value">{formatNumber(stats.sentenceLength)}</div>
        </div>
        <div>
          <div className="stats-label">Height</div>
          <div className="stats-value">{formatNumber(stats.maxHeight)}</div>
        </div>
      </div>
    </section>
  );
}
