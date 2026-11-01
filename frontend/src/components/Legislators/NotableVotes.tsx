import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Center, Flex, Heading, Spinner, Tabs, Text, VStack } from "@chakra-ui/react";
import VoteRow from "./VoteRow";
import { useMemberVotes } from "./useMemberVotes";
import { voteHistoryUrl, type MemberContext } from "./percentiles";

const VISIBLE_VOTES = 5;

const EMPTY_MESSAGE: Record<string, string> = {
  broke: "Voted with most of their party on every scored vote.",
  defining: "No contested votes with a clear direction yet.",
  recent: "No recent scored votes.",
};

export default function NotableVotes({ ctx }: { ctx: MemberContext }) {
  const hasParty = ctx.party === "R" || ctx.party === "D";
  const [tab, setTab] = useState(hasParty ? "broke" : "defining");
  const { data, loading, error } = useMemberVotes(ctx.memberId, ctx.model, {
    filter: tab,
    limit: VISIBLE_VOTES,
  });

  return (
    <Box w="100%">
      <Flex justify="space-between" align="center" mb={2} wrap="wrap" gap={2}>
        <Heading size="md" color="text">
          Notable Votes
        </Heading>
        <RouterLink to={voteHistoryUrl(ctx)}>
          <Text fontSize="xs" color="accent" fontWeight="600">
            Full vote history →
          </Text>
        </RouterLink>
      </Flex>

      <Tabs.Root value={tab} onValueChange={(details) => setTab(details.value)} size="sm">
        <Tabs.List mb={3}>
          {hasParty && <Tabs.Trigger value="broke">Broke with party</Tabs.Trigger>}
          <Tabs.Trigger value="defining">Defining votes</Tabs.Trigger>
          <Tabs.Trigger value="recent">Recent</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {loading && (
        <Center py={6}>
          <Spinner />
        </Center>
      )}
      {error && (
        <Text fontSize="sm" color="textMuted">
          Couldn't load votes right now.
        </Text>
      )}
      {data && data.scored_total === 0 && (
        <Text fontSize="sm" color="textMuted">
          Vote details aren't available for this member yet.
        </Text>
      )}
      {data && data.scored_total > 0 && data.results.length === 0 && (
        <Text fontSize="sm" color="textMuted">
          {EMPTY_MESSAGE[tab]}
        </Text>
      )}
      {data && (
        <VStack align="stretch" gap={2}>
          {data.results.map((vote) => (
            <VoteRow key={vote.vote_id} vote={vote} model={ctx.model} />
          ))}
        </VStack>
      )}
    </Box>
  );
}
