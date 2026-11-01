import { Box, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import CollapsibleCard from "./CollapsibleCard";
import type { LegislatorData, Term } from "./types";

function formatLongDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function genderLabel(gender: string): string {
  if (gender === "M") return "Male";
  if (gender === "F") return "Female";
  return gender;
}

function termSeat(term: Term): string {
  const chamber = term.type === "rep" ? "House" : "Senate";
  if (term.type !== "rep") return `${chamber} · ${term.state}`;
  return `${chamber} · ${term.state}${term.district ? `-${term.district}` : ""}`;
}

export default function LegislatorAbout({ data }: { data: LegislatorData }) {
  const terms = [...(data.terms ?? [])].reverse();

  return (
    <CollapsibleCard title="About">
      <VStack align="stretch" gap={3}>
        <Flex gap={6} wrap="wrap" fontSize="sm">
          {data.bio?.birthday && (
            <Text color="textMuted">
              Born:{" "}
              <Text as="span" color="text">
                {formatLongDate(data.bio.birthday)}
              </Text>
            </Text>
          )}
          {data.bio?.gender && (
            <Text color="textMuted">
              Gender:{" "}
              <Text as="span" color="text">
                {genderLabel(data.bio.gender)}
              </Text>
            </Text>
          )}
        </Flex>

        {terms.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="700" color="text" mb={2}>
              Terms
            </Text>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={2}>
              {terms.map((term) => (
                <Box
                  key={`${term.type}-${term.start}`}
                  bg="bgLightShade"
                  p={2}
                  rounded="md"
                  borderWidth="1px"
                  borderColor="borderSubtle"
                >
                  <Text fontSize="xs" fontWeight="600" color="text">
                    {termSeat(term)}
                  </Text>
                  <Text fontSize="xs" color="textMuted">
                    {term.party}
                  </Text>
                  <Text fontSize="xs" color="textMuted">
                    {term.start} → {term.end}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </VStack>
    </CollapsibleCard>
  );
}
