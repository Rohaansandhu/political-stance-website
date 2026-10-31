import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import { MethodPanel } from "./MethodPanel";
import { MockCard, MockChip, ScoreTrack } from "./landingParts";
import { scoreColor, signedScore } from "./showcaseUtils";

const steps = [
  {
    title: "Official summaries go in",
    description:
      "Models read the Library of Congress summary and legislative subjects, which carry less noise than raw bill text.",
  },
  {
    title: "Categories come out",
    description: "Each bill is tagged with the political categories it touches.",
  },
  {
    title: "Each category gets two scores",
    description:
      "Partisan lean from -1 to +1 and impact from 0 to 1, with the model's written reasoning for both.",
  },
];

// Real gpt-6-luna output for hr5376-117.
const exampleCategories = [
  { name: "Environment & Energy", partisan: -0.8, impact: 1 },
  { name: "Economy & Finance", partisan: -0.7, impact: 0.9 },
  { name: "Healthcare", partisan: -0.85, impact: 0.85 },
];

export function BillAnalysisExplainer() {
  return (
    <MethodPanel
      bg="bgAltGray"
      eyebrow="AI-assisted analysis"
      title="How We Analyze Each Bill"
      description="Large language models identify the political categories in each bill, then estimate the partisan lean and impact of each one. Scores vary by model, so you can compare them."
      steps={steps}
    >
      <MockCard>
        <HStack gap={1.5} wrap="wrap" mb={3}>
          <MockChip>Summary</MockChip>
          <MockChip>Subjects</MockChip>
          <MockChip>Top subject area</MockChip>
          <Text fontSize="xs" color="textMuted">
            →
          </Text>
          <MockChip active>GPT-6 Luna</MockChip>
        </HStack>
        <Text fontSize="sm" fontWeight="semibold" color="text" pb={2} borderBottomWidth="1px" borderColor="border">
          Inflation Reduction Act of 2022
        </Text>
        {exampleCategories.map((category) => (
          <Grid
            key={category.name}
            templateColumns="minmax(0, 1fr) 48px 80px"
            columnGap={3}
            alignItems="center"
            py={2}
            borderBottomWidth="1px"
            borderColor="borderSubtle"
            _last={{ borderBottomWidth: 0, pb: 0 }}
          >
            <Box minW={0}>
              <Text fontSize="sm" color="text" lineHeight="1.3">
                {category.name}
              </Text>
              <Text fontSize="xs" color="textMuted">
                Impact {category.impact.toFixed(2)}
              </Text>
            </Box>
            <Text fontSize="xs" color="text" fontVariantNumeric="tabular-nums" textAlign="right">
              {signedScore(category.partisan)}
            </Text>
            <ScoreTrack markers={[{ key: "score", score: category.partisan, color: scoreColor(category.partisan) }]} />
          </Grid>
        ))}
      </MockCard>
    </MethodPanel>
  );
}
