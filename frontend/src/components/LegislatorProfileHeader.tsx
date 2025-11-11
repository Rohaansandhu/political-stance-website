import {
    Box,
    Flex,
    Heading,
    Text,
    Badge,
    Avatar,
    VStack,
    HStack,
} from "@chakra-ui/react";

interface DataInfo {
    name: { official_full: string};
    bio: { gender: string; birthday: string };
    id: {};
    state: string;
    district: string;
}


export default function LegislatorProfileHeader({ data}: { data: DataInfo }) {
    const { name, bio, id } = data;

    return (
        <Flex
            bg="bgLightTint"
            p={8}
            rounded="xl"
            gap={8}
            align="center"
            direction={{ base: "column", md: "row" }}
            w="100%"
        >
            {/* Image placeholder */}
            <Avatar.Root
                size="2xl"
                bg="primary"
            >
                <Avatar.Fallback name={name.official_full} />
                {/* TODO: Link to Legislators Profile Images */}
                {/* <Avatar.Image src="https://bit.ly/sage-adebayo" /> */}
            </Avatar.Root>

            <VStack align="flex-start" w="100%">
                <Heading size="2xl">{name.official_full}</Heading>

                <HStack>
                    <Badge colorScheme="blue">{data.state}</Badge>
                    {data.district && (
                        <Badge colorScheme="green">District {data.district}</Badge>
                    )}
                </HStack>

                <Text color="text" fontSize="lg">
                    Gender: {bio.gender}
                </Text>
                <Text color="text">
                    Born: {bio.birthday}
                </Text>
            </VStack>
        </Flex>
    );
}
