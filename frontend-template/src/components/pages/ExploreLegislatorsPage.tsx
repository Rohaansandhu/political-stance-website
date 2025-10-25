import { useState } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { SearchBar } from "../shared/SearchBar";
import { FilterChip } from "../shared/FilterChip";
import { LegislatorCard } from "../shared/LegislatorCard";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const mockLegislators = [
  { name: "Sarah Mitchell", party: "Democrat" as const, state: "CA", district: "12th District", votingScore: 95, controversyScore: 32 },
  { name: "James Reynolds", party: "Republican" as const, state: "TX", district: "5th District", votingScore: 88, controversyScore: 67 },
  { name: "Maria Gonzalez", party: "Democrat" as const, state: "NY", district: "15th District", votingScore: 92, controversyScore: 28 },
  { name: "Robert Chen", party: "Democrat" as const, state: "CA", district: "18th District", votingScore: 89, controversyScore: 45 },
  { name: "Patricia Williams", party: "Republican" as const, state: "FL", district: "3rd District", votingScore: 91, controversyScore: 52 },
  { name: "Michael O'Brien", party: "Republican" as const, state: "TX", district: "21st District", votingScore: 86, controversyScore: 71 },
  { name: "Jennifer Kim", party: "Democrat" as const, state: "WA", district: "7th District", votingScore: 94, controversyScore: 19 },
  { name: "David Martinez", party: "Independent" as const, state: "ME", district: "2nd District", votingScore: 90, controversyScore: 38 },
  { name: "Lisa Anderson", party: "Democrat" as const, state: "IL", district: "9th District", votingScore: 93, controversyScore: 25 },
];

export function ExploreLegislatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Array<{ label: string; value: string }>>([]);
  const [sortBy, setSortBy] = useState("name");

  const removeFilter = (index: number) => {
    setActiveFilters(filters => filters.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Legislators</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="mb-2">Explore Legislators</h1>
            <p className="text-muted-foreground">
              Browse and search through our comprehensive database of legislators
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <SearchBar 
              placeholder="Search by name, state, or district..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Legislators</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="mb-3">Party</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="democrat" />
                          <Label htmlFor="democrat">Democrat</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="republican" />
                          <Label htmlFor="republican">Republican</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="independent" />
                          <Label htmlFor="independent">Independent</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3">Chamber</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="house" />
                          <Label htmlFor="house">House</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="senate" />
                          <Label htmlFor="senate">Senate</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="controversy">Controversy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map((filter, index) => (
                <FilterChip
                  key={index}
                  label={filter.label}
                  value={filter.value}
                  onRemove={() => removeFilter(index)}
                />
              ))}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {mockLegislators.length} of {mockLegislators.length} legislators
            </p>
          </div>

          {/* Legislator Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockLegislators.map((legislator, index) => (
              <LegislatorCard
                key={index}
                {...legislator}
                onCompare={() => console.log("Add to compare", legislator.name)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <div className="flex gap-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button variant="outline" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
