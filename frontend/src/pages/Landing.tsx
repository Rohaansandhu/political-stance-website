import { Container } from "@chakra-ui/react";
import { Hero } from "../components/Landing/Hero.tsx";
import { LegislatorPreview } from "../components/Legislators/LegislatorPreview.tsx";
import { FeaturedBills } from "../components/Bills/FeaturedBills.tsx";
import { IdeologyScoreExplainer } from "../components/Landing/IdeologyScoreExplainer.tsx";
import { BillAnalysisExplainer } from "../components/Landing/BillAnalysisExplainer.tsx";
import { Helmet } from "react-helmet-async";

export default function Landing() {
  return (
    <>
      <Container maxW="7xl" py={8}>
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
        <FeaturedBills />
        {/* <Features /> */}
      </Container>
    </>
  );
}
