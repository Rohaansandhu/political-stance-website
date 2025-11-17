import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Center,
  Badge,
  Stat
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HistogramProps {
  specHash: string;
  field: string;
  subject: string;
  current: boolean;
}

interface BinData {
  range: string;
  D: number;
  R: number;
  I: number;
}

interface PartyStats {
  mean: number | null;
  median: number | null;
  count: number;
  min: number | null;
  max: number | null;
  std: number | null;
}

interface HistogramData {
  spec_hash: string;
  field: string;
  subject: string;
  chart_type: string;
  bins: BinData[];
  stats: {
    D: PartyStats;
    R: PartyStats;
    I: PartyStats;
  };
  total_count: number;
}

export default function CongressHistogram({ specHash, field, subject, current }: HistogramProps) {
  const [data, setData] = useState<HistogramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistogramData();
  }, [specHash, field, subject, current]);

  const fetchHistogramData = async () => {
    setLoading(true);
    setError(null);
    try {
      const encodedSubject = encodeURIComponent(subject);
      const response = await fetch(
        `http://localhost:4000/congress-data/${specHash}/histogram/${field}/${encodedSubject}/${current}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch histogram data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching histogram:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="primary" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={20}>
        <Text color="red.500" fontSize="lg">
          Error: {error}
        </Text>
      </Center>
    );
  }

  if (!data) {
    return (
      <Center py={20}>
        <Text color="text" fontSize="lg">
          No data available
        </Text>
      </Center>
    );
  }

  const chamber = specHash.includes('senate') ? 'Senate' : 'House';

  return (
    <Box w="100%" bg="bgLightShade" p={8} rounded="xl">
      <VStack align="stretch" gap={6}>
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="flex-start" gap={1}>
            <Heading size="xl" color="primary">
              {subject}
            </Heading>
            <HStack gap={2}>
              <Badge colorScheme="blue">{chamber}</Badge>
              <Badge colorScheme="purple">{field.replace('_', ' ')}</Badge>
              <Text color="text" fontSize="sm">
                {data.total_count} legislators
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Statistics Cards */}
        <HStack gap={4} wrap="wrap">
          {(['D', 'R', 'I'] as const).map(party => {
            const partyStats = data.stats[party];
            const partyName = party === 'D' ? 'Democrats' : party === 'R' ? 'Republicans' : 'Independents';
            const colorScheme = party === 'D' ? 'blue' : party === 'R' ? 'red' : 'yellow';
            
            return (
              <Stat.Root key={party} bg="bg" p={4} rounded="lg" flex="1" minW="200px">
                <Stat.Label>
                  <Badge colorScheme={colorScheme} mb={2}>
                    {partyName}
                  </Badge>
                </Stat.Label>
                <Stat.ValueText fontSize="2xl" color="primary">
                  {partyStats.mean !== null ? partyStats.mean.toFixed(3) : 'N/A'}
                </Stat.ValueText>
                <Stat.HelpText>
                  Mean Score • {partyStats.count} members
                </Stat.HelpText>
                {partyStats.median !== null && (
                  <Text fontSize="sm" color="text" mt={1}>
                    Median: {partyStats.median.toFixed(3)}
                  </Text>
                )}
              </Stat.Root>
            );
          })}
        </HStack>

        {/* Histogram Chart */}
        <Box bg="bg" p={6} rounded="lg">
          <ResponsiveContainer width="100%" height={600}>
            <BarChart data={data.bins}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="range" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fill: '#4a5568', fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'Number of Legislators', angle: -90, position: "insideLeft"}}
                tick={{ fill: '#4a5568' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px' 
                }}
              />
              <Legend />
              <Bar dataKey="D" name="Democrats" fill="#3182ce" stackId="a" />
              <Bar dataKey="R" name="Republicans" fill="#e53e3e" stackId="a" />
              <Bar dataKey="I" name="Independents" fill="#d69e2e" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Additional Stats */}
        <HStack gap={4} fontSize="sm" color="text" justify="center">
          <Text>Score Range: -1.0 to 1.0</Text>
          <Text>•</Text>
          <Text>Negative = Liberal, Positive = Conservative</Text>
        </HStack>
      </VStack>
    </Box>
  );
}
