import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  NativeSelect,
  SimpleGrid,
  Spinner,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import politicalCategories from "../../data/politicalCategories.json";
import { fetchDeck } from "../components/Hwyv/api";
import CardPlayer from "../components/Hwyv/CardPlayer";
import { chamberLabel, deckPath, parseChamber } from "../components/Hwyv/display";
import { ChamberBar, VoteProgress } from "../components/Hwyv/PageChrome";
import { useHwyv, votedIds } from "../components/Hwyv/store";
import type { BriefCard, Chamber } from "../components/Hwyv/types";

const DECK_SIZE = 20;
const CATEGORIES = politicalCategories.political_categories.map((c) => c.name);

type DeckTab = "featured" | "random" | "category";

function ChamberPicker() {
  const { voteCount } = useHwyv(null);
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      {(["house", "senate"] as Chamber[]).map((chamber) => (
        <Box
          key={chamber}
          asChild
          bg="surface"
          p={8}
          rounded="card"
          borderWidth="1px"
          borderColor="border"
          boxShadow="card"
          transition="all 0.2s"
          _hover={{ boxShadow: "cardHover", borderColor: "primary" }}
        >
          <RouterLink to={deckPath(chamber)}>
            <Heading size="lg" color="text" mb={1}>
              {chamberLabel(chamber)}
            </Heading>
            <Text color="textMuted">
              {voteCount(chamber) > 0
                ? `${voteCount(chamber)} votes cast`
                : `Vote on bills that came to the ${chamberLabel(chamber)} floor`}
            </Text>
          </RouterLink>
        </Box>
      ))}
    </SimpleGrid>
  );
}

function Deck({
  chamber,
  tab,
  category,
  homeState,
}: {
  chamber: Chamber;
  tab: DeckTab;
  category: string;
  homeState: string | null;
}) {
  const [cards, setCards] = useState<BriefCard[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Bumped to fetch another batch once this one runs out.
  const [batch, setBatch] = useState(0);
  // One seed per visit, so a shuffled deck stays in order as it's voted through.
  const [seed] = useState(() => String(Date.now()));

  const waitingForCategory = tab === "category" && !category;

  useEffect(() => {
    if (waitingForCategory) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchDeck(chamber, {
      deck: tab === "featured" ? "featured" : "random",
      category: tab === "category" ? category : undefined,
      limit: DECK_SIZE,
      exclude: votedIds(chamber),
      seed,
    })
      .then((data) => {
        if (cancelled) return;
        setCards(data);
        setIndex(0);
      })
      .catch((err) => {
        console.error("Error fetching deck:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [chamber, tab, category, batch, seed, waitingForCategory]);

  const handleNext = useCallback(() => {
    window.scrollTo(0, 0);
    if (index + 1 >= cards.length) setBatch((b) => b + 1);
    setIndex(index + 1);
  }, [index, cards.length]);

  if (waitingForCategory) {
    return (
      <Text color="textMuted" textAlign="center" py={10}>
        Pick a category to get bills on that topic.
      </Text>
    );
  }

  if (error) {
    return (
      <Center py={16}>
        <VStack gap={3}>
          <Text color="voteNay">Couldn't load this deck.</Text>
          <Button size="sm" variant="outline" onClick={() => setBatch(batch + 1)}>
            Try again
          </Button>
        </VStack>
      </Center>
    );
  }

  const card = cards[index];
  if (loading || (!card && cards.length > 0)) {
    return (
      <Center py={16}>
        <Spinner size="lg" color="primary" />
      </Center>
    );
  }

  if (!card) {
    return (
      <VStack gap={3} py={10}>
        <Text color="text" fontWeight="600">
          You've been through every card in this deck.
        </Text>
        <Text color="textMuted" fontSize="sm" textAlign="center">
          Try another deck. To see skipped cards again, clear your votes from
          settings.
        </Text>
      </VStack>
    );
  }

  return (
    <CardPlayer
      key={card.vote_id}
      card={card}
      chamber={chamber}
      homeState={homeState}
      onNext={handleNext}
    />
  );
}

export default function HowWouldYouVotePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chamber = parseChamber(searchParams.get("chamber"));
  const tabParam = searchParams.get("deck");
  const tab: DeckTab =
    tabParam === "random" || tabParam === "category" ? tabParam : "featured";
  const category = searchParams.get("category") ?? "";
  const { homeState, persisted, votes, castVotes } = useHwyv(chamber);

  const setTab = (value: DeckTab) => {
    setSearchParams(
      { chamber: chamber!, deck: value, ...(category ? { category } : {}) },
      { replace: true },
    );
  };
  const setCategory = (value: string) => {
    setSearchParams(
      { chamber: chamber!, deck: "category", ...(value ? { category: value } : {}) },
      { replace: true },
    );
  };

  return (
    <Box minH="100vh" bg="bg">
      <Helmet>
        <title>{`How Would You Vote? | US PoliTrack`}</title>
        <meta
          name="description"
          content="Vote on real bills that came to the floor of the House and Senate, then see how the result, your representatives, and the AI analysis compare. Your votes stay in your browser."
        />
      </Helmet>
      <Container maxW="3xl" py={8}>
        <VStack align="stretch" gap={5}>
          <Box>
            <Heading size="2xl" mb={2} color="text" letterSpacing="tight">
              How Would You Vote?
            </Heading>
            <Text fontSize="lg" color="textMuted">
              Read a real bill, cast your vote, then see how Congress voted.
              Your votes stay in this browser.
            </Text>
          </Box>

          {!chamber ? (
            <ChamberPicker />
          ) : (
            <>
              <ChamberBar
                chamber={chamber}
                homeState={homeState}
                voteCount={Object.keys(votes).length}
                persisted={persisted}
              />
              <VoteProgress chamber={chamber} count={castVotes.length} />

              <HStack gap={4} wrap="wrap" justify="space-between">
                <Tabs.Root
                  value={tab}
                  onValueChange={(details) => setTab(details.value as DeckTab)}
                >
                  <Tabs.List>
                    <Tabs.Trigger value="featured">Featured</Tabs.Trigger>
                    <Tabs.Trigger value="random">Random</Tabs.Trigger>
                    <Tabs.Trigger value="category">By category</Tabs.Trigger>
                  </Tabs.List>
                </Tabs.Root>
                {tab === "category" && (
                  <NativeSelect.Root size="sm" maxW="260px">
                    <NativeSelect.Field
                      aria-label="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Choose a category</option>
                      {CATEGORIES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                )}
              </HStack>

              <Deck
                key={`${chamber}|${tab}|${category}`}
                chamber={chamber}
                tab={tab}
                category={category}
                homeState={homeState}
              />
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
