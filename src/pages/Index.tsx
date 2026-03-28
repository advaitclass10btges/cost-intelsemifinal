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
    <div className="min-h-screen bg-background">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <AlertTicker />
      <main className="p-6 max-w-[1440px] mx-auto">
        <ActiveView />
      </main>
    </div>
  );
};

export default Index;
