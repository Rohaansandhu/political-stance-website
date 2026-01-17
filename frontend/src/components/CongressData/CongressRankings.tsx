import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Center,
  Badge,
  Select,
  createListCollection,
  Grid,
  GridItem
} from '@chakra-ui/react';

interface CongressRankingsProps {
  specHash: string;
  field: 'primary_categories' | 'main_categories' | 'detailed_spectrums';
  subject: string;
}

interface RankingData {
  member_id: string;
  name: string;
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

export default function CongressRankings({ specHash, field, subject }: CongressRankingsProps) {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchRankings();
  }, [specHash, field, subject]);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/legislators/profiles/${specHash}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      
      const profiles = await response.json();
      
      // Extract rankings for the selected field and subject
      const extractedRankings: RankingData[] = profiles
        .map((profile: any) => {
          const categoryData = profile[field]?.[subject];
          if (!categoryData) return null;
          
          return {
            member_id: profile.member_id,
            name: profile.name,
            party: profile.party,
            score: categoryData.score,
            rank: categoryData.rank,
            percentile_rank: categoryData.percentile_rank,
            bill_count: categoryData.bill_count,
            total_members: categoryData.total_members,
            total_current_members: categoryData.total_current_members,
            current_rank: categoryData.current_rank,
            current_percentile_rank: categoryData.current_percentile_rank
          };
        })
        .filter((r: RankingData | null) => {
          // Filter out non-current legislators
          if (r === null) return false;
          if (r.current_rank === undefined || r.current_rank === null) return false;
          if (r.current_rank === -1) return false;
          return true;
        })
        .sort((a: RankingData, b: RankingData) => a.current_rank! - b.current_rank!);
      
      setRankings(extractedRankings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'D': return 'blue';
      case 'R': return 'red';
      case 'I': return 'yellow';
      default: return 'gray';
    }
  };

  const getPartyName = (party: string) => {
    switch (party) {
      case 'D': return 'Democrat';
      case 'R': return 'Republican';
      case 'I': return 'Independent';
      default: return 'Unknown';
    }
  };

  const getScoreBarWidth = (score: number) => {
    // Convert score from -1 to 1 range to 0-100 percentage
    return ((score + 1) / 2) * 100;
  };

  const getScoreColor = (score: number) => {
    if (score < -0.1) return 'blue.500';
    if (score > 0.1) return 'red.500';
    return 'purple.500';
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
        <Text color="red.500" fontSize="lg">
          Error: {error}
        </Text>
      </Center>
    );
  }

  if (rankings.length === 0) {
    return (
      <Center py={20}>
        <Text color="text" fontSize="lg">
          No rankings available for {subject}
        </Text>
      </Center>
    );
  }

  const displayedRankings = sortDirection === 'asc' 
    ? rankings 
    : [...rankings].reverse();

  return (
    <Box w="100%" bg="bgLightShade" p={8} rounded="xl" mt={8}>
      <VStack align="stretch" gap={6}>
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="flex-start" gap={1}>
            <Heading size="xl" color="primary">
              Rankings: {subject}
            </Heading>
            <Text color="text" fontSize="sm">
              {rankings.length} legislators ranked
            </Text>
          </VStack>
          
          <Select.Root
            collection={createListCollection({
              items: [
                { label: 'Conservative → Liberal', value: 'asc' },
                { label: 'Liberal → Conservative', value: 'desc' }
              ]
            })}
            value={[sortDirection]}
            onValueChange={(details) => setSortDirection(details.value[0] as 'asc' | 'desc')}
            maxW="250px"
          >
            <Select.Label>Sort Order</Select.Label>
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
            <Select.Content>
              <Select.Item item="asc">
                <Select.ItemText>Conservative → Liberal</Select.ItemText>
              </Select.Item>
              <Select.Item item="desc">
                <Select.ItemText>Liberal → Conservative</Select.ItemText>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </HStack>

        {/* Rankings List */}
        <VStack align="stretch" gap={2}>
          {displayedRankings.map((ranking) => (
            <Box
              key={ranking.member_id}
              bg="bg"
              p={4}
              rounded="lg"
              borderLeft="4px solid"
              borderColor={`${getPartyColor(ranking.party)}.500`}
              _hover={{ bg: 'bgLightShade', transform: 'translateX(4px)' }}
              transition="all 0.2s"
            >
              <Grid templateColumns="60px 1fr 120px 100px" gap={4} alignItems="center">
                {/* Rank */}
                <GridItem>
                  <Text fontSize="2xl" fontWeight="bold" color="primary">
                    #{ranking.current_rank}
                  </Text>
                </GridItem>

                {/* Name and Score Bar */}
                <GridItem>
                  <VStack align="stretch" gap={2}>
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="semibold" color="text">
                        {ranking.name}
                      </Text>
                      <Badge colorScheme={getPartyColor(ranking.party)}>
                        {getPartyName(ranking.party)}
                      </Badge>
                    </HStack>
                    
                    {/* Score Bar */}
                    <Box position="relative" h="8px" bg="gray.200" rounded="full">
                      {/* Center line */}
                      <Box
                        position="absolute"
                        left="50%"
                        top="0"
                        bottom="0"
                        w="2px"
                        bg="gray.400"
                        transform="translateX(-50%)"
                      />
                      {/* Score indicator */}
                      <Box
                        position="absolute"
                        left={`${getScoreBarWidth(ranking.score)}%`}
                        top="50%"
                        transform="translate(-50%, -50%)"
                        w="16px"
                        h="16px"
                        bg={getScoreColor(ranking.score)}
                        rounded="full"
                        border="2px solid white"
                      />
                    </Box>
                  </VStack>
                </GridItem>

                {/* Score */}
                <GridItem textAlign="center">
                  <VStack gap={0}>
                    <Text fontSize="xl" fontWeight="bold" color={getScoreColor(ranking.score)}>
                      {ranking.score.toFixed(3)}
                    </Text>
                    <Text fontSize="xs" color="text">
                      {ranking.current_percentile_rank 
                        ? `${(ranking.current_percentile_rank * 100).toFixed(1)}th percentile` 
                        : ''}
                    </Text>
                  </VStack>
                </GridItem>

                {/* Bill Count */}
                <GridItem textAlign="center">
                  <VStack gap={0}>
                    <Text fontSize="lg" fontWeight="semibold" color="text">
                      {ranking.bill_count}
                    </Text>
                    <Text fontSize="xs" color="text">
                      bills
                    </Text>
                  </VStack>
                </GridItem>
              </Grid>
            </Box>
          ))}
        </VStack>

        {/* Legend */}
        <HStack gap={6} fontSize="sm" color="text" justify="center" pt={4} borderTop="1px solid" borderColor="gray.200">
          <Text>Score Range: -1.0 (Liberal) to 1.0 (Conservative)</Text>
          <Text>•</Text>
          <Text>Rankings based on voting record analysis</Text>
        </HStack>
      </VStack>
    </Box>
  );
}