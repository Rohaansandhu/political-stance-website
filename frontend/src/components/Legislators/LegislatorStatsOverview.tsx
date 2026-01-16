import { SimpleGrid, Box, Text, Heading, VStack } from "@chakra-ui/react";

interface CategoryInfo {
  score: number;
  rank: number;
  percentile_rank: number;
  bill_count: number;
  current_rank: number;
  current_percentile_rank: number;
}

interface DataInfo {
  member_id: string;
  state: string;
  district?: number;
  vote_count: number;
  primary_categories: Record<string, CategoryInfo>;
}

export default function LegislatorStatsOverview({ data }: { data: DataInfo }) {
  const totalBills = Object.values(data.primary_categories || {}).reduce(
    (sum, cat) => sum + cat.bill_count,
    0
  );

  // Calculate average percentile only from categories with current data
  const categoriesWithData = Object.values(
    data.primary_categories || {}
  ).filter((cat) => cat.current_rank !== -1 && cat.bill_count > 10);

  const totalWeightedBills = categoriesWithData.reduce(
    (sum, cat) => sum + cat.bill_count,
    0
  );

  const avgPercentile =
    totalWeightedBills > 0
      ? categoriesWithData.reduce(
          (sum, cat) => sum + cat.current_percentile_rank * cat.bill_count,
          0
        ) / totalWeightedBills
      : 0;

  const getOverallIdeology = (percentile: number) => {
    if (percentile < 0.4)
      return {
        label: "Liberal",
        lightBg: "#3b82f6",
        darkBg: "#2563eb",
      };
    if (percentile > 0.6)
      return {
        label: "Conservative",
        lightBg: "#ef4444",
        darkBg: "#dc2626",
      };
    return {
      label: "Moderate",
      lightBg: "#8b5cf6",
      darkBg: "#7c3aed",
    };
  };

  const ideology = getOverallIdeology(avgPercentile);

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={6} w="100%">
      {/* Total Votes */}
      <Box bg="primary" p={8} rounded="xl" boxShadow="md">
        <VStack align="flex-start" gap={2}>
          <Text color="white" fontSize="sm" fontWeight="600">
            Total Votes
          </Text>
          <Heading size="2xl" color="white">
            {data.vote_count?.toLocaleString() || 0}
          </Heading>
          <Text color="white" opacity={0.9} fontSize="xs">
            Legislative participation
          </Text>
        </VStack>
      </Box>

      {/* Total Bills */}
      <Box bg="accent" p={8} rounded="xl" boxShadow="md">
        <VStack align="flex-start" gap={2}>
          <Text color="white" fontSize="sm" fontWeight="600">
            Bills Analyzed
          </Text>
          <Heading size="2xl" color="white">
            {totalBills}
          </Heading>
          <Text color="white" opacity={0.9} fontSize="xs">
            Across all categories
          </Text>
        </VStack>
      </Box>

      {/* Chamber */}
      <Box bg="accent" p={8} rounded="xl" boxShadow="md">
        <VStack align="flex-start" gap={2}>
          <Text color="white" fontSize="sm" fontWeight="600">
            Chamber
          </Text>
          <Heading size="2xl" color="white">
            {data.member_id?.startsWith("S") ? "Senate" : "House"}
          </Heading>
          <Text color="white" opacity={0.9} fontSize="xs">
            {data.state}
            {data.district ? `-${data.district}` : ""}
          </Text>
        </VStack>
      </Box>

      {/* Overall Ideology */}
      <Box
        bg={ideology.lightBg}
        _dark={{ bg: ideology.darkBg }}
        p={8}
        rounded="xl"
        boxShadow="md"
      >
        <VStack align="flex-start" gap={2}>
          <Text color="white" fontSize="sm" fontWeight="600">
            Overall Ideology
          </Text>
          <Heading size="2xl" color="white">
            {ideology.label}
          </Heading>
          <Text color="white" opacity={0.9} fontSize="xs">
            Avg position: {(avgPercentile * 100).toFixed(0)}%
          </Text>
        </VStack>
      </Box>
    </SimpleGrid>
  );
}
