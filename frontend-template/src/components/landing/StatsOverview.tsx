import { Users, FileText, TrendingUp, Calendar } from "lucide-react";

export function StatsOverview() {
  const stats = [
    { label: "Legislators Tracked", value: "535", icon: Users },
    { label: "Votes Analyzed", value: "50,000+", icon: FileText },
    { label: "Issues Monitored", value: "150+", icon: TrendingUp },
    { label: "Years of Data", value: "20+", icon: Calendar }
  ];

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl mb-1 text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
