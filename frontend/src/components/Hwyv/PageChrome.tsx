import { Box, Button, HStack, Link, Progress, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { chamberLabel, deckPath, matchesPath } from "./display";
import SettingsMenu from "./SettingsMenu";
import { MATCH_UNLOCK_VOTES } from "./store";
import type { Chamber } from "./types";

export function VoteProgress({
  chamber,
  count,
}: {
  chamber: Chamber;
  count: number;
}) {
  if (count >= MATCH_UNLOCK_VOTES) {
    return (
      <HStack justify="space-between" wrap="wrap" gap={2}>
        <Text fontSize="sm" color="textMuted">
          {count} votes cast
        </Text>
        <Button asChild size="sm" colorPalette="green" variant="subtle">
          <RouterLink to={matchesPath(chamber)}>See your matches</RouterLink>
        </Button>
      </HStack>
    );
  }
  return (
    <Box>
      <Text fontSize="sm" color="textMuted" mb={1}>
        {count} / {MATCH_UNLOCK_VOTES} votes to unlock matches
      </Text>
      <Progress.Root value={(count / MATCH_UNLOCK_VOTES) * 100} size="xs" colorPalette="green">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </Box>
  );
}

export function ChamberBar({
  chamber,
  homeState,
  voteCount,
  persisted,
}: {
  chamber: Chamber;
  homeState: string | null;
  voteCount: number;
  persisted: boolean;
}) {
  const other = chamber === "house" ? "senate" : "house";
  return (
    <VStack align="stretch" gap={1}>
      <HStack justify="space-between" gap={3}>
        <Text color="text" fontWeight="600">
          {chamberLabel(chamber)}
          <Link asChild ms={3} fontSize="sm" fontWeight="400" color="primary">
            <RouterLink to={deckPath(other)}>
              Switch to {chamberLabel(other)}
            </RouterLink>
          </Link>
        </Text>
        <SettingsMenu chamber={chamber} homeState={homeState} voteCount={voteCount} />
      </HStack>
      {!persisted && (
        <Text fontSize="xs" color="orange.fg">
          This browser is blocking storage, so your votes will be lost when you
          leave. Export them from settings to keep them.
        </Text>
      )}
    </VStack>
  );
}
