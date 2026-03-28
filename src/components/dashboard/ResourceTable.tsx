import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const resources = [
  { id: "i-0a3d8f92", type: "EC2", region: "us-east-1", cost: "$1,840", cpu: "87.4%", score: "0.94", status: "Anomaly" },
  { id: "i-0bc12f44", type: "EC2", region: "us-west-2", cost: "$920", cpu: "23.1%", score: "0.71", status: "Zombie" },
  { id: "process-orders", type: "Lambda", region: "us-east-1", cost: "$640", cpu: "—", score: "0.68", status: "Spike" },
  { id: "prod-assets", type: "S3", region: "us-east-1", cost: "$380", cpu: "—", score: "0.42", status: "Normal" },
  { id: "db-prod-02", type: "RDS", region: "eu-west-1", cost: "$720", cpu: "8.2%", score: "0.31", status: "Idle" },
];

const statusStyles: Record<string, string> = {
  Anomaly: "bg-destructive/10 text-destructive border-destructive/20",
  Zombie: "bg-warning/10 text-warning border-warning/20",
  Spike: "bg-chart-amber/10 text-warning border-warning/20",
  Normal: "bg-success/10 text-success border-success/20",
  Idle: "bg-muted text-muted-foreground border-border",
};

const ResourceTable = () => {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Top Resources by Cost</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">Filter</Button>
          <Button variant="outline" size="sm" className="text-xs">Export CSV</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2 pr-4">Resource ID</th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2 pr-4">Type</th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2 pr-4">Region</th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2 pr-4">Est. Cost/Mo</th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2 pr-4">CPU Avg</th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2 pr-4">Score</th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 pr-4 font-mono text-sm text-foreground">{r.id}</td>
                <td className="py-3 pr-4 text-foreground">{r.type}</td>
                <td className="py-3 pr-4 text-muted-foreground">{r.region}</td>
                <td className="py-3 pr-4 font-semibold text-foreground">{r.cost}</td>
                <td className="py-3 pr-4 text-muted-foreground">{r.cpu}</td>
                <td className="py-3 pr-4 font-mono text-muted-foreground">{r.score}</td>
                <td className="py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;
