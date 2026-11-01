import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { RosterMember } from "../CongressData/axisStats";
import {
  AXIS_GROUPS,
  axisPartyPosition,
  axisPolePhrases,
  bandLabel,
  chamberPartyLabel,
  chamberPosition,
  describePosition,
  loyaltyComparison,
  partyMemberNoun,
  partyPlural,
  partySingular,
  sideOf,
  towardPoleShare,
  voteHistoryUrl,
  type MemberContext,
} from "./percentiles";
import type { AxisInfo, LegislatorData } from "./types";

// Left-Right and Institutional already have their own lines on this card.
const STANDS_OUT_AXES = AXIS_GROUPS.flatMap((group) => group.axes).filter(
  (id) => id !== "left_right" && id !== "institutional",
);
const STANDS_OUT_MIN_SHARE = 0.8;
const STANDS_OUT_MAX = 3;

function SummaryLine({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Flex gap={{ base: 0, md: 3 }} direction={{ base: "column", md: "row" }}>
      <Text
        fontSize="xs"
        fontWeight="700"
        color="textMuted"
        textTransform="uppercase"
        letterSpacing="0.05em"
        w={{ md: "110px" }}
        flexShrink={0}
        pt={{ md: "3px" }}
      >
        {label}
      </Text>
      <Text fontSize={{ base: "sm", md: "md" }} color="text">
        {children}
      </Text>
    </Flex>
  );
}

function overallPartyText(
  roster: RosterMember[],
  ctx: MemberContext,
  info: AxisInfo,
): string | null {
  const position = axisPartyPosition(roster, ctx.party, "left_right", info);
  if (!position) return null;
  const group = chamberPartyLabel(ctx);
  const poles = axisPolePhrases("left_right");
  const band = bandLabel(
    towardPoleShare(position.percentile),
    poles[sideOf(position.percentile)],
    "Middle",
  );
  return band === "Middle" ? `Middle of ${group}` : `${band} among ${group}`;
}

function standOutAxes(
  roster: RosterMember[],
  ctx: MemberContext,
  axes: Record<string, AxisInfo>,
): string[] {
  return STANDS_OUT_AXES.map((axisId) => {
    const position = axisPartyPosition(roster, ctx.party, axisId, axes[axisId]);
    return position ? { axisId, position, share: towardPoleShare(position.percentile) } : null;
  })
    .filter((entry): entry is NonNullable<typeof entry> => {
      return entry !== null && entry.share >= STANDS_OUT_MIN_SHARE;
    })
    .sort((a, b) => b.share - a.share)
    .slice(0, STANDS_OUT_MAX)
    .map(({ axisId, position }) => {
      const pole = axisPolePhrases(axisId)[sideOf(position.percentile)];
      return `More ${pole} than most ${partyPlural(ctx.party)}`;
    });
}

export default function MemberSummaryCard({
  ctx,
  data,
  roster,
}: {
  ctx: MemberContext;
  data: LegislatorData;
  roster: RosterMember[];
}) {
  const axes = data.axes;
  const rosterReady = roster.length > 0;
  const comparesParty = ctx.canComparePartyPeers;
  // This card always shows the chamber view first, whatever the page toggle says.
  const chamberCtx: MemberContext = { ...ctx, comparison: "chamber" };

  const overall = axes?.left_right;
  const overallPosition = chamberPosition(overall);
  const overallText = overallPosition
    ? describePosition(overallPosition, axisPolePhrases("left_right"), chamberCtx)
    : null;

  const institutional = axes?.institutional;
  const loyaltyPosition = chamberPosition(institutional);

  const { partyText, standOuts } = useMemo(() => {
    if (!axes || !comparesParty || !rosterReady) {
      return { partyText: null, standOuts: null };
    }
    return {
      partyText: overall ? overallPartyText(roster, ctx, overall) : null,
      standOuts: standOutAxes(roster, ctx, axes),
    };
  }, [axes, comparesParty, rosterReady, overall, roster, ctx]);

  const partyName = partySingular(ctx.party);

  return (
    <Box
      bg="surface"
      px={{ base: 4, md: 6 }}
      py={4}
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      boxShadow="card"
    >
      <VStack align="stretch" gap={3}>
        {overallText && (
          <SummaryLine label="Overall">
            {overallText.headline}
            {partyText && ` · ${partyText}`}
          </SummaryLine>
        )}

        {institutional?.defection_rate !== undefined && loyaltyPosition && (
          <SummaryLine label="Party loyalty">
            Votes with {partyName ? `${partyName} ` : "party "}leadership{" "}
            {Math.round((1 - institutional.defection_rate) * 100)}% of the time ·{" "}
            {loyaltyComparison(loyaltyPosition, `the ${ctx.chamber}`)}
          </SummaryLine>
        )}

        {standOuts && (
          <SummaryLine label="Stands out on">
            {standOuts.length > 0
              ? standOuts.join(" · ")
              : `Votes close to the typical ${partyMemberNoun(ctx.party)} on every axis`}
          </SummaryLine>
        )}

        {!axes && (
          <Text fontSize="sm" color="textMuted">
            This model doesn't score ideological axes, so the overall and party loyalty lines
            aren't available. Choose GPT-6 Luna under Methodology and Details to see them.
          </Text>
        )}

        <Flex gap={4} wrap="wrap">
          {/* The map only plots current members. */}
          {axes && data.current && (
            <RouterLink
              to={`/political-compass?member=${ctx.memberId}&chamber=${ctx.chamber.toLowerCase()}`}
            >
              <Text fontSize="sm" color="accent" fontWeight="600">
                See on the Ideology Map →
              </Text>
            </RouterLink>
          )}
          <RouterLink to={voteHistoryUrl(ctx)}>
            <Text fontSize="sm" color="accent" fontWeight="600">
              See how they voted →
            </Text>
          </RouterLink>
        </Flex>
      </VStack>
    </Box>
  );
}
