import { Container, } from '@chakra-ui/react'
import { Hero } from './Hero.tsx'
import { LegislatorPreview } from './LegislatorPreview.tsx'
import { Features } from './Features.tsx'

export default function Landing() {
    return (
        <>
            <Container maxW="7xl" py={8}>
                <Hero />
                <LegislatorPreview />
                <Features />
            </Container>
        </>
    )
}
