import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import {
  LEFT_RIGHT_BIN_START,
  LEFT_RIGHT_BIN_WIDTH,
  LEFT_RIGHT_BINS,
  LEFT_RIGHT_ENDS,
} from "./showcaseData";
import { LegendDot, MockCard, MockChip } from "./landingParts";
import { PARTY_FILL, signedScore } from "./showcaseUtils";

const BAR_WIDTH = 10;
const BAR_GAP = 2;
const CHART_HEIGHT = 156;
const CHART_WIDTH = LEFT_RIGHT_BINS.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
const MAX_COUNT = Math.max(...LEFT_RIGHT_BINS.flat());

const ZERO_PCT = (-LEFT_RIGHT_BIN_START / (LEFT_RIGHT_BINS.length * LEFT_RIGHT_BIN_WIDTH)) * 100;

function RankingList({ title, rows }: { title: string; rows: typeof LEFT_RIGHT_ENDS.liberal }) {
  return (
    <Box minW={0}>
      <Text fontSize="xs" fontWeight="semibold" color="textMuted" mb={1.5}>
        {title}
      </Text>
      {rows.map((row, i) => (
        <HStack key={row.name} justify="space-between" gap={3} py={1.5} borderTopWidth="1px" borderColor="borderSubtle">
          <Text fontSize="sm" color="text" truncate>
            <Text as="span" color="textMuted" mr={2} fontVariantNumeric="tabular-nums">
              {i + 1}
            </Text>
            {row.name}
          </Text>
          <Text fontSize="xs" color="textMuted" fontVariantNumeric="tabular-nums">
            {signedScore(row.score, 3)}
          </Text>
        </HStack>
      ))}
    </Box>
  );
}

export function CongressDataMock() {
  return (
    <Box>
      <MockCard>
        <HStack justify="space-between" wrap="wrap" gap={3} mb={4}>
          <Box>
            <Text fontSize="md" fontWeight="semibold" color="text">
              Left-Right
            </Text>
            <Text fontSize="xs" color="textMuted">
              House · 432 current legislators
            </Text>
          </Box>
          <HStack gap={1.5}>
            <MockChip active>Histogram</MockChip>
            <MockChip>Scatter</MockChip>
            <MockChip>Rankings</MockChip>
          </HStack>
        </HStack>

        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          width="100%"
          role="img"
          aria-label="Histogram of Left-Right scores for current House members: Democrats cluster on the liberal side, Republicans on the conservative side, with almost nobody between them."
        >
          {LEFT_RIGHT_BINS.map(([dem, rep], i) => {
            const count = dem + rep;
            if (count === 0) return null;
            const height = Math.max(3, (count / MAX_COUNT) * (CHART_HEIGHT - 4));
            return (
              <rect
                key={i}
                x={i * (BAR_WIDTH + BAR_GAP)}
                y={CHART_HEIGHT - height}
                width={BAR_WIDTH}
                // Extends past the baseline so only the top corners read as rounded.
                height={height + 4}
                rx={3}
                fill={dem >= rep ? PARTY_FILL.D : PARTY_FILL.R}
              />
            );
          })}
        </svg>

        <Box position="relative" h="20px" mt={1} borderTopWidth="1px" borderColor="border">
          <Text position="absolute" left={0} top={1} fontSize="xs" color="textMuted">
            Liberal
          </Text>
          <Text
            position="absolute"
            left={`${ZERO_PCT}%`}
            top={1}
            transform="translateX(-50%)"
            fontSize="xs"
            color="textMuted"
          >
            0
          </Text>
          <Text position="absolute" right={0} top={1} fontSize="xs" color="textMuted">
            Conservative
          </Text>
        </Box>

        <HStack gap={4} mt={3}>
          <LegendDot color="partyDem">Democrats</LegendDot>
          <LegendDot color="partyRep">Republicans</LegendDot>
        </HStack>
      </MockCard>

      <MockCard mt={4}>
        <Grid templateColumns={{ base: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }} gap={{ base: 3, sm: 6 }}>
          <RankingList title="Most liberal" rows={LEFT_RIGHT_ENDS.liberal} />
          <RankingList title="Most conservative" rows={LEFT_RIGHT_ENDS.conservative} />
        </Grid>
      </MockCard>
    </Box>
  );
}
