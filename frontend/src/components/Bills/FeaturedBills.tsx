import { useState, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import BillGrid from './BillGrid';

export function FeaturedBills() {
  const [featuredBills, setFeaturedBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/bill-analyses/featured`);
        const data = await res.json();
        setFeaturedBills(data.featured_bills || []);
      } catch (err) {
        console.error('Failed to fetch featured bills', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!featuredBills.length && !loading) return null;

  return (
    <Box my={12}>
      <Heading size="lg" mb={4} color="primary">
        Featured Bills
      </Heading>
      <BillGrid
        bills={featuredBills}
        loading={loading}
        featured={true}
        emptyMessage="No featured bills available"
      />
    </Box>
  );
}
