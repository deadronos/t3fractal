"use client";

import type { ReactElement } from "react";
import React from "react";

import { Flex, Grid, Heading } from "@radix-ui/themes";

import ThemeToggle from "@/app/components/ThemeToggle";
import StatBadge from "@/app/components/StatBadge";
import { formatCompactNumber } from "@/lib/utils/formatters";

type StartHereMenuProps = {
  fractalData: number;
  depth: number;
  dataPerSecond: number;
  dimensionalPoints: number;
  resonance: number;
  anomalies: number;
};

export default function StartHereMenu({
  fractalData,
  depth,
  dataPerSecond,
  dimensionalPoints,
  resonance,
  anomalies,
}: StartHereMenuProps): ReactElement {
  return (
    <Flex
      className="starthere-menu"
      align="center"
      justify="between"
      wrap="wrap"
    >
      <Flex align="center" gap="3">
        <Heading size="5" className="menu-title">
          Fractal Frontier Control Deck
        </Heading>
        <ThemeToggle />
      </Flex>
      <Grid columns={{ initial: "1", sm: "2", md: "6" }} gap="3" width="auto">
        <StatBadge
          label="Fractal Data"
          value={`${formatCompactNumber(fractalData)} units`}
          accent="mint"
        />
        <StatBadge
          label="Data / sec"
          value={`${formatCompactNumber(dataPerSecond)} /s`}
          accent="cyan"
        />
        <StatBadge label="Zoom Depth" value={depth.toFixed(2)} accent="iris" />
        <StatBadge
          label="Dimensional Points"
          value={dimensionalPoints.toFixed(0)}
          accent={dimensionalPoints > 0 ? "purple" : "gray"}
        />
        <StatBadge
          label="Resonance"
          value={resonance.toFixed(0)}
          accent={resonance > anomalies ? "mint" : "iris"}
        />
        <StatBadge
          label="Anomalies"
          value={anomalies.toFixed(0)}
          accent={anomalies > 0 ? "iris" : "gray"}
        />
      </Grid>
    </Flex>
  );
}
