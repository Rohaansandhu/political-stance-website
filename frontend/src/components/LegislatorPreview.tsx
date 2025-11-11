import {
  Box,
  Badge,
  Heading,
  Text,
  SimpleGrid,
  Progress,
  VStack,
  HStack,
  Separator,
  Card,
  CardBody,
  Stack,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react/avatar";

const sampleLegislators = [
  {
    name: "Sarah Mitchell",
    party: "Democrat",
    state: "CA",
    district: "12th District",
    initials: "SM",
    liberalScore: 85,
    conservativeScore: 15,
    rank: 42,
    totalRanked: 435,
  },
  {
    name: "James Reynolds",
    party: "Republican",
    state: "TX",
    district: "5th District",
    initials: "JR",
    liberalScore: 22,
    conservativeScore: 78,
    rank: 312,
    totalRanked: 435,
  },
  {
    name: "Maria Gonzalez",
    party: "Democrat",
    state: "NY",
    district: "15th District",
    initials: "MG",
    liberalScore: 72,
    conservativeScore: 28,
    rank: 98,
    totalRanked: 435,
  },
];

export function LegislatorPreview() {
  return (
    <Box id="legislators" py={20} bg="gray.50">
      <Box maxW="6xl" mx="auto" px={4}>
        <VStack spaceX={4} mb={12} textAlign="center">
          <Heading mb={4} fontSize={{ base: "3xl", md: "4xl" }}>
            Legislator Profiles
          </Heading>
          <Text color="gray.600" maxW="2xl" mx="auto"
            fontSize={{ base: "md", md: "lg" }}>
            Each legislator profile includes detailed political spectrum analysis,
            voting history rankings, and comparative data across congressional
            sessions.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spaceX={6}>
          {sampleLegislators.map((legislator, index) => (
            <Card.Root
              key={index}
              variant="outline"
              _hover={{ shadow: "md", cursor: "pointer" }}
            >
              <CardBody>
                <HStack align="flex-start" mb={4} spaceX={4}>
                  <Avatar.Root>
                    {legislator.initials}
                  </Avatar.Root>
                  <Box flex="1" minW={0}>
                    <Heading as="h3" size="md">
                      {legislator.name}
                    </Heading>
                    <Text color="gray.500">
                      {legislator.state} - {legislator.district}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme={
                      legislator.party === "Democrat" ? "blue" : "red"
                    }
                  >
                    {legislator.party.charAt(0)}
                  </Badge>
                </HStack>

                <Stack spaceX={3}>
                  <Box>
                    <Text fontSize="sm" mb={2}>
                      Political Spectrum
                    </Text>

                    {/* Liberal */}
                    <Box>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">
                          Liberal
                        </Text>
                        <Text fontSize="xs">{legislator.liberalScore}%</Text>
                      </HStack>
                      <Progress.Root
                        value={legislator.liberalScore}
                        height="6px"
                        colorScheme="blue"
                        borderRadius="md"
                      />
                    </Box>

                    {/* Conservative */}
                    <Box>
                      <HStack justify="space-between" mb={1} mt={2}>
                        <Text fontSize="xs" color="gray.500">
                          Conservative
                        </Text>
                        <Text fontSize="xs">{legislator.conservativeScore}%</Text>
                      </HStack>
                      <Progress.Root
                        value={legislator.conservativeScore}
                        height="6px"
                        colorScheme="red"
                        borderRadius="md"
                      />
                    </Box>
                  </Box>

                  <Separator />

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">
                      Ranking
                    </Text>
                    <Text color="blue.500" fontWeight="semibold">
                      #{legislator.rank}{" "}
                      <Text as="span" color="gray.400" fontSize="xs">
                        of {legislator.totalRanked}
                      </Text>
                    </Text>
                  </HStack>
                </Stack>
              </CardBody>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
