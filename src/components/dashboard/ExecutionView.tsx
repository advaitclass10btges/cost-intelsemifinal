import { Play, CheckCircle2, XCircle, Clock, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const executions = [
  { id: "exec-001", action: "Terminate i-0bc12f44", type: "Zombie Cleanup", status: "completed", time: "2m ago", savings: "$920/mo" },
  { id: "exec-002", action: "Resize i-0a3d8f92 → m5.large", type: "Rightsizing", status: "completed", time: "8m ago", savings: "$640/mo" },
  { id: "exec-003", action: "Apply S3 lifecycle policy", type: "Storage Optimization", status: "running", time: "in progress", savings: "$180/mo" },
  { id: "exec-004", action: "Scale down dev environment", type: "Scheduling", status: "pending", time: "queued", savings: "$340/mo" },
  { id: "exec-005", action: "Delete unattached EBS vol", type: "Cleanup", status: "completed", time: "1h ago", savings: "$45/mo" },
  { id: "exec-006", action: "Consolidate NAT gateways", type: "Network", status: "failed", time: "2h ago", savings: "$180/mo" },
  { id: "exec-007", action: "Adjust Lambda memory", type: "Rightsizing", status: "pending", time: "queued", savings: "$120/mo" },
  { id: "exec-008", action: "Convert RDS to reserved", type: "Pricing", status: "review", time: "pending approval", savings: "$280/mo" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  completed: { icon: CheckCircle2, className: "text-success" },
  running: { icon: Play, className: "text-accent animate-pulse" },
  pending: { icon: Clock, className: "text-muted-foreground" },
  failed: { icon: XCircle, className: "text-destructive" },
  review: { icon: RotateCcw, className: "text-warning" },
};

const ExecutionView = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Execution</h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            Automated Actions · History · Status
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Zap className="h-3.5 w-3.5" />
          Run All Pending
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Completed Today", value: "3", sub: "100% success rate" },
          { label: "In Progress", value: "1", sub: "S3 lifecycle policy" },
          { label: "Pending", value: "2", sub: "Awaiting execution" },
          { label: "Total Savings", value: "$2,525/mo", sub: "From today's actions" },
        ].map((s, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{s.value}</div>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Execution History</h3>
        <div className="space-y-2">
          {executions.map((exec, i) => {
            const StatusIcon = statusConfig[exec.status]?.icon || Clock;
            const statusClass = statusConfig[exec.status]?.className || "";
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-4 w-4 ${statusClass}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{exec.action}</p>
                    <p className="text-xs text-muted-foreground font-mono">{exec.id} · {exec.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-success">{exec.savings}</span>
                  <span className="text-xs text-muted-foreground w-24 text-right">{exec.time}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    exec.status === "completed" ? "bg-success/10 text-success border-success/20" :
                    exec.status === "running" ? "bg-accent/10 text-accent border-accent/20" :
                    exec.status === "failed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                    exec.status === "review" ? "bg-warning/10 text-warning border-warning/20" :
                    "bg-muted text-muted-foreground border-border"
                  }`}>{exec.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExecutionView;
