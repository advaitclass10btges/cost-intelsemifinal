import { AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const alerts = [
  "ec2-prod-01 anomaly detected — $847/mo waste",
  "3 zombies terminated",
  "Lambda cost spike +340%",
  "S3 transfer costs rising in us-east-1",
  "RDS idle connections detected on db-prod-02",
];

const AlertTicker = () => {
  return (
    <div className="flex items-center justify-between border-b bg-card px-6 py-2">
      <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
        <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-flex animate-ticker">
            {[...alerts, ...alerts].map((alert, i) => (
              <span key={i} className="text-xs text-muted-foreground mx-4">
                {alert}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" className="shrink-0 text-xs gap-1.5">
        <Zap className="h-3 w-3" />
        Force Run
      </Button>
    </div>
  );
};

export default AlertTicker;
