import { Box, Flex, Grid, HStack, Image, Text } from "@chakra-ui/react";
import { COMPASS_POINTS } from "./showcaseData";
import { LegendDot, MockCard, ScoreTrack } from "./landingParts";
import { PARTY_FILL, signedScore } from "./showcaseUtils";

const MEMBERS = [
  {
    bioguide: "J000294",
    name: "Hakeem Jeffries",
    role: "House Minority Leader",
    detail: "Democrat · NY-8",
    color: "partyDem",
    economicZ: -0.98,
  },
  {
    bioguide: "J000299",
    name: "Mike Johnson",
    role: "Speaker of the House",
    detail: "Republican · LA-4",
    color: "partyRep",
    economicZ: 1.03,
  },
];

const CATEGORY_SCORES = [
  { name: "Economy & Finance", dem: -0.152, rep: 0.15 },
  { name: "Environment & Energy", dem: -0.24, rep: 0.179 },
  { name: "Healthcare", dem: -0.233, rep: -0.016 },
  { name: "Budget & Appropriations", dem: -0.12, rep: 0.094 },
  { name: "Defense & National Security", dem: -0.018, rep: 0.086 },
];

const STRIP_WIDTH = 420;
const STRIP_HEIGHT = 56;
const STRIP_DOMAIN = 2;
const stripX = (z: number) => ((z + STRIP_DOMAIN) / (2 * STRIP_DOMAIN)) * STRIP_WIDTH;

export function LegislatorsMock() {
  return (
    <Box>
      <MockCard>
        <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={4} pb={4} borderBottomWidth="1px" borderColor="borderSubtle">
          {MEMBERS.map((member) => (
            <Flex key={member.bioguide} gap={3} align="center" minW={0}>
              <Image
                src={`https://unitedstates.github.io/images/congress/450x550/${member.bioguide}.jpg`}
                alt={`${member.name} headshot`}
                w={{ base: "40px", md: "52px" }}
                h={{ base: "48px", md: "62px" }}
                objectFit="cover"
                rounded="md"
                flexShrink={0}
              />
              <Box minW={0}>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="text" lineHeight="1.25">
                  {member.name}
                </Text>
                <Text fontSize="xs" color="textMuted" lineHeight="1.3">
                  {member.role}
                </Text>
                <Text fontSize="xs" color={member.color} fontWeight="medium" lineHeight="1.3">
                  {member.detail}
                </Text>
              </Box>
            </Flex>
          ))}
        </Grid>

        <HStack justify="space-between" pt={3} pb={1}>
          <Text fontSize="xs" fontWeight="semibold" color="textMuted">
            Ideology score by category
          </Text>
          <HStack gap={3} display={{ base: "none", sm: "flex" }}>
            <LegendDot color="partyDem">Jeffries</LegendDot>
            <LegendDot color="partyRep">Johnson</LegendDot>
          </HStack>
        </HStack>

        {CATEGORY_SCORES.map((row) => (
          <Grid
            key={row.name}
            templateColumns={{ base: "minmax(0, 1fr) 96px", md: "minmax(0, 1.2fr) minmax(0, 1fr) 108px" }}
            columnGap={3}
            rowGap={1}
            alignItems="center"
            py={2}
            borderBottomWidth="1px"
            borderColor="borderSubtle"
            _last={{ borderBottomWidth: 0, pb: 0 }}
          >
            <Text fontSize="sm" color="text" lineHeight="1.3">
              {row.name}
            </Text>
            <Box display={{ base: "none", md: "block" }}>
              <ScoreTrack
                domain={0.3}
                markers={[
                  { key: "dem", score: row.dem, color: "partyDem" },
                  { key: "rep", score: row.rep, color: "partyRep" },
                ]}
              />
            </Box>
            <Text fontSize="xs" color="textMuted" fontVariantNumeric="tabular-nums" textAlign="right" whiteSpace="nowrap">
              {signedScore(row.dem)} / {signedScore(row.rep)}
            </Text>
          </Grid>
        ))}
      </MockCard>

      <MockCard mt={4}>
        <HStack justify="space-between" mb={1}>
          <Text fontSize="xs" fontWeight="semibold" color="textMuted">
            Economic System, against every House member
          </Text>
        </HStack>
        <svg
          viewBox={`0 0 ${STRIP_WIDTH} ${STRIP_HEIGHT}`}
          width="100%"
          role="img"
          aria-label="Strip of current House members on the Economic System axis, with Hakeem Jeffries on the collective side and Mike Johnson on the market side."
        >
          <line
            x1={stripX(0)}
            x2={stripX(0)}
            y1={0}
            y2={STRIP_HEIGHT}
            stroke="var(--chakra-colors-border)"
          />
          {COMPASS_POINTS.map(([z], i) => (
            <circle
              key={i}
              cx={stripX(z)}
              cy={STRIP_HEIGHT / 2 + ((i * 37) % 29) - 14}
              r={2.5}
              fill="var(--chakra-colors-text-muted)"
              opacity={0.35}
            />
          ))}
          {MEMBERS.map((member, i) => (
            <circle
              key={member.bioguide}
              cx={stripX(member.economicZ)}
              cy={STRIP_HEIGHT / 2}
              r={7}
              fill={i === 0 ? PARTY_FILL.D : PARTY_FILL.R}
              stroke="var(--chakra-colors-surface)"
              strokeWidth={2}
            />
          ))}
        </svg>
        <HStack justify="space-between" mt={1}>
          <Text fontSize="xs" color="textMuted">
            Collective / Public
          </Text>
          <Text fontSize="xs" color="textMuted">
            Market / Private
          </Text>
        </HStack>
      </MockCard>
    </Box>
  );
}
