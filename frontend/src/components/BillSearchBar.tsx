import { useState, useEffect, useRef } from "react";
import { Box, Input, InputGroup, HStack } from "@chakra-ui/react";
import { Search, X } from "lucide-react";

interface BillSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function BillSearchBar({
  value,
  onChange,
  placeholder = "Search by bill ID or title...",
  debounceMs = 500,
}: BillSearchBarProps) {
  const [searchInput, setSearchInput] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with external value changes
  useEffect(() => {
    setSearchInput(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(searchInput);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchInput, debounceMs, onChange]);

  const handleClear = () => {
    setSearchInput("");
    onChange("");
  };

  return (
    <Box position="relative" w="100%">
      <InputGroup>
        <>
          <HStack
            position="absolute"
            left="12px"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            zIndex={1}
          >
            <Search size={20} color="var(--chakra-colors-gray-500)" />
          </HStack>

          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={placeholder}
            size="lg"
            bg="bgLightShade"
            pl="44px"
            pr={searchInput ? "44px" : "12px"}
            _focus={{
              borderColor: "primary",
              boxShadow: "0 0 0 1px var(--chakra-colors-primary)",
              bg: "bg",
            }}
          />

          {searchInput && (
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
              _hover={{ bg: "gray.200" }}
              transition="background 0.2s"
            >
              <X size={20} color="var(--chakra-colors-gray-500)" />
            </HStack>
          )}
        </>
      </InputGroup>

      {searchInput && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          fontSize="xs"
          color="text"
        >
          Searching for: "{searchInput}"
        </Box>
      )}
    </Box>
  );
}
