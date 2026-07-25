import { useState, useEffect, useMemo } from "react";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import IdeologyViewsBar from "./IdeologyViewBar";
import { useChartTheme } from "./chartTheme";
import {
  computeBinnedData,
  computePartyStats,
  computeDomain,
  type ScatterData,
} from "./histogramUtils";

interface HistogramProps {
  specHash: string;
  field: string;
  subject: string;
  current: boolean;
}

export default function CongressHistogram({
  specHash,
  field,
  subject,
  current,
}: HistogramProps) {
  const chart = useChartTheme();
  const [data, setData] = useState<ScatterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLegislatorData();
  }, [specHash, field, subject, current]);

  const fetchLegislatorData = async () => {
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
        throw new Error("Failed to fetch legislator data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching legislator data:", err);
    } finally {
      setLoading(false);
    }
  };

  const legislators = data?.legislators ?? [];
  const bins = useMemo(() => computeBinnedData(legislators), [legislators]);
  const stats = useMemo(() => computePartyStats(legislators), [legislators]);
  const domain = useMemo(
    () => computeDomain(legislators.map((l) => l.score)),
    [legislators],
  );

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

      {/* Histogram Chart */}
      <Box bg="surface" p={6} rounded="card" borderWidth="1px" borderColor="border" boxShadow="card">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={bins} margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
            <XAxis
              dataKey="range"
              tickFormatter={(_, index) => bins[index]?.midLabel ?? ""}
              tickLine={false}
              axisLine={{ stroke: chart.grid }}
              tick={{ fill: chart.tick, fontSize: 12 }}
            />
            <YAxis
              width={60}
              tickLine={false}
              axisLine={false}
              tick={{ fill: chart.tick, fontSize: 12 }}
              label={{
                value: "# Legislators",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: chart.tick,
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              cursor={{ fill: chart.grid, fillOpacity: 0.4 }}
              contentStyle={{
                backgroundColor: chart.tooltipBg,
                border: `1px solid ${chart.tooltipBorder}`,
                borderRadius: "12px",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="D" name="Democrats" fill={chart.partyColors.D} stackId="a" radius={[0, 0, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="R" name="Republicans" fill={chart.partyColors.R} stackId="a" isAnimationActive={false} />
            <Bar dataKey="I" name="Independents" fill={chart.partyColors.I} stackId="a" radius={[3, 3, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Additional Stats */}
      <HStack gap={4} fontSize="sm" color="textMuted" justify="center">
        <Text>
          Ideology Score Range: {domain[0].toFixed(2)} (Liberal) to{" "}
          {domain[1].toFixed(2)} (Conservative) • Data based on voting records
        </Text>
      </HStack>

      {/* Statistics Cards */}
      <HStack gap={4} wrap="wrap">
        {(["D", "R", "I"] as const).map((party) => {
          const partyStats = stats[party];
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
                {partyStats.mean !== null ? partyStats.mean.toFixed(3) : "N/A"}
              </Stat.ValueText>
              <Stat.HelpText color="textMuted">
                Mean Ideology Score • {partyStats.count} members
              </Stat.HelpText>
              <Text fontSize="sm" color="textMuted" mt={1}>
                Median:{" "}
                {partyStats.median !== null
                  ? partyStats.median.toFixed(3)
                  : "N/A"}
              </Text>
            </Stat.Root>
          );
        })}
      </HStack>

      <IdeologyViewsBar subject={subject} />
    </VStack>
  );
}
