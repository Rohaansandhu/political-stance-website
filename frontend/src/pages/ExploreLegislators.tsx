import { useState } from "react";
import {
  Container,
  SimpleGrid,
  Box,
  Text,
  Badge,
  Avatar,
  Flex,
  VStack,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LegislatorsHero } from "../components/Legislators/LegislatorsHero.tsx";
import LegislatorCarousel from "../components/Legislators/LegislatorCarousel.tsx";
import { Helmet } from "react-helmet-async";

interface Legislator {
  bioguide: string;
  lis?: string;
  name: { first: string; last: string; official_full: string };
  bio: { gender: string; birthday: string };
  terms: Array<{ type: "sen" | "rep"; state: string; party: string; district?: number }>;
  current: boolean;
}

export default function ExploreLegislators() {
  const [legislators, setLegislators] = useState<Legislator[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [chamberFilter, setChamberFilter] = useState("");
  const [partyFilter, setPartyFilter] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const fetchLegislators = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (stateFilter) params.append("state", stateFilter);
      if (chamberFilter) params.append("chamber", chamberFilter);
      if (partyFilter) params.append("party", partyFilter);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/legislators?${params}`
      );
      const data = await response.json();
      setLegislators(data.results);
    } catch (error) {
      console.error("Failed to fetch legislators:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTerm = (legislator: Legislator) =>
    legislator.terms[legislator.terms.length - 1];

  const getMemberId = (legislator: Legislator) => {
    const currentTerm = getCurrentTerm(legislator);
    return currentTerm.type === "sen" ? legislator.lis : legislator.bioguide;
  };

  const getPartyColor = (party: string) => {
    if (party === "Republican") return "red";
    if (party === "Democrat") return "blue";
    return "gray";
  };

  return (
    <Container maxW="7xl" py={8}>
      <Helmet>
        <title>{`Explore Legislators | US PoliTrack`}</title>
        <meta
          name="description"
          content={`Explore Legislators page for US PoliTrack. Search any legislator in the House or Senate.`}
        />
      </Helmet>

      {/* Hero with integrated filters */}
      <LegislatorsHero
        onSearch={fetchLegislators}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        chamberFilter={chamberFilter}
        setChamberFilter={setChamberFilter}
        partyFilter={partyFilter}
        setPartyFilter={setPartyFilter}
        resultCount={legislators.length}
        hasSearched={hasSearched}
      />

      {/* Results */}
      <Box mt={8}>
        {hasSearched && loading ? (
          <Center py={20}>
            <Spinner size="xl" color="primary" />
          </Center>
        ) : hasSearched && legislators.length === 0 ? (
          <Center py={20}>
            <Text color="text" fontSize="lg">No legislators found</Text>
          </Center>
        ) : legislators.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {legislators.map((leg) => {
              const currentTerm = getCurrentTerm(leg);
              const memberId = getMemberId(leg);
              const partyColor = getPartyColor(currentTerm.party);

              return (
                <Link key={memberId} to={`/legislators/${memberId}`}>
                  <Box
                    bg="bgLightShade"
                    p={4}
                    rounded="lg"
                    borderLeft="3px solid"
                    borderLeftColor={`${partyColor}.400`}
                    _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                    transition="all 0.2s"
                    cursor="pointer"
                  >
                    <Flex gap={3} align="center">
                      <Avatar.Root size="md" bg="primary" flexShrink={0}>
                        <Avatar.Fallback name={leg.name.official_full} />
                      </Avatar.Root>
                      <VStack align="flex-start" gap={1} minW={0}>
                        <Text fontWeight="700" color="primary" fontSize="sm" truncate>
                          {leg.name.official_full}
                        </Text>
                        <HStack gap={2} wrap="wrap">
                          <Badge colorScheme="blue" fontSize="2xs">{currentTerm.state}</Badge>
                          {currentTerm.district && (
                            <Badge colorScheme="green" fontSize="2xs">D{currentTerm.district}</Badge>
                          )}
                          <Badge colorScheme={partyColor} fontSize="2xs">
                            {currentTerm.type === "sen" ? "Senate" : "House"}
                          </Badge>
                          <Badge variant="outline" colorScheme={partyColor} fontSize="2xs">
                            {currentTerm.party}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Flex>
                  </Box>
                </Link>
              );
            })}
          </SimpleGrid>
        ) : (
          /* No search yet — show carousels */
          <LegislatorCarousel />
        )}
      </Box>
    </Container>
  );
}
