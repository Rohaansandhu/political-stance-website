import { Box } from "@chakra-ui/react";
import { SIDE_COLOR, sideOf } from "./percentiles";

// Diverging from the middle, so the bar's length and color both show how far
// toward which pole the member sits.
export default function PercentileBar({ percentile }: { percentile: number }) {
  const pct = percentile * 100;
  const color = SIDE_COLOR[sideOf(percentile)];
  return (
    <Box position="relative" h="6px" bg="bgLightShade" rounded="full" aria-hidden>
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={`${Math.min(pct, 50)}%`}
        w={`${Math.abs(pct - 50)}%`}
        bg={color}
        opacity={0.5}
      />
      <Box position="absolute" left="50%" top="-2px" bottom="-2px" w="1px" bg="border" />
      <Box
        position="absolute"
        left={`${pct}%`}
        top="50%"
        transform="translate(-50%, -50%)"
        w="10px"
        h="10px"
        rounded="full"
        bg={color}
        borderWidth="2px"
        borderColor="surface"
      />
    </Box>
  );
}
