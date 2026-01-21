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
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Brain, Tag, BarChart3 } from "lucide-react";

export function BillAnalysisExplainer() {
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
              How We Analyze Each Bill
            </Heading>

            <Text fontSize="lg" color="text" opacity={0.9} maxW="3xl" mx="auto">
              Large language models are used to analyze each bill, identify
              relevant political categories, and estimate the partisan leaning
              and impact of each category within the bill.
            </Text>
          </VStack>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={8}
            maxW="3xl"
            mx="auto"
          >
            {/* AI Analysis */}
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
                  <Icon as={Brain} boxSize={6} color="text" />
                </Flex>
                <Heading as="h3" size="md" color="primary">
                  AI-Powered Analysis
                </Heading>
                <Text color="text" opacity={0.8} textAlign="center">
                  Advanced language models read and interpret legislative text
                </Text>
              </VStack>
            </GridItem>

            {/* Category Identification */}
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
                  <Icon as={Tag} boxSize={6} color="text" />
                </Flex>
                <Heading as="h3" size="md" color="primary">
                  Category Identification
                </Heading>
                <Text color="text" opacity={0.8} textAlign="center">
                  Automatically tags bills with relevant political topics
                </Text>
              </VStack>
            </GridItem>

            {/* Partisan Impact */}
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
                  <Icon as={BarChart3} boxSize={6} color="text" />
                </Flex>
                <Heading as="h3" size="md" color="primary">
                  Partisan Impact
                </Heading>
                <Text color="text" opacity={0.8} textAlign="center">
                  Estimates the ideological direction and significance of each
                  bill
                </Text>
              </VStack>
            </GridItem>
          </Grid>

          {/* Example Bill Card */}
          <Box mt={16}>
            <Heading
              as="h3"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color="primary"
              textAlign="center"
              mb={8}
            >
              Example Analysis
            </Heading>

            <Box maxW="2xl" mx="auto" mb={8}>
              <Box
                bg="bgLightShade"
                p={6}
                rounded="lg"
                borderTop="4px solid"
                borderColor="blue.500"
                shadow="md"
              >
                <VStack align="stretch" gap={3}>
                  {/* Header */}
                  <HStack justify="space-between" align="flex-start">
                    <VStack align="flex-start" gap={1} flex={1}>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="primary"
                        lineHeight="1.2"
                      >
                        HR 1234
                      </Text>
                      <HStack gap={2}>
                        <Badge colorScheme="purple" fontSize="xs">
                          FEATURED
                        </Badge>
                        <Badge colorScheme="blue" fontSize="xs">
                          HOUSE
                        </Badge>
                      </HStack>
                    </VStack>
                  </HStack>

                  {/* Title */}
                  <Text fontSize="md" color="text" lineHeight="1.4">
                    Clean Energy Investment and Jobs Act
                  </Text>

                  {/* Ideology Indicator */}
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="xs" color="text" fontWeight="medium">
                        Liberal
                      </Text>
                      <Text fontSize="xs" color="text">
                        -0.65
                      </Text>
                    </HStack>

                    <Box
                      position="relative"
                      h="6px"
                      bg="gray.200"
                      rounded="full"
                    >
                      {/* Center line */}
                      <Box
                        position="absolute"
                        left="50%"
                        top="0"
                        bottom="0"
                        w="2px"
                        bg="gray.400"
                        transform="translateX(-50%)"
                      />

                      {/* Score dot */}
                      <Box
                        position="absolute"
                        left="17.5%"
                        top="50%"
                        transform="translate(-50%, -50%)"
                        w="12px"
                        h="12px"
                        bg="blue.500"
                        rounded="full"
                        border="2px solid white"
                        shadow="sm"
                      />
                    </Box>
                  </Box>

                  {/* Category Badges */}
                  <HStack gap={2} flexWrap="wrap" minH="24px">
                    <Badge size="sm" variant="subtle" fontSize="xs">
                      Climate Change
                    </Badge>
                    <Badge size="sm" variant="subtle" fontSize="xs">
                      Energy Policy
                    </Badge>
                  </HStack>

                  {/* Footer */}
                  <HStack
                    justify="space-between"
                    pt={2}
                    borderTop="1px solid"
                    borderColor="gray.200"
                  >
                    <Text fontSize="xs" color="text">
                      118th Congress
                    </Text>
                    <Text fontSize="xs" color="text" fontWeight="medium">
                      claude-sonnet-4
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          </Box>
        </Box>
        <Text color="text" opacity={0.8} textAlign="center">
          Find more analyses under the Bill Analyses tab
        </Text>
      </Container>
    </Box>
  );
}
