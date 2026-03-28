const anomalies = [
  { title: "EC2 Cost Spike +340%", id: "i-0a3d8f92", time: "3m ago", severity: "critical" },
  { title: "Lambda Invocation Anomaly", id: "process-orders", time: "18m ago", severity: "high" },
  { title: "S3 Transfer Cost Creep", id: "prod-assets-bucket", time: "41m ago", severity: "medium" },
  { title: "RDS Idle Connection Pool", id: "db-prod-02", time: "1h ago", severity: "low" },
];

const severityBorder: Record<string, string> = {
  critical: "border-l-destructive",
  high: "border-l-warning",
  medium: "border-l-accent",
  low: "border-l-muted-foreground",
};

const RecentAnomalies = () => {
  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Recent Anomalies</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
          7 Active
        </span>
      </div>
      <div className="space-y-2 flex-1">
        {anomalies.map((a, i) => (
          <div
            key={i}
            className={`border-l-2 ${severityBorder[a.severity]} rounded-r-md bg-muted/40 px-3 py-2.5 hover:bg-muted/70 transition-colors cursor-pointer`}
          >
            <p className="text-sm font-medium text-foreground">{a.title}</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {a.id} · {a.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAnomalies;
