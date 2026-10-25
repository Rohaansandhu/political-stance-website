import { useState, useEffect, useCallback } from "react";
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
import LegislatorSearch from "../components/CongressData/LegislatorSearch";
import type { Legislator } from "../components/CongressData/histogramUtils";
import { Helmet } from "react-helmet-async";
import { MODEL_SCHEMAS, DEFAULT_MODEL, buildSpecHash } from "../utils/specHash";
import { sortAxisIds } from "../utils/axisDisplay";
import politicalAxes from "../../data/politicalAxes.json";

const AXIS_SUBJECTS = sortAxisIds(politicalAxes.political_axes.map((a) => a.id)).map(
  (id) => ({
    value: id,
    label: politicalAxes.political_axes.find((a) => a.id === id)!.name,
  }),
);

// Senate scraping has been blocked by senate.gov since this date (see data
// pipeline handoff) — House data runs well past this. Update once the
// scraper is fixed and the DB is re-synced.
const SENATE_DATA_AS_OF = "March 9, 2026";

export default function CongressDataPage() {
  const [chamber, setChamber] = useState<"house" | "senate">("house");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [dataType, setDataType] = useState<"primary_categories" | "axes">(
    "primary_categories",
  );
  const [subject, setSubject] = useState("Economy & Finance");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [searchIndex, setSearchIndex] = useState<Legislator[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("histogram");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedMemberId(null);
  }, [chamber]);

  // Reset subject to a sensible default whenever the data type changes, so
  // we don't carry a category name over into axes mode (or vice versa).
  useEffect(() => {
    if (dataType === "axes") {
      setSubject(AXIS_SUBJECTS[0]?.value ?? "");
    } else if (availableSubjects.length > 0) {
      setSubject(availableSubjects[0]);
    }
  }, [dataType]);

  const handleLegislatorsLoaded = useCallback((legs: Legislator[]) => {
    setSearchIndex(legs);
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

  const specHash = buildSpecHash(model, chamber);
  const subjectItems = dataType === "axes" ? AXIS_SUBJECTS : availableSubjects.map((s) => ({ label: s, value: s }));

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
        <HStack justify="space-between" align="flex-end" mb={6} gap={6} wrap="wrap">
          <Box>
            <Heading size="2xl" mb={2} color="text" letterSpacing="tight">
              Congress Data Analytics
            </Heading>
            <Text fontSize="lg" color="textMuted">
              Explore voting patterns and political positions across Congress
            </Text>
          </Box>

          <Box minW="320px">
            <LegislatorSearch
              legislators={searchIndex}
              selectedMemberId={selectedMemberId}
              onSelect={setSelectedMemberId}
            />
          </Box>
        </HStack>

        {chamber === "senate" && (
          <Box mb={6} px={4} py={2} bg="orange.subtle" rounded="md" borderWidth="1px" borderColor="orange.muted">
            <Text fontSize="sm" color="orange.fg">
              Senate voting data is current as of {SENATE_DATA_AS_OF}. House data is more
              recent.
            </Text>
          </Box>
        )}

        <Tabs.Root
          defaultValue="histogram"
          variant="enclosed"
          onValueChange={(details) => setActiveView(details.value)}
        >
          <Box bg="bgLightShade" p={4} rounded="card" borderWidth="1px" borderColor="borderSubtle">
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
                    items: Object.entries(MODEL_SCHEMAS).map(([value, spec]) => ({
                      label: spec.label,
                      value,
                    })),
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
                    {Object.entries(MODEL_SCHEMAS).map(([value, spec]) => (
                      <Select.Item key={value} item={value}>
                        <Select.ItemText>{spec.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <Select.Root
                  collection={createListCollection({
                    items: [
                      { label: "Categories", value: "primary_categories" },
                      { label: "Axes", value: "axes" },
                    ],
                  })}
                  value={[dataType]}
                  onValueChange={(details) =>
                    setDataType(details.value[0] as "primary_categories" | "axes")
                  }
                >
                  <Select.Label fontSize="sm" fontWeight="600">
                    Data Type
                  </Select.Label>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Data Type" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item item="primary_categories">
                      <Select.ItemText>Categories</Select.ItemText>
                    </Select.Item>
                    <Select.Item item="axes">
                      <Select.ItemText>Axes</Select.ItemText>
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
                  onValueChange={(details) =>
                    setChamber(details.value[0] as "house" | "senate")
                  }
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
                    items: subjectItems,
                  })}
                  value={[subject]}
                  onValueChange={(details) => setSubject(details.value[0])}
                >
                  <Select.Label fontSize="sm" fontWeight="600">
                    {dataType === "axes" ? "Axis" : "Category"}
                  </Select.Label>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Subject" />
                  </Select.Trigger>
                  <Select.Content>
                    {subjectItems.map((item) => (
                      <Select.Item key={item.value} item={item.value}>
                        <Select.ItemText>{item.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                {/* Divider + View tab triggers */}
                <Box borderTopWidth="1px" borderColor="border" pt={3}>
                  <Text fontSize="sm" fontWeight="600" color="textMuted" mb={2}>
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
                    field={dataType}
                    subject={subject}
                    current={true}
                    selectedMemberId={selectedMemberId}
                    onLegislatorsLoaded={handleLegislatorsLoaded}
                  />
                </Tabs.Content>

                <Tabs.Content value="scatter">
                  <CongressScatter
                    specHash={specHash}
                    field={dataType}
                    subject={subject}
                    current={true}
                    selectedMemberId={selectedMemberId}
                  />
                </Tabs.Content>

                <Tabs.Content value="rankings">
                  <CongressRankings
                    specHash={specHash}
                    field={dataType}
                    subject={subject}
                    selectedMemberId={selectedMemberId}
                    isActive={activeView === "rankings"}
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
