import { useState } from "react";
import { Container, SimpleGrid, Box, Heading, Text, Badge, Avatar, Flex, VStack, HStack, Spinner, Center, Select, createListCollection } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LegislatorsHero } from "../components/Legislators/LegislatorsHero.tsx";
import LegislatorCarousel from "../components/Legislators/LegislatorCarousel.tsx";

interface Legislator {
    bioguide: string;
    lis?: string;
    name: {
        first: string;
        last: string;
        official_full: string;
    };
    bio: {
        gender: string;
        birthday: string;
    };
    terms: Array<{
        type: 'sen' | 'rep';
        state: string;
        party: string;
        district?: number;
    }>;
    current: boolean;
}

export default function ExploreLegislators() {
    const [legislators, setLegislators] = useState<Legislator[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [chamberFilter, setChamberFilter] = useState('');
    const [partyFilter, setPartyFilter] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const fetchLegislators = async () => {
        setLoading(true);
        setHasSearched(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (stateFilter) params.append('state', stateFilter);
            if (chamberFilter) params.append('chamber', chamberFilter);
            if (partyFilter) params.append('party', partyFilter);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/legislators?${params}`);
            const data = await response.json();
            setLegislators(data.results);
        } catch (error) {
            console.error('Failed to fetch legislators:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchLegislators();
    };

    const getCurrentTerm = (legislator: Legislator) => {
        return legislator.terms[legislator.terms.length - 1];
    };

    const getMemberId = (legislator: Legislator) => {
        const currentTerm = getCurrentTerm(legislator);
        return currentTerm.type === 'sen' ? legislator.lis : legislator.bioguide;
    };

    const US_STATES: string[] = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    return (
        <>
            <Container maxW="7xl" py={8}>
                <LegislatorsHero
                    onSearch={handleSearch}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <Box mt={8}>
                    {/* Filters */}
                    <Flex gap={4} mb={8} wrap="wrap">
                        <Select.Root
                            collection={createListCollection({
                                items: [
                                    { label: 'All States', value: '' },
                                    ...US_STATES.map(state => ({ label: state, value: state }))
                                ]
                            })}
                            value={stateFilter ? [stateFilter] : ['']}
                            onValueChange={(details) => {
                                const newValue = details.value[0] || '';
                                setStateFilter(newValue);
                            }}
                            maxW="200px"
                        >
                            <Select.Trigger bg="bgLightShade">
                                <Select.ValueText placeholder="All States" />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item item="">
                                    <Select.ItemText>All States</Select.ItemText>
                                </Select.Item>
                                {US_STATES.map(state => (
                                    <Select.Item key={state} item={state}>
                                        <Select.ItemText>{state}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>

                        <Select.Root
                            collection={createListCollection({
                                items: [
                                    { label: 'All Chambers', value: '' },
                                    { label: 'Senate', value: 'sen' },
                                    { label: 'House', value: 'rep' }
                                ]
                            })}
                            value={chamberFilter ? [chamberFilter] : ['']}
                            onValueChange={(details) => {
                                const newValue = details.value[0] || '';
                                setChamberFilter(newValue);
                            }}
                            maxW="200px"
                        >
                            <Select.Trigger bg="bgLightShade">
                                <Select.ValueText placeholder="All Chambers" />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item item="">
                                    <Select.ItemText>All Chambers</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="sen">
                                    <Select.ItemText>Senate</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="rep">
                                    <Select.ItemText>House</Select.ItemText>
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>

                        <Select.Root
                            collection={createListCollection({
                                items: [
                                    { label: 'All Parties', value: '' },
                                    { label: 'Democrat', value: 'Democrat' },
                                    { label: 'Republican', value: 'Republican' },
                                    { label: 'Independent', value: 'Independent' }
                                ]
                            })}
                            value={partyFilter ? [partyFilter] : ['']}
                            onValueChange={(details) => {
                                const newValue = details.value[0] || '';
                                setPartyFilter(newValue);
                            }}
                            maxW="200px"
                        >
                            <Select.Trigger bg="bgLightShade">
                                <Select.ValueText placeholder="All Parties" />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item item="">
                                    <Select.ItemText>All Parties</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="Democrat">
                                    <Select.ItemText>Democrat</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="Republican">
                                    <Select.ItemText>Republican</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="Independent">
                                    <Select.ItemText>Independent</Select.ItemText>
                                </Select.Item>
                            </Select.Content>

                        </Select.Root>

                        <Text color="text" alignSelf="center" ml="auto">
                            {legislators.length} legislators found
                        </Text>
                    </Flex>

                    {/* Results */}
                    {hasSearched && loading ? (
                        <Center py={20}>
                            <Spinner size="xl" color="primary" />
                        </Center>
                    ) : hasSearched && legislators.length === 0 ? (
                        <Center py={20}>
                            <Text color="text" fontSize="lg">No legislators found</Text>
                        </Center>
                    ) : legislators.length > 0 ? (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                            {legislators.map(leg => {
                                const currentTerm = getCurrentTerm(leg);
                                const memberId = getMemberId(leg);

                                return (
                                    <Link key={memberId} to={`/legislators/${memberId}`}>
                                        <Box
                                            bg="bgLightShade"
                                            p={6}
                                            rounded="lg"
                                            _hover={{
                                                transform: 'translateY(-4px)',
                                                boxShadow: 'lg',
                                                transition: 'all 0.2s'
                                            }}
                                            transition="all 0.2s"
                                            cursor="pointer"
                                        >
                                            <Flex gap={4} align="center" mb={4}>
                                                <Avatar.Root size="lg" bg="primary">
                                                    <Avatar.Fallback name={leg.name.official_full} />
                                                </Avatar.Root>

                                                <VStack align="flex-start" gap={1}>
                                                    <Heading size="md" color="primary">
                                                        {leg.name.official_full}
                                                    </Heading>
                                                    <HStack gap={2}>
                                                        <Badge colorScheme="blue">{currentTerm.state}</Badge>
                                                        {currentTerm.district && (
                                                            <Badge colorScheme="green">District {currentTerm.district}</Badge>
                                                        )}
                                                    </HStack>
                                                </VStack>
                                            </Flex>

                                            <Text color="text" fontSize="sm">
                                                {currentTerm.type === 'sen' ? 'Senate' : 'House of Representatives'}
                                            </Text>
                                            <Text color="text" fontSize="sm" mt={1}>
                                                Party: {currentTerm.party}
                                            </Text>
                                        </Box>
                                    </Link>
                                );
                            })}
                        </SimpleGrid>
                    ) : null}
                </Box>
                {<LegislatorCarousel />}
            </Container>

        </>
    )
}

