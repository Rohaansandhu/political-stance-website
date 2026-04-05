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
  const [model, setModel] = useState("gpt-5-mini");
  const [subject, setSubject] = useState("Economy & Finance");
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories`,
      );
      if (!response.ok) throw new Error("Failed to fetch category data");
      const subjects = await response.json();
      setAvailableSubjects(subjects);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const specHash = `${model}_4_all_${chamber}_all`;

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
        <Box mb={6}>
          <Heading size="2xl" mb={2} color="primary">
            Congress Data Analytics
          </Heading>
          <Text fontSize="lg" color="text">
            Explore voting patterns and political positions across Congress
          </Text>
        </Box>

        <Tabs.Root defaultValue="histogram" variant="enclosed">
          <Box bg="bgLightShade" p={4} rounded="xl">
            <HStack align="flex-start" gap={4}>
              {/* Left sidebar: filters + tab triggers */}
              <VStack
                align="stretch"
                gap={3}
                p={4}
                rounded="lg"
                flexShrink={0}
                w="180px"
              >
                <Select.Root
                  collection={createListCollection({
                    items: [{ label: "GPT-5 Mini", value: "gpt-5-mini" }],
                  })}
                  value={[model]}
                  onValueChange={(details) => setModel(details.value[0])}
                >
                  <Select.Label fontSize="sm" fontWeight="600">
                    Model
                  </Select.Label>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Model" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item item="gpt-5-mini">
                      <Select.ItemText>GPT-5 Mini</Select.ItemText>
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
                >
                  <Select.Label fontSize="sm" fontWeight="600">
                    Chamber
                  </Select.Label>
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
                    items: availableSubjects.map((s) => ({
                      label: s,
                      value: s,
                    })),
                  })}
                  value={[subject]}
                  onValueChange={(details) => setSubject(details.value[0])}
                >
                  <Select.Label fontSize="sm" fontWeight="600">
                    Category
                  </Select.Label>
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

                {/* Divider + View tab triggers */}
                <Box borderTop="1px solid" borderColor="gray.200" pt={3}>
                  <Text fontSize="sm" fontWeight="600" color="gray.500" mb={2}>
                    View
                  </Text>
                  <Tabs.List flexDirection="column" gap={1}>
                    <Tabs.Trigger
                      value="histogram"
                      fontSize="sm"
                      px={3}
                      py={2}
                      justifyContent="flex-start"
                    >
                      Histogram
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="scatter"
                      fontSize="sm"
                      px={3}
                      py={2}
                      justifyContent="flex-start"
                    >
                      Scatter Plot
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="rankings"
                      fontSize="sm"
                      px={3}
                      py={2}
                      justifyContent="flex-start"
                    >
                      Rankings
                    </Tabs.Trigger>
                  </Tabs.List>
                </Box>
              </VStack>

              {/* Main content area */}
              <Box flex={1} minW={0}>
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
              </Box>
            </HStack>
          </Box>
        </Tabs.Root>
      </Container>
    </Box>
  );
}
