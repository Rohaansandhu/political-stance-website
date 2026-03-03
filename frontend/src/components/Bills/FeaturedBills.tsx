import { useState, useEffect } from "react";
import { Box, Heading, Container } from "@chakra-ui/react"; // Added Container
import BillGrid from "./BillGrid";

export function FeaturedBills() {
  const [featuredBills, setFeaturedBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bill-analyses/featured`,
        );
        const data = await res.json();
        setFeaturedBills(data.featured_bills || []);
      } catch (err) {
        console.error("Failed to fetch featured bills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!featuredBills.length && !loading) return null;

  return (
    // The outer Box can have a bg color if you want to alternate it later
    <Box as="section" py={12} bg="bg">
      {/* The Container brings back the margins and centers your content */}
      <Container maxW="6xl" px={4}>
        <Heading size="lg" mb={8} color="primary">
          Featured Bills
        </Heading>
        <BillGrid
          bills={featuredBills}
          loading={loading}
          featured={true}
          emptyMessage="No featured bills available"
        />
      </Container>
    </Box>
  );
}
