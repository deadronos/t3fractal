import type { ReactElement } from "react";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";

/**
 * Props for the ActivityLogCard component.
 */
type ActivityLogCardProps = {
  /** Array of log messages. */
  activityLog: string[];
};

/**
 * Displays a list of recent game activities/logs.
 *
 * @param props - Component props.
 * @returns The card component.
 */
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
