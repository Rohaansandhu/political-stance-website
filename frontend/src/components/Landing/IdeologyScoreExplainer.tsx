import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import { MethodPanel } from "./MethodPanel";
import { LegendDot, MockCard, ScoreTrack } from "./landingParts";
import { signedScore } from "./showcaseUtils";

const steps = [
  {
    title: "Recorded votes only",
    description: "Scores come from roll-call votes. A vote a legislator missed doesn't count for or against them.",
  },
  {
    title: "Weighted by the bill",
    description: "Vote direction × partisan score × impact score, so a major partisan bill counts for more than a minor one.",
  },
  {
    title: "Issue by issue",
    description: "Those weighted votes are averaged into separate scores for each policy category.",
  },
];

// Real recorded votes and gpt-6-luna scores for hr1-119, Budget & Appropriations.
const PARTISAN = 0.8;
const IMPACT = 1;
const exampleVotes = [
  { name: "Mike Johnson", vote: "Yea", direction: 1, color: "partyRep" },
  { name: "Hakeem Jeffries", vote: "Nay", direction: -1, color: "partyDem" },
];

export function IdeologyScoreExplainer() {
  return (
    <MethodPanel
      bg="bgAltGreen"
      eyebrow="Ideology score"
      title="How We Score Each Legislator"
      description="An ideology score shows where a legislator falls from -1 (liberal) to +1 (conservative) on a specific issue, based on the direction, importance, and partisan nature of the bills they voted on."
      steps={steps}
    >
      <MockCard>
        <Text fontSize="xs" fontWeight="semibold" color="textMuted">
          One bill, two votes
        </Text>
        <Text fontSize="sm" fontWeight="semibold" color="text" mt={0.5} pb={2} borderBottomWidth="1px" borderColor="border">
          HR1-119 · Budget & Appropriations
        </Text>
        {exampleVotes.map((row) => (
          <Grid
            key={row.name}
            templateColumns="minmax(0, 1fr) auto"
            columnGap={3}
            alignItems="center"
            py={2}
            borderBottomWidth="1px"
            borderColor="borderSubtle"
          >
            <Box minW={0}>
              <Text fontSize="sm" color="text" truncate>
                {row.name}
              </Text>
              <Text fontSize="xs" color="textMuted" fontVariantNumeric="tabular-nums">
                {row.vote} ({signedScore(row.direction, 0)}) × {signedScore(PARTISAN)} × {IMPACT.toFixed(2)}
              </Text>
            </Box>
            <Text fontSize="md" fontWeight="semibold" color={row.color} fontVariantNumeric="tabular-nums">
              {signedScore(row.direction * PARTISAN * IMPACT)}
            </Text>
          </Grid>
        ))}
        <Text fontSize="xs" fontWeight="semibold" color="textMuted" mt={3} mb={2}>
          Averaged across every Budget & Appropriations vote
        </Text>
        <ScoreTrack
          markers={[
            { key: "jeffries", score: -0.12, color: "partyDem" },
            { key: "johnson", score: 0.094, color: "partyRep" },
          ]}
        />
        <HStack justify="space-between" mt={2} gap={3}>
          <Text fontSize="xs" color="textMuted">
            -1 Liberal
          </Text>
          <Text fontSize="xs" color="textMuted">
            +1 Conservative
          </Text>
        </HStack>
        <HStack justify="center" gap={4} mt={1.5} wrap="wrap">
          <LegendDot color="partyDem">Jeffries {signedScore(-0.12)}</LegendDot>
          <LegendDot color="partyRep">Johnson {signedScore(0.094)}</LegendDot>
        </HStack>
      </MockCard>
    </MethodPanel>
  );
}
