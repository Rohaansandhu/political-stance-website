import { SimpleGrid, Stat } from "@chakra-ui/react";


interface DataInfo {
    member_id: string;
    vote_count: number;
    primary_categories: Record<string, { score: number; rank: number; percentile_rank: number; bill_count: number }>;
}

export default function LegislatorStatsOverview({ data }: { data: DataInfo }) {
    return (
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6} w="100%">
            <Stat.Root bg="bgLightShade" p={6} rounded="lg">
                <Stat.Label>Total Votes</Stat.Label>
                <Stat.ValueText>{data.vote_count ?? 0}</Stat.ValueText>
            </Stat.Root>

            <Stat.Root bg="bgLightShade" p={6} rounded="lg">
                <Stat.Label>Top Category</Stat.Label>
                <Stat.ValueText fontSize="lg">
                    {Object.entries(data.primary_categories ?? {}).reduce(
                        (max, [category, info]) =>
                            info.bill_count > (data.primary_categories[max]?.bill_count ?? 0)
                                ? category
                                : max,
                        Object.keys(data.primary_categories ?? {})[0] || "N/A"
                    )}
                </Stat.ValueText>
            </Stat.Root>

            <Stat.Root bg="bgLightShade" p={6} rounded="lg">
                <Stat.Label>Chamber</Stat.Label>
                <Stat.ValueText>{data.member_id?.startsWith("S") ? "Senate" : "House"}</Stat.ValueText>
            </Stat.Root>
        </SimpleGrid>
    );
}
