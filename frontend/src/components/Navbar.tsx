import { useEffect, useState } from "react";
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
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ColorModeButton } from "./ui/color-mode";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

  // On the landing page the navbar overlays the hero image transparently
  // until the user scrolls (or opens the mobile menu), then becomes solid.
  const transparent = isLanding && !scrolled && !isOpen;

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
      pos={isLanding ? "fixed" : "sticky"}
      top={0}
      left={0}
      right={0}
      zIndex="sticky"
      bg={transparent ? "transparent" : "bg/80"}
      // glass effect
      backdropFilter={transparent ? "none" : "blur(10px)"}
      borderBottomWidth="1px"
      borderColor={transparent ? "transparent" : "bgLightShade"}
      transition="all 0.2s ease-in-out"
    >
      <Container maxW="7xl" px={4} py={4}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <RouterLink to="/">
            <Heading
              size="xl"
              color={transparent ? "white" : "primary"}
              fontWeight="bold"
              letterSpacing="tight"
              transition="color 0.2s ease-in-out"
            >
              US PoliTrack
            </Heading>
          </RouterLink>

          {/* Desktop Nav Links */}
          <HStack as="nav" display={{ base: "none", md: "flex" }} gap={6}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                asChild
                fontSize="sm"
                fontWeight="semibold"
                color={transparent ? "white" : "text"}
                opacity={transparent ? 0.9 : 0.7}
                _focus={{ boxShadow: "none", outline: "none" }}
                _focusVisible={{ boxShadow: "outline" }}
                _hover={{
                  textDecoration: "none",
                  opacity: 1,
                  color: transparent ? "white" : "primary",
                }}
                transition="all 0.2s"
              >
                <RouterLink to={item.to}>{item.label}</RouterLink>
              </Link>
            ))}
            <ColorModeButton
              color={transparent ? "white" : "text"}
              _hover={{ bg: transparent ? "whiteAlpha.200" : "bgLightShade", color: transparent ? "white" : "primary" }}
            />
          </HStack>

          {/* Mobile Menu Button + Color Mode */}
          <HStack display={{ base: "flex", md: "none" }} gap={1}>
            <ColorModeButton
              color={transparent ? "white" : "text"}
              _hover={{ bg: transparent ? "whiteAlpha.200" : "bgLightShade", color: transparent ? "white" : "primary" }}
            />
            <IconButton
              aria-label="Toggle menu"
              variant="ghost"
              color={transparent ? "white" : "primary"}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
          </HStack>
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
