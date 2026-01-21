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
import { TrendingUp, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <Box as="section" bg="bg" py={{ base: 8, md: 12 }}>
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
            color="primary"
          >
            Measure Political Stances Through Votes
          </Heading>

          <Text
            fontSize="xl"
            color="text"
            opacity={0.8}
            mb={8}
            maxW="2xl"
            mx="auto"
          >
            Explore legislator voting patterns and ideological trends across
            major political issues using congressional voting data and
            AI-assisted analysis.
          </Text>

          <Text
            fontSize="xl"
            color="text"
            opacity={0.8}
            mb={8}
            maxW="2xl"
            mx="auto"
          >
           Scroll down to see how bills are analyzed and how ideology scores are calculated.
          </Text>

          <Flex wrap="wrap" align="center" justify="center" gap={4} mb={16}>
            <Link to="/explore-legislators">
              <Button
                size="lg"
                px={8}
                bg="accent"
                color="bg"
                _hover={{ bg: "secondary" }}
              >
                Explore Legislators
              </Button>
            </Link>
            <Link to="/congress-data">
              <Button
                size="lg"
                variant="outline"
                borderColor="accent"
                color="accent"
                _hover={{ bg: "accent", color: "bg" }}
              >
                View Congress Data
              </Button>
            </Link>
          </Flex>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={8}
            maxW="3xl"
            mx="auto"
          >
            {/* Legislators */}
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
                  <Icon as={Users} boxSize={6} color="text" />
                </Flex>
                <Heading as="h3" size="md" color="primary">
                  500+ Legislators
                </Heading>
                <Text color="text" opacity={0.8}>
                  Comprehensive profiles across all sessions
                </Text>
              </VStack>
            </GridItem>

            {/* Political Spectrums */}
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
                  Political Spectrums
                </Heading>
                <Text color="text" opacity={0.8}>
                  Detailed position tracking and rankings
                </Text>
              </VStack>
            </GridItem>

            {/* Congress Analytics */}
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
                  Congress Analytics
                </Heading>
                <Text color="text" opacity={0.8}>
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
