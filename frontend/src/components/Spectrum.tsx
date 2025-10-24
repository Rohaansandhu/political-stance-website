import { Box, Flex, Text } from '@chakra-ui/react'

export default function Spectrum({ data }: any) {
  const keys = Object.keys(data || {})
  return (
    <Box>
      {keys.map((k) => {
        const v = data[k]
        return (
          <Flex key={k} align="center" mb={2}>
            <Text minW="90px" fontSize="sm" mr={3} color="gray.700">
              {k}
            </Text>
            <Box flex="1" bg="gray.100" borderRadius="md" h="10px" overflow="hidden">
              <Box h="10px" bg="#0bbec1" width={`${(v || 0) * 100}%`} />
            </Box>
            <Text ml={3} fontSize="sm">
              {Math.round((v || 0) * 100)}%
            </Text>
          </Flex>
        )
      })}
    </Box>
  )
}
