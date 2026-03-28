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
    <div className="min-h-screen bg-transparent">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-[1400px] mx-auto pt-4 px-6 mb-4">
        <AlertTicker />
      </div>
      <main className="p-6 pt-2 max-w-[1400px] mx-auto pb-20">
        <ActiveView />
      </main>
    </div>
  );
};

export default Index;
