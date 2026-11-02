import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink, Navigate, useParams } from "react-router-dom";
import CongressCompass from "../components/CongressData/CongressCompass";
import { axisName } from "../components/Legislators/percentiles";
import { postMatch, specHashFor } from "../components/Hwyv/api";
import BetaBadge from "../components/Hwyv/BetaBadge";
import {
  chamberLabel,
  deckPath,
  PARTY_NAMES,
  PARTY_TOKENS,
  parseChamber,
} from "../components/Hwyv/display";
import { ChamberBar, VoteProgress } from "../components/Hwyv/PageChrome";
import { MATCH_UNLOCK_VOTES, useHwyv } from "../components/Hwyv/store";
import type { Chamber, MatchResult, MatchRow } from "../components/Hwyv/types";

const MIN_AXIS_VOTES = 3;
const POSITION_AXES = [
  "left_right",
  "economic",
  "state_power",
  "fiscal",
  "security",
  "trade",
  "federalism",
  "social",
  "global",
  "executive_power",
];

function percent(share: number): string {
  return `${Math.round(share * 100)}%`;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      bg="surface"
      p={{ base: 5, md: 6 }}
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      boxShadow="card"
    >
      <Heading size="md" color="text" mb={4}>
        {title}
      </Heading>
      {children}
    </Box>
  );
}

function PartyBars({ parties }: { parties: Record<string, number> }) {
  return (
    <VStack align="stretch" gap={3}>
      {["D", "R"]
        .filter((party) => parties[party] != null)
        .map((party) => (
          <Box key={party}>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm" color="text">
                {PARTY_NAMES[party]}
              </Text>
              <Text fontSize="sm" fontWeight="700" color={PARTY_TOKENS[party]}>
                {percent(parties[party])}
              </Text>
            </HStack>
            <Box h="10px" rounded="full" bg="bgLightShade" overflow="hidden">
              <Box
                h="100%"
                bg={PARTY_TOKENS[party]}
                style={{ width: percent(parties[party]) }}
              />
            </Box>
          </Box>
        ))}
    </VStack>
  );
}

function MemberRows({ rows }: { rows: MatchRow[] }) {
  if (rows.length === 0) {
    return (
      <Text fontSize="sm" color="textMuted">
        No members share enough votes with you yet.
      </Text>
    );
  }
  return (
    <VStack align="stretch" gap={2}>
      {rows.map((row) => (
        <HStack key={row.member_id} justify="space-between" gap={3}>
          <Box minW={0}>
            <HStack gap={2}>
              <Link asChild fontSize="sm" fontWeight="600" color="text">
                <RouterLink to={`/legislators/${row.member_id}`}>
                  {row.name}
                </RouterLink>
              </Link>
              <Text fontSize="xs" fontWeight="700" color={PARTY_TOKENS[row.party]} flexShrink={0}>
                {row.party}-{row.state}
              </Text>
            </HStack>
            <Text fontSize="xs" color="textMuted">
              agreed on {row.agreed} of {row.shared}
            </Text>
          </Box>
          <Text fontWeight="700" color="text" fontVariantNumeric="tabular-nums">
            {percent(row.agree)}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}

function CategoryAccordion({ result }: { result: MatchResult }) {
  const categories = Object.entries(result.by_category).sort(
    ([, a], [, b]) => b.n_votes - a.n_votes,
  );
  if (categories.length === 0) {
    return (
      <Text fontSize="sm" color="textMuted">
        Vote on at least 3 bills in a category to see it here.
      </Text>
    );
  }
  return (
    <Accordion.Root collapsible multiple>
      {categories.map(([name, entry]) => (
        <Accordion.Item key={name} value={name}>
          <Accordion.ItemTrigger>
            <HStack flex="1" justify="space-between" gap={3}>
              <Text fontSize="sm" fontWeight="600" color="text">
                {name}
              </Text>
              <Badge variant="subtle" rounded="full">
                {entry.n_votes} votes
              </Badge>
            </HStack>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <MemberRows rows={entry.top} />
                <PartyBars parties={entry.party} />
              </SimpleGrid>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

function AxisPicker({
  label,
  value,
  other,
  placed,
  onChange,
}: {
  label: string;
  value: string;
  other: string;
  placed: string[];
  onChange: (axis: string) => void;
}) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="700" color="textMuted" mb={1}>
        {label}
      </Text>
      <Wrap gap={1}>
        {POSITION_AXES.map((axis) => (
          <Button
            key={axis}
            size="xs"
            variant={axis === value ? "solid" : "outline"}
            disabled={!placed.includes(axis) || axis === other}
            onClick={() => onChange(axis)}
          >
            {axisName(axis)}
          </Button>
        ))}
      </Wrap>
    </Box>
  );
}

function PositionPanel({
  chamber,
  result,
}: {
  chamber: Chamber;
  result: MatchResult;
}) {
  const axes = result.axes;
  const placed = useMemo(
    () =>
      POSITION_AXES.filter((axis) => axes?.[axis]?.chamber_z != null).sort(
        (a, b) => (axes?.[b]?.n_votes ?? 0) - (axes?.[a]?.n_votes ?? 0),
      ),
    [axes],
  );
  const [xChoice, setX] = useState("economic");
  const [yChoice, setY] = useState("state_power");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  if (!axes) {
    return (
      <Text fontSize="sm" color="textMuted">
        We can't place you on the compass: {result.reason}.
      </Text>
    );
  }

  // Falls back to the axes with the most votes when a choice isn't unlocked.
  // Left-right comes last, since it mostly repeats whichever axis it's paired with.
  const fallbacks = [
    ...placed.filter((a) => a !== "left_right"),
    ...placed.filter((a) => a === "left_right"),
  ];
  const xAxis = placed.includes(xChoice)
    ? xChoice
    : (fallbacks.find((a) => a !== yChoice) ?? xChoice);
  const yAxis = placed.includes(yChoice)
    ? yChoice
    : (fallbacks.find((a) => a !== xAxis) ?? yChoice);
  const canPlot = placed.includes(xAxis) && placed.includes(yAxis) && xAxis !== yAxis;
  const locked = POSITION_AXES.filter((axis) => !placed.includes(axis));

  return (
    <VStack align="stretch" gap={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <AxisPicker label="Across" value={xAxis} other={yAxis} placed={placed} onChange={setX} />
        <AxisPicker label="Up" value={yAxis} other={xAxis} placed={placed} onChange={setY} />
      </SimpleGrid>

      {locked.length > 0 && (
        <VStack align="stretch" gap={0}>
          {locked.map((axis) => {
            const needed = MIN_AXIS_VOTES - (result.axis_progress?.[axis] ?? 0);
            return (
              <Text key={axis} fontSize="xs" color="textMuted">
                {axisName(axis)}:{" "}
                {needed > 0
                  ? `Vote on ${needed} more ${needed === 1 ? "bill" : "bills"} about this to unlock.`
                  : "There's no chamber comparison for this yet."}
              </Text>
            );
          })}
        </VStack>
      )}

      {canPlot ? (
        <CongressCompass
          specHash={specHashFor(chamber)}
          xAxis={xAxis}
          yAxis={yAxis}
          scaleMode="agreement"
          selectedMemberId={selectedMember}
          onSelect={setSelectedMember}
          userPoint={{ x: axes[xAxis]!.chamber_z!, y: axes[yAxis]!.chamber_z! }}
        />
      ) : (
        <Text fontSize="sm" color="textMuted">
          Vote on more bills to place yourself on two axes.
        </Text>
      )}

      <Text fontSize="sm" color="textMuted">
        Your position is based on few votes and will move as you vote more.
      </Text>
    </VStack>
  );
}

function Results({ chamber }: { chamber: Chamber }) {
  const { castVotes } = useHwyv(chamber);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // A stable key, since castVotes is rebuilt on every render
  const votesKey = JSON.stringify(castVotes);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    postMatch(chamber, JSON.parse(votesKey))
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chamber, votesKey, attempt]);

  if (failed) {
    return (
      <VStack gap={3} py={10}>
        <Text color="voteNay">Couldn't work out your matches.</Text>
        <Button size="sm" variant="outline" onClick={() => setAttempt(attempt + 1)}>
          Try again
        </Button>
      </VStack>
    );
  }

  if (!result) {
    return (
      <Center py={16}>
        <Spinner size="lg" color="primary" />
      </Center>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      <Panel title="Your agreement with each party">
        <PartyBars parties={result.party_agreement} />
        <Text fontSize="sm" color="textMuted" mt={3}>
          Based on {result.n_votes} votes.
        </Text>
      </Panel>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Panel title="Closest members">
          <MemberRows rows={result.matches.top} />
        </Panel>
        <Panel title="Farthest members">
          <MemberRows rows={result.matches.bottom} />
        </Panel>
      </SimpleGrid>

      <Panel title="By category">
        <CategoryAccordion result={result} />
      </Panel>

      <Panel title="Your position">
        <PositionPanel chamber={chamber} result={result} />
      </Panel>

      <Button asChild colorPalette="green">
        <RouterLink to={deckPath(chamber)}>Keep voting</RouterLink>
      </Button>
    </VStack>
  );
}

export default function HwyvMatchesPage() {
  const { chamber: chamberParam } = useParams();
  const chamber = parseChamber(chamberParam);
  const { castVotes, votes, homeState, persisted } = useHwyv(chamber);

  if (!chamber) return <Navigate to="/how-would-you-vote" replace />;

  return (
    <Box minH="100vh" bg="bg">
      <Helmet>
        <title>{`Your ${chamberLabel(chamber)} Matches | US PoliTrack`}</title>
      </Helmet>
      <Container maxW="5xl" py={8}>
        <VStack align="stretch" gap={5}>
          <HStack gap={3} wrap="wrap">
            <Heading size="2xl" color="text" letterSpacing="tight">
              Your matches
            </Heading>
            <BetaBadge size="md" />
          </HStack>
          <ChamberBar
            chamber={chamber}
            homeState={homeState}
            voteCount={Object.keys(votes).length}
            persisted={persisted}
          />
          {castVotes.length < MATCH_UNLOCK_VOTES ? (
            <VStack align="stretch" gap={4}>
              <VoteProgress chamber={chamber} count={castVotes.length} />
              <Button asChild colorPalette="green" alignSelf="flex-start">
                <RouterLink to={deckPath(chamber)}>Keep voting</RouterLink>
              </Button>
            </VStack>
          ) : (
            <Results chamber={chamber} />
          )}
        </VStack>
      </Container>
    </Box>
  );
}
