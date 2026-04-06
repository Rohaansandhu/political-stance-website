import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Link,
} from "@chakra-ui/react";
import IdeologyViewsBar from "../CongressData/IdeologyViewBar";

interface BillVote {
  bill_id: string;
  vote: string;
  date: string;
  score_impact: number;
}

interface TopBills {
  conservative: BillVote[];
  liberal: BillVote[];
}

interface CategoryInfo {
  score: number;
  rank: number;
  percentile_rank: number;
  bill_count: number;
  current_rank: number;
  current_percentile_rank: number;
  total_members?: number;
  total_current_members?: number;
  top_bills?: TopBills;
}

interface Categories {
  [key: string]: CategoryInfo;
}

function getIdeologyInfo(percentile: number) {
  if (percentile < 0.4) return { label: "Liberal", color: "#3b82f6" };
  if (percentile > 0.6) return { label: "Conservative", color: "#ef4444" };
  return { label: "Moderate", color: "#8b5cf6" };
}

function getBillUrl(billId: string, model: string) {
  return `https://www.uspolitrack.org/bill-analyses/${billId}/${model}`;
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

function formatBillId(bill_id: string) {
  // e.g. "hr351-114" -> "H.R. 351 (114th)"
  const match = bill_id.match(/^([a-z]+)(\d+)-(\d+)$/i);
  if (!match) return bill_id.toUpperCase();
  const [, type, num, congress] = match;
  const typeMap: Record<string, string> = {
    hr: "H.R.",
    s: "S.",
    hjres: "H.J.Res.",
    sjres: "S.J.Res.",
    hres: "H.Res.",
    sres: "S.Res.",
    hjres2: "H.J.Res.",
    hjres45: "H.J.Res.",
  };
  const label = typeMap[type.toLowerCase()] ?? type.toUpperCase();
  return `${label} ${num} (${congress}th)`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function BillRow({
  bill,
  side,
  model,
}: {
  bill: BillVote;
  side: "liberal" | "conservative";
  model: string;
}) {
  const isLib = side === "liberal";
  const color = isLib ? "blue" : "red";
  const voteIsYea = ["yea", "aye", "yes"].includes(bill.vote.toLowerCase());

  return (
    <HStack
      justify="space-between"
      px={2}
      py={1}
      bg={isLib ? "blue.50" : "red.50"}
      rounded="md"
      gap={2}
    >
      <VStack align="flex-start" gap={0} flex={1} minW={0}>
        <Text fontSize="xs" fontWeight="700" color={`${color}.700`}>
          <Link
            href={getBillUrl(bill.bill_id, model)}
            _hover={{ textDecoration: "underline" }}
          >
            {formatBillId(bill.bill_id)}
          </Link>
        </Text>
        <Text fontSize="xs" color="gray.400">
          {formatDate(bill.date)}
        </Text>
      </VStack>
      <Badge
        colorScheme={voteIsYea ? "green" : "red"}
        variant="solid"
        fontSize="xs"
        fontWeight="bold"
        px={2}
        py={0.5}
        borderRadius="md"
        flexShrink={0}
      >
        {bill.vote.toUpperCase()}
      </Badge>
      <Text
        fontSize="xs"
        fontWeight="700"
        color={isLib ? "blue.600" : "red.600"}
        flexShrink={0}
        w="36px"
        textAlign="right"
      >
        {bill.score_impact > 0 ? "+" : ""}
        {bill.score_impact.toFixed(2)}
      </Text>
    </HStack>
  );
}

function TopBillsSection({
  top_bills,
  model,
}: {
  top_bills: TopBills;
  model: string;
}) {
  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="700"
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="0.05em"
        mb={2}
      >
        Most Impactful Bills
      </Text>
      <HStack align="flex-start" gap={3}>
        {/* Liberal bills */}
        <VStack align="stretch" gap={1} flex={1}>
          <HStack gap={1} mb={1}>
            <Box w="8px" h="8px" borderRadius="full" bg="blue.500" />
            <Text fontSize="xs" fontWeight="700" color="blue.600">
              Most Liberal Votes
            </Text>
          </HStack>
          {top_bills.liberal.slice(0, 3).map((bill) => (
            <BillRow
              key={`${bill.bill_id}-${bill.date}`}
              bill={bill}
              side="liberal"
              model={model}
            />
          ))}
        </VStack>

        {/* Conservative bills */}
        <VStack align="stretch" gap={1} flex={1}>
          <HStack gap={1} mb={1}>
            <Box w="8px" h="8px" borderRadius="full" bg="red.500" />
            <Text fontSize="xs" fontWeight="700" color="red.600">
              Most Conservative Votes
            </Text>
          </HStack>
          {top_bills.conservative.slice(0, 3).map((bill) => (
            <BillRow
              key={`${bill.bill_id}-${bill.date}`}
              bill={bill}
              side="conservative"
              model={model}
            />
          ))}
        </VStack>
      </HStack>
    </Box>
  );
}

function CategoryRow({
  category,
  info,
  model,
}: {
  category: string;
  info: CategoryInfo;
  model: string;
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

              {/* Top bills */}
              {info.top_bills && (
                <TopBillsSection top_bills={info.top_bills} model={model} />
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
  recentVotes,
  model = "gpt-5-mini",
}: {
  categories: Categories;
  recentVotes?: {
    conservative: (BillVote & { category: string })[];
    liberal: (BillVote & { category: string })[];
  };
  model?: string;
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
        <Text fontSize="xs" color="gray.400" w="110px" textAlign="center">
          Position
        </Text>
        <Box w="16px" />
      </HStack>

      {/* Category rows */}
      <VStack align="stretch" gap={1}>
        {sortedCategories.map(([category, info]) => (
          <CategoryRow
            key={category}
            category={category}
            info={info}
            model={model}
          />
        ))}
      </VStack>

      {/* Recent Votes section - Statically Expanded */}
      {recentVotes && (
        <Box
          mt={6}
          mb={4}
          bg="bg"
          rounded="lg"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <HStack
            px={4}
            py={3}
            bg="gray.50"
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" fontWeight="700" color="text">
              Recent Votes
            </Text>
          </HStack>

          <Box px={4} py={4}>
            <HStack align="flex-start" gap={3}>
              <VStack align="stretch" gap={1} flex={1}>
                <HStack gap={1} mb={1}>
                  <Box w="8px" h="8px" borderRadius="full" bg="blue.500" />
                  <Text fontSize="xs" fontWeight="700" color="blue.600">
                    Most Liberal
                  </Text>
                </HStack>
                {recentVotes.liberal.slice(0, 5).map((bill) => (
                  <Box
                    key={`${bill.bill_id}-${bill.date}`}
                    px={2}
                    py={1}
                    bg="blue.50"
                    rounded="md"
                  >
                    <HStack justify="space-between">
                      <VStack align="flex-start" gap={0} flex={1} minW={0}>
                        <Text fontSize="xs" fontWeight="700" color="blue.700">
                          <Link
                            href={getBillUrl(bill.bill_id, model)}
                            _hover={{ textDecoration: "underline" }}
                          >
                            {formatBillId(bill.bill_id)}
                          </Link>
                        </Text>
                        <HStack gap={2}>
                          <Text fontSize="xs" color="gray.400">
                            {formatDate(bill.date)}
                          </Text>
                          <Badge fontSize="2xs" colorScheme="purple">
                            {bill.category}
                          </Badge>
                        </HStack>
                      </VStack>
                      <Badge
                        variant="solid"
                        fontSize="xs"
                        fontWeight="bold"
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        colorScheme={
                          ["yea", "aye", "yes"].includes(
                            bill.vote.toLowerCase(),
                          )
                            ? "green"
                            : "red"
                        }
                      >
                        {bill.vote.toUpperCase()}
                      </Badge>
                    </HStack>
                  </Box>
                ))}
              </VStack>
              <VStack align="stretch" gap={1} flex={1}>
                <HStack gap={1} mb={1}>
                  <Box w="8px" h="8px" borderRadius="full" bg="red.500" />
                  <Text fontSize="xs" fontWeight="700" color="red.600">
                    Most Conservative
                  </Text>
                </HStack>
                {recentVotes.conservative.slice(0, 5).map((bill) => (
                  <Box
                    key={`${bill.bill_id}-${bill.date}`}
                    px={2}
                    py={1}
                    bg="red.50"
                    rounded="md"
                  >
                    <HStack justify="space-between">
                      <VStack align="flex-start" gap={0} flex={1} minW={0}>
                        <Text fontSize="xs" fontWeight="700" color="red.700">
                          <Link
                            href={getBillUrl(bill.bill_id, model)}
                            _hover={{ textDecoration: "underline" }}
                          >
                            {formatBillId(bill.bill_id)}
                          </Link>
                        </Text>
                        <HStack gap={2}>
                          <Text fontSize="xs" color="gray.400">
                            {formatDate(bill.date)}
                          </Text>
                          <Badge fontSize="2xs" colorScheme="purple">
                            {bill.category}
                          </Badge>
                        </HStack>
                      </VStack>
                      <Badge
                        variant="solid"
                        fontSize="xs"
                        fontWeight="bold"
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        colorScheme={
                          ["yea", "aye", "yes"].includes(
                            bill.vote.toLowerCase(),
                          )
                            ? "green"
                            : "red"
                        }
                      >
                        {bill.vote.toUpperCase()}
                      </Badge>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </HStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
