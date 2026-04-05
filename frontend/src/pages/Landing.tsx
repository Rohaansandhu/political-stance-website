import { Box } from "@chakra-ui/react";
import { Hero } from "../components/Landing/Hero.tsx";
import { LegislatorPreview } from "../components/Legislators/LegislatorPreview.tsx";
import { IdeologyScoreExplainer } from "../components/Landing/IdeologyScoreExplainer.tsx";
import { BillAnalysisExplainer } from "../components/Landing/BillAnalysisExplainer.tsx";
import { Helmet } from "react-helmet-async";
import { SectionDivider } from "../components/SectionDivider.tsx";

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
        <SectionDivider topBg="bg" bottomBg="bgAltGray" />
        <BillAnalysisExplainer />
        <IdeologyScoreExplainer />
        <LegislatorPreview />
        {/* <FeaturedBills /> */}
      </Box>
    </>
  );
}
