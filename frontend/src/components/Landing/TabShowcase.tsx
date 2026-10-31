import { Box, Container, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { ChartColumn, Compass, FileText, Users } from "lucide-react";
import { COMPASS_PRESETS } from "../CongressData/compassPresets";
import { BillAnalysisMock } from "./BillAnalysisMock";
import { CompassMock } from "./CompassMock";
import { CongressDataMock } from "./CongressDataMock";
import { FeatureRow } from "./FeatureRow";
import { ArrowLink, Eyebrow, MockChip, TwoToneHeading } from "./landingParts";
import { LegislatorsMock } from "./LegislatorsMock";

function CompassBand() {
  return (
    <Box
      as="section"
      bg="bgAltGreen"
      mx={{ base: 2, md: 4 }}
      pt={{ base: 20, lg: 24 }}
      pb={{ base: 12, lg: 20 }}
      // Notched top-left corner.
      clipPath={{
        base: "polygon(0 40px, 120px 40px, 160px 0, 100% 0, 100% 100%, 0 100%)",
        md: "polygon(0 56px, 220px 56px, 276px 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <Container maxW="7xl" px={4}>
        <Grid
          templateColumns={{ base: "minmax(0, 1fr)", lg: "5fr 7fr" }}
          gap={{ base: 10, lg: 16 }}
          alignItems="center"
        >
          <GridItem minW={0}>
            <Eyebrow icon={Compass}>Political Compass</Eyebrow>
            <TwoToneHeading
              as="h2"
              size="section"
              lead="One line can't hold a politician."
              rest="Two axes get closer."
            />
            <Text color="textMuted" fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" mt={5}>
              Plot the whole House or Senate on any two of 11 ideological axes
              and see which members cluster, which drift from their party, and
              where a single left-right score hides the difference.
            </Text>
            <Text fontSize="xs" fontWeight="semibold" color="textMuted" mt={7} mb={2.5}>
              Start from a preset
            </Text>
            <HStack gap={1.5} wrap="wrap" mb={8}>
              {COMPASS_PRESETS.map((preset) => (
                <MockChip key={preset.id} bg="bg">
                  {preset.label}
                </MockChip>
              ))}
            </HStack>
            <ArrowLink to="/political-compass">Open the Political Compass</ArrowLink>
          </GridItem>

          <GridItem minW={0}>
            <CompassMock />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}

export function TabShowcase() {
  return (
    <Box bg="bg">
      <Container as="section" maxW="7xl" px={4} pt={{ base: 16, md: 24 }} pb={{ base: 16, md: 24 }}>
        <VStack align="stretch" gap={{ base: 16, md: 28 }}>
          <FeatureRow
            icon={Users}
            eyebrow="Legislators"
            lead="Look up any member."
            rest="See what their votes add up to."
            description="Every member of Congress has a profile with ideology scores built from their own voting record, split by policy area and ranked against their peers."
            points={[
              "Search by name, state, chamber, or party",
              "Scores and percentile ranks for each policy category",
              "The specific votes that moved each score most",
            ]}
            to="/explore-legislators"
            cta="Explore legislators"
            panelBg="bgAltGreen"
          >
            <LegislatorsMock />
          </FeatureRow>

          <FeatureRow
            flip
            icon={ChartColumn}
            eyebrow="Congress Data"
            lead="Step back and see the whole chamber."
            rest="Then find anyone in it."
            description="See how the House or Senate spreads out on any policy category or ideological axis, and search for one legislator to see where they land in the crowd."
            points={[
              "Histograms for the shape of each chamber",
              "Scatter plots of score against bills voted on",
              "Full rankings from most liberal to most conservative",
            ]}
            to="/congress-data"
            cta="View Congress data"
            panelBg="bgAltGray"
          >
            <CongressDataMock />
          </FeatureRow>
        </VStack>
      </Container>

      <CompassBand />

      <Container as="section" maxW="7xl" px={4} pt={{ base: 16, md: 28 }} pb={{ base: 16, md: 24 }}>
        <FeatureRow
          icon={FileText}
          eyebrow="Bill Analyses"
          lead="Read what a bill does politically."
          rest="Not just how it was named."
          description="Search more than 12,000 AI analyses of bills that reached a roll-call vote. Each one breaks the bill into political categories, with a score and written reasoning for each."
          points={[
            "Summaries and key provisions in plain language",
            "Partisan lean and impact for each category",
            "Compare results across models and see the recorded votes",
          ]}
          to="/bill-analyses"
          cta="Find bills"
          panelBg="bgAltGreen"
        >
          <BillAnalysisMock />
        </FeatureRow>
      </Container>
    </Box>
  );
}
