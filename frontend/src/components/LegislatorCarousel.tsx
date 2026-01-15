import { useState, useEffect } from "react";
import {
    Box,
    Heading,
    Text,
    Avatar,
    VStack,
    Badge,
    HStack,
    Spinner,
    Center,
    Image
} from "@chakra-ui/react";
import { Carousel } from "@chakra-ui/react";

// Hardcoded lists of important legislators
const CONGRESSIONAL_LEADERS = {
    senate: ['S303', 'S270'], // Majority/Minority leaders
    house: ['J000299', 'S001176', 'J000294'] // Speaker, Majority/Minority leaders
};

// Add popular senators and representatives here
const POPULAR_LEGISLATORS = {
    senate: ['S313', 'S355', 'S366'], // Bernie Sanders, Ted Cruz, Warren
    house: ['C001120', 'O000172']  // Crenshaw, Cortez
};

interface Legislator {
    bioguide: string;
    lis?: string;
    name: {
        official_full: string;
    };
    terms: Array<{
        type: 'sen' | 'rep';
        state: string;
        party: string;
        district?: number;
    }>;
}

export default function LegislatorCarousel() {
    const [leaders, setLeaders] = useState<Legislator[]>([]);
    const [popular, setPopular] = useState<Legislator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLegislators();
    }, []);

    const fetchLegislators = async () => {
        try {
            // Fetch leaders
            const leaderIds = [
                ...CONGRESSIONAL_LEADERS.senate,
                ...CONGRESSIONAL_LEADERS.house
            ];

            const leaderPromises = leaderIds.map(id =>
                fetch(`${import.meta.env.VITE_API_URL}/legislators/${id}`)
                    .then(res => res.json())
                    .catch(err => {
                        console.error(`Failed to fetch ${id}:`, err);
                        return null;
                    })
            );

            // Fetch popular legislators
            const popularIds = [
                ...POPULAR_LEGISLATORS.senate,
                ...POPULAR_LEGISLATORS.house
            ];

            const popularPromises = popularIds.map(id =>
                fetch(`${import.meta.env.VITE_API_URL}/legislators/${id}`)
                    .then(res => res.json())
                    .catch(err => {
                        console.error(`Failed to fetch ${id}:`, err);
                        return null;
                    })
            );

            const [leaderResults, popularResults] = await Promise.all([
                Promise.all(leaderPromises),
                Promise.all(popularPromises)
            ]);

            setLeaders(leaderResults.filter(r => r !== null));
            setPopular(popularResults.filter(r => r !== null));
        } catch (error) {
            console.error('Failed to fetch legislators:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentTerm = (legislator: Legislator) => {
        if (!legislator.terms || legislator.terms.length === 0) {
            return null;
        }
        return legislator.terms[legislator.terms.length - 1];
    };

    const getMemberId = (legislator: Legislator) => {
        const currentTerm = getCurrentTerm(legislator);
        if (!currentTerm) {
            return legislator.bioguide;
        }
        return currentTerm.type === 'sen' ? legislator.lis : legislator.bioguide;
    };

    const getRole = (legislator: Legislator) => {
        const id = legislator.bioguide;
        const lisId = legislator.lis;

        if (id === 'J000299') return 'Speaker of the House';

        if (CONGRESSIONAL_LEADERS.senate.includes(id) ||
            (lisId && CONGRESSIONAL_LEADERS.senate.includes(lisId))) {
            return 'Senate Leader';
        }

        if (CONGRESSIONAL_LEADERS.house.includes(id)) {
            return 'House Leader';
        }

        return 'Popular';
    };

    const renderCarousel = (legislators: Legislator[], title: string, carouselSize: number) => (
        <Box w="100%" py={8}>
            <Carousel.Root loop gap={4} slideCount={legislators.length} slidesPerPage={carouselSize}>
                <HStack justify="space-between" mb={4}>
                    <Heading size="xl" color="primary">
                        {title}
                    </Heading>
                </HStack>

                <Carousel.ItemGroup>
                    {legislators.map((leg, idx) => {
                        const currentTerm = getCurrentTerm(leg);
                        const memberId = getMemberId(leg);
                        const role = getRole(leg);
                        const imageUrl = `https://unitedstates.github.io/images/congress/450x550/${leg.bioguide}.jpg`;

                        if (!currentTerm) {
                            return null;
                        }

                        return (
                            <Carousel.Item key={memberId} index={idx}>
                                <Box
                                    bg="bgLightShade"
                                    p={6}
                                    rounded="lg"
                                    cursor="pointer"
                                    _hover={{
                                        transform: 'translateY(-4px)',
                                        boxShadow: 'lg',
                                        transition: 'all 0.2s'
                                    }}
                                    transition="all 0.2s"
                                    onClick={() => window.location.href = `/legislators/${memberId}`}
                                >
                                    <VStack gap={3}>
                                        <Box minW="225px" maxW="225px" alignSelf="center">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={`${leg.name.official_full} headshot`}
                                                    borderRadius="xl"
                                                    borderWidth="1px"
                                                    borderColor="gray.200"
                                                    fit="cover"
                                                />
                                            ) : (
                                                <Avatar.Root size="2xl" bg="primary">
                                                    <Avatar.Fallback name={leg.name.official_full} />
                                                </Avatar.Root>
                                            )}
                                        </Box>

                                        <VStack gap={1} textAlign="center">
                                            <Heading size="md" color="primary">
                                                {leg.name.official_full}
                                            </Heading>

                                            <Badge colorScheme="purple" fontSize="xs">
                                                {role}
                                            </Badge>

                                            <HStack gap={2}>
                                                <Badge colorScheme="blue">{currentTerm.state}</Badge>
                                                {currentTerm.district && (
                                                    <Badge colorScheme="green">
                                                        District {currentTerm.district}
                                                    </Badge>
                                                )}
                                            </HStack>

                                            <Text color="text" fontSize="sm">
                                                {currentTerm.type === 'sen' ? 'Senate' : 'House'}
                                            </Text>

                                            <Text color="text" fontSize="sm">
                                                {currentTerm.party}
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Box>
                            </Carousel.Item>
                        );
                    })}
                </Carousel.ItemGroup>
            </Carousel.Root>
        </Box>
    );

    if (loading) {
        return (
            <Center py={20}>
                <Spinner size="xl" color="primary" />
            </Center>
        );
    }

    return (
        <Box>
            {leaders.length > 0 && renderCarousel(leaders, "Congressional Leaders", 5)}
            {popular.length > 0 && renderCarousel(popular, "Popular Legislators", 3)}
        </Box>
    );
}