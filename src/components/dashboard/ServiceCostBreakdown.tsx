import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

const data = [
  { day: "D-6", EC2: 8500, Lambda: 4200, RDS: 2800, S3: 1200 },
  { day: "D-5", EC2: 9200, Lambda: 4800, RDS: 2600, S3: 1400 },
  { day: "D-4", EC2: 8800, Lambda: 5100, RDS: 3000, S3: 1100 },
  { day: "D-3", EC2: 10200, Lambda: 4600, RDS: 2900, S3: 1500 },
  { day: "D-2", EC2: 11500, Lambda: 5400, RDS: 3200, S3: 1300 },
  { day: "D-1", EC2: 12800, Lambda: 5000, RDS: 3100, S3: 1600 },
  { day: "Today", EC2: 14200, Lambda: 5800, RDS: 3400, S3: 1800 },
];

const colors = {
  EC2: "hsl(150, 40%, 35%)",
  Lambda: "hsl(150, 30%, 50%)",
  RDS: "hsl(150, 20%, 60%)",
  S3: "hsl(150, 15%, 72%)",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs text-muted-foreground">
          {entry.name}: <span className="font-mono font-medium text-foreground">${entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const ServiceCostBreakdown = () => {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Service Cost Breakdown</h3>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="square"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
          <Bar dataKey="EC2" stackId="a" fill={colors.EC2} radius={[0, 0, 0, 0]} />
          <Bar dataKey="Lambda" stackId="a" fill={colors.Lambda} />
          <Bar dataKey="RDS" stackId="a" fill={colors.RDS} />
          <Bar dataKey="S3" stackId="a" fill={colors.S3} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceCostBreakdown;
