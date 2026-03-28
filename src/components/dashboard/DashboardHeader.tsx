import { useState } from "react";
import { Zap, LogOut } from "lucide-react";

const navItems = ["Dashboard", "Intelligence", "Optimization", "Execution", "Platform"];

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            CI
          </div>
          <span className="font-semibold text-foreground">CostIntel</span>
          <span className="text-xs text-muted-foreground font-mono">v2.4.1</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onTabChange(item)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors ${
                activeTab === item
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
