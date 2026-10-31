import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import { MockCard, MockChip, ScoreTrack } from "./landingParts";
import { scoreColor, signedScore } from "./showcaseUtils";

const CATEGORIES = [
  { name: "Budget & Appropriations", partisan: 0.8, impact: 1 },
  { name: "Environment & Energy", partisan: 0.9, impact: 0.9 },
  { name: "Healthcare", partisan: 0.7, impact: 0.9 },
  { name: "Agriculture & Rural Issues", partisan: 0.3, impact: 0.7 },
];

// Mean partisan score across each model's primary categories for HR1-119.
const MODEL_AVERAGES = [
  { model: "GPT-5 Mini", score: 0.87 },
  { model: "Qwen 3 32B", score: 0.8 },
  { model: "GPT-6 Luna", score: 0.7 },
  { model: "GPT-OSS 120B", score: 0.68 },
  { model: "Llama 3.3 70B", score: 0.43 },
  { model: "Gemini 2.5 Flash Lite", score: 0.29 },
];

const AYES = 218;
const NOES = 214;

export function BillAnalysisMock() {
  return (
    <Box>
      <MockCard>
        <HStack justify="space-between" align="flex-start" gap={3} wrap="wrap">
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="primary" lineHeight="1.2">
              HR1-119
            </Text>
            <Text fontSize="md" color="text" mt={1}>
              One Big Beautiful Bill Act
            </Text>
          </Box>
          <HStack gap={1.5}>
            <MockChip>House</MockChip>
            <MockChip>GPT-6 Luna</MockChip>
          </HStack>
        </HStack>

        <Box mt={4}>
          <HStack justify="space-between" mb={1.5}>
            <Text fontSize="xs" color="textMuted" fontVariantNumeric="tabular-nums">
              Aye {AYES}
            </Text>
            <Text fontSize="xs" color="textMuted">
              Final House vote
            </Text>
            <Text fontSize="xs" color="textMuted" fontVariantNumeric="tabular-nums">
              No {NOES}
            </Text>
          </HStack>
          <HStack gap="2px" h="6px">
            <Box h="full" flex={AYES} bg="voteYea" roundedLeft="full" />
            <Box h="full" flex={NOES} bg="voteNay" roundedRight="full" />
          </HStack>
        </Box>

        <Grid
          templateColumns={{ base: "minmax(0, 1fr) 72px 56px", md: "minmax(0, 1.3fr) minmax(0, 1fr) 72px 56px" }}
          columnGap={3}
          mt={5}
          pb={1.5}
          borderBottomWidth="1px"
          borderColor="border"
        >
          <Text fontSize="xs" fontWeight="semibold" color="textMuted">
            Category
          </Text>
          <Box display={{ base: "none", md: "block" }} />
          <Text fontSize="xs" fontWeight="semibold" color="textMuted" textAlign="right">
            Partisan
          </Text>
          <Text fontSize="xs" fontWeight="semibold" color="textMuted" textAlign="right">
            Impact
          </Text>
        </Grid>
        {CATEGORIES.map((category) => (
          <Grid
            key={category.name}
            templateColumns={{ base: "minmax(0, 1fr) 72px 56px", md: "minmax(0, 1.3fr) minmax(0, 1fr) 72px 56px" }}
            columnGap={3}
            alignItems="center"
            py={2}
            borderBottomWidth="1px"
            borderColor="borderSubtle"
            _last={{ borderBottomWidth: 0, pb: 0 }}
          >
            <Text fontSize="sm" color="text" lineHeight="1.3">
              {category.name}
            </Text>
            <Box display={{ base: "none", md: "block" }}>
              <ScoreTrack markers={[{ key: "score", score: category.partisan, color: scoreColor(category.partisan) }]} />
            </Box>
            <Text fontSize="xs" color="text" fontVariantNumeric="tabular-nums" textAlign="right">
              {signedScore(category.partisan)}
            </Text>
            <Text fontSize="xs" color="textMuted" fontVariantNumeric="tabular-nums" textAlign="right">
              {category.impact.toFixed(2)}
            </Text>
          </Grid>
        ))}
      </MockCard>

      <MockCard mt={4}>
        <Text fontSize="xs" fontWeight="semibold" color="textMuted" mb={2}>
          Same bill, six models: average partisan score
        </Text>
        <Grid templateColumns={{ base: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }} columnGap={6}>
          {MODEL_AVERAGES.map((row) => (
            <HStack key={row.model} justify="space-between" gap={2} py={1.5} borderTopWidth="1px" borderColor="borderSubtle">
              <Text fontSize="xs" color="text" truncate>
                {row.model}
              </Text>
              <Text fontSize="xs" color="textMuted" fontVariantNumeric="tabular-nums">
                {signedScore(row.score)}
              </Text>
            </HStack>
          ))}
        </Grid>
      </MockCard>
    </Box>
  );
}
