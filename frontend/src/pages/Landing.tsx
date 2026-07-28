import { Box } from "@chakra-ui/react";
import { Hero } from "../components/Landing/Hero.tsx";
import { LegislatorPreview } from "../components/Legislators/LegislatorPreview.tsx";
import { IdeologyScoreExplainer } from "../components/Landing/IdeologyScoreExplainer.tsx";
import { BillAnalysisExplainer } from "../components/Landing/BillAnalysisExplainer.tsx";
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
        <BillAnalysisExplainer />
        <IdeologyScoreExplainer />
        <LegislatorPreview />
        <RecentBills />
      </Box>
    </>
  );
}
