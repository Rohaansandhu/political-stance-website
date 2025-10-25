import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LegislatorPreview } from "./components/LegislatorPreview";
import { CongressData } from "./components/CongressData";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { StatsOverview } from "./components/landing/StatsOverview";
import { HowItWorks } from "./components/landing/HowItWorks";
import { RecentActivity } from "./components/landing/RecentActivity";
import { CTASection } from "./components/landing/CTASection";
import { ExploreLegislatorsPage } from "./components/pages/ExploreLegislatorsPage";
import { LegislatorProfilePage } from "./components/pages/LegislatorProfilePage";
import { CompareLegislatorsPage } from "./components/pages/CompareLegislatorsPage";
import { ExploreCongressesPage } from "./components/pages/ExploreCongressesPage";
import { CongressProfilePage } from "./components/pages/CongressProfilePage";
import { Button } from "./components/ui/button";
import { ChevronDown } from "lucide-react";

type PageType = 
  | "landing"
  | "explore-legislators" 
  | "legislator-profile"
  | "compare-legislators"
  | "explore-congresses"
  | "congress-profile";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing");

  // Landing Page - Full enhanced version
  if (currentPage === "landing") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <StatsOverview />
          <LegislatorPreview />
          <CongressData />
          <Features />
          <HowItWorks />
          <RecentActivity />
          <CTASection />
        </main>
        <Footer />

        {/* Page Navigation Demo - Floating Menu */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg p-4 space-y-2">
            <p className="text-sm font-medium mb-2">Navigate Pages:</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setCurrentPage("explore-legislators")}
            >
              Explore Legislators
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setCurrentPage("legislator-profile")}
            >
              Legislator Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setCurrentPage("compare-legislators")}
            >
              Compare Legislators
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setCurrentPage("explore-congresses")}
            >
              Explore Congresses
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setCurrentPage("congress-profile")}
            >
              Congress Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Other pages with back to landing button
  return (
    <>
      {currentPage === "explore-legislators" && <ExploreLegislatorsPage />}
      {currentPage === "legislator-profile" && <LegislatorProfilePage />}
      {currentPage === "compare-legislators" && <CompareLegislatorsPage />}
      {currentPage === "explore-congresses" && <ExploreCongressesPage />}
      {currentPage === "congress-profile" && <CongressProfilePage />}

      {/* Back to Landing - Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 space-y-2">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={() => setCurrentPage("landing")}
          >
            ← Back to Landing
          </Button>
          <div className="pt-2 border-t border-border space-y-2">
            <p className="text-xs text-muted-foreground">Other Pages:</p>
            {currentPage !== "explore-legislators" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setCurrentPage("explore-legislators")}
              >
                Explore Legislators
              </Button>
            )}
            {currentPage !== "legislator-profile" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setCurrentPage("legislator-profile")}
              >
                Legislator Profile
              </Button>
            )}
            {currentPage !== "compare-legislators" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setCurrentPage("compare-legislators")}
              >
                Compare
              </Button>
            )}
            {currentPage !== "explore-congresses" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setCurrentPage("explore-congresses")}
              >
                Congresses
              </Button>
            )}
            {currentPage !== "congress-profile" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setCurrentPage("congress-profile")}
              >
                Congress Detail
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
