import { Gauge, TrendingDown, Layers, Cpu, HardDrive, Zap, ArrowRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchOptRecommendations, fetchOptSavings } from "@/lib/api";

const priorityStyles: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-accent/10 text-accent border-accent/20",
  low: "bg-muted text-muted-foreground border-border",
};

const OptimizationView = () => {
  const { data: recommendations } = useQuery({ queryKey: ['optRecs'], queryFn: fetchOptRecommendations, refetchInterval: 60000 });
  const { data: optSavings } = useQuery({ queryKey: ['optSvgs'], queryFn: fetchOptSavings, refetchInterval: 60000 });

  const ebsZombies = optSavings?.ebsZombies || [];
  const recsList = recommendations || [];
  
  // Transform zombies into recommendation format for UI
  const zombiesAsRecs = ebsZombies.map((z: any) => ({
    resource: z.id,
    type: "EBS",
    action: "Delete unattached volume",
    savings: `$${z.estimatedWaste.toFixed(2)}/mo`,
    priority: "medium",
    status: "ready"
  }));

  const autoRecs = recsList.map((r: any) => ({
    resource: r.arn?.split('/').pop() || 'Unknown',
    type: "EC2",
    action: `Switch ${r.currentType} to ${r.recommendedType}`,
    savings: `$${r.savings.toFixed(2)}/mo`,
    priority: r.savings > 50 ? "high" : "low",
    status: "review"
  }));

  const allRecommendations = [...zombiesAsRecs, ...autoRecs].sort((a, b) => {
     const v1 = parseFloat(a.savings.replace(/[^0-9.]/g, ''));
     const v2 = parseFloat(b.savings.replace(/[^0-9.]/g, ''));
     return v2 - v1;
  });

  const savingsData = [
    { category: "Rightsizing", potential: autoRecs.reduce((acc: number, curr: any) => acc + parseFloat(curr.savings.replace(/[^0-9.]/g, '')), 0), realized: 0 },
    { category: "Zombies", potential: ebsZombies.reduce((acc: number, curr: any) => acc + curr.estimatedWaste, 0), realized: 0 },
    { category: "Idle", potential: 0, realized: 0 },
  ];

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
          { label: "Total Savings Potential", value: `$${savingsData.reduce((a, b) => a + b.potential, 0).toFixed(2)}/mo`, sub: `Across ${allRecommendations.length} recommendations`, icon: TrendingDown, color: "success" as const },
          { label: "Realized Savings", value: "$0.00/mo", sub: "Setup Execution tracking", icon: Gauge, color: "success" as const },
          { label: "Resources to Optimize", value: String(allRecommendations.length), sub: "Automated review", icon: Layers, color: "warning" as const },
          { label: "Avg CPU Utilization", value: "Unknown", sub: "Enable CW metrics", icon: Cpu, color: "default" as const },
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
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
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
            {allRecommendations.slice(0, 4).map((r, i) => (
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
            {allRecommendations.length === 0 && <p className="text-sm text-muted-foreground">No quick wins found.</p>}
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
            {allRecommendations.map((r, i) => (
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
        {allRecommendations.length === 0 && <p className="text-sm text-muted-foreground mt-4">No recommendations available from Compute Optimizer.</p>}
      </div>
    </div>
  );
};

export default OptimizationView;
