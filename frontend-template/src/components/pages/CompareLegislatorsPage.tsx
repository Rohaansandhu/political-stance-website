import { useState } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Progress } from "../ui/progress";
import { X, Plus, Download, Share2, Check, Minus } from "lucide-react";

interface Legislator {
  name: string;
  party: "Democrat" | "Republican" | "Independent";
  state: string;
  district: string;
  initials: string;
}

const selectedLegislators: Legislator[] = [
  { name: "Sarah Mitchell", party: "Democrat", state: "CA", district: "12th", initials: "SM" },
  { name: "James Reynolds", party: "Republican", state: "TX", district: "5th", initials: "JR" },
  { name: "Maria Gonzalez", party: "Democrat", state: "NY", district: "15th", initials: "MG" },
];

const comparisonStats = [
  { metric: "Votes Cast", values: ["1,247", "1,189", "1,256"] },
  { metric: "Attendance Rate", values: ["95%", "88%", "92%"] },
  { metric: "Bills Sponsored", values: ["23", "31", "18"] },
  { metric: "Controversy Score", values: ["32", "67", "28"] },
  { metric: "Party Alignment", values: ["85%", "91%", "82%"] },
];

const issueComparison = [
  { issue: "Healthcare", positions: ["Support", "Oppose", "Support"], agreement: [true, false, true] },
  { issue: "Climate Action", positions: ["Support", "Oppose", "Support"], agreement: [true, false, true] },
  { issue: "Tax Reform", positions: ["Support", "Support", "Neutral"], agreement: [true, true, false] },
  { issue: "Immigration", positions: ["Support", "Oppose", "Support"], agreement: [true, false, true] },
  { issue: "Education", positions: ["Support", "Support", "Support"], agreement: [true, true, true] },
  { issue: "Gun Control", positions: ["Support", "Oppose", "Support"], agreement: [true, false, true] },
];

const keyVotes = [
  { bill: "HR 2847 - Infrastructure", votes: ["Yea", "Nay", "Yea"], agreed: [true, false, true] },
  { bill: "S 1523 - Healthcare Reform", votes: ["Yea", "Nay", "Yea"], agreed: [true, false, true] },
  { bill: "HR 3421 - Tax Reform", votes: ["Nay", "Yea", "Nay"], agreed: [true, false, true] },
];

export function CompareLegislatorsPage() {
  const [legislators, setLegislators] = useState(selectedLegislators);

  const removeLegislator = (index: number) => {
    setLegislators(legs => legs.filter((_, i) => i !== index));
  };

  const agreementPercentage = 67;

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
                <BreadcrumbPage>Compare Legislators</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="mb-2">Compare Legislators</h1>
            <p className="text-muted-foreground">
              Compare voting records, stances, and statistics side-by-side
            </p>
          </div>

          {/* Legislator Selection */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Selected Legislators</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {legislators.map((leg, index) => (
                <Card key={index} className="p-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeLegislator(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 mb-3">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {leg.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="mb-1">{leg.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {leg.state}-{leg.district}
                    </p>
                    <Badge variant={leg.party === "Democrat" ? "default" : "secondary"}>
                      {leg.party}
                    </Badge>
                  </div>
                </Card>
              ))}
              {legislators.length < 4 && (
                <Card className="p-4 border-dashed hover:border-primary transition-colors cursor-pointer">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Add Legislator</p>
                  </div>
                </Card>
              )}
            </div>
          </Card>

          {/* Overall Agreement */}
          <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
            <div className="text-center mb-4">
              <h3 className="mb-2">Overall Agreement</h3>
              <div className="text-4xl mb-3 text-primary">{agreementPercentage}%</div>
              <p className="text-sm text-muted-foreground">
                These legislators agree on {agreementPercentage}% of key issues
              </p>
            </div>
            <Progress value={agreementPercentage} className="h-3" />
          </Card>

          {/* Stats Comparison */}
          <Card className="p-6 mb-6">
            <h3 className="mb-6">Statistics Comparison</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  {legislators.map((leg, index) => (
                    <TableHead key={index}>{leg.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonStats.map((stat, index) => (
                  <TableRow key={index}>
                    <TableCell>{stat.metric}</TableCell>
                    {stat.values.slice(0, legislators.length).map((value, vIndex) => (
                      <TableCell key={vIndex}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Issue Stance Comparison */}
          <Card className="p-6 mb-6">
            <h3 className="mb-6">Issue Stance Comparison</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    {legislators.map((leg, index) => (
                      <TableHead key={index}>{leg.name}</TableHead>
                    ))}
                    <TableHead className="text-center">Agreement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issueComparison.map((issue, index) => {
                    const allAgree = issue.agreement.slice(0, legislators.length).every(a => a);
                    return (
                      <TableRow key={index}>
                        <TableCell>{issue.issue}</TableCell>
                        {issue.positions.slice(0, legislators.length).map((position, pIndex) => (
                          <TableCell key={pIndex}>
                            <Badge 
                              variant={
                                position === "Support" ? "default" : 
                                position === "Oppose" ? "destructive" : 
                                "outline"
                              }
                            >
                              {position}
                            </Badge>
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          {allAgree ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Voting Record Comparison */}
          <Card className="p-6">
            <h3 className="mb-6">Key Vote Comparison</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill</TableHead>
                  {legislators.map((leg, index) => (
                    <TableHead key={index}>{leg.name}</TableHead>
                  ))}
                  <TableHead className="text-center">Agreement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keyVotes.map((vote, index) => {
                  const allAgree = vote.agreed.slice(0, legislators.length).every(a => a);
                  return (
                    <TableRow key={index}>
                      <TableCell>{vote.bill}</TableCell>
                      {vote.votes.slice(0, legislators.length).map((v, vIndex) => (
                        <TableCell key={vIndex}>
                          <Badge variant={v === "Yea" ? "default" : "destructive"}>
                            {v}
                          </Badge>
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        {allAgree ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
