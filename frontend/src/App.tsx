import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./components/ui/color-mode";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import ExploreLegislators from "./pages/ExploreLegislators";
import system from "./theme";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <ColorModeProvider>
      <ChakraProvider value={system}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore-legislators" element={<ExploreLegislators />} />
          </Routes>
          <Footer />
        </Router>
      </ChakraProvider>
    </ColorModeProvider>
  );
}

export default App;
