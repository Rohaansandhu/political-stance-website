import { Badge, type BadgeProps } from "@chakra-ui/react";

export default function BetaBadge(props: BadgeProps) {
  return (
    <Badge colorPalette="orange" variant="subtle" rounded="full" {...props}>
      Beta
    </Badge>
  );
}
