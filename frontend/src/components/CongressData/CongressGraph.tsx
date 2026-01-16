import { Box, Text } from '@chakra-ui/react'

function toPoints(values: number[], w: number, h: number) {
  if (!values.length) return ''
  const max = Math.max(...values)
  const min = Math.min(...values)
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * w
      const y = h - ((v - min) / (max - min || 1)) * h
      return `${x},${y}`
    })
    .join(' ')
}

export default function CongressGraph({ ranks }: any) {
  const entries = Object.entries(ranks || {})
  const labels = entries.map(([k]) => k)
  const values = entries.map(([_, v]) => Number(v))
  const w = 200
  const h = 60

  return (
    <Box>
      <svg width={w} height={h}>
        <polyline
          fill="none"
          stroke="#0bbec1"
          strokeWidth={2}
          points={toPoints(values, w, h)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Text fontSize="sm" color="gray.600">
        {labels.join(' • ')}
      </Text>
    </Box>
  )
}
