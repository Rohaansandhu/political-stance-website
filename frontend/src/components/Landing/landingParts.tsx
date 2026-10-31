import { Box, Heading, HStack, Icon, Link, Text } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

export function Eyebrow({ icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <HStack gap={2} color="primary" mb={4}>
      {icon && <Icon as={icon} boxSize={4} />}
      <Text fontSize="xs" fontWeight="semibold" letterSpacing="0.14em" textTransform="uppercase">
        {children}
      </Text>
    </HStack>
  );
}

interface TwoToneHeadingProps {
  as: "h2" | "h3";
  lead: string;
  rest?: string;
  size?: "section" | "feature" | "panel";
}

const HEADING_SIZES = {
  section: { base: "4xl", md: "5xl" },
  feature: { base: "3xl", md: "4xl" },
  panel: { base: "2xl", md: "3xl" },
};

export function TwoToneHeading({ as, lead, rest, size = "feature" }: TwoToneHeadingProps) {
  return (
    <Heading
      as={as}
      fontFamily="'Fraunces', serif"
      fontWeight="400"
      fontSize={HEADING_SIZES[size]}
      lineHeight="1.12"
      letterSpacing="-0.015em"
      color="text"
    >
      {lead}
      {rest && (
        <>
          {" "}
          <Text as="span" color="textMuted">
            {rest}
          </Text>
        </>
      )}
    </Heading>
  );
}

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      asChild
      display="inline-flex"
      alignItems="center"
      gap={2}
      fontSize="sm"
      fontWeight="semibold"
      color="primary"
      _hover={{ color: "primaryHover", textDecoration: "underline" }}
    >
      <RouterLink to={to}>
        {children}
        <Icon as={ArrowRight} boxSize={4} />
      </RouterLink>
    </Link>
  );
}

export function MockCard(props: BoxProps) {
  return (
    <Box
      bg="surface"
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      boxShadow="cardHover"
      p={{ base: 4, md: 5 }}
      position="relative"
      {...props}
    />
  );
}

export function MockChip({
  active = false,
  bg = "bgLightShade",
  children,
}: {
  active?: boolean;
  bg?: string;
  children: ReactNode;
}) {
  return (
    <Box
      px={2.5}
      py={0.5}
      rounded="full"
      fontSize="xs"
      fontWeight="medium"
      whiteSpace="nowrap"
      bg={active ? "bgAltGreen" : bg}
      color={active ? "primary" : "textMuted"}
    >
      {children}
    </Box>
  );
}

export function LegendDot({ color, children }: { color: string; children: ReactNode }) {
  return (
    <HStack gap={1.5}>
      <Box w="8px" h="8px" rounded="full" bg={color} flexShrink={0} />
      <Text fontSize="xs" color="textMuted">
        {children}
      </Text>
    </HStack>
  );
}

// A -1..+1 style track with markers placed by score.
export function ScoreTrack({
  markers,
  domain = 1,
}: {
  markers: { score: number; color: string; key: string }[];
  domain?: number;
}) {
  return (
    <Box position="relative" h="12px">
      <Box position="absolute" left={0} right={0} top="50%" h="2px" mt="-1px" bg="borderSubtle" rounded="full" />
      <Box position="absolute" left="50%" top={0} bottom={0} w="1px" bg="border" />
      {markers.map((m) => (
        <Box
          key={m.key}
          position="absolute"
          left={`${((m.score + domain) / (2 * domain)) * 100}%`}
          top="50%"
          transform="translate(-50%, -50%)"
          w="12px"
          h="12px"
          rounded="full"
          bg={m.color}
          borderWidth="2px"
          borderColor="surface"
        />
      ))}
    </Box>
  );
}
