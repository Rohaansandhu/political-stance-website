import { Header } from "../Header";
import { Footer } from "../Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar, Users, FileText, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const congresses = [
  {
    number: "118th",
    years: "2023-2025",
    houseControl: "Republican",
    senateControl: "Democrat",
    billsPassed: 127,
    majorLegislation: ["Infrastructure Act", "Climate Bill"],
    status: "Current"
  },
  {
    number: "117th",
    years: "2021-2023",
    houseControl: "Democrat",
    senateControl: "Democrat",
    billsPassed: 243,
    majorLegislation: ["American Rescue Plan", "Infrastructure Investment"],
    status: "Completed"
  },
  {
    number: "116th",
    years: "2019-2021",
    houseControl: "Democrat",
    senateControl: "Republican",
    billsPassed: 188,
    majorLegislation: ["CARES Act", "COVID Relief"],
    status: "Completed"
  },
  {
    number: "115th",
    years: "2017-2019",
    houseControl: "Republican",
    senateControl: "Republican",
    billsPassed: 212,
    majorLegislation: ["Tax Cuts Act", "Farm Bill"],
    status: "Completed"
  },
  {
    number: "114th",
    years: "2015-2017",
    houseControl: "Republican",
    senateControl: "Republican",
    billsPassed: 195,
    majorLegislation: ["Highway Bill", "Education Act"],
    status: "Completed"
  },
  {
    number: "113th",
    years: "2013-2015",
    houseControl: "Republican",
    senateControl: "Democrat",
    billsPassed: 167,
    majorLegislation: ["ACA Amendments", "Budget Control"],
    status: "Completed"
  },
];

const trendData = [
  { congress: "113th", partisan: 72, bipartisan: 28, bills: 167 },
  { congress: "114th", partisan: 75, bipartisan: 25, bills: 195 },
  { congress: "115th", partisan: 78, bipartisan: 22, bills: 212 },
  { congress: "116th", partisan: 82, bipartisan: 18, bills: 188 },
  { congress: "117th", partisan: 85, bipartisan: 15, bills: 243 },
  { congress: "118th", partisan: 87, bipartisan: 13, bills: 127 },
];

export function ExploreCongressesPage() {
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
                <BreadcrumbPage>Congresses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="mb-2">Explore Congressional Sessions</h1>
            <p className="text-muted-foreground">
              Browse historical data and trends across different congressional sessions
            </p>
          </div>

          {/* Congress Timeline */}
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Congressional Timeline</h3>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {congresses.map((congress, index) => (
                  <div key={index} className="relative flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        congress.status === "Current" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        <Calendar className="h-6 w-6" />
                      </div>
                    </div>
                    <Card className="flex-1 p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4>{congress.number} Congress</h4>
                            {congress.status === "Current" && (
                              <Badge variant="default">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{congress.years}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">House</p>
                          <Badge variant={congress.houseControl === "Democrat" ? "default" : "secondary"}>
                            {congress.houseControl}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Senate</p>
                          <Badge variant={congress.senateControl === "Democrat" ? "default" : "secondary"}>
                            {congress.senateControl}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Bills Passed</p>
                          <p className="text-sm">{congress.billsPassed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Major Laws</p>
                          <p className="text-sm">{congress.majorLegislation.length}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Major Legislation</p>
                        <div className="flex flex-wrap gap-1">
                          {congress.majorLegislation.map((law, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {law}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Historical Trends */}
          <Card className="p-6 mb-6">
            <h3 className="mb-6">Historical Trends</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-4">Partisan vs Bipartisan Voting</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 35, 35, 0.1)" />
                    <XAxis dataKey="congress" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="partisan" stroke="#1b7879" strokeWidth={2} name="Partisan" />
                    <Line type="monotone" dataKey="bipartisan" stroke="#0bbec1" strokeWidth={2} name="Bipartisan" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="mb-4">Bills Passed Per Congress</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 35, 35, 0.1)" />
                    <XAxis dataKey="congress" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bills" stroke="#1b7879" strokeWidth={2} name="Bills Passed" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Landmark Legislation */}
          <div className="mb-6">
            <h3 className="mb-4">Landmark Legislation Highlights</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">American Rescue Plan</h4>
                    <p className="text-xs text-muted-foreground">117th Congress • 2021</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  $1.9 trillion COVID-19 relief package
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">Infrastructure Investment</h4>
                    <p className="text-xs text-muted-foreground">117th Congress • 2021</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  $1.2 trillion infrastructure modernization
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">CARES Act</h4>
                    <p className="text-xs text-muted-foreground">116th Congress • 2020</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  $2.2 trillion pandemic relief package
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
