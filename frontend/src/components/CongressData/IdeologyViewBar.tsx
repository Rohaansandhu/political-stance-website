import { useState } from "react";
import { Box, Text, HStack, VStack, Wrap, Badge } from "@chakra-ui/react";
import politicalCategories from "../../../data/politicalCategories.json";
import politicalAxes from "../../../data/politicalAxes.json";

interface IdeologyViewsBarProps {
  // Exactly one of subject (a category name) or axisId (an axis id) should
  // be given. subject is kept as the primary prop for backwards
  // compatibility with existing category call sites.
  subject?: string;
  axisId?: string;
  compact?: boolean;
}

export default function IdeologyViewsBar({
  subject,
  axisId,
  compact = false,
}: IdeologyViewsBarProps) {
  const [expanded, setExpanded] = useState(false);

  if (axisId) {
    const axis = politicalAxes.political_axes.find((a) => a.id === axisId);
    if (!axis) return null;

    const typicalCategories = [
      ...axis.typical_categories.most,
      ...axis.typical_categories.some,
    ];

    return (
      <Box
        borderRadius="xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor="border"
        mb={4}
        fontSize={compact ? "sm" : "md"}
      >
        <HStack gap={0} align="stretch">
          <Box
            flex={1}
            bg="blue.subtle"
            px={compact ? 4 : 6}
            py={compact ? 3 : 4}
            borderRight="2px solid"
            borderColor="blue.muted"
          >
            <HStack gap={2} mb={1}>
              <Box w="10px" h="10px" borderRadius="full" bg="partyDem" flexShrink={0} />
              <Text
                fontWeight="700"
                color="blue.fg"
                fontSize={compact ? "xs" : "sm"}
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                {axis.negative_pole.label}
              </Text>
            </HStack>
            <Text color="blue.fg" lineHeight="1.5">
              {axis.negative_pole.description}
            </Text>
          </Box>

          <Box
            flex={1}
            bg="red.subtle"
            px={compact ? 4 : 6}
            py={compact ? 3 : 4}
            borderLeft="2px solid"
            borderColor="red.muted"
          >
            <HStack gap={2} mb={1}>
              <Box w="10px" h="10px" borderRadius="full" bg="partyRep" flexShrink={0} />
              <Text
                fontWeight="700"
                color="red.fg"
                fontSize={compact ? "xs" : "sm"}
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                {axis.positive_pole.label}
              </Text>
            </HStack>
            <Text color="red.fg" lineHeight="1.5">
              {axis.positive_pole.description}
            </Text>
          </Box>
        </HStack>

        <Box position="relative" bg="bgLightShade" px={6} py={1.5} borderTopWidth="1px" borderColor="borderSubtle">
          <HStack justify="space-between" position="relative" zIndex={1}>
            <Text fontSize="xs" color="blue.fg" fontWeight="600">
              ← −1.0 {axis.negative_pole.label}
            </Text>
            <Text
              fontSize="xs"
              color="textMuted"
              cursor="pointer"
              _hover={{ color: "text" }}
              onClick={() => setExpanded((p) => !p)}
              userSelect="none"
            >
              {expanded ? "Show less ▲" : "Show more ▼"}
            </Text>
            <Text fontSize="xs" color="red.fg" fontWeight="600">
              {axis.positive_pole.label} +1.0 →
            </Text>
          </HStack>
        </Box>

        {expanded && (
          <Box bg="surface" px={compact ? 4 : 6} py={4}>
            <Text
              fontWeight="700"
              fontSize="sm"
              color="textMuted"
              mb={2}
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              How it's scored
            </Text>
            <Text fontSize="sm" color="text" mb={3} lineHeight="1.5">
              {axis.scoring_rule}
            </Text>

            {typicalCategories.length > 0 && (
              <>
                <Text
                  fontWeight="700"
                  fontSize="sm"
                  color="textMuted"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  Typical Categories
                </Text>
                <Wrap gap={2}>
                  {typicalCategories.map((cat) => (
                    <Badge key={cat} variant="subtle" colorPalette="purple" fontSize="xs">
                      {cat}
                    </Badge>
                  ))}
                </Wrap>
              </>
            )}
          </Box>
        )}
      </Box>
    );
  }

  const category = politicalCategories.political_categories.find(
    (c) => c.name === subject,
  );

  if (!category) return null;

  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border"
      mb={4}
      fontSize={compact ? "sm" : "md"}
    >
      {/* Two-column header — always visible */}
      <HStack gap={0} align="stretch">
        {/* Liberal side */}
        <Box
          flex={1}
          bg="blue.subtle"
          px={compact ? 4 : 6}
          py={compact ? 3 : 4}
          borderRight="2px solid"
          borderColor="blue.muted"
        >
          <HStack gap={2} mb={1}>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg="partyDem"
              flexShrink={0}
            />
            <Text
              fontWeight="700"
              color="blue.fg"
              fontSize={compact ? "xs" : "sm"}
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              Liberal View
            </Text>
          </HStack>
          <Text color="blue.fg" lineHeight="1.5">
            {category.liberal_view}
          </Text>
        </Box>

        {/* Conservative side */}
        <Box
          flex={1}
          bg="red.subtle"
          px={compact ? 4 : 6}
          py={compact ? 3 : 4}
          borderLeft="2px solid"
          borderColor="red.muted"
        >
          <HStack gap={2} mb={1}>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg="partyRep"
              flexShrink={0}
            />
            <Text
              fontWeight="700"
              color="red.fg"
              fontSize={compact ? "xs" : "sm"}
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              Conservative View
            </Text>
          </HStack>
          <Text color="red.fg" lineHeight="1.5">
            {category.conservative_view}
          </Text>
        </Box>
      </HStack>

      {/* Spectrum label bar */}
      <Box position="relative" bg="bgLightShade" px={6} py={1.5} borderTopWidth="1px" borderColor="borderSubtle">
        <HStack justify="space-between" position="relative" zIndex={1}>
          <Text fontSize="xs" color="blue.fg" fontWeight="600">
            ← −1.0 Liberal
          </Text>
          <Text
            fontSize="xs"
            color="textMuted"
            cursor="pointer"
            _hover={{ color: "text" }}
            onClick={() => setExpanded((p) => !p)}
            userSelect="none"
          >
            {expanded ? "Show less ▲" : "Show more ▼"}
          </Text>
          <Text fontSize="xs" color="red.fg" fontWeight="600">
            Conservative +1.0 →
          </Text>
        </HStack>
      </Box>

      {/* Subcategory detail — shown when expanded */}
      {expanded && category.subcategories?.length > 0 && (
        <Box bg="surface" px={compact ? 4 : 6} py={4}>
          <Text
            fontWeight="700"
            fontSize="sm"
            color="textMuted"
            mb={3}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Subcategory Breakdown
          </Text>
          <VStack gap={3} align="stretch">
            {category.subcategories.map((sub) => (
              <Box
                key={sub.name}
                borderRadius="md"
                overflow="hidden"
                borderWidth="1px"
                borderColor="borderSubtle"
              >
                <Box
                  bg="bgLightShade"
                  px={4}
                  py={2}
                  borderBottomWidth="1px"
                  borderColor="borderSubtle"
                >
                  <Text fontWeight="700" fontSize="sm" color="text">
                    {sub.name}
                  </Text>
                  <Text fontSize="xs" color="textMuted">
                    {sub.scope}
                  </Text>
                </Box>
                <HStack gap={0} align="stretch">
                  <Box
                    flex={1}
                    bg="blue.subtle"
                    px={4}
                    py={2}
                    borderRight="1px solid"
                    borderColor="blue.muted"
                  >
                    <Text fontSize="xs" color="blue.fg" lineHeight="1.5">
                      {sub.liberal_view}
                    </Text>
                  </Box>
                  <Box flex={1} bg="red.subtle" px={4} py={2}>
                    <Text fontSize="xs" color="red.fg" lineHeight="1.5">
                      {sub.conservative_view}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
}
