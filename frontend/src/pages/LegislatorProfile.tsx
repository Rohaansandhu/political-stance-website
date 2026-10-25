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
  Tabs,
} from "@chakra-ui/react";

import LegislatorProfileHeader from "../components/Legislators/LegislatorProfileHeader";
import LegislatorStatsOverview from "../components/Legislators/LegislatorStatsOverview";
import MainCategoryGrid from "../components/Legislators/MainCategoriesGrid";
import AxesGrid from "../components/Legislators/AxesGrid";
import { IdeologyScoreReminder } from "../components/Legislators/IdeologyScoreReminder";
import { Helmet } from "react-helmet-async";
import { MODEL_SCHEMAS, DEFAULT_MODEL } from "../utils/specHash";
import type { Axes } from "../types/axes";

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
  axes?: Axes;
  terms?: {
    type: string;
    start: string;
    end: string;
    state: string;
    district?: number;
    class?: number;
    party: string;
  }[];
}

// Senate scraping has been blocked by senate.gov since this date (see data
// pipeline handoff) — House data runs well past this. Update once the
// scraper is fixed and the DB is re-synced.
const SENATE_DATA_AS_OF = "March 9, 2026";

export default function LegislatorProfile() {
  const { id } = useParams();
  const [data, setData] = useState<LegislatorData | null>(null);
  const [model, setModel] = useState(DEFAULT_MODEL);
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

  const isSenate = data.terms && data.terms.length > 0
    ? data.terms[data.terms.length - 1].type !== "rep"
    : false;

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

      {/* Senate data staleness notice */}
      {isSenate && (
        <Box mb={4} px={4} py={2} bg="orange.subtle" rounded="md" borderWidth="1px" borderColor="orange.muted">
          <Text fontSize="sm" color="orange.fg">
            Senate voting data is current as of {SENATE_DATA_AS_OF}. House data is more
            recent; Senate scores may not reflect the member's latest votes.
          </Text>
        </Box>
      )}

      {/* Sidebar + main content */}
      <Box bg="bgLightShade" p={4} rounded="card" borderWidth="1px" borderColor="borderSubtle">
        <HStack align="flex-start" gap={4}>
          {/* Left sidebar */}
          <VStack align="stretch" gap={4} flexShrink={0} w="180px">
            {/* Model selector */}
            <Select.Root
              collection={createListCollection({
                items: Object.entries(MODEL_SCHEMAS).map(([value, spec]) => ({
                  label: spec.label,
                  value,
                })),
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
                {Object.entries(MODEL_SCHEMAS).map(([value, spec]) => (
                  <Select.Item key={value} item={value}>
                    <Select.ItemText>{spec.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            {/* Stats overview in sidebar */}
            <LegislatorStatsOverview data={data} />
          </VStack>

          {/* Main content — category/axes tabs */}
          <Box flex={1} minW={0}>
            {data.axes && Object.keys(data.axes).length > 0 ? (
              <Tabs.Root defaultValue="categories" variant="enclosed">
                <Tabs.List mb={3}>
                  <Tabs.Trigger value="categories">Policy Categories</Tabs.Trigger>
                  <Tabs.Trigger value="axes">Ideological Axes</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="categories">
                  <MainCategoryGrid
                    categories={data.primary_categories}
                    recentVotes={data.recent_votes}
                    model={model}
                  />
                </Tabs.Content>
                <Tabs.Content value="axes">
                  <AxesGrid axes={data.axes} />
                </Tabs.Content>
              </Tabs.Root>
            ) : (
              <MainCategoryGrid
                categories={data.primary_categories}
                recentVotes={data.recent_votes}
                model={model}
              />
            )}
          </Box>
        </HStack>
      </Box>
    </Container>
  );
}
