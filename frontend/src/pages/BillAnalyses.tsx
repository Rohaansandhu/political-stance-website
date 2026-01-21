import { useState, useEffect } from "react";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import BillSearchBar from "../components/Bills/BillSearchBar";
import BillFilters from "../components/Bills/BillFilters";
import BillGrid from "../components/Bills/BillGrid";
import Pagination from "../components/Bills/Pagination";
import { BillAnalysisReminder } from "../components/Bills/BillAnalysisReminder";

interface BillSummary {
  title: string;
  key_provisions: string[];
}

interface PrimaryCategory {
  name: string;
  partisan_score: number;
  impact_score: number;
  reasoning: string;
}

interface BillAnalysis {
  _id?: string;
  bill_id: string;
  model: string;
  bill_type: string;
  chamber: string;
  congress: number;
  bill_summary: BillSummary;
  political_categories: {
    primary_categories: PrimaryCategory[];
  };
  avg_partisan_score?: number;
}

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

export default function BillAnalysesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [bills, setBills] = useState<BillAnalysis[]>([]);
  const [featuredBills, setFeaturedBills] = useState<BillAnalysis[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });

  // Derive all values from URL params (single source of truth)
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchValue = searchParams.get("search") || "";
  const filters: FilterState = {
    model: searchParams.get("model") || "",
    bill_type: searchParams.get("bill_type") || "",
    chamber: searchParams.get("chamber") || "",
    congress: searchParams.get("congress") || "",
    category: searchParams.get("category") || "",
    ideology: searchParams.get("ideology") || "",
  };

  useEffect(() => {
    fetchFilterOptions();
    fetchFeaturedBills();
  }, []);

  useEffect(() => {
    fetchBills();
  }, [searchParams]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Add all filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      // Add search
      if (searchValue) queryParams.append("search", searchValue);

      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "20");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bill-analyses?${queryParams}`
      );
      const data = await response.json();

      setBills(data.bills);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBills = async () => {
    setFeaturedLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bill-analyses/featured`
      );
      const data = await response.json();
      setFeaturedBills(data.featured_bills || []);
    } catch (err) {
      console.error("Error fetching featured bills:", err);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bill-analyses/filters`
      );
      const data = await response.json();
      setFilterOptions(data);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const currentValue = searchParams.get(key) || "";

    if (value === currentValue) return;

    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearchChange = (value: string) => {
    const currentValue = searchParams.get("search") || "";

    if (value === currentValue) return;

    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }

    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box minH="100vh" bg="bg">
      <Container maxW="7xl" py={8}>
        <VStack align="stretch" gap={8}>
          {/* Header */}
          <Box>
            <Heading size="2xl" mb={2} color="primary">
              Bill Analyses
            </Heading>
            <Text fontSize="lg" color="text">
              Explore AI-powered political analyses of congressional bills
            </Text>
          </Box>

          <BillAnalysisReminder />

          {/* Featured Bills */}
          {!featuredLoading && featuredBills.length > 0 && (
            <Box>
              <Heading size="lg" mb={4} color="primary">
                Featured Bills
              </Heading>
              <BillGrid
                bills={featuredBills}
                loading={false}
                featured={true}
                emptyMessage="No featured bills available"
              />
            </Box>
          )}

          {/* Search Bar */}
          <BillSearchBar value={searchValue} onChange={handleSearchChange} />

          {/* Filters */}
          <BillFilters
            filters={filters}
            filterOptions={filterOptions}
            onChange={handleFilterChange}
            onClear={clearFilters}
            loading={loading}
          />

          {/* Bills Grid */}
          <Box>
            {!loading && bills.length > 0 && (
              <Text color="text" mb={4}>
                Showing {bills.length} of {pagination.total} bills
              </Text>
            )}
            <BillGrid
              bills={bills}
              loading={loading}
              emptyMessage="No bills found. Try adjusting your filters."
            />
          </Box>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </VStack>
      </Container>
    </Box>
  );
}
