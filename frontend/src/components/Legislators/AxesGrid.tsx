import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import AxisFingerprint from "./AxisFingerprint";
import ComparisonToggle from "./ComparisonToggle";
import PercentileBar from "./PercentileBar";
import VoteRow from "./VoteRow";
import { useAxisCategories, useMemberVotes } from "./useMemberVotes";
import { useChartTheme } from "../CongressData/chartTheme";
import type { RosterMember } from "../CongressData/axisStats";
import {
  AXIS_GROUPS,
  MIN_BILLS,
  SIDE_COLOR,
  axisDefinition,
  axisName,
  axisPartyPosition,
  axisPolePhrases,
  chamberPartyLabel,
  chamberPosition,
  describePosition,
  distinctiveness,
  loyaltyComparison,
  partyPlural,
  voteHistoryUrl,
  type Comparison,
  type MemberContext,
  type Position,
  type Side,
} from "./percentiles";
import type { AxisInfo } from "./types";

// The stored descriptions for Left-Right name internal fields, so these replace them.
const POLE_DESCRIPTION_OVERRIDES: Record<string, Record<Side, string>> = {
  left_right: {
    negative: "Votes in line with the liberal position on each policy area.",
    positive: "Votes in line with the conservative position on each policy area.",
  },
};

interface AxisPositions {
  chamber: Position | null;
  party: Position | null;
}

function poleDescription(axisId: string, side: Side): string {
  const override = POLE_DESCRIPTION_OVERRIDES[axisId]?.[side];
  if (override) return override;
  const axis = axisDefinition(axisId);
  return (side === "negative" ? axis?.negative_pole : axis?.positive_pole)?.description ?? "";
}

function PoleVotes({
  ctx,
  axisId,
  side,
}: {
  ctx: MemberContext;
  axisId: string;
  side: Side;
}) {
  const { data, loading } = useMemberVotes(ctx.memberId, ctx.model, {
    axis: axisId,
    pole: side,
    limit: 3,
  });
  const pole = axisPolePhrases(axisId)[side];

  return (
    <VStack align="stretch" gap={1.5}>
      <Text fontSize="xs" fontWeight="700" color={SIDE_COLOR[side]}>
        Toward {pole}
      </Text>
      {loading && <Spinner size="sm" />}
      {data?.results.map((vote) => (
        <VoteRow key={vote.vote_id} vote={vote} model={ctx.model} />
      ))}
      {data && data.results.length === 0 && (
        <Text fontSize="xs" color="textMuted">
          No contested votes pushed this member toward {pole}.
        </Text>
      )}
    </VStack>
  );
}

function PartyBreakVotes({ ctx }: { ctx: MemberContext }) {
  const { data, loading } = useMemberVotes(ctx.memberId, ctx.model, {
    filter: "broke",
    limit: 4,
  });

  return (
    <VStack align="stretch" gap={1.5}>
      {loading && <Spinner size="sm" />}
      {data?.results.map((vote) => (
        <VoteRow key={vote.vote_id} vote={vote} model={ctx.model} />
      ))}
      {data && data.results.length === 0 && (
        <Text fontSize="xs" color="textMuted">
          No scored votes against most of their party.
        </Text>
      )}
    </VStack>
  );
}

function CategoryBreakdown({ ctx, axisId }: { ctx: MemberContext; axisId: string }) {
  const { data, loading } = useAxisCategories(ctx.memberId, ctx.model, {
    axis: axisId,
  });
  const poles = axisPolePhrases(axisId);

  if (loading) return <Spinner size="sm" />;
  if (!data || data.cells.length === 0) return null;

  return (
    <Box>
      <Text fontSize="xs" fontWeight="700" color="textMuted" textTransform="uppercase" mb={2}>
        By category
      </Text>
      <VStack align="stretch" gap={2}>
        {data.cells.map((cell) => {
          const stats =
            ctx.comparison === "party" ? cell.stats?.party : cell.stats?.chamber;
          const text = stats ? describePosition(stats, poles, ctx) : null;
          return (
            <Box key={cell.category}>
              <Flex justify="space-between" gap={3} wrap="wrap" mb={1}>
                <Text fontSize="xs" fontWeight="600" color="text">
                  {cell.category}
                </Text>
                <Text fontSize="xs" color={text ? SIDE_COLOR[text.side] : "textMuted"}>
                  {text ? text.headline : "Not enough votes"}
                </Text>
              </Flex>
              {stats && <PercentileBar percentile={stats.percentile} />}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

function AxisDetails({
  ctx,
  axisId,
  info,
}: {
  ctx: MemberContext;
  axisId: string;
  info: AxisInfo;
}) {
  const isInstitutional = axisId === "institutional";
  const poles = axisPolePhrases(axisId);

  return (
    <VStack
      align="stretch"
      gap={4}
      px={4}
      py={3}
      borderTopWidth="1px"
      borderColor="borderSubtle"
    >
      {!isInstitutional && <CategoryBreakdown ctx={ctx} axisId={axisId} />}

      <Box>
        <Text fontSize="xs" fontWeight="700" color="textMuted" textTransform="uppercase" mb={2}>
          {isInstitutional ? "Votes against their party" : "Defining votes"}
        </Text>
        {isInstitutional ? (
          <PartyBreakVotes ctx={ctx} />
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={3}>
            <PoleVotes ctx={ctx} axisId={axisId} side="negative" />
            <PoleVotes ctx={ctx} axisId={axisId} side="positive" />
          </SimpleGrid>
        )}
      </Box>

      <Box>
        <Text fontSize="xs" fontWeight="700" color="textMuted" textTransform="uppercase" mb={1}>
          What the poles mean
        </Text>
        {(["negative", "positive"] as const).map((side) => (
          <Text key={side} fontSize="xs" color="textMuted">
            <Text as="span" fontWeight="600" color={SIDE_COLOR[side]}>
              {poles[side]}:
            </Text>{" "}
            {poleDescription(axisId, side)}
          </Text>
        ))}
      </Box>

      <Flex justify="space-between" gap={3} wrap="wrap">
        <Text fontSize="xs" color="textMuted">
          {info.bill_count.toLocaleString()} {isInstitutional ? "roll calls counted" : "bills scored"}
        </Text>
        <RouterLink to={voteHistoryUrl(ctx, { axis: axisId })}>
          <Text fontSize="xs" color="accent" fontWeight="600">
            See all votes on this axis →
          </Text>
        </RouterLink>
      </Flex>
    </VStack>
  );
}

function AxisRow({
  ctx,
  axisId,
  info,
  positions,
  roster,
}: {
  ctx: MemberContext;
  axisId: string;
  info: AxisInfo;
  positions: AxisPositions;
  roster: RosterMember[];
}) {
  const [expanded, setExpanded] = useState(false);
  const position = ctx.comparison === "party" ? positions.party : positions.chamber;
  const text = position ? describePosition(position, axisPolePhrases(axisId), ctx) : null;
  const Chevron = expanded ? ChevronUp : ChevronDown;

  const groupLabel =
    ctx.comparison === "party" ? chamberPartyLabel(ctx) : `the ${ctx.chamber}`;
  const isLoyaltyRow = axisId === "institutional" && info.defection_rate !== undefined;
  const headline =
    isLoyaltyRow && position
      ? `Votes with party leadership ${Math.round((1 - info.defection_rate!) * 100)}% · ${loyaltyComparison(position, groupLabel)}`
      : text?.headline;

  return (
    <Box bg="surface" rounded="lg" borderWidth="1px" borderColor="borderSubtle" overflow="hidden">
      <Box
        as="button"
        w="100%"
        textAlign="left"
        px={4}
        pt={3}
        pb={1}
        cursor="pointer"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        _hover={{ bg: "bgLightShade" }}
        transition="background 0.15s"
      >
        <Flex justify="space-between" align="flex-start" gap={3}>
          <Box minW={0}>
            <HStack gap={2} wrap="wrap">
              <Text fontSize="sm" fontWeight="700" color="text">
                {axisName(axisId)}
              </Text>
              {text && (
                <Text fontSize="xs" fontWeight="600" color={SIDE_COLOR[text.side]}>
                  {text.band}
                </Text>
              )}
            </HStack>
            {text ? (
              <Text fontSize="sm" color="text">
                {headline}{" "}
                <Text as="span" fontSize="xs" color="textMuted" whiteSpace="nowrap">
                  · {text.rankText}
                </Text>
              </Text>
            ) : (
              <Text fontSize="sm" color="textMuted">
                {info.bill_count < MIN_BILLS || ctx.comparison === "chamber"
                  ? "Not enough votes"
                  : "Loading…"}
              </Text>
            )}
          </Box>
          <Box color="textMuted" flexShrink={0} mt={0.5}>
            <Chevron size={16} />
          </Box>
        </Flex>
      </Box>

      <Box px={4} pb={3} pt={1}>
        <AxisFingerprint
          axisId={axisId}
          memberId={ctx.memberId}
          party={ctx.party}
          roster={roster}
          comparison={ctx.comparison}
          selfSide={text?.side ?? null}
        />
      </Box>

      {expanded && <AxisDetails ctx={ctx} axisId={axisId} info={info} />}
    </Box>
  );
}

function StripLegend({
  ctx,
  roster,
}: {
  ctx: MemberContext;
  roster: RosterMember[];
}) {
  const { partyColors } = useChartTheme();
  const showBothParties = ctx.comparison === "chamber";
  const parties = showBothParties
    ? (["R", "D"] as const)
    : ctx.party === "R" || ctx.party === "D"
      ? ([ctx.party] as const)
      : [];
  const showIndependents =
    showBothParties && roster.some((m) => m.current && m.party === "I");

  return (
    <HStack gap={4} wrap="wrap" rowGap={1} fontSize="xs" color="textMuted">
      {parties.map((party) => (
        <HStack key={party} gap={1.5}>
          <Box w="8px" h="8px" rounded="full" style={{ background: partyColors[party], opacity: 0.5 }} />
          <Text>{partyPlural(party)}</Text>
        </HStack>
      ))}
      {showIndependents && (
        <HStack gap={1.5}>
          <Box w="8px" h="8px" rounded="full" style={{ background: partyColors.I, opacity: 0.5 }} />
          <Text>Independents</Text>
        </HStack>
      )}
      {parties.map((party) => (
        <HStack key={party} gap={1.5}>
          <Box w="2px" h="12px" style={{ background: partyColors[party] }} />
          <Text>{party === "R" ? "Republican" : "Democratic"} average</Text>
        </HStack>
      ))}
      <HStack gap={1.5}>
        <Box
          w="12px"
          h="12px"
          rounded="full"
          borderWidth="2px"
          borderColor="textMuted"
          bg="surface"
        />
        <Text>{ctx.lastName}</Text>
      </HStack>
    </HStack>
  );
}

export default function AxesGrid({
  ctx,
  axes,
  roster,
  onComparisonChange,
}: {
  ctx: MemberContext;
  axes: Record<string, AxisInfo>;
  roster: RosterMember[];
  onComparisonChange: (value: Comparison) => void;
}) {
  const [sortBy, setSortBy] = useState<"grouped" | "distinctive">("grouped");

  const positions = useMemo(() => {
    const result: Record<string, AxisPositions> = {};
    for (const [axisId, info] of Object.entries(axes)) {
      result[axisId] = {
        chamber: chamberPosition(info),
        party: ctx.canComparePartyPeers
          ? axisPartyPosition(roster, ctx.party, axisId, info)
          : null,
      };
    }
    return result;
  }, [axes, roster, ctx.party, ctx.canComparePartyPeers]);

  const renderRow = (axisId: string) => (
    <AxisRow
      key={axisId}
      ctx={ctx}
      axisId={axisId}
      info={axes[axisId]}
      positions={positions[axisId]}
      roster={roster}
    />
  );

  const distinctiveOrder = Object.keys(axes).sort(
    (a, b) =>
      distinctiveness(positions[b].party ?? positions[b].chamber) -
      distinctiveness(positions[a].party ?? positions[a].chamber),
  );

  return (
    <Box w="100%">
      <Flex justify="space-between" align="center" mb={2} wrap="wrap" gap={2}>
        <Heading size="md" color="text">
          Ideological Axes
        </Heading>
        <HStack gap={3} wrap="wrap">
          <HStack gap={1}>
            {(
              [
                { key: "grouped", label: "By topic" },
                { key: "distinctive", label: "Most distinctive" },
              ] as const
            ).map((option) => (
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

      <Box mb={3}>
        <StripLegend ctx={ctx} roster={roster} />
      </Box>

      {sortBy === "distinctive" ? (
        <VStack align="stretch" gap={2}>
          {distinctiveOrder.map(renderRow)}
        </VStack>
      ) : (
        <VStack align="stretch" gap={5}>
          {AXIS_GROUPS.map((group) => {
            const ids = group.axes.filter((id) => axes[id]);
            if (ids.length === 0) return null;
            return (
              <Box key={group.label}>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color="textMuted"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                  mb={2}
                >
                  {group.label}
                </Text>
                <VStack align="stretch" gap={2}>
                  {ids.map(renderRow)}
                </VStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
}
