import type { ReactElement } from "react";
import { Badge, Flex, Text } from "@radix-ui/themes";

/**
 * Props for the StatBadge component.
 */
type StatBadgeProps = {
  /** Label text for the statistic. */
  label: string;
  /** Value to display. */
  value: string;
  /** Color accent for the badge. */
  accent: "mint" | "cyan" | "iris" | "purple" | "gray";
};

/**
 * A simple badge component to display a labeled statistic.
 *
 * @param props - Component props.
 * @returns The rendered badge.
 */
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
