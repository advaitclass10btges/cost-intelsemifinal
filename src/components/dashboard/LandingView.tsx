import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, BarChart3, Cloud, Layers, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Active AWS Accounts", value: "240+" },
  { label: "Monthly Savings Identified", value: "$1.2M+" },
  { label: "Anomaly Detection Accuracy", value: "98.4%" },
  { label: "Autonomous Actions Taken", value: "14.5k" },
];

const features = [
  { title: "Cost Intelligence", desc: "Real-time cost monitoring with millisecond-precision across 200+ AWS services.", icon: BarChart3 },
  { title: "ML Optimization", desc: "Predictive right-sizing recommendations powered by native AWS Compute Optimizer logic.", icon: Zap },
  { title: "Autonomous Execution", desc: "Direct EC2/EBS infrastructure mutations with stop/terminate controls straight from the UI.", icon: Layers },
  { title: "Security First", desc: "Strict proxy architecture prevents AWS Access Key exposure to the client-side.", icon: Shield },
];

const LandingView = ({ onEnterApp }: { onEnterApp: () => void }) => {
  return (
    <div className="pt-32 pb-20 px-6">
      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto text-center mb-32">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#9bb096]/10 text-[#667066] text-[10px] font-bold uppercase tracking-widest mb-6 border border-[#9bb096]/20">
            Real-Time AWS Cost Control
          </span>
          <h1 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter text-[#121212] leading-[0.9] uppercase mb-8">
            Everything in one <br/> 
            <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] [-webkit-text-stroke:1px_#121212]">clear clarified</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#667066] font-medium leading-relaxed mb-10">
            Sage Stream transforms fragmented cloud billing into a high-performance visual dashboard with direct infrastructure execution capabilities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
                onClick={onEnterApp}
                className="bg-[#121212] text-white hover:bg-black rounded-full px-10 py-8 text-[12px] font-extrabold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
            >
              Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
                variant="outline"
                className="bg-white/40 border-black/5 rounded-full px-10 py-8 text-[12px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm"
            >
              Documentation
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Scrolling Ticker (Reference inspired) */}
      <section className="max-w-[1400px] mx-auto mb-32">
        <div className="glass-card py-10 px-6 overflow-hidden relative">
          <div className="flex animate-ticker whitespace-nowrap">
            {[...stats, ...stats, ...stats].map((stat, i) => (
              <div key={i} className="inline-flex items-center mx-16 gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#667066]">{stat.label}</span>
                <span className="text-4xl font-heading font-extrabold text-[#121212] tracking-tighter">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card p-10 group hover:bg-white/70 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-12 w-12 rounded-2xl bg-[#9bb096]/10 text-[#9bb096] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#9bb096] group-hover:text-white transition-all duration-500 shadow-inner">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-heading font-extrabold uppercase tracking-tight text-[#121212] mb-4">{f.title}</h3>
              <p className="text-[13px] leading-relaxed text-[#667066] font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Quote / Testimonial (Reference inspired placeholder) */}
      <section className="max-w-4xl mx-auto my-40 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <blockquote className="text-3xl md:text-5xl font-heading font-extrabold tracking-tighter text-[#121212] leading-[1.1] mb-12">
            "Finally, a cloud intelligence platform that treats cost as a performance metric, not just a line item in a spreadsheet."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#121212]">Sarah Jenkins</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#667066]">Chief Architect @ CloudScale</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="max-w-[1400px] mx-auto">
        <div className="glass-card p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9bb096]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tighter text-[#121212] uppercase mb-8 relative z-10">
            Ready to stabilize your <br/> cloud infrastructure?
          </h2>
          <Button 
              onClick={onEnterApp}
              className="bg-[#121212] text-white hover:bg-black rounded-full px-12 py-10 text-[14px] font-extrabold uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20 relative z-10"
          >
            Launch Sage Stream
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
