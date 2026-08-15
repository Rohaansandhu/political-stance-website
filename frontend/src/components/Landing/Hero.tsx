import { Box, Button, Container, Grid, Heading, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import heroImage from "../../assets/hero_capitol_image.avif";
import { MotionBox } from "../motion/MotionBox";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Box as="section" bg="bg" color="text" overflow="hidden">
      <Container maxW="7xl" px={4} py={{ base: 12, md: 0 }}>
        <MotionBox
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Grid
            templateColumns={{ base: "1fr", md: "1.02fr 0.98fr" }}
            alignItems="center"
            gap={{ base: 10, md: 11 }}
            minH={{ md: "600px" }}
          >
            <Box>
              <Heading
                as="h1"
                fontFamily="'Fraunces', serif"
                fontWeight="400"
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                lineHeight="1.06"
                letterSpacing="-0.015em"
                mb={5}
              >
                Measure political stances
                <br />
                <Text as="span" color="primary">
                  through votes
                </Text>
              </Heading>

              <Text fontSize={{ base: "md", md: "lg" }} color="textMuted" maxW="420px" mb={7}>
                Explore legislator voting patterns and ideological trends
                across major issues, powered by congressional data and
                AI-assisted analysis.
              </Text>

              <Box display="flex" flexWrap="wrap" gap={3}>
                <Link to="/explore-legislators">
                  <Button
                    size="lg"
                    px={7}
                    bg="primary"
                    color="white"
                    rounded="md"
                    _hover={{ bg: "primaryHover" }}
                    transition="all 0.2s ease"
                  >
                    Explore Legislators
                  </Button>
                </Link>
                <Link to="/bill-analyses">
                  <Button
                    size="lg"
                    px={7}
                    variant="outline"
                    borderColor="border"
                    bg="surface"
                    color="text"
                    rounded="md"
                    _hover={{ bg: "bgAltGray" }}
                    transition="all 0.2s ease"
                  >
                    Find Bills
                  </Button>
                </Link>
                <Link to="/congress-data">
                  <Button
                    size="lg"
                    px={7}
                    variant="outline"
                    borderColor="border"
                    bg="surface"
                    color="text"
                    rounded="md"
                    _hover={{ bg: "bgAltGray" }}
                    transition="all 0.2s ease"
                  >
                    View Congress Data
                  </Button>
                </Link>
              </Box>

              <Box mt={8} pt={5} borderTop="1px solid" borderColor="borderSubtle" display="flex" gap={10}>
                <Box>
                  <Text fontSize="2xl" fontWeight="600" letterSpacing="-0.02em">
                    535
                  </Text>
                  <Text fontSize="sm" color="textMuted" mt={0.5}>
                    legislators
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="2xl" fontWeight="600" letterSpacing="-0.02em">
                    10,000+
                  </Text>
                  <Text fontSize="sm" color="textMuted" mt={0.5}>
                    roll-call votes analyzed
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box
              position="relative"
              h={{ base: "280px", md: "556px" }}
              m={{ base: 0, md: "22px 0px 22px 0" }}
              rounded="lg"
              overflow="hidden"
            >
              <Image
                src={heroImage}
                alt="United States Capitol building"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                h="full"
                w="auto"
                maxW="none"
                objectFit="cover"
              />
            </Box>
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
}
