import { useState, useEffect } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import BillGrid from "./BillGrid";
import { ArrowLink, Eyebrow, TwoToneHeading } from "../Landing/landingParts";

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
    <Box as="section" bg="bg">
      <Container maxW="7xl" px={4} pb={{ base: 16, md: 24 }}>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "flex-end" }}
          direction={{ base: "column", md: "row" }}
          gap={5}
          pt={{ base: 10, md: 14 }}
          mb={{ base: 8, md: 12 }}
          borderTopWidth="1px"
          borderColor="border"
        >
          <Box maxW="3xl">
            <Eyebrow>Recent bills</Eyebrow>
            <TwoToneHeading
              as="h2"
              size="section"
              lead="Fresh from the floor."
              rest="The latest bills we've analyzed."
            />
          </Box>
          <Box flexShrink={0}>
            <ArrowLink to="/bill-analyses">See all bill analyses</ArrowLink>
          </Box>
        </Flex>
        <BillGrid
          bills={bills}
          loading={loading}
          emptyMessage="No recent bills available"
        />
      </Container>
    </Box>
  );
}
