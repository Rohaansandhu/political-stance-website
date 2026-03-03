import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Container,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { Menu, X } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Legislators", to: "/explore-legislators" },
    { label: "Congress Data", to: "/congress-data" },
    { label: "Bill Analyses", to: "/bill-analyses" },
    { label: "About", to: "/about" },
  ];

  return (
    <Box
      as="header"
      // Sticky navbar to stay at top during scroll
      pos="sticky"
      top={0}
      zIndex="sticky"
      bg="bg/80"
      // glass effect
      backdropFilter="blur(10px)"
      borderBottomWidth="1px"
      borderColor="bgLightShade"
      transition="all 0.2s ease-in-out"
    >
      <Container maxW="7xl" px={4} py={4}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <RouterLink to="/">
            <Heading
              size="xl"
              color="primary"
              fontWeight="bold"
              letterSpacing="tight"
            >
              US PoliTrack
            </Heading>
          </RouterLink>

          {/* Desktop Nav Links */}
          <HStack as="nav" display={{ base: "none", md: "flex" }} gap={8}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                asChild
                fontSize="sm"
                fontWeight="semibold"
                color="text"
                opacity={0.7}
                _focus={{ boxShadow: "none", outline: "none" }}
                _focusVisible={{ boxShadow: "outline" }}
                _hover={{
                  textDecoration: "none",
                  opacity: 1,
                  color: "primary",
                }}
                transition="all 0.2s"
              >
                <RouterLink to={item.to}>{item.label}</RouterLink>
              </Link>
            ))}
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Toggle menu"
            variant="ghost"
            color="primary"
            display={{ base: "flex", md: "none" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </IconButton>
        </Flex>

        {/* Mobile Nav Menu */}
        {isOpen && (
          <Box
            display={{ base: "block", md: "none" }}
            mt={2}
            pb={4}
            // Ensure mobile menu also has blur if needed
          >
            <VStack align="stretch" gap={1}>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  asChild
                  py={3}
                  px={4}
                  rounded="lg"
                  color="text"
                  _hover={{
                    bg: "bgLightShade",
                    color: "primary",
                    textDecoration: "none",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  <RouterLink to={item.to}>{item.label}</RouterLink>
                </Link>
              ))}
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Navbar;
