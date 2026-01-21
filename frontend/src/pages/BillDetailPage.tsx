import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Center,
  Button,
  Badge,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import BillVotes from "../components/Bills/BillVotes";
import { Helmet } from "react-helmet-async";

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

interface Subcategory {
  name: string;
  partisan_score: number;
  impact_score: number;
  reasoning: string;
}

interface VotePosition {
  political_position: string;
  philosophy: string;
  stakeholder_support: string[];
  reasoning: string;
}

interface VotingAnalysis {
  yes_vote: VotePosition;
  no_vote: VotePosition;
}

interface BillAnalysis {
  _id?: string;
  bill_id: string;
  model: string;
  bill_type: string;
  chamber: string;
  congress: number;
  schema_version: number;
  bill_summary: BillSummary;
  political_categories: {
    primary_categories: PrimaryCategory[];
    subcategories: Subcategory[];
  };
  voting_analysis: VotingAnalysis;
  bill_truncated?: boolean;
  last_modified?: string;
}

export default function BillDetailPage() {
  const { bill_id } = useParams<{ bill_id: string }>();
  const { model = "gpt-oss-120b" } = useParams<{ model: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<BillAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bill_id) {
      fetchBill();
    }
  }, [bill_id]);

  const fetchBill = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bill-analyses/${bill_id}/${model}`
      );

      if (!response.ok) {
        throw new Error("Bill not found");
      }

      const data = await response.json();
      setBill(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching bill:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgScore = () => {
    if (!bill) return 0;
    const scores = bill.political_categories.primary_categories.map(
      (c) => c.partisan_score
    );
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const getIdeologyColor = (score: number) => {
    if (score < -0.2) return "blue.500";
    if (score > 0.2) return "red.500";
    return "purple.500";
  };

  const getIdeologyLabel = (score: number) => {
    if (score < -0.3) return "Liberal";
    if (score > 0.3) return "Conservative";
    return "Moderate";
  };

  const getScoreBarWidth = (score: number, min: number, max: number) => {
    return ((score - min) / (max - min)) * 100;
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="primary" />
          <Text color="text">Loading bill analysis...</Text>
        </VStack>
      </Center>
    );
  }

  if (error || !bill) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Text color="red.500" fontSize="xl">
            {error || "Bill not found"}
          </Text>
          <Button
            onClick={() => navigate("/bill-analyses")}
            colorScheme="primary"
            variant="outline"
          >
            Back to Bills
          </Button>
        </VStack>
      </Center>
    );
  }

  const avgScore = calculateAvgScore();

  return (
    <Box minH="100vh" bg="bg">
      <Helmet>
        <title>{`${bill.bill_id} using ${bill.model} | US PoliTrack`}</title>
        <meta
          name="description"
          content={`Bill Analysis for ${bill.bill_id} using ${bill.model}. Bill title is ${bill.bill_summary.title}`}
        />
      </Helmet>
      <Container maxW="5xl" py={8}>
        <VStack align="stretch" gap={8}>
          {/* Back Button */}
          <Button
            onClick={() => navigate("/bill-analyses")}
            variant="ghost"
            alignSelf="flex-start"
          >
            Back to Bills
          </Button>
          Bill Header
          <Box bg="bgLightShade" p={8} rounded="xl">
            <VStack align="stretch" gap={4}>
              <HStack justify="space-between" flexWrap="wrap" gap={4}>
                <VStack align="flex-start" gap={2}>
                  <Heading size="2xl" color="primary">
                    {bill.bill_id.toUpperCase()}
                  </Heading>
                  <HStack gap={2} flexWrap="wrap">
                    <Badge
                      colorScheme={bill.chamber === "house" ? "blue" : "green"}
                      fontSize="sm"
                    >
                      {bill.chamber.toUpperCase()}
                    </Badge>
                    <Badge colorScheme="purple" fontSize="sm">
                      {bill.congress}th Congress
                    </Badge>
                    <Badge colorScheme="gray" fontSize="sm">
                      {bill.bill_type.toUpperCase()}
                    </Badge>
                    <Badge colorScheme="orange" fontSize="sm">
                      {bill.model}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>

              {/* Ideology Indicator */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="bold" color="text">
                    Overall Ideology: {getIdeologyLabel(avgScore)}
                  </Text>
                  <Text fontSize="sm" color="text">
                    Score: {avgScore.toFixed(3)}
                  </Text>
                </HStack>

                {/* Add top padding to make room for labels */}
                <Box
                  position="relative"
                  h="12px"
                  bg="gray.200"
                  rounded="full"
                  pt="20px"
                >
                  <Text
                    position="absolute"
                    left="2px"
                    top="0"
                    fontSize="xs"
                    color="text"
                  >
                    Liberal
                  </Text>
                  <Text
                    position="absolute"
                    right="2px"
                    top="0"
                    fontSize="xs"
                    color="text"
                  >
                    Conservative
                  </Text>

                  <Box
                    position="absolute"
                    left="50%"
                    top="0"
                    bottom="0"
                    w="2px"
                    bg="gray.400"
                    transform="translateX(-50%)"
                  />
                  <Box
                    position="absolute"
                    left={`${((avgScore + 1) / 2) * 100}%`}
                    top="50%"
                    transform="translate(-50%, -50%)"
                    w="16px"
                    h="16px"
                    bg={getIdeologyColor(avgScore)}
                    rounded="full"
                    border="3px solid white"
                    shadow="md"
                  />
                </Box>
              </Box>
            </VStack>
          </Box>
          {/* Bill Summary */}
          <Box bg="bgLightShade" p={8} rounded="xl">
            <VStack align="stretch" gap={4}>
              <Heading size="lg" color="primary">
                Bill Summary
              </Heading>
              <Text fontSize="lg" fontWeight="semibold" color="text">
                {bill.bill_summary.title}
              </Text>
              <Box>
                <Text fontSize="md" fontWeight="bold" color="primary" mb={2}>
                  Key Provisions:
                </Text>
                <VStack align="stretch" gap={2}>
                  {bill.bill_summary.key_provisions.map((provision, index) => (
                    <HStack key={index} align="flex-start" gap={2}>
                      <Text color="primary" fontWeight="bold" minW="20px">
                        •
                      </Text>
                      <Text color="text">{provision}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>
          {/* Political Categories */}
          <Box bg="bgLightShade" p={8} rounded="xl">
            <VStack align="stretch" gap={6}>
              <Heading size="lg" color="primary">
                Political Analysis
              </Heading>

              {/* Primary Categories */}
              <Box>
                <Text fontSize="md" fontWeight="bold" color="primary" mb={4}>
                  Primary Categories
                </Text>
                <VStack align="stretch" gap={4}>
                  {bill.political_categories.primary_categories.map(
                    (category, index) => (
                      <Box key={index} bg="bg" p={4} rounded="lg">
                        <VStack align="stretch" gap={3}>
                          <Text fontSize="lg" fontWeight="bold" color="text">
                            {category.name}
                          </Text>

                          {/* Partisan Score */}
                          <Box>
                            <HStack justify="space-between" mb={1}>
                              <Text fontSize="sm" color="text">
                                Partisan Score
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color={getIdeologyColor(
                                  category.partisan_score
                                )}
                              >
                                {category.partisan_score.toFixed(2)}
                              </Text>
                            </HStack>
                            <Box
                              position="relative"
                              h="8px"
                              bg="gray.200"
                              rounded="full"
                            >
                              <Box
                                position="absolute"
                                left="50%"
                                top="0"
                                bottom="0"
                                w="1px"
                                bg="gray.400"
                              />
                              <Box
                                w={`${getScoreBarWidth(
                                  category.partisan_score,
                                  -1,
                                  1
                                )}%`}
                                h="100%"
                                bg={getIdeologyColor(category.partisan_score)}
                                rounded="full"
                              />
                            </Box>
                          </Box>

                          {/* Impact Score */}
                          <Box>
                            <HStack justify="space-between" mb={1}>
                              <Text fontSize="sm" color="text">
                                Impact Score
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="primary"
                              >
                                {category.impact_score.toFixed(2)}
                              </Text>
                            </HStack>
                            <Box
                              position="relative"
                              h="8px"
                              bg="gray.200"
                              rounded="full"
                            >
                              <Box
                                w={`${category.impact_score * 100}%`}
                                h="100%"
                                bg="primary"
                                rounded="full"
                              />
                            </Box>
                          </Box>

                          {/* Reasoning */}
                          <Box
                            pt={2}
                            borderTop="1px solid"
                            borderColor="gray.200"
                          >
                            <Text fontSize="sm" color="text" fontStyle="italic">
                              {category.reasoning}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    )
                  )}
                </VStack>
              </Box>

              {/* Subcategories */}
              {bill.political_categories.subcategories &&
                bill.political_categories.subcategories.length > 0 && (
                  <Box>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color="primary"
                      mb={4}
                    >
                      Subcategories
                    </Text>
                    <VStack align="stretch" gap={3}>
                      {bill.political_categories.subcategories.map(
                        (category, index) => (
                          <Box key={index} bg="bg" p={3} rounded="lg">
                            <VStack align="stretch" gap={2}>
                              <Text
                                fontSize="md"
                                fontWeight="semibold"
                                color="text"
                              >
                                {category.name}
                              </Text>
                              <HStack gap={4}>
                                <Text fontSize="xs" color="text">
                                  Partisan: {category.partisan_score.toFixed(2)}
                                </Text>
                                <Text fontSize="xs" color="text">
                                  Impact: {category.impact_score.toFixed(2)}
                                </Text>
                              </HStack>
                            </VStack>
                          </Box>
                        )
                      )}
                    </VStack>
                  </Box>
                )}
            </VStack>
          </Box>
          {/* Voting Analysis */}
          <Box bg="bgLightShade" p={8} rounded="xl">
            <VStack align="stretch" gap={6}>
              <Heading size="lg" color="primary">
                Voting Analysis
              </Heading>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                {/* YES Vote */}
                <GridItem>
                  <Box
                    bg="bg"
                    p={6}
                    rounded="lg"
                    h="100%"
                    borderTop="4px solid"
                    borderColor="green.500"
                  >
                    <VStack align="stretch" gap={4}>
                      <HStack justify="space-between">
                        <Heading size="md" color="green.600">
                          YES Vote
                        </Heading>
                        <Badge colorScheme="green" fontSize="sm">
                          {bill.voting_analysis.yes_vote.political_position}
                        </Badge>
                      </HStack>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="text"
                          mb={2}
                        >
                          Philosophy:
                        </Text>
                        <Text fontSize="sm" color="text">
                          {bill.voting_analysis.yes_vote.philosophy}
                        </Text>
                      </Box>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="text"
                          mb={2}
                        >
                          Stakeholder Support:
                        </Text>
                        <VStack align="stretch" gap={1}>
                          {bill.voting_analysis.yes_vote.stakeholder_support.map(
                            (stakeholder, index) => (
                              <HStack key={index} align="flex-start">
                                <Text color="green.600" fontSize="sm">
                                  •
                                </Text>
                                <Text fontSize="sm" color="text">
                                  {stakeholder}
                                </Text>
                              </HStack>
                            )
                          )}
                        </VStack>
                      </Box>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="text"
                          mb={2}
                        >
                          Reasoning:
                        </Text>
                        <Text fontSize="sm" color="text" fontStyle="italic">
                          {bill.voting_analysis.yes_vote.reasoning}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </GridItem>

                {/* NO Vote */}
                <GridItem>
                  <Box
                    bg="bg"
                    p={6}
                    rounded="lg"
                    h="100%"
                    borderTop="4px solid"
                    borderColor="red.500"
                  >
                    <VStack align="stretch" gap={4}>
                      <HStack justify="space-between">
                        <Heading size="md" color="red.600">
                          NO Vote
                        </Heading>
                        <Badge colorScheme="red" fontSize="sm">
                          {bill.voting_analysis.no_vote.political_position}
                        </Badge>
                      </HStack>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="text"
                          mb={2}
                        >
                          Philosophy:
                        </Text>
                        <Text fontSize="sm" color="text">
                          {bill.voting_analysis.no_vote.philosophy}
                        </Text>
                      </Box>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="text"
                          mb={2}
                        >
                          Stakeholder Support:
                        </Text>
                        <VStack align="stretch" gap={1}>
                          {bill.voting_analysis.no_vote.stakeholder_support.map(
                            (stakeholder, index) => (
                              <HStack key={index} align="flex-start">
                                <Text color="red.600" fontSize="sm">
                                  •
                                </Text>
                                <Text fontSize="sm" color="text">
                                  {stakeholder}
                                </Text>
                              </HStack>
                            )
                          )}
                        </VStack>
                      </Box>

                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="text"
                          mb={2}
                        >
                          Reasoning:
                        </Text>
                        <Text fontSize="sm" color="text" fontStyle="italic">
                          {bill.voting_analysis.no_vote.reasoning}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>
          </Box>
          {/* Roll Call Votes - New Section */}
          <BillVotes bill_id={bill.bill_id} />
          {/* Footer Info */}
          {bill.bill_truncated && (
            <Box
              bg="yellow.50"
              p={4}
              rounded="lg"
              borderLeft="4px solid"
              borderColor="yellow.500"
            >
              <Text fontSize="sm" color="yellow.800">
                Note: This bill was truncated during analysis due to length
                constraints.
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
