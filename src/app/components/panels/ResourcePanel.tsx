"use client";

import { useGameStore } from "@/store/gameStore";
import { formatNumber, formatRate } from "@/lib/format";
import { SEASONS } from "@/lib/gameData";

export type ResourcePanelProps = {
  rates: { photosynthesis: number; sap: number };
};

export default function ResourcePanel({ rates }: ResourcePanelProps) {
  const photosynthesis = useGameStore((state) => state.photosynthesis);
  const sap = useGameStore((state) => state.sap);
  const seeds = useGameStore((state) => state.seeds);
  const fruit = useGameStore((state) => state.fruit);
  const season = useGameStore((state) => state.season);

  const seasonData = SEASONS[season];

  return (
    <section className="panel resource-panel">
      <div className="panel__header">
        <div>
          <div className="panel__title">Energy Ledger</div>
          <div className="panel__subtitle">{seasonData.tagline}</div>
        </div>
        <span className="badge" style={{ background: seasonData.palette.accent }}>
          {seasonData.name}
        </span>
      </div>
      <div className="resource-list">
        <div className="resource">
          <div>
            <div className="resource__label">Photosynthesis</div>
            <div className="resource__value">{formatNumber(photosynthesis)}</div>
          </div>
          <div className="resource__rate">{formatRate(rates.photosynthesis)}</div>
        </div>
        <div className="resource">
          <div>
            <div className="resource__label">Sap</div>
            <div className="resource__value">{formatNumber(sap)}</div>
          </div>
          <div className="resource__rate">{formatRate(rates.sap)}</div>
        </div>
        <div className="resource">
          <div>
            <div className="resource__label">Seeds</div>
            <div className="resource__value">{formatNumber(seeds)}</div>
          </div>
          <div className="resource__rate">Prestige</div>
        </div>
        <div className="resource">
          <div>
            <div className="resource__label">Fruit</div>
            <div className="resource__value">{formatNumber(fruit)}</div>
          </div>
          <div className="resource__rate">Autumn harvest</div>
        </div>
      </div>
    </section>
  );
}
