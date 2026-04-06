import { Box, Text, VStack } from "@chakra-ui/react";

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

function StatItem({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}) {
  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="600"
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="0.05em"
        mb="1px"
      >
        {label}
      </Text>
      <Text
        fontSize="lg"
        fontWeight="700"
        color={valueColor ?? "text"}
        lineHeight="1.2"
      >
        {value}
      </Text>
      {sub && (
        <Text fontSize="xs" color="gray.400">
          {sub}
        </Text>
      )}
    </Box>
  );
}

export default function LegislatorStatsOverview({ data }: { data: DataInfo }) {
  const totalBills = Object.values(data.primary_categories || {}).reduce(
    (sum, cat) => sum + cat.bill_count,
    0,
  );

  const categoriesWithData = Object.values(
    data.primary_categories || {},
  ).filter((cat) => cat.current_rank !== -1 && cat.bill_count > 10);

  const totalWeightedBills = categoriesWithData.reduce(
    (sum, cat) => sum + cat.bill_count,
    0,
  );

  const avgPercentile =
    totalWeightedBills > 0
      ? categoriesWithData.reduce(
          (sum, cat) => sum + cat.current_percentile_rank * cat.bill_count,
          0,
        ) / totalWeightedBills
      : 0;

  const getOverallIdeology = (percentile: number) => {
    if (percentile < 0.4) return { label: "Liberal", color: "blue.600" };
    if (percentile > 0.6) return { label: "Conservative", color: "red.600" };
    return { label: "Moderate", color: "purple.600" };
  };

  const ideology = getOverallIdeology(avgPercentile);
  const chamber = data.member_id?.startsWith("S") ? "Senate" : "House";

  return (
    <VStack align="stretch" gap={3} bg="bg" p={3} rounded="lg">
      <StatItem
        label="Total Votes"
        value={data.vote_count?.toLocaleString() || "0"}
        sub="Legislative participation"
      />
      <StatItem
        label="Bills Analyzed"
        value={totalBills.toLocaleString()}
        sub="Across all categories"
      />
      <StatItem
        label="Chamber"
        value={chamber}
        sub={data.state + (data.district ? `-${data.district}` : "")}
      />
      <StatItem
        label="Overall Ideology"
        value={ideology.label}
        sub={`Avg position: ${(avgPercentile * 100).toFixed(0)}%`}
        valueColor={ideology.color}
      />
    </VStack>
  );
}
