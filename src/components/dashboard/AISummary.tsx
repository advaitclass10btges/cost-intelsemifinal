const stats = [
  { value: "94%", label: "Accuracy" },
  { value: "$8.9k", label: "Saved" },
  { value: "23", label: "Actions" },
  { value: "12", label: "Zombies" },
];

const AISummary = () => {
  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
        Automated Intelligence Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-lg bg-muted/50 p-4 text-center"
          >
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISummary;
