import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Center,
  Badge,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import IdeologyViewsBar from "./IdeologyViewBar";

interface CongressRankingsProps {
  specHash: string;
  field: "primary_categories" | "main_categories" | "detailed_spectrums";
  subject: string;
}

interface RankingData {
  member_id: string;
  name: string;
  official_full_name: string;
  state: string;
  party: string;
  score: number;
  rank: number;
  percentile_rank: number;
  bill_count: number;
  total_members: number;
  total_current_members: number;
  current_rank?: number;
  current_percentile_rank?: number;
}

function RankingRow({ ranking, side }: { ranking: RankingData; side: "liberal" | "conservative" }) {
  const getPartyColor = (party: string) => {
    switch (party) {
      case "D": return "blue";
      case "R": return "red";
      case "I": return "yellow";
      default: return "gray";
    }
  };

  const scoreColor = side === "liberal" ? "blue.600" : "red.600";
  const borderColor = side === "liberal" ? "blue.400" : "red.400";

  return (
    <Link to={`/legislators/${ranking.member_id}`}>
      <Box
        bg="bg"
        px={3}
        py={2}
        rounded="md"
        borderLeft="3px solid"
        borderColor={borderColor}
        _hover={{ bg: "bgLightShade", transform: "translateX(2px)" }}
        transition="all 0.15s"
      >
        <HStack justify="space-between" align="center">
          <HStack gap={2} flex={1} minW={0}>
            <Text fontSize="sm" fontWeight="700" color="gray.400" w="40px" flexShrink={0}>
              #{ranking.current_rank}
            </Text>
            <VStack align="flex-start" gap={0} flex={1} minW={0}>
              <Text fontSize="sm" fontWeight="600" color="text" truncate>
                {ranking.official_full_name}
              </Text>
              <HStack gap={1}>
                <Text fontSize="xs" color="gray.500">{ranking.state}</Text>
                <Badge colorScheme={getPartyColor(ranking.party)} fontSize="2xs" px={1}>
                  {ranking.party}
                </Badge>
              </HStack>
            </VStack>
          </HStack>
          <Text fontSize="sm" fontWeight="700" color={scoreColor} flexShrink={0}>
            {ranking.score.toFixed(3)}
          </Text>
        </HStack>
      </Box>
    </Link>
  );
}

export default function CongressRankings({
  specHash,
  field,
  subject,
}: CongressRankingsProps) {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRankings();
  }, [specHash, field, subject]);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/legislators/profiles/${specHash}`,
      );

      if (!response.ok) throw new Error("Failed to fetch profiles");

      const profiles = await response.json();

      const extractedRankings: RankingData[] = profiles
        .map((profile: any) => {
          const categoryData = profile[field]?.[subject];
          if (!categoryData) return null;
          return {
            member_id: profile.member_id,
            name: profile.name,
            official_full_name: profile.official_full_name,
            state: profile.state,
            party: profile.party,
            score: categoryData.score,
            rank: categoryData.rank,
            percentile_rank: categoryData.percentile_rank,
            bill_count: categoryData.bill_count,
            total_members: categoryData.total_members,
            total_current_members: categoryData.total_current_members,
            current_rank: categoryData.current_rank,
            current_percentile_rank: categoryData.current_percentile_rank,
          };
        })
        .filter((r: RankingData | null) => {
          if (r === null) return false;
          if (r.current_rank === undefined || r.current_rank === null) return false;
          if (r.current_rank === -1) return false;
          return true;
        })
        .sort((a: RankingData, b: RankingData) => a.current_rank! - b.current_rank!);

      setRankings(extractedRankings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching rankings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="primary" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={20}>
        <Text color="red.500" fontSize="lg">Error: {error}</Text>
      </Center>
    );
  }

  if (rankings.length === 0) {
    return (
      <Center py={20}>
        <Text color="text" fontSize="lg">No rankings available for {subject}</Text>
      </Center>
    );
  }

  // Split into liberal (negative) and conservative (zero or positive)
  // Liberal column: most liberal first (most negative score first)
  // Conservative column: most conservative first (highest score first)
  const liberalRankings = rankings
    .filter((r) => r.score < 0)
    .sort((a, b) => a.score - b.score);

  const conservativeRankings = rankings
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score);

  return (
    <VStack align="stretch" gap={4}>
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="flex-start" gap={0}>
          <Heading size="xl" color="primary">{subject}</Heading>
          <Text color="text" fontSize="sm">{rankings.length} legislators ranked</Text>
        </VStack>
      </HStack>

      <IdeologyViewsBar subject={subject} />

      {/* Two-column rankings */}
      <Grid templateColumns="1fr 1fr" gap={4}>

        {/* Liberal column */}
        <GridItem>
          <VStack align="stretch" gap={2}>
            <HStack gap={2} pb={1} borderBottom="2px solid" borderColor="blue.200">
              <Box w="10px" h="10px" borderRadius="full" bg="blue.500" />
              <Text fontWeight="700" fontSize="sm" color="blue.700" textTransform="uppercase" letterSpacing="0.05em">
                Most Liberal
              </Text>
              <Text fontSize="xs" color="gray.400">({liberalRankings.length})</Text>
            </HStack>
            {liberalRankings.map((ranking) => (
              <RankingRow key={ranking.member_id} ranking={ranking} side="liberal" />
            ))}
          </VStack>
        </GridItem>

        {/* Conservative column */}
        <GridItem>
          <VStack align="stretch" gap={2}>
            <HStack gap={2} pb={1} borderBottom="2px solid" borderColor="red.200">
              <Box w="10px" h="10px" borderRadius="full" bg="red.500" />
              <Text fontWeight="700" fontSize="sm" color="red.700" textTransform="uppercase" letterSpacing="0.05em">
                Most Conservative
              </Text>
              <Text fontSize="xs" color="gray.400">({conservativeRankings.length})</Text>
            </HStack>
            {conservativeRankings.map((ranking) => (
              <RankingRow key={ranking.member_id} ranking={ranking} side="conservative" />
            ))}
          </VStack>
        </GridItem>

      </Grid>

      {/* Legend */}
      <HStack
        gap={6}
        fontSize="sm"
        color="text"
        justify="center"
        pt={3}
        borderTop="1px solid"
        borderColor="gray.200"
      >
        <Text>Score Range: -1.0 (Liberal) to 1.0 (Conservative)</Text>
        <Text>•</Text>
        <Text>Rankings based on voting record analysis</Text>
      </HStack>
    </VStack>
  );
}
