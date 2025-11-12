import {
    Box,
    Heading,
    Text,
    Input,
    Button,
    Flex,
    Container,
} from "@chakra-ui/react";

interface LegislatorsHeroProps {
    onSearch: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function LegislatorsHero({ onSearch, searchQuery, setSearchQuery }: LegislatorsHeroProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <Box
            py={20}
            bg="bgLightTint"
            borderRadius="xl"
            textAlign="center"
        >
            <Container maxW="4xl">
                <Heading size="2xl" mb={4} color="primary">
                    Explore U.S. Legislators
                </Heading>

                <Text fontSize="lg" color="text" mb={10}>
                    Search and discover detailed profiles for members of Congress.
                </Text>

                <Flex
                    maxW="600px"
                    mx="auto"
                    gap={3}
                    direction={{ base: "column", md: "row" }}
                >
                    <Input
                        placeholder="Search by name, state, or party..."
                        bg="bg"
                        borderColor="border"
                        _focusVisible={{
                            outline: "2px solid",
                            outlineColor: "primary",
                        }}
                        size="lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />

                    <Button
                        size="lg"
                        colorScheme="teal"
                        px={8}
                        onClick={onSearch}
                    >
                        Search
                    </Button>
                </Flex>
            </Container>
        </Box>
    );
}