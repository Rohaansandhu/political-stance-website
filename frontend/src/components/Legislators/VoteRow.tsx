import { Badge, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  SIDE_COLOR,
  axisName,
  axisPolePhrases,
  formatBillId,
  formatDate,
} from "./percentiles";
import type { MemberVote } from "./types";

const PARTY_ORDER = ["R", "D", "I"];
const MAX_MOVED_TAGS = 3;

function formatPartySplit(split: MemberVote["party_split"]): string {
  return PARTY_ORDER.filter((party) => split[party])
    .map((party) => `${party} ${split[party].yea}–${split[party].nay}`)
    .join(" · ");
}

function MovedTags({ vote }: { vote: MemberVote }) {
  const axes = vote.axes
    .filter((a) => a.axis !== "institutional")
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, MAX_MOVED_TAGS);

  // A near-unanimous vote says little about direction, so it only names its
  // topics instead of pointing at a pole.
  if (axes.length === 0 || !vote.contested) {
    return (
      <>
        {vote.categories.slice(0, MAX_MOVED_TAGS).map((c) => (
          <Badge key={c.name} variant="subtle" fontSize="2xs" whiteSpace="normal">
            {c.name}
          </Badge>
        ))}
      </>
    );
  }

  return (
    <>
      {axes.map((a) => {
        const side = a.impact > 0 ? "positive" : "negative";
        return (
          <Text key={a.axis} fontSize="xs" color={SIDE_COLOR[side]}>
            {axisName(a.axis)} → {axisPolePhrases(a.axis)[side]}
          </Text>
        );
      })}
    </>
  );
}

export default function VoteRow({
  vote,
  model,
}: {
  vote: MemberVote;
  model: string;
}) {
  const split = formatPartySplit(vote.party_split);

  return (
    <Box
      px={3}
      py={2}
      bg="surface"
      rounded="md"
      borderWidth="1px"
      borderColor="borderSubtle"
      opacity={vote.contested ? 1 : 0.85}
    >
      <Flex justify="space-between" align="flex-start" gap={3}>
        <VStack align="flex-start" gap={0.5} flex={1} minW={0}>
          <RouterLink to={`/bill-analyses/${vote.bill_id}/${model}`}>
            <Text fontSize="sm" fontWeight="600" color="text" _hover={{ textDecoration: "underline" }}>
              {vote.title ?? formatBillId(vote.bill_id)}
            </Text>
          </RouterLink>
          {vote.summary && (
            <Text fontSize="xs" color="textMuted" lineClamp={2}>
              {vote.summary}
            </Text>
          )}
          <Text fontSize="xs" color="textMuted">
            {formatBillId(vote.bill_id)} · {formatDate(vote.date)}
          </Text>
        </VStack>
        <VStack gap={1} align="flex-end" flexShrink={0}>
          <Text
            fontSize="xs"
            fontWeight="700"
            color={vote.vote === "Yea" ? "voteYea" : "voteNay"}
          >
            Voted {vote.vote}
          </Text>
          {vote.broke_with_party && (
            <Badge colorPalette="purple" variant="subtle" fontSize="2xs">
              Against party
            </Badge>
          )}
        </VStack>
      </Flex>
      <HStack gap={3} mt={1.5} wrap="wrap" rowGap={1}>
        {split && (
          <Text fontSize="xs" color="text" fontWeight="500">
            {split}
          </Text>
        )}
        {!vote.contested && split && (
          <Text fontSize="xs" color="textMuted">
            Near-unanimous
          </Text>
        )}
        <MovedTags vote={vote} />
      </HStack>
    </Box>
  );
}
