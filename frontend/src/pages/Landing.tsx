import { Container, } from '@chakra-ui/react'
import { Hero } from '../components/Landing/Hero.tsx'
import { LegislatorPreview } from '../components/Legislators/LegislatorPreview.tsx'
import { FeaturedBills } from '../components/Bills/FeaturedBills.tsx'
import { IdeologyScoreExplainer } from '../components/Landing/IdeologyScoreExplainer.tsx'
import { BillAnalysisExplainer } from '../components/Landing/BillAnalysisExplainer.tsx'

export default function Landing() {
    return (
        <>
            <Container maxW="7xl" py={8}>
                <Hero />
                <BillAnalysisExplainer />
                <IdeologyScoreExplainer />
                <LegislatorPreview />
                <FeaturedBills />
                {/* <Features /> */}
            </Container>
        </>
    )
}
