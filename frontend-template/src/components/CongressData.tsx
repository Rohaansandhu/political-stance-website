import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const congressData = [
  { congress: "113th", democrat: 201, republican: 234, independent: 0 },
  { congress: "114th", democrat: 188, republican: 247, independent: 0 },
  { congress: "115th", democrat: 194, republican: 241, independent: 0 },
  { congress: "116th", democrat: 235, republican: 199, independent: 1 },
  { congress: "117th", democrat: 222, republican: 213, independent: 0 },
  { congress: "118th", democrat: 213, republican: 222, independent: 0 }
];

const polarizationData = [
  { congress: "113th", score: 72 },
  { congress: "114th", score: 75 },
  { congress: "115th", score: 78 },
  { congress: "116th", score: 82 },
  { congress: "117th", score: 85 },
  { congress: "118th", score: 87 }
];

export function CongressData() {
  return (
    <section id="congress" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Congress Analytics</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore historical data and trends across different congressional sessions with interactive visualizations.
            </p>
          </div>

          <Tabs defaultValue="composition" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="composition">Party Composition</TabsTrigger>
              <TabsTrigger value="polarization">Polarization Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="composition">
              <Card className="p-6">
                <h3 className="mb-6">House Composition by Congress</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={congressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 35, 35, 0.1)" />
                    <XAxis dataKey="congress" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="democrat" fill="#1b7879" name="Democrat" />
                    <Bar dataKey="republican" fill="#0bbec1" name="Republican" />
                    <Bar dataKey="independent" fill="#78ebed" name="Independent" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="polarization">
              <Card className="p-6">
                <h3 className="mb-6">Political Polarization Index</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={polarizationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 35, 35, 0.1)" />
                    <XAxis dataKey="congress" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#1b7879" 
                      strokeWidth={3}
                      name="Polarization Score"
                      dot={{ fill: "#1b7879", r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 text-center">
              <div className="text-3xl text-primary mb-2">118th</div>
              <p className="text-muted-foreground">Current Congress</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl text-accent mb-2">10,000+</div>
              <p className="text-muted-foreground">Votes Tracked</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl text-secondary mb-2">50+</div>
              <p className="text-muted-foreground">Policy Categories</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
