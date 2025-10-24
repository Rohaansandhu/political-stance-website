import {
    Box,
    Flex,
    Heading,
    IconButton,
    Link,
    HStack,
    Container,
} from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

export function Header() {
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("teal.700", "teal.100");
    const hoverColor = useColorModeValue("blue.500", "blue.300");

    return (
        <Box as="header" borderBottomWidth="1px" borderColor={borderColor} bg={bgColor}>
            <Container maxW="6xl" px={4} py={4}>
                <Flex align="center" justify="space-between">
                    {/* Left side: logo + nav */}
                    <Flex align="center" gap={8}>
                        <Heading size="md" color="teal.700">
                            PolicyTrack
                        </Heading>

                        <HStack
                            as="nav"
                            spaceX={6}
                            display={{ base: "none", md: "flex" }}
                            fontWeight="medium"
                        >
                            <Link
                                href="#legislators"
                                color={textColor}
                                _hover={{ color: hoverColor }}
                                transition="color 0.2s"
                            >
                                Legislators
                            </Link>
                            <Link
                                href="#congress"
                                color={textColor}
                                _hover={{ color: hoverColor }}
                                transition="color 0.2s"
                            >
                                Congress Data
                            </Link>
                            <Link
                                href="#about"
                                color={textColor}
                                _hover={{ color: hoverColor }}
                                transition="color 0.2s"
                            >
                                About
                            </Link>
                        </HStack>
                    </Flex>

                    {/* Right side: search icon */}
                    <Flex align="center" gap={3}>
                        <IconButton
                            aria-label="Search"
                            variant="ghost"
                            _hover={{ color: hoverColor }}
                        />
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
}
