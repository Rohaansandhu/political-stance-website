import { Button } from "./ui/button";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-primary">PolicyTrack</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#legislators" className="text-foreground hover:text-primary transition-colors">
                Legislators
              </a>
              <a href="#congress" className="text-foreground hover:text-primary transition-colors">
                Congress Data
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="outline">Sign In</Button>
            <Button className="hidden sm:flex">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
