import { useState, useEffect } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import BillGrid from "./BillGrid";
import { Reveal } from "../motion/Reveal";

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
    <Box as="section" py={20} bg="bgAltGray">
      <Box maxW="6xl" mx="auto" px={4}>
        <Reveal direction="up">
          <VStack spaceX={4} mb={12} textAlign="center">
            <Heading mb={4} fontSize={{ base: "3xl", md: "4xl" }} color="primary">
              Recent Bills
            </Heading>
            <Text color="textMuted" maxW="2xl" mx="auto" fontSize={{ base: "md", md: "lg" }}>
              The most recently analyzed bills, with AI-generated partisan and
              category breakdowns.
            </Text>
          </VStack>
        </Reveal>
        <Reveal direction="up" delay={0.12}>
          <BillGrid
            bills={bills}
            loading={loading}
            emptyMessage="No recent bills available"
          />
        </Reveal>
      </Box>
    </Box>
  );
}
