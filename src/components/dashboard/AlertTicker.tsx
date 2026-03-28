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
    <div className="glass-card flex items-center justify-between px-6 py-2.5 shadow-md">
      <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
        <div className="bg-amber-500/10 p-1.5 rounded-full">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        </div>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-flex animate-ticker">
            {[...alerts, ...alerts].map((alert, i) => (
              <span key={i} className="text-[11px] font-bold uppercase tracking-widest text-[#667066] mx-6">
                {alert}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" className="shrink-0 text-[10px] font-extrabold uppercase tracking-widest gap-2 bg-white/40 border-black/5 hover:bg-white/60 rounded-full px-4">
        <Zap className="h-3 w-3 fill-primary text-primary" />
        Force Run
      </Button>
    </div>
  );
};

export default AlertTicker;
