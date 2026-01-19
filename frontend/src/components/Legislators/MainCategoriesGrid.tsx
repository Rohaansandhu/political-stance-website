import { useState } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";

interface CategoryInfo {
  score: number;
  rank: number;
  percentile_rank: number;
  bill_count: number;
  current_rank: number;
  current_percentile_rank: number;
  total_members?: number;
  total_current_members?: number;
}

interface Categories {
  [key: string]: CategoryInfo;
}

function CategoryCard({
  category,
  info,
}: {
  category: string;
  info: CategoryInfo;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSufficientData = info.bill_count > 10 && info.rank !== -1;
  const hasCurrentData = info.current_rank !== -1 && hasSufficientData;

  const getIdeologyInfo = (percentile: number) => {
    if (percentile < 0.4) {
      return {
        label: "Liberal",
        color: "#3b82f6",
        description: "Left-leaning position",
      };
    }
    if (percentile > 0.6) {
      return {
        label: "Conservative",
        color: "#ef4444",
        description: "Right-leaning position",
      };
    }
    return {
      label: "Moderate",
      color: "#8b5cf6",
      description: "Centrist position",
    };
  };

  // Check if there's no voting data
  const hasData = info.rank !== -1;
  const insufficientIdeology = {
    label: "Insufficient Data",
    color: "#6b7280", // gray-500
    description: "Not enough votes",
  };

  const ideology = hasSufficientData
    ? getIdeologyInfo(info.percentile_rank)
    : insufficientIdeology;

  const currentIdeology = hasCurrentData
    ? getIdeologyInfo(info.current_percentile_rank)
    : ideology;

  return (
    <Box
      onClick={() => setExpanded(!expanded)}
      bg="bgLightShade"
      p={6}
      rounded="xl"
      border="2px solid"
      borderColor={hasData ? `${currentIdeology.color}20` : "gray.200"}
      borderLeftWidth="6px"
      borderLeftColor={hasData ? currentIdeology.color : "gray.400"}
      cursor="pointer"
      transition="all 0.3s"
      boxShadow={expanded ? "lg" : "sm"}
      transform={expanded ? "scale(1.02)" : "scale(1)"}
      _hover={{ boxShadow: "md" }}
    >
      <VStack gap={4} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <Heading size="md" color="text">
            {category}
          </Heading>
          {hasData ? (
            <Box
              bg={currentIdeology.color}
              color="white"
              px={3}
              py={1}
              rounded="md"
              fontSize="sm"
              fontWeight="600"
            >
              {currentIdeology.label}
            </Box>
          ) : (
            <Box
              bg="gray.400"
              color="white"
              px={3}
              py={1}
              rounded="md"
              fontSize="sm"
              fontWeight="600"
            >
              No Data
            </Box>
          )}
        </HStack>

        {!hasData ? (
          /* No Data Message */
          <Box
            p={8}
            bg="gray.50"
            _dark={{ bg: "gray.800" }}
            rounded="lg"
            textAlign="center"
          >
            <Text fontSize="lg" fontWeight="600" color="gray.500" mb={2}>
              Not Enough Voting Data
            </Text>
            <Text fontSize="sm" color="gray.400">
              This legislator hasn't voted on enough bills in this category to
              generate a position.
            </Text>
            <Text fontSize="sm" color="gray.500" mt={4}>
              Bills analyzed: {info.bill_count}
            </Text>
          </Box>
        ) : !hasCurrentData ? (
          /* No Current Data Message */
          <Box
            p={8}
            bg="gray.50"
            _dark={{ bg: "gray.800" }}
            rounded="lg"
            textAlign="center"
          >
            <Text fontSize="lg" fontWeight="600" color="gray.500" mb={2}>
              No Position Data
            </Text>
            <Text fontSize="sm" color="gray.400">
              Not Enough Bills to Generate Current Position.
            </Text>
            <Text fontSize="sm" color="gray.500" mt={4}>
              Bills analyzed: {info.bill_count}
            </Text>
          </Box>
        ) : (
          <>
            {/* Key Metrics */}
            <HStack gap={8} flexWrap="wrap">
              <VStack gap={1} align="flex-start">
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  BILLS
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="text">
                  {info.bill_count}
                </Text>
              </VStack>
              <VStack gap={1} align="flex-start">
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  RANK
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="text">
                  #{info.current_rank === -1 ? info.rank : info.current_rank}
                </Text>
              </VStack>
              <VStack gap={1} align="flex-start">
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  IDEOLOGY SCORE
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={
                    info.score > 0.2
                      ? "#ef4444"
                      : info.score < -0.2
                      ? "#3b82f6"
                      : "#8b5cf6"
                  }
                >
                  {info.score.toFixed(2)}
                </Text>
              </VStack>
              <VStack gap={1} align="flex-start">
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  PERCENTILE
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={
                    info.current_percentile_rank > 0.6
                      ? "#ef4444"
                      : info.current_percentile_rank < 0.4
                      ? "#3b82f6"
                      : "#8b5cf6"
                  }
                >
                  {(info.current_percentile_rank * 100).toFixed(1)}%
                </Text>
              </VStack>
            </HStack>

            {/* Ideology Score Spectrum */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600" fontWeight="600">
                  Ideology Score
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={
                    info.score < -0.2
                      ? "#3b82f6"
                      : info.score > 0.2
                      ? "#ef4444"
                      : "#8b5cf6"
                  }
                >
                  {info.score.toFixed(2)}
                </Text>
              </HStack>

              {/* Spectrum bar for Ideology score (-1 to 1) */}
              <Box
                position="relative"
                h="12px"
                bg="gray.200"
                rounded="full"
                mb={2}
              >
                <Box
                  position="absolute"
                  left={`${((info.score + 1) / 2) * 100}%`}
                  top="50%"
                  transform="translate(-50%, -50%)"
                  w="16px"
                  h="16px"
                  bg={
                    info.score < -0.2
                      ? "#3b82f6"
                      : info.score > 0.2
                      ? "#ef4444"
                      : "#8b5cf6"
                  }
                  rounded="full"
                  border="3px solid white"
                  boxShadow="md"
                />
              </Box>

              <HStack justify="space-between">
                <Text fontSize="xs" fontWeight="600" color="blue.500">
                  Liberal (-1)
                </Text>
                <Text fontSize="xs" fontWeight="600" color="red.500">
                  Conservative (+1)
                </Text>
              </HStack>
            </Box>

            {/* Ideological Position */}
            <Box
              borderColor={
                hasSufficientData ? `${currentIdeology.color}20` : "gray.300"
              }
              borderLeftColor={
                hasSufficientData ? currentIdeology.color : "gray.400"
              }
              bg={hasSufficientData ? "bgLightShade" : "gray.50"}
              onClick={() => hasSufficientData && setExpanded(!expanded)}
              cursor={hasSufficientData ? "pointer" : "default"}
            >
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600" fontWeight="600">
                  Ideological Position
                </Text>
                {hasSufficientData && hasCurrentData && (
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={currentIdeology.color}
                  >
                    {(info.current_percentile_rank * 100).toFixed(1)}%
                  </Text>
                )}
              </HStack>

              {hasSufficientData && hasCurrentData ? (
                <>
                  {/* Spectrum bar */}
                  <Box
                    position="relative"
                    h="12px"
                    bg="gray.200"
                    rounded="full"
                    mb={2}
                  >
                    <Box
                      position="absolute"
                      left={`${info.current_percentile_rank * 100}%`}
                      top="50%"
                      transform="translate(-50%, -50%)"
                      w="16px"
                      h="16px"
                      bg={currentIdeology.color}
                      rounded="full"
                      border="3px solid white"
                      boxShadow="md"
                    />
                  </Box>

                  <HStack justify="space-between">
                    <Text fontSize="xs" fontWeight="600" color="blue.500">
                      Liberal
                    </Text>
                    <Text fontSize="xs" fontWeight="600" color="red.500">
                      Conservative
                    </Text>
                  </HStack>
                </>
              ) : (
                <Box p={4} bg="gray.100" rounded="lg" textAlign="center">
                  <Text fontSize="sm" fontWeight="600" color="gray.500">
                    Not Enough Voting Data
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Minimum 10 bills required
                  </Text>
                </Box>
              )}
            </Box>

            {/* Expanded Details */}
            {expanded && (
              <Box mt={4} pt={4} borderTop="1px solid" borderColor="gray.200">
                <SimpleGrid columns={2} gap={4}>
                  <Box
                    p={4}
                    bg="gray.50"
                    _dark={{ bg: "gray.800" }}
                    rounded="lg"
                  >
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      mb={2}
                      fontWeight="600"
                    >
                      Historical Position
                    </Text>
                    <Text
                      fontSize="lg"
                      fontWeight="700"
                      color={ideology.color}
                      mb={1}
                    >
                      {ideology.label}
                    </Text>
                    <Text fontSize="sm" color="text" mb={1}>
                      Rank: #{info.rank} of {info.total_members}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {(info.percentile_rank * 100).toFixed(1)}th percentile
                    </Text>
                  </Box>

                  <Box
                    p={4}
                    bg="gray.50"
                    _dark={{ bg: "gray.800" }}
                    rounded="lg"
                  >
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      mb={2}
                      fontWeight="600"
                    >
                      Current Position
                    </Text>
                    {hasCurrentData ? (
                      <>
                        <Text
                          fontSize="lg"
                          fontWeight="700"
                          color={currentIdeology.color}
                          mb={1}
                        >
                          {currentIdeology.label}
                        </Text>
                        <Text fontSize="sm" color="text" mb={1}>
                          Rank: #{info.current_rank} of{" "}
                          {info.total_current_members}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {(info.current_percentile_rank * 100).toFixed(1)}th
                          percentile
                        </Text>
                      </>
                    ) : (
                      <Text fontSize="sm" color="gray.400" fontStyle="italic">
                        No current data available
                      </Text>
                    )}
                  </Box>
                </SimpleGrid>

                {/* Description */}
                <Box
                  mt={4}
                  p={3}
                  bg={`${currentIdeology.color}10`}
                  rounded="lg"
                  borderLeft="3px solid"
                  borderLeftColor={currentIdeology.color}
                >
                  <Text fontSize="sm" color="text">
                    <strong>Position:</strong> This legislator takes a{" "}
                    <strong>{currentIdeology.label.toLowerCase()}</strong>{" "}
                    stance on {category.toLowerCase()} issues, ranking more{" "}
                    {info.current_percentile_rank < 0.5
                      ? "liberal"
                      : "conservative"}{" "}
                    than{" "}
                    {Math.abs(info.current_percentile_rank - 0.5) < 0.15
                      ? "about half"
                      : info.current_percentile_rank < 0.5
                      ? `${(info.current_percentile_rank * 100).toFixed(0)}%`
                      : `${((1 - info.current_percentile_rank) * 100).toFixed(
                          0
                        )}%`}{" "}
                    of their peers.
                  </Text>
                </Box>
              </Box>
            )}
          </>
        )}

        {/* Click hint */}
        {hasData && hasCurrentData && (
          <Text fontSize="xs" color="gray.400" textAlign="center" mt={2}>
            {expanded ? "▲ Click to collapse" : "▼ Click for details"}
          </Text>
        )}
      </VStack>
    </Box>
  );
}

export default function MainCategoryGrid({
  categories,
}: {
  categories: Categories;
}) {
  const [sortBy, setSortBy] = useState("bills");

  const sortedCategories = Object.entries(categories).sort((a, b) => {
    const aInsufficient = a[1].bill_count <= 10 || a[1].rank === -1;
    const bInsufficient = b[1].bill_count <= 10 || b[1].rank === -1;

    // Always push insufficient data to bottom
    if (aInsufficient && !bInsufficient) return 1;
    if (!aInsufficient && bInsufficient) return -1;

    // If both insufficient, keep stable order
    if (aInsufficient && bInsufficient) return 0;

    // Normal sorting
    if (sortBy === "ideology") {
      return (
        Math.abs(b[1].percentile_rank - 0.5) -
        Math.abs(a[1].percentile_rank - 0.5)
      );
    }
    if (sortBy === "bills") return b[1].bill_count - a[1].bill_count;
    if (sortBy === "score") return b[1].score - a[1].score;

    return 0;
  });

  return (
    <Box w="100%">
      {/* Header with sorting */}
      <HStack justify="space-between" mb={6} flexWrap="wrap">
        <Heading size="lg" color="text">
          Policy Categories
        </Heading>
        <HStack gap={2}>
          <Text fontSize="sm" color="gray.500">
            Sort by:
          </Text>
          {[
            { key: "ideology", label: "Ideology" },
            { key: "bills", label: "Bills" },
            { key: "score", label: "Score" },
          ].map((option) => (
            <Box
              key={option.key}
              onClick={() => setSortBy(option.key)}
              px={4}
              py={2}
              rounded="lg"
              bg={sortBy === option.key ? "blue.500" : "gray.100"}
              color={sortBy === option.key ? "white" : "gray.700"}
              cursor="pointer"
              fontSize="sm"
              fontWeight="600"
              transition="all 0.2s"
              _hover={{ bg: sortBy === option.key ? "blue.600" : "gray.200" }}
            >
              {option.label}
            </Box>
          ))}
        </HStack>
      </HStack>

      {/* Categories Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {sortedCategories.map(([category, info]) => (
          <CategoryCard key={category} category={category} info={info} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
