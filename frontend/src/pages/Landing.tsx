import { Box } from "@chakra-ui/react";
import { Hero } from "../components/Landing/Hero.tsx";
import { TabShowcase } from "../components/Landing/TabShowcase.tsx";
import { Methodology } from "../components/Landing/Methodology.tsx";
import { RecentBills } from "../components/Bills/RecentBills.tsx";
import { Helmet } from "react-helmet-async";

export default function Landing() {
  return (
    <>
      <Box as="main">
        <Helmet>
          <title>{`Home | US PoliTrack`}</title>
          <meta
            name="description"
            content={`Home page for US PoliTrack. Overview of the website and key features. Showcase details.`}
          />
        </Helmet>
        <Hero />
        <TabShowcase />
        <Methodology />
        <RecentBills />
      </Box>
    </>
  );
}
