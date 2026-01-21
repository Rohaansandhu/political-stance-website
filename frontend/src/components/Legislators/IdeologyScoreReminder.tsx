import { Box, Heading, Text, Flex, Icon } from "@chakra-ui/react";
import { Info } from "lucide-react";

export function IdeologyScoreReminder() {
  return (
    <Box
      bg="bdLightShade"
      p={4}
      rounded="md"
      borderLeft="4px solid"
      borderColor="accent"
    >
      <Flex align="start" gap={3}>
        <Icon as={Info} boxSize={5} color="accent" mt={0.5} flexShrink={0} />
        <Box>
          <Heading as="h4" size="sm" color="primary" mb={2}>
            About Ideology Scores
          </Heading>
          <Text fontSize="sm" color="text" opacity={0.9} mb={3}>
            Scores range from -1 (liberal) to +1 (conservative) based on actual
            voting records, weighted by bill importance and partisan
            significance. Scores vary by LLM model.
          </Text>
          <Flex align="center" gap={2} fontSize="xs" flexWrap="wrap">
            <Box
              px={3}
              py={1}
              rounded="full"
              bg="blue.500"
              color="white"
              fontWeight="semibold"
            >
              -1 Liberal
            </Box>
            <Text color="text" opacity={0.6}>
              →
            </Text>
            <Box
              px={3}
              py={1}
              rounded="full"
              bg="red.500"
              color="white"
              fontWeight="semibold"
            >
              +1 Conservative
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
