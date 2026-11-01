import { useMemo } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import {
  filterCurrent,
  getScaledValue,
  clampToDomain,
  domainForScale,
  jitter,
  type RosterMember,
} from "../CongressData/axisStats";
import { subjectPoles } from "../CongressData/subjectDisplayName";
import { useChartTheme } from "../CongressData/chartTheme";
import type { Comparison, Side } from "./percentiles";

interface AxisFingerprintProps {
  axisId: string;
  memberId: string;
  party: string | undefined;
  roster: RosterMember[];
  comparison: Comparison;
  // null when the member has too few votes to place on the strip.
  selfSide: Side | null;
}

const STRIP_HEIGHT = 56;
const MIDLINE = STRIP_HEIGHT / 2;
const JITTER_AMPLITUDE = 18;

const SIDE_FILL: Record<Side, string> = {
  negative: "var(--chakra-colors-cyan-fg)",
  positive: "var(--chakra-colors-orange-fg)",
};

// One SVG per axis rather than a styled element per dot: a page draws 11 of
// these with 400+ members each, or 100 each in the Senate.
export default function AxisFingerprint({
  axisId,
  memberId,
  party,
  roster,
  comparison,
  selfSide,
}: AxisFingerprintProps) {
  const { partyColors } = useChartTheme();
  const scale = comparison === "party" ? "party" : "chamber";
  const domain = domainForScale(scale);
  const poles = subjectPoles("axes", axisId);
  const formerSelfId = roster.find((m) => m.member_id === memberId && !m.current)?.member_id;

  const points = useMemo(() => {
    const peers = filterCurrent(roster).filter(
      (m) => comparison === "chamber" || m.party === party,
    );
    // A former member isn't in the current roster but still gets plotted.
    const formerSelf = roster.find((m) => m.member_id === memberId && !m.current);
    return (formerSelf ? [...peers, formerSelf] : peers)
      .map((member) => {
        const raw = member.axes ? getScaledValue(member, axisId, scale) : null;
        if (raw === null || raw === undefined) return null;
        const { clamped, isPinned } = clampToDomain(raw, domain);
        return {
          member_id: member.member_id,
          party: member.party,
          pct: ((clamped - domain[0]) / (domain[1] - domain[0])) * 100,
          isPinned,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
    // domain is derived from scale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster, axisId, scale, comparison, party, memberId]);

  // Independents are too few for an average to mean anything.
  const partyAverages = useMemo(() => {
    return (["R", "D"] as const)
      .map((p) => {
        const group = points.filter(
          (point) => point.party === p && point.member_id !== formerSelfId,
        );
        if (group.length === 0) return null;
        return {
          party: p,
          pct: group.reduce((sum, point) => sum + point.pct, 0) / group.length,
        };
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);
  }, [points, formerSelfId]);

  const self =points.find((p) => p.member_id === memberId);

  if (points.length === 0) {
    return (
      <Box h={`${STRIP_HEIGHT}px`} display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xs" color="textMuted">
          Loading the {comparison === "party" ? "party" : "chamber"}…
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <svg
        width="100%"
        height={STRIP_HEIGHT}
        role="img"
        aria-label={`Where this member sits among ${points.length} peers, from ${poles.negative} to ${poles.positive}`}
        style={{ display: "block", overflow: "visible" }}
      >
        <line
          x1="0"
          x2="100%"
          y1={MIDLINE}
          y2={MIDLINE}
          stroke="var(--chakra-colors-border-subtle)"
        />
        {points
          .filter((p) => p.member_id !== memberId)
          .map((p) => (
            <circle
              key={p.member_id}
              cx={`${p.pct}%`}
              cy={MIDLINE + jitter(p.member_id, JITTER_AMPLITUDE)}
              r={2.5}
              fill={p.isPinned ? "none" : partyColors[p.party]}
              stroke={p.isPinned ? partyColors[p.party] : "none"}
              opacity={p.isPinned ? 0.7 : 0.3}
            />
          ))}
        {partyAverages.map((a) => (
          <line
            key={a.party}
            x1={`${a.pct}%`}
            x2={`${a.pct}%`}
            y1={2}
            y2={STRIP_HEIGHT - 2}
            stroke={partyColors[a.party]}
            strokeWidth={2}
          />
        ))}
        {self && selfSide && (
          <>
            <circle
              cx={`${self.pct}%`}
              cy={MIDLINE}
              r={9}
              fill="var(--chakra-colors-surface)"
              stroke={SIDE_FILL[selfSide]}
              strokeWidth={2.5}
            />
            <circle cx={`${self.pct}%`} cy={MIDLINE} r={4.5} fill={SIDE_FILL[selfSide]} />
          </>
        )}
      </svg>

      <HStack justify="space-between" mt={1} gap={4}>
        <Text fontSize="xs" color="cyan.fg">
          {poles.negative}
        </Text>
        <Text fontSize="xs" color="orange.fg" textAlign="right">
          {poles.positive}
        </Text>
      </HStack>
    </Box>
  );
}
