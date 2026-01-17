import { Container, } from '@chakra-ui/react'
import { Hero } from '../components/Landing/Hero.tsx'
import { LegislatorPreview } from '../components/Legislators/LegislatorPreview.tsx'
import { Features } from '../components/Landing/Features.tsx'
import { FeaturedBills } from '../components/Bills/FeaturedBills.tsx'

export default function Landing() {
    return (
        <>
            <Container maxW="7xl" py={8}>
                <Hero />
                <LegislatorPreview />
                <FeaturedBills />
                {/* <Features /> */}
            </Container>
        </>
    )
}
