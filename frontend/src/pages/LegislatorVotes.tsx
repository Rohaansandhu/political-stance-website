import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Center,
  Checkbox,
  Container,
  Flex,
  Heading,
  Input,
  NativeSelect,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import Pagination from "../components/Bills/Pagination";
import VoteRow from "../components/Legislators/VoteRow";
import { useMemberVotes } from "../components/Legislators/useMemberVotes";
import {
  AXIS_GROUPS,
  axisName,
  displayName as memberDisplayName,
} from "../components/Legislators/percentiles";
import { DEFAULT_MODEL } from "../components/CongressData/modelLabels";

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="600" color="textMuted" mb={1}>
        {label}
      </Text>
      <NativeSelect.Root size="sm">
        <NativeSelect.Field
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">All</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  );
}

// Filters live in the URL so expanded rows on the profile page can deep-link here.
export default function LegislatorVotes() {
  const { id = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [memberName, setMemberName] = useState<string | null>(null);

  const model = searchParams.get("model") ?? DEFAULT_MODEL;
  const axis = searchParams.get("axis") ?? "";
  const category = searchParams.get("category") ?? "";
  const congress = searchParams.get("congress") ?? "";
  const broke = searchParams.get("filter") === "broke";
  const q = searchParams.get("q") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);

  const [searchText, setSearchText] = useState(q);

  const updateParams = (changes: Record<string, string>) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        // Any filter change starts over from the first page.
        if (!("page" in changes)) next.delete("page");
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (searchText === q) return;
    const timer = setTimeout(() => updateParams({ q: searchText }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // updateParams only wraps the stable setSearchParams.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, q]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.VITE_API_URL}/api/legislators/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled) setMemberName(json?.name ? memberDisplayName(json.name) : null);
      })
      .catch((err) => console.error("Error loading legislator:", err));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const { data, loading, error } = useMemberVotes(id, model, {
    filter: broke ? "broke" : "recent",
    axis,
    category,
    congress,
    q,
    page,
    limit: PAGE_SIZE,
  });

  // Facets stay on screen while the next page of results loads.
  const [facets, setFacets] = useState<NonNullable<typeof data>["facets"] | null>(null);
  useEffect(() => {
    if (data) setFacets(data.facets);
  }, [data]);

  const displayName = memberName ?? "This member";

  return (
    <Container maxW="5xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      <Helmet>
        <title>{`${displayName}: Vote History | US PoliTrack`}</title>
        <meta name="description" content={`Every scored vote by ${displayName}, searchable by topic.`} />
      </Helmet>

      <Box mb={4}>
        <Link to={`/legislators/${id}`}>
          <Text fontSize="sm" color="accent" fontWeight="600">
            ← Back to {displayName}
          </Text>
        </Link>
      </Box>

      <Heading size="lg" color="text" mb={1}>
        Vote History
      </Heading>
      <Text fontSize="sm" color="textMuted" mb={4}>
        {data
          ? `${data.total.toLocaleString()} of ${data.scored_total.toLocaleString()} scored votes by ${displayName}`
          : `Scored votes by ${displayName}`}
      </Text>

      <VStack
        align="stretch"
        gap={3}
        mb={4}
        p={4}
        bg="surface"
        rounded="card"
        borderWidth="1px"
        borderColor="border"
      >
        <Input
          size="sm"
          placeholder="Search by bill title, number, or topic"
          aria-label="Search votes"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
          <FilterSelect
            label="Category"
            value={category}
            options={(facets?.categories ?? []).map((c) => ({ value: c, label: c }))}
            onChange={(value) => updateParams({ category: value })}
          />
          <FilterSelect
            label="Axis"
            value={axis}
            options={
              facets?.axes?.length
                ? AXIS_GROUPS.flatMap((group) => group.axes).map((a) => ({
                    value: a,
                    label: axisName(a),
                  }))
                : []
            }
            onChange={(value) => updateParams({ axis: value })}
          />
          <FilterSelect
            label="Congress"
            value={congress}
            options={(facets?.congresses ?? []).map((c) => ({
              value: String(c),
              label: `${c}th Congress`,
            }))}
            onChange={(value) => updateParams({ congress: value })}
          />
        </SimpleGrid>
        <Checkbox.Root
          size="sm"
          checked={broke}
          onCheckedChange={(details) =>
            updateParams({ filter: details.checked ? "broke" : "" })
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Only votes against their party</Checkbox.Label>
        </Checkbox.Root>
      </VStack>

      {loading && (
        <Center py={8}>
          <Spinner />
        </Center>
      )}
      {error && (
        <Text fontSize="sm" color="textMuted">
          Couldn't load votes right now.
        </Text>
      )}
      {data && data.scored_total === 0 && (
        <Text fontSize="sm" color="textMuted">
          Vote details aren't available for this member yet.
        </Text>
      )}
      {data && data.scored_total > 0 && data.results.length === 0 && (
        <Text fontSize="sm" color="textMuted">
          No votes match these filters.
        </Text>
      )}
      {data && (
        <>
          <VStack align="stretch" gap={2}>
            {data.results.map((vote) => (
              <VoteRow key={vote.vote_id} vote={vote} model={model} />
            ))}
          </VStack>
          <Flex justify="center" mt={4}>
            <Pagination
              currentPage={data.page}
              totalPages={Math.ceil(data.total / data.limit)}
              onPageChange={(next) => updateParams({ page: String(next) })}
            />
          </Flex>
        </>
      )}
    </Container>
  );
}
