import { Button } from "./ui/button";
import { TrendingUp, Users, BarChart3 } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-background to-card py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl mb-6">
            Track Political Stances with Precision
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Analyze legislator voting patterns, policy positions, and political spectrums across every session of Congress with comprehensive data visualization.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button size="lg" className="px-8">
              Explore Legislators
            </Button>
            <Button size="lg" variant="outline">
              View Congress Data
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3>500+ Legislators</h3>
              <p className="text-muted-foreground">
                Comprehensive profiles across all sessions
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3>Political Spectrums</h3>
              <p className="text-muted-foreground">
                Detailed position tracking and rankings
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3>Congress Analytics</h3>
              <p className="text-muted-foreground">
                Visual data per congressional session
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
