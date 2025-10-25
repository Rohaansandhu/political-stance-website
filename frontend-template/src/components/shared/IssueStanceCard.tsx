import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface IssueStanceCardProps {
  issue: string;
  stance: "support" | "oppose" | "neutral";
  description: string;
  lastUpdated?: string;
  confidence?: number;
}

export function IssueStanceCard({
  issue,
  stance,
  description,
  lastUpdated,
  confidence
}: IssueStanceCardProps) {
  const stanceConfig = {
    support: {
      icon: ThumbsUp,
      color: "text-primary",
      bg: "bg-primary/10",
      label: "Supports"
    },
    oppose: {
      icon: ThumbsDown,
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: "Opposes"
    },
    neutral: {
      icon: Minus,
      color: "text-muted-foreground",
      bg: "bg-muted",
      label: "Neutral"
    }
  };

  const config = stanceConfig[stance];
  const Icon = config.icon;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h4 className="mb-1">{issue}</h4>
            <Badge variant="outline" className="text-xs">
              {config.label}
            </Badge>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {lastUpdated && <span>Updated {lastUpdated}</span>}
        {confidence && <span>Confidence: {confidence}%</span>}
      </div>
    </Card>
  );
}
