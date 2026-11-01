import { Link as RouterLink } from "react-router-dom";
import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Menu,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ExternalLink, MoreHorizontal, Phone } from "lucide-react";
import { displayName } from "./percentiles";
import type { LeadershipRole, LegislatorData, Term } from "./types";

const SPEAKER_TITLE = "Speaker of the House";
// Terms closer together than this count as continuous service.
const TERM_GAP_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

function currentRoles(roles: LeadershipRole[] = []): LeadershipRole[] {
  const now = new Date();
  return roles.filter((role) => !role.end || new Date(role.end) >= now);
}

// Earliest start of the unbroken run of Speaker roles, which are stored per congress.
function speakerSince(roles: LeadershipRole[] = []): Date | null {
  const speakerRoles = roles
    .filter((role) => role.title === SPEAKER_TITLE)
    .sort((a, b) => a.start.localeCompare(b.start));
  let start: string | null = null;
  let previousEnd: string | undefined;
  for (const role of speakerRoles) {
    if (start === null || previousEnd !== role.start) start = role.start;
    previousEnd = role.end;
  }
  return start ? new Date(`${start}T12:00:00`) : null;
}

function inChamberSinceYear(terms: Term[]): string | null {
  const current = terms[terms.length - 1];
  if (!current) return null;
  let start = current.start;
  for (let i = terms.length - 2; i >= 0; i--) {
    const term = terms[i];
    const gap = new Date(start).getTime() - new Date(term.end).getTime();
    if (term.type !== current.type || gap > TERM_GAP_DAYS * DAY_MS) break;
    start = term.start;
  }
  return start.slice(0, 4);
}

// Election Day: the Tuesday after the first Monday of November.
function electionDay(year: number): Date {
  const firstOfMonth = new Date(year, 10, 1);
  const daysToMonday = (8 - firstOfMonth.getDay()) % 7;
  return new Date(year, 10, 1 + daysToMonday + 1);
}

// Terms end in January, after the November election of the prior year. Once
// that day passes the stored term still ends in January but the next election
// isn't known, so this says only what the data supports.
function electionText(term: Term): string {
  const end = new Date(`${term.end}T12:00:00`);
  const election = electionDay(end.getFullYear() - 1);
  if (new Date() <= election) {
    return `Next election: ${election.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
  }
  return `Term ends ${end.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

function partyPalette(party: string | undefined): string {
  if (party === "Republican") return "red";
  if (party === "Democrat") return "blue";
  return "yellow";
}

function seatLabel(term: Term): string {
  if (term.type !== "rep") return term.state;
  return term.district ? `${term.state}-${term.district}` : `${term.state} At-Large`;
}

export default function LegislatorProfileHeader({ data }: { data: LegislatorData }) {
  const { name, terms = [], id, leadership_roles: leadershipRoles } = data;
  const fullName = displayName(name);
  const currentTerm = terms[terms.length - 1];
  const roles = data.current ? currentRoles(leadershipRoles) : [];
  const isSpeaker = roles.some((role) => role.title === SPEAKER_TITLE);
  const speakerStart = isSpeaker ? speakerSince(leadershipRoles) : null;
  const sinceYear = inChamberSinceYear(terms);
  const chamber = currentTerm?.type === "sen" ? "Senate" : "House";
  const imageUrl = `https://unitedstates.github.io/images/congress/450x550/${id.bioguide}.jpg`;

  return (
    <Box
      bg="surface"
      px={{ base: 4, md: 6 }}
      py={4}
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      boxShadow="card"
      w="100%"
    >
      <Flex gap={{ base: 3, md: 5 }} align="center">
        <Box flexShrink={0} w={{ base: "64px", md: "90px" }}>
          <Image
            src={imageUrl}
            alt={`${fullName} headshot`}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            fit="cover"
            w="100%"
          />
        </Box>

        <VStack align="flex-start" gap={1} flex={1} minW={0}>
          <Flex justify="space-between" align="flex-start" w="100%" gap={2}>
            <Heading size={{ base: "lg", md: "xl" }}>{fullName}</Heading>
            {currentTerm && (currentTerm.url || currentTerm.phone) && (
              <Box display={{ base: "block", md: "none" }} flexShrink={0}>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <IconButton aria-label="Contact" variant="ghost" size="xs">
                      <MoreHorizontal />
                    </IconButton>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        {currentTerm.url && (
                          <Menu.Item value="site" asChild>
                            <a href={currentTerm.url} target="_blank" rel="noopener noreferrer">
                              Official site
                            </a>
                          </Menu.Item>
                        )}
                        {currentTerm.phone && (
                          <Menu.Item value="phone" asChild>
                            <a href={`tel:${currentTerm.phone}`}>{currentTerm.phone}</a>
                          </Menu.Item>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Box>
            )}
          </Flex>

          {currentTerm && (
            <HStack gap={2} wrap="wrap">
              <Badge colorPalette={partyPalette(currentTerm.party)} variant="subtle" rounded="full">
                {currentTerm.party}
              </Badge>
              <Badge variant="subtle" rounded="full">
                {seatLabel(currentTerm)}
              </Badge>
              <Badge variant="subtle" rounded="full">
                {chamber}
              </Badge>
              {!data.current && (
                <Badge variant="outline" rounded="full">
                  Former member
                </Badge>
              )}
            </HStack>
          )}

          {roles.length > 0 && (
            <Text fontSize="sm" fontWeight="600" color="text">
              {roles.map((role) => role.title).join(" · ")}
            </Text>
          )}

          <Flex gap={{ base: 2, md: 4 }} fontSize="sm" color="textMuted" wrap="wrap">
            {sinceYear && (
              <Text>
                {data.current ? `In the ${chamber} since ${sinceYear}` : `Served in the ${chamber} from ${sinceYear}`}
              </Text>
            )}
            {data.current && currentTerm && <Text>{electionText(currentTerm)}</Text>}
            {currentTerm?.url && (
              <Box display={{ base: "none", md: "block" }}>
                <a href={currentTerm.url} target="_blank" rel="noopener noreferrer">
                  <HStack gap={1}>
                    <Text>Official site</Text>
                    <ExternalLink size={12} />
                  </HStack>
                </a>
              </Box>
            )}
            {currentTerm?.phone && (
              <Box display={{ base: "none", md: "block" }}>
                <a href={`tel:${currentTerm.phone}`}>
                  <HStack gap={1}>
                    <Phone size={12} />
                    <Text>{currentTerm.phone}</Text>
                  </HStack>
                </a>
              </Box>
            )}
          </Flex>
        </VStack>
      </Flex>

      {speakerStart && (
        <Text fontSize="xs" color="textMuted" mt={3}>
          As Speaker, {name.last ?? fullName} votes on fewer roll calls than most
          members. Scores since{" "}
          {speakerStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })} reflect a
          smaller set of votes.
        </Text>
      )}
      {!data.current && (
        <Text fontSize="xs" color="textMuted" mt={3}>
          No longer in office, so this page compares them with everyone on record in the{" "}
          {chamber}. <RouterLink to="/explore-legislators">See current members</RouterLink>
        </Text>
      )}
    </Box>
  );
}
