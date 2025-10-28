import type { ReactElement } from "react";
import { Box, Button, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes";

type PrestigeCardProps = {
  ascensionYield: number;
  ascendReady: boolean;
  amplifiers: number;
  amplifierCost: number;
  onAscend: () => void;
  onAmplifierPurchase: () => void;
};

export default function PrestigeCard({
  ascensionYield,
  ascendReady,
  amplifiers,
  amplifierCost,
  onAscend,
  onAmplifierPurchase,
}: PrestigeCardProps): ReactElement {
  return (
    <Card className="prestige-card">
      <Heading size="4" mb="1">
        Dimensional Ascension
      </Heading>
      <Text size="2" color="gray">
        Collapse the current fractal and start anew with permanent
        insight. Costs your progress but grants Dimensional Points.
      </Text>
      <Separator my="3" size="4" />
      <Flex align="center" justify="between" mb="3">
        <Box>
          <Text size="2">Ascension yield: {ascensionYield} DP</Text>
          <Text size="2" color={ascendReady ? "mint" : "gray"}>
            Status: {ascendReady ? "Ready" : "Not yet"}
          </Text>
        </Box>
        <Button
          onClick={onAscend}
          color={ascendReady ? "purple" : "gray"}
          variant={ascendReady ? "solid" : "soft"}
        >
          Ascend
        </Button>
      </Flex>
      <Box className="prestige-upgrades">
        <Heading size="3">Dimensional Amplifiers</Heading>
        <Text size="2" color="gray">
          Spend Dimensional Points for permanent production boosts that
          survive resets.
        </Text>
        <Flex align="center" justify="between" mt="2">
          <Text size="2">Amplifiers owned: {amplifiers}</Text>
          <Button
            onClick={onAmplifierPurchase}
            variant="soft"
            color="mint"
          >
            Buy ({amplifierCost} DP)
          </Button>
        </Flex>
      </Box>
    </Card>
  );
}
