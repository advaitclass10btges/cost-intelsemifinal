import { Play, CheckCircle2, XCircle, Clock, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExecutionHistory, fetchExecutionResources, executeAction } from "@/lib/api";
import { toast } from "sonner";

const statusConfig: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  SUCCESS: { icon: CheckCircle2, className: "text-success" },
  RUNNING: { icon: Play, className: "text-accent animate-pulse" },
  PENDING: { icon: Clock, className: "text-muted-foreground" },
  FAILED: { icon: XCircle, className: "text-destructive" },
};

const ExecutionView = () => {
  const queryClient = useQueryClient();
  const { data: history = [] } = useQuery({ queryKey: ['execHistory'], queryFn: fetchExecutionHistory, refetchInterval: 10000 });
  const { data: resources } = useQuery({ queryKey: ['execResources'], queryFn: fetchExecutionResources });

  const mutation = useMutation({
    mutationFn: ({ actionType, resourceId, resourceType }: any) => executeAction(actionType, resourceId, resourceType),
    onSuccess: () => {
      toast.success("Action initiated successfully");
      queryClient.invalidateQueries({ queryKey: ['execHistory'] });
      queryClient.invalidateQueries({ queryKey: ['execResources'] });
    },
    onError: (err: any) => {
      toast.error(`Execution failed: ${err.message}`);
    }
  });

  const handleStopInstance = (id: string) => {
    mutation.mutate({ actionType: 'STOP_EC2', resourceId: id, resourceType: 'EC2' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Execution</h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            Automated Actions · History · Status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Actions Taken", value: String(history.length), sub: "Since server boot" },
          { label: "In Progress", value: String(history.filter((h: any) => h.status === 'RUNNING').length), sub: "Executing now" },
          { label: "Failed", value: String(history.filter((h: any) => h.status === 'FAILED').length), sub: "Check logs" },
          { label: "Total Savings", value: "Real-time", sub: "Based on actions" },
        ].map((s, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-1">{s.value}</div>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Live Playbooks (Test Resources)</h3>
            <div className="space-y-2">
              {(!resources?.instances || resources.instances.length === 0) && (
                <p className="text-sm text-muted-foreground p-3">No active test instances available.</p>
              )}
              {(resources?.instances || []).map((inst: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{inst.name} ({inst.id})</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">State: {inst.state} · {inst.type}</p>
                  </div>
                  <Button 
                    variant="destructive" size="sm" 
                    disabled={inst.state !== 'running' || mutation.isPending}
                    onClick={() => handleStopInstance(inst.id)}
                  >
                    Stop EC2
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Execution History</h3>
            <div className="space-y-2">
              {history.length === 0 && <p className="text-sm text-muted-foreground p-3">No actions taken recently.</p>}
              {history.map((exec: any, i: number) => {
                const StatusIcon = statusConfig[exec.status]?.icon || Clock;
                const statusClass = statusConfig[exec.status]?.className || "";
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-4 w-4 ${statusClass}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{exec.actionType}</p>
                        <p className="text-xs text-muted-foreground font-mono">{exec.resourceId} · {exec.resourceType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground w-24 text-right">{new Date(exec.timestamp).toLocaleTimeString()}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        exec.status === "SUCCESS" ? "bg-success/10 text-success border-success/20" :
                        exec.status === "RUNNING" ? "bg-accent/10 text-accent border-accent/20" :
                        exec.status === "FAILED" ? "bg-destructive/10 text-destructive border-destructive/20" :
                        "bg-muted text-muted-foreground border-border"
                      }`}>{exec.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ExecutionView;
