import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";

const sampleLegislators = [
  {
    name: "Sarah Mitchell",
    party: "Democrat",
    state: "CA",
    district: "12th District",
    initials: "SM",
    liberalScore: 85,
    conservativeScore: 15,
    rank: 42,
    totalRanked: 435
  },
  {
    name: "James Reynolds",
    party: "Republican",
    state: "TX",
    district: "5th District",
    initials: "JR",
    liberalScore: 22,
    conservativeScore: 78,
    rank: 312,
    totalRanked: 435
  },
  {
    name: "Maria Gonzalez",
    party: "Democrat",
    state: "NY",
    district: "15th District",
    initials: "MG",
    liberalScore: 72,
    conservativeScore: 28,
    rank: 98,
    totalRanked: 435
  }
];

export function LegislatorPreview() {
  return (
    <section id="legislators" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Legislator Profiles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each legislator profile includes detailed political spectrum analysis, voting history rankings, and comparative data across congressional sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sampleLegislators.map((legislator, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {legislator.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate">{legislator.name}</h3>
                    <p className="text-muted-foreground">
                      {legislator.state} - {legislator.district}
                    </p>
                  </div>
                  <Badge variant={legislator.party === "Democrat" ? "default" : "secondary"}>
                    {legislator.party.charAt(0)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Political Spectrum</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Liberal</span>
                          <span className="text-xs">{legislator.liberalScore}%</span>
                        </div>
                        <Progress value={legislator.liberalScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Conservative</span>
                          <span className="text-xs">{legislator.conservativeScore}%</span>
                        </div>
                        <Progress value={legislator.conservativeScore} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ranking</span>
                      <span className="text-primary">
                        #{legislator.rank} <span className="text-muted-foreground text-xs">of {legislator.totalRanked}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
