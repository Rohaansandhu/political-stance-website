import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  HStack,
  Container,
} from "@chakra-ui/react"

export function Header() {

  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="secondary"
      bg="bg"
    >
      <Container maxW="6xl" px={4} py={4}>
        <Flex align="center" justify="space-between">
          {/* Left side: logo + nav */}
          <Flex align="center" gap={8}>
            <Heading size="md" color="primary">
              PolicyTrack
            </Heading>

            <HStack
              as="nav"
              spaceX={6}
              display={{ base: "none", md: "flex" }}
              fontWeight="medium"
            >
              {["Legislators", "Congress Data", "About"].map((label) => (
                <Link
                  key={label}
                  href={`#${label.toLowerCase().replace(" ", "-")}`}
                  color="text"
                  _hover={{ color: "accent" }}
                  transition="color 0.2s"
                >
                  {label}
                </Link>
              ))}
            </HStack>
          </Flex>

          {/* Right side: search icon */}
          <Flex align="center" gap={3}>
            <IconButton
              aria-label="Search"
              variant="ghost"
              color="text"
              _hover={{ color: "accent" }}
            />
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
