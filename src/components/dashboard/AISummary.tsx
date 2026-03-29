const stats = [
  { value: "94%", label: "Accuracy" },
  { value: "$8.9k", label: "Saved" },
  { value: "23", label: "Actions" },
  { value: "12", label: "Zombies" },
];

const AISummary = () => {
  return (
    <div className="glass-card p-8">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#121212] mb-6">
        Automated Intelligence Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/40 p-5 text-center shadow-inner border border-white/50"
          >
            <div className="text-2xl font-heading font-extrabold text-[#121212] tracking-tighter">{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#667066] mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISummary;
