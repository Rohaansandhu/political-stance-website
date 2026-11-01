import { Box, HStack } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import type { Comparison, MemberContext } from "./percentiles";

interface ComparisonToggleProps {
  ctx: MemberContext;
  onChange: (value: Comparison) => void;
}

// The page holds one comparison state, so this control appears above both the
// axes and the categories and always changes the two together.
export default function ComparisonToggle({ ctx, onChange }: ComparisonToggleProps) {
  const options: { key: Comparison; label: string; disabled: boolean }[] = [
    { key: "chamber", label: ctx.chamber, disabled: false },
    { key: "party", label: "Own party", disabled: !ctx.canComparePartyPeers },
  ];

  return (
    <HStack gap={1} role="group" aria-label="Compare with">
      {options.map((option) => {
        const isActive = ctx.comparison === option.key;
        const button = (
          <Box
            as="button"
            key={option.key}
            aria-pressed={isActive}
            aria-disabled={option.disabled}
            onClick={() => {
              if (!option.disabled) onChange(option.key);
            }}
            px={3}
            py={1}
            rounded="md"
            bg={isActive ? "primary" : "bgLightShade"}
            color={isActive ? "bg" : "textMuted"}
            opacity={option.disabled ? 0.5 : 1}
            cursor={option.disabled ? "not-allowed" : "pointer"}
            fontSize="xs"
            fontWeight="600"
            transition="all 0.2s"
            _hover={
              option.disabled
                ? undefined
                : { bg: isActive ? "primaryHover" : "border" }
            }
          >
            {option.label}
          </Box>
        );
        return option.disabled ? (
          <Tooltip
            key={option.key}
            content="This member isn't in a party caucus we track, or isn't currently in office, so there's no party group to compare with."
          >
            {button}
          </Tooltip>
        ) : (
          button
        );
      })}
    </HStack>
  );
}
