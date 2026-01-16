import { Box, Heading, Text, Link, VStack, Separator } from "@chakra-ui/react";

export function About() {
  return (
    <Box maxW="6xl" mx="auto" p={8}>
      <VStack gap={6} align="start">
        {/* Page Header */}
        <Heading as="h1" size="xl">
          About United States Political Stance Tracker
        </Heading>

        <Text fontSize="lg">
          <strong>United States Political Stance Tracker</strong> is a web
          platform designed to help you explore where U.S. Congress members
          stand on major political issues. By pulling voting records and using
          LLM-powered analysis, we aim to provide insight into legislators'
          political ideologies on specific political categories.
        </Text>

        <Separator />

        {/* What We Do */}
        <Heading as="h2" size="lg">
          What We Do
        </Heading>
        <VStack align="start" gap={3}>
          <Text>
            • <strong>Track Voting Records:</strong> Organize roll call votes by
            member and calculate political ideology scores based on how
            legislators vote.
          </Text>
          <Text>
            • <strong>Analyze Bills with AI:</strong> Summarize bills, highlight
            partisan tendencies, and estimate potential impacts using LLMs.
          </Text>
          <Text>
            • <strong>Visualize Congress:</strong> Charts, histograms, and
            rankings show political trends across parties, issues, and chambers.
          </Text>
          <Text>
            • <strong>Explore Legislator Profiles:</strong> Dive deep into
            individual legislators to see their scores on major political topics
            and how they compare with peers.
          </Text>
        </VStack>

        <Separator />

        {/* How We Do It */}
        <Heading as="h2" size="lg">
          How We Do It
        </Heading>
        <VStack align="start" gap={3}>
          <Text>
            • <strong>Data Sources:</strong> Voting records from the U.S. House
            and Senate, from the 113th Congress to today.
          </Text>
          <Text>
            • <strong>AI-Powered Analysis:</strong> Large Language Models (LLMs)
            help summarize bills, categorize political issues, and generate
            insights.
          </Text>
          <Text>
            • <strong>Open Tools:</strong> Built with open-source software and
            frameworks for transparency and reproducibility.
          </Text>
          <Text fontSize="sm">
            Interested in the role of AI in politics? Check out{" "}
            <Link href="https://political-llm.org/" color="teal.400">
              Political LLM Research 2024
            </Link>{" "}
            and a recent AI-driven analysis of Japanese parliamentary speeches{" "}
            <Link href="https://arxiv.org/pdf/2505.07118" color="teal.400">
              KOKKAI DOC
            </Link>
            .
          </Text>
        </VStack>

        <Separator />

        {/* Current Features */}
        <Heading as="h2" size="lg">
          Current Features
        </Heading>
        <VStack align="start" gap={3}>
          <Text>
            • <strong>Legislators Page:</strong> Search, filter, and explore
            ideological scores of individual Congress members.
          </Text>
          <Text>
            • <strong>Congress Data Page:</strong> View histograms and charts
            summarizing political trends across parties, models, and chambers.
          </Text>
          <Text>
            • <strong>Bill Analyses Page:</strong> Examine AI-generated analyses
            of bills, including partisan and impact scores, and compare results
            across different AI models.
          </Text>
        </VStack>

        <Separator />

        {/* Future Plans */}
        <Heading as="h2" size="lg">
          Future Plans
        </Heading>
        <Text fontSize="lg">
          We are actively improving the platform with UI enhancements, new
          features for deep political analysis, expanded datasets, and
          continuous improvements in AI-driven bill analysis. Feedback and
          contributions are welcome.
        </Text>

        <Separator />

        {/* Acknowledgments */}
        <Heading as="h2" size="lg">
          Acknowledgments
        </Heading>
        <Text fontSize="lg">
          Special thanks to the{" "}
          <Link
            href="https://github.com/unitedstates/congress"
            color="teal.400"
          >
            unitedstates/congress
          </Link>{" "}
          project for their scrapers and foundational data, which make this
          project possible.
        </Text>

        {/* GitHub Section */}
        <Heading as="h2" size="lg">
          GitHub
        </Heading>
        <Text fontSize="lg">
          In order to promote transparency and community involvement, our entire
          codebase is open-source and available on GitHub. Explore the full
          source code, contribute, or report issues on GitHub:{" "}

          <Link
            href="https://github.com/Rohaansandhu/political-stance-tracker"
            color="teal.400"
          >
            Python Data Pipeline
          </Link>

          {" ,  "}

          <Link
            href="https://github.com/Rohaansandhu/political-stance-website"
            color="teal.400"
          >
            Website Code
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
