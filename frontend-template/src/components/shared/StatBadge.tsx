import { LucideIcon } from "lucide-react";

interface StatBadgeProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  variant?: "primary" | "secondary" | "accent" | "default";
}

export function StatBadge({ label, value, icon: Icon, trend, variant = "default" }: StatBadgeProps) {
  const variantClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary-foreground border-secondary/20",
    accent: "bg-accent/10 text-accent-foreground border-accent/20",
    default: "bg-muted text-foreground border-border"
  };

  const trendClasses = {
    up: "text-primary",
    down: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <div className={`px-4 py-3 rounded-lg border ${variantClasses[variant]}`}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-xs opacity-75">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-medium">{value}</span>
        {trend && (
          <span className={`text-xs ${trendClasses[trend]}`}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "→"}
          </span>
        )}
      </div>
    </div>
  );
}
