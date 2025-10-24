import { Container, } from '@chakra-ui/react'
import { Header } from './Header.tsx'
import { Hero } from './Hero.tsx'
import { LegislatorPreview } from './LegislatorPreview.tsx'
import { Footer } from './Footer.tsx'

export default function Landing() {
    return (
        <>
            <Header />
            <Container maxW="7xl" py={8}>
                <Hero />
                <LegislatorPreview />
            </Container>
            <Footer />
        </>
    )
}
