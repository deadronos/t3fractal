import type { ReactElement } from "react";

import { Badge, Flex, Grid, Heading, Text } from "@radix-ui/themes";

type StartHereMenuProps = {
  fractalData: number;
  depth: number;
  dataPerSecond: number;
  dimensionalPoints: number;
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
}: StartHereMenuProps): ReactElement {
  return (
    <Flex className="starthere-menu" align="center" justify="between" wrap="wrap">
      <Heading size="5" className="menu-title">
        Fractal Frontier Control Deck
      </Heading>
      <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="3" width="auto">
        <StatBadge label="Fractal Data" value={`${formatCompactNumber(fractalData)} units`} accent="mint" />
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
      <Text size="1" color="gray">{label}</Text>
      <Badge color={accent} size="3">
        {value}
      </Badge>
    </Flex>
  );
}