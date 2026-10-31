import { Box, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ArrowLink, Eyebrow, TwoToneHeading } from "./landingParts";

interface FeatureRowProps {
  icon: LucideIcon;
  eyebrow: string;
  lead: string;
  rest: string;
  description: string;
  points: string[];
  to: string;
  cta: string;
  panelBg: string;
  flip?: boolean;
  children: ReactNode;
}

export function FeatureRow({
  icon,
  eyebrow,
  lead,
  rest,
  description,
  points,
  to,
  cta,
  panelBg,
  flip = false,
  children,
}: FeatureRowProps) {
  return (
    <Grid
      templateColumns={{ base: "minmax(0, 1fr)", lg: flip ? "7fr 5fr" : "5fr 7fr" }}
      gap={{ base: 8, lg: 16 }}
      alignItems="center"
    >
      <GridItem order={{ base: 1, lg: flip ? 2 : 1 }} minW={0}>
        <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
        <TwoToneHeading as="h2" lead={lead} rest={rest} />
        <Text color="textMuted" fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" mt={5}>
          {description}
        </Text>
        <VStack as="ul" listStyleType="none" align="stretch" gap={0} mt={6} mb={7} borderTopWidth="1px" borderColor="border">
          {points.map((point) => (
            <Box as="li" key={point} py={3} borderBottomWidth="1px" borderColor="border" fontSize="sm" color="text">
              {point}
            </Box>
          ))}
        </VStack>
        <ArrowLink to={to}>{cta}</ArrowLink>
      </GridItem>

      <GridItem
        order={{ base: 2, lg: flip ? 1 : 2 }}
        minW={0}
        bg={panelBg}
        rounded="card"
        p={{ base: 4, md: 8, xl: 10 }}
      >
        {children}
      </GridItem>
    </Grid>
  );
}
