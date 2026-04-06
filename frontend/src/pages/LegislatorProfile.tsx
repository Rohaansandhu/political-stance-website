import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Spinner,
  Center,
  Text,
  VStack,
  HStack,
  Breadcrumb,
  Flex,
  Select,
  createListCollection,
} from "@chakra-ui/react";

import LegislatorProfileHeader from "../components/Legislators/LegislatorProfileHeader";
import LegislatorStatsOverview from "../components/Legislators/LegislatorStatsOverview";
import MainCategoryGrid from "../components/Legislators/MainCategoriesGrid";
import { IdeologyScoreReminder } from "../components/Legislators/IdeologyScoreReminder";
import { Helmet } from "react-helmet-async";

interface LegislatorData {
  member_id: string;
  name: { official_full: string };
  bio: { gender: string; birthday: string };
  id: {};
  state: string;
  district: number;
  vote_count: number;
  primary_categories: Record<
    string,
    {
      score: number;
      rank: number;
      percentile_rank: number;
      bill_count: number;
      current_rank: number;
      current_percentile_rank: number;
    }
  >;
  recent_votes?: {
    conservative: {
      bill_id: string;
      vote: string;
      date: string;
      score_impact: number;
      category: string;
    }[];
    liberal: {
      bill_id: string;
      vote: string;
      date: string;
      score_impact: number;
      category: string;
    }[];
  };
}

export default function LegislatorProfile() {
  const { id } = useParams();
  const [data, setData] = useState<LegislatorData | null>(null);
  const [model, setModel] = useState("gpt-5-mini");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLegislator() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/legislators/${id}/${model}`,
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error loading legislator:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLegislator();
  }, [id, model]);

  if (loading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!data) {
    return (
      <Center minH="60vh">
        <Text>No legislator found.</Text>
      </Center>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <Helmet>
        <title>{`${data.name.official_full} (${data.state}) | US PoliTrack`}</title>
        <meta
          name="description"
          content={`Legislator Profile with ideology scores and spectrum analysis for ${data.name.official_full} from ${data.state}.`}
        />
      </Helmet>

      {/* Breadcrumb */}
      <Flex justifyContent="flex-start" mb={4}>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <Link to="/explore-legislators">Explore Legislators</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Flex>

      {/* Compact header — full width */}
      <Box mb={4}>
        <LegislatorProfileHeader data={data} />
      </Box>

      {/* Ideology score reminder */}
      <Box mb={4}>
        <IdeologyScoreReminder />
      </Box>

      {/* Sidebar + main content */}
      <Box bg="bgLightShade" p={4} rounded="xl">
        <HStack align="flex-start" gap={4}>
          {/* Left sidebar */}
          <VStack align="stretch" gap={4} flexShrink={0} w="180px">
            {/* Model selector */}
            <Select.Root
              collection={createListCollection({
                items: [{ label: "GPT-5 Mini", value: "gpt-5-mini" }],
              })}
              value={[model]}
              onValueChange={(details) => setModel(details.value[0])}
            >
              <Select.Label fontSize="sm" fontWeight="600">
                Model
              </Select.Label>
              <Select.Trigger>
                <Select.ValueText placeholder="Select Model" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item item="gpt-5-mini">
                  <Select.ItemText>GPT-5 Mini</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select.Root>

            {/* Stats overview in sidebar */}
            <LegislatorStatsOverview data={data} />
          </VStack>

          {/* Main content — category grid */}
          <Box flex={1} minW={0}>
            <MainCategoryGrid
              categories={data.primary_categories}
              recentVotes={data.recent_votes}
            />
          </Box>
        </HStack>
      </Box>
    </Container>
  );
}
