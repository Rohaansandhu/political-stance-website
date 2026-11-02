import { useState } from "react";
import { Box, Button, Flex, HStack, Text, VStack, Wrap } from "@chakra-ui/react";
import { modelLabel } from "../CongressData/modelLabels";
import { SIDE_COLOR } from "../Legislators/percentiles";
import {
  AXIS_RELEVANCE,
  axisLabel,
  leftRightDirection,
  pushedPole,
} from "./display";
import type { AxisScore, BriefCard, CastVote, RevealCard } from "./types";

function chipText(score: AxisScore, vote: CastVote): string {
  const voteName = vote === "yea" ? "Yea" : "Nay";
  const pole = pushedPole(score, vote);
  return pole
    ? `Your ${voteName} pushed ${axisLabel(score.axis)} → ${pole.label}.`
    : `Your ${voteName} didn't push ${axisLabel(score.axis)} either way.`;
}

export default function AnalysisSection({
  card,
  reveal,
  vote,
}: {
  card: BriefCard;
  reveal: RevealCard;
  vote: CastVote;
}) {
  const [openAxis, setOpenAxis] = useState<string | null>(null);

  const scores = reveal.axes
    .filter((a) => a.relevance >= AXIS_RELEVANCE)
    .sort((a, b) => b.relevance - a.relevance);
  const open = scores.find((a) => a.axis === openAxis);

  return (
    <VStack align="stretch" gap={5}>
      <VStack align="stretch" gap={2}>
        {card.primary_categories.map((category) => {
          const direction = leftRightDirection(reveal.left_right[category]);
          return (
            <Flex key={category} justify="space-between" gap={3} wrap="wrap">
              <Text fontSize="sm" color="text">
                {category}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="600"
                color={direction ? SIDE_COLOR[direction.side] : "textMuted"}
              >
                {direction ? `A Yea leans ${direction.label}` : "No left-right lean"}
              </Text>
            </Flex>
          );
        })}
      </VStack>

      {scores.length > 0 && (
        <Box>
          <Wrap gap={2}>
            {scores.map((score) => {
              const pole = pushedPole(score, vote);
              return (
                <Button
                  key={score.axis}
                  size="xs"
                  variant={openAxis === score.axis ? "subtle" : "outline"}
                  color={pole ? SIDE_COLOR[pole.side] : "textMuted"}
                  whiteSpace="normal"
                  textAlign="left"
                  height="auto"
                  py={1.5}
                  aria-expanded={openAxis === score.axis}
                  onClick={() =>
                    setOpenAxis(openAxis === score.axis ? null : score.axis)
                  }
                >
                  {chipText(score, vote)}
                </Button>
              );
            })}
          </Wrap>
          {open && (
            <Text
              fontSize="sm"
              color="text"
              mt={3}
              p={3}
              bg="bgLightShade"
              rounded="md"
            >
              {open.reasoning}
            </Text>
          )}
        </Box>
      )}

      <HStack>
        <Text fontSize="xs" color="textMuted">
          AI-generated analysis · {modelLabel(reveal.model)} · axis schema v
          {reveal.axis_schema_version}
        </Text>
      </HStack>
    </VStack>
  );
}
