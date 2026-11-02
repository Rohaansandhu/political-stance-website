import { Badge, Box, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { formatDate } from "../Legislators/percentiles";
import AnalysisSection from "./AnalysisSection";
import {
  chamberLabel,
  didPass,
  PARTY_NAMES,
  PARTY_TOKENS,
  sharedWithParty,
  totalTally,
} from "./display";
import MemberLists from "./MemberLists";
import type { BriefCard, CastVote, PartyTally, RevealCard } from "./types";

function Section({ title, children }: { title: string; children: ReactNode }) {
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

function PartyBar({ party, tally }: { party: string; tally: PartyTally }) {
  const total = tally.yea + tally.nay + tally.not_voting;
  const segments = [
    { key: "yea", value: tally.yea, color: "voteYea" },
    { key: "nay", value: tally.nay, color: "voteNay" },
    { key: "not_voting", value: tally.not_voting, color: "voteOther" },
  ];

  return (
    <HStack gap={3}>
      <Text fontSize="sm" fontWeight="700" color={PARTY_TOKENS[party]} w="24px">
        {party}
      </Text>
      <HStack
        gap={0}
        flex="1"
        h="14px"
        rounded="full"
        overflow="hidden"
        bg="bgLightShade"
        role="img"
        aria-label={`${PARTY_NAMES[party]}: ${tally.yea} Yea, ${tally.nay} Nay, ${tally.not_voting} not voting`}
      >
        {segments.map(
          (segment) =>
            segment.value > 0 && (
              <Box
                key={segment.key}
                h="100%"
                bg={segment.color}
                style={{ width: `${(segment.value / total) * 100}%` }}
              />
            ),
        )}
      </HStack>
      <Text
        fontSize="xs"
        color="textMuted"
        w="88px"
        textAlign="right"
        fontVariantNumeric="tabular-nums"
      >
        {tally.yea} – {tally.nay} – {tally.not_voting}
      </Text>
    </HStack>
  );
}

function YourVoteLine({
  tally,
  vote,
}: {
  tally: Record<string, PartyTally>;
  vote: CastVote;
}) {
  const democrats = sharedWithParty(tally.D, vote);
  const republicans = sharedWithParty(tally.R, vote);
  if (democrats === null || republicans === null) return null;
  return (
    <Text color="text" fontWeight="600">
      You voted with {democrats}% of Democrats and {republicans}% of Republicans.
    </Text>
  );
}

function ResultSection({
  card,
  reveal,
  vote,
}: {
  card: BriefCard;
  reveal: RevealCard;
  vote: CastVote;
}) {
  const passed = didPass(reveal.result);
  const totals = totalTally(reveal.tally);
  const threshold = reveal.needs_two_thirds
    ? "2/3"
    : reveal.requires && reveal.requires !== "1/2"
      ? reveal.requires
      : null;

  return (
    <Section title={reveal.short_title}>
      <VStack align="stretch" gap={4}>
        <HStack gap={3} wrap="wrap">
          <Badge colorPalette={passed ? "green" : "red"} size="lg" rounded="full">
            {passed ? "Passed" : "Failed"}
          </Badge>
          <Text fontSize="xl" fontWeight="700" color="text" fontVariantNumeric="tabular-nums">
            {totals.yea} – {totals.nay}
          </Text>
          {threshold && (
            <Text fontSize="sm" color="textMuted">
              needed {threshold}
            </Text>
          )}
          <Text fontSize="sm" color="textMuted">
            {chamberLabel(card.chamber)} · {formatDate(card.date)}
          </Text>
        </HStack>

        <VStack align="stretch" gap={2}>
          {["D", "R", "I"]
            .filter((party) => {
              const t = reveal.tally[party];
              return t && t.yea + t.nay + t.not_voting > 0;
            })
            .map((party) => (
              <PartyBar key={party} party={party} tally={reveal.tally[party]} />
            ))}
          <HStack gap={4} justify="flex-end">
            <Text fontSize="xs" color="voteYea">Yea</Text>
            <Text fontSize="xs" color="voteNay">Nay</Text>
            <Text fontSize="xs" color="voteOther">Not voting</Text>
          </HStack>
        </VStack>

        <YourVoteLine tally={reveal.tally} vote={vote} />

        <HStack gap={4} wrap="wrap">
          {reveal.sponsor && (
            <Text fontSize="sm" color="textMuted">
              Sponsor: {reveal.sponsor}
              {reveal.sponsor_party && (
                <Text
                  as="span"
                  fontWeight="700"
                  color={PARTY_TOKENS[reveal.sponsor_party]}
                >
                  {" "}
                  ({reveal.sponsor_party})
                </Text>
              )}
            </Text>
          )}
          {reveal.source_url && (
            <Link
              href={reveal.source_url}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              color="primary"
            >
              Official roll call
            </Link>
          )}
        </HStack>
      </VStack>
    </Section>
  );
}

export default function CardReveal({
  card,
  reveal,
  vote,
  homeState,
}: {
  card: BriefCard;
  reveal: RevealCard;
  vote: CastVote;
  homeState: string | null;
}) {
  return (
    <VStack align="stretch" gap={4}>
      <ResultSection card={card} reveal={reveal} vote={vote} />
      <Section title="How current members voted">
        <MemberLists reveal={reveal} homeState={homeState} />
      </Section>
      <Section title="AI analysis">
        <AnalysisSection card={card} reveal={reveal} vote={vote} />
      </Section>
    </VStack>
  );
}
