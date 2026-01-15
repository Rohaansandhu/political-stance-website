import { Box, Grid, Heading, HStack, Button, Badge, Select, createListCollection } from '@chakra-ui/react';

interface FilterOptions {
  models: string[];
  bill_types: string[];
  chambers: string[];
  congresses: number[];
  categories: string[];
}

interface FilterState {
  model: string;
  bill_type: string;
  chamber: string;
  congress: string;
  category: string;
  ideology: string;
}

interface BillFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions | null;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  loading?: boolean;
}

export default function BillFilters({ 
  filters, 
  filterOptions, 
  onChange, 
  onClear,
  loading = false 
}: BillFiltersProps) {
  
  // Count active filters (excluding empty strings)
  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

  // Helper to format bill type display
  const formatBillType = (type: string) => {
    return type.toUpperCase();
  };

  // Helper to format chamber display
  const formatChamber = (chamber: string) => {
    return chamber.charAt(0).toUpperCase() + chamber.slice(1);
  };

  // Helper to format congress display
  const formatCongress = (congress: number) => {
    return `${congress}th Congress`;
  };

  if (!filterOptions) {
    return (
      <Box bg="bgLightShade" p={6} rounded="lg">
        <Heading size="md" color="text">
          Loading filters...
        </Heading>
      </Box>
    );
  }

  return (
    <Box bg="bgLightShade" p={6} rounded="lg">
      <HStack justify="space-between" mb={4} flexWrap="wrap" gap={2}>
        <HStack gap={2}>
          <Heading size="md" color="primary">
            Filters
          </Heading>
          {activeFilterCount > 0 && (
            <Badge colorScheme="blue" fontSize="sm" px={2} py={1}>
              {activeFilterCount} active
            </Badge>
          )}
        </HStack>
        
        {activeFilterCount > 0 && (
          <Button 
            size="sm" 
            onClick={onClear} 
            colorScheme="red" 
            variant="ghost"
          >
            Clear All
          </Button>
        )}
      </HStack>
      
      <Grid 
        templateColumns={{ 
          base: '1fr', 
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)', 
          lg: 'repeat(6, 1fr)' 
        }} 
        gap={4}
      >
        {/* Model Filter */}
        <Select.Root
          collection={createListCollection({
            items: [
              { label: 'All Models', value: '' },
              ...filterOptions.models.map(m => ({ label: m, value: m }))
            ]
          })}
          value={filters.model ? [filters.model] : ['']}
          onValueChange={(details) => onChange('model', details.value[0])}
          disabled={loading}
        >
          <Select.Label>Model</Select.Label>
          <Select.Trigger>
            <Select.ValueText placeholder="All Models" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item item="">
              <Select.ItemText>All Models</Select.ItemText>
            </Select.Item>
            {filterOptions.models.map(m => (
              <Select.Item key={m} item={m}>
                <Select.ItemText>{m}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Bill Type Filter */}
        <Select.Root
          collection={createListCollection({
            items: [
              { label: 'All Types', value: '' },
              ...filterOptions.bill_types.map(bt => ({ 
                label: formatBillType(bt), 
                value: bt 
              }))
            ]
          })}
          value={filters.bill_type ? [filters.bill_type] : ['']}
          onValueChange={(details) => onChange('bill_type', details.value[0])}
          disabled={loading}
        >
          <Select.Label>Bill Type</Select.Label>
          <Select.Trigger>
            <Select.ValueText placeholder="All Types" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item item="">
              <Select.ItemText>All Types</Select.ItemText>
            </Select.Item>
            {filterOptions.bill_types.map(bt => (
              <Select.Item key={bt} item={bt}>
                <Select.ItemText>{formatBillType(bt)}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Chamber Filter */}
        <Select.Root
          collection={createListCollection({
            items: [
              { label: 'All Chambers', value: '' },
              ...filterOptions.chambers.map(c => ({ 
                label: formatChamber(c), 
                value: c 
              }))
            ]
          })}
          value={filters.chamber ? [filters.chamber] : ['']}
          onValueChange={(details) => onChange('chamber', details.value[0])}
          disabled={loading}
        >
          <Select.Label>Chamber</Select.Label>
          <Select.Trigger>
            <Select.ValueText placeholder="All Chambers" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item item="">
              <Select.ItemText>All Chambers</Select.ItemText>
            </Select.Item>
            {filterOptions.chambers.map(c => (
              <Select.Item key={c} item={c}>
                <Select.ItemText>{formatChamber(c)}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Congress Filter */}
        <Select.Root
          collection={createListCollection({
            items: [
              { label: 'All Congresses', value: '' },
              ...filterOptions.congresses.map(c => ({ 
                label: formatCongress(c), 
                value: c.toString() 
              }))
            ]
          })}
          value={filters.congress ? [filters.congress] : ['']}
          onValueChange={(details) => onChange('congress', details.value[0])}
          disabled={loading}
        >
          <Select.Label>Congress</Select.Label>
          <Select.Trigger>
            <Select.ValueText placeholder="All" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item item="">
              <Select.ItemText>All Congresses</Select.ItemText>
            </Select.Item>
            {filterOptions.congresses.map(c => (
              <Select.Item key={c} item={c.toString()}>
                <Select.ItemText>{formatCongress(c)}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Category Filter */}
        <Select.Root
          collection={createListCollection({
            items: [
              { label: 'All Categories', value: '' },
              ...filterOptions.categories.map(c => ({ label: c, value: c }))
            ]
          })}
          value={filters.category ? [filters.category] : ['']}
          onValueChange={(details) => onChange('category', details.value[0])}
          disabled={loading}
        >
          <Select.Label>Category</Select.Label>
          <Select.Trigger>
            <Select.ValueText placeholder="All" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item item="">
              <Select.ItemText>All Categories</Select.ItemText>
            </Select.Item>
            {filterOptions.categories.map(c => (
              <Select.Item key={c} item={c}>
                <Select.ItemText>{c}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Ideology Filter */}
        <Select.Root
          collection={createListCollection({
            items: [
              { label: 'All Ideologies', value: '' },
              { label: 'Liberal', value: 'liberal' },
              { label: 'Moderate', value: 'moderate' },
              { label: 'Conservative', value: 'conservative' }
            ]
          })}
          value={filters.ideology ? [filters.ideology] : ['']}
          onValueChange={(details) => onChange('ideology', details.value[0])}
          disabled={loading}
        >
          <Select.Label>Ideology</Select.Label>
          <Select.Trigger>
            <Select.ValueText placeholder="All" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item item="">
              <Select.ItemText>All Ideologies</Select.ItemText>
            </Select.Item>
            <Select.Item item="liberal">
              <Select.ItemText>Liberal</Select.ItemText>
            </Select.Item>
            <Select.Item item="moderate">
              <Select.ItemText>Moderate</Select.ItemText>
            </Select.Item>
            <Select.Item item="conservative">
              <Select.ItemText>Conservative</Select.ItemText>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </Grid>
    </Box>
  );
}