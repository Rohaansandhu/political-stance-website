import { useState } from "react";
import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import politicalCategories from "../../../data/politicalCategories.json";

interface IdeologyViewsBarProps {
  subject: string;
  compact?: boolean;
}

export default function IdeologyViewsBar({
  subject,
  compact = false,
}: IdeologyViewsBarProps) {
  const [expanded, setExpanded] = useState(false);
  const category = politicalCategories.political_categories.find(
    (c) => c.name === subject,
  );

  if (!category) return null;

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
      mb={4}
      fontSize={compact ? "sm" : "md"}
    >
      {/* Two-column header — always visible */}
      <HStack gap={0} align="stretch">
        {/* Liberal side */}
        <Box
          flex={1}
          bg="blue.50"
          px={compact ? 4 : 6}
          py={compact ? 3 : 4}
          borderRight="2px solid"
          borderColor="blue.200"
        >
          <HStack gap={2} mb={1}>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg="blue.500"
              flexShrink={0}
            />
            <Text
              fontWeight="700"
              color="blue.700"
              fontSize={compact ? "xs" : "sm"}
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              Liberal View
            </Text>
          </HStack>
          <Text color="blue.900" lineHeight="1.5">
            {category.liberal_view}
          </Text>
        </Box>

        {/* Conservative side */}
        <Box
          flex={1}
          bg="red.50"
          px={compact ? 4 : 6}
          py={compact ? 3 : 4}
          borderLeft="2px solid"
          borderColor="red.200"
        >
          <HStack gap={2} mb={1}>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg="red.500"
              flexShrink={0}
            />
            <Text
              fontWeight="700"
              color="red.700"
              fontSize={compact ? "xs" : "sm"}
              letterSpacing="0.05em"
              textTransform="uppercase"
            >
              Conservative View
            </Text>
          </HStack>
          <Text color="red.900" lineHeight="1.5">
            {category.conservative_view}
          </Text>
        </Box>
      </HStack>

      {/* Spectrum label bar */}
      <Box position="relative" bg="gray.100" px={6} py={1}>
        <Box
          position="absolute"
          left={0}
          right={0}
          top="50%"
          transform="translateY(-50%)"
          height="2px"
          bgGradient="linear(to-r, blue.400, gray.300, red.400)"
          mx={6}
        />
        <HStack justify="space-between" position="relative" zIndex={1}>
          <Text fontSize="xs" color="blue.600" fontWeight="600">
            ← −1.0 Liberal
          </Text>
          <Text
            fontSize="xs"
            color="gray.500"
            cursor="pointer"
            _hover={{ color: "gray.700" }}
            onClick={() => setExpanded((p) => !p)}
            userSelect="none"
          >
            {expanded ? "Show less ▲" : "Show more ▼"}
          </Text>
          <Text fontSize="xs" color="red.600" fontWeight="600">
            Conservative +1.0 →
          </Text>
        </HStack>
      </Box>

      {/* Subcategory detail — shown when expanded */}
      {expanded && category.subcategories?.length > 0 && (
        <Box bg="white" px={compact ? 4 : 6} py={4}>
          <Text
            fontWeight="700"
            fontSize="sm"
            color="gray.600"
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
                border="1px solid"
                borderColor="gray.100"
              >
                <Box
                  bg="gray.50"
                  px={4}
                  py={2}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                >
                  <Text fontWeight="700" fontSize="sm" color="gray.800">
                    {sub.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {sub.description}
                  </Text>
                </Box>
                <HStack gap={0} align="stretch">
                  <Box
                    flex={1}
                    bg="blue.50"
                    px={4}
                    py={2}
                    borderRight="1px solid"
                    borderColor="blue.100"
                  >
                    <Text fontSize="xs" color="blue.900" lineHeight="1.5">
                      {sub.liberal_view}
                    </Text>
                  </Box>
                  <Box flex={1} bg="red.50" px={4} py={2}>
                    <Text fontSize="xs" color="red.900" lineHeight="1.5">
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
