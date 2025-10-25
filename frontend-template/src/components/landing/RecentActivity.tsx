import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Clock, TrendingUp, Vote } from "lucide-react";

const activities = [
  {
    legislator: "Sarah Mitchell",
    initials: "SM",
    action: "Changed stance on Climate Policy",
    from: "Neutral",
    to: "Support",
    time: "2 hours ago",
    type: "stance"
  },
  {
    legislator: "James Reynolds",
    initials: "JR",
    action: "Voted on HR 2847 - Infrastructure Bill",
    vote: "Yea",
    time: "5 hours ago",
    type: "vote"
  },
  {
    legislator: "Maria Gonzalez",
    initials: "MG",
    action: "Sponsored new Healthcare Bill",
    bill: "HR 3421",
    time: "1 day ago",
    type: "bill"
  },
  {
    legislator: "Robert Chen",
    initials: "RC",
    action: "Changed stance on Immigration Reform",
    from: "Oppose",
    to: "Neutral",
    time: "2 days ago",
    type: "stance"
  }
];

export function RecentActivity() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Recent Activity</h2>
            <p className="text-muted-foreground">
              Latest votes, stance changes, and legislative actions
            </p>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {activity.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className="mb-1">{activity.legislator}</h4>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {activity.type === "stance" && activity.from && activity.to && (
                        <>
                          <Badge variant="outline" className="text-xs">{activity.from}</Badge>
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          <Badge variant="default" className="text-xs">{activity.to}</Badge>
                        </>
                      )}
                      {activity.type === "vote" && activity.vote && (
                        <Badge variant="default" className="text-xs">
                          <Vote className="h-3 w-3 mr-1" />
                          {activity.vote}
                        </Badge>
                      )}
                      {activity.type === "bill" && activity.bill && (
                        <Badge variant="secondary" className="text-xs">{activity.bill}</Badge>
                      )}
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
