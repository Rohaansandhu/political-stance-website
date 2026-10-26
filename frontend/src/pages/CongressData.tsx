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
import CongressCompass from "../components/CongressData/CongressCompass";
import LegislatorSearch from "../components/CongressData/LegislatorSearch";
import type { Legislator } from "../components/CongressData/histogramUtils";
import { modelLabel, DEFAULT_MODEL, buildSpecHash } from "../components/CongressData/modelLabels";
import { findMatchingPreset, COMPASS_PRESETS } from "../components/CongressData/compassPresets";
import type { ScaleMode } from "../components/CongressData/axisStats";
import politicalAxes from "../../data/politicalAxes.json";
import { Helmet } from "react-helmet-async";

type FieldMode = "primary_categories" | "axes";

// Display order for axes: headline left-right, then the more independent
// signals, then the rest.
const AXIS_ORDER = [
  "left_right",
  "state_power",
  "fiscal",
  "security",
  "trade",
  "federalism",
  "institutional",
  "economic",
  "social",
  "global",
  "executive_power",
];
const AXIS_OPTIONS = AXIS_ORDER
  .map((id) => politicalAxes.political_axes.find((a) => a.id === id))
  .filter((a): a is (typeof politicalAxes.political_axes)[number] => !!a)
  .map((a) => ({ label: a.name, value: a.id }));

const DEFAULT_CATEGORY = "Economy & Finance";
const DEFAULT_AXIS = "left_right";

export default function CongressDataPage() {
  const [chamber, setChamber] = useState("house");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [availableModels, setAvailableModels] = useState<string[]>([DEFAULT_MODEL]);
  const [fieldMode, setFieldMode] = useState<FieldMode>("primary_categories");
  const [subject, setSubject] = useState(DEFAULT_CATEGORY);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [searchIndex, setSearchIndex] = useState<Legislator[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("histogram");
  const [compassX, setCompassX] = useState("economic");
  const [compassY, setCompassY] = useState("state_power");
  const [compassPresetId, setCompassPresetId] = useState<string | null>("political_compass");
  const [compassScale, setCompassScale] = useState<ScaleMode>("chamber");

  useEffect(() => {
    fetchCategories();
    fetchModels();
  }, []);

  useEffect(() => {
    setSelectedMemberId(null);
  }, [chamber]);

  // The compass only makes sense in axis mode (its tab is disabled otherwise)
  // -- if the user switches dimension away from axes while viewing it, fall
  // back to a tab that's still valid.
  useEffect(() => {
    if (fieldMode !== "axes" && activeView === "compass") {
      setActiveView("histogram");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldMode]);

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

  const fetchModels = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bill-analyses/filters`,
      );
      if (!response.ok) throw new Error("Failed to fetch model list");
      const json = await response.json();
      if (Array.isArray(json.models) && json.models.length > 0) {
        setAvailableModels(json.models);
      }
    } catch (err) {
      console.error("Error fetching models:", err);
    }
  };

  const handleFieldModeChange = (mode: FieldMode) => {
    setFieldMode(mode);
    setSubject(mode === "axes" ? DEFAULT_AXIS : DEFAULT_CATEGORY);
  };

  const handlePresetChange = (id: string) => {
    const preset = COMPASS_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setCompassPresetId(preset.id);
    setCompassX(preset.x);
    setCompassY(preset.y);
  };

  const handleCompassXChange = (value: string) => {
    setCompassX(value);
    setCompassPresetId(findMatchingPreset(value, compassY)?.id ?? null);
  };

  const handleCompassYChange = (value: string) => {
    setCompassY(value);
    setCompassPresetId(findMatchingPreset(compassX, value)?.id ?? null);
  };

  const specHash = buildSpecHash(model, chamber) ?? `${model}_4_all_${chamber}_all`;
  const subjectOptions = fieldMode === "axes" ? AXIS_OPTIONS : availableSubjects.map((s) => ({ label: s, value: s }));

  return (
    <Box minH="100vh" bg="bg">
      <Helmet>
        <title>{`Congress Data | US PoliTrack`}</title>
        <meta
          name="description"
          content={`Congress Data page for US PoliTrack. Contains histogram, scatterplot, and rankings of legislators based on ideological scores and axes for many political categories and models. Filter by House of Representatives or Senate.`}
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

        <Tabs.Root
          value={activeView}
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
                    items: availableModels.map((m) => ({
                      label: modelLabel(m),
                      value: m,
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
                    {availableModels.map((m) => (
                      <Select.Item key={m} item={m}>
                        <Select.ItemText>{modelLabel(m)}</Select.ItemText>
                      </Select.Item>
                    ))}
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
                    items: [
                      { label: "Policy Categories", value: "primary_categories" },
                      { label: "Ideological Axes", value: "axes" },
                    ],
                  })}
                  value={[fieldMode]}
                  onValueChange={(details) => handleFieldModeChange(details.value[0] as FieldMode)}
                >
                  <Select.Label fontSize="sm" fontWeight="600">
                    Dimension
                  </Select.Label>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Dimension" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item item="primary_categories">
                      <Select.ItemText>Policy Categories</Select.ItemText>
                    </Select.Item>
                    <Select.Item item="axes">
                      <Select.ItemText>Ideological Axes</Select.ItemText>
                    </Select.Item>
                  </Select.Content>
                </Select.Root>

                {activeView === "compass" ? (
                  <>
                    <Select.Root
                      collection={createListCollection({
                        items: [
                          ...COMPASS_PRESETS.map((p) => ({ label: p.label, value: p.id })),
                        ],
                      })}
                      value={compassPresetId ? [compassPresetId] : []}
                      onValueChange={(details) => handlePresetChange(details.value[0])}
                    >
                      <Select.Label fontSize="sm" fontWeight="600">
                        Preset
                      </Select.Label>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Custom" />
                      </Select.Trigger>
                      <Select.Content>
                        {COMPASS_PRESETS.map((p) => (
                          <Select.Item key={p.id} item={p.id}>
                            <Select.ItemText>{p.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>

                    <Select.Root
                      collection={createListCollection({ items: AXIS_OPTIONS })}
                      value={[compassX]}
                      onValueChange={(details) => handleCompassXChange(details.value[0])}
                    >
                      <Select.Label fontSize="sm" fontWeight="600">
                        X Axis
                      </Select.Label>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select Axis" />
                      </Select.Trigger>
                      <Select.Content>
                        {AXIS_OPTIONS.map((opt) => (
                          <Select.Item key={opt.value} item={opt.value}>
                            <Select.ItemText>{opt.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>

                    <Select.Root
                      collection={createListCollection({ items: AXIS_OPTIONS })}
                      value={[compassY]}
                      onValueChange={(details) => handleCompassYChange(details.value[0])}
                    >
                      <Select.Label fontSize="sm" fontWeight="600">
                        Y Axis
                      </Select.Label>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select Axis" />
                      </Select.Trigger>
                      <Select.Content>
                        {AXIS_OPTIONS.map((opt) => (
                          <Select.Item key={opt.value} item={opt.value}>
                            <Select.ItemText>{opt.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>

                    <Select.Root
                      collection={createListCollection({
                        items: [
                          { label: "Vs. chamber", value: "chamber" },
                          { label: "Vs. own party", value: "party" },
                          { label: "Raw", value: "raw" },
                        ],
                      })}
                      value={[compassScale]}
                      onValueChange={(details) => setCompassScale(details.value[0] as ScaleMode)}
                    >
                      <Select.Label fontSize="sm" fontWeight="600">
                        Scale
                      </Select.Label>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select Scale" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item item="chamber">
                          <Select.ItemText>Vs. chamber</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="party">
                          <Select.ItemText>Vs. own party</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="raw">
                          <Select.ItemText>Raw</Select.ItemText>
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </>
                ) : (
                  <Select.Root
                    collection={createListCollection({
                      items: subjectOptions,
                    })}
                    value={[subject]}
                    onValueChange={(details) => setSubject(details.value[0])}
                  >
                    <Select.Label fontSize="sm" fontWeight="600">
                      {fieldMode === "axes" ? "Axis" : "Category"}
                    </Select.Label>
                    <Select.Trigger>
                      <Select.ValueText placeholder={fieldMode === "axes" ? "Select Axis" : "Select Category"} />
                    </Select.Trigger>
                    <Select.Content>
                      {subjectOptions.map((opt) => (
                        <Select.Item key={opt.value} item={opt.value}>
                          <Select.ItemText>{opt.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}

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
                    <Tabs.Trigger
                      value="compass"
                      fontSize="sm"
                      px={3}
                      py={2}
                      justifyContent="flex-start"
                      disabled={fieldMode !== "axes"}
                      title={fieldMode !== "axes" ? "Switch to Ideological Axes to use Compass" : undefined}
                    >
                      Compass
                    </Tabs.Trigger>
                  </Tabs.List>
                </Box>
              </VStack>

              {/* Main content area */}
              <Box flex={1} minW={0}>
                <Tabs.Content value="histogram">
                  <CongressHistogram
                    specHash={specHash}
                    field={fieldMode}
                    subject={subject}
                    current={true}
                    selectedMemberId={selectedMemberId}
                    onLegislatorsLoaded={handleLegislatorsLoaded}
                  />
                </Tabs.Content>

                <Tabs.Content value="scatter">
                  <CongressScatter
                    specHash={specHash}
                    field={fieldMode}
                    subject={subject}
                    current={true}
                    selectedMemberId={selectedMemberId}
                  />
                </Tabs.Content>

                <Tabs.Content value="rankings">
                  <CongressRankings
                    specHash={specHash}
                    field={fieldMode}
                    subject={subject}
                    selectedMemberId={selectedMemberId}
                    isActive={activeView === "rankings"}
                  />
                </Tabs.Content>

                <Tabs.Content value="compass">
                  <CongressCompass
                    specHash={specHash}
                    xAxis={compassX}
                    yAxis={compassY}
                    scaleMode={compassScale}
                    selectedMemberId={selectedMemberId}
                    onSelect={setSelectedMemberId}
                    onRosterLoaded={handleLegislatorsLoaded}
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
