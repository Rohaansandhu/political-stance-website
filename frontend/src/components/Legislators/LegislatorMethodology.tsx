import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Select,
  Spinner,
  Switch,
  Table,
  Text,
  VStack,
  createListCollection,
} from "@chakra-ui/react";
import CollapsibleCard from "./CollapsibleCard";
import { modelLabel } from "../CongressData/modelLabels";
import { AXIS_GROUPS, axisName } from "./percentiles";
import type { LegislatorData } from "./types";

function CountLine({ label, value }: { label: string; value: number | undefined }) {
  if (value === undefined) return null;
  return (
    <Flex justify="space-between" gap={4} fontSize="sm">
      <Text color="textMuted">{label}</Text>
      <Text color="text" fontWeight="600">
        {value.toLocaleString()}
      </Text>
    </Flex>
  );
}

function RawScoreTable({
  heading,
  rows,
}: {
  heading: string;
  rows: { name: string; score: number; billCount: number }[];
}) {
  return (
    <Box overflowX="auto">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{heading}</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Raw score</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Bills scored</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.name}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell textAlign="end">{row.score.toFixed(3)}</Table.Cell>
              <Table.Cell textAlign="end">{row.billCount.toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

export default function LegislatorMethodology({
  data,
  model,
  availableModels,
  loading,
  onModelChange,
}: {
  data: LegislatorData;
  model: string;
  availableModels: string[];
  loading: boolean;
  onModelChange: (model: string) => void;
}) {
  const [showRaw, setShowRaw] = useState(false);
  const axes = data.axes;

  const axisRows = AXIS_GROUPS.flatMap((group) => group.axes)
    .filter((id) => axes?.[id])
    .map((id) => ({
      name: id === "institutional" ? `${axisName(id)} (roll calls)` : axisName(id),
      score: axes![id].score,
      billCount: axes![id].bill_count,
    }));
  const categoryRows = Object.entries(data.primary_categories ?? {})
    .map(([name, info]) => ({ name, score: info.score, billCount: info.bill_count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <CollapsibleCard title="Methodology and Details">
      <VStack align="stretch" gap={4}>
        <Box maxW="280px">
          <Select.Root
            collection={createListCollection({
              items: availableModels.map((m) => ({ label: modelLabel(m), value: m })),
            })}
            value={[model]}
            onValueChange={(details) => onModelChange(details.value[0])}
          >
            <Select.Label fontSize="sm" fontWeight="600">
              Model {loading && <Spinner size="xs" ml={1} />}
            </Select.Label>
            <Select.Trigger>
              <Select.ValueText placeholder="Select Model" />
            </Select.Trigger>
            <Select.Content>
              {availableModels.map((m) => (
                <Select.Item key={m} item={m}>
                  <Select.ItemText>{modelLabel(m)}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="700" color="text" mb={1}>
            About these numbers
          </Text>
          <Text fontSize="sm" color="textMuted">
            Each percentile shows where this member's voting record sits among current members.
            "More Hawkish than 63% of the House" means their votes lean further toward that pole
            than 63% of House members. The Own party view makes the same comparison within their
            party. Below 10 scored votes, we show "Not enough votes" instead of a percentile.
            Scores come from an AI model's analysis of each bill, so they vary by model.
          </Text>
          <Box mt={1}>
            <RouterLink to="/about?tab=methodology">
              <Text fontSize="sm" color="accent" fontWeight="600">
                Read the full methodology →
              </Text>
            </RouterLink>
          </Box>
        </Box>

        <VStack align="stretch" gap={1} maxW="480px">
          <Text fontSize="sm" fontWeight="700" color="text">
            What was counted
          </Text>
          <CountLine label="Votes cast on scored bills" value={data.vote_count} />
          <CountLine label="Roll calls counted for party loyalty" value={axes?.institutional?.bill_count} />
          <CountLine label="Bills scored on Left–Right" value={axes?.left_right?.bill_count} />
        </VStack>

        <Box>
          <Switch.Root checked={showRaw} onCheckedChange={(details) => setShowRaw(details.checked)} size="sm">
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>Show raw scores</Switch.Label>
          </Switch.Root>
          {showRaw && (
            <VStack align="stretch" gap={4} mt={3}>
              <Text fontSize="xs" color="textMuted">
                Raw scores run from −1 to +1. Most members sit in a narrow part of that range,
                which is why the rest of this page uses percentiles.
              </Text>
              {axisRows.length > 0 && <RawScoreTable heading="Axis" rows={axisRows} />}
              <RawScoreTable heading="Category" rows={categoryRows} />
            </VStack>
          )}
        </Box>
      </VStack>
    </CollapsibleCard>
  );
}
