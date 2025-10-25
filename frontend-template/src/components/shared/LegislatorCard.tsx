import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LegislatorCardProps {
  name: string;
  party: "Democrat" | "Republican" | "Independent";
  state: string;
  district?: string;
  image?: string;
  votingScore?: number;
  controversyScore?: number;
  onCompare?: () => void;
}

export function LegislatorCard({
  name,
  party,
  state,
  district,
  image,
  votingScore,
  controversyScore,
  onCompare
}: LegislatorCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const partyColor = party === "Democrat" ? "default" : party === "Republican" ? "secondary" : "outline";

  return (
    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer group">
      <div className="flex items-start gap-3">
        <Avatar className="h-14 w-14">
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="truncate group-hover:text-primary transition-colors">{name}</h4>
          <p className="text-sm text-muted-foreground">
            {state}{district ? ` - ${district}` : ''}
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant={partyColor} className="text-xs">
              {party}
            </Badge>
            {votingScore && (
              <Badge variant="outline" className="text-xs">
                {votingScore}% Active
              </Badge>
            )}
          </div>
        </div>
      </div>
      {controversyScore !== undefined && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Controversy</span>
          <div className="flex items-center gap-1">
            {controversyScore > 50 ? (
              <TrendingUp className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm">{controversyScore}</span>
          </div>
        </div>
      )}
      {onCompare && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-3"
          onClick={(e) => {
            e.stopPropagation();
            onCompare();
          }}
        >
          Add to Compare
        </Button>
      )}
    </Card>
  );
}
