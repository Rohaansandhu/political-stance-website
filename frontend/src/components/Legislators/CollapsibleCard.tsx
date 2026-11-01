import { Box, Collapsible, Flex, Heading } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

export default function CollapsibleCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Collapsible.Root>
      <Box bg="surface" rounded="card" borderWidth="1px" borderColor="border" overflow="hidden">
        <Collapsible.Trigger w="100%" cursor="pointer" px={{ base: 4, md: 6 }} py={3}>
          <Flex justify="space-between" align="center" gap={3}>
            <Heading size="sm" color="text" textAlign="left">
              {title}
            </Heading>
            <Collapsible.Indicator
              color="textMuted"
              transition="transform 0.2s"
              _open={{ transform: "rotate(180deg)" }}
            >
              <ChevronDown size={16} />
            </Collapsible.Indicator>
          </Flex>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Box px={{ base: 4, md: 6 }} pb={4}>
            {children}
          </Box>
        </Collapsible.Content>
      </Box>
    </Collapsible.Root>
  );
}
