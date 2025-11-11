import { SimpleGrid, Stat } from "@chakra-ui/react";


interface DataInfo {
    member_id: string;
    vote_count: number;
    detailed_spectrums: Record<string, { bill_count: number }>;
    main_categories_rankings: Array<number>;
}

export default function LegislatorStatsOverview({ data }: { data: DataInfo }) {
    return (
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6} w="100%">
            <Stat.Root bg="bgLightShade" p={6} rounded="lg">
                <Stat.Label>Total Votes</Stat.Label>
                <Stat.ValueText>{data.vote_count}</Stat.ValueText>
            </Stat.Root>

            <Stat.Root bg="bgLightShade" p={6} rounded="lg">
                <Stat.Label>Total Bills</Stat.Label>
                <Stat.ValueText>{data.detailed_spectrums?.["Government Role"]?.bill_count}</Stat.ValueText>
            </Stat.Root>

            <Stat.Root bg="bgLightShade" p={6} rounded="lg">
                <Stat.Label>Top Category</Stat.Label>
                <Stat.ValueText fontSize="lg">
                    {Object.keys(data.main_categories_rankings)[0]}
                </Stat.ValueText>
            </Stat.Root>

            <Stat.Root bg="bgLightShade" p={6} rounded="lg">
                <Stat.Label>Chamber</Stat.Label>
                <Stat.ValueText>{data.member_id.startsWith("S") ? "Senate" : "House"}</Stat.ValueText>
            </Stat.Root>
        </SimpleGrid>
    );
}
