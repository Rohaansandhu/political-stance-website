import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Center,
  Badge,
  Stat,
} from "@chakra-ui/react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import IdeologyViewsBar from "./IdeologyViewBar";
import { useChartTheme } from "./chartTheme";

interface ScatterProps {
  specHash: string;
  field: string;
  subject: string;
  current: boolean;
}

interface Legislator {
  member_id: string;
  official_full_name: string;
  party: "D" | "R" | "I";
  state: string;
  score: number;
  bill_count: number;
}

interface ScatterData {
  spec_hash: string;
  field: string;
  subject: string;
  chart_type: string;
  legislators: Legislator[];
  metadata: {
    correlation: number;
    total_count: number;
    score_range: [number, number];
    bill_count_range: [number, number];
    party_counts: {
      D: number;
      R: number;
      I: number;
    };
  };
}

export default function CongressScatter({
  specHash,
  field,
  subject,
  current,
}: ScatterProps) {
  const chart = useChartTheme();
  const PARTY_COLORS = chart.partyColors;
  const [data, setData] = useState<ScatterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScatterData();
  }, [specHash, field, subject, current]);

  const fetchScatterData = async () => {
    setLoading(true);
    setError(null);
    try {
      const encodedSubject = encodeURIComponent(subject);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/congress-data/${specHash}/scatter/${field}/${encodedSubject}/${current}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch scatter data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching scatter:", err);
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
        <Text color="voteNay" fontSize="lg">
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

  const chamber = specHash.includes("senate") ? "Senate" : "House";

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const legislator = payload[0].payload;
      const color =
        PARTY_COLORS[legislator.party as keyof typeof PARTY_COLORS] || "gray";

      return (
        <Box
          bg="surface"
          p={3}
          borderWidth="1px"
          borderColor="border"
          borderRadius="12px"
          shadow="lg"
          zIndex={10}
        >
          <Text fontWeight="bold" color="text">
            {legislator.official_full_name}
          </Text>
          <HStack gap={2} my={1}>
            <Badge bg={color} color="white" rounded="full">
              {legislator.party}
            </Badge>
            <Text fontSize="sm" color="textMuted">
              {legislator.state}
            </Text>
          </HStack>
          <VStack align="flex-start" gap={0} mt={2}>
            <Text fontSize="sm" color="textMuted">
              Score: <b>{legislator.score.toFixed(3)}</b>
            </Text>
            <Text fontSize="sm" color="textMuted">
              Bills: <b>{legislator.bill_count}</b>
            </Text>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <HStack justify="center" mt={4} gap={6}>
      <HStack>
        <Box w="10px" h="10px" rounded="full" bg={PARTY_COLORS.D} />
        <Text fontSize="sm" color="textMuted">
          Democrats
        </Text>
      </HStack>
      <HStack>
        <Box w="10px" h="10px" rounded="full" bg={PARTY_COLORS.R} />
        <Text fontSize="sm" color="textMuted">
          Republicans
        </Text>
      </HStack>
      <HStack>
        <Box w="10px" h="10px" rounded="full" bg={PARTY_COLORS.I} />
        <Text fontSize="sm" color="textMuted">
          Independents
        </Text>
      </HStack>
    </HStack>
  );

  return (
    <VStack align="stretch" gap={6}>
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="flex-start" gap={1}>
          <Heading size="xl" color="text" letterSpacing="tight">
            {subject}
          </Heading>
          <HStack gap={2}>
            <Badge colorPalette="blue" variant="subtle" rounded="full">{chamber}</Badge>
            <Badge colorPalette="purple" variant="subtle" rounded="full">{field.replace("_", " ")}</Badge>
            <Text color="textMuted" fontSize="sm">
              {data.metadata.total_count} legislators
            </Text>
          </HStack>
        </VStack>
      </HStack>

      {/* Scatter Plot */}
      <Box bg="surface" p={6} rounded="card" borderWidth="1px" borderColor="border" boxShadow="card">
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />

            <XAxis
              type="number"
              dataKey="score"
              domain={[-1, 1]}
              name="Ideology Score"
              tickLine={false}
              axisLine={{ stroke: chart.grid }}
              label={{
                value: "Ideology Score",
                position: "insideBottom",
                offset: -10,
                fill: chart.tick,
                fontSize: 12,
                style: { textAnchor: "middle" },
              }}
              tick={{ fill: chart.tick, fontSize: 12 }}
            />

            <YAxis
              type="number"
              dataKey="bill_count"
              name="Bill Count"
              tickLine={false}
              axisLine={false}
              label={{
                value: "Number of Bills",
                angle: -90,
                position: "insideLeft",
                fill: chart.tick,
                fontSize: 12,
                style: { textAnchor: "middle" },
              }}
              tick={{ fill: chart.tick, fontSize: 12 }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
              isAnimationActive={false}
            />

            <Scatter
              name="Legislators"
              data={data.legislators}
              fill="#8884d8"
              isAnimationActive={false}
            >
              {data.legislators.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    PARTY_COLORS[entry.party as keyof typeof PARTY_COLORS] ??
                    "#718096"
                  }
                  fillOpacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <CustomLegend />
      </Box>

      {/* Additional Info */}
      <HStack gap={4} fontSize="sm" color="textMuted" justify="center">
        <Text>
          Ideology Score Range: {data.metadata.score_range[0].toFixed(2)} to{" "}
          {data.metadata.score_range[1].toFixed(2)} • Bill Count Range:{" "}
          {data.metadata.bill_count_range[0]} to{" "}
          {data.metadata.bill_count_range[1]}
        </Text>
      </HStack>

      {/* Statistics Cards */}
      <HStack gap={4} wrap="wrap">
        <Stat.Root bg="surface" p={4} rounded="card" borderWidth="1px" borderColor="border" boxShadow="card" flex="1" minW="200px">
          <Stat.Label>
            <Badge colorPalette="purple" variant="subtle" rounded="full" mb={2}>
              Correlation
            </Badge>
          </Stat.Label>
          <Stat.ValueText fontSize="2xl" color="text" fontVariantNumeric="tabular-nums">
            {data.metadata.correlation.toFixed(3)}
          </Stat.ValueText>
          <Stat.HelpText color="textMuted">Score vs Bill Count</Stat.HelpText>
        </Stat.Root>

        {(["D", "R", "I"] as const).map((party) => {
          const count = data.metadata.party_counts[party];
          const partyName =
            party === "D"
              ? "Democrats"
              : party === "R"
                ? "Republicans"
                : "Independents";
          const colorPalette =
            party === "D" ? "blue" : party === "R" ? "red" : "yellow";

          return (
            <Stat.Root
              key={party}
              bg="surface"
              p={4}
              rounded="card"
              borderWidth="1px"
              borderColor="border"
              boxShadow="card"
              flex="1"
              minW="200px"
            >
              <Stat.Label>
                <Badge colorPalette={colorPalette} variant="subtle" rounded="full" mb={2}>
                  {partyName}
                </Badge>
              </Stat.Label>
              <Stat.ValueText fontSize="2xl" color="text" fontVariantNumeric="tabular-nums">
                {count}
              </Stat.ValueText>
              <Stat.HelpText color="textMuted">Members</Stat.HelpText>
            </Stat.Root>
          );
        })}
      </HStack>

      <IdeologyViewsBar subject={subject} />
    </VStack>
  );
}
