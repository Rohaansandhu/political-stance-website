import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Avatar,
  VStack,
  HStack,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";

interface Term {
  type: string;
  start: string;
  end: string;
  state: string;
  district?: number;
  class?: number;
  party: string;
}

interface DataInfo {
  name: { official_full: string };
  bio: { gender: string; birthday: string };
  id: { bioguide?: string; lis?: string };
  state: string;
  district: number;
  terms?: Term[];
}

export default function LegislatorProfileHeader({ data }: { data: DataInfo }) {
  const [termsExpanded, setTermsExpanded] = useState(false);
  const { name, bio, terms = [], id } = data;
  const imageUrl = `https://unitedstates.github.io/images/congress/450x550/${id.bioguide}.jpg`;

  const currentTerm = terms[terms.length - 1];
  const historicalTerms = terms.slice(1);

  return (
    <Flex
      bg="bgLightTint"
      px={6}
      py={4}
      rounded="xl"
      gap={5}
      align="center"
      w="100%"
    >
      {/* Photo — compact */}
      <Box flexShrink={0} w="90px">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name.official_full} headshot`}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            fit="cover"
            w="90px"
          />
        ) : (
          <Avatar.Root size="xl" bg="primary">
            <Avatar.Fallback name={name.official_full} />
          </Avatar.Root>
        )}
      </Box>

      {/* Name + bio — horizontal */}
      <VStack align="flex-start" gap={1} flex={1} minW={0}>
        <Heading size="xl">{name.official_full}</Heading>
        <HStack gap={2} wrap="wrap">
          <Badge colorScheme="blue">{data.state}</Badge>
          {data.district && (
            <Badge colorScheme="green">District {data.district}</Badge>
          )}
          {currentTerm && (
            <Badge
              colorScheme={currentTerm.party === "Republican" ? "red" : "blue"}
            >
              {currentTerm.party}
            </Badge>
          )}
          {currentTerm && (
            <Badge>{currentTerm.type === "rep" ? "House" : "Senate"}</Badge>
          )}
        </HStack>
        <HStack gap={4} fontSize="sm" color="gray.500">
          <Text>Born: {bio.birthday}</Text>
          <Text>Gender: {bio.gender}</Text>
          {currentTerm && (
            <Text>
              {currentTerm.start} → {currentTerm.end}
            </Text>
          )}
        </HStack>
      </VStack>

      {/* Terms — right side, collapsible */}
      {historicalTerms.length > 0 && (
        <Box flexShrink={0} textAlign="right">
          <Text
            fontSize="sm"
            color="blue.500"
            cursor="pointer"
            onClick={() => setTermsExpanded(!termsExpanded)}
            userSelect="none"
          >
            {termsExpanded
              ? `▲ Hide ${historicalTerms.length} previous term(s)`
              : `▼ Show ${historicalTerms.length} previous term(s)`}
          </Text>

          {termsExpanded && (
            <Box
              position="absolute"
              right={6}
              mt={2}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              rounded="lg"
              p={3}
              zIndex={10}
              shadow="md"
              maxW="400px"
            >
              <SimpleGrid columns={2} gap={2}>
                {historicalTerms.map((term, idx) => (
                  <Box
                    key={idx}
                    bg="gray.50"
                    p={2}
                    rounded="md"
                    borderWidth="1px"
                  >
                    <HStack justify="space-between" mb={1}>
                      <Badge
                        fontSize="2xs"
                        colorScheme={
                          term.party === "Republican" ? "red" : "blue"
                        }
                      >
                        {term.party}
                      </Badge>
                      <Badge fontSize="2xs">
                        {term.type === "rep" ? "House" : "Senate"}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" fontWeight="semibold">
                      {term.state}
                      {term.district
                        ? ` — D${term.district}`
                        : term.class
                          ? ` — C${term.class}`
                          : ""}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {term.start} → {term.end}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Box>
      )}
    </Flex>
  );
}
