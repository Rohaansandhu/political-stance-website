import Landing from './components/Landing'
import { ChakraProvider, Box } from "@chakra-ui/react"
import system from "./theme"
import { ColorModeProvider } from "./components/ui/color-mode"

function App() {
  return (
  <ColorModeProvider>
    <ChakraProvider value={system}>
      <Landing />
    </ChakraProvider>
  </ColorModeProvider>
  )
}

export default App
