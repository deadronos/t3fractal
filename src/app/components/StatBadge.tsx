import type { ReactElement } from "react";
import { Badge, Flex, Text } from "@radix-ui/themes";

type StatBadgeProps = {
  label: string;
  value: string;
  accent: "mint" | "cyan" | "iris" | "purple" | "gray";
};

export default function StatBadge({ label, value, accent }: StatBadgeProps): ReactElement {
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
