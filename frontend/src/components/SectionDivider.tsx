import { Box, Flex, Icon } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

interface SectionDividerProps {
  topBg: string;
  bottomBg: string;
}

export function SectionDivider({ topBg, bottomBg }: SectionDividerProps) {
  return (
    <Box w="full" bg={bottomBg} pos="relative">
      {/* This creates the visual "cutout" effect */}
      <Flex 
        justify="center" 
        align="center" 
        pos="absolute" 
        top="-20px" 
        left="0" 
        right="0" 
        zIndex={1}
      >
        <Flex
          w="40px"
          h="40px"
          rounded="full"
          bg={topBg} 
          border="4px solid"
          borderColor={bottomBg} 
          align="center"
          justify="center"
          shadow="sm"
        >
          <Icon as={ChevronDown} color="primary" boxSize={10} />
        </Flex>
      </Flex>
    </Box>
  );
}