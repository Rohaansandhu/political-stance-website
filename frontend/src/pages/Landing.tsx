import { Container, } from '@chakra-ui/react'
import { Hero } from '../components/Hero.tsx'
import { LegislatorPreview } from '../components/LegislatorPreview.tsx'
import { Features } from '../components/Features.tsx'
import { FeaturedBills } from '../components/FeaturedBills.tsx'

export default function Landing() {
    return (
        <>
            <Container maxW="7xl" py={8}>
                <Hero />
                <LegislatorPreview />
                <FeaturedBills />
                <Features />
            </Container>
        </>
    )
}
