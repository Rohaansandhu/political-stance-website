import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  Flex,
  Container,
  HStack,
  Select,
  createListCollection,
} from "@chakra-ui/react";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

interface LegislatorsHeroProps {
  onSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stateFilter: string;
  setStateFilter: (s: string) => void;
  chamberFilter: string;
  setChamberFilter: (s: string) => void;
  partyFilter: string;
  setPartyFilter: (s: string) => void;
  resultCount?: number;
  hasSearched?: boolean;
}

export function LegislatorsHero({
  onSearch,
  searchQuery,
  setSearchQuery,
  stateFilter,
  setStateFilter,
  chamberFilter,
  setChamberFilter,
  partyFilter,
  setPartyFilter,
  resultCount,
  hasSearched,
}: LegislatorsHeroProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <Box
      py={14}
      px={8}
      borderRadius="2xl"
      textAlign="center"
      bgGradient="linear(to-br, teal.100, blue.100)"
      border="1px solid"
      borderColor="teal.200"
      position="relative"
    >
      {/* Decorative blobs */}
      <Box
        position="absolute"
        inset="0"
        overflow="hidden"
        borderRadius="2xl"
        pointerEvents="none"
      >
        <Box
          position="absolute"
          top="-60px"
          left="-60px"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="teal.100"
          opacity={0.4}
          filter="blur(40px)"
        />
        <Box
          position="absolute"
          bottom="-40px"
          right="-40px"
          w="180px"
          h="180px"
          borderRadius="full"
          bg="blue.100"
          opacity={0.4}
          filter="blur(40px)"
        />
      </Box>

      <Container maxW="3xl" position="relative">
        <Heading size="3xl" mb={3} color="primary" letterSpacing="-0.02em">
          Explore U.S. Legislators
        </Heading>
        <Text fontSize="md" color="gray.500" mb={8}>
          Search and discover detailed political profiles for every member of
          Congress.
        </Text>

        {/* Search bar */}
        <Flex maxW="560px" mx="auto" gap={2} mb={6}>
          <Input
            placeholder="Search by name..."
            bg="white"
            borderColor="gray.200"
            shadow="sm"
            _focusVisible={{ outline: "2px solid", outlineColor: "teal.400" }}
            size="lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            flex={1}
          />
          <Button
            size="lg"
            colorScheme="teal"
            px={7}
            onClick={onSearch}
            flexShrink={0}
          >
            Search
          </Button>
        </Flex>

        {/* Filters inline */}
        <HStack gap={3} justify="center" wrap="wrap">
          <Select.Root
            collection={createListCollection({
              items: [
                { label: "All States", value: "" },
                ...US_STATES.map((s) => ({ label: s, value: s })),
              ],
            })}
            value={stateFilter ? [stateFilter] : [""]}
            onValueChange={(d) => setStateFilter(d.value[0] || "")}
            w="140px"
            position="relative"
          >
            <Select.Trigger bg="white" shadow="sm">
              <Select.ValueText placeholder="All States" />
            </Select.Trigger>
            <Select.Content
              position="absolute"
              top="100%"
              zIndex={10}
              w="full"
              mt={1}
              bg="white"
              shadow="md"
              borderRadius="md"
              maxH="200px"
              overflowY="auto"
            >
              <Select.Item item="">
                <Select.ItemText>All States</Select.ItemText>
              </Select.Item>
              {US_STATES.map((s) => (
                <Select.Item key={s} item={s}>
                  <Select.ItemText>{s}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Select.Root
            collection={createListCollection({
              items: [
                { label: "All Chambers", value: "" },
                { label: "Senate", value: "sen" },
                { label: "House", value: "rep" },
              ],
            })}
            value={chamberFilter ? [chamberFilter] : [""]}
            onValueChange={(d) => setChamberFilter(d.value[0] || "")}
            w="150px"
            position="relative"
          >
            <Select.Trigger bg="white" shadow="sm">
              <Select.ValueText placeholder="All Chambers" />
            </Select.Trigger>
            <Select.Content
              position="absolute"
              top="100%"
              zIndex={10}
              w="full"
              mt={1}
              bg="white"
              shadow="md"
              borderRadius="md"
            >
              <Select.Item item="">
                <Select.ItemText>All Chambers</Select.ItemText>
              </Select.Item>
              <Select.Item item="sen">
                <Select.ItemText>Senate</Select.ItemText>
              </Select.Item>
              <Select.Item item="rep">
                <Select.ItemText>House</Select.ItemText>
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root
            collection={createListCollection({
              items: [
                { label: "All Parties", value: "" },
                { label: "Democrat", value: "Democrat" },
                { label: "Republican", value: "Republican" },
                { label: "Independent", value: "Independent" },
              ],
            })}
            value={partyFilter ? [partyFilter] : [""]}
            onValueChange={(d) => setPartyFilter(d.value[0] || "")}
            w="150px"
            position="relative"
          >
            <Select.Trigger bg="white" shadow="sm">
              <Select.ValueText placeholder="All Parties" />
            </Select.Trigger>
            <Select.Content
              position="absolute"
              top="100%"
              zIndex={10}
              w="full"
              mt={1}
              bg="white"
              shadow="md"
              borderRadius="md"
            >
              <Select.Item item="">
                <Select.ItemText>All Parties</Select.ItemText>
              </Select.Item>
              <Select.Item item="Democrat">
                <Select.ItemText>Democrat</Select.ItemText>
              </Select.Item>
              <Select.Item item="Republican">
                <Select.ItemText>Republican</Select.ItemText>
              </Select.Item>
              <Select.Item item="Independent">
                <Select.ItemText>Independent</Select.ItemText>
              </Select.Item>
            </Select.Content>
          </Select.Root>

          {hasSearched && resultCount !== undefined && (
            <Text fontSize="sm" color="gray.500" alignSelf="center">
              {resultCount} legislator{resultCount !== 1 ? "s" : ""} found
            </Text>
          )}
        </HStack>
      </Container>
    </Box>
  );
}
