import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Collapsible,
  HStack,
  Input,
  Link,
  NativeSelect,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronDown, Pin } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { lastName, PARTY_TOKENS } from "./display";
import type { RevealCard, RevealMember } from "./types";

const PARTY_FILTERS = ["All", "D", "R", "I"] as const;

function MemberRow({
  member,
  isHome,
}: {
  member: RevealMember;
  isHome: boolean;
}) {
  return (
    <HStack
      gap={2}
      py={1}
      px={2}
      rounded="md"
      bg={member.against_party ? "orange.subtle" : undefined}
    >
      {isHome && (
        <Box color="primary" flexShrink={0} aria-label="Your home state">
          <Pin size={12} />
        </Box>
      )}
      <Link asChild fontSize="sm" color="text" minW={0}>
        <RouterLink to={`/legislators/${member.member_id}`}>{member.name}</RouterLink>
      </Link>
      <Text fontSize="xs" fontWeight="700" color={PARTY_TOKENS[member.party]} flexShrink={0}>
        {member.party}-{member.state}
      </Text>
      {member.against_party && (
        <Text fontSize="xs" color="orange.fg" ms="auto" flexShrink={0}>
          Broke with party
        </Text>
      )}
    </HStack>
  );
}

function MemberColumn({
  title,
  color,
  members,
  homeState,
}: {
  title: string;
  color: string;
  members: RevealMember[];
  homeState: string | null;
}) {
  return (
    <Box minW={0}>
      <Text fontWeight="700" color={color} mb={2}>
        {title} ({members.length})
      </Text>
      <VStack align="stretch" gap={0} maxH="360px" overflowY="auto">
        {members.map((member) => (
          <MemberRow
            key={member.member_id}
            member={member}
            isHome={member.state === homeState}
          />
        ))}
        {members.length === 0 && (
          <Text fontSize="sm" color="textMuted">
            No one matches.
          </Text>
        )}
      </VStack>
    </Box>
  );
}

export default function MemberLists({
  reveal,
  homeState,
}: {
  reveal: RevealCard;
  homeState: string | null;
}) {
  const [query, setQuery] = useState("");
  const [party, setParty] = useState<(typeof PARTY_FILTERS)[number]>("All");
  const [stateFilter, setStateFilter] = useState("");

  const states = useMemo(
    () => [...new Set(reveal.members.map((m) => m.state))].sort(),
    [reveal.members],
  );

  // Home-state members first, then by last name.
  const sorted = useMemo(
    () =>
      [...reveal.members].sort(
        (a, b) =>
          Number(b.state === homeState) - Number(a.state === homeState) ||
          lastName(a.name).localeCompare(lastName(b.name)),
      ),
    [reveal.members, homeState],
  );

  const visible = sorted.filter(
    (m) =>
      (party === "All" || m.party === party) &&
      (!stateFilter || m.state === stateFilter) &&
      m.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const byVote = (vote: RevealMember["vote"]) =>
    visible.filter((m) => m.vote === vote);
  const notVoting = byVote("not_voting");

  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={3} wrap="wrap">
        <Input
          placeholder="Search by name"
          aria-label="Search members by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          flex="1"
          minW="180px"
          size="sm"
        />
        <HStack gap={1}>
          {PARTY_FILTERS.map((option) => (
            <Button
              key={option}
              size="xs"
              variant={party === option ? "solid" : "outline"}
              onClick={() => setParty(option)}
            >
              {option}
            </Button>
          ))}
        </HStack>
        <NativeSelect.Root size="sm" width="110px">
          <NativeSelect.Field
            aria-label="Filter by state"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <MemberColumn title="Yea" color="voteYea" members={byVote("yea")} homeState={homeState} />
        <MemberColumn title="Nay" color="voteNay" members={byVote("nay")} homeState={homeState} />
      </SimpleGrid>

      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <Button size="sm" variant="ghost" color="textMuted">
            Not voting ({notVoting.length})
            <ChevronDown size={14} />
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <SimpleGrid columns={{ base: 1, md: 2 }} gapX={6} mt={2}>
            {notVoting.map((member) => (
              <MemberRow
                key={member.member_id}
                member={member}
                isHome={member.state === homeState}
              />
            ))}
          </SimpleGrid>
        </Collapsible.Content>
      </Collapsible.Root>

      {reveal.not_in_office > 0 && (
        <Text fontSize="xs" color="textMuted">
          {reveal.not_in_office} current{" "}
          {reveal.not_in_office === 1 ? "member wasn't" : "members weren't"} in
          this chamber for this vote.
        </Text>
      )}
    </VStack>
  );
}
