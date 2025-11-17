import { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Select,
    createListCollection
} from '@chakra-ui/react';
import CongressHistogram from '../components/CongressHistogram';

export default function CongressDataPage() {
    const [chamber, setChamber] = useState('senate');
    const [field, setField] = useState('main_categories');
    const [subject, setSubject] = useState('Education');
    const [availableSubjects] = useState<string[]>([
        'Education',
        'Healthcare',
        'Economy & Finance',
        'Foreign Policy',
        'Environment & Energy',
        'Social Issues',
    ]);

    const specHash = `gpt-oss-120b_2_all_${chamber}_all`;

    return (
        <Box minH="100vh" bg="bg">
            <Container maxW="7xl" py={8}>
                {/* Header */}
                <VStack align="stretch" gap={6} mb={8}>
                    <Box>
                        <Heading size="2xl" mb={2} color="primary">
                            Congress Data Analytics
                        </Heading>
                        <Text fontSize="lg" color="text">
                            Explore voting patterns and political positions across Congress
                        </Text>
                    </Box>

                    {/* Filters */}
                    <HStack gap={4} wrap="wrap" bg="bgLightShade" p={6} rounded="lg">
                        <Select.Root
                            collection={createListCollection({
                                items: [
                                    { label: 'Senate', value: 'senate' },
                                    { label: 'House', value: 'house' }
                                ]
                            })}
                            value={[chamber]}
                            onValueChange={(details) => setChamber(details.value[0])}
                            maxW="200px"
                        >
                            <Select.Label>Chamber</Select.Label>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select Chamber" />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item item="senate">
                                    <Select.ItemText>Senate</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="house">
                                    <Select.ItemText>House</Select.ItemText>
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>

                        <Select.Root
                            collection={createListCollection({
                                items: [
                                    { label: 'Main Categories', value: 'main_categories' },
                                    { label: 'Detailed Spectrums', value: 'detailed_spectrums' }
                                ]
                            })}
                            value={[field]}
                            onValueChange={(details) => setField(details.value[0])}
                            maxW="250px"
                        >
                            <Select.Label>Field Type</Select.Label>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select Field" />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item item="main_categories">
                                    <Select.ItemText>Main Categories</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="detailed_spectrums">
                                    <Select.ItemText>Detailed Spectrums</Select.ItemText>
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>

                        <Select.Root
                            collection={createListCollection({
                                items: availableSubjects.map(s => ({ label: s, value: s }))
                            })}
                            value={[subject]}
                            onValueChange={(details) => setSubject(details.value[0])}
                            maxW="250px"
                        >
                            <Select.Label>Category</Select.Label>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select Category" />
                            </Select.Trigger>
                            <Select.Content>
                                {availableSubjects.map(subj => (
                                    <Select.Item key={subj} item={subj}>
                                        <Select.ItemText>{subj}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </HStack>
                </VStack>

                {/* Histogram Component */}
                <CongressHistogram 
                    specHash={specHash}
                    field={field}
                    subject={subject}
                    current={true}
                />

                {/* Info */}
                <Box mt={8} p={4} bg="bgLightShade" rounded="lg">
                    <Text fontSize="sm" color="text" textAlign="center">
                        Score Range: -1.0 (Liberal) to 1.0 (Conservative) • Data based on voting records
                    </Text>
                </Box>
            </Container>
        </Box>
    );
}