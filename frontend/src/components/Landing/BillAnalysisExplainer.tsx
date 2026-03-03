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
import { Brain, Tag, BarChart3 } from "lucide-react";

export function BillAnalysisExplainer() {
  return (
    <Box as="section" bg="bgAltGray" py={{ base: 12, md: 16 }}>
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
            mb={12}
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

          <Text color="text" opacity={0.8} textAlign="center">
            Find more complete analyses under the <strong>Bill Analyses</strong>{" "}
            tab.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
