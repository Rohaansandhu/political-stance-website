import { Card } from "./ui/card";
import { TrendingUp, Target, Database, Filter, Award, Activity } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Stance Tracking",
    description: "Monitor how legislators position themselves on key issues over time with detailed voting records."
  },
  {
    icon: TrendingUp,
    title: "Political Spectrum Analysis",
    description: "Visual representation of where each legislator falls on the political spectrum with multi-dimensional scoring."
  },
  {
    icon: Award,
    title: "Ranking System",
    description: "Compare legislators against their peers with comprehensive ranking metrics across various policy areas."
  },
  {
    icon: Database,
    title: "Historical Data",
    description: "Access voting records and stance changes across multiple congressional sessions dating back decades."
  },
  {
    icon: Filter,
    title: "Advanced Filters",
    description: "Filter and sort by party, state, district, policy area, or custom criteria to find exactly what you need."
  },
  {
    icon: Activity,
    title: "Real-time Updates",
    description: "Stay current with live updates as votes happen and positions evolve throughout each session."
  }
];

export function Features() {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Comprehensive Political Intelligence</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand the political landscape and track legislator accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-all hover:border-primary/50">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
