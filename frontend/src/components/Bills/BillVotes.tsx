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
  Avatar,
  Wrap,
  WrapItem,
  Separator,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface Vote {
  member_id: string;
  display_name: string;
  party: string;
  state: string;
  vote_cast: string;
}

interface VoteRecord {
  chamber: string;
  votes: Vote[];
  vote_date?: string;
  vote_number?: string;
  question?: string;
  result?: string;
}

interface BillVotesProps {
  bill_id: string;
}

export default function BillVotes({ bill_id }: BillVotesProps) {
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bill_id) {
      fetchVotes();
    }
  }, [bill_id]);

  const fetchVotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bill-analyses/votes/${bill_id}`
      );

      if (!response.ok) {
        throw new Error("Votes not found");
      }

      const data = await response.json();

      // Transform the nested API data into the flat structure the UI expects
      const processedRecords = (data.vote_records || []).map((record: any) => {
        const rawVotes = record.votes || {};
        const flattenedVotes: Vote[] = [];

        // Iterate over keys (Yea, Nay, Not Voting, etc.)
        Object.entries(rawVotes).forEach(([voteType, legislators]) => {
          if (Array.isArray(legislators)) {
            const mappedLegislators = legislators.map((leg: any) => ({
              member_id: leg.id,
              display_name: leg.display_name,
              party: leg.party,
              state: leg.state,
              vote_cast: voteType,
            }));
            flattenedVotes.push(...mappedLegislators);
          }
        });

        return {
          ...record,
          votes: flattenedVotes,
        };
      });

      setVoteRecords(processedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching votes:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPartyColor = (party: string) => {
    if (!party) return "gray";
    switch (party.toUpperCase()) {
      case "R":
      case "REPUBLICAN":
        return "red";
      case "D":
      case "DEMOCRAT":
        return "blue";
      case "I":
      case "INDEPENDENT":
        return "purple";
      default:
        return "gray";
    }
  };

  const getVoteColor = (vote: string) => {
    const voteUpper = vote.toUpperCase();
    if (
      voteUpper.includes("YEA") ||
      voteUpper.includes("YES") ||
      voteUpper.includes("AYE")
    )
      return "green";
    if (voteUpper.includes("NAY") || voteUpper.includes("NO")) return "red";
    return "gray";
  };

  // Helper to interpret "h"/"s" and return display properties
  const getChamberInfo = (chamber: string) => {
    const c = chamber.toLowerCase();
    if (c === "h" || c === "house") return { label: "HOUSE", color: "blue" };
    if (c === "s" || c === "senate")
      return { label: "SENATE", color: "purple" }; // Changed Senate to purple to distinguish from vote colors
    return { label: chamber.toUpperCase(), color: "gray" };
  };

  const groupVotesByCategory = (votes: Vote[]) => {
    const grouped: Record<string, Vote[]> = {};
    votes.forEach((vote) => {
      const category = vote.vote_cast;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(vote);
    });
    return grouped;
  };

  const getVoteStats = (votes: Vote[]) => {
    const stats: Record<string, number> = {};
    votes.forEach((vote) => {
      stats[vote.vote_cast] = (stats[vote.vote_cast] || 0) + 1;
    });
    return stats;
  };

  const getPartyBreakdown = (votes: Vote[], voteType: string) => {
    const breakdown: Record<string, number> = {};
    votes
      .filter((v) => v.vote_cast === voteType)
      .forEach((vote) => {
        breakdown[vote.party] = (breakdown[vote.party] || 0) + 1;
      });
    return breakdown;
  };

  if (loading) {
    return (
      <Box bg="bgLightShade" p={8} rounded="xl">
        <Center>
          <VStack gap={4}>
            <Spinner size="lg" color="primary" />
            <Text color="text">Loading votes...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="bgLightShade" p={8} rounded="xl">
        <Center>
          <Text color="gray.500" fontSize="md">
            No voting data available for this bill
          </Text>
        </Center>
      </Box>
    );
  }

  if (voteRecords.length === 0) {
    return (
      <Box bg="bgLightShade" p={8} rounded="xl">
        <Center>
          <Text color="gray.500" fontSize="md">
            No passage votes recorded yet
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box bg="bgLightShade" p={8} rounded="xl">
      <VStack align="stretch" gap={8}>
        <Heading size="lg" color="primary">
          Passage Vote Records
        </Heading>

        {voteRecords.map((record, recordIndex) => {
          const voteStats = getVoteStats(record.votes);
          const groupedVotes = groupVotesByCategory(record.votes);
          // Sort keys so Yea/Nay usually appear first/consistently
          const voteCategories = Object.keys(groupedVotes).sort((a, b) => {
            // Optional: Custom sort to put Yea/Nay at top, Not Voting at bottom
            if (a.includes("Yea") || a.includes("Aye")) return -1;
            if (b.includes("Yea") || b.includes("Aye")) return 1;
            return a.localeCompare(b);
          });

          const chamberInfo = getChamberInfo(record.chamber);

          return (
            <Box key={recordIndex}>
              {recordIndex > 0 && <Separator my={6} />}

              <VStack align="stretch" gap={6}>
                {/* Chamber Header */}
                <HStack justify="space-between" flexWrap="wrap">
                  <HStack gap={3}>
                    <Badge
                      colorScheme={chamberInfo.color}
                      fontSize="lg"
                      px={4}
                      py={2}
                      rounded="md"
                    >
                      {chamberInfo.label}
                    </Badge>
                    {record.result && (
                      <Badge
                        colorScheme={
                          record.result.toLowerCase().includes("pass") ||
                          record.result.toLowerCase().includes("agreed")
                            ? "green"
                            : "red"
                        }
                        fontSize="md"
                        px={3}
                        py={1}
                      >
                        {record.result}
                      </Badge>
                    )}
                  </HStack>
                  {record.vote_date && (
                    <Text fontSize="sm" color="text">
                      {new Date(record.vote_date).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Text>
                  )}
                </HStack>

                {record.question && (
                  <Text fontSize="sm" color="text" fontStyle="italic">
                    {record.question}
                  </Text>
                )}

                {/* Vote Summary */}
                <Box
                  bg="bg"
                  p={6}
                  rounded="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <VStack align="stretch" gap={4}>
                    <Text fontSize="md" fontWeight="bold" color="text">
                      Vote Summary
                    </Text>
                    <Wrap gap={4}>
                      {Object.entries(voteStats).map(([voteType, count]) => (
                        <WrapItem key={voteType}>
                          <Badge
                            colorScheme={getVoteColor(voteType)}
                            fontSize="md"
                            px={3}
                            py={1}
                            rounded="md"
                            variant="subtle"
                          >
                            {voteType}: {count}
                          </Badge>
                        </WrapItem>
                      ))}
                    </Wrap>

                    {/* Party Breakdown */}
                    <Box pt={4}>
                      <Text fontSize="sm" fontWeight="bold" color="text" mb={3}>
                        Party Breakdown by Vote
                      </Text>
                      <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap={4}
                      >
                        {voteCategories.map((voteType) => {
                          const breakdown = getPartyBreakdown(
                            record.votes,
                            voteType
                          );
                          return (
                            <GridItem key={voteType}>
                              <Box
                                bg="bgLightShade"
                                p={3}
                                rounded="md"
                                borderWidth="1px"
                                borderColor="gray.100"
                              >
                                <Text
                                  fontSize="sm"
                                  fontWeight="semibold"
                                  color="text"
                                  mb={2}
                                >
                                  {voteType}
                                </Text>
                                <HStack gap={3} flexWrap="wrap">
                                  {Object.entries(breakdown).map(
                                    ([party, count]) => (
                                      <Badge
                                        key={party}
                                        colorScheme={getPartyColor(party)}
                                        fontSize="xs"
                                        variant="solid"
                                      >
                                        {party}: {count}
                                      </Badge>
                                    )
                                  )}
                                </HStack>
                              </Box>
                            </GridItem>
                          );
                        })}
                      </Grid>
                    </Box>
                  </VStack>
                </Box>

                {/* Detailed Vote Breakdown */}
                {voteCategories.map((voteCategory) => (
                  <Box
                    key={voteCategory}
                    bg="bg"
                    p={6}
                    rounded="lg"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <VStack align="stretch" gap={4}>
                      <HStack justify="space-between">
                        <Heading size="md" color="text">
                          {voteCategory}
                        </Heading>
                        <Badge
                          colorScheme={getVoteColor(voteCategory)}
                          fontSize="md"
                          px={3}
                          py={1}
                        >
                          {groupedVotes[voteCategory].length} votes
                        </Badge>
                      </HStack>

                      <Wrap gap={2}>
                        {groupedVotes[voteCategory]
                          .sort((a, b) =>
                            (a.display_name || "").localeCompare(
                              b.display_name || ""
                            )
                          )
                          .map((vote) => (
                            <Link to={`/legislators/${vote.member_id}`}>
                              <WrapItem key={vote.member_id || Math.random()}>
                                <Box
                                  title={`${vote.display_name} (${vote.party}-${vote.state})`}
                                >
                                  <HStack
                                    bg="bgLightShade"
                                    px={3}
                                    py={2}
                                    rounded="md"
                                    gap={2}
                                    _hover={{ bg: "gray.100" }}
                                    transition="background 0.2s"
                                    cursor="default"
                                    borderWidth="1px"
                                    borderColor="gray.100"
                                  >
                                    <Avatar.Root
                                      size="xs"
                                      bg={`${getPartyColor(vote.party)}.500`}
                                    >
                                      <Avatar.Fallback
                                        name={vote.display_name
                                          .charAt(0)
                                          .toUpperCase()}
                                      />
                                    </Avatar.Root>
                                    <VStack align="flex-start" gap={0}>
                                      <Text
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        color="text"
                                      >
                                        {vote.display_name}
                                      </Text>
                                      <Text fontSize="2xs" color="gray.500">
                                        {vote.party}-{vote.state}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                </Box>
                              </WrapItem>
                            </Link>
                          ))}
                      </Wrap>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
