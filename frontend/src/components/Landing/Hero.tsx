import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero_capitol_image.avif";

export function Hero() {
  return (
    <Box as="section" position="relative" h={{ base: "620px", md: "760px" }} color="white" overflow="hidden">
      <Box
        as="img"
        src={heroImage}
        alt="United States Capitol building"
        position="absolute"
        inset={0}
        w="full"
        h="full"
        objectFit="cover"
        objectPosition="center 30%"
      />
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(180deg, rgba(8,12,10,.68) 0%, rgba(8,12,10,.4) 38%, rgba(8,12,10,.48) 68%, rgba(8,12,10,.82) 100%)"
      />

      <Container
        maxW="7xl"
        px={4}
        position="relative"
        h="full"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="0.16em"
          textTransform="uppercase"
          color="#3ddc97"
          mb={5}
          textShadow="0 2px 10px rgba(0,0,0,.5)"
        >
          Where votes meet ideology
        </Text>

        <Heading
          as="h1"
          fontFamily="'Fraunces', serif"
          fontWeight="400"
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
          lineHeight="1.08"
          mb={6}
          textShadow="0 4px 24px rgba(0,0,0,.45)"
          maxW="4xl"
        >
          Measure political stances
          <br />
          through votes
        </Heading>

        <Text
          fontSize={{ base: "md", md: "lg" }}
          opacity={0.92}
          maxW="2xl"
          mb={10}
          textShadow="0 2px 10px rgba(0,0,0,.4)"
        >
          Explore legislator voting patterns and ideological trends across
          major issues, powered by congressional data and AI-assisted
          analysis.
        </Text>

        <Flex wrap="wrap" align="center" justify="center" gap={4}>
          <Link to="/explore-legislators">
            <Button
              size="lg"
              px={8}
              bg="primaryHover"
              color="white"
              _dark={{ color: "black" }}
              rounded="sm"
              _hover={{ bg: "primary" }}
              transition="all 0.2s ease"
            >
              Explore Legislators
            </Button>
          </Link>
          <Link to="/bill-analyses">
            <Button
              size="lg"
              px={8}
              variant="outline"
              borderColor="whiteAlpha.700"
              bg="blackAlpha.300"
              color="white"
              rounded="sm"
              _hover={{ bg: "blackAlpha.500", borderColor: "white" }}
              transition="all 0.2s ease"
            >
              Find Bills
            </Button>
          </Link>
          <Link to="/congress-data">
            <Button
              size="lg"
              px={8}
              variant="outline"
              borderColor="whiteAlpha.700"
              bg="blackAlpha.300"
              color="white"
              rounded="sm"
              _hover={{ bg: "blackAlpha.500", borderColor: "white" }}
              transition="all 0.2s ease"
            >
              View Congress Data
            </Button>
          </Link>
        </Flex>
      </Container>
    </Box>
  );
}
