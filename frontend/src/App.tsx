import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./components/ui/color-mode";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import ExploreLegislators from "./pages/ExploreLegislators";
import LegislatorProfile from "./pages/LegislatorProfile";

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
            <Route path="/legislators/:id" element={<LegislatorProfile />} />
          </Routes>
          <Footer />
        </Router>
      </ChakraProvider>
    </ColorModeProvider>
  );
}

export default App;
