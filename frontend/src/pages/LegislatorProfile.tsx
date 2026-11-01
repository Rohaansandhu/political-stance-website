import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Spinner,
  Center,
  Text,
  VStack,
  Breadcrumb,
  Flex,
  Heading,
} from "@chakra-ui/react";

import LegislatorProfileHeader from "../components/Legislators/LegislatorProfileHeader";
import MemberSummaryCard from "../components/Legislators/MemberSummaryCard";
import MainCategoryGrid from "../components/Legislators/MainCategoriesGrid";
import AxesGrid from "../components/Legislators/AxesGrid";
import NotableVotes from "../components/Legislators/NotableVotes";
import LegislatorMethodology from "../components/Legislators/LegislatorMethodology";
import LegislatorAbout from "../components/Legislators/LegislatorAbout";
import {
  displayName,
  voteHistoryUrl,
  type ChamberName,
  type Comparison,
  type MemberContext,
} from "../components/Legislators/percentiles";
import type { LegislatorData } from "../components/Legislators/types";
import { modelLabel, DEFAULT_MODEL, buildSpecHash } from "../components/CongressData/modelLabels";
import { useAxisRoster } from "../components/CongressData/useAxisRoster";
import { Helmet } from "react-helmet-async";

export default function LegislatorProfile() {
  const { id } = useParams();
  const [data, setData] = useState<LegislatorData | null>(null);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [availableModels, setAvailableModels] = useState<string[]>([DEFAULT_MODEL]);
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState<Comparison>("chamber");

  useEffect(() => {
    async function loadModels() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bill-analyses/filters`,
        );
        const json = await res.json();
        if (Array.isArray(json.models) && json.models.length > 0) {
          setAvailableModels(json.models);
        }
      } catch (err) {
        console.error("Error loading models:", err);
      }
    }

    loadModels();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadLegislator() {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/legislators/${id}/${model}`,
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        console.error("Error loading legislator:", err);
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLegislator();
    return () => {
      cancelled = true;
    };
  }, [id, model]);

  const terms = data?.terms;
  const currentTerm = terms?.[terms.length - 1];
  const chamber: ChamberName = currentTerm?.type === "sen" ? "Senate" : "House";
  const rosterSpecHash = data ? buildSpecHash(model, chamber.toLowerCase()) : null;
  const { roster } = useAxisRoster(rosterSpecHash, true);

  const party = data?.party;
  // Independents have no party group, and a former member isn't part of the
  // current party they'd be compared against.
  const canComparePartyPeers = (party === "R" || party === "D") && Boolean(data?.current);

  const ctx: MemberContext | null = useMemo(() => {
    if (!data) return null;
    return {
      memberId: data.member_id,
      lastName: data.name.last ?? displayName(data.name),
      model,
      chamber,
      party,
      comparison: canComparePartyPeers ? comparison : "chamber",
      canComparePartyPeers,
    };
  }, [data, model, chamber, party, comparison, canComparePartyPeers]);

  if (!data && loading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!data || !ctx) {
    return (
      <Center minH="60vh">
        <VStack gap={3}>
          <Text>
            No record for this legislator under {modelLabel(model)}.
          </Text>
          {model !== DEFAULT_MODEL && (
            <Button size="sm" onClick={() => setModel(DEFAULT_MODEL)}>
              Switch to {modelLabel(DEFAULT_MODEL)}
            </Button>
          )}
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="5xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      <Helmet>
        <title>{`${displayName(data.name)} (${data.state}) | US PoliTrack`}</title>
        <meta
          name="description"
          content={`How ${displayName(data.name)} of ${data.state} compares with the rest of Congress, issue by issue, based on their voting record.`}
        />
      </Helmet>

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

      <VStack
        align="stretch"
        gap={{ base: 5, md: 6 }}
        opacity={loading ? 0.6 : 1}
        transition="opacity 0.15s"
      >
        <LegislatorProfileHeader data={data} />
        <MemberSummaryCard ctx={ctx} data={data} roster={roster} />

        {data.axes && (
          <AxesGrid
            ctx={ctx}
            axes={data.axes}
            roster={roster}
            onComparisonChange={setComparison}
          />
        )}

        <NotableVotes ctx={ctx} />

        <MainCategoryGrid
          ctx={ctx}
          categories={data.primary_categories ?? {}}
          roster={roster}
          onComparisonChange={setComparison}
        />

        <Box
          bg="surface"
          rounded="card"
          borderWidth="1px"
          borderColor="border"
          px={{ base: 4, md: 6 }}
          py={3}
        >
          <Flex justify="space-between" align="center" gap={3} wrap="wrap">
            <Box>
              <Heading size="sm" color="text">
                Full Vote History
              </Heading>
              <Text fontSize="sm" color="textMuted">
                Search and filter every scored vote by {ctx.lastName}.
              </Text>
            </Box>
            <Link to={voteHistoryUrl(ctx)}>
              <Text fontSize="sm" color="accent" fontWeight="600">
                Open vote history →
              </Text>
            </Link>
          </Flex>
        </Box>

        <LegislatorMethodology
          data={data}
          model={model}
          availableModels={availableModels}
          loading={loading}
          onModelChange={setModel}
        />
        <LegislatorAbout data={data} />
      </VStack>
    </Container>
  );
}
