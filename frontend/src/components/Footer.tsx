import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Link,
  Separator,
} from "@chakra-ui/react";
import GithubIcon from "../assets/github.svg";

export function Footer() {
  const platformLinks = [
    { label: "Legislators", href: "/explore-legislators" },
    { label: "Congress Data", href: "/congress-data" },
    { label: "Bill Analyses", href: "/bill-analyses" },
    // { label: "API", href: "#" },
  ];

  const resourcesLinks = [
    { label: "About", href: "/about" },
    { label: "Methodology", href: "/about" },
    // { label: "Blog", href: "#" }, 
    { label: "Glossary", href: "/about" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <Box as="footer" bg="gray.800" color="white" py={12}>
      <Box maxW="6xl" mx="auto" px={4}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={8}
          mb={8}
        >
          <Box>
            <Heading as="h3" size="md" mb={4}>
              PolicyTrack
            </Heading>
            <Text color="whiteAlpha.700">
              Empowering citizens with transparent political data and legislator
              accountability.
            </Text>
          </Box>

          <Box>
            <Heading as="h4" size="sm" mb={4}>
              Platform
            </Heading>
            <Flex direction="column" gap={2}>
              {platformLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  color="whiteAlpha.700"
                  _hover={{ color: "white" }}
                  transition="color 0.2s"
                >
                  {label}
                </Link>
              ))}
            </Flex>
          </Box>

          <Box>
            <Heading as="h4" size="sm" mb={4}>
              Resources
            </Heading>
            <Flex direction="column" gap={2}>
              {resourcesLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  color="whiteAlpha.700"
                  _hover={{ color: "white" }}
                  transition="color 0.2s"
                >
                  {label}
                </Link>
              ))}
            </Flex>
          </Box>

          <Box>
            <Heading as="h4" size="sm" mb={4}>
              Legal
            </Heading>
            <Flex direction="column" gap={2}>
              {legalLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  color="whiteAlpha.700"
                  _hover={{ color: "white" }}
                  transition="color 0.2s"
                >
                  {label}
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
          <Flex gap={4}>
            <Link
              href="https://github.com/Rohaansandhu/political-stance-tracker" 
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

