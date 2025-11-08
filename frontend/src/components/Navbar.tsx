import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Container,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    { label: "Home", to: "/" },
    { label: "Legislators", to: "/explore-legislators" },
    { label: "Congress Data", to: "/congress-data" },
    { label: "About", to: "/about" },
  ];

  return (
    <Box as="header" borderBottomWidth="1px" borderColor="gray.200" bg="bgLightTint">
      <Container maxW="6xl" px={4} py={4}>
        <Flex align="center" justify="space-between">
          {/* Left side: logo + nav */}
          <Flex align="center" gap={8}>
            {/* Logo */}
            <Heading size="md" color="teal.700">
              PoliTrack
            </Heading>

            {/* Nav Links (desktop) */}
            <HStack
              as="nav"
              display={{ base: "none", md: "flex" }}
              gap={6}
              fontWeight="medium"
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  asChild
                  _hover={{ textDecoration: "none", color: "teal.500" }}
                >
                  <RouterLink to={item.to}>{item.label}</RouterLink>
                </Link>
              ))}
            </HStack>
          </Flex>


            {/* Example search icon (optional) */}
            <IconButton aria-label="Search" variant="ghost" color="teal.700" />
          </Flex>
      </Container>
    </Box>
  );
}

export default Navbar;
