import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Popover,
  Portal,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import ComparisonToggle from "./ComparisonToggle";
import PercentileBar from "./PercentileBar";
import VoteRow from "./VoteRow";
import { useAxisCategories, useMemberVotes } from "./useMemberVotes";
import type { RosterMember } from "../CongressData/axisStats";
import politicalCategories from "../../../data/politicalCategories.json";
import {
  CATEGORY_POLES,
  SIDE_COLOR,
  axisName,
  axisPolePhrases,
  categoryPartyPosition,
  chamberPosition,
  describePosition,
  distinctiveness,
  voteHistoryUrl,
  type Comparison,
  type MemberContext,
  type Position,
} from "./percentiles";
import type { CategoryInfo } from "./types";

type SortKey = "distinctive" | "alphabetical" | "percentile";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "distinctive", label: "Most distinctive" },
  { key: "alphabetical", label: "A–Z" },
  { key: "percentile", label: "Percentile" },
];

const MAX_BREAKDOWN_AXES = 4;

interface CategoryPositions {
  chamber: Position | null;
  party: Position | null;
}

function ViewsInfo({ category }: { category: string }) {
  const definition = politicalCategories.political_categories.find(
    (c) => c.name === category,
  );
  if (!definition) return null;

  return (
    <Popover.Root positioning={{ placement: "top-start" }}>
      <Popover.Trigger asChild>
        <IconButton aria-label={`What the poles mean for ${category}`} variant="ghost" size="2xs">
          <Info />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content maxW="sm">
            <Popover.Body>
              <VStack align="stretch" gap={2}>
                <Text fontSize="xs" color="text">
                  <Text as="span" fontWeight="700" color={SIDE_COLOR.negative}>
                    Liberal view:{" "}
                  </Text>
                  {definition.liberal_view}
                </Text>
                <Text fontSize="xs" color="text">
                  <Text as="span" fontWeight="700" color={SIDE_COLOR.positive}>
                    Conservative view:{" "}
                  </Text>
                  {definition.conservative_view}
                </Text>
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

function AxisBreakdown({ ctx, category }: { ctx: MemberContext; category: string }) {
  const { data, loading } = useAxisCategories(ctx.memberId, ctx.model, { category });

  if (loading) return <Spinner size="sm" />;
  // Left-Right within a category is just the category's own position again.
  const cells = (data?.cells ?? [])
    .filter((cell) => cell.axis !== "left_right" && cell.stats)
    .slice(0, MAX_BREAKDOWN_AXES);
  if (cells.length === 0) return null;

  return (
    <Box>
      <Text fontSize="xs" fontWeight="700" color="textMuted" textTransform="uppercase" mb={1}>
        What drives it
      </Text>
      <Text fontSize="xs" color="textMuted" mb={2}>
        Votes in this category mostly touch{" "}
        {cells
          .slice(0, 2)
          .map((cell) => axisName(cell.axis))
          .join(" and ")}
        .
      </Text>
      <VStack align="stretch" gap={2}>
        {cells.map((cell) => {
          const stats = ctx.comparison === "party" ? cell.stats?.party : cell.stats?.chamber;
          if (!stats) return null;
          const text = describePosition(stats, axisPolePhrases(cell.axis), ctx);
          return (
            <Box key={cell.axis}>
              <Flex justify="space-between" gap={3} wrap="wrap" mb={1}>
                <Text fontSize="xs" fontWeight="600" color="text">
                  {axisName(cell.axis)}
                </Text>
                <Text fontSize="xs" color={SIDE_COLOR[text.side]}>
                  {text.headline}
                </Text>
              </Flex>
              <PercentileBar percentile={stats.percentile} />
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

function CategoryDetails({ ctx, category }: { ctx: MemberContext; category: string }) {
  const { data, loading } = useMemberVotes(ctx.memberId, ctx.model, {
    category,
    filter: "defining",
    limit: 4,
  });

  return (
    <VStack align="stretch" gap={4} px={4} py={3} borderTopWidth="1px" borderColor="borderSubtle">
      <Box>
        <HStack gap={1} mb={2}>
          <Text fontSize="xs" fontWeight="700" color="textMuted" textTransform="uppercase">
            Top votes
          </Text>
          <ViewsInfo category={category} />
        </HStack>
        {loading && <Spinner size="sm" />}
        <VStack align="stretch" gap={1.5}>
          {data?.results.map((vote) => (
            <VoteRow key={vote.vote_id} vote={vote} model={ctx.model} />
          ))}
        </VStack>
        {data && data.results.length === 0 && (
          <Text fontSize="xs" color="textMuted">
            No contested votes in this category.
          </Text>
        )}
      </Box>

      <AxisBreakdown ctx={ctx} category={category} />

      <RouterLink to={voteHistoryUrl(ctx, { category })}>
        <Text fontSize="xs" color="accent" fontWeight="600">
          See all votes in this category →
        </Text>
      </RouterLink>
    </VStack>
  );
}

function CategoryRow({
  ctx,
  category,
  positions,
}: {
  ctx: MemberContext;
  category: string;
  positions: CategoryPositions;
}) {
  const [expanded, setExpanded] = useState(false);
  const position = ctx.comparison === "party" ? positions.party : positions.chamber;
  const text = position ? describePosition(position, CATEGORY_POLES, ctx) : null;
  const Chevron = expanded ? ChevronUp : ChevronDown;

  return (
    <Box bg="surface" rounded="lg" borderWidth="1px" borderColor="borderSubtle" overflow="hidden">
      <Grid
        as="button"
        w="100%"
        textAlign="left"
        cursor="pointer"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        _hover={{ bg: "bgLightShade" }}
        transition="background 0.15s"
        px={4}
        py={2.5}
        gap={{ base: 1.5, md: 4 }}
        alignItems="center"
        templateColumns={{ base: "1fr auto", md: "minmax(170px, 1fr) 150px minmax(240px, 1.4fr) auto" }}
      >
        <Text fontSize="sm" fontWeight="600" color="text">
          {category}
        </Text>
        <Box gridColumn={{ base: "1 / -1", md: "auto" }} gridRow={{ base: 2, md: "auto" }}>
          {position ? (
            <PercentileBar percentile={position.percentile} />
          ) : null}
        </Box>
        <Box gridColumn={{ base: "1 / -1", md: "auto" }} gridRow={{ base: 3, md: "auto" }}>
          {text ? (
            <>
              <Text fontSize="xs" fontWeight="600" color={SIDE_COLOR[text.side]}>
                {text.band}
              </Text>
              <Text fontSize="xs" color="text">
                {text.headline}{" "}
                <Text as="span" color="textMuted" whiteSpace="nowrap">
                  · {text.rankText}
                </Text>
              </Text>
            </>
          ) : (
            <Text fontSize="xs" color="textMuted">
              Not enough votes
            </Text>
          )}
        </Box>
        <Box color="textMuted" gridRow={{ base: 1, md: "auto" }} gridColumn={{ base: 2, md: "auto" }}>
          <Chevron size={16} />
        </Box>
      </Grid>

      {expanded && <CategoryDetails ctx={ctx} category={category} />}
    </Box>
  );
}

export default function MainCategoryGrid({
  ctx,
  categories,
  roster,
  onComparisonChange,
}: {
  ctx: MemberContext;
  categories: Record<string, CategoryInfo>;
  roster: RosterMember[];
  onComparisonChange: (value: Comparison) => void;
}) {
  const [sortBy, setSortBy] = useState<SortKey>("distinctive");

  const positions = useMemo(() => {
    const result: Record<string, CategoryPositions> = {};
    for (const [category, info] of Object.entries(categories)) {
      result[category] = {
        chamber: chamberPosition(info),
        party: ctx.canComparePartyPeers
          ? categoryPartyPosition(roster, ctx.party, category, info)
          : null,
      };
    }
    return result;
  }, [categories, roster, ctx.party, ctx.canComparePartyPeers]);

  const sorted = useMemo(() => {
    const active = (name: string) =>
      ctx.comparison === "party" ? positions[name].party : positions[name].chamber;
    const names = Object.keys(categories);
    if (sortBy === "alphabetical") return names.sort((a, b) => a.localeCompare(b));
    if (sortBy === "percentile") {
      return names.sort(
        (a, b) => (active(b)?.percentile ?? -1) - (active(a)?.percentile ?? -1),
      );
    }
    return names.sort(
      (a, b) =>
        distinctiveness(positions[b].party ?? positions[b].chamber) -
        distinctiveness(positions[a].party ?? positions[a].chamber),
    );
  }, [categories, positions, sortBy, ctx.comparison]);

  return (
    <Box w="100%">
      <Flex justify="space-between" align="center" mb={3} wrap="wrap" gap={2}>
        <Heading size="md" color="text">
          Policy Categories
        </Heading>
        <HStack gap={3} wrap="wrap">
          <HStack gap={1}>
            {SORT_OPTIONS.map((option) => (
              <Box
                as="button"
                key={option.key}
                aria-pressed={sortBy === option.key}
                onClick={() => setSortBy(option.key)}
                px={2}
                py={1}
                rounded="md"
                fontSize="xs"
                fontWeight="600"
                cursor="pointer"
                color={sortBy === option.key ? "text" : "textMuted"}
                textDecoration={sortBy === option.key ? "underline" : "none"}
              >
                {option.label}
              </Box>
            ))}
          </HStack>
          <ComparisonToggle ctx={ctx} onChange={onComparisonChange} />
        </HStack>
      </Flex>

      <VStack align="stretch" gap={1.5}>
        {sorted.map((category) => (
          <CategoryRow
            key={category}
            ctx={ctx}
            category={category}
            positions={positions[category]}
          />
        ))}
      </VStack>
    </Box>
  );
}
