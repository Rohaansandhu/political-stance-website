import { Box, HStack, Text } from "@chakra-ui/react";
import { COMPASS_POINTS } from "./showcaseData";
import { LegendDot } from "./landingParts";
import { PARTY_FILL } from "./showcaseUtils";

const SIZE = 480;
const DOMAIN = 2.6;
const plotX = (z: number) => ((z + DOMAIN) / (2 * DOMAIN)) * SIZE;
const plotY = (z: number) => SIZE - plotX(z);

const LABELLED = [
  { name: "Jeffries", x: -0.98, y: -0.74, party: "D" as const, anchor: "end" as const, dx: -12 },
  { name: "Johnson", x: 1.03, y: 0.58, party: "R" as const, anchor: "start" as const, dx: 12 },
];

const QUADRANTS = [
  { label: "Authoritarian left", top: 3, left: 3 },
  { label: "Authoritarian right", top: 3, right: 3 },
  { label: "Libertarian left", bottom: 3, left: 3 },
  { label: "Libertarian right", bottom: 3, right: 3 },
];

export function CompassMock() {
  return (
    <Box>
      <Text textAlign="center" fontSize="xs" fontWeight="medium" color="textMuted" mb={2}>
        ↑ Authoritarian
      </Text>
      <Box
        position="relative"
        aspectRatio={1}
        maxW="520px"
        mx="auto"
        bg="surface"
        rounded="card"
        borderWidth="1px"
        borderColor="border"
        boxShadow="cardHover"
        overflow="hidden"
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width="100%"
          height="100%"
          style={{ display: "block" }}
          role="img"
          aria-label="Current House members plotted by Economic System and State Power. Democrats form a vertical cluster on the collective side, Republicans a tighter cluster on the market side."
        >
          <line x1={SIZE / 2} x2={SIZE / 2} y1={0} y2={SIZE} stroke="var(--chakra-colors-border)" />
          <line x1={0} x2={SIZE} y1={SIZE / 2} y2={SIZE / 2} stroke="var(--chakra-colors-border)" />
          {COMPASS_POINTS.map(([x, y, party], i) => (
            <circle key={i} cx={plotX(x)} cy={plotY(y)} r={4} fill={PARTY_FILL[party]} opacity={0.72} />
          ))}
          {LABELLED.map((member) => (
            <g key={member.name}>
              <circle
                cx={plotX(member.x)}
                cy={plotY(member.y)}
                r={7}
                fill={PARTY_FILL[member.party]}
                stroke="var(--chakra-colors-text)"
                strokeWidth={2}
              />
              <text
                x={plotX(member.x) + member.dx}
                y={plotY(member.y) + 5}
                textAnchor={member.anchor}
                fontSize={15}
                fontWeight={600}
                fill="var(--chakra-colors-text)"
                stroke="var(--chakra-colors-surface)"
                strokeWidth={4}
                paintOrder="stroke"
              >
                {member.name}
              </text>
            </g>
          ))}
        </svg>
        {QUADRANTS.map(({ label, ...position }) => (
          <Text key={label} position="absolute" {...position} fontSize="xs" color="textMuted">
            {label}
          </Text>
        ))}
      </Box>
      <Text textAlign="center" fontSize="xs" fontWeight="medium" color="textMuted" mt={2}>
        ↓ Libertarian
      </Text>
      <HStack justify="space-between" maxW="520px" mx="auto" mt={3}>
        <Text fontSize="xs" color="textMuted">
          ← Collective / Public
        </Text>
        <Text fontSize="xs" color="textMuted">
          Market / Private →
        </Text>
      </HStack>
      <HStack justify="center" gap={5} mt={2}>
        <LegendDot color="partyDem">Democrats</LegendDot>
        <LegendDot color="partyRep">Republicans</LegendDot>
      </HStack>
    </Box>
  );
}
