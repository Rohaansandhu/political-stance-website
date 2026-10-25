import { useState } from "react";
import { Box, Heading, Text, HStack, VStack, Badge } from "@chakra-ui/react";
import IdeologyViewsBar from "../CongressData/IdeologyViewBar";
import politicalAxes from "../../../data/politicalAxes.json";
import type { AxisDefinition } from "../../types/axisDefinitions";
import type { Axes, AxisInfo } from "../../types/axes";
import { SPARSE_AXES, OVERLAP_NOTES, sortAxisIds } from "../../utils/axisDisplay";

function ScoreBar({
  value,
  min = -1,
  max = 1,
  color,
}: {
  value: number;
  min?: number;
  max?: number;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <Box position="relative" h="8px" bg="bgLightShade" rounded="full">
      <Box
        position="absolute"
        left={`${Math.min(100, Math.max(0, pct))}%`}
        top="50%"
        transform="translate(-50%, -50%)"
        w="12px"
        h="12px"
        bg={color}
        rounded="full"
        borderWidth="2px"
        borderColor="surface"
        boxShadow="sm"
      />
    </Box>
  );
}

function getAxisPositionInfo(axis: AxisDefinition, percentile: number) {
  if (percentile < 0.4) return { label: axis.negative_pole.label, color: "#3b82f6" };
  if (percentile > 0.6) return { label: axis.positive_pole.label, color: "#ef4444" };
  return { label: "Moderate", color: "#8b5cf6" };
}

function AxisRow({ axisId, info, axis }: { axisId: string; info: AxisInfo; axis: AxisDefinition }) {
  const [expanded, setExpanded] = useState(false);

  const isInstitutional = axisId === "institutional";
  const isSparse = SPARSE_AXES.has(axisId);
  const overlapNote = OVERLAP_NOTES[axisId];

  const hasSufficientData = info.bill_count > 10 && info.rank !== -1;
  const hasCurrentData = info.current_rank !== -1 && hasSufficientData;

  const position = hasSufficientData
    ? getAxisPositionInfo(axis, info.current_percentile_rank)
    : { label: "No Data", color: "#9ca3af" };

  const scoreColor =
    info.score < -0.2 ? "#3b82f6" : info.score > 0.2 ? "#ef4444" : "#8b5cf6";

  const headlineValue =
    isInstitutional && info.defection_rate != null
      ? `${(info.defection_rate * 100).toFixed(0)}%`
      : hasSufficientData
        ? info.score.toFixed(2)
        : "—";

  const byCategoryEntries = info.by_category ? Object.entries(info.by_category) : [];

  return (
    <Box
      bg="surface"
      rounded="lg"
      borderWidth="1px"
      borderColor="borderSubtle"
      borderLeft="3px solid"
      borderLeftColor={position.color}
      overflow="hidden"
    >
      {/* Collapsed row — always visible */}
      <HStack
        px={3}
        py={2}
        cursor="pointer"
        onClick={() => setExpanded(!expanded)}
        _hover={{ bg: "bgLightShade" }}
        transition="background 0.15s"
        gap={3}
      >
        <VStack align="flex-start" gap={0} flex={1} minW={0}>
          <Text fontSize="sm" fontWeight="600" color="text" truncate>
            {axis.name}
          </Text>
          <Text fontSize="2xs" color="textMuted" truncate>
            {axis.negative_pole.label} ↔ {axis.positive_pole.label}
          </Text>
        </VStack>
        <Text
          fontSize="sm"
          fontWeight="700"
          color={isInstitutional ? "text" : scoreColor}
          flexShrink={0}
          w="48px"
          textAlign="right"
        >
          {headlineValue}
        </Text>
        <Text
          fontSize="sm"
          color="textMuted"
          flexShrink={0}
          w="44px"
          textAlign="right"
        >
          {hasCurrentData
            ? `${(info.current_percentile_rank * 100).toFixed(0)}%`
            : "—"}
        </Text>
        <Box
          px={2}
          py="2px"
          rounded="md"
          bg={position.color}
          color="white"
          fontSize="xs"
          fontWeight="600"
          flexShrink={0}
          w="130px"
          textAlign="center"
          truncate
        >
          {position.label}
        </Box>
        <Text fontSize="xs" color="textMuted" flexShrink={0}>
          {expanded ? "▲" : "▼"}
        </Text>
      </HStack>

      {/* Expanded content */}
      {expanded && (
        <Box px={4} pb={4} pt={2} borderTopWidth="1px" borderColor="borderSubtle">
          {!hasSufficientData ? (
            <Box py={3} textAlign="center">
              <Text fontSize="sm" color="textMuted" fontWeight="600">
                Not Enough Voting Data
              </Text>
              <Text fontSize="xs" color="textMuted">
                {isInstitutional ? "Roll calls" : "Bills"} analyzed: {info.bill_count}
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" gap={3}>
              {/* Key metrics */}
              <HStack gap={6} flexWrap="wrap">
                <VStack gap={0} align="flex-start">
                  <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase">
                    {isInstitutional ? "Roll Calls" : "Bills"}
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="text">
                    {info.bill_count}
                  </Text>
                </VStack>

                {isInstitutional && info.defection_rate != null ? (
                  <VStack gap={0} align="flex-start">
                    <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase">
                      Defection Rate
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color="text">
                      {(info.defection_rate * 100).toFixed(1)}%
                    </Text>
                  </VStack>
                ) : (
                  <VStack gap={0} align="flex-start">
                    <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase">
                      Score
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color={scoreColor}>
                      {info.score.toFixed(3)}
                    </Text>
                  </VStack>
                )}

                <VStack gap={0} align="flex-start">
                  <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase">
                    Percentile
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color={position.color}>
                    {hasCurrentData ? `${(info.current_percentile_rank * 100).toFixed(1)}%` : "—"}
                  </Text>
                </VStack>

                {hasCurrentData && (
                  <VStack gap={0} align="flex-start">
                    <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase">
                      Rank
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color="text">
                      #{info.current_rank}{" "}
                      <Text as="span" fontSize="xs" color="textMuted">
                        of {info.total_current_members}
                      </Text>
                    </Text>
                  </VStack>
                )}

                {info.within_party_z != null && (
                  <VStack gap={0} align="flex-start">
                    <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase">
                      Within-Party Z
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color="text">
                      {info.within_party_z > 0 ? "+" : ""}
                      {info.within_party_z.toFixed(2)}
                    </Text>
                  </VStack>
                )}
              </HStack>

              {/* Score bar — skip the raw score bar for institutional, it's compressed near -1 */}
              {!isInstitutional && (
                <Box>
                  <Text fontSize="xs" color="textMuted" fontWeight="600" mb={1}>
                    {axis.name} Score
                  </Text>
                  <ScoreBar value={info.score} min={-1} max={1} color={scoreColor} />
                  <HStack justify="space-between" mt={1}>
                    <Text fontSize="xs" color="partyDem">
                      {axis.negative_pole.label} (−1)
                    </Text>
                    <Text fontSize="xs" color="partyRep">
                      {axis.positive_pole.label} (+1)
                    </Text>
                  </HStack>
                </Box>
              )}

              {/* Percentile bar */}
              {hasCurrentData && (
                <Box>
                  <Text fontSize="xs" color="textMuted" fontWeight="600" mb={1}>
                    Ideological Position
                  </Text>
                  <ScoreBar value={info.current_percentile_rank} min={0} max={1} color={position.color} />
                  <HStack justify="space-between" mt={1}>
                    <Text fontSize="xs" color="partyDem">
                      {axis.negative_pole.label}
                    </Text>
                    <Text fontSize="xs" color="partyRep">
                      {axis.positive_pole.label}
                    </Text>
                  </HStack>
                </Box>
              )}

              {/* Position description */}
              {hasCurrentData && (
                <Box
                  p={3}
                  bg={`${position.color}10`}
                  rounded="lg"
                  borderLeft="3px solid"
                  borderLeftColor={position.color}
                >
                  <Text fontSize="sm" color="text">
                    <strong>Position:</strong> This legislator ranks more{" "}
                    {info.current_percentile_rank < 0.5
                      ? axis.negative_pole.label.toLowerCase()
                      : axis.positive_pole.label.toLowerCase()}{" "}
                    than{" "}
                    {Math.abs(info.current_percentile_rank - 0.5) < 0.15
                      ? "about half"
                      : info.current_percentile_rank < 0.5
                        ? `${((1 - info.current_percentile_rank) * 100).toFixed(0)}%`
                        : `${(info.current_percentile_rank * 100).toFixed(0)}%`}{" "}
                    of their peers on {axis.name.toLowerCase()}.
                  </Text>
                </Box>
              )}

              {/* Caveats */}
              {isSparse && (
                <Box p={2} bg="orange.subtle" rounded="md">
                  <Text fontSize="xs" color="orange.fg">
                    This axis applies to relatively few bills — this score rests on limited data.
                  </Text>
                </Box>
              )}
              {overlapNote && (
                <Box p={2} bg="orange.subtle" rounded="md">
                  <Text fontSize="xs" color="orange.fg">
                    {overlapNote}
                  </Text>
                </Box>
              )}

              {/* Per-category breakdown */}
              {byCategoryEntries.length > 0 && (
                <Box>
                  <Text fontSize="xs" color="textMuted" fontWeight="700" textTransform="uppercase" mb={2}>
                    By Policy Category
                  </Text>
                  <HStack gap={2} flexWrap="wrap">
                    {byCategoryEntries
                      .sort((a, b) => b[1].bill_count - a[1].bill_count)
                      .map(([catName, catInfo]) => (
                        <Badge key={catName} variant="subtle" colorPalette="purple" fontSize="xs">
                          {catName}: {catInfo.score.toFixed(2)} ({catInfo.bill_count})
                        </Badge>
                      ))}
                  </HStack>
                </Box>
              )}

              {/* Pole definitions */}
              <IdeologyViewsBar axisId={axisId} compact />
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
}

export default function AxesGrid({ axes }: { axes: Axes }) {
  const orderedAxisIds = sortAxisIds(Object.keys(axes));

  if (orderedAxisIds.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Text color="textMuted">
          No axis data available for this legislator under the selected model.
        </Text>
      </Box>
    );
  }

  return (
    <Box w="100%">
      <HStack justify="space-between" mb={3} flexWrap="wrap">
        <Heading size="md" color="text">
          Ideological Axes
        </Heading>
      </HStack>

      <Text fontSize="sm" color="textMuted" mb={3}>
        Viewpoints that cut across policy categories. Scores run from −1 to +1 between each
        axis's two poles and are shrunk toward the member's party average, so magnitudes are
        small — compare using percentile/rank rather than raw score where possible.
      </Text>

      {/* Column headers */}
      <HStack px={3} pb={1} gap={3}>
        <Text fontSize="xs" color="textMuted" flex={1}>
          Axis
        </Text>
        <Text fontSize="xs" color="textMuted" w="48px" textAlign="right">
          Score
        </Text>
        <Text fontSize="xs" color="textMuted" w="44px" textAlign="right">
          Pctile
        </Text>
        <Text fontSize="xs" color="textMuted" w="130px" textAlign="center">
          Position
        </Text>
        <Box w="16px" />
      </HStack>

      <VStack align="stretch" gap={1}>
        {orderedAxisIds.map((axisId) => {
          const definition = politicalAxes.political_axes.find((a) => a.id === axisId) as
            | AxisDefinition
            | undefined;
          if (!definition) return null;
          return <AxisRow key={axisId} axisId={axisId} info={axes[axisId]} axis={definition} />;
        })}
      </VStack>
    </Box>
  );
}
