import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Badge, HStack, Input, InputGroup, Text, VStack } from "@chakra-ui/react";
import { Search, X } from "lucide-react";
import type { Legislator } from "./histogramUtils";

interface LegislatorSearchProps {
  legislators: Legislator[];
  selectedMemberId: string | null;
  onSelect: (memberId: string | null) => void;
}

const PARTY_BADGE_COLOR: Record<Legislator["party"], string> = {
  D: "blue",
  R: "red",
  I: "yellow",
};

export default function LegislatorSearch({
  legislators,
  selectedMemberId,
  onSelect,
}: LegislatorSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedLegislator = useMemo(
    () => legislators.find((l) => l.member_id === selectedMemberId) ?? null,
    [legislators, selectedMemberId],
  );

  useEffect(() => {
    setInputValue(selectedLegislator ? selectedLegislator.official_full_name : "");
  }, [selectedLegislator]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matches = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) return [];
    return legislators
      .filter((l) => l.official_full_name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [legislators, inputValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsOpen(true);
    if (selectedMemberId) onSelect(null);
  };

  const handlePick = (legislator: Legislator) => {
    onSelect(legislator.member_id);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    onSelect(null);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && matches.length > 0) {
      handlePick(matches[0]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isLoading = legislators.length === 0;

  return (
    <Box ref={containerRef} position="relative" w="100%" maxW="420px">
      <InputGroup>
        <>
          <HStack
            position="absolute"
            left="12px"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            zIndex={1}
            color="textMuted"
          >
            <Search size={18} />
          </HStack>

          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Loading legislators…" : "Search for a legislator…"}
            disabled={isLoading}
            size="md"
            bg="surface"
            rounded="xl"
            borderColor={selectedMemberId ? "primary" : "border"}
            borderWidth={selectedMemberId ? "2px" : "1px"}
            pl="40px"
            pr={inputValue ? "40px" : "12px"}
            _focus={{
              borderColor: "primary",
              boxShadow: "0 0 0 1px var(--chakra-colors-primary)",
              bg: "bg",
            }}
          />

          {inputValue && (
            <HStack
              position="absolute"
              right="12px"
              top="50%"
              transform="translateY(-50%)"
              cursor="pointer"
              onClick={handleClear}
              zIndex={1}
              p={1}
              rounded="md"
              color="textMuted"
              _hover={{ bg: "bgLightShade" }}
              transition="background 0.2s"
            >
              <X size={18} />
            </HStack>
          )}
        </>
      </InputGroup>

      {isOpen && matches.length > 0 && (
        <VStack
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          gap={0}
          bg="surface"
          borderWidth="1px"
          borderColor="border"
          rounded="lg"
          boxShadow="0 10px 30px -10px rgba(0,0,0,0.3)"
          zIndex={10}
          overflow="hidden"
          align="stretch"
        >
          {matches.map((legislator) => (
            <HStack
              key={legislator.member_id}
              justify="space-between"
              px={3}
              py={2}
              cursor="pointer"
              _hover={{ bg: "bgLightShade" }}
              onClick={() => handlePick(legislator)}
            >
              <Text fontSize="sm" color="text" truncate>
                {legislator.official_full_name}
              </Text>
              <HStack gap={2} flexShrink={0}>
                <Text fontSize="xs" color="textMuted">
                  {legislator.state}
                </Text>
                <Badge
                  colorPalette={PARTY_BADGE_COLOR[legislator.party]}
                  variant="subtle"
                  rounded="full"
                  fontSize="2xs"
                  px={1.5}
                >
                  {legislator.party}
                </Badge>
              </HStack>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
}
