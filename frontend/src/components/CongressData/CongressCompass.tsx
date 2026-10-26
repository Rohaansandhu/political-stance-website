import { useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Center,
  Badge,
  Stat,
} from "@chakra-ui/react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useChartTheme } from "./chartTheme";
import { subjectDisplayName, subjectPoles } from "./subjectDisplayName";
import { findMatchingPreset, quadrantLabels } from "./compassPresets";
import { useAxisRoster } from "./useAxisRoster";
import { useAxisStatsDoc, lookupCorrelation } from "./useAxisStatsDoc";
import {
  filterCurrent,
  getScaledValue,
  clampToDomain,
  domainForScale,
  computePartyAverages,
  pearsonR,
  countExcludedForPartyScale,
  type ScaleMode,
  type RosterMember,
} from "./axisStats";
import type { Legislator } from "./histogramUtils";

interface CongressCompassProps {
  specHash: string;
  xAxis: string;
  yAxis: string;
  scaleMode: ScaleMode;
  selectedMemberId?: string | null;
  onSelect: (memberId: string | null) => void;
  onRosterLoaded?: (legislators: Legislator[]) => void;
}

interface PlottedPoint {
  member: RosterMember;
  x: number;
  y: number;
  rawX: number;
  rawY: number;
  isPinnedX: boolean;
  isPinnedY: boolean;
}

function diamondPoints(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}

export default function CongressCompass({
  specHash,
  xAxis,
  yAxis,
  scaleMode,
  selectedMemberId = null,
  onSelect,
  onRosterLoaded,
}: CongressCompassProps) {
  const chart = useChartTheme();
  const PARTY_COLORS = chart.partyColors;
  const { roster, loading, error } = useAxisRoster(specHash);
  const { stats: axisStatsDoc } = useAxisStatsDoc(specHash, true);

  const currentRoster = useMemo(() => filterCurrent(roster), [roster]);

  useEffect(() => {
    if (!onRosterLoaded || currentRoster.length === 0) return;
    onRosterLoaded(
      currentRoster.map((m) => ({
        member_id: m.member_id,
        official_full_name: m.official_full_name,
        party: m.party,
        state: m.state,
        score: m.axes[xAxis]?.score ?? 0,
        bill_count: m.axes[xAxis]?.bill_count ?? 0,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoster]);

  const domain = domainForScale(scaleMode);

  const points: PlottedPoint[] = useMemo(() => {
    const result: PlottedPoint[] = [];
    for (const member of currentRoster) {
      const rawX = getScaledValue(member, xAxis, scaleMode);
      const rawY = getScaledValue(member, yAxis, scaleMode);
      if (rawX === null || rawY === null) continue;

      const { clamped: x, isPinned: isPinnedX } = clampToDomain(rawX, domain);
      const { clamped: y, isPinned: isPinnedY } = clampToDomain(rawY, domain);

      result.push({ member, x, y, rawX, rawY, isPinnedX, isPinnedY });
    }
    return result;
  }, [currentRoster, xAxis, yAxis, scaleMode, domain]);

  const selectedPoint = useMemo(
    () => points.find((p) => p.member.member_id === selectedMemberId) ?? null,
    [points, selectedMemberId],
  );

  const plottedPoints = useMemo(() => {
    if (!selectedPoint) return points;
    const rest = points.filter((p) => p.member.member_id !== selectedPoint.member.member_id);
    return [...rest, selectedPoint];
  }, [points, selectedPoint]);

  const partyAverages = useMemo(() => {
    const averages = computePartyAverages(
      points.map((p) => ({ party: p.member.party, x: p.rawX, y: p.rawY })),
    );
    return (["D", "R", "I"] as const)
      .map((party) => {
        const avg = averages[party];
        if (!avg) return null;
        const { clamped: x } = clampToDomain(avg.x, domain);
        const { clamped: y } = clampToDomain(avg.y, domain);
        return { party, x, y, n: avg.n };
      })
      .filter((a): a is { party: "D" | "R" | "I"; x: number; y: number; n: number } => a !== null);
  }, [points, domain]);

  // Prefer the pipeline's precomputed correlation (it applies the same
  // minimum-bill-count cutoff as the chamber/party z-scores); fall back to
  // computing it from what's plotted if there's no precomputed entry.
  const precomputedR = lookupCorrelation(
    axisStatsDoc,
    scaleMode === "party" ? "party" : "raw",
    xAxis,
    yAxis,
  );
  const r = useMemo(
    () => precomputedR ?? pearsonR(points.map((p) => ({ x: p.rawX, y: p.rawY }))),
    [precomputedR, points],
  );

  const excludedX = scaleMode === "party" ? countExcludedForPartyScale(currentRoster, xAxis) : 0;
  const excludedY = scaleMode === "party" ? countExcludedForPartyScale(currentRoster, yAxis) : 0;

  const activePreset = findMatchingPreset(xAxis, yAxis);
  const quadrants = quadrantLabels(xAxis, yAxis, activePreset);
  const xPoles = subjectPoles("axes", xAxis);
  const yPoles = subjectPoles("axes", yAxis);

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="primary" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={20}>
        <Text color="voteNay" fontSize="lg">
          Error: {error}
        </Text>
      </Center>
    );
  }

  if (points.length < 2) {
    return (
      <Center py={20}>
        <VStack gap={1}>
          <Text color="text" fontSize="lg" fontWeight="600">
            Not enough data for this pair
          </Text>
          <Text color="textMuted" fontSize="sm">
            Too few current members have scores on both axes to plot.
          </Text>
        </VStack>
      </Center>
    );
  }

  const chamber = specHash.includes("senate") ? "Senate" : "House";
  const showPartyRepeatNote = Math.abs(r ?? 0) >= 0.9 && scaleMode !== "party" && r !== null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point: PlottedPoint = payload[0].payload;
      const color = PARTY_COLORS[point.member.party] ?? "#718096";
      const xEntry = point.member.axes[xAxis];
      const yEntry = point.member.axes[yAxis];

      return (
        <Box bg="surface" p={3} borderWidth="1px" borderColor="border" borderRadius="12px" shadow="lg">
          <Text fontWeight="bold" color="text">
            {point.member.official_full_name}
          </Text>
          <HStack gap={2} my={1}>
            <Badge bg={color} color="white" rounded="full">
              {point.member.party}
            </Badge>
            <Text fontSize="sm" color="textMuted">
              {point.member.state}
            </Text>
          </HStack>
          <VStack align="flex-start" gap={0} mt={2}>
            <Text fontSize="sm" color="textMuted">
              {subjectDisplayName("axes", xAxis)}: <b>{xEntry?.score.toFixed(3)}</b>{" "}
              ({((xEntry?.current_percentile_rank ?? 0) * 100).toFixed(0)}th pctile)
            </Text>
            <Text fontSize="sm" color="textMuted">
              {subjectDisplayName("axes", yAxis)}: <b>{yEntry?.score.toFixed(3)}</b>{" "}
              ({((yEntry?.current_percentile_rank ?? 0) * 100).toFixed(0)}th pctile)
            </Text>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  return (
    <VStack align="stretch" gap={6}>
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="flex-start" gap={1}>
          <Heading size="xl" color="text" letterSpacing="tight">
            {subjectDisplayName("axes", xAxis)} vs. {subjectDisplayName("axes", yAxis)}
          </Heading>
          <HStack gap={2}>
            <Badge colorPalette="blue" variant="subtle" rounded="full">{chamber}</Badge>
            <Badge colorPalette="purple" variant="subtle" rounded="full">
              {activePreset?.label ?? "Custom"}
            </Badge>
            <Text color="textMuted" fontSize="sm">
              {points.length} legislators plotted
            </Text>
          </HStack>
        </VStack>
      </HStack>

      {/* Compass chart */}
      <Box bg="surface" p={6} rounded="card" borderWidth="1px" borderColor="border" boxShadow="card">
        <Grid templateColumns="minmax(110px, auto) 1fr minmax(110px, auto)" templateRows="auto 350px auto" gap={2}>
          <GridItem textAlign="left" alignSelf="end">
            <Text fontSize="2xs" color="textMuted" fontStyle="italic">
              {quadrants.tl}
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Text fontSize="xs" fontWeight="700" color="orange.fg">
              ↑ {yPoles.positive}
            </Text>
          </GridItem>
          <GridItem textAlign="right" alignSelf="end">
            <Text fontSize="2xs" color="textMuted" fontStyle="italic">
              {quadrants.tr}
            </Text>
          </GridItem>

          <GridItem display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="xs" color="textMuted" fontWeight="600" textAlign="center" whiteSpace="normal">
              ← {xPoles.negative}
            </Text>
          </GridItem>
          <GridItem>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <ReferenceLine x={0} stroke={chart.grid} strokeWidth={1} />
                <ReferenceLine y={0} stroke={chart.grid} strokeWidth={1} />

                <XAxis
                  type="number"
                  dataKey="x"
                  domain={domain}
                  tickLine={false}
                  axisLine={{ stroke: chart.grid }}
                  tick={{ fill: chart.tick, fontSize: 11 }}
                  tickFormatter={(v: number) => v.toFixed(1)}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={domain}
                  tickLine={false}
                  axisLine={{ stroke: chart.grid }}
                  tick={{ fill: chart.tick, fontSize: 11 }}
                  tickFormatter={(v: number) => v.toFixed(1)}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} isAnimationActive={false} />

                <Scatter
                  data={plottedPoints}
                  isAnimationActive={false}
                  shape={(props: any) => {
                    const point: PlottedPoint = props.payload;
                    const isSelected = point.member.member_id === selectedMemberId;
                    const color = PARTY_COLORS[point.member.party] ?? "#718096";
                    const isPinned = point.isPinnedX || point.isPinnedY;
                    const isIndependent = point.member.party === "I";
                    const handleClick = () => onSelect(point.member.member_id);

                    if (isSelected) {
                      const name = point.member.official_full_name;
                      const pillWidth = name.length * 7 + 20;
                      const labelY = props.cy - 20;
                      return (
                        <g onClick={handleClick} style={{ cursor: "pointer" }}>
                          <circle cx={props.cx} cy={props.cy} r={16} fill="var(--chakra-colors-primary)" fillOpacity={0.25} />
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={9}
                            fill={color}
                            stroke="var(--chakra-colors-primary)"
                            strokeWidth={3}
                            style={{ filter: "drop-shadow(0 0 8px var(--chakra-colors-primary))" }}
                          />
                          <rect x={props.cx - pillWidth / 2} y={labelY - 16} width={pillWidth} height={22} rx={11} fill="var(--chakra-colors-primary)" />
                          <text x={props.cx} y={labelY} textAnchor="middle" fontSize={12} fontWeight={800} fill="#0a0f0d">
                            {name}
                          </text>
                        </g>
                      );
                    }

                    if (isIndependent) {
                      return (
                        <polygon
                          points={diamondPoints(props.cx, props.cy, 5)}
                          fill={isPinned ? "none" : color}
                          fillOpacity={isPinned ? 1 : 0.7}
                          stroke={color}
                          strokeWidth={isPinned ? 2 : 0}
                          onClick={handleClick}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    }

                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill={isPinned ? "none" : color}
                        fillOpacity={isPinned ? 1 : 0.7}
                        stroke={isPinned ? color : undefined}
                        strokeWidth={isPinned ? 2 : 0}
                        onClick={handleClick}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  }}
                />

                <Scatter
                  data={partyAverages}
                  isAnimationActive={false}
                  shape={(props: any) => {
                    const color = PARTY_COLORS[props.payload.party as "D" | "R" | "I"] ?? "#718096";
                    const r = 7;
                    return (
                      <g>
                        <line x1={props.cx - r} y1={props.cy} x2={props.cx + r} y2={props.cy} stroke={color} strokeWidth={3} />
                        <line x1={props.cx} y1={props.cy - r} x2={props.cx} y2={props.cy + r} stroke={color} strokeWidth={3} />
                      </g>
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </GridItem>
          <GridItem display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="xs" color="textMuted" fontWeight="600" textAlign="center" whiteSpace="normal">
              {xPoles.positive} →
            </Text>
          </GridItem>

          <GridItem textAlign="left" alignSelf="start">
            <Text fontSize="2xs" color="textMuted" fontStyle="italic">
              {quadrants.bl}
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Text fontSize="xs" fontWeight="700" color="cyan.fg">
              ↓ {yPoles.negative}
            </Text>
          </GridItem>
          <GridItem textAlign="right" alignSelf="start">
            <Text fontSize="2xs" color="textMuted" fontStyle="italic">
              {quadrants.br}
            </Text>
          </GridItem>
        </Grid>

        {/* Legend */}
        <HStack justify="center" mt={4} gap={6} wrap="wrap">
          <HStack>
            <Box w="10px" h="10px" rounded="full" bg={PARTY_COLORS.D} />
            <Text fontSize="sm" color="textMuted">Democrats</Text>
          </HStack>
          <HStack>
            <Box w="10px" h="10px" rounded="full" bg={PARTY_COLORS.R} />
            <Text fontSize="sm" color="textMuted">Republicans</Text>
          </HStack>
          <HStack>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polygon points="5,0 10,5 5,10 0,5" fill={PARTY_COLORS.I} />
            </svg>
            <Text fontSize="sm" color="textMuted">Independents</Text>
          </HStack>
          <Text fontSize="xs" color="textMuted">Hollow = beyond ±3</Text>
        </HStack>
      </Box>

      {/* Stats */}
      <HStack gap={4} wrap="wrap">
        <Stat.Root bg="surface" p={4} rounded="card" borderWidth="1px" borderColor="border" boxShadow="card" flex="1" minW="200px">
          <Stat.Label>
            <Badge colorPalette="purple" variant="subtle" rounded="full" mb={2}>
              Correlation
            </Badge>
          </Stat.Label>
          <Stat.ValueText fontSize="2xl" color="text" fontVariantNumeric="tabular-nums">
            {r !== null ? r.toFixed(3) : "—"}
          </Stat.ValueText>
          <Stat.HelpText color="textMuted">
            {subjectDisplayName("axes", xAxis)} vs. {subjectDisplayName("axes", yAxis)}
          </Stat.HelpText>
        </Stat.Root>
      </HStack>

      {showPartyRepeatNote && (
        <Text fontSize="sm" color="textMuted" fontStyle="italic">
          This view mostly just repeats party affiliation (|r| ≥ 0.9) — try "Vs. own party" to see within-party variation.
        </Text>
      )}

      {(excludedX > 0 || excludedY > 0) && (
        <Text fontSize="xs" color="textMuted">
          {excludedX > 0 && `${excludedX} member(s) omitted on ${subjectDisplayName("axes", xAxis)} (no within-party z-score)`}
          {excludedX > 0 && excludedY > 0 && " · "}
          {excludedY > 0 && `${excludedY} member(s) omitted on ${subjectDisplayName("axes", yAxis)} (no within-party z-score)`}
        </Text>
      )}
    </VStack>
  );
}
