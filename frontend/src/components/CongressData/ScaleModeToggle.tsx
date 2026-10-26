import { HStack, Box, Text } from "@chakra-ui/react";
import type { ScaleMode } from "./axisStats";

const OPTIONS: { key: ScaleMode; label: string }[] = [
  { key: "chamber", label: "Vs. chamber" },
  { key: "party", label: "Vs. own party" },
  { key: "raw", label: "Raw" },
];

interface ScaleModeToggleProps {
  value: ScaleMode;
  onChange: (value: ScaleMode) => void;
}

// Stateless presentational toggle shared by the Congress Data compass and
// the legislator profile's axis fingerprint. Each page owns its own
// ScaleMode state -- this component only renders the control.
export default function ScaleModeToggle({ value, onChange }: ScaleModeToggleProps) {
  return (
    <HStack gap={2}>
      {OPTIONS.map((option) => (
        <Box
          key={option.key}
          onClick={() => onChange(option.key)}
          px={3}
          py={1}
          rounded="md"
          bg={value === option.key ? "primary" : "bgLightShade"}
          color={value === option.key ? "bg" : "textMuted"}
          cursor="pointer"
          fontSize="xs"
          fontWeight="600"
          transition="all 0.2s"
          _hover={{ bg: value === option.key ? "primaryHover" : "border" }}
        >
          <Text>{option.label}</Text>
        </Box>
      ))}
    </HStack>
  );
}
