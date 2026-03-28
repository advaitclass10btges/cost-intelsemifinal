import { DollarSign, Search, Shield, Ghost, Zap, Server, Wind, BarChart3 } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import CostAnalyticsChart from "@/components/dashboard/CostAnalyticsChart";
import RecentAnomalies from "@/components/dashboard/RecentAnomalies";
import ServiceCostBreakdown from "@/components/dashboard/ServiceCostBreakdown";
import PipelineStatus from "@/components/dashboard/PipelineStatus";
import AISummary from "@/components/dashboard/AISummary";
import ResourceTable from "@/components/dashboard/ResourceTable";

const DashboardView = () => {
  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
          Autonomous FinOps · AWS + GCP · Real-Time
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Monthly Spend" value="$48,240" subtext="↑ 12.4% vs last month" subtextColor="destructive" icon={DollarSign} />
        <StatCard label="Savings Found" value="$8,910" subtext="↑ 18.5% of total spend" subtextColor="success" icon={Search} />
        <StatCard label="Active Anomalies" value="7" subtext="3 new since last cycle" subtextColor="warning" icon={Shield} />
        <StatCard label="Zombie Resources" value="12" subtext="↓ $2,340/mo waste" subtextColor="destructive" icon={Ghost} />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="AI Actions Today" value="23" subtext="19 auto · 4 pending" icon={Zap} />
        <StatCard label="Resources Monitored" value="847" subtext="AWS: 612 · GCP: 235" icon={Server} />
        <StatCard label="CO₂e Today" value="1.84t" subtext="↑ 0.3t vs yesterday" subtextColor="destructive" icon={Wind} />
        <StatCard label="Confidence Score" value="94.2%" subtext="Model ensemble avg" icon={BarChart3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-3">
          <CostAnalyticsChart />
        </div>
        <div className="lg:col-span-2">
          <RecentAnomalies />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ServiceCostBreakdown />
        <PipelineStatus />
        <AISummary />
      </div>

      {/* Resource Table */}
      <ResourceTable />
    </div>
  );
};

export default DashboardView;
