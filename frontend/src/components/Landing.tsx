import { Container,} from '@chakra-ui/react'
import { Header } from './Header.tsx'
import { Hero } from './Hero.tsx'
import { LegislatorPreview } from './LegislatorPreview.tsx'

export default function Landing() {
  return (
    <Container maxW="7xl" py={8}>
      <Header />
      <Hero />
      <LegislatorPreview />
    </Container>
  )
}
