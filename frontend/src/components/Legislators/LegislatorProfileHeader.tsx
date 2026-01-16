import {
    Box,
    Flex,
    Heading,
    Text,
    Badge,
    Avatar,
    VStack,
    HStack,
    SimpleGrid,
    Spacer,
    Image,
} from "@chakra-ui/react";

interface Term {
    type: string;
    start: string;
    end: string;
    state: string;
    district?: number;
    class?: number;
    party: string;
}

interface DataInfo {
    name: { official_full: string };
    bio: { gender: string; birthday: string };
    id: { bioguide?: string; lis?: string };
    state: string;
    district: number;
    terms?: Term[];
}

export default function LegislatorProfileHeader({ data }: { data: DataInfo }) {
    const { name, bio, terms = [], id } = data;

    const imageUrl = `https://unitedstates.github.io/images/congress/450x550/${id.bioguide}.jpg`;

    return (
        <Flex
            bg="bgLightTint"
            p={8}
            rounded="xl"
            gap={10}
            direction={{ base: "column", md: "row" }}
            w="100%"
        >
            <Box minW="225px" maxW="225px" alignSelf="center">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={`${name.official_full} headshot`}
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor="gray.200"
                        fit="cover"
                    />
                ) : (
                    <Avatar.Root size="2xl" bg="primary">
                        <Avatar.Fallback name={name.official_full} />
                    </Avatar.Root>
                )}
            </Box>

            <VStack align="flex-start" w="100%" gap={4}>
                <Heading size="2xl">{name.official_full}</Heading>

                <HStack>
                    <Badge colorScheme="blue">{data.state}</Badge>
                    {data.district && (
                        <Badge colorScheme="green">District {data.district}</Badge>
                    )}
                </HStack>

                <Text color="text">Gender: {bio.gender}</Text>

                <Text color="text">Born: {bio.birthday}</Text>

                {/* Divider */}
                <Spacer />

                {/* Terms Section */}
                <Box w="100%">
                    <Heading size="md" mb={3}>Career Terms</Heading>

                    {terms.length === 0 ? (
                        <Text color="gray.500">No term history available.</Text>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            {terms.map((term, idx) => (
                                <Box
                                    key={idx}
                                    bg="bgLightShade"
                                    p={4}
                                    rounded="lg"
                                    borderWidth="1px"
                                >
                                    <HStack justify="space-between" mb={1}>
                                        <Badge
                                            colorScheme={term.party === "Republican" ? "red" : "blue"}
                                        >
                                            {term.party}
                                        </Badge>

                                        <Badge>
                                            {term.type === "rep" ? "House" : "Senate"}
                                        </Badge>
                                    </HStack>

                                    <Text fontWeight="semibold">
                                        {term.state}
                                        {term.district
                                            ? ` — District ${term.district}`
                                            : term.class
                                                ? ` — Class ${term.class}`
                                                : ""}
                                    </Text>

                                    <Text fontSize="sm" color="gray.600">
                                        {term.start} → {term.end}
                                    </Text>
                                </Box>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </VStack>
        </Flex>
    );
}