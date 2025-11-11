import { Container, } from '@chakra-ui/react'
import LegislatorProfileHeader from '../components/LegislatorProfileHeader'
import LegislatorStatsOverview from '../components/LegislatorStatsOverview'
import MainCategoryGrid from '../components/MainCategoriesGrid'
import DetailedSpectrumList from '../components/DetailedSpectrumList'


export default function LegislatorProfile() {
    return (
        <>
            <Container maxW="7xl" py={8}>
                {/* <LegislatorProfileHeader data={null} />
                <LegislatorStatsOverview data={null} />
                <MainCategoryGrid categories={null} />
                <DetailedSpectrumList spectrums={null} /> */}
            </Container>
        </>
    )
}
