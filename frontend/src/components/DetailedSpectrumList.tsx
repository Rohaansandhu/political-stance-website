import { Box, VStack, Heading, Text } from "@chakra-ui/react";

interface SpectrumInfo {
  score: number;
  rank: number;
  percentile_rank: number;
}

interface Spectrums {
  [key: string]: SpectrumInfo;
}

export default function DetailedSpectrumList({ spectrums } : {spectrums: Spectrums}) {
  return (
    <Box w="100%">
      <Heading size="lg" mb={6}>Detailed Spectrums</Heading>

      <VStack gap={4} align="stretch">
        {Object.entries(spectrums).map(([label, info]) => (
          <Box
            key={label}
            bg="bgLightTint"
            p={5}
            rounded="lg"
          >
            <Heading size="sm" mb={1}>{label}</Heading>
            <Text>Score: {info.score}</Text>
            <Text>Rank: {info.rank}</Text>
            <Text>Percentile: {(info.percentile_rank * 100).toFixed(1)}%</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
