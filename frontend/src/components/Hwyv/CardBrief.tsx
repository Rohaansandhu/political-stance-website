import { useEffect } from "react";
import { Badge, Box, Button, HStack, List, Text, VStack } from "@chakra-ui/react";
import { formatDate } from "../Legislators/percentiles";
import { chamberLabel } from "./display";
import type { BriefCard, StoredVote } from "./types";

const SHORTCUTS: Record<string, StoredVote> = { y: "yea", n: "nay", s: "skip" };

function isTyping(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  return (
    !!element &&
    (["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName) ||
      element.isContentEditable)
  );
}

// Before the vote: no sponsor, party, result or tally. They aren't in a brief
// card at all.
export default function CardBrief({
  card,
  onVote,
}: {
  card: BriefCard;
  onVote: (vote: StoredVote) => void;
}) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target)) return;
      const vote = SHORTCUTS[event.key.toLowerCase()];
      if (vote) onVote(vote);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onVote]);

  return (
    <VStack
      align="stretch"
      gap={5}
      bg="surface"
      p={{ base: 5, md: 8 }}
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      boxShadow="card"
    >
      <HStack gap={2} wrap="wrap">
        <Badge colorPalette="blue" variant="subtle" rounded="full">
          {chamberLabel(card.chamber)}
        </Badge>
        <Text fontSize="sm" color="textMuted">
          {formatDate(card.date)}
        </Text>
        {card.needs_two_thirds && (
          <Badge colorPalette="purple" variant="subtle" rounded="full">
            Needed 2/3
          </Badge>
        )}
        {card.omnibus && (
          <Badge colorPalette="orange" variant="subtle" rounded="full">
            Large package covering many topics
          </Badge>
        )}
      </HStack>

      <Box>
        <Text fontSize={{ base: "lg", md: "xl" }} color="text" lineHeight="tall">
          {card.brief}
        </Text>
        {card.popular_title && (
          <Text fontSize="sm" color="textMuted" mt={2}>
            Official title: {card.popular_title}
          </Text>
        )}
      </Box>

      <Box>
        <Text fontSize="xs" fontWeight="700" color="textMuted" mb={2} textTransform="uppercase" letterSpacing="wider">
          Key provisions
        </Text>
        <List.Root gap={2} ps={5} color="text">
          {card.key_provisions.map((provision) => (
            <List.Item key={provision}>{provision}</List.Item>
          ))}
        </List.Root>
      </Box>

      <HStack gap={3} wrap="wrap">
        <Button flex="1" minW="90px" colorPalette="green" onClick={() => onVote("yea")}>
          Yea
        </Button>
        <Button flex="1" minW="90px" colorPalette="red" onClick={() => onVote("nay")}>
          Nay
        </Button>
        <Button flex="1" minW="90px" variant="outline" onClick={() => onVote("skip")}>
          Skip
        </Button>
      </HStack>
      <Text
        fontSize="xs"
        color="textMuted"
        textAlign="center"
        display={{ base: "none", md: "block" }}
      >
        Press Y, N or S
      </Text>
    </VStack>
  );
}
