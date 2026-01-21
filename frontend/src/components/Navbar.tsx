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
      borderBottomWidth="1px"
      borderColor="gray.200"
      bg="bgLightTint"
    >
      <Container maxW="6xl" px={4} py={4}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <Heading size="md" color="teal.700">
            US PoliTrack
          </Heading>

          {/* Desktop Nav Links */}
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

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Toggle menu"
            variant="ghost"
            color="teal.700"
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
            mt={4}
            pb={4}
            borderTopWidth="1px"
            borderColor="gray.200"
          >
            <VStack align="stretch" gap={3}>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  asChild
                  py={2}
                  px={3}
                  rounded="md"
                  _hover={{
                    bg: "teal.50",
                    color: "teal.500",
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
