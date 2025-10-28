import type { ReactElement } from "react";
import { Button, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes";

import { UPGRADE_CONFIG } from "@/data/gameConfig";
import type { UpgradeKey } from "@/store/gameStore";
import { formatNumber } from "@/lib/gameplay/formatters";

type UpgradesCardProps = {
  upgrades: Record<UpgradeKey, number>;
  upgradeCost: (key: UpgradeKey) => number;
  onPurchase: (key: UpgradeKey) => void;
};

export default function UpgradesCard({
  upgrades,
  upgradeCost,
  onPurchase,
}: UpgradesCardProps): ReactElement {
  return (
    <Card className="upgrade-card">
      <Heading size="4" mb="1">
        Automation Upgrades
      </Heading>
      <Text size="2" color="gray">
        Invest Fractal Data to automate exploration. Each stack compounds
        with your dimensional bonuses.
      </Text>
      <Separator my="3" size="4" />
      <Flex direction="column" gap="3">
        {Object.entries(UPGRADE_CONFIG).map(([key, config]) => {
          const typedKey = key as UpgradeKey;
          const owned = upgrades[typedKey];
          const cost = upgradeCost(typedKey);
          return (
            <Card key={key} className="upgrade-row">
              <Flex justify="between" align="center" mb="2">
                <Heading size="3">{config.title}</Heading>
                <Text size="2" color="gray">
                  Owned: {owned}
                </Text>
              </Flex>
              <Text size="2" color="gray">
                {config.description}
              </Text>
              <Text size="2" color="mint" mb="2">
                {config.flavor}
              </Text>
              <Button onClick={() => onPurchase(typedKey)}>
                Purchase ({formatNumber(cost)} Data)
              </Button>
            </Card>
          );
        })}
      </Flex>
    </Card>
  );
}
