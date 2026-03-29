import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const LandingHeader = ({ onEnterApp }: { onEnterApp: () => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/40 backdrop-blur-md border-b border-black/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9bb096] text-white font-heading font-extrabold text-sm tracking-tighter">
            SS
          </div>
          <span className="font-heading font-extrabold tracking-tight text-[#121212] uppercase text-lg">Sage Stream</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "Intelligence", "Security", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-bold tracking-widest uppercase text-[#667066] hover:text-[#121212] transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <Button 
          onClick={onEnterApp}
          className="bg-[#121212] text-white hover:bg-black rounded-full px-8 py-6 text-[11px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
        >
          Enter Dashboard
        </Button>
      </div>
    </header>
  );
};

export default LandingHeader;
