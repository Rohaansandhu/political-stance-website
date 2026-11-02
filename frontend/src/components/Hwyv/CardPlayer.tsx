import { useCallback, useEffect, useState } from "react";
import { Button, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { fetchReveal } from "./api";
import CardBrief from "./CardBrief";
import CardReveal from "./CardReveal";
import { recordVote } from "./store";
import type {
  BriefCard,
  CastVote,
  Chamber,
  RevealCard,
  StoredVote,
} from "./types";

// One card from brief to reveal. Render with key={card.vote_id} so the next
// card starts over.
export default function CardPlayer({
  card,
  chamber,
  homeState,
  initialVote = null,
  onNext,
}: {
  card: BriefCard;
  chamber: Chamber;
  homeState: string | null;
  initialVote?: CastVote | null;
  onNext: () => void;
}) {
  const [vote, setVote] = useState<CastVote | null>(initialVote);
  const [reveal, setReveal] = useState<RevealCard | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!vote) return;
    let cancelled = false;
    setError(false);
    fetchReveal(chamber, card.vote_id)
      .then((data) => {
        if (!cancelled) setReveal(data);
      })
      .catch((err) => {
        console.error("Error fetching reveal:", err);
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [vote, chamber, card.vote_id, attempt]);

  const handleVote = useCallback(
    (choice: StoredVote) => {
      recordVote(chamber, card.vote_id, choice);
      if (choice === "skip") {
        onNext();
      } else {
        setVote(choice);
        window.scrollTo(0, 0);
      }
    },
    [chamber, card.vote_id, onNext],
  );

  if (!vote) return <CardBrief card={card} onVote={handleVote} />;

  if (error) {
    return (
      <Center py={16}>
        <VStack gap={3}>
          <Text color="voteNay">Couldn't load how this vote turned out.</Text>
          <Button size="sm" variant="outline" onClick={() => setAttempt(attempt + 1)}>
            Try again
          </Button>
        </VStack>
      </Center>
    );
  }

  if (!reveal) {
    return (
      <Center py={16}>
        <Spinner size="lg" color="primary" />
      </Center>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      <CardReveal card={card} reveal={reveal} vote={vote} homeState={homeState} />
      <Button colorPalette="green" onClick={onNext}>
        Next
      </Button>
    </VStack>
  );
}
