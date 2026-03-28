import { Gauge, TrendingDown, Layers, Cpu, HardDrive, Zap, ArrowRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

const recommendations = [
  { resource: "i-0a3d8f92", type: "EC2", action: "Downsize to m5.large", savings: "$640/mo", priority: "high", status: "ready" },
  { resource: "i-0bc12f44", type: "EC2", action: "Terminate zombie instance", savings: "$920/mo", priority: "critical", status: "ready" },
  { resource: "db-prod-02", type: "RDS", action: "Switch to reserved pricing", savings: "$280/mo", priority: "medium", status: "review" },
  { resource: "nat-gateway-01", type: "VPC", action: "Consolidate NAT gateways", savings: "$180/mo", priority: "low", status: "ready" },
  { resource: "ebs-vol-unused-3", type: "EBS", action: "Delete unattached volume", savings: "$45/mo", priority: "medium", status: "ready" },
  { resource: "lambda-staging", type: "Lambda", action: "Reduce memory allocation", savings: "$120/mo", priority: "medium", status: "review" },
];

const savingsData = [
  { category: "Rightsizing", potential: 2400, realized: 1800 },
  { category: "Zombies", potential: 1840, realized: 920 },
  { category: "Reserved", potential: 3200, realized: 2100 },
  { category: "Scheduling", potential: 800, realized: 650 },
  { category: "Storage", potential: 560, realized: 340 },
];

const priorityStyles: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-accent/10 text-accent border-accent/20",
  low: "bg-muted text-muted-foreground border-border",
};

const OptimizationView = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Optimization</h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
          Cost Reduction · Rightsizing · Recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Savings Potential", value: "$8,800/mo", sub: "Across 23 recommendations", icon: TrendingDown, color: "success" as const },
          { label: "Realized Savings", value: "$5,810/mo", sub: "66% implementation rate", icon: Gauge, color: "success" as const },
          { label: "Resources to Optimize", value: "18", sub: "6 critical, 12 standard", icon: Layers, color: "warning" as const },
          { label: "Avg CPU Utilization", value: "34%", sub: "Target: 65-75%", icon: Cpu, color: "default" as const },
        ].map((s, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 flex flex-col justify-between min-h-[110px]">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">{s.value}</div>
              <p className={`text-xs mt-0.5 ${s.color === "success" ? "text-success" : s.color === "warning" ? "text-warning" : "text-muted-foreground"}`}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Savings by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={savingsData} layout="vertical" margin={{ top: 0, right: 5, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }} tickLine={false} axisLine={false} width={80} />
              <Tooltip />
              <Bar dataKey="potential" fill="hsl(150, 30%, 75%)" radius={[0, 4, 4, 0]} name="Potential" />
              <Bar dataKey="realized" fill="hsl(150, 40%, 45%)" radius={[0, 4, 4, 0]} name="Realized" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Quick Wins</h3>
          <div className="space-y-3">
            {recommendations.slice(0, 4).map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer group">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.action}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{r.resource} · {r.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-success">{r.savings}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Recommendations Table */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">All Recommendations</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {["Resource", "Type", "Action", "Savings", "Priority", "Status"].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recommendations.map((r, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 pr-4 font-mono text-sm text-foreground">{r.resource}</td>
                <td className="py-3 pr-4 text-foreground">{r.type}</td>
                <td className="py-3 pr-4 text-foreground">{r.action}</td>
                <td className="py-3 pr-4 font-semibold text-success">{r.savings}</td>
                <td className="py-3 pr-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityStyles[r.priority]}`}>{r.priority}</span>
                </td>
                <td className="py-3 text-xs text-muted-foreground capitalize">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OptimizationView;
