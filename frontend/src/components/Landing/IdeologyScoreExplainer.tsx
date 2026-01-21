import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  VStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { TrendingUp, Scale, Vote } from "lucide-react";

export function IdeologyScoreExplainer() {
  return (
    <Box as="section" bg="bg" py={{ base: 12, md: 16 }}>
      <Container maxW="6xl" px={4}>
        <Box maxW="4xl" mx="auto">
          <VStack spaceY={6} mb={12} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color="primary"
            >
              How We Score Each Legislator
            </Heading>

            <Text fontSize="lg" color="text" opacity={0.9} maxW="3xl" mx="auto">
              Ideology Score shows where a legislator falls on the political
              spectrum for a specific issue based on how they actually vote.
              Each score reflects the direction, importance, and partisan nature
              of the bills they supported or opposed.
            </Text>

            <Box position="relative" w="full" mt={4}>
              <Flex align="center" justify="center" gap={3} flexWrap="wrap">
                <Grid
                  templateColumns="1fr auto 1fr"
                  alignItems="center"
                  mt={4}
                  gap={3}
                >
                  <Box textAlign="right">
                    <Box
                      display="inline-block"
                      px={6}
                      py={2}
                      rounded="full"
                      bg="blue.500"
                      color="white"
                      fontWeight="semibold"
                    >
                      -1 Liberal
                    </Box>
                  </Box>

                  <Box
                    px={4}
                    py={2}
                    color="text"
                    opacity={0.6}
                    fontWeight="medium"
                    whiteSpace="nowrap"
                  >
                    ←→
                  </Box>

                  <Box textAlign="left">
                    <Box
                      display="inline-block"
                      px={6}
                      py={2}
                      rounded="full"
                      bg="red.500"
                      color="white"
                      fontWeight="semibold"
                    >
                      +1 Conservative
                    </Box>
                  </Box>
                </Grid>
              </Flex>
            </Box>
          </VStack>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={8}
            maxW="3xl"
            mx="auto"
          >
            {/* Voting Behavior */}
            <GridItem>
              <VStack spaceY={3}>
                <Flex
                  w={12}
                  h={12}
                  rounded="full"
                  bg="secondary"
                  align="center"
                  justify="center"
                >
                  <Icon as={Vote} boxSize={6} color="text" />
                </Flex>
                <Heading as="h3" size="md" color="primary">
                  Roll-Call Votes
                </Heading>
                <Text color="text" opacity={0.8} textAlign="center">
                  Calculated directly from actual voting records on legislation
                </Text>
              </VStack>
            </GridItem>

            {/* Bill Importance */}
            <GridItem>
              <VStack spaceY={3}>
                <Flex
                  w={12}
                  h={12}
                  rounded="full"
                  bg="secondary"
                  align="center"
                  justify="center"
                >
                  <Icon as={Scale} boxSize={6} color="text" />
                </Flex>
                <Heading as="h3" size="md" color="primary">
                  Weighted Analysis
                </Heading>
                <Text color="text" opacity={0.8} textAlign="center">
                  Accounts for bill importance and partisan significance
                </Text>
              </VStack>
            </GridItem>

            {/* Issue-Specific */}
            <GridItem>
              <VStack spaceY={3}>
                <Flex
                  w={12}
                  h={12}
                  rounded="full"
                  bg="secondary"
                  align="center"
                  justify="center"
                >
                  <Icon as={TrendingUp} boxSize={6} color="text" />
                </Flex>
                <Heading as="h3" size="md" color="primary">
                  Issue-Specific
                </Heading>
                <Text color="text" opacity={0.8} textAlign="center">
                  Separate scores for different political categories and topics
                </Text>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
