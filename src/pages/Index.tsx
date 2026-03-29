import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AlertTicker from "@/components/dashboard/AlertTicker";
import DashboardView from "@/components/dashboard/DashboardView";
import IntelligenceView from "@/components/dashboard/IntelligenceView";
import OptimizationView from "@/components/dashboard/OptimizationView";
import ExecutionView from "@/components/dashboard/ExecutionView";
import PlatformView from "@/components/dashboard/PlatformView";

const views: Record<string, React.FC> = {
  Dashboard: DashboardView,
  Intelligence: IntelligenceView,
  Optimization: OptimizationView,
  Execution: ExecutionView,
  Platform: PlatformView,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const ActiveView = views[activeTab] || DashboardView;

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Alert Ticker with more vertical breathing room */}
      <div className="max-w-[1400px] mx-auto pt-10 px-6 mb-10">
        <AlertTicker />
      </div>

      <main className="px-6 max-w-[1400px] mx-auto">
        <ActiveView />
      </main>
    </div>
  );
};

export default Index;
