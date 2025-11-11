import { Container } from "@chakra-ui/react";
import { LegislatorsHero } from "../components/LegislatorsHero.tsx";
import { ImportantLegislatorsPreview } from "../components/ImportantLegislatorsPreview.tsx";

export default function ExploreLegislators() {
    return (
            <>
                <Container maxW="7xl" py={8}>
                    <LegislatorsHero />
                    <ImportantLegislatorsPreview />
                </Container>
            </>
        )
}

