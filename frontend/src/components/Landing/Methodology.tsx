import { Box, Container, Flex, Grid } from "@chakra-ui/react";
import { BillAnalysisExplainer } from "./BillAnalysisExplainer";
import { IdeologyScoreExplainer } from "./IdeologyScoreExplainer";
import { ArrowLink, Eyebrow, TwoToneHeading } from "./landingParts";

export function Methodology() {
  return (
    <Box as="section" bg="bg">
      <Container maxW="7xl" px={4} pb={{ base: 16, md: 24 }}>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "flex-end" }}
          direction={{ base: "column", md: "row" }}
          gap={5}
          pt={{ base: 10, md: 14 }}
          mb={{ base: 8, md: 12 }}
          borderTopWidth="1px"
          borderColor="border"
        >
          <Box maxW="3xl">
            <Eyebrow>Methodology</Eyebrow>
            <TwoToneHeading
              as="h2"
              size="section"
              lead="How the numbers get made."
              rest="Every score traces back to a recorded vote."
            />
          </Box>
          <Box flexShrink={0}>
            <ArrowLink to="/about?tab=methodology">Read the full methodology</ArrowLink>
          </Box>
        </Flex>

        <Grid templateColumns={{ base: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" }} gap={{ base: 4, md: 6 }}>
          <BillAnalysisExplainer />
          <IdeologyScoreExplainer />
        </Grid>
      </Container>
    </Box>
  );
}
