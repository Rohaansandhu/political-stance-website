import {
    Box,
    SimpleGrid,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";

interface CategoryInfo {
    score: number;
    rank: number;
    percentile_rank: number;
    bill_count: number;
    current_rank: number;
    current_percentile_rank: number;
    total_members?: number;
    total_current_members?: number;
}

interface Categories {
    [key: string]: CategoryInfo;
}

export default function MainCategoryGrid({ categories }: { categories: Categories }) {
    return (
        <Box w="100%">
            <Heading size="lg" mb={6}>Main Policy Categories</Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                {Object.entries(categories).map(([category, info]) => (
                    <Box key={category} bg="bgLightShade" p={6} rounded="lg">
                        <Heading size="md" mb={2}>{category}</Heading>
                        <Text>Score: {info.score}</Text>
                        <Text>Rank: {info.rank}</Text>
                        <Text>Percentile: {(info.percentile_rank * 100).toFixed(1)}%</Text>
                        <Text>Bill Count: {info.bill_count}</Text>
                        <Text>Current Rank: {info.current_rank === -1 ? "N/A" : info.current_rank}</Text>
                        <Text>Current Percentile: {info.current_percentile_rank === -1 ? "N/A" : `${(info.current_percentile_rank * 100).toFixed(1)}%`}</Text>
                        <Text>Total Members: {info.total_members ?? "N/A"}</Text>
                        <Text>Total Current Members: {info.total_current_members ?? "N/A"}</Text>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
}