import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    Flex,
    Icon,
    Container,
} from "@chakra-ui/react";
import {
    TrendingUp,
    Target,
    Database,
    Filter,
    Award,
    Activity,
} from "lucide-react";

const features = [
    {
        icon: Target,
        title: "Stance Tracking",
        description:
            "Monitor how legislators position themselves on key issues over time with detailed voting records.",
    },
    {
        icon: TrendingUp,
        title: "Political Spectrum Analysis",
        description:
            "Visual representation of where each legislator falls on the political spectrum with multi-dimensional scoring.",
    },
    {
        icon: Award,
        title: "Ranking System",
        description:
            "Compare legislators against their peers with comprehensive ranking metrics across various policy areas.",
    },
    {
        icon: Database,
        title: "Historical Data",
        description:
            "Access voting records and stance changes across multiple congressional sessions dating back decades.",
    },
    {
        icon: Filter,
        title: "Advanced Filters",
        description:
            "Filter and sort by party, state, district, policy area, or custom criteria to find exactly what you need.",
    },
    {
        icon: Activity,
        title: "Real-time Updates",
        description:
            "Stay current with live updates as votes happen and positions evolve throughout each session.",
    },
];

export function Features() {
    return (
        <Box as="section" id="about" bg="gray.50" py={20} w="full">
            <Container maxW="7xl">
                <Box textAlign="center" mb={12}>
                    <Heading mb={4} fontSize={{ base: "3xl", md: "4xl" }}>
                        Comprehensive Political Intelligence
                    </Heading>
                    <Text
                        color="gray.600"
                        maxW="2xl"
                        mx="auto"
                        fontSize={{ base: "md", md: "lg" }}
                    >
                        Everything you need to understand the political landscape and track
                        legislator accountability.
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }}>
                    {features.map((feature, index) => (
                        <Card.Root
                            key={index}
                            variant="outline"
                            _hover={{
                                shadow: "lg",
                                borderColor: "blue.400",
                                transition: "all 0.2s ease-in-out",
                            }}
                        >
                            <CardBody p={6}>
                                <Flex
                                    w={12}
                                    h={12}
                                    borderRadius="lg"
                                    bg="blue.50"
                                    align="center"
                                    justify="center"
                                    mb={4}
                                >
                                    <Icon as={feature.icon} boxSize={6} color="blue.500" />
                                </Flex>
                                <Heading as="h3" size="md" mb={2}>
                                    {feature.title}
                                </Heading>
                                <Text color="gray.600" fontSize="sm">
                                    {feature.description}
                                </Text>
                            </CardBody>
                        </Card.Root>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
