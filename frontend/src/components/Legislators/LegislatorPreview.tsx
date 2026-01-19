import {
  Box,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import LegislatorCarousel from "./LegislatorCarousel";

export function LegislatorPreview() {
  return (
    <Box id="legislators" py={20} bg="bgLightShade">
      <Box maxW="6xl" mx="auto" px={4}>
        <VStack spaceX={4} mb={12} textAlign="center">
          <Heading mb={4} fontSize={{ base: "3xl", md: "4xl" }}>
            Legislator Profiles
          </Heading>
          <Text color="gray.600" maxW="2xl" mx="auto"
            fontSize={{ base: "md", md: "lg" }}>
            Each legislator profile includes detailed political spectrum analysis,
            voting history rankings, and comparative data across congressional
            sessions.
          </Text>
        </VStack>
        <LegislatorCarousel />
      </Box>
    </Box>
  );
}
