import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Center,
  Badge,
  Flex,
  Input,
  SimpleGrid,
  Collapsible,
  InputGroup,
} from "@chakra-ui/react";
import { ChevronDown, Search } from "lucide-react";
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

const getPartyToken = (party: string) => {
  switch ((party || "").toUpperCase()) {
    case "R":
    case "REPUBLICAN":
      return "partyRep";
    case "D":
    case "DEMOCRAT":
      return "partyDem";
    case "I":
    case "INDEPENDENT":
      return "partyInd";
    default:
      return "voteOther";
  }
};

const getVoteToken = (vote: string) => {
  const v = vote.toUpperCase();
  if (v.includes("YEA") || v.includes("YES") || v.includes("AYE"))
    return "voteYea";
  if (v.includes("NAY") || (v.includes("NO") && !v.includes("NOT")))
    return "voteNay";
  return "voteOther";
};

const isYea = (v: string) => getVoteToken(v) === "voteYea";
const isNay = (v: string) => getVoteToken(v) === "voteNay";

const getChamberInfo = (chamber: string) => {
  const c = chamber.toLowerCase();
  if (c === "h" || c === "house") return { label: "House" };
  if (c === "s" || c === "senate") return { label: "Senate" };
  return { label: chamber.toUpperCase() };
};

function ResultBar({ votes }: { votes: Vote[] }) {
  const yea = votes.filter((v) => isYea(v.vote_cast)).length;
  const nay = votes.filter((v) => isNay(v.vote_cast)).length;
  const other = votes.length - yea - nay;
  const total = votes.length || 1;

  return (
    <VStack align="stretch" gap={2}>
      <Flex justify="space-between" align="baseline">
        <HStack gap={2} align="baseline">
          <Text fontSize="2xl" fontWeight="bold" color="voteYea">
            {yea}
          </Text>
          <Text fontSize="sm" fontWeight="semibold" color="voteYea">
            YEA
          </Text>
        </HStack>
        {other > 0 && (
          <Text fontSize="xs" color="textMuted">
            {other} other
          </Text>
        )}
        <HStack gap={2} align="baseline">
          <Text fontSize="sm" fontWeight="semibold" color="voteNay">
            NAY
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="voteNay">
            {nay}
          </Text>
        </HStack>
      </Flex>
      <Flex h="10px" rounded="full" overflow="hidden" bg="bgLightShade">
        <Box bg="voteYea" width={`${(yea / total) * 100}%`} />
        <Box bg="voteOther" width={`${(other / total) * 100}%`} />
        <Box bg="voteNay" width={`${(nay / total) * 100}%`} />
      </Flex>
    </VStack>
  );
}

function PartyBreakdownRow({
  votes,
  voteType,
}: {
  votes: Vote[];
  voteType: string;
}) {
  const breakdown: Record<string, number> = {};
  votes
    .filter((v) => v.vote_cast === voteType)
    .forEach((v) => {
      breakdown[v.party] = (breakdown[v.party] || 0) + 1;
    });

  return (
    <HStack gap={2} flexWrap="wrap">
      {Object.entries(breakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([party, count]) => (
          <HStack
            key={party}
            gap={1.5}
            px={2}
            py={0.5}
            rounded="full"
            bg="bgLightShade"
          >
            <Box boxSize="8px" rounded="full" bg={getPartyToken(party)} />
            <Text fontSize="xs" fontWeight="medium" color="text">
              {party} {count}
            </Text>
          </HStack>
        ))}
    </HStack>
  );
}

function MemberList({ voteType, votes }: { voteType: string; votes: Vote[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const sorted = [...votes].sort((a, b) =>
      (a.display_name || "").localeCompare(b.display_name || "")
    );
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (v) =>
        v.display_name?.toLowerCase().includes(q) ||
        v.state?.toLowerCase().includes(q) ||
        v.party?.toLowerCase().includes(q)
    );
  }, [votes, query]);

  const voteToken = getVoteToken(voteType);

  return (
    <Box
      bg="surface"
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      overflow="hidden"
    >
      <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Collapsible.Trigger asChild>
          <Flex
            as="button"
            w="full"
            px={5}
            py={4}
            align="center"
            justify="space-between"
            cursor="pointer"
            _hover={{ bg: "bgLightShade" }}
            transition="background 0.15s ease"
          >
            <HStack gap={3}>
              <Box boxSize="10px" rounded="full" bg={voteToken} />
              <Text fontWeight="semibold" color="text">
                {voteType}
              </Text>
              <Badge
                variant="subtle"
                rounded="full"
                px={2.5}
                bg="bgLightShade"
                color="textMuted"
              >
                {votes.length}
              </Badge>
            </HStack>
            <Box
              as="span"
              color="textMuted"
              transition="transform 0.2s ease"
              transform={open ? "rotate(180deg)" : undefined}
            >
              <ChevronDown size={18} />
            </Box>
          </Flex>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Box px={5} pb={5} pt={1}>
            <InputGroup
              startElement={<Search size={14} />}
              mb={3}
              maxW="320px"
            >
              <Input
                size="sm"
                rounded="lg"
                placeholder="Filter by name, state, or party"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                bg="bg"
                borderColor="border"
              />
            </InputGroup>
            {filtered.length === 0 ? (
              <Text fontSize="sm" color="textMuted" py={2}>
                No members match "{query}"
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={1.5}>
                {filtered.map((vote) => (
                  <Link
                    key={vote.member_id}
                    to={`/legislators/${vote.member_id}`}
                  >
                    <HStack
                      px={2.5}
                      py={1.5}
                      rounded="lg"
                      gap={2.5}
                      _hover={{ bg: "bgLightShade" }}
                      transition="background 0.15s ease"
                    >
                      <Box
                        boxSize="8px"
                        rounded="full"
                        flexShrink={0}
                        bg={getPartyToken(vote.party)}
                      />
                      <Text
                        fontSize="sm"
                        color="text"
                        fontWeight="medium"
                        lineClamp={1}
                      >
                        {vote.display_name}
                      </Text>
                      <Text fontSize="xs" color="textMuted" flexShrink={0}>
                        {vote.party}-{vote.state}
                      </Text>
                    </HStack>
                  </Link>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
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

      const processedRecords = (data.vote_records || []).map((record: any) => {
        const rawVotes = record.votes || {};
        const flattenedVotes: Vote[] = [];

        Object.entries(rawVotes).forEach(([voteType, legislators]) => {
          if (Array.isArray(legislators)) {
            flattenedVotes.push(
              ...legislators.map((leg: any) => ({
                member_id: leg.id,
                display_name: leg.display_name,
                party: leg.party,
                state: leg.state,
                vote_cast: voteType,
              }))
            );
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

  if (loading) {
    return (
      <Box bg="surface" p={8} rounded="card" borderWidth="1px" borderColor="border">
        <Center>
          <VStack gap={4}>
            <Spinner size="lg" color="primary" />
            <Text color="textMuted">Loading votes...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (error || voteRecords.length === 0) {
    return (
      <Box bg="surface" p={8} rounded="card" borderWidth="1px" borderColor="border">
        <Center>
          <Text color="textMuted" fontSize="md">
            {error
              ? "No voting data available for this bill"
              : "No passage votes recorded yet"}
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={6}>
      <Heading size="lg" color="text" letterSpacing="tight">
        Passage Vote Records
      </Heading>

      {voteRecords.map((record, recordIndex) => {
        const grouped: Record<string, Vote[]> = {};
        record.votes.forEach((v) => {
          (grouped[v.vote_cast] ||= []).push(v);
        });
        const voteCategories = Object.keys(grouped).sort((a, b) => {
          const rank = (t: string) =>
            isYea(t) ? 0 : isNay(t) ? 1 : t.toLowerCase().includes("not") ? 3 : 2;
          return rank(a) - rank(b) || a.localeCompare(b);
        });

        const chamberInfo = getChamberInfo(record.chamber);
        const passed =
          record.result &&
          (record.result.toLowerCase().includes("pass") ||
            record.result.toLowerCase().includes("agreed"));

        return (
          <Box
            key={recordIndex}
            bg="surface"
            rounded="card"
            borderWidth="1px"
            borderColor="border"
            boxShadow="card"
            overflow="hidden"
          >
            {/* Header */}
            <Flex
              px={{ base: 5, md: 7 }}
              py={5}
              borderBottomWidth="1px"
              borderColor="borderSubtle"
              align="center"
              justify="space-between"
              flexWrap="wrap"
              gap={3}
            >
              <HStack gap={3}>
                <Heading size="md" color="text" letterSpacing="tight">
                  {chamberInfo.label}
                </Heading>
                {record.result && (
                  <Badge
                    colorPalette={passed ? "green" : "red"}
                    variant="subtle"
                    rounded="full"
                    px={3}
                    py={0.5}
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    {record.result}
                  </Badge>
                )}
              </HStack>
              {record.vote_date && (
                <Text fontSize="sm" color="textMuted">
                  {new Date(record.vote_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              )}
            </Flex>

            <VStack align="stretch" gap={6} px={{ base: 5, md: 7 }} py={6}>
              {record.question && (
                <Text fontSize="sm" color="textMuted">
                  {record.question}
                </Text>
              )}

              <ResultBar votes={record.votes} />

              {/* Party breakdown */}
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                {voteCategories
                  .filter((t) => isYea(t) || isNay(t))
                  .map((voteType) => (
                    <HStack key={voteType} gap={3} align="center">
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={getVoteToken(voteType)}
                        textTransform="uppercase"
                        letterSpacing="wide"
                        minW="10"
                      >
                        {voteType}
                      </Text>
                      <PartyBreakdownRow
                        votes={record.votes}
                        voteType={voteType}
                      />
                    </HStack>
                  ))}
              </SimpleGrid>

              {/* Member lists */}
              <VStack align="stretch" gap={3}>
                {voteCategories.map((voteType) => (
                  <MemberList
                    key={voteType}
                    voteType={voteType}
                    votes={grouped[voteType]}
                  />
                ))}
              </VStack>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}
