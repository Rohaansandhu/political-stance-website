import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Spinner, Center, Text, VStack, Breadcrumb, Flex, HStack, Select, createListCollection } from "@chakra-ui/react";

import LegislatorProfileHeader from "../components/Legislators/LegislatorProfileHeader";
import LegislatorStatsOverview from "../components/Legislators/LegislatorStatsOverview";
import MainCategoryGrid from "../components/Legislators/MainCategoriesGrid";
import { IdeologyScoreReminder } from "../components/Legislators/IdeologyScoreReminder";

interface LegislatorData {
    member_id: string;
    name: { official_full: string };
    bio: { gender: string; birthday: string };
    id: {};
    state: string;
    district: number;
    vote_count: number;
    primary_categories: Record<string, {
        score: number;
        rank: number;
        percentile_rank: number;
        bill_count: number;
        current_rank: number;
        current_percentile_rank: number;
    }>;
}

export default function LegislatorProfile() {
    const { id } = useParams();
    const [data, setData] = useState<LegislatorData | null>(null);
    const [model, setModel] = useState('gemini-2.5-flash-lite')
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLegislator() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/legislators/${id}/${model}`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Error loading legislator:", err);
            } finally {
                setLoading(false);
            }
        }

        loadLegislator();
    }, [id, model]);

    if (loading) {
        return (
            <Center minH="60vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!data) {
        return (
            <Center minH="60vh">
                <Text>No legislator found.</Text>
            </Center>
        );
    }

    return (
        <Container maxW="7xl" py={8}>
            <Flex justifyContent="flex-start">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link asChild>
                                <Link to="/explore-legislators">Explore Legislators</Link>
                            </Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </Flex>
            <VStack gap={10}>

                <LegislatorProfileHeader data={data} />

                <IdeologyScoreReminder />

                {/* Model filter */}
                <HStack gap={4} wrap="wrap" bg="bgLightShade" p={6} rounded="lg">
                    <Select.Root
                        collection={createListCollection({
                            items: [
                                { label: 'Gemini 2.5 Flash Lite', value: 'gemini-2.5-flash-lite' },
                                { label: 'GPT-OSS (120b)', value: 'gpt-oss-120b' },
                                { label: 'Llama 3.3 (70b)', value: 'llama3.3-70b'},
                                { label: 'Qwen 3 (32b)', value: 'qwen-3-32b'}
                            ]
                        })}
                        value={[model]}
                        onValueChange={(details) => setModel(details.value[0])}
                        width="300px"
                        maxW="500px"
                    >
                        <Select.Label>Model</Select.Label>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select Model" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item item="gemini-2.5-flash-lite">
                                <Select.ItemText>Gemini 2.5 Flash Lite</Select.ItemText>
                            </Select.Item>
                            <Select.Item item="gpt-oss-120b">
                                <Select.ItemText>GPT-OSS (120b)</Select.ItemText>
                            </Select.Item>
                            <Select.Item item="llama3.3-70b">
                                <Select.ItemText>Llama 3.3 (70b)</Select.ItemText>
                            </Select.Item>
                            <Select.Item item="qwen-3-32b">
                                <Select.ItemText>Qwen 3 (32b)</Select.ItemText>
                            </Select.Item>
                        </Select.Content>
                    </Select.Root>
                </HStack>

                <LegislatorStatsOverview data={data} />

                <MainCategoryGrid categories={data.primary_categories} />

            </VStack>
        </Container>
    );
}
