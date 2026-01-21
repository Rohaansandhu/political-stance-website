import { Box, Heading, Text, Flex, Icon } from "@chakra-ui/react";
import { Info } from "lucide-react";

export function BillAnalysisReminder() {
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
            About Bill Analysis
          </Heading>
          <Text fontSize="sm" color="text" opacity={0.9} mb={3}>
            Large language models analyze legislative text to identify political
            categories and estimate partisan leanings. Each bill receives a
            partisan score from -1 (liberal) to +1 (conservative) based on the
            weighted average of its political categories.
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
