import { Box, Grid, GridItem, Heading, Image, Text, VStack } from "@chakra-ui/react";
import billAnalysisImage from "../../assets/how_we_analyze_bill.avif";
import { Reveal } from "../motion/Reveal";

const steps = [
  {
    number: "01",
    title: "AI-Powered Analysis",
    description: "Advanced language models read and interpret legislative text",
  },
  {
    number: "02",
    title: "Category Identification",
    description: "Automatically tags bills with relevant political topics",
  },
  {
    number: "03",
    title: "Partisan Impact",
    description:
      "Estimates the ideological direction and significance of each bill",
  },
];

export function BillAnalysisExplainer() {
  return (
    <Box as="section" bg="bgAltGray" overflow="hidden">
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} minH={{ lg: "680px" }}>
        <GridItem
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
                AI-Assisted Analysis
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
                How We Analyze Each Bill
              </Heading>

              <Text color="textMuted" fontSize="md" lineHeight="1.6" mb={10}>
                Large language models are used to analyze each bill, identify
                relevant political categories, and estimate the partisan
                leaning and impact of each category within the bill.
              </Text>

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

              <Text color="textMuted" fontSize="sm" mt={10}>
                Find more complete analyses under the{" "}
                <Text as="strong" color="text">
                  Bill Analyses
                </Text>{" "}
                tab.
              </Text>
            </Box>
          </Reveal>
        </GridItem>

        <GridItem position="relative" overflow="hidden" minH={{ base: "320px", lg: "auto" }}>
          <Reveal direction="right" delay={0.15} distance={30} duration={0.65} position="relative" h="full" w="full">
            <Image
              src={billAnalysisImage}
              alt="United States Capitol building"
              position="absolute"
              inset={0}
              w="full"
              h="full"
              objectFit="cover"
              objectPosition="50% 30%"
            />
            <Box
              position="absolute"
              inset={0}
              display={{ base: "none", lg: "block" }}
              bg="linear-gradient(90deg, rgba(240,244,242,1) 0%, rgba(240,244,242,0) 8%)"
              _dark={{ bg: "linear-gradient(90deg, rgba(7,10,9,1) 0%, rgba(7,10,9,0) 8%)" }}
            />
          </Reveal>
        </GridItem>
      </Grid>
    </Box>
  );
}
