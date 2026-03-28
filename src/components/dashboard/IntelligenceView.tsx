import { Brain, TrendingUp, AlertTriangle, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchIntelAnomalies, fetchIntelMetrics, fetchIntelInsights } from "@/lib/api";

const modelPerformance = [
  { month: "Jan", accuracy: 87, precision: 82, recall: 90 },
  { month: "Feb", accuracy: 89, precision: 85, recall: 88 },
  { month: "Mar", accuracy: 91, precision: 88, recall: 91 },
  { month: "Apr", accuracy: 90, precision: 87, recall: 89 },
  { month: "May", accuracy: 93, precision: 91, recall: 92 },
  { month: "Jun", accuracy: 94, precision: 92, recall: 94 },
];

const IntelligenceView = () => {
  const { data: anomalies } = useQuery({ queryKey: ['intelAnomalies'], queryFn: fetchIntelAnomalies, refetchInterval: 60000 });
  const { data: metrics } = useQuery({ queryKey: ['intelMetrics'], queryFn: fetchIntelMetrics, refetchInterval: 60000 });
  const { data: insights } = useQuery({ queryKey: ['intelInsights'], queryFn: fetchIntelInsights, refetchInterval: 60000 });

  const radarData = [
    { subject: "Cost Prediction", A: insights?.radarScore || 80 },
    { subject: "Anomaly Detection", A: insights?.radarScore ? insights.radarScore + 5 : 85 },
    { subject: "Resource Sizing", A: 76 },
    { subject: "Trend Analysis", A: 95 },
    { subject: "Pattern Recognition", A: 84 },
    { subject: "Forecasting", A: 90 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Intelligence</h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
          ML Models · Predictions · Insights
        </p>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Model Accuracy", value: `${insights?.radarScore || 0}%`, sub: insights?.accuracyDesc || "Gathering...", icon: Brain, color: "success" as const },
          { label: "Lambda Invocations", value: String(metrics?.lambdaInvocations24h || 0), sub: "Last 24 Hours", icon: TrendingUp, color: "default" as const },
          { label: "Anomalies Caught", value: String(anomalies?.length || 0), sub: "Total Live cost spikes", icon: AlertTriangle, color: "warning" as const },
          { label: "Cost Savings ID'd", value: "Real-time", sub: "Check optimization tab", icon: Target, color: "success" as const },
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Model Performance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={modelPerformance} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(150, 40%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(150, 40%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 10%, 88%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }} tickLine={false} axisLine={false} />
              <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip />
              <Area type="monotone" dataKey="accuracy" stroke="hsl(150, 40%, 45%)" strokeWidth={2} fill="url(#accGrad)" />
              <Area type="monotone" dataKey="precision" stroke="hsl(210, 60%, 50%)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="recall" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} fill="none" strokeDasharray="2 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Capability Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} outerRadius="70%">
              <PolarGrid stroke="hsl(80, 10%, 88%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="A" stroke="hsl(150, 40%, 45%)" fill="hsl(150, 40%, 45%)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Active Anomalies Detected</h3>
        <div className="space-y-2">
          {(!anomalies || anomalies.length === 0) && (
            <p className="text-sm text-muted-foreground p-3">No active anomalies detected by AWS Cost Explorer within the last week.</p>
          )}
          {(anomalies || []).map((anomaly: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm text-foreground">{anomaly.service} anomaly</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground">${anomaly.impact} impact</span>
                <span className="bg-warning/10 text-warning border-warning/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border">
                  Score: {anomaly.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceView;
