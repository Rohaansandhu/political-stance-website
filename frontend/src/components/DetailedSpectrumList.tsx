import { Box, VStack, Heading, Text } from "@chakra-ui/react";

interface SpectrumInfo {
    score: number;
    rank: number;
    percentile_rank: number;
    bill_count: number;
    current_rank: number;
    current_percentile_rank: number;
    total_members?: number;
    total_current_members?: number;
}

interface Spectrums {
    [key: string]: SpectrumInfo;
}

export default function DetailedSpectrumList({ spectrums }: { spectrums: Spectrums }) {
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
                        <Text>Bill Count: {info.bill_count}</Text>
                        <Text>Percentile: {(info.percentile_rank * 100).toFixed(1)}%</Text>
                        <Text>Current Rank: {info.current_rank === -1 ? "N/A" : info.current_rank}</Text>
                        <Text>Current Percentile: {info.current_percentile_rank === -1 ? "N/A" : `${(info.current_percentile_rank * 100).toFixed(1)}%`}</Text>
                        <Text>Total Members: {info.total_members ?? "N/A"}</Text>
                        <Text>Total Current Members: {info.total_current_members ?? "N/A"}</Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
