import type { ReactElement } from "react";
import { Box, Button, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes";

type PrestigeCardProps = {
  ascensionYield: number;
  ascendReady: boolean;
  amplifiers: number;
  amplifierCost: number;
  onAscend: () => void;
  onAmplifierPurchase: () => void;
  harmonicCores: number;
  transcensionLevel: number;
  transcensionReady: boolean;
  transcensionYield: number;
  onTranscend: () => void;
};

export default function PrestigeCard({
  ascensionYield,
  ascendReady,
  amplifiers,
  amplifierCost,
  onAscend,
  onAmplifierPurchase,
  harmonicCores,
  transcensionLevel,
  transcensionReady,
  transcensionYield,
  onTranscend,
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
      <Separator my="3" size="4" />
      <Box className="prestige-upgrades">
        <Heading size="3">Harmonic Transcendence</Heading>
        <Text size="2" color="gray">
          A deeper reset that burns Dimensional Points into Harmonic Cores and
          unlocks the Julia Lab.
        </Text>
        <Flex align="center" justify="between" mt="2" wrap="wrap" gap="2">
          <Box>
            <Text size="2">Cores banked: {harmonicCores}</Text>
            <Text size="2" color={transcensionReady ? "mint" : "gray"}>
              Status: {transcensionReady ? "Ready" : "Requires second prestige"}
            </Text>
            <Text size="2" color="gray">
              Current tier: {transcensionLevel + 1}
            </Text>
          </Box>
          <Button
            onClick={onTranscend}
            color={transcensionReady ? "purple" : "gray"}
            variant={transcensionReady ? "solid" : "soft"}
          >
            Transcend ({transcensionYield} cores)
          </Button>
        </Flex>
      </Box>
    </Card>
  );
}
