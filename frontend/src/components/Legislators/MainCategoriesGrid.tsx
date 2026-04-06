import { useState } from "react";
import { Box, Heading, Text, HStack, VStack } from "@chakra-ui/react";
import IdeologyViewsBar from "../CongressData/IdeologyViewBar";

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

function getIdeologyInfo(percentile: number) {
  if (percentile < 0.4) return { label: "Liberal", color: "#3b82f6" };
  if (percentile > 0.6) return { label: "Conservative", color: "#ef4444" };
  return { label: "Moderate", color: "#8b5cf6" };
}

function ScoreBar({
  value,
  min = -1,
  max = 1,
  color,
}: {
  value: number;
  min?: number;
  max?: number;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <Box position="relative" h="8px" bg="gray.200" rounded="full">
      <Box
        position="absolute"
        left={`${pct}%`}
        top="50%"
        transform="translate(-50%, -50%)"
        w="12px"
        h="12px"
        bg={color}
        rounded="full"
        border="2px solid white"
        boxShadow="sm"
      />
    </Box>
  );
}

function CategoryRow({
  category,
  info,
}: {
  category: string;
  info: CategoryInfo;
}) {
  const [expanded, setExpanded] = useState(false);

  const hasSufficientData = info.bill_count > 10 && info.rank !== -1;
  const hasCurrentData = info.current_rank !== -1 && hasSufficientData;

  const ideology = hasSufficientData
    ? getIdeologyInfo(info.current_percentile_rank)
    : { label: "No Data", color: "#9ca3af" };

  const scoreColor =
    info.score < -0.2 ? "#3b82f6" : info.score > 0.2 ? "#ef4444" : "#8b5cf6";

  return (
    <Box
      bg="bg"
      rounded="lg"
      border="1px solid"
      borderColor="gray.100"
      borderLeft="3px solid"
      borderLeftColor={ideology.color}
      overflow="hidden"
    >
      {/* Collapsed row — always visible */}
      <HStack
        px={3}
        py={2}
        cursor="pointer"
        onClick={() => setExpanded(!expanded)}
        _hover={{ bg: "bgLightShade" }}
        transition="background 0.15s"
        gap={3}
      >
        {/* Category name */}
        <Text
          fontSize="sm"
          fontWeight="600"
          color="text"
          flex={1}
          minW={0}
          truncate
        >
          {category}
        </Text>

        {/* Score */}
        <Text
          fontSize="sm"
          fontWeight="700"
          color={scoreColor}
          flexShrink={0}
          w="40px"
          textAlign="right"
        >
          {hasSufficientData ? info.score.toFixed(2) : "—"}
        </Text>

        {/* Percentile */}
        <Text
          fontSize="sm"
          color="gray.500"
          flexShrink={0}
          w="44px"
          textAlign="right"
        >
          {hasCurrentData
            ? `${(info.current_percentile_rank * 100).toFixed(0)}%`
            : "—"}
        </Text>

        {/* Ideology badge */}
        <Box
          px={2}
          py="2px"
          rounded="md"
          bg={ideology.color}
          color="white"
          fontSize="xs"
          fontWeight="600"
          flexShrink={0}
          w="110px"
          textAlign="center"
        >
          {ideology.label}
        </Box>

        {/* Expand toggle */}
        <Text fontSize="xs" color="gray.400" flexShrink={0}>
          {expanded ? "▲" : "▼"}
        </Text>
      </HStack>

      {/* Expanded content */}
      {expanded && (
        <Box px={4} pb={4} pt={2} borderTop="1px solid" borderColor="gray.100">
          {!hasSufficientData ? (
            <Box py={3} textAlign="center">
              <Text fontSize="sm" color="gray.500" fontWeight="600">
                Not Enough Voting Data
              </Text>
              <Text fontSize="xs" color="gray.400">
                Bills analyzed: {info.bill_count}
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" gap={3}>
              {/* Key metrics */}
              <HStack gap={6}>
                <VStack gap={0} align="flex-start">
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="600"
                    textTransform="uppercase"
                  >
                    Bills
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="text">
                    {info.bill_count}
                  </Text>
                </VStack>
                <VStack gap={0} align="flex-start">
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="600"
                    textTransform="uppercase"
                  >
                    Score
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color={scoreColor}>
                    {info.score.toFixed(3)}
                  </Text>
                </VStack>
                <VStack gap={0} align="flex-start">
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="600"
                    textTransform="uppercase"
                  >
                    Percentile
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color={ideology.color}>
                    {hasCurrentData
                      ? `${(info.current_percentile_rank * 100).toFixed(1)}%`
                      : "—"}
                  </Text>
                </VStack>
                {hasCurrentData && (
                  <VStack gap={0} align="flex-start">
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="600"
                      textTransform="uppercase"
                    >
                      Rank
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color="text">
                      #{info.current_rank}{" "}
                      <Text as="span" fontSize="xs" color="gray.400">
                        of {info.total_current_members}
                      </Text>
                    </Text>
                  </VStack>
                )}
              </HStack>

              {/* Ideology score bar */}
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs" color="gray.500" fontWeight="600">
                    Ideology Score
                  </Text>
                </HStack>
                <ScoreBar
                  value={info.score}
                  min={-1}
                  max={1}
                  color={scoreColor}
                />
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs" color="blue.500">
                    Liberal (−1)
                  </Text>
                  <Text fontSize="xs" color="red.500">
                    Conservative (+1)
                  </Text>
                </HStack>
              </Box>

              {/* Percentile bar */}
              {hasCurrentData && (
                <Box>
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="xs" color="gray.500" fontWeight="600">
                      Ideological Position
                    </Text>
                  </HStack>
                  <ScoreBar
                    value={info.current_percentile_rank}
                    min={0}
                    max={1}
                    color={ideology.color}
                  />
                  <HStack justify="space-between" mt={1}>
                    <Text fontSize="xs" color="blue.500">
                      Liberal
                    </Text>
                    <Text fontSize="xs" color="red.500">
                      Conservative
                    </Text>
                  </HStack>
                </Box>
              )}

              {/* Position description */}
              {hasCurrentData && (
                <Box
                  p={3}
                  bg={`${ideology.color}10`}
                  rounded="lg"
                  borderLeft="3px solid"
                  borderLeftColor={ideology.color}
                >
                  <Text fontSize="sm" color="text">
                    <strong>Position:</strong> This legislator takes a{" "}
                    <strong>{ideology.label.toLowerCase()}</strong> stance on{" "}
                    {category.toLowerCase()} issues, ranking more{" "}
                    {info.current_percentile_rank < 0.5
                      ? "liberal"
                      : "conservative"}{" "}
                    than{" "}
                    {Math.abs(info.current_percentile_rank - 0.5) < 0.15
                      ? "about half"
                      : info.current_percentile_rank < 0.5
                        ? `${((1 - info.current_percentile_rank) * 100).toFixed(0)}%`
                        : `${(info.current_percentile_rank * 100).toFixed(0)}%`}{" "}
                    of their peers.
                  </Text>
                </Box>
              )}

              {/* Liberal/Conservative view definitions */}
              <IdeologyViewsBar subject={category} compact />
            </VStack>
          )}
        </Box>
      )}
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
    if (aInsufficient && !bInsufficient) return 1;
    if (!aInsufficient && bInsufficient) return -1;
    if (aInsufficient && bInsufficient) return 0;
    if (sortBy === "ideology")
      return (
        Math.abs(b[1].percentile_rank - 0.5) -
        Math.abs(a[1].percentile_rank - 0.5)
      );
    if (sortBy === "bills") return b[1].bill_count - a[1].bill_count;
    if (sortBy === "score") return b[1].score - a[1].score;
    return 0;
  });

  return (
    <Box w="100%">
      {/* Header */}
      <HStack justify="space-between" mb={3} flexWrap="wrap">
        <Heading size="md" color="text">
          Policy Categories
        </Heading>
        <HStack gap={2}>
          <Text fontSize="xs" color="gray.500">
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
              px={3}
              py={1}
              rounded="md"
              bg={sortBy === option.key ? "blue.500" : "gray.100"}
              color={sortBy === option.key ? "white" : "gray.700"}
              cursor="pointer"
              fontSize="xs"
              fontWeight="600"
              transition="all 0.2s"
              _hover={{ bg: sortBy === option.key ? "blue.600" : "gray.200" }}
            >
              {option.label}
            </Box>
          ))}
        </HStack>
      </HStack>

      {/* Column headers */}
      <HStack px={3} pb={1} gap={3}>
        <Text fontSize="xs" color="gray.400" flex={1}>
          Category
        </Text>
        <Text fontSize="xs" color="gray.400" w="40px" textAlign="right">
          Score
        </Text>
        <Text fontSize="xs" color="gray.400" w="44px" textAlign="right">
          Pctile
        </Text>
        <Text fontSize="xs" color="gray.400" w="90px" textAlign="center">
          Position
        </Text>
        <Box w="16px" />
      </HStack>

      {/* Category rows */}
      <VStack align="stretch" gap={1}>
        {sortedCategories.map(([category, info]) => (
          <CategoryRow key={category} category={category} info={info} />
        ))}
      </VStack>
    </Box>
  );
}
