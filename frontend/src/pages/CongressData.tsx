import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Select,
  createListCollection,
  Tabs,
} from "@chakra-ui/react";
import CongressHistogram from "../components/CongressData/CongressHistogram";
import CongressScatter from "../components/CongressData/CongressScatter";
import CongressRankings from "../components/CongressData/CongressRankings";
import { Helmet } from "react-helmet-async";

export default function CongressDataPage() {
  const [chamber, setChamber] = useState("house");
  const [model, setModel] = useState("gemini-2.5-flash-lite");
  const [subject, setSubject] = useState("Education");
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch category data");
      }
      const subjects = await response.json();
      setAvailableSubjects(subjects);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const specHash = `${model}_3_all_${chamber}_all`;

  return (
    <Box minH="100vh" bg="bg">
      <Helmet>
        <title>{`Congress Data | US PoliTrack`}</title>
        <meta
          name="description"
          content={`Congress Data page for US PoliTrack. Contains histogram, scatterplot, and rankings of legislators based on ideological scores for many political categories and models. Filter by House of Representatives or Senate.`}
        />
      </Helmet>
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <VStack align="stretch" gap={6} mb={8}>
          <Box>
            <Heading size="2xl" mb={2} color="primary">
              Congress Data Analytics
            </Heading>
            <Text fontSize="lg" color="text">
              Explore voting patterns and political positions across Congress
            </Text>
          </Box>

          {/* Filters */}
          <HStack gap={4} wrap="wrap" bg="bgLightShade" p={6} rounded="lg">
            <Select.Root
              collection={createListCollection({
                items: [
                  {
                    label: "Gemini 2.5 Flash Lite",
                    value: "gemini-2.5-flash-lite",
                  },
                  { label: "GPT-OSS (120b)", value: "gpt-oss-120b" },
                  { label: "Llama 3.3 (70b)", value: "llama3.3-70b" },
                  { label: "Qwen 3 (32b)", value: "qwen-3-32b" },
                ],
              })}
              value={[model]}
              onValueChange={(details) => setModel(details.value[0])}
              maxW="200px"
            >
              <Select.Label>Model</Select.Label>
              <Select.Trigger>
                <Select.ValueText placeholder="Select Model" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item item="gemini-2.5-flash-lite">
                  <Select.ItemText>Gemini 2.5 Flash Lite</Select.ItemText>
                </Select.Item>
                <Select.Item item="gpt-oss-120b">
                  <Select.ItemText>GPT-OSS (120b)</Select.ItemText>
                </Select.Item>
                <Select.Item item="llama3.3-70b">
                  <Select.ItemText>Llama 3.3 (70b)</Select.ItemText>
                </Select.Item>
                <Select.Item item="qwen-3-32b">
                  <Select.ItemText>Qwen 3 (32b)</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root
              collection={createListCollection({
                items: [
                  { label: "Senate", value: "senate" },
                  { label: "House", value: "house" },
                ],
              })}
              value={[chamber]}
              onValueChange={(details) => setChamber(details.value[0])}
              maxW="200px"
            >
              <Select.Label>Chamber</Select.Label>
              <Select.Trigger>
                <Select.ValueText placeholder="Select Chamber" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item item="senate">
                  <Select.ItemText>Senate</Select.ItemText>
                </Select.Item>
                <Select.Item item="house">
                  <Select.ItemText>House</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root
              collection={createListCollection({
                items: availableSubjects.map((s) => ({ label: s, value: s })),
              })}
              value={[subject]}
              onValueChange={(details) => setSubject(details.value[0])}
              maxW="250px"
            >
              <Select.Label>Category</Select.Label>
              <Select.Trigger>
                <Select.ValueText placeholder="Select Category" />
              </Select.Trigger>
              <Select.Content>
                {availableSubjects.map((subj) => (
                  <Select.Item key={subj} item={subj}>
                    <Select.ItemText>{subj}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </HStack>
        </VStack>

        {/* Tabs for Different Visualizations */}
        <Tabs.Root defaultValue="histogram" variant="enclosed">
          <Tabs.List bg="bgLightShade" p={2} rounded="lg" mb={6}>
            <Tabs.Trigger value="histogram" fontSize="lg" px={6} py={3}>
              Histogram
            </Tabs.Trigger>
            <Tabs.Trigger value="scatter" fontSize="lg" px={6} py={3}>
              Scatter Plot
            </Tabs.Trigger>
            <Tabs.Trigger value="rankings" fontSize="lg" px={6} py={3}>
              Rankings
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="histogram">
            <CongressHistogram
              specHash={specHash}
              field="primary_categories"
              subject={subject}
              current={true}
            />
          </Tabs.Content>

          <Tabs.Content value="scatter">
            <CongressScatter
              specHash={specHash}
              field="primary_categories"
              subject={subject}
              current={true}
            />
          </Tabs.Content>

          <Tabs.Content value="rankings">
            <CongressRankings
              specHash={specHash}
              field="primary_categories"
              subject={subject}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </Box>
  );
}
