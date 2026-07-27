import { useState, useEffect } from "react";
import { Box, Heading } from "@chakra-ui/react";
import BillGrid from "./BillGrid";

interface RecentBillsProps {
  limit?: number;
}

export function RecentBills({ limit = 6 }: RecentBillsProps) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bill-analyses?limit=${limit}&sort=-congress`,
        );
        const data = await res.json();
        setBills(data.bills || []);
      } catch (err) {
        console.error("Failed to fetch recent bills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [limit]);

  if (!bills.length && !loading) return null;

  return (
    <Box>
      <Heading size="lg" mb={4} color="text" letterSpacing="tight">
        Recent Bills
      </Heading>
      <BillGrid
        bills={bills}
        loading={loading}
        emptyMessage="No recent bills available"
      />
    </Box>
  );
}
