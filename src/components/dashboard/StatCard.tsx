import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  subtextColor?: "default" | "success" | "destructive" | "warning";
  icon: LucideIcon;
}

const subtextColors = {
  default: "text-muted-foreground",
  success: "text-success",
  destructive: "text-destructive",
  warning: "text-warning",
};

const StatCard = ({ label, value, subtext, subtextColor = "default", icon: Icon }: StatCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col justify-between min-h-[110px]">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        <p className={`text-xs mt-0.5 ${subtextColors[subtextColor]}`}>
          {subtext}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
