import { useMemo } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import {
  filterCurrent,
  getScaledValue,
  clampToDomain,
  domainForScale,
  jitter,
  type RosterMember,
  type ScaleMode,
} from "../CongressData/axisStats";
import { subjectPoles } from "../CongressData/subjectDisplayName";

interface AxisFingerprintProps {
  axisId: string;
  memberId: string;
  roster: RosterMember[];
  scaleMode: ScaleMode;
  highlightColor: string;
}

const STRIP_HEIGHT = 56;
const JITTER_AMPLITUDE = 14;

export default function AxisFingerprint({
  axisId,
  memberId,
  roster,
  scaleMode,
  highlightColor,
}: AxisFingerprintProps) {
  const currentRoster = useMemo(() => filterCurrent(roster), [roster]);
  const domain = domainForScale(scaleMode);
  const poles = subjectPoles("axes", axisId);

  const points = useMemo(() => {
    return currentRoster
      .map((member) => {
        const raw = getScaledValue(member, axisId, scaleMode);
        if (raw === null) return null;
        const { clamped, isPinned } = clampToDomain(raw, domain);
        const pct = ((clamped - domain[0]) / (domain[1] - domain[0])) * 100;
        return {
          member_id: member.member_id,
          pct,
          isPinned,
          isSelf: member.member_id === memberId,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [currentRoster, axisId, scaleMode, domain, memberId]);

  const self = points.find((p) => p.isSelf);
  const peers = points.filter((p) => !p.isSelf);

  if (points.length === 0) {
    return (
      <Box py={2} textAlign="center">
        <Text fontSize="xs" color="textMuted">
          Not enough data to compare against peers.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box position="relative" h={`${STRIP_HEIGHT}px`}>
        {/* Baseline */}
        <Box
          position="absolute"
          left={0}
          right={0}
          top="50%"
          h="1px"
          bg="borderSubtle"
        />
        {/* Zero line */}
        <Box
          position="absolute"
          left={`${((0 - domain[0]) / (domain[1] - domain[0])) * 100}%`}
          top={0}
          bottom={0}
          w="1px"
          bg="border"
        />

        {peers.map((p) => (
          <Box
            key={p.member_id}
            position="absolute"
            left={`${p.pct}%`}
            top={`calc(50% + ${jitter(p.member_id, JITTER_AMPLITUDE)}px)`}
            transform="translate(-50%, -50%)"
            w={p.isPinned ? "7px" : "6px"}
            h={p.isPinned ? "7px" : "6px"}
            rounded="full"
            bg={p.isPinned ? "transparent" : "textMuted"}
            opacity={p.isPinned ? 1 : 0.35}
            borderWidth={p.isPinned ? "1.5px" : "0"}
            borderColor="textMuted"
          />
        ))}

        {self && (
          <Box
            position="absolute"
            left={`${self.pct}%`}
            top="50%"
            transform="translate(-50%, -50%)"
            w="14px"
            h="14px"
            rounded="full"
            bg={self.isPinned ? "transparent" : highlightColor}
            borderWidth="2.5px"
            borderColor={highlightColor}
            boxShadow="sm"
            zIndex={1}
          />
        )}
      </Box>

      <HStack justify="space-between" mt={1}>
        <Text fontSize="xs" color="cyan.fg">
          {poles.negative}
        </Text>
        <Text fontSize="xs" color="orange.fg">
          {poles.positive}
        </Text>
      </HStack>
    </Box>
  );
}
