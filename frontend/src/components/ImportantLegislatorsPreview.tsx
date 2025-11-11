import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
  Progress,
  Separator,
  Container,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react/avatar";

// ---------------- SAMPLE DATA ----------------

const senateLeadership = [
  {
    title: "Senate Majority Leader",
    name: "Chuck Schumer",
    party: "Democrat",
    state: "NY",
    initials: "CS",
  },
  {
    title: "Senate Minority Leader",
    name: "Mitch McConnell",
    party: "Republican",
    state: "KY",
    initials: "MM",
  },
];

const houseLeadership = [
  {
    title: "Speaker of the House",
    name: "Mike Johnson",
    party: "Republican",
    state: "LA",
    initials: "MJ",
  },
  {
    title: "House Minority Leader",
    name: "Hakeem Jeffries",
    party: "Democrat",
    state: "NY",
    initials: "HJ",
  },
];

const popularSenators = [
  {
    name: "Lisa Murkowski",
    party: "Republican",
    state: "AK",
    initials: "LM",
    liberalScore: 48,
    conservativeScore: 52,
  },
  {
    name: "Bernie Sanders",
    party: "Independent",
    state: "VT",
    initials: "BS",
    liberalScore: 95,
    conservativeScore: 5,
  },
  {
    name: "Cory Booker",
    party: "Democrat",
    state: "NJ",
    initials: "CB",
    liberalScore: 88,
    conservativeScore: 12,
  },
];

const popularRepresentatives = [
  {
    name: "Alexandria Ocasio-Cortez",
    party: "Democrat",
    state: "NY",
    district: "14th",
    initials: "AOC",
    liberalScore: 92,
    conservativeScore: 8,
  },
  {
    name: "Dan Crenshaw",
    party: "Republican",
    state: "TX",
    district: "2nd",
    initials: "DC",
    liberalScore: 15,
    conservativeScore: 85,
  },
  {
    name: "Katie Porter",
    party: "Democrat",
    state: "CA",
    district: "47th",
    initials: "KP",
    liberalScore: 78,
    conservativeScore: 22,
  },
];

// ---------------- UI CARD COMPONENT ----------------

function LegislatorCard({ person: person }: { person: any }) {
  return (
    <Card.Root
      variant="outline"
      _hover={{ shadow: "md", cursor: "pointer" }}
    >
      <CardBody>
        <HStack align="flex-start" mb={4} gap={4}>
          <Avatar.Root>{person.initials}</Avatar.Root>

          <Box flex="1">
            <Heading as="h3" size="md">
              {person.name}
            </Heading>

            <Text color="gray.500">
              {person.state}
              {person.district ? ` - ${person.district}` : ""}
            </Text>
          </Box>

          <Badge
            colorScheme={
              person.party === "Democrat"
                ? "blue"
                : person.party === "Republican"
                ? "red"
                : "purple"
            }
          >
            {person.party.charAt(0)}
          </Badge>
        </HStack>

        {/* Political Spectrum */}
        {person.liberalScore !== undefined && (
          <VStack align="stretch" gap={3}>
            <Box>
              <Text fontSize="sm" mb={2}>
                Political Spectrum
              </Text>

              {/* Liberal */}
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs" color="gray.500">Liberal</Text>
                  <Text fontSize="xs">{person.liberalScore}%</Text>
                </HStack>
                <Progress.Root
                  value={person.liberalScore}
                  height="6px"
                  colorScheme="blue"
                  borderRadius="md"
                />
              </Box>

              {/* Conservative */}
              <Box>
                <HStack justify="space-between" mb={1} mt={2}>
                  <Text fontSize="xs" color="gray.500">Conservative</Text>
                  <Text fontSize="xs">{person.conservativeScore}%</Text>
                </HStack>
                <Progress.Root
                  value={person.conservativeScore}
                  height="6px"
                  colorScheme="red"
                  borderRadius="md"
                />
              </Box>
            </Box>
          </VStack>
        )}
      </CardBody>
    </Card.Root>
  );
}

// ---------------- MAIN SECTION ----------------

export function ImportantLegislatorsPreview() {
  return (
    <Box py={20} bg="bgLightTint">
      <Container maxW="7xl">
        <VStack textAlign="center" gap={4} mb={12}>
          <Heading fontSize={{ base: "3xl", md: "4xl" }}>
            Popular Legislators
          </Heading>
          <Text color="gray.600" maxW="2xl" mx="auto">
            Explore top congressional figures, leadership roles, and popular members from both chambers.
          </Text>
        </VStack>

        {/* ---------------- SENATE ---------------- */}
        <Box mb={16}>
          <Heading size="lg" mb={4}>Senate</Heading>

          <Text fontWeight="bold" mb={3}>Leadership</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={10}>
            {senateLeadership.map((p, idx) => (
              <LegislatorCard key={idx} person={p} />
            ))}
          </SimpleGrid>

          <Text fontWeight="bold" mb={3}>Popular Senators</Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {popularSenators.map((p, idx) => (
              <LegislatorCard key={idx} person={p} />
            ))}
          </SimpleGrid>
        </Box>

        <Separator my={12} />

        {/* ---------------- HOUSE ---------------- */}
        <Box mb={16}>
          <Heading size="lg" mb={4}>House of Representatives</Heading>

          <Text fontWeight="bold" mb={3}>Leadership</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={10}>
            {houseLeadership.map((p, idx) => (
              <LegislatorCard key={idx} person={p} />
            ))}
          </SimpleGrid>

          <Text fontWeight="bold" mb={3}>Popular Representatives</Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {popularRepresentatives.map((p, idx) => (
              <LegislatorCard key={idx} person={p} />
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}
