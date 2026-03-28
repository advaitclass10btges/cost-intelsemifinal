import { DollarSign, Search, Shield, Ghost, Zap, Server, Wind, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCostMonthly, fetchOptSavings, fetchIntelAnomalies, fetchPlatformStatus } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import CostAnalyticsChart from "@/components/dashboard/CostAnalyticsChart";
import RecentAnomalies from "@/components/dashboard/RecentAnomalies";
import ServiceCostBreakdown from "@/components/dashboard/ServiceCostBreakdown";
import PipelineStatus from "@/components/dashboard/PipelineStatus";
import AISummary from "@/components/dashboard/AISummary";
import ResourceTable from "@/components/dashboard/ResourceTable";

const DashboardView = () => {
  const { data: monthlyCost } = useQuery({ queryKey: ['costMnth'], queryFn: fetchCostMonthly, refetchInterval: 60000 });
  const { data: optSavings } = useQuery({ queryKey: ['optSvgs'], queryFn: fetchOptSavings, refetchInterval: 60000 });
  const { data: intelAnomalies } = useQuery({ queryKey: ['intelAnom'], queryFn: fetchIntelAnomalies, refetchInterval: 60000 });
  const { data: platformStat } = useQuery({ queryKey: ['platStat'], queryFn: fetchPlatformStatus, refetchInterval: 60000 });

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="font-heading text-4xl font-extrabold tracking-tighter text-foreground uppercase">Dashboard</h1>
        <p className="text-xs uppercase tracking-widest text-[#667066] mt-1 font-semibold">
          Autonomous FinOps · AWS ONLY · Real-Time
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard 
          label="Monthly Spend" 
          value={monthlyCost ? `$${monthlyCost.total}` : "..."} 
          subtext={`vs last month: $${monthlyCost?.priorTotal || '0'}`} 
          subtextColor="destructive" 
          icon={DollarSign} 
        />
        <StatCard 
          label="Savings Found" 
          value={optSavings ? `$${optSavings.totalWaste?.toFixed(2)}` : "..."} 
          subtext="Total possible savings" 
          subtextColor="success" 
          icon={Search} 
        />
        <StatCard 
          label="Active Anomalies" 
          value={intelAnomalies ? String(intelAnomalies.length) : "..."} 
          subtext="" 
          subtextColor="warning" 
          icon={Shield} 
        />
        <StatCard 
          label="Zombie Resources" 
          value={optSavings ? String(optSavings.ebsZombies?.length || 0) : "..."} 
          subtext={`Waste est: $${optSavings?.totalWaste?.toFixed(2) || '0'}`} 
          subtextColor="destructive" 
          icon={Ghost} 
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="AI Actions Today" value="0" subtext="No automation enabled" icon={Zap} />
        <StatCard 
          label="Resources Monitored" 
          value={platformStat ? String(platformStat.totalResources) : "..."} 
          subtext="Live AWS Resources" 
          icon={Server} 
        />
        <StatCard label="CO₂e Today" value="N/A" subtext="Not tracked" subtextColor="destructive" icon={Wind} />
        <StatCard label="Confidence Score" value="85%" subtext="Heuristic match" icon={BarChart3} />
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
