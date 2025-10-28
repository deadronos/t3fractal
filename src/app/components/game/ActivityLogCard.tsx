import type { ReactElement } from "react";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";

type ActivityLogCardProps = {
  activityLog: string[];
};

export default function ActivityLogCard({
  activityLog,
}: ActivityLogCardProps): ReactElement {
  return (
    <Card className="log-card">
      <Heading size="4" mb="2">
        Mission Log
      </Heading>
      <Flex direction="column" gap="2">
        {activityLog.map((entry, index) => (
          <Text
            key={`${entry}-${index}`}
            size="2"
            color={index === 0 ? "mint" : "gray"}
          >
            {entry}
          </Text>
        ))}
      </Flex>
    </Card>
  );
}
