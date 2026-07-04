import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  // Icon,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
// import { TrendingUp, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <Box as="section" bg="bg" py={{ base: 12, md: 20 }}>
      <Container maxW="7xl" px={4}>
        {/* Top Section: Two-Column Split */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }}
          gap={{ base: 12, lg: 16 }}
          alignItems="center"
          mb={16}
        >
          {/* Left Column: Messaging & CTA */}
          <GridItem>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              mb={6}
              fontWeight="extrabold"
              lineHeight="1.2"
              color="text"
            >
              Measure <br />
              <Text as="span" color="primary">
                Political Stances
              </Text>{" "}
              <br />
              Through Votes
            </Heading>

            <Text fontSize="xl" color="text" opacity={0.8} mb={8} maxW="xl">
              Explore legislator voting patterns and ideological trends across
              major political issues using congressional voting data and
              AI-assisted analysis.
            </Text>

            <Flex wrap="wrap" align="center" gap={4}>
              <Link to="/explore-legislators">
                <Button
                  size="lg"
                  px={8}
                  bg="primary"
                  color="bg"
                  rounded="xl"
                  _hover={{ bg: "primaryHover", transform: "translateY(-2px)" }}
                  transition="all 0.2s ease"
                >
                  Explore Legislators
                </Button>
              </Link>
              <Link to="/bill-analyses">
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="border"
                  color="text"
                  rounded="xl"
                  _hover={{
                    borderColor: "primary",
                    color: "primary",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s ease"
                >
                  Find Bills
                </Button>
              </Link>
              <Link to="/congress-data">
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="border"
                  color="text"
                  rounded="xl"
                  _hover={{
                    borderColor: "primary",
                    color: "primary",
                    transform: "translateY(-2px)",
                  }}
                >
                  View Congress Data
                </Button>
              </Link>
            </Flex>
          </GridItem>

          {/* Right Column: Visual Anchor (Analysis Card) */}
          <GridItem display={{ base: "none", md: "block" }}>
            <Box
              bg="surface"
              p={8}
              rounded="2xl"
              borderWidth="1px"
              borderColor="border"
              borderTopWidth="3px"
              borderTopColor="partyDem"
              shadow="cardHover"
              position="relative"
            >
              <VStack align="stretch" gap={4}>
                {/* Header */}
                <HStack justify="space-between" align="flex-start">
                  <VStack align="flex-start" gap={1} flex={1}>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="primary"
                      lineHeight="1.2"
                    >
                      HR 1234
                    </Text>
                    <HStack gap={2}>
                      <Badge
                        colorPalette="purple" variant="subtle"
                        fontSize="xs"
                        px={2}
                        py={0.5}
                        rounded="md"
                      >
                        FEATURED
                      </Badge>
                      <Badge
                        colorPalette="blue" variant="subtle"
                        fontSize="xs"
                        px={2}
                        py={0.5}
                        rounded="md"
                      >
                        HOUSE
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>

                {/* Title */}
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  color="text"
                  lineHeight="1.4"
                >
                  Clean Energy Investment and Jobs Act
                </Text>

                {/* Ideology Indicator */}
                <Box mt={2}>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="text" fontWeight="medium">
                      Liberal
                    </Text>
                    <Text fontSize="sm" color="text" fontWeight="bold">
                      -0.65
                    </Text>
                  </HStack>

                  <Box position="relative" h="8px" bg="bgLightShade" rounded="full">
                    {/* Center line */}
                    <Box
                      position="absolute"
                      left="50%"
                      top="0"
                      bottom="0"
                      w="2px"
                      bg="border"
                      transform="translateX(-50%)"
                    />
                    {/* Score dot */}
                    <Box
                      position="absolute"
                      left="17.5%"
                      top="50%"
                      transform="translate(-50%, -50%)"
                      w="16px"
                      h="16px"
                      bg="partyDem"
                      rounded="full"
                      borderWidth="3px"
                      borderColor="surface"
                      shadow="md"
                    />
                  </Box>
                </Box>

                {/* Category Badges */}
                <HStack gap={2} flexWrap="wrap" mt={2}>
                  <Badge size="md" variant="subtle" colorPalette="green" rounded="full">
                    Climate Change
                  </Badge>
                  <Badge size="md" variant="subtle" colorPalette="teal" rounded="full">
                    Energy Policy
                  </Badge>
                </HStack>

                {/* Footer */}
                <HStack
                  justify="space-between"
                  pt={4}
                  borderTopWidth="1px"
                  borderColor="borderSubtle"
                  mt={2}
                >
                  <Text fontSize="xs" color="text" opacity={0.7}>
                    118th Congress
                  </Text>
                  <Text
                    fontSize="xs"
                    color="text"
                    opacity={0.7}
                    fontWeight="medium"
                  >
                    gpt-5-mini
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
