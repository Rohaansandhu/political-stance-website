import { Button, HStack } from "@chakra-ui/react"

const Demo = () => {
  return (
    <HStack>
      <Button>Click me</Button>
      <Button>Click me</Button>
    </HStack>
  )
}

function App() {
  return (
    Demo()
    // <div style={{ padding: "2rem" }}>
    //   <Button colorPalette="blue">Hello</Button>
    // </div>
  );
}

export default App;
