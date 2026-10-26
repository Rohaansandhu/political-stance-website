import { useState } from "react";
import { Box, Heading, Text, HStack, VStack, Badge } from "@chakra-ui/react";
import IdeologyAxisBar from "../CongressData/IdeologyAxisBar";
import AxisFingerprint from "./AxisFingerprint";
import ScaleModeToggle from "../CongressData/ScaleModeToggle";
import type { RosterMember, ScaleMode } from "../CongressData/axisStats";
import politicalAxes from "../../../data/politicalAxes.json";

interface AxisInfo {
  score: number;
  raw_score: number;
  bill_count: number;
  within_party_z: number | null;
  by_category: Record<string, { score: number; bill_count: number }>;
  rank: number;
  percentile_rank: number;
  total_members: number;
  current_rank: number;
  current_percentile_rank: number;
  total_current_members: number;
  defection_rate?: number;
}

// Display order: left_right first, then the next most independent signals,
// then the rest.
const AXIS_ORDER = [
  "left_right",
  "state_power",
  "fiscal",
  "security",
  "trade",
  "federalism",
  "institutional",
  "economic",
  "social",
  "global",
  "executive_power",
];

// Axes with relatively few scored bills — treat per-member scores as weaker evidence.
const SPARSE_BILL_COUNT_THRESHOLD = 15;

function axisName(axisId: string): string {
  return politicalAxes.political_axes.find((a) => a.id === axisId)?.name ?? axisId;
}

function AxisRow({
  axisId,
  info,
  roster,
  memberId,
  scaleMode,
}: {
  axisId: string;
  info: AxisInfo;
  roster: RosterMember[];
  memberId: string;
  scaleMode: ScaleMode;
}) {
  const [expanded, setExpanded] = useState(false);
  const isInstitutional = axisId === "institutional";
  const hasSufficientData = info.bill_count > 0 && info.rank !== -1;
  const isSparse = !isInstitutional && info.bill_count < SPARSE_BILL_COUNT_THRESHOLD;

  // institutional is compressed near -1 (most members vote with leadership
  // ~90% of the time); show defection rate as a % instead of the raw score.
  const displayValue = isInstitutional && info.defection_rate !== undefined
    ? `${(info.defection_rate * 100).toFixed(0)}%`
    : hasSufficientData
      ? info.score.toFixed(3)
      : "—";

  const scoreColor = info.score < -0.05 ? "#06b6d4" : info.score > 0.05 ? "#f97316" : "#8b5cf6";

  return (
    <Box
      bg="surface"
      rounded="lg"
      borderWidth="1px"
      borderColor="borderSubtle"
      borderLeft="3px solid"
      borderLeftColor={scoreColor}
      overflow="hidden"
    >
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
            {axisName(axisId)}
          </Text>
        </VStack>
        {isSparse && (
          <Badge colorPalette="yellow" variant="subtle" fontSize="2xs">
            Sparse data
          </Badge>
        )}
        <Text
          fontSize="sm"
          fontWeight="700"
          color={scoreColor}
          flexShrink={0}
          w="48px"
          textAlign="right"
        >
          {displayValue}
        </Text>
        <Text
          fontSize="sm"
          color="textMuted"
          flexShrink={0}
          w="44px"
          textAlign="right"
        >
          {info.current_rank !== -1
            ? `${(info.current_percentile_rank * 100).toFixed(0)}%`
            : "—"}
        </Text>
        <Text fontSize="xs" color="textMuted" flexShrink={0}>
          {expanded ? "▲" : "▼"}
        </Text>
      </HStack>

      {expanded && (
        <Box px={4} pb={4} pt={2} borderTopWidth="1px" borderColor="borderSubtle">
          {!hasSufficientData ? (
            <Box py={3} textAlign="center">
              <Text fontSize="sm" color="textMuted" fontWeight="600">
                Not Enough Voting Data
              </Text>
              <Text fontSize="xs" color="textMuted">
                Bills analyzed: {info.bill_count}
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" gap={3}>
              <HStack gap={6} wrap="wrap">
                <VStack gap={0} align="flex-start">
                  <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase">
                    {isInstitutional ? "Roll Calls" : "Bills"}
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="text">
                    {info.bill_count}
                  </Text>
                </VStack>
                <VStack gap={0} align="flex-start">
                  <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase">
                    Score
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color={scoreColor}>
                    {info.score.toFixed(3)}
                  </Text>
                </VStack>
                {info.within_party_z !== null && info.within_party_z !== undefined && (
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
              </HStack>

              <Box>
                <Text fontSize="xs" color="textMuted" fontWeight="600" textTransform="uppercase" mb={1}>
                  Vs. {scaleMode === "chamber" ? "Chamber" : scaleMode === "party" ? "Own Party" : "Raw Score"}
                </Text>
                <AxisFingerprint
                  axisId={axisId}
                  memberId={memberId}
                  roster={roster}
                  scaleMode={scaleMode}
                  highlightColor={scoreColor}
                />
              </Box>

              {Object.keys(info.by_category).length > 0 && (
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="textMuted" mb={2} textTransform="uppercase">
                    By Policy Category
                  </Text>
                  <VStack align="stretch" gap={1}>
                    {Object.entries(info.by_category)
                      .sort((a, b) => b[1].bill_count - a[1].bill_count)
                      .map(([cat, catInfo]) => (
                        <HStack key={cat} justify="space-between" fontSize="xs">
                          <Text color="textMuted" truncate flex={1}>
                            {cat}
                          </Text>
                          <Text color="text" fontWeight="600" flexShrink={0}>
                            {catInfo.score.toFixed(2)} ({catInfo.bill_count})
                          </Text>
                        </HStack>
                      ))}
                  </VStack>
                </Box>
              )}

              <IdeologyAxisBar axisId={axisId} compact />
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
}

export default function AxesGrid({
  axes,
  roster,
  memberId,
}: {
  axes: Record<string, AxisInfo>;
  roster: RosterMember[];
  memberId: string;
}) {
  const [scaleMode, setScaleMode] = useState<ScaleMode>("chamber");
  const ordered = AXIS_ORDER.filter((id) => axes[id]);
  const rest = Object.keys(axes).filter((id) => !AXIS_ORDER.includes(id));

  if (Object.keys(axes).length === 0) return null;

  return (
    <Box w="100%">
      <HStack justify="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Heading size="md" color="text">
          Ideological Axes
        </Heading>
        <ScaleModeToggle value={scaleMode} onChange={setScaleMode} />
      </HStack>

      <VStack align="stretch" gap={3}>
        {[...ordered, ...rest].map((id) => (
          <AxisRow
            key={id}
            axisId={id}
            info={axes[id]}
            roster={roster}
            memberId={memberId}
            scaleMode={scaleMode}
          />
        ))}
      </VStack>
    </Box>
  );
}
