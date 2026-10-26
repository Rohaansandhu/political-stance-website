import { useState } from "react";
import { Box, Text, HStack, VStack, Badge } from "@chakra-ui/react";
import politicalAxes from "../../../data/politicalAxes.json";

interface IdeologyAxisBarProps {
  axisId: string;
  compact?: boolean;
}

export default function IdeologyAxisBar({
  axisId,
  compact = false,
}: IdeologyAxisBarProps) {
  const [expanded, setExpanded] = useState(false);
  const axis = politicalAxes.political_axes.find((a) => a.id === axisId);

  if (!axis) return null;

  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border"
      mb={4}
      fontSize={compact ? "sm" : "md"}
    >
      {/* Two-column header — always visible */}
      <HStack gap={0} align="stretch">
        {/* Negative pole */}
        <Box
          flex={1}
          bg="cyan.subtle"
          px={compact ? 4 : 6}
          py={compact ? 3 : 4}
          borderRight="2px solid"
          borderColor="cyan.muted"
        >
          <HStack gap={2} mb={1}>
            <Box w="10px" h="10px" borderRadius="full" bg="cyan.solid" flexShrink={0} />
            <Text
              fontWeight="700"
              color="cyan.fg"
              fontSize={compact ? "xs" : "sm"}
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              {axis.negative_pole.label}
            </Text>
          </HStack>
          <Text color="cyan.fg" lineHeight="1.5">
            {axis.negative_pole.description}
          </Text>
        </Box>

        {/* Positive pole */}
        <Box
          flex={1}
          bg="orange.subtle"
          px={compact ? 4 : 6}
          py={compact ? 3 : 4}
          borderLeft="2px solid"
          borderColor="orange.muted"
        >
          <HStack gap={2} mb={1}>
            <Box w="10px" h="10px" borderRadius="full" bg="orange.solid" flexShrink={0} />
            <Text
              fontWeight="700"
              color="orange.fg"
              fontSize={compact ? "xs" : "sm"}
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              {axis.positive_pole.label}
            </Text>
          </HStack>
          <Text color="orange.fg" lineHeight="1.5">
            {axis.positive_pole.description}
          </Text>
        </Box>
      </HStack>

      {/* Spectrum label bar */}
      <Box position="relative" bg="bgLightShade" px={6} py={1.5} borderTopWidth="1px" borderColor="borderSubtle">
        <HStack justify="space-between" position="relative" zIndex={1}>
          <Text fontSize="xs" color="cyan.fg" fontWeight="600">
            ← −1.0 {axis.negative_pole.label}
          </Text>
          <Text
            fontSize="xs"
            color="textMuted"
            cursor="pointer"
            _hover={{ color: "text" }}
            onClick={() => setExpanded((p) => !p)}
            userSelect="none"
          >
            {expanded ? "Show less ▲" : "Show more ▼"}
          </Text>
          <Text fontSize="xs" color="orange.fg" fontWeight="600">
            {axis.positive_pole.label} +1.0 →
          </Text>
        </HStack>
      </Box>

      {/* Scoring rule + boundary rules — shown when expanded */}
      {expanded && (
        <Box bg="surface" px={compact ? 4 : 6} py={4}>
          {axis.source === "computed" ? (
            <Badge colorPalette="purple" variant="subtle" mb={2}>
              Computed from roll calls, not scored by an LLM
            </Badge>
          ) : (
            <Badge colorPalette="blue" variant="subtle" mb={2}>
              Scored by LLM per bill
            </Badge>
          )}
          <Text fontSize="sm" color="text" mb={3}>
            {axis.scoring_rule}
          </Text>

          {axis.boundary_rules && axis.boundary_rules.length > 0 && (
            <Box mb={3}>
              <Text
                fontWeight="700"
                fontSize="xs"
                color="textMuted"
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                How this differs from related axes
              </Text>
              <VStack align="stretch" gap={1}>
                {axis.boundary_rules.map((rule, idx) => (
                  <Text key={idx} fontSize="xs" color="textMuted">
                    • {rule}
                  </Text>
                ))}
              </VStack>
            </Box>
          )}

          {axis.anchor_examples && axis.anchor_examples.length > 0 && (
            <Box>
              <Text
                fontWeight="700"
                fontSize="xs"
                color="textMuted"
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Example bills
              </Text>
              <VStack align="stretch" gap={2}>
                {axis.anchor_examples.map((ex, idx) => (
                  <HStack key={idx} justify="space-between" gap={3}>
                    <Text fontSize="xs" color="text" flex={1}>
                      {ex.description}
                    </Text>
                    <Badge
                      colorPalette={ex.position < 0 ? "cyan" : "orange"}
                      variant="subtle"
                      flexShrink={0}
                    >
                      {ex.position > 0 ? "+" : ""}
                      {ex.position.toFixed(1)}
                    </Badge>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
