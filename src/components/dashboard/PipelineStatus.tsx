import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const steps = [
  { name: "Data Ingestion", status: "done", detail: "847 resources" },
  { name: "Cost Estimation", status: "done", detail: "2.1s" },
  { name: "Feature Engineering", status: "done", detail: "0.8s" },
  { name: "ML Inference", status: "done", detail: "7 flagged" },
  { name: "Decision Engine", status: "pending", detail: "2 pending" },
  { name: "Execution", status: "done", detail: "3 executed" },
];

const PipelineStatus = () => {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Pipeline Status</h3>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-semibold text-success">Running</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4 font-mono">Last run: 2m 14s ago</p>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step.status === "done" ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-warning" />
              )}
              <span className="text-sm text-foreground">{step.name}</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{step.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineStatus;
