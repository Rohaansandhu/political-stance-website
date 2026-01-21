import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Avatar,
  VStack,
  Badge,
  HStack,
  Spinner,
  Center,
  Image,
  useBreakpointValue,
  IconButton, 
} from "@chakra-ui/react";
import { Carousel } from "@chakra-ui/react";

// Hardcoded lists of important legislators
const CONGRESSIONAL_LEADERS = {
  senate: ["S303", "S270"],
  house: ["J000299", "S001176", "J000294"],
};

const POPULAR_LEGISLATORS = {
  senate: ["S313", "S355", "S366"],
  house: ["C001120", "O000172"],
};

interface Legislator {
  bioguide: string;
  lis?: string;
  name: {
    official_full: string;
  };
  terms: Array<{
    type: "sen" | "rep";
    state: string;
    party: string;
    district?: number;
  }>;
}

export default function LegislatorCarousel() {
  const [leaders, setLeaders] = useState<Legislator[]>([]);
  const [popular, setPopular] = useState<Legislator[]>([]);
  const [loading, setLoading] = useState(true);

  const slidesPerPage =
    useBreakpointValue({
      base: 1,
      md: 2,
      lg: 3,
      xl: 5,
    }) || 1;

  useEffect(() => {
    fetchLegislators();
  }, []);

  const fetchLegislators = async () => {
    try {
      const leaderIds = [
        ...CONGRESSIONAL_LEADERS.senate,
        ...CONGRESSIONAL_LEADERS.house,
      ];

      const leaderPromises = leaderIds.map((id) =>
        fetch(`${import.meta.env.VITE_API_URL}/api/legislators/${id}`)
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Failed to fetch ${id}:`, err);
            return null;
          })
      );

      const popularIds = [
        ...POPULAR_LEGISLATORS.senate,
        ...POPULAR_LEGISLATORS.house,
      ];

      const popularPromises = popularIds.map((id) =>
        fetch(`${import.meta.env.VITE_API_URL}/api/legislators/${id}`)
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Failed to fetch ${id}:`, err);
            return null;
          })
      );

      const [leaderResults, popularResults] = await Promise.all([
        Promise.all(leaderPromises),
        Promise.all(popularPromises),
      ]);

      setLeaders(leaderResults.filter((r) => r !== null));
      setPopular(popularResults.filter((r) => r !== null));
    } catch (error) {
      console.error("Failed to fetch legislators:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTerm = (legislator: Legislator) => {
    if (!legislator.terms || legislator.terms.length === 0) {
      return null;
    }
    return legislator.terms[legislator.terms.length - 1];
  };

  const getMemberId = (legislator: Legislator) => {
    const currentTerm = getCurrentTerm(legislator);
    if (!currentTerm) {
      return legislator.bioguide;
    }
    return currentTerm.type === "sen" ? legislator.lis : legislator.bioguide;
  };

  const getRole = (legislator: Legislator) => {
    const id = legislator.bioguide;
    const lisId = legislator.lis;

    if (id === "J000299") return "Speaker of the House";

    if (
      CONGRESSIONAL_LEADERS.senate.includes(id) ||
      (lisId && CONGRESSIONAL_LEADERS.senate.includes(lisId))
    ) {
      return "Senate Leader";
    }

    if (CONGRESSIONAL_LEADERS.house.includes(id)) {
      return "House Leader";
    }

    return "Popular";
  };

  const renderCarousel = (
    legislators: Legislator[],
    title: string,
    carouselSize: number
  ) => (
    <Box w="100%" py={8}>
      <Carousel.Root
        loop
        gap={4}
        slideCount={legislators.length}
        slidesPerPage={carouselSize}
      >
        <HStack justify="space-between" mb={4}>
          <Heading size="xl" color="primary">
            {title}
          </Heading>
        </HStack>

        <Carousel.ItemGroup>
          {legislators.map((leg, idx) => {
            const currentTerm = getCurrentTerm(leg);
            const memberId = getMemberId(leg);
            const role = getRole(leg);
            const imageUrl = `https://unitedstates.github.io/images/congress/450x550/${leg.bioguide}.jpg`;

            if (!currentTerm) {
              return null;
            }

            return (
              <Carousel.Item key={memberId} index={idx}>
                <Box
                  bg="bgLightShade"
                  p={6}
                  rounded="lg"
                  cursor="pointer"
                  h="100%"
                  display="flex"
                  flexDirection="column"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "lg",
                    transition: "all 0.2s",
                  }}
                  transition="all 0.2s"
                  onClick={() =>
                    (window.location.href = `/legislators/${memberId}`)
                  }
                >
                  <VStack gap={3} h="100%">
                    <Box w="100%" alignSelf="center" aspectRatio={450 / 550}>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={`${leg.name.official_full} headshot`}
                          borderRadius="xl"
                          borderWidth="1px"
                          borderColor="gray.200"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                      ) : (
                        <Avatar.Root size="2xl" bg="primary">
                          <Avatar.Fallback name={leg.name.official_full} />
                        </Avatar.Root>
                      )}
                    </Box>

                    <VStack gap={1} textAlign="center" flex="1">
                      <Heading size="md" color="primary">
                        {leg.name.official_full}
                      </Heading>

                      <Badge colorScheme="purple" fontSize="xs">
                        {role}
                      </Badge>

                      <HStack gap={2}>
                        <Badge colorScheme="blue">{currentTerm.state}</Badge>
                        {currentTerm.district && (
                          <Badge colorScheme="green">
                            District {currentTerm.district}
                          </Badge>
                        )}
                      </HStack>

                      <Text color="text" fontSize="sm">
                        {currentTerm.type === "sen" ? "Senate" : "House"}
                      </Text>

                      <Text color="text" fontSize="sm">
                        {currentTerm.party}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              </Carousel.Item>
            );
          })}
        </Carousel.ItemGroup>

        {/* 2. Added Carousel Controls */}
        <Carousel.Control>
          <HStack justify="center" width="100%" mt={6} gap={4}>
            <Carousel.PrevTrigger asChild>
              <IconButton
                aria-label="Previous slide"
                variant="outline"
                size="md"
                rounded="full"
                borderColor="gray.300"
                _hover={{ bg: "gray.100", borderColor: "primary" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </IconButton>
            </Carousel.PrevTrigger>

            {/* Optional: Add indicators (dots) here if desired */}

            <Carousel.NextTrigger asChild>
              <IconButton
                aria-label="Next slide"
                variant="outline"
                size="md"
                rounded="full"
                borderColor="gray.300"
                _hover={{ bg: "gray.100", borderColor: "primary" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </IconButton>
            </Carousel.NextTrigger>
          </HStack>
        </Carousel.Control>
      </Carousel.Root>
    </Box>
  );

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="primary" />
      </Center>
    );
  }

  return (
    <Box>
      {leaders.length > 0 &&
        renderCarousel(leaders, "Congressional Leaders", slidesPerPage)}
      {popular.length > 0 &&
        renderCarousel(popular, "Popular Legislators", slidesPerPage)}
    </Box>
  );
}
