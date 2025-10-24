import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "./ui/color-mode";
import { TrendingUp, Users, BarChart3 } from "lucide-react";

export function Hero() {
  const bgGradient = useColorModeValue(
    "linear(to-b, gray.50, white)",
    "linear(to-b, gray.800, gray.900)"
  );
  const title = useColorModeValue("teal.700", "teal.100");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const iconPrimary = useColorModeValue("blue.500", "blue.300");
  const iconAccent = useColorModeValue("purple.500", "purple.300");

  return (
    <Box as="section" bgGradient={bgGradient} py={{ base: 16, md: 20 }}>
      <Container maxW="6xl" px={4}>
        <Box maxW="4xl" mx="auto" textAlign="center">
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "6xl" }}
            mb={6}
            fontWeight="bold"
            lineHeight="short"
            maxW="3xl"
            mx="auto"
            color={title}
          >
            Track Political Stances with Precision
          </Heading>

          <Text
            fontSize="xl"
            color={textMuted}
            mb={8}
            maxW="2xl"
            mx="auto"
          >
            Analyze legislator voting patterns, policy positions, and political
            spectrums across every session of Congress with comprehensive data
            visualization.
          </Text>

          <Flex
            wrap="wrap"
            align="center"
            justify="center"
            gap={4}
            mb={16}
          >
            <Button size="lg" px={8} colorScheme="blue">
              Explore Legislators
            </Button>
            <Button size="lg" variant="outline" colorScheme="blue">
              View Congress Data
            </Button>
          </Flex>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={8}
            maxW="3xl"
            mx="auto"
          >
            {/* Legislators */}
            <GridItem>
              <VStack spaceX={3}>
                <Flex
                  w={12}
                  h={12}
                  rounded="full"
                  bg={useColorModeValue("blue.50", "blue.900")}
                  align="center"
                  justify="center"
                >
                  <Icon as={Users} boxSize={6} color={iconPrimary} />
                </Flex>
                <Heading as="h3" size="md">
                  500+ Legislators
                </Heading>
                <Text color={textMuted}>
                  Comprehensive profiles across all sessions
                </Text>
              </VStack>
            </GridItem>

            {/* Political Spectrums */}
            <GridItem>
              <VStack spaceX={3}>
                <Flex
                  w={12}
                  h={12}
                  rounded="full"
                  bg={useColorModeValue("purple.50", "purple.900")}
                  align="center"
                  justify="center"
                >
                  <Icon as={TrendingUp} boxSize={6} color={iconAccent} />
                </Flex>
                <Heading as="h3" size="md">
                  Political Spectrums
                </Heading>
                <Text color={textMuted}>
                  Detailed position tracking and rankings
                </Text>
              </VStack>
            </GridItem>

            {/* Congress Analytics */}
            <GridItem>
              <VStack spaceX={3}>
                <Flex
                  w={12}
                  h={12}
                  rounded="full"
                  bg={useColorModeValue("green.50", "green.900")}
                  align="center"
                  justify="center"
                >
                  <Icon as={BarChart3} boxSize={6} color={iconPrimary} />
                </Flex>
                <Heading as="h3" size="md">
                  Congress Analytics
                </Heading>
                <Text color={textMuted}>
                  Visual data per congressional session
                </Text>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
