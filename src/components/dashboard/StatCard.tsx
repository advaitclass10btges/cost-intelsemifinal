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
    <div className="glass-card p-6 flex flex-col justify-between min-h-[140px] group transition-all duration-300">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{value}</div>
        <p className={`text-[11px] font-medium mt-1 ${subtextColors[subtextColor]}`}>
          {subtext}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
