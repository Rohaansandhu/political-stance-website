import { Header } from "../Header";
import { Footer } from "../Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { StatBadge } from "../shared/StatBadge";
import { IssueStanceCard } from "../shared/IssueStanceCard";
import { Twitter, Linkedin, Globe, FileText, Users, TrendingUp, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const votingPatternData = [
  { month: "Jan", partyLine: 85, bipartisan: 15 },
  { month: "Feb", partyLine: 82, bipartisan: 18 },
  { month: "Mar", partyLine: 88, bipartisan: 12 },
  { month: "Apr", partyLine: 79, bipartisan: 21 },
  { month: "May", partyLine: 84, bipartisan: 16 },
  { month: "Jun", partyLine: 81, bipartisan: 19 },
];

const stanceTimeline = [
  { date: "2024-01", healthcare: 75, climate: 68, economy: 55 },
  { date: "2024-04", healthcare: 78, climate: 72, economy: 58 },
  { date: "2024-07", healthcare: 82, climate: 75, economy: 60 },
  { date: "2024-10", healthcare: 85, climate: 80, economy: 62 },
];

const recentVotes = [
  { bill: "HR 2847", name: "Infrastructure Investment Act", vote: "Yea", date: "2024-10-15", result: "Passed" },
  { bill: "S 1523", name: "Healthcare Reform Bill", vote: "Yea", date: "2024-10-12", result: "Passed" },
  { bill: "HR 3421", name: "Tax Reform Act", vote: "Nay", date: "2024-10-08", result: "Failed" },
  { bill: "S 2156", name: "Education Funding Bill", vote: "Yea", date: "2024-10-05", result: "Passed" },
];

export function LegislatorProfilePage() {
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
                <BreadcrumbLink href="/legislators">Legislators</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Sarah Mitchell</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Profile Header */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  SM
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="mb-2">Sarah Mitchell</h1>
                    <p className="text-muted-foreground mb-3">
                      Representative • California 12th District • Democrat
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Democrat</Badge>
                      <Badge variant="outline">House</Badge>
                      <Badge variant="outline">3rd Term</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatBadge label="Votes Cast" value="1,247" icon={FileText} variant="primary" />
            <StatBadge label="Attendance" value="95%" icon={Calendar} trend="up" variant="accent" />
            <StatBadge label="Bills Sponsored" value="23" icon={FileText} variant="secondary" />
            <StatBadge label="Controversy Score" value="32" icon={TrendingUp} trend="down" variant="default" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="voting">Voting Record</TabsTrigger>
              <TabsTrigger value="stances">Stances</TabsTrigger>
              <TabsTrigger value="bills">Bills</TabsTrigger>
              <TabsTrigger value="bio">Biography</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stance Timeline Chart */}
              <Card className="p-6">
                <h3 className="mb-6">Stance Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stanceTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 35, 35, 0.1)" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="healthcare" stroke="#1b7879" strokeWidth={2} name="Healthcare" />
                    <Line type="monotone" dataKey="climate" stroke="#0bbec1" strokeWidth={2} name="Climate" />
                    <Line type="monotone" dataKey="economy" stroke="#78ebed" strokeWidth={2} name="Economy" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Current Stances */}
              <div>
                <h3 className="mb-4">Current Issue Stances</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <IssueStanceCard
                    issue="Healthcare Reform"
                    stance="support"
                    description="Supports expanding healthcare coverage and reducing prescription drug costs."
                    lastUpdated="2 weeks ago"
                    confidence={92}
                  />
                  <IssueStanceCard
                    issue="Climate Action"
                    stance="support"
                    description="Advocates for aggressive climate policies and renewable energy investment."
                    lastUpdated="1 month ago"
                    confidence={88}
                  />
                  <IssueStanceCard
                    issue="Tax Reform"
                    stance="neutral"
                    description="Has not taken a strong position on current tax reform proposals."
                    lastUpdated="3 weeks ago"
                    confidence={65}
                  />
                  <IssueStanceCard
                    issue="Immigration"
                    stance="support"
                    description="Supports comprehensive immigration reform with pathway to citizenship."
                    lastUpdated="1 week ago"
                    confidence={90}
                  />
                  <IssueStanceCard
                    issue="Education Funding"
                    stance="support"
                    description="Strong advocate for increased federal education funding."
                    lastUpdated="2 days ago"
                    confidence={95}
                  />
                  <IssueStanceCard
                    issue="Gun Control"
                    stance="support"
                    description="Supports background checks and assault weapons ban."
                    lastUpdated="1 month ago"
                    confidence={87}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Voting Record Tab */}
            <TabsContent value="voting" className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-6">Voting Patterns</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={votingPatternData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 35, 35, 0.1)" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="partyLine" fill="#1b7879" name="Party Line" />
                    <Bar dataKey="bipartisan" fill="#0bbec1" name="Bipartisan" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="mb-6">Recent Votes</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Vote</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentVotes.map((vote, index) => (
                      <TableRow key={index}>
                        <TableCell>{vote.bill}</TableCell>
                        <TableCell>{vote.name}</TableCell>
                        <TableCell>
                          <Badge variant={vote.vote === "Yea" ? "default" : "destructive"}>
                            {vote.vote}
                          </Badge>
                        </TableCell>
                        <TableCell>{vote.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{vote.result}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Other tabs content */}
            <TabsContent value="stances">
              <Card className="p-6">
                <h3 className="mb-4">Detailed Policy Stances</h3>
                <p className="text-muted-foreground">Comprehensive stance analysis across all policy areas...</p>
              </Card>
            </TabsContent>

            <TabsContent value="bills">
              <Card className="p-6">
                <h3 className="mb-4">Sponsored & Co-Sponsored Bills</h3>
                <p className="text-muted-foreground">Legislative activity and bill sponsorship history...</p>
              </Card>
            </TabsContent>

            <TabsContent value="bio">
              <Card className="p-6">
                <h3 className="mb-4">Biography</h3>
                <p className="text-muted-foreground">Background, education, and career history...</p>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Compare CTA */}
          <Card className="p-6 mt-6 bg-primary/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="mb-2">Compare with Other Legislators</h3>
                <p className="text-muted-foreground">
                  See how Sarah Mitchell's positions compare to other representatives
                </p>
              </div>
              <Button className="whitespace-nowrap">
                <Users className="mr-2 h-4 w-4" />
                Start Comparison
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
