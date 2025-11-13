import {
  Box,
  Badge,
  Heading,
  Text,
  SimpleGrid,
  Progress,
  VStack,
  HStack,
  Separator,
  Card,
  CardBody,
  Stack,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react/avatar";
import LegislatorCarousel from "./LegislatorCarousel";

// const sampleLegislators = [
//   {
//     name: "Sarah Mitchell",
//     party: "Democrat",
//     state: "CA",
//     district: "12th District",
//     initials: "SM",
//     liberalScore: 85,
//     conservativeScore: 15,
//     rank: 42,
//     totalRanked: 435,
//   },
//   {
//     name: "James Reynolds",
//     party: "Republican",
//     state: "TX",
//     district: "5th District",
//     initials: "JR",
//     liberalScore: 22,
//     conservativeScore: 78,
//     rank: 312,
//     totalRanked: 435,
//   },
//   {
//     name: "Maria Gonzalez",
//     party: "Democrat",
//     state: "NY",
//     district: "15th District",
//     initials: "MG",
//     liberalScore: 72,
//     conservativeScore: 28,
//     rank: 98,
//     totalRanked: 435,
//   },
// ];

export function LegislatorPreview() {
  return (
    <Box id="legislators" py={20} bg="gray.50">
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
