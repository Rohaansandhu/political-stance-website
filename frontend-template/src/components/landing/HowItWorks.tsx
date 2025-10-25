import { Search, BarChart3, Users, Bell } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Explore Legislators",
      description: "Search and filter through our comprehensive database of current and past legislators."
    },
    {
      icon: BarChart3,
      title: "Analyze Voting Patterns",
      description: "View detailed voting records, stance changes, and political spectrum analysis."
    },
    {
      icon: Users,
      title: "Compare & Contrast",
      description: "Compare multiple legislators side-by-side to understand differences in policy positions."
    },
    {
      icon: Bell,
      title: "Stay Updated",
      description: "Track changes in real-time and receive updates on votes and position shifts."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with PolicyTrack in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
