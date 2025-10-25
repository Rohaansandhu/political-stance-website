import { Header } from "../Header";
import { Footer } from "../Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StatBadge } from "../shared/StatBadge";
import { FileText, Calendar, Users, TrendingUp, Vote, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const partyComposition = {
  house: { democrat: 213, republican: 222, independent: 0 },
  senate: { democrat: 51, republican: 49, independent: 0 }
};

const votingPatterns = [
  { month: "Jan", partyUnity: 88, bipartisan: 12 },
  { month: "Feb", partyUnity: 85, bipartisan: 15 },
  { month: "Mar", partyUnity: 91, bipartisan: 9 },
  { month: "Apr", partyUnity: 87, bipartisan: 13 },
  { month: "May", partyUnity: 89, bipartisan: 11 },
  { month: "Jun", partyUnity: 92, bipartisan: 8 },
];

const majorLegislation = [
  { name: "Infrastructure Investment and Jobs Act", status: "Passed", votes: "228-206", date: "2024-03-15" },
  { name: "Climate Action Framework", status: "Passed", votes: "224-211", date: "2024-05-22" },
  { name: "Healthcare Modernization Act", status: "Failed", votes: "205-230", date: "2024-07-10" },
  { name: "Education Funding Bill", status: "Passed", votes: "241-194", date: "2024-09-08" },
];

const topLegislators = [
  { name: "Robert Chen", billsSponsored: 23, votesCast: 542 },
  { name: "Sarah Mitchell", billsSponsored: 21, votesCast: 538 },
  { name: "Patricia Williams", billsSponsored: 19, votesCast: 535 },
  { name: "James Reynolds", billsSponsored: 18, votesCast: 540 },
];

const timelineEvents = [
  { date: "2024-01-03", event: "118th Congress Convened", type: "session" },
  { date: "2024-02-15", event: "State of the Union Address", type: "speech" },
  { date: "2024-03-15", event: "Infrastructure Bill Passed", type: "legislation" },
  { date: "2024-05-22", event: "Climate Bill Passed", type: "legislation" },
  { date: "2024-07-10", event: "Healthcare Bill Failed", type: "legislation" },
  { date: "2024-09-08", event: "Education Bill Passed", type: "legislation" },
];

const COLORS = ['#1b7879', '#0bbec1', '#78ebed'];

export function CongressProfilePage() {
  const housePieData = [
    { name: 'Democrat', value: partyComposition.house.democrat },
    { name: 'Republican', value: partyComposition.house.republican },
  ];

  const senatePieData = [
    { name: 'Democrat', value: partyComposition.senate.democrat },
    { name: 'Republican', value: partyComposition.senate.republican },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/congresses">Congresses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>118th Congress</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Congress Header */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1>118th Congress</h1>
                  <Badge variant="default">Current</Badge>
                </div>
                <p className="text-muted-foreground mb-4">January 3, 2023 - January 3, 2025</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">House: Republican</Badge>
                  <Badge variant="default">Senate: Democrat</Badge>
                </div>
              </div>
              <Button>Compare Sessions</Button>
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatBadge label="Bills Passed" value="127" icon={FileText} variant="primary" />
            <StatBadge label="Votes Taken" value="542" icon={Vote} variant="accent" />
            <StatBadge label="Days in Session" value="156" icon={Calendar} variant="secondary" />
            <StatBadge label="Members" value="535" icon={Users} variant="default" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="legislation">Legislation</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="votes">Key Votes</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Party Control Breakdown */}
              <Card className="p-6">
                <h3 className="mb-6">Party Control Breakdown</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-center mb-4">House of Representatives</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={housePieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {housePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Republican Majority: {partyComposition.house.republican - partyComposition.house.democrat} seats
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-center mb-4">Senate</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={senatePieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {senatePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Democrat Majority: {partyComposition.senate.democrat - partyComposition.senate.republican} seats
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Voting Patterns */}
              <Card className="p-6">
                <h3 className="mb-6">Voting Patterns</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={votingPatterns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 35, 35, 0.1)" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="partyUnity" fill="#1b7879" name="Party Unity %" />
                    <Bar dataKey="bipartisan" fill="#0bbec1" name="Bipartisan %" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Legislation Tab */}
            <TabsContent value="legislation">
              <Card className="p-6">
                <h3 className="mb-6">Major Legislation</h3>
                <div className="space-y-4">
                  {majorLegislation.map((bill, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4>{bill.name}</h4>
                        <Badge variant={bill.status === "Passed" ? "default" : "destructive"}>
                          {bill.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Vote: {bill.votes}</span>
                        <span>•</span>
                        <span>{bill.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card className="p-6">
                <h3 className="mb-6">Most Active Legislators</h3>
                <div className="space-y-4">
                  {topLegislators.map((legislator, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="mb-1">{legislator.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {legislator.billsSponsored} bills sponsored • {legislator.votesCast} votes cast
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Key Votes Tab */}
            <TabsContent value="votes">
              <Card className="p-6">
                <h3 className="mb-4">Controversial Votes</h3>
                <p className="text-muted-foreground">Close or contentious votes during this congressional session...</p>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <Card className="p-6">
                <h3 className="mb-6">Timeline of Events</h3>
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="relative flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="text-sm text-muted-foreground mb-1">{event.date}</div>
                          <h4>{event.event}</h4>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
