import { Box, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Eyebrow, TwoToneHeading } from "./landingParts";

interface MethodPanelProps {
  bg: string;
  eyebrow: string;
  title: string;
  description: string;
  steps: { title: string; description: string }[];
  children: ReactNode;
}

export function MethodPanel({ bg, eyebrow, title, description, steps, children }: MethodPanelProps) {
  return (
    <Flex direction="column" bg={bg} rounded="card" p={{ base: 5, md: 8, xl: 10 }} minW={0}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <TwoToneHeading as="h3" size="panel" lead={title} />
      <Text color="textMuted" fontSize="md" lineHeight="1.6" mt={4} mb={7} minH={{ xl: "6.4em" }}>
        {description}
      </Text>

      {children}

      <Box as="ol" listStyleType="none" mt={8}>
        {steps.map((step, i) => (
          <Flex as="li" key={step.title} gap={4} py={4} borderTopWidth="1px" borderColor="border" align="flex-start">
            <Text fontFamily="'Fraunces', serif" fontSize="lg" color="primary" lineHeight="1.3">
              {String(i + 1).padStart(2, "0")}
            </Text>
            <Box>
              <Text fontWeight="semibold" color="text" mb={1}>
                {step.title}
              </Text>
              <Text color="textMuted" fontSize="sm" lineHeight="1.5">
                {step.description}
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
}
