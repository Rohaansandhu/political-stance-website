import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { fetchCard } from "../components/Hwyv/api";
import BetaBadge from "../components/Hwyv/BetaBadge";
import CardPlayer from "../components/Hwyv/CardPlayer";
import { deckPath, parseChamber } from "../components/Hwyv/display";
import { ChamberBar, VoteProgress } from "../components/Hwyv/PageChrome";
import { useHwyv } from "../components/Hwyv/store";
import type { BriefCard, Chamber } from "../components/Hwyv/types";

function CardLoader({ chamber, voteId }: { chamber: Chamber; voteId: string }) {
  const navigate = useNavigate();
  const { votes, castVotes, homeState, persisted } = useHwyv(chamber);
  const [card, setCard] = useState<BriefCard | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCard(null);
    setFailed(false);
    fetchCard(chamber, voteId)
      .then((data) => {
        if (!cancelled) setCard(data);
      })
      .catch((err) => {
        console.error("Error fetching card:", err);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chamber, voteId]);

  const handleNext = useCallback(() => {
    window.scrollTo(0, 0);
    navigate(deckPath(chamber));
  }, [chamber, navigate]);

  const stored = votes[voteId]?.vote;

  return (
    <VStack align="stretch" gap={5}>
      <ChamberBar
        chamber={chamber}
        homeState={homeState}
        voteCount={Object.keys(votes).length}
        persisted={persisted}
      />
      <VoteProgress chamber={chamber} count={castVotes.length} />
      {failed ? (
        <VStack gap={3} py={10}>
          <Text color="text" fontWeight="600">
            We couldn't find this card.
          </Text>
          <Button asChild size="sm" variant="outline">
            <RouterLink to={deckPath(chamber)}>Go to the deck</RouterLink>
          </Button>
        </VStack>
      ) : card ? (
        <CardPlayer
          key={card.vote_id}
          card={card}
          chamber={chamber}
          homeState={homeState}
          initialVote={stored === "yea" || stored === "nay" ? stored : null}
          onNext={handleNext}
        />
      ) : (
        <Center py={16}>
          <Spinner size="lg" color="primary" />
        </Center>
      )}
    </VStack>
  );
}

export default function HwyvCardPage() {
  const { chamber: chamberParam, vote_id: voteId } = useParams();
  const chamber = parseChamber(chamberParam);
  if (!chamber || !voteId) return <Navigate to="/how-would-you-vote" replace />;

  return (
    <Box minH="100vh" bg="bg">
      <Helmet>
        <title>{`How Would You Vote? | US PoliTrack`}</title>
      </Helmet>
      <Container maxW="3xl" py={8}>
        <HStack gap={3} mb={5} wrap="wrap">
          <Heading size="xl" color="text" letterSpacing="tight">
            How Would You Vote?
          </Heading>
          <BetaBadge />
        </HStack>
        <CardLoader key={`${chamber}|${voteId}`} chamber={chamber} voteId={voteId} />
      </Container>
    </Box>
  );
}
