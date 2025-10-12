"use client";

import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";

import { Badge, Flex, Grid, Heading, Text } from "@radix-ui/themes";

type StartHereMenuProps = {
  fractalData: number;
  depth: number;
  dataPerSecond: number;
  dimensionalPoints: number;
  resonance: number;
  anomalies: number;
};

const formatCompactNumber = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(0);
};

export default function StartHereMenu({
  fractalData,
  depth,
  dataPerSecond,
  dimensionalPoints,
  resonance,
  anomalies,
}: StartHereMenuProps): ReactElement {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", isDark);
    } catch {
      /* noop */
    }
  }, [isDark]);

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
        <button
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setIsDark((v) => !v)}
          className="rounded-full bg-white/5 p-2 hover:bg-white/10"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
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

type StatBadgeProps = {
  label: string;
  value: string;
  accent: "mint" | "cyan" | "iris" | "purple" | "gray";
};

function StatBadge({ label, value, accent }: StatBadgeProps): ReactElement {
  return (
    <Flex direction="column" gap="1">
      <Text size="1" color="gray">
        {label}
      </Text>
      <Badge color={accent} size="3">
        {value}
      </Badge>
    </Flex>
  );
}
