import { Box, Grid, GridItem, Heading, Image, Text, VStack } from "@chakra-ui/react";
import legislatorScoreImage from "../../assets/how_we_score_legislator.avif";
import { Reveal } from "../motion/Reveal";

const steps = [
  {
    number: "01",
    title: "Roll-Call Votes",
    description: "Calculated directly from actual voting records on legislation",
  },
  {
    number: "02",
    title: "Weighted Analysis",
    description: "Accounts for bill importance and partisan significance",
  },
  {
    number: "03",
    title: "Issue-Specific",
    description:
      "Separate scores for different political categories and topics",
  },
];

export function IdeologyScoreExplainer() {
  return (
    <Box as="section" bg="bgAltGreen" overflow="hidden">
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} minH={{ lg: "680px" }}>
        <GridItem
          order={{ base: 2, lg: 1 }}
          position="relative"
          overflow="hidden"
          minH={{ base: "320px", lg: "auto" }}
        >
          <Reveal direction="left" delay={0.15} distance={30} duration={0.65} position="relative" h="full" w="full">
            <Image
              src={legislatorScoreImage}
              alt="United States Capitol building"
              position="absolute"
              inset={0}
              w="full"
              h="full"
              objectFit="cover"
              objectPosition="center 25%"
            />
            <Box
              position="absolute"
              inset={0}
              display={{ base: "none", lg: "block" }}
              bg="linear-gradient(270deg, rgba(233,244,238,1) 0%, rgba(233,244,238,0) 8%)"
              _dark={{ bg: "linear-gradient(270deg, rgba(16,27,21,1) 0%, rgba(16,27,21,0) 8%)" }}
            />
          </Reveal>
        </GridItem>

        <GridItem
          order={{ base: 1, lg: 2 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          px={{ base: 6, md: 12, lg: 16 }}
          py={{ base: 14, lg: 12 }}
        >
          <Reveal direction="up">
            <Box maxW="lg">
              <Text
                fontSize="xs"
                fontWeight="medium"
                letterSpacing="0.14em"
                textTransform="uppercase"
                color="primary"
                mb={5}
              >
                Ideology Score
              </Text>

              <Heading
                as="h2"
                fontFamily="'Fraunces', serif"
                fontWeight="400"
                fontSize={{ base: "3xl", md: "4xl" }}
                lineHeight="1.2"
                color="text"
                mb={6}
              >
                How We Score Each Legislator
              </Heading>

              <Text color="textMuted" fontSize="md" lineHeight="1.6" mb={7}>
                Ideology Score shows where a legislator falls on the political
                spectrum for a specific issue based on how they actually vote.
                Each score reflects the direction, importance, and partisan
                nature of the bills they supported or opposed.
              </Text>

              <Box display="flex" alignItems="center" gap={4} mb={9} flexWrap="wrap">
                <Box
                  px={4}
                  py={2}
                  rounded="full"
                  bg="partyDem"
                  color="bg"
                  fontWeight="semibold"
                  fontSize="sm"
                >
                  -1 Liberal
                </Box>
                <Text color="textMuted">&larr;&rarr;</Text>
                <Box
                  px={4}
                  py={2}
                  rounded="full"
                  bg="partyRep"
                  color="bg"
                  fontWeight="semibold"
                  fontSize="sm"
                >
                  +1 Conservative
                </Box>
              </Box>

              <VStack align="stretch" gap={7}>
                {steps.map((step) => (
                  <Box key={step.number} display="flex" gap={5} alignItems="flex-start">
                    <Text
                      fontFamily="'Fraunces', serif"
                      fontSize="xl"
                      color="primary"
                      pt={0.5}
                    >
                      {step.number}
                    </Text>
                    <Box>
                      <Text fontWeight="semibold" color="text" mb={1}>
                        {step.title}
                      </Text>
                      <Text color="textMuted" fontSize="sm" lineHeight="1.5">
                        {step.description}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Reveal>
        </GridItem>
      </Grid>
    </Box>
  );
}
