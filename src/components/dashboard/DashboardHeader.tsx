import { useState, useEffect } from "react";
import { Zap, LogOut } from "lucide-react";

const navItems = ["Dashboard", "Intelligence", "Optimization", "Execution", "Platform"];

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-4 z-50 mx-auto max-w-5xl transition-all duration-300 ${scrolled ? 'px-4' : 'px-6'}`}>
      <div className="glass-card flex items-center justify-between px-6 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary font-heading font-extrabold text-sm tracking-tighter">
            SS
          </div>
          <span className="font-heading font-extrabold tracking-tight text-foreground uppercase text-lg">Sage Stream</span>
        </div>

        <nav className="hidden md:flex items-center gap-1 p-1 bg-black/5 rounded-full">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onTabChange(item)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${
                activeTab === item
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <button className="flex items-center justify-center h-9 w-9 rounded-full bg-black/5 text-muted-foreground hover:bg-black/10 hover:text-foreground transition-all">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
