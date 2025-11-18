import type { ReactElement } from "react";
import { Badge, Box, Button, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes";

import { formatNumber } from "@/lib/gameplay/formatters";

type CosmicEventCardProps = {
  eventCountdown: number;
  resonance: number;
  anomalies: number;
  expeditionCost: number;
  expeditionPreview: number;
  stabiliseCost: number;
  omenMessage: string;
  onExpedition: () => void;
  onStabiliseAnomaly: () => void;
};

export default function CosmicEventCard({
  eventCountdown,
  resonance,
  anomalies,
  expeditionCost,
  expeditionPreview,
  stabiliseCost,
  omenMessage,
  onExpedition,
  onStabiliseAnomaly,
}: CosmicEventCardProps): ReactElement {
  const nextEventLabel = eventCountdown <= 0 ? "Imminent" : `${eventCountdown}s`;

  return (
    <Card className="event-card">
      <Heading size="4">Cosmic Forecast</Heading>
      <Text size="2" color="gray">
        The Galactic Cartographers share whimsical predictions about your
        frontier.
      </Text>
      <Separator my="3" size="4" />
      <Flex justify="between" align="center" mb="3">
        <Flex direction="column">
          <Text size="2" color="gray">
            Next phenomenon
          </Text>
          <Text size="3" weight="bold" color="mint">
            {nextEventLabel}
          </Text>
        </Flex>
        <Badge
          color={anomalies > 0 ? "iris" : "mint"}
          variant="soft"
          className="countdown-badge"
        >
          {omenMessage}
        </Badge>
      </Flex>
      <Flex direction="column" gap="2" className="cosmic-stat">
        <Flex justify="between" align="center">
          <Text size="2">Resonance Flow</Text>
          <Text size="2" color="mint">
            {resonance.toFixed(0)}
          </Text>
        </Flex>
        <Box className="cosmic-meter">
          <Box
            className="cosmic-meter-fill"
            style={{ width: `${Math.min(100, resonance * 5)}%` }}
          />
        </Box>
      </Flex>
      <Flex direction="column" gap="2" className="cosmic-stat">
        <Flex justify="between" align="center">
          <Text size="2">Anomaly Bloom</Text>
          <Text size="2" color={anomalies > 0 ? "iris" : "gray"}>
            {anomalies}
          </Text>
        </Flex>
        <Box className="cosmic-meter anomaly">
          <Box
            className="cosmic-meter-fill"
            style={{ width: `${Math.min(100, anomalies * 20)}%` }}
          />
        </Box>
      </Flex>
      <Separator my="3" size="4" />
      <Flex direction="column" gap="3">
        <Button onClick={onExpedition} color="cyan">
          Dispatch Expedition (Cost: {formatNumber(expeditionCost)})
        </Button>
        <Text size="2" color="gray">
          Expected haul: ~{expeditionPreview} resonance shards plus modest
          depth insights.
        </Text>
        <Button
          onClick={onStabiliseAnomaly}
          variant="soft"
          color="purple"
        >
          Stabilise Anomaly (Cost: {formatNumber(stabiliseCost)})
        </Button>
      </Flex>
    </Card>
  );
}
