import { Box, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface BillSummary {
  title: string;
  key_provisions: string[];
}

interface PrimaryCategory {
  name: string;
  partisan_score: number;
  impact_score: number;
  reasoning: string;
}

interface BillAnalysis {
  _id?: string;
  bill_id: string;
  model: string;
  bill_type: string;
  chamber: string;
  congress: number;
  bill_summary: BillSummary;
  political_categories?: {
    primary_categories?: PrimaryCategory[] | null;
  };
  avg_partisan_score?: number;
}

interface BillCardProps {
  bill: BillAnalysis;
  featured?: boolean;
}

export default function BillCard({ bill, featured = false }: BillCardProps) {
  const navigate = useNavigate();

  /**
   * Normalize primary categories to a guaranteed array
   * (prevents runtime crashes from malformed backend data)
   */
  const primaryCategories: PrimaryCategory[] = Array.isArray(
    bill.political_categories?.primary_categories
  )
    ? bill.political_categories!.primary_categories!
    : [];

  /**
   * Calculate average partisan score safely
   */
  const calculateAvgScore = () => {
    if (typeof bill.avg_partisan_score === 'number') {
      return bill.avg_partisan_score;
    }

    if (primaryCategories.length === 0) return 0;

    const scores = primaryCategories.map(c => c.partisan_score);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const avgScore = calculateAvgScore();

  const getIdeologyColor = (score: number) => {
    if (score < -0.3) return 'blue.500';
    if (score > 0.3) return 'red.500';
    return 'purple.500';
  };

  const getIdeologyLabel = (score: number) => {
    if (score < -0.3) return 'Liberal';
    if (score > 0.3) return 'Conservative';
    return 'Moderate';
  };

  const getChamberColor = (chamber: string) => {
    return chamber === 'house' ? 'blue' : 'green';
  };

  return (
    <Box
      bg="bgLightShade"
      p={6}
      rounded="lg"
      cursor="pointer"
      onClick={() => navigate(`/bill-analyses/${bill.bill_id}/${bill.model}`)}
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
        bg: 'bg',
      }}
      transition="all 0.2s"
      borderTop={featured ? '4px solid' : 'none'}
      borderColor={featured ? getIdeologyColor(avgScore) : 'transparent'}
      position="relative"
    >
      <VStack align="stretch" gap={3}>
        {/* Header */}
        <HStack justify="space-between" align="flex-start">
          <VStack align="flex-start" gap={1} flex={1}>
            <Text fontSize="xl" fontWeight="bold" color="primary" lineHeight="1.2">
              {bill.bill_id.toUpperCase()}
            </Text>
            <HStack gap={2}>
              {featured && (
                <Badge colorScheme="purple" fontSize="xs">
                  FEATURED
                </Badge>
              )}
              <Badge colorScheme={getChamberColor(bill.chamber)} fontSize="xs">
                {bill.chamber.toUpperCase()}
              </Badge>
            </HStack>
          </VStack>
        </HStack>

        {/* Title */}
        <Text
          fontSize={featured ? 'md' : 'sm'}
          color="text"
          lineHeight="1.4"
        >
          {bill.bill_summary.title}
        </Text>

        {/* Ideology Indicator */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="xs" color="text" fontWeight="medium">
              {getIdeologyLabel(avgScore)}
            </Text>
            <Text fontSize="xs" color="text">
              {avgScore.toFixed(2)}
            </Text>
          </HStack>

          <Box position="relative" h="6px" bg="gray.200" rounded="full">
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

            {/* Score dot */}
            <Box
              position="absolute"
              left={`${((avgScore + 1) / 2) * 100}%`}
              top="50%"
              transform="translate(-50%, -50%)"
              w="12px"
              h="12px"
              bg={getIdeologyColor(avgScore)}
              rounded="full"
              border="2px solid white"
              shadow="sm"
            />
          </Box>
        </Box>

        {/* Category Badges */}
        <HStack gap={2} flexWrap="wrap" minH="24px">
          {primaryCategories
            .slice(0, featured ? 2 : 3)
            .map(cat => (
              <Badge
                key={cat.name}
                size="sm"
                variant="subtle"
                fontSize="xs"
              >
                {cat.name}
              </Badge>
            ))}
        </HStack>

        {/* Footer */}
        <HStack
          justify="space-between"
          pt={2}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="xs" color="text">
            {bill.congress}th Congress
          </Text>
          <Text fontSize="xs" color="text" fontWeight="medium">
            {bill.model}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
