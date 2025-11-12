import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Center, Text, VStack } from "@chakra-ui/react";

import LegislatorProfileHeader from "../components/LegislatorProfileHeader";
import LegislatorStatsOverview from "../components/LegislatorStatsOverview";
import MainCategoryGrid from "../components/MainCategoriesGrid";
import DetailedSpectrumList from "../components/DetailedSpectrumList";

interface LegislatorData {
    member_id: string;
    name: { official_full: string };
    bio: { gender: string; birthday: string };
    id: {};
    state: string;
    district: number;
    vote_count: number;
    detailed_spectrums: Record<string, {
        score: number;
        bill_count: number;
        rank: number;
        percentile_rank: number;
        current_rank: number;
        current_percentile_rank: number;
    }>;
    main_categories: Record<string, {
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLegislator() {
            try {
                const res = await fetch(`http://localhost:4000/legislators/${id}`);
                const json = await res.json();
                console.log("Backend response:", json);
                setData(json);
            } catch (err) {
                console.error("Error loading legislator:", err);
            } finally {
                setLoading(false);
            }
        }

        loadLegislator();
    }, [id]);

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
            <VStack gap={10}>
                <LegislatorProfileHeader data={data} />

                <LegislatorStatsOverview data={data} />

                <MainCategoryGrid categories={data.main_categories} />

                <DetailedSpectrumList spectrums={data.detailed_spectrums} />

            </VStack>
        </Container>
    );
}
