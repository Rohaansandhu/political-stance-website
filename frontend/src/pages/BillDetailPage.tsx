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
import { ArrowLeft } from "lucide-react";
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

function Card({
  children,
  ...props
}: React.ComponentProps<typeof Box>) {
  return (
    <Box
      bg="surface"
      p={{ base: 5, md: 8 }}
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      boxShadow="card"
      {...props}
    >
      {children}
    </Box>
  );
}

export default function BillDetailPage() {
  const { bill_id } = useParams<{ bill_id: string }>();
  const { model = "gpt-5-mini" } = useParams<{ model: string }>();
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
        `${import.meta.env.VITE_API_URL}/api/bill-analyses/${bill_id}/${model}`,
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
      (c) => c.partisan_score,
    );
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const getIdeologyColor = (score: number) => {
    if (score < -0.2) return "partyDem";
    if (score > 0.2) return "partyRep";
    return "partyInd";
  };

  const getIdeologyLabel = (score: number) => {
    if (score < -0.3) return "Liberal";
    if (score > 0.3) return "Conservative";
    return "Moderate";
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="primary" />
          <Text color="textMuted">Loading bill analysis...</Text>
        </VStack>
      </Center>
    );
  }

  if (error || !bill) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Text color="voteNay" fontSize="xl">
            {error || "Bill not found"}
          </Text>
          <Button
            onClick={() => navigate("/bill-analyses")}
            variant="outline"
            borderColor="border"
            color="text"
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
        <VStack align="stretch" gap={6}>
          {/* Back Button */}
          <Button
            onClick={() => navigate("/bill-analyses")}
            variant="ghost"
            alignSelf="flex-start"
            color="textMuted"
            _hover={{ color: "primary", bg: "bgLightShade" }}
          >
            <ArrowLeft size={16} /> Back to Bills
          </Button>

          {/* Bill Header */}
          <Card>
            <VStack align="stretch" gap={6}>
              <VStack align="flex-start" gap={3}>
                <Heading size="2xl" color="text" letterSpacing="tight">
                  {bill.bill_id.toUpperCase()}
                </Heading>
                <HStack gap={2} flexWrap="wrap">
                  <Badge
                    colorPalette={bill.chamber === "house" ? "blue" : "purple"}
                    variant="subtle"
                    rounded="full"
                    px={3}
                    py={1}
                  >
                    {bill.chamber.toUpperCase()}
                  </Badge>
                  <Badge
                    variant="subtle"
                    rounded="full"
                    px={3}
                    py={1}
                    bg="bgAltGreen"
                    color="primary"
                  >
                    {bill.congress}th Congress
                  </Badge>
                  <Badge
                    variant="subtle"
                    rounded="full"
                    px={3}
                    py={1}
                    bg="bgLightShade"
                    color="textMuted"
                  >
                    {bill.bill_type.toUpperCase()}
                  </Badge>
                  <Badge
                    colorPalette="orange"
                    variant="subtle"
                    rounded="full"
                    px={3}
                    py={1}
                  >
                    {bill.model}
                  </Badge>
                </HStack>
              </VStack>

              {/* Ideology Indicator */}
              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="sm" fontWeight="semibold" color="text">
                    Overall Ideology:{" "}
                    <Box as="span" color={getIdeologyColor(avgScore)}>
                      {getIdeologyLabel(avgScore)}
                    </Box>
                  </Text>
                  <Text fontSize="sm" color="textMuted" fontVariantNumeric="tabular-nums">
                    {avgScore.toFixed(3)}
                  </Text>
                </HStack>

                <Box position="relative" h="10px" rounded="full" bgGradient="to-r" gradientFrom="partyDem" gradientVia="bgLightShade" gradientTo="partyRep" opacity={0.9}>
                  <Box
                    position="absolute"
                    left="50%"
                    top="-3px"
                    bottom="-3px"
                    w="1px"
                    bg="border"
                    transform="translateX(-50%)"
                  />
                  <Box
                    position="absolute"
                    left={`${((avgScore + 1) / 2) * 100}%`}
                    top="50%"
                    transform="translate(-50%, -50%)"
                    w="18px"
                    h="18px"
                    bg={getIdeologyColor(avgScore)}
                    rounded="full"
                    borderWidth="3px"
                    borderColor="surface"
                    shadow="md"
                  />
                </Box>
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="xs" color="textMuted" fontWeight="medium">
                    Liberal
                  </Text>
                  <Text fontSize="xs" color="textMuted" fontWeight="medium">
                    Conservative
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Card>

          {/* Bill Summary */}
          <Card>
            <VStack align="stretch" gap={4}>
              <Heading size="lg" color="text" letterSpacing="tight">
                Bill Summary
              </Heading>
              <Text fontSize="lg" fontWeight="semibold" color="text">
                {bill.bill_summary.title}
              </Text>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="textMuted"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  mb={3}
                >
                  Key Provisions
                </Text>
                <VStack align="stretch" gap={2.5}>
                  {bill.bill_summary.key_provisions.map((provision, index) => (
                    <HStack key={index} align="flex-start" gap={3}>
                      <Box
                        mt="7px"
                        boxSize="6px"
                        rounded="full"
                        bg="primary"
                        flexShrink={0}
                      />
                      <Text color="text" fontSize="sm" lineHeight="1.7">
                        {provision}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Card>

          {/* Political Categories */}
          <Card>
            <VStack align="stretch" gap={6}>
              <Heading size="lg" color="text" letterSpacing="tight">
                Political Analysis
              </Heading>

              {/* Primary Categories */}
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="textMuted"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  mb={4}
                >
                  Primary Categories
                </Text>
                <VStack align="stretch" gap={4}>
                  {bill.political_categories.primary_categories.map(
                    (category, index) => (
                      <Box
                        key={index}
                        bg="bg"
                        p={5}
                        rounded="xl"
                        borderWidth="1px"
                        borderColor="borderSubtle"
                      >
                        <VStack align="stretch" gap={4}>
                          <Text fontSize="md" fontWeight="bold" color="text">
                            {category.name}
                          </Text>

                          {/* Partisan Score */}
                          <Box>
                            <HStack justify="space-between" mb={1.5}>
                              <Text fontSize="xs" color="textMuted" fontWeight="medium">
                                Partisan Score
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                fontVariantNumeric="tabular-nums"
                                color={getIdeologyColor(category.partisan_score)}
                              >
                                {category.partisan_score.toFixed(2)}
                              </Text>
                            </HStack>
                            <Box
                              position="relative"
                              h="6px"
                              bg="bgLightShade"
                              rounded="full"
                              overflow="hidden"
                            >
                              <Box
                                position="absolute"
                                left="50%"
                                top="0"
                                bottom="0"
                                w="1px"
                                bg="border"
                              />
                              <Box
                                position="absolute"
                                top="0"
                                bottom="0"
                                left={
                                  category.partisan_score >= 0
                                    ? "50%"
                                    : `${((category.partisan_score + 1) / 2) * 100}%`
                                }
                                width={`${(Math.abs(category.partisan_score) / 2) * 100}%`}
                                bg={getIdeologyColor(category.partisan_score)}
                                rounded="full"
                              />
                            </Box>
                          </Box>

                          {/* Impact Score */}
                          <Box>
                            <HStack justify="space-between" mb={1.5}>
                              <Text fontSize="xs" color="textMuted" fontWeight="medium">
                                Impact Score
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="primary"
                                fontVariantNumeric="tabular-nums"
                              >
                                {category.impact_score.toFixed(2)}
                              </Text>
                            </HStack>
                            <Box
                              h="6px"
                              bg="bgLightShade"
                              rounded="full"
                              overflow="hidden"
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
                            pt={3}
                            borderTopWidth="1px"
                            borderColor="borderSubtle"
                          >
                            <Text fontSize="sm" color="textMuted" lineHeight="1.7">
                              {category.reasoning}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    ),
                  )}
                </VStack>
              </Box>

              {/* Subcategories */}
              {bill.political_categories.subcategories &&
                bill.political_categories.subcategories.length > 0 && (
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="textMuted"
                      textTransform="uppercase"
                      letterSpacing="wide"
                      mb={4}
                    >
                      Subcategories
                    </Text>
                    <Grid
                      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                      gap={3}
                    >
                      {bill.political_categories.subcategories.map(
                        (category, index) => (
                          <Box
                            key={index}
                            bg="bg"
                            p={4}
                            rounded="xl"
                            borderWidth="1px"
                            borderColor="borderSubtle"
                          >
                            <VStack align="stretch" gap={2}>
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color="text"
                              >
                                {category.name}
                              </Text>
                              <HStack gap={4}>
                                <Text
                                  fontSize="xs"
                                  color="textMuted"
                                  fontVariantNumeric="tabular-nums"
                                >
                                  Partisan:{" "}
                                  <Box
                                    as="span"
                                    fontWeight="bold"
                                    color={getIdeologyColor(
                                      category.partisan_score,
                                    )}
                                  >
                                    {category.partisan_score.toFixed(2)}
                                  </Box>
                                </Text>
                                <Text
                                  fontSize="xs"
                                  color="textMuted"
                                  fontVariantNumeric="tabular-nums"
                                >
                                  Impact:{" "}
                                  <Box as="span" fontWeight="bold" color="primary">
                                    {category.impact_score.toFixed(2)}
                                  </Box>
                                </Text>
                              </HStack>
                            </VStack>
                          </Box>
                        ),
                      )}
                    </Grid>
                  </Box>
                )}
            </VStack>
          </Card>

          {/* Voting Analysis */}
          <Card>
            <VStack align="stretch" gap={6}>
              <Heading size="lg" color="text" letterSpacing="tight">
                Voting Analysis
              </Heading>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={5}
              >
                {(
                  [
                    ["YES Vote", bill.voting_analysis.yes_vote, "voteYea"],
                    ["NO Vote", bill.voting_analysis.no_vote, "voteNay"],
                  ] as const
                ).map(([label, position, token]) => (
                  <GridItem key={label}>
                    <Box
                      bg="bg"
                      p={6}
                      rounded="xl"
                      h="100%"
                      borderWidth="1px"
                      borderColor="borderSubtle"
                      borderTopWidth="3px"
                      borderTopColor={token}
                    >
                      <VStack align="stretch" gap={5}>
                        <VStack align="flex-start" gap={2}>
                          <Heading size="md" color={token}>
                            {label}
                          </Heading>
                          <Badge
                            colorPalette={token === "voteYea" ? "green" : "red"}
                            variant="subtle"
                            whiteSpace="normal"
                            rounded="md"
                            px={2}
                            py={1}
                          >
                            {position.political_position}
                          </Badge>
                        </VStack>

                        <Box>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="textMuted"
                            textTransform="uppercase"
                            letterSpacing="wide"
                            mb={2}
                          >
                            Philosophy
                          </Text>
                          <Text fontSize="sm" color="text" lineHeight="1.7">
                            {position.philosophy}
                          </Text>
                        </Box>

                        <Box>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="textMuted"
                            textTransform="uppercase"
                            letterSpacing="wide"
                            mb={2}
                          >
                            Stakeholder Support
                          </Text>
                          <VStack align="stretch" gap={1.5}>
                            {position.stakeholder_support.map(
                              (stakeholder, index) => (
                                <HStack key={index} align="flex-start" gap={2.5}>
                                  <Box
                                    mt="7px"
                                    boxSize="5px"
                                    rounded="full"
                                    bg={token}
                                    flexShrink={0}
                                  />
                                  <Text fontSize="sm" color="text">
                                    {stakeholder}
                                  </Text>
                                </HStack>
                              ),
                            )}
                          </VStack>
                        </Box>

                        <Box>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="textMuted"
                            textTransform="uppercase"
                            letterSpacing="wide"
                            mb={2}
                          >
                            Reasoning
                          </Text>
                          <Text fontSize="sm" color="textMuted" lineHeight="1.7">
                            {position.reasoning}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            </VStack>
          </Card>

          {/* Roll Call Votes */}
          <BillVotes bill_id={bill.bill_id} />

          {/* Footer Info */}
          {bill.bill_truncated && (
            <Box
              bg="bgAltGreen"
              p={4}
              rounded="xl"
              borderLeftWidth="3px"
              borderColor="primary"
            >
              <Text fontSize="sm" color="textMuted">
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
