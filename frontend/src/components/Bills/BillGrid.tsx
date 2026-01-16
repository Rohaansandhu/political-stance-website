import { Grid, GridItem, Center, Spinner, Text, VStack } from '@chakra-ui/react';
import BillCard from './BillCard';

interface BillSummary {
  title: string;
  key_provisions: string[];
}

interface PrimaryCategory {
  name: string;
  partisan_score: number;
  impact_score: number;
  reasoning: string;
}

interface BillAnalysis {
  _id?: string;
  bill_id: string;
  model: string;
  bill_type: string;
  chamber: string;
  congress: number;
  bill_summary: BillSummary;
  political_categories: {
    primary_categories: PrimaryCategory[];
  };
  avg_partisan_score?: number;
}

interface BillGridProps {
  bills: BillAnalysis[];
  loading?: boolean;
  featured?: boolean;
  emptyMessage?: string;
  columns?: {
    base?: number;
    md?: number;
    lg?: number;
  };
}

export default function BillGrid({ 
  bills, 
  loading = false, 
  featured = false,
  emptyMessage = "No bills found. Try adjusting your filters.",
  columns = { base: 1, md: 2, lg: 3 }
}: BillGridProps) {
  
  if (loading) {
    return (
      <Center py={20}>
        <VStack gap={4}>
          <Spinner size="xl" color="primary" />
          <Text color="text" fontSize="sm">
            Loading bills...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (bills.length === 0) {
    return (
      <Center py={20}>
        <VStack gap={2}>
          <Text color="text" fontSize="lg" fontWeight="medium">
            {emptyMessage}
          </Text>
          <Text color="text" fontSize="sm">
            Try different search terms or filters
          </Text>
        </VStack>
      </Center>
    );
  }

  const getTemplateColumns = () => {
    const { base = 1, md = 2, lg = 3 } = columns;
    return {
      base: `repeat(${base}, 1fr)`,
      md: `repeat(${md}, 1fr)`,
      lg: `repeat(${lg}, 1fr)`
    };
  };

  return (
    <Grid 
      templateColumns={getTemplateColumns()} 
      gap={featured ? 4 : 6}
      w="100%"
    >
      {bills.map((bill) => (
        <GridItem key={bill.bill_id}>
          <BillCard bill={bill} featured={featured} />
        </GridItem>
      ))}
    </Grid>
  );
}