import { Box, Flex, Grid, Heading, Text, Link, Separator } from "@chakra-ui/react";
import GithubIcon from '../assets/github.svg'

export function Footer() {
    return (
        <Box as="footer" bg="gray.800" color="white" py={12}>
            <Box maxW="6xl" mx="auto" px={4}>
                <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={8} mb={8}>
                    <Box>
                        <Heading as="h3" size="md" mb={4}>
                            PolicyTrack
                        </Heading>
                        <Text color="whiteAlpha.700">
                            Empowering citizens with transparent political data and legislator accountability.
                        </Text>
                    </Box>

                    <Box>
                        <Heading as="h4" size="sm" mb={4}>
                            Platform
                        </Heading>
                        <Flex direction="column" gap={2}>
                            {["Legislators", "Congress Data", "Search", "API"].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    color="whiteAlpha.700"
                                    _hover={{ color: "white" }}
                                    transition="color 0.2s"
                                >
                                    {item}
                                </Link>
                            ))}
                        </Flex>
                    </Box>

                    <Box>
                        <Heading as="h4" size="sm" mb={4}>
                            Resources
                        </Heading>
                        <Flex direction="column" gap={2}>
                            {["Documentation", "Methodology", "Blog", "FAQ"].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    color="whiteAlpha.700"
                                    _hover={{ color: "white" }}
                                    transition="color 0.2s"
                                >
                                    {item}
                                </Link>
                            ))}
                        </Flex>
                    </Box>

                    <Box>
                        <Heading as="h4" size="sm" mb={4}>
                            Legal
                        </Heading>
                        <Flex direction="column" gap={2}>
                            {["Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    color="whiteAlpha.700"
                                    _hover={{ color: "white" }}
                                    transition="color 0.2s"
                                >
                                    {item}
                                </Link>
                            ))}
                        </Flex>
                    </Box>
                </Grid>

                <Separator borderColor="whiteAlpha.300" mb={8} />

                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    gap={4}
                >
                    <Text color="whiteAlpha.700">© 2025 PolicyTrack. All rights reserved.</Text>
                    <Flex gap={4}>
                        <Link
                            href="#"
                            color="whiteAlpha.700"
                            _hover={{ color: "white" }}
                            transition="color 0.2s"
                        >
                            <img src={GithubIcon} alt="GitHub" width={20} height={20} />
                        </Link>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
}
