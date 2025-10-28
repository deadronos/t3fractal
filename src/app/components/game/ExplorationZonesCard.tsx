import type { ReactElement } from "react";
import { Card, Flex, Heading, Separator, Text } from "@radix-ui/themes";

import { FRACTAL_ZONES } from "@/data/gameConfig";

type ExplorationZonesCardProps = {
  depth: number;
};

export default function ExplorationZonesCard({
  depth,
}: ExplorationZonesCardProps): ReactElement {
  return (
    <Card className="zone-card">
      <Heading size="4">Exploration Zones</Heading>
      <Text size="2" color="gray">
        Deeper zooms reveal new fractal biomes. Each grants a unique
        production bonus.
      </Text>
      <Separator my="3" size="4" />
      <Flex direction="column" gap="3">
        {FRACTAL_ZONES.map((zone) => {
          const unlocked = depth >= zone.requirement;
          return (
            <Card
              key={zone.name}
              className={`zone-entry ${unlocked ? "zone-unlocked" : "zone-locked"}`}
            >
              <Flex justify="between" align="center" mb="1">
                <Heading size="3">{zone.name}</Heading>
                <Text size="2" color={unlocked ? "mint" : "gray"}>
                  {unlocked ? "Unlocked" : `Depth ${zone.requirement}`}
                </Text>
              </Flex>
              <Text size="2" color="gray">
                {zone.description}
              </Text>
              <Text size="2" color="mint">
                Bonus: +{Math.round(zone.bonus * 100)}% production
              </Text>
            </Card>
          );
        })}
      </Flex>
    </Card>
  );
}
