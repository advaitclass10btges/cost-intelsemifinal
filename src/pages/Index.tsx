import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LandingHeader from "@/components/dashboard/LandingHeader";
import LandingView from "@/components/dashboard/LandingView";
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
  const [showDashboard, setShowDashboard] = useState(false);
  const ActiveView = views[activeTab] || DashboardView;

  const handleEnterApp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowDashboard(true);
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-700">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="pb-20"
          >
            <LandingHeader onEnterApp={handleEnterApp} />
            <LandingView onEnterApp={handleEnterApp} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pb-20"
          >
            <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
            
            {/* Alert Ticker with more vertical breathing room */}
            <div className="max-w-[1400px] mx-auto pt-10 px-6 mb-10">
              <AlertTicker />
            </div>

            <main className="px-6 max-w-[1400px] mx-auto">
              <ActiveView />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
